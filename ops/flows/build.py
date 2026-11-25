import json, uuid, zipfile, datetime

SITE = "https://mediawisesolutions667-my.sharepoint.com/personal/mitch_mediawisesolutions_au"
LIST = "Mediawise Pipeline"
ME = "mitch@mediawisesolutions.au"
BOOK = "https://outlook.office.com/bookwithme/user/4a69841c8fbc4250b52e5adc7d888f46@mediawisesolutions.au?anonymous"
SP, TM, OL = "shared_sharepointonline", "shared_teams", "shared_office365"
NAMES = {SP: "SharePoint", TM: "Microsoft Teams", OL: "Office 365 Outlook"}
TZ = "E. Australia Standard Time"
M = "outputs('Column_map')"

def col(item, title):
    return f"{item}?[coalesce({M}?['{title}'],'__none__')]"

def conn(api, op, params, after):
    return {"type": "OpenApiConnection", "runAfter": after, "inputs": {"host": {"connectionName": api, "operationId": op, "apiId": f"/providers/Microsoft.PowerApps/apis/{api}"}, "parameters": params, "authentication": "@parameters('$authentication')"}}

def sp_get(uri, after):
    return conn(SP, "HttpRequest", {"dataset": SITE, "parameters/method": "GET", "parameters/uri": uri, "parameters/headers": {"Accept": "application/json;odata=nometadata"}}, after)

def sp_update(id_expr, body_expr, after):
    return conn(SP, "HttpRequest", {"dataset": SITE, "parameters/method": "POST", "parameters/uri": f"_api/web/lists/getbytitle('{LIST}')/items(@{{{id_expr}}})", "parameters/headers": {"Accept": "application/json;odata=nometadata", "Content-Type": "application/json;odata=nometadata", "IF-MATCH": "*", "X-HTTP-Method": "MERGE"}, "parameters/body": body_expr}, after)

def email(to, subject, body, after):
    return conn(OL, "SendEmailV2", {"emailMessage/To": to, "emailMessage/Subject": subject, "emailMessage/Body": body, "emailMessage/Importance": "Normal"}, after)

def teams(body, after):
    return conn(TM, "PostMessageToConversation", {"poster": "Flow bot", "location": "Chat with Flow bot", "body/recipient": ME, "body/messageBody": body}, after)

def column_map_actions(after):
    """Reads the list's columns so flows can use display names, whatever the internal names are."""
    return {
        "Get_list_columns": sp_get(f"_api/web/lists/getbytitle('{LIST}')/fields?$filter=Hidden eq false and ReadOnlyField eq false&$select=Title,InternalName,TypeAsString", after),
        "Select_title_to_internal_name": {"type": "Select", "runAfter": {"Get_list_columns": ["Succeeded"]}, "inputs": {"from": "@body('Get_list_columns')?['value']", "select": "@concat('\"',item()?['Title'],'\":\"',item()?['InternalName'],'\"')"}},
        "Column_map": {"type": "Compose", "runAfter": {"Select_title_to_internal_name": ["Succeeded"]}, "inputs": "@json(concat('{',join(body('Select_title_to_internal_name'),','),'}'))"},
        "Get_pipeline_items": sp_get(f"_api/web/lists/getbytitle('{LIST}')/items?$top=5000", {"Column_map": ["Succeeded"]}),
    }

def safe_fields(prefix, pairs, after):
    """Returns (actions, body_expr). Writes only to columns that exist on the list, matched by display name."""
    vals = "json('{}')"
    for title, val in pairs:
        vals = f"setProperty({vals},'{title}',{val})"
    v, f, sel = f"{prefix}_values", f"{prefix}_columns_found", f"{prefix}_pairs"
    enc = f"string(createArray(outputs('{v}')?[item()?['Title']]))"
    acts = {
        v: {"type": "Compose", "runAfter": after, "inputs": "@" + vals},
        f: {"type": "Query", "runAfter": {v: ["Succeeded"]}, "inputs": {"from": "@body('Get_list_columns')?['value']", "where": f"@and(contains(outputs('{v}'),item()?['Title']),not(contains(createArray('Number','Currency'),item()?['TypeAsString'])))"}},
        sel: {"type": "Select", "runAfter": {f: ["Succeeded"]}, "inputs": {"from": f"@body('{f}')", "select": f"@concat('\"',item()?['InternalName'],'\":',substring({enc},1,sub(length({enc}),2)))"}},
    }
    return acts, sel, f"@json(concat('{{',join(body('{sel}'),','),'}}'))"

def sp_update_safe(prefix, id_expr, pairs, after):
    acts, last, body = safe_fields(prefix, pairs, after)
    acts[prefix + "_save"] = sp_update(id_expr, body, {last: ["Succeeded"]})
    return acts

def package(fname, disp, desc, trigger, actions, apis_used):
    definition = {"$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#", "contentVersion": "1.0.0.0",
                  "parameters": {"$connections": {"defaultValue": {}, "type": "Object"}, "$authentication": {"defaultValue": {}, "type": "SecureObject"}},
                  "triggers": trigger, "actions": actions, "outputs": {}}
    flow = str(uuid.uuid4()); apis = {}; conns = {}; res = {}
    for api in apis_used:
        a = str(uuid.uuid4()); c = str(uuid.uuid4()); apis[api] = a; conns[api] = c
        res[a] = {"id": f"/providers/Microsoft.PowerApps/apis/{api}", "name": api, "type": "Microsoft.PowerApps/apis", "suggestedCreationType": "Existing", "details": {"displayName": NAMES[api], "iconUri": ""}, "configurableBy": "System", "hierarchy": "Child", "dependsOn": []}
        res[c] = {"type": "Microsoft.PowerApps/apis/connections", "suggestedCreationType": "Existing", "creationType": "Existing", "details": {"displayName": NAMES[api], "iconUri": ""}, "configurableBy": "User", "hierarchy": "Child", "dependsOn": [a]}
    res = {flow: {"type": "Microsoft.Flow/flows", "suggestedCreationType": "New", "creationType": "Existing, New, Update", "details": {"displayName": disp}, "configurableBy": "User", "hierarchy": "Root", "dependsOn": list(apis.values()) + list(conns.values())}, **res}
    manifest = {"schema": "1.0", "details": {"displayName": disp, "description": desc, "createdTime": datetime.datetime.utcnow().isoformat() + "Z", "packageTelemetryId": str(uuid.uuid4()), "creator": "Mediawise Solutions", "sourceEnvironment": ""}, "resources": res}
    fdef = {"name": flow, "id": f"/providers/Microsoft.Flow/flows/{flow}", "type": "Microsoft.Flow/flows", "properties": {"apiId": "/providers/Microsoft.PowerApps/apis/shared_logicflows", "displayName": disp, "definition": definition, "connectionReferences": {api: {"connectionName": f"shared-{api.split('_')[1]}-{uuid.uuid4()}", "source": "Invoker", "id": f"/providers/Microsoft.PowerApps/apis/{api}", "tier": "NotSpecified"} for api in apis_used}, "flowFailureAlertSubscribed": False}}
    with zipfile.ZipFile(f"/home/claude/flows/{fname}", "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("manifest.json", json.dumps(manifest, indent=1))
        z.writestr("Microsoft.Flow/flows/manifest.json", json.dumps({"packageSchemaVersion": "1.0", "flowAssets": {"assetPaths": [flow]}}))
        z.writestr(f"Microsoft.Flow/flows/{flow}/definition.json", json.dumps(fdef, indent=1))
        z.writestr(f"Microsoft.Flow/flows/{flow}/apisMap.json", json.dumps(apis))
        z.writestr(f"Microsoft.Flow/flows/{flow}/connectionsMap.json", json.dumps(conns))
    # sanity: every expression's parentheses balance
    txt = json.dumps(definition)
    assert txt.count("(") == txt.count(")"), fname
    print("built", fname)

SIG = "<p>Cheers,<br>Mitch Harris<br>Mediawise Solutions<br>0409 265 711</p>"


# ---------------- F1 New lead ----------------
J = "outputs('Parse_Jotform_submission')"
def g(key):
    n = key.split("_")[0]
    return f"coalesce({J}?['{key}'],{J}?['{n}_{key}'])"
biz = f"{g('q2_textbox0')}"
TD = "replace(replace(replace(replace(replace(string(coalesce(" + g('q7_checkbox5') + """,'')),'","','; '),'["',''),'"]',''),'[]',''),'{}','')"""
f1_pairs = [
    ("Title", biz), ("Business name", biz),
    ("Contact name", f"concat({g('q3_fullname1')}?['first'],' ',{g('q3_fullname1')}?['last'])"),
    ("Email", f"{g('q5_email3')}"),
    ("Mobile", f"{g('q4_phone2')}?['full']"),
    ("Industry", f"{g('q6_dropdown4')}"),
    ("Source", f"if(or(empty({g('q9_textbox7')}),equals({g('q9_textbox7')},'?')),'Website',{g('q9_textbox7')})"),
    ("Campaign", f"coalesce({g('q10_textbox8')},'')"),
    ("Biggest time drain", TD),
    ("Stage", "'Contacted'"),
    ("Next action date", "formatDateTime(addDays(utcNow(),1),'yyyy-MM-dd')"),
    ("Notes", f"concat('Ad: ',coalesce({g('q11_textbox9')},''),'. Note: ',coalesce({g('q8_textarea6')},''))"),
]
expected = [t for t, _ in f1_pairs if t not in ("Title", "Business name")]
f1_actions = {
    "Raw_request": {"type": "Compose", "runAfter": {}, "inputs": "@coalesce(triggerFormDataValue('rawRequest'),'{}')"},
    "Parse_Jotform_submission": {"type": "Compose", "runAfter": {"Raw_request": ["Succeeded"]},
        "inputs": "@if(startsWith(trim(string(outputs('Raw_request'))),'\"'),json(json(string(outputs('Raw_request')))),json(string(outputs('Raw_request'))))"},
}
cm = column_map_actions({"Parse_Jotform_submission": ["Succeeded"]})
cm.pop("Get_pipeline_items")
f1_actions.update(cm)
fa, last, body = safe_fields("Lead", f1_pairs, {"Column_map": ["Succeeded"]})
f1_actions.update(fa)
f1_actions["Create_pipeline_item"] = conn(SP, "HttpRequest", {"dataset": SITE, "parameters/method": "POST", "parameters/uri": f"_api/web/lists/getbytitle('{LIST}')/items", "parameters/headers": {"Accept": "application/json;odata=nometadata", "Content-Type": "application/json;odata=nometadata"}, "parameters/body": body}, {last: ["Succeeded"]})
f1_actions["Columns_not_found"] = {"type": "Query", "runAfter": {"Create_pipeline_item": ["Succeeded"]}, "inputs": {"from": "@createArray(" + ",".join(f"'{t}'" for t in expected) + ")", "where": f"@empty({M}?[item()])"}}
f1_actions["Alert_Mitch_in_Teams"] = teams(
    f"<p><b>New lead: @{{{biz}}}</b></p><p>@{{{g('q3_fullname1')}?['first']}} @{{{g('q3_fullname1')}?['last']}} | @{{{g('q4_phone2')}?['full']}} | @{{{g('q5_email3')}}}</p>"
    f"<p>Industry: @{{{g('q6_dropdown4')}}}<br>Time drain: @{{{TD}}}<br>Note: @{{{g('q8_textarea6')}}}<br>Ad: @{{{g('q11_textbox9')}}}</p>"
    "<p>Added to the pipeline as Contacted.</p>"
    "@{if(empty(body('Columns_not_found')),'',concat('<p><b>Fix your list:</b> these columns were not found, so they were skipped: ',join(body('Columns_not_found'),', '),'</p>'))}",
    {"Columns_not_found": ["Succeeded"]})
f1_actions["If_answers_came_through_blank"] = {"type": "If", "runAfter": {"Alert_Mitch_in_Teams": ["Succeeded", "Failed"]},
    "expression": {"equals": [f"@empty({biz})", True]},
    "actions": {"Email_Mitch_the_raw_data": email(ME, "F1 check: raw enquiry data",
        "<p>F1 couldn't read the form answers. This is what Jotform sent, for Claude to look at.</p><p><b>rawRequest:</b></p><pre>@{outputs('Raw_request')}</pre><p><b>Full request:</b></p><pre>@{string(triggerBody())}</pre><p><b>Form fields:</b></p><pre>@{string(triggerOutputs()?['body']?['$multipart'])}</pre>", {})},
    "else": {"actions": {}}}
package("F1_Mediawise_New_lead.zip", "F1 Mediawise New lead", "Jotform enquiry to Mediawise Pipeline list and Teams alert",
        {"manual": {"type": "Request", "kind": "Http", "inputs": {"method": "POST"}}}, f1_actions, [SP, TM, OL])

# ---------------- F2 Lead nudge ----------------
I = "items('For_each_lead')"
first = f"first(split(coalesce({col(I,'Contact name')},'there'),' '))"
days = f"div(sub(ticks(utcNow()),ticks({I}?['Created'])),864000000000)"
f2_emails = {
    "1": ("Quick follow up from Mitch",
          f"<p>Hi @{{{first}}},</p><p>Thanks again for reaching out yesterday. If it's easier to talk it through than type it out, grab a 20 minute slot here and we'll look at where the time is going:</p><p><a href=\"{BOOK}\">Book a 20 minute chat</a></p><p>No slides, no hard sell.</p>{SIG}"),
    "3": ("Still keen to help",
          f"<p>Hi @{{{first}}},</p><p>Just checking this didn't get buried. Most owners I talk to have one or two jobs that eat hours every week, and they're usually quicker to fix than people expect.</p><p>If you want a straight answer on whether I can help, <a href=\"{BOOK}\">pick a time here</a>, or just reply to this email.</p>{SIG}"),
    "7": ("Last one from me",
          f"<p>Hi @{{{first}}},</p><p>I won't keep filling your inbox. If the timing isn't right, no worries at all.</p><p>Whenever you're ready, the <a href=\"{BOOK}\">booking link</a> is here, or reply and I'll get back to you.</p>{SIG}"),
}
cases = {}
for d, (subj, body) in f2_emails.items():
    acts = {"Send_day_" + d: email(f"@{{{col(I,'Email')}}}", subj, body, {})}
    if d == "7":
        acts.update(sp_update_safe("Nurture", f"{I}?['ID']", [("Stage", "'Nurture'"), ("Next action date", "formatDateTime(addDays(utcNow(),30),'yyyy-MM-dd')")], {"Send_day_7": ["Succeeded"]}))
    cases["Day_" + d] = {"case": int(d), "actions": acts}
f2_actions = column_map_actions({})
f2_actions["Contacted_leads_not_booked"] = {"type": "Query", "runAfter": {"Get_pipeline_items": ["Succeeded"]}, "inputs": {"from": "@body('Get_pipeline_items')?['value']", "where": f"@and(equals(item()?[coalesce({M}?['Stage'],'__none__')],'Contacted'),empty(item()?[coalesce({M}?['Discovery date'],'__none__')]),not(empty(item()?[coalesce({M}?['Email'],'__none__')])))"}}
f2_actions["For_each_lead"] = {"type": "Foreach", "foreach": "@body('Contacted_leads_not_booked')", "runAfter": {"Contacted_leads_not_booked": ["Succeeded"]},
    "actions": {"Days_since_enquiry": {"type": "Switch", "expression": f"@{days}", "cases": cases, "default": {"actions": {}}, "runAfter": {}}}}
package("F2_Mediawise_Lead_nudge.zip", "F2 Mediawise Lead nudge", "Daily follow up emails for leads who haven't booked a discovery call",
        {"Recurrence": {"type": "Recurrence", "recurrence": {"frequency": "Day", "interval": 1, "schedule": {"hours": ["8"], "minutes": [0]}, "timeZone": TZ}}},
        f2_actions, [SP, OL])

# ---------------- F3 Discovery booked ----------------
T = "triggerOutputs()?['body']"
L3 = "first(body('Find_matching_lead'))"
f3_actions = column_map_actions({})
f3_actions["Find_matching_lead"] = {"type": "Query", "runAfter": {"Get_pipeline_items": ["Succeeded"]}, "inputs": {"from": "@body('Get_pipeline_items')?['value']",
    "where": f"@and(not(empty(item()?[coalesce({M}?['Email'],'__none__')])),contains(toLower(concat({T}?['requiredAttendees'],';',{T}?['optionalAttendees'],';',{T}?['body'])),toLower(item()?[coalesce({M}?['Email'],'__none__')])),contains(createArray('New lead','Contacted','Nurture'),item()?[coalesce({M}?['Stage'],'__none__')]))"}}
lead_first = f"first(split(coalesce({L3}?[coalesce({M}?['Contact name'],'__none__')],'there'),' '))"
f3_actions["If_a_lead_booked"] = {"type": "If", "runAfter": {"Find_matching_lead": ["Succeeded"]},
    "expression": {"greater": ["@length(body('Find_matching_lead'))", 0]},
    "actions": {
        **sp_update_safe("Booked", f"{L3}?['ID']", [("Stage", "'Discovery booked'"), ("Discovery date", f"concat({T}?['start'],'Z')"), ("Next action date", f"formatDateTime({T}?['start'],'yyyy-MM-dd')")], {}),
        "Send_prep_email": email(f"@{{{L3}?[coalesce({M}?['Email'],'__none__')]}}", "Before our chat",
            f"<p>Hi @{{{lead_first}}},</p><p>Looking forward to our chat on @{{formatDateTime(convertFromUtc(concat({T}?['start'],'Z'),'{TZ}'),'dddd d MMMM')}} at @{{formatDateTime(convertFromUtc(concat({T}?['start'],'Z'),'{TZ}'),'h:mm tt')}}.</p><p>If you've got a minute beforehand, have a think about these three. No need to write anything down:</p><ol><li>What's the one job that eats the most hours in your week?</li><li>Roughly how many enquiries or jobs come through in a normal week?</li><li>Which systems do you run on now, for example Microsoft 365, Xero or a job system?</li></ol><p>That's it. See you then.</p>{SIG}",
            {"Booked_save": ["Succeeded"]}),
        "Wait_until_30_minutes_before": {"type": "Wait", "runAfter": {"Send_prep_email": ["Succeeded"]}, "inputs": {"until": {"timestamp": f"@{{addMinutes(concat({T}?['start'],'Z'),-30)}}"}}},
        "Remind_Mitch_in_Teams": teams(
            f"<p><b>Discovery call in 30 minutes: @{{{L3}?['Title']}}</b></p><p>@{{{L3}?[coalesce({M}?['Contact name'],'__none__')]}} | @{{{L3}?[coalesce({M}?['Mobile'],'__none__')]}} | @{{{L3}?[coalesce({M}?['Email'],'__none__')]}}</p><p>Industry: @{{{L3}?[coalesce({M}?['Industry'],'__none__')]}}<br>Biggest time drain: @{{{L3}?[coalesce({M}?['Biggest time drain'],'__none__')]}}<br>Source: @{{{L3}?[coalesce({M}?['Source'],'__none__')]}} @{{{L3}?[coalesce({M}?['Campaign'],'__none__')]}}<br>Notes: @{{{L3}?[coalesce({M}?['Notes'],'__none__')]}}</p>",
            {"Wait_until_30_minutes_before": ["Succeeded"]}),
    }, "else": {"actions": {}}}
package("F3_Mediawise_Discovery_booked.zip", "F3 Mediawise Discovery booked", "When a lead books a call: update the pipeline, send a prep email, remind Mitch 30 minutes before",
        {"When_a_new_event_is_created": {"type": "OpenApiConnection", "recurrence": {"frequency": "Minute", "interval": 3},
            "inputs": {"host": {"connectionName": OL, "operationId": "CalendarGetOnNewItemsV3", "apiId": f"/providers/Microsoft.PowerApps/apis/{OL}"}, "parameters": {"table": "Calendar"}, "authentication": "@parameters('$authentication')"}}},
        f3_actions, [SP, OL, TM])

# ---------------- F10 Monday numbers ----------------
V = "body('Get_pipeline_items')?['value']"
week_ago = "addDays(utcNow(),-7)"
f10 = column_map_actions({})
q = lambda name, where, after: {name: {"type": "Query", "runAfter": {after: ["Succeeded"]}, "inputs": {"from": f"@{V}", "where": "@" + where}}}
f10.update(q("New_leads_this_week", f"greaterOrEquals(item()?['Created'],{week_ago})", "Get_pipeline_items"))
f10.update(q("Calls_coming_up", f"and(not(empty(item()?[coalesce({M}?['Discovery date'],'__none__')])),greaterOrEquals(coalesce(item()?[coalesce({M}?['Discovery date'],'__none__')],'1900-01-01'),utcNow()),lessOrEquals(coalesce(item()?[coalesce({M}?['Discovery date'],'__none__')],'9999-12-31'),addDays(utcNow(),7)))", "New_leads_this_week"))
f10.update(q("Proposals_out", f"equals(item()?[coalesce({M}?['Stage'],'__none__')],'Proposal sent')", "Calls_coming_up"))
f10.update(q("Active_projects", f"contains(createArray('Won','Onboarding','Build'),item()?[coalesce({M}?['Stage'],'__none__')])", "Proposals_out"))
f10.update(q("Care_plans", f"equals(item()?[coalesce({M}?['Stage'],'__none__')],'Care plan')", "Active_projects"))
f10.update(q("Overdue_next_actions", f"and(not(empty(item()?[coalesce({M}?['Next action date'],'__none__')])),less(coalesce(item()?[coalesce({M}?['Next action date'],'__none__')],'9999-12-31'),utcNow()),not(contains(createArray('Lost','Live','Care plan'),item()?[coalesce({M}?['Stage'],'__none__')])))", "Care_plans"))
for src, field, colname in [("Proposals_out", "proposals", "Proposal value ex GST"), ("Care_plans", "careplans", "Care plan per month ex GST")]:
    prev = list(f10.keys())[-1]
    f10[f"Sum_{field}_values"] = {"type": "Select", "runAfter": {prev: ["Succeeded"]}, "inputs": {"from": f"@body('{src}')", "select": f"@string(coalesce(item()?[coalesce({M}?['{colname}'],'__none__')],0))"}}
    f10[f"Total_{field}"] = {"type": "Compose", "runAfter": {f"Sum_{field}_values": ["Succeeded"]}, "inputs": f"@xpath(xml(json(concat('{{\"r\":{{\"v\":[',join(body('Sum_{field}_values'),','),if(empty(body('Sum_{field}_values')),'0',',0'),']}}}}'))),'sum(/r/v)')"}
f10["Leads_table"] = {"type": "Select", "runAfter": {"Total_careplans": ["Succeeded"]}, "inputs": {"from": "@body('New_leads_this_week')", "select": {"Business": "@item()?['Title']", "Source": f"@item()?[coalesce({M}?['Source'],'__none__')]", "Campaign": f"@item()?[coalesce({M}?['Campaign'],'__none__')]", "Stage": f"@item()?[coalesce({M}?['Stage'],'__none__')]"}}}
f10["Leads_HTML"] = {"type": "Table", "runAfter": {"Leads_table": ["Succeeded"]}, "inputs": {"from": "@body('Leads_table')", "format": "HTML"}}
f10["Overdue_table"] = {"type": "Select", "runAfter": {"Leads_HTML": ["Succeeded"]}, "inputs": {"from": "@body('Overdue_next_actions')", "select": {"Business": "@item()?['Title']", "Stage": f"@item()?[coalesce({M}?['Stage'],'__none__')]", "Was due": f"@formatDateTime(item()?[coalesce({M}?['Next action date'],'__none__')],'d MMM')"}}}
f10["Overdue_HTML"] = {"type": "Table", "runAfter": {"Overdue_table": ["Succeeded"]}, "inputs": {"from": "@body('Overdue_table')", "format": "HTML"}}
aud = lambda x: f"formatNumber(float({x}),'C0','en-AU')"
f10["Email_Mitch"] = email(ME, "Mediawise Monday numbers: @{formatDateTime(convertFromUtc(utcNow(),'%s'),'d MMM')}" % TZ,
    "<h2 style=\"font-family:Georgia,serif;font-weight:400\">Monday numbers</h2>"
    "<table cellpadding=\"6\" style=\"border-collapse:collapse;font-family:Segoe UI,Arial,sans-serif\">"
    "<tr><td>New leads, last 7 days</td><td><b>@{length(body('New_leads_this_week'))}</b></td></tr>"
    "<tr><td>Discovery calls, next 7 days</td><td><b>@{length(body('Calls_coming_up'))}</b></td></tr>"
    "<tr><td>Proposals out</td><td><b>@{length(body('Proposals_out'))}</b>, worth @{" + aud("outputs('Total_proposals')") + "} ex GST</td></tr>"
    "<tr><td>Active projects (Won to Build)</td><td><b>@{length(body('Active_projects'))}</b></td></tr>"
    "<tr><td>Care plans</td><td><b>@{length(body('Care_plans'))}</b>, @{" + aud("outputs('Total_careplans')") + "} a month ex GST</td></tr>"
    "</table>"
    "<h3 style=\"font-family:Georgia,serif;font-weight:400\">New leads by source</h3>@{body('Leads_HTML')}"
    "<h3 style=\"font-family:Georgia,serif;font-weight:400\">Overdue next actions</h3>@{if(empty(body('Overdue_next_actions')),'<p>Nothing overdue.</p>',body('Overdue_HTML'))}"
    "<p style=\"color:#666\">Cash received will be added once the Xero connector is set up.</p>",
    {"Overdue_HTML": ["Succeeded"]})
package("F10_Mediawise_Monday_numbers.zip", "F10 Mediawise Monday numbers", "Monday 7am email with the pipeline numbers",
        {"Recurrence": {"type": "Recurrence", "recurrence": {"frequency": "Week", "interval": 1, "schedule": {"weekDays": ["Monday"], "hours": ["7"], "minutes": [0]}, "timeZone": TZ}}},
        f10, [SP, OL])

# ---------------- shared bits for F6 and F9 ----------------
LIB = "/personal/mitch_mediawisesolutions_au/Documents"
NL = "decodeUriComponent('%0A')"
TEMPLATE = "/Documents/Templates/Mediawise Results Report Template.docx"
REVIEW = ""  # Google review link, added once Mitch supplies it
def clean(x):
    e = f"coalesce({x},'Unnamed client')"
    for ch in ["/", "\\", ":", "*", "?", '"', "<", ">", "|", "#", "%"]:
        e = f"replace({e},'{ch}',' ')"
    return f"trim({e})"
def sp_create_file(folder_expr, name_expr, body_expr, after):
    return conn(SP, "CreateFile", {"dataset": SITE, "folderPath": folder_expr, "name": name_expr, "body": body_expr}, after)
def sp_get_file(path_expr, after):
    return conn(SP, "GetFileContentByPath", {"dataset": SITE, "path": path_expr, "inferContentType": True}, after)
def sp_create_item(body_expr, after):
    return conn(SP, "HttpRequest", {"dataset": SITE, "parameters/method": "POST", "parameters/uri": f"_api/web/lists/getbytitle('{LIST}')/items", "parameters/headers": {"Accept": "application/json;odata=nometadata", "Content-Type": "application/json;odata=nometadata"}, "parameters/body": body_expr}, after)

# ---------------- F6 Onboarding received ----------------
def G(qid, name):
    """Jotform rawRequest key, whichever way it arrives."""
    return f"coalesce({J}?['q{qid}_{name}'],{J}?['q{qid}_q{qid}_{name}'],{J}?['{name}'])"
def arr(x):
    return f"if(empty({x}),json('[]'),json(if(startsWith(trim(string({x})),'['),string({x}),concat('[\"',string({x}),'\"]'))))"
B6 = G(3, "textbox1")
CN = G(4, "fullname2")
EM = G(5, "email3")
PH = G(6, "phone4")
ALERTS, USED, SYSNAMES, ACCESS, NOACCESS, HOURS, REPLY, NUMS = G(7, "textarea5"), G(9, "checkbox7"), G(10, "textbox8"), G(12, "checkbox10"), G(13, "textarea11"), G(15, "textbox13"), G(16, "dropdown14"), G(17, "textarea15")
KO = G(22, "preferredKickoff")
pad = lambda v: f"substring(concat('0',string({v})),sub(length(concat('0',string({v}))),2),2)"
KO_DATE = f"if(empty({KO}?['year']),'',concat({KO}?['year'],'-',{pad(KO + '?[' + chr(39) + 'month' + chr(39) + ']')},'-',{pad(KO + '?[' + chr(39) + 'day' + chr(39) + ']')}))"
KO_TEXT = f"if(empty({KO}?['year']),'not given',concat({KO}?['day'],'/',{KO}?['month'],'/',{KO}?['year'],' ',coalesce({KO}?['timeInput'],concat({KO}?['hour'],':',{KO}?['min'])),' ',coalesce({KO}?['ampm'],'')))"
FOLDER = f"concat('/Documents/Clients/',outputs('Client_name'))"
FOLDER_URL = f"concat('{SITE}/Documents/Clients/',encodeUriComponent(outputs('Client_name')))"
MATCH = "first(body('Find_client_row'))"
STR = lambda x: f"replace(replace(replace(replace(string(coalesce({x},'')),'\",\"','; '),'[\"',''),'\"]',''),'[]','')"

f6 = {
    "Raw_request": {"type": "Compose", "runAfter": {}, "inputs": "@coalesce(triggerFormDataValue('rawRequest'),'{}')"},
    "Parse_Jotform_submission": {"type": "Compose", "runAfter": {"Raw_request": ["Succeeded"]},
        "inputs": "@if(startsWith(trim(string(outputs('Raw_request'))),'\"'),json(json(string(outputs('Raw_request')))),json(string(outputs('Raw_request'))))"},
}
f6["Client_name"] = {"type": "Compose", "runAfter": {"Parse_Jotform_submission": ["Succeeded"]}, "inputs": "@" + clean(B6)}
f6.update(column_map_actions({"Client_name": ["Succeeded"]}))
f6["Find_client_row"] = {"type": "Query", "runAfter": {"Get_pipeline_items": ["Succeeded"]}, "inputs": {"from": "@body('Get_pipeline_items')?['value']",
    "where": f"@and(not(equals(item()?[coalesce({M}?['Stage'],'__none__')],'Lost')),or(and(not(empty({EM})),equals(toLower(trim(coalesce(item()?[coalesce({M}?['Email'],'__none__')],''))),toLower(trim(coalesce({EM},''))))),equals(toLower(trim(coalesce(item()?['Title'],''))),toLower(trim(coalesce({B6},''))))))"}}
f6["Missing_access"] = {"type": "Query", "runAfter": {"Find_client_row": ["Succeeded"]}, "inputs": {"from": "@" + arr(USED), "where": f"@not(contains({arr(ACCESS)},item()))"}}
f6["Access_gaps"] = {"type": "Compose", "runAfter": {"Missing_access": ["Succeeded"]}, "inputs": f"@or(greater(length(body('Missing_access')),0),not(empty(trim(coalesce({NOACCESS},'')))))"}
answers_html = (f"<h2>Onboarding: @{{{B6}}}</h2><p>Received @{{formatDateTime(convertFromUtc(utcNow(),'{TZ}'),'d MMM yyyy h:mm tt')}}</p>"
    f"<p><b>Main contact:</b> @{{{CN}?['first']}} @{{{CN}?['last']}}, @{{{EM}}}, @{{{PH}?['full']}}</p>"
    f"<p><b>Alerts go to:</b> @{{{ALERTS}}}</p><p><b>Systems used:</b> @{{{STR(USED)}}}<br><b>System names:</b> @{{{SYSNAMES}}}</p>"
    f"<p><b>Access given on:</b> @{{{STR(ACCESS)}}}<br><b>Couldn't give access to:</b> @{{{NOACCESS}}}</p>"
    f"<p><b>Business hours:</b> @{{{HOURS}}}<br><b>Reply expected:</b> @{{{REPLY}}}</p><p><b>Numbers they know:</b> @{{{NUMS}}}</p>"
    f"<p><b>Preferred kickoff:</b> @{{{KO_TEXT}}}</p>")
f6["Save_answers_to_client_folder"] = sp_create_file("@" + FOLDER, "Onboarding answers.html", answers_html, {"Access_gaps": ["Succeeded"]})
UP = "items('For_each_upload')"
f6["Uploads"] = {"type": "Compose", "runAfter": {"Save_answers_to_client_folder": ["Succeeded", "Failed"]}, "inputs": "@" + arr(f"coalesce({G(20, 'logoCurrent')},{J}?['temp_upload']?['q20_logoCurrent'])")}
f6["Links_not_saved"] = {"type": "InitializeVariable", "runAfter": {"Uploads": ["Succeeded", "Failed"]}, "inputs": {"variables": [{"name": "LinksNotSaved", "type": "string", "value": ""}]}}
f6["For_each_upload"] = {"type": "Foreach", "foreach": "@outputs('Uploads')", "runAfter": {"Links_not_saved": ["Succeeded"]}, "actions": {
    "Download_file": {"type": "Http", "runAfter": {}, "inputs": {"method": "GET", "uri": f"@{UP}"}},
    "If_it_is_a_real_file": {"type": "If", "runAfter": {"Download_file": ["Succeeded", "Failed"]},
        "expression": {"and": [{"equals": ["@outputs('Download_file')?['statusCode']", 200]}, {"not": {"contains": ["@toLower(string(outputs('Download_file')?['headers']?['Content-Type']))", "text/html"]}}]},
        "actions": {"Save_upload": sp_create_file("@" + FOLDER, f"@{{decodeUriComponent(last(split({UP},'/')))}}", "@body('Download_file')", {})},
        "else": {"actions": {"Keep_the_link": {"type": "AppendToStringVariable", "runAfter": {}, "inputs": {"name": "LinksNotSaved", "value": f"<li><a href=\"@{{{UP}}}\">@{{decodeUriComponent(last(split({UP},'/')))}}</a></li>"}}}}},
}}
notes6 = (f"concat(coalesce({MATCH}?[coalesce({M}?['Notes'],'__none__')],''),if(empty({MATCH}),'',concat({NL},{NL})),"
          f"'Onboarding received ',formatDateTime(convertFromUtc(utcNow(),'{TZ}'),'d MMM'),'. Alerts to: ',coalesce({ALERTS},''),'. Hours: ',coalesce({HOURS},''),"
          f"'. Reply expected: ',coalesce({REPLY},''),'. Systems: ',{STR(SYSNAMES)},'. Kickoff wanted: ',{KO_TEXT},'. Folder: ',{FOLDER_URL})")
pairs6 = [("Stage", "'Onboarding'"), ("Kickoff date", f"if(empty({KO_DATE}),null,{KO_DATE})"), ("Baseline", f"coalesce({NUMS},'')"),
          ("Next action date", f"formatDateTime(addDays(utcNow(),if(outputs('Access_gaps'),3,1)),'yyyy-MM-dd')"), ("Client folder", FOLDER_URL), ("Notes", notes6)]
new_pairs6 = [("Title", B6), ("Contact name", f"concat({CN}?['first'],' ',{CN}?['last'])"), ("Email", EM), ("Mobile", f"{PH}?['full']")] + pairs6
upd_acts, upd_last, upd_body = safe_fields("Onboard", pairs6, {})
new_acts, new_last, new_body = safe_fields("NewClient", new_pairs6, {})
upd_acts["Update_client_row"] = sp_update(f"{MATCH}?['ID']", upd_body, {upd_last: ["Succeeded"]})
new_acts["Create_client_row"] = sp_create_item(new_body, {new_last: ["Succeeded"]})
f6["If_client_is_in_the_pipeline"] = {"type": "If", "runAfter": {"For_each_upload": ["Succeeded", "Failed", "Skipped"]}, "expression": {"greater": ["@length(body('Find_client_row'))", 0]},
    "actions": upd_acts, "else": {"actions": new_acts}}
first6 = f"coalesce({CN}?['first'],'there')"
f6["If_access_is_missing"] = {"type": "If", "runAfter": {"If_client_is_in_the_pipeline": ["Succeeded", "Failed"]}, "expression": {"equals": ["@outputs('Access_gaps')", True]},
    "actions": {"Email_client_the_access_list": email(f"@{{{EM}}}", "One thing before we kick off",
        f"<p>Hi @{{{first6}}},</p><p>Thanks for filling in the onboarding form. That's most of the setup done.</p>"
        f"<p>To get started I still need access to:</p><ul>@{{join(body('Missing_access_list'),'')}}</ul>"
        f"@{{if(empty(trim(coalesce({NOACCESS},''))),'',concat('<p>You mentioned: ',{NOACCESS},'. Happy to talk that through on a quick call if it helps.</p>'))}}"
        f"<p>Invite <b>{ME}</b> as a user on each one, then reply to this email and I'll take it from there.</p>{SIG}",
        {"Missing_access_list": ["Succeeded"]}),
        "Missing_access_list": {"type": "Select", "runAfter": {}, "inputs": {"from": "@body('Missing_access')", "select": "@concat('<li>',item(),'</li>')"}}},
    "else": {"actions": {}}}
cols_bad = "if(greater(length(body('Find_client_row')),0),body('Onboard_values'),body('NewClient_values'))"
f6["Alert_Mitch_in_Teams"] = teams(
    f"<p><b>Onboarding in: @{{{B6}}}</b></p><p>@{{{CN}?['first']}} @{{{CN}?['last']}} | @{{{PH}?['full']}} | @{{{EM}}}</p>"
    f"<p>Kickoff wanted: @{{{KO_TEXT}}}<br>Systems: @{{{STR(USED)}}} (@{{{SYSNAMES}}})<br>Reply expected: @{{{REPLY}}}</p>"
    f"<p>@{{if(outputs('Access_gaps'),concat('<b>Access still missing:</b> ',join(body('Missing_access'),', '),' ',coalesce({NOACCESS},''),'. I emailed them the list and set a follow up in 3 days.'),'All system access confirmed.')}}</p>"
    f"<p>@{{if(greater(length(body('Find_client_row')),0),'Pipeline row moved to Onboarding.','No matching pipeline row, so I added a new one at Onboarding.')}} <a href=\"@{{{FOLDER_URL}}}\">Client folder</a></p>"
    "@{if(empty(variables('LinksNotSaved')),'',concat('<p>These uploads need saving by hand (Jotform wants a login to download them):</p><ul>',variables('LinksNotSaved'),'</ul>'))}"
    "@{if(or(equals(outputs('Save_answers_to_client_folder')?['statusCode'],null),less(coalesce(outputs('Save_answers_to_client_folder')?['statusCode'],500),300)),'','<p><b>Heads up:</b> the client folder could not be created.</p>')}",
    {"If_access_is_missing": ["Succeeded", "Failed", "Skipped"]})
f6["If_answers_came_through_blank"] = {"type": "If", "runAfter": {"Alert_Mitch_in_Teams": ["Succeeded", "Failed"]},
    "expression": {"equals": [f"@empty({B6})", True]},
    "actions": {"Email_Mitch_the_raw_data": email(ME, "F6 check: raw onboarding data",
        "<p>F6 couldn't read the onboarding answers. This is what Jotform sent, for Claude to look at.</p><pre>@{outputs('Raw_request')}</pre>", {})},
    "else": {"actions": {}}}
package("F6_Mediawise_Onboarding_received.zip", "F6 Mediawise Onboarding received", "Jotform onboarding form: client folder, uploads, pipeline to Onboarding, access check",
        {"manual": {"type": "Request", "kind": "Http", "inputs": {"method": "POST"}}}, f6, [SP, TM, OL])

# ---------------- F9 Results report ----------------
V9 = "body('Get_pipeline_items')?['value']"
C = lambda it, t: f"{it}?[coalesce({M}?['{t}'],'__none__')]"
today_local = f"formatDateTime(convertFromUtc(utcNow(),'{TZ}'),'yyyy-MM-dd')"
f9 = column_map_actions({})
f9["Due_for_a_report"] = {"type": "Query", "runAfter": {"Get_pipeline_items": ["Succeeded"]}, "inputs": {"from": f"@{V9}",
    "where": f"@and(equals({C('item()','Stage')},'Live'),not(empty({C('item()','Go live date')})),lessOrEquals(formatDateTime(convertFromUtc(coalesce({C('item()','Go live date')},'2999-01-01T00:00:00Z'),'{TZ}'),'yyyy-MM-dd'),formatDateTime(addDays(convertFromUtc(utcNow(),'{TZ}'),-30),'yyyy-MM-dd')),empty({C('item()','30 day result')}),not(contains(coalesce({C('item()','Notes')},''),'[Report draft created')))"}}
f9["Ready_to_send"] = {"type": "Query", "runAfter": {"Due_for_a_report": ["Succeeded"]}, "inputs": {"from": f"@{V9}",
    "where": f"@and(equals({C('item()','Stage')},'Live'),not(empty({C('item()','30 day result')})),not(contains(coalesce({C('item()','Notes')},''),'[Results report sent')))"}}
f9["Get_report_template"] = sp_get_file(TEMPLATE, {"Ready_to_send": ["Succeeded"]})
R = "items('For_each_report_due')"
FN = lambda it: f"if(empty(coalesce({C(it,'Client folder')},'')),{clean(it + '?[' + chr(39) + 'Title' + chr(39) + ']')},decodeUriComponent(last(split({C(it,'Client folder')},'/'))))"
RN = FN(R)
rep_name = lambda n: f"concat({n},' 30 Day Results.docx')"
d_acts, d_last, d_body = safe_fields("Draft", [("Notes", f"concat(coalesce({C(R,'Notes')},''),{NL},'[Report draft created ',{today_local},']')"), ("Next action date", "formatDateTime(addDays(utcNow(),2),'yyyy-MM-dd')")], {"Create_report_draft": ["Succeeded"]})
d_acts["Draft_save"] = sp_update(f"{R}?['ID']", d_body, {d_last: ["Succeeded"]})
f9["For_each_report_due"] = {"type": "Foreach", "foreach": "@body('Due_for_a_report')", "runAfter": {"Get_report_template": ["Succeeded"]}, "actions": {
    "Create_report_draft": sp_create_file(f"@concat('/Documents/Clients/',{RN})", f"@{{{rep_name(RN)}}}", "@body('Get_report_template')", {}),
    **d_acts,
    "Tell_Mitch_the_report_is_due": teams(
        f"<p><b>30 day results due: @{{{R}?['Title']}}</b></p><p>Went live @{{formatDateTime(convertFromUtc({C(R,'Go live date')},'{TZ}'),'d MMM')}}. The report draft is in their <a href=\"@{{concat('{SITE}/Documents/Clients/',encodeUriComponent({RN}))}}\">client folder</a>.</p>"
        f"<p>Baseline on file: @{{coalesce({C(R,'Baseline')},'none yet')}}</p>"
        "<p>Fill in the numbers in the report, then add a one line summary to <b>30 day result</b> on their pipeline row. The next morning it goes to the client with the report attached, the care plan offer and a review request.</p>",
        {"Draft_save": ["Succeeded"]}),
}}
S = "items('For_each_report_ready')"
SN = FN(S)
first9 = f"first(split(coalesce({C(S,'Contact name')},'there'),' '))"
care = f"if(empty(string(coalesce({C(S,'Care plan per month ex GST')},''))),'',concat(' for ',formatNumber(float({C(S,'Care plan per month ex GST')}),'C0','en-AU'),' plus GST a month'))"
review_html = f"<p>And one favour: if you're happy with how it's going, a short <a href=\"{REVIEW}\">Google review</a> helps a small regional business like mine more than you'd think.</p>" if REVIEW else ""
body9 = (f"<p>Hi @{{{first9}}},</p><p>It's been 30 days since your new setup went live, so here's how it's tracking.</p>"
         f"<p><b>The short version:</b> @{{{C(S,'30 day result')}}}</p>"
         "<p>The full report is attached, with the before and after numbers.</p>"
         f"<p>Software changes, and automations need looking after. If you'd like me to keep an eye on it, the care plan covers monitoring, fixes when a connected app changes, small improvements each month and a report like this one@{{{care}}}. Just reply to this email and I'll set it up.</p>"
         f"{review_html}{SIG}")
s_acts, s_last, s_body = safe_fields("Sent", [("Notes", f"concat(coalesce({C(S,'Notes')},''),{NL},'[Results report sent ',{today_local},']')"), ("Next action date", "formatDateTime(addDays(utcNow(),7),'yyyy-MM-dd')")], {"Send_without_attachment": ["Succeeded", "Skipped"]})
s_acts["Sent_save"] = sp_update(f"{S}?['ID']", s_body, {s_last: ["Succeeded"]})
send_with = email(f"@{{{C(S,'Email')}}}", f"Your 30 day results", body9, {"Get_report_file": ["Succeeded"]})
send_with["inputs"]["parameters"]["emailMessage/Attachments"] = [{"Name": f"@{{{rep_name(SN)}}}", "ContentBytes": "@body('Get_report_file')"}]
f9["For_each_report_ready"] = {"type": "Foreach", "foreach": "@body('Ready_to_send')", "runAfter": {"For_each_report_due": ["Succeeded", "Failed"]}, "actions": {
    "Get_report_file": sp_get_file(f"@{{concat('/Documents/Clients/',{SN},'/',{rep_name(SN)})}}", {}),
    "Send_with_report": send_with,
    "Send_without_attachment": email(f"@{{{C(S,'Email')}}}", "Your 30 day results", body9.replace("The full report is attached, with the before and after numbers.", "I'll send the full report with the before and after numbers separately."), {"Send_with_report": ["Skipped", "Failed"]}),
    **s_acts,
    "Tell_Mitch_it_went": teams(f"<p><b>30 day results sent to @{{{S}?['Title']}}</b></p><p>@{{if(equals(outputs('Get_report_file')?['statusCode'],200),'Report attached.','The report file wasn''t in their folder, so the email went without it. Send it by hand.')}} Follow up on the care plan set for 7 days.</p>", {"Sent_save": ["Succeeded"]}),
}}
package("F9_Mediawise_Results_report.zip", "F9 Mediawise Results report", "30 days after go live: report draft for Mitch, then the results email to the client",
        {"Recurrence": {"type": "Recurrence", "recurrence": {"frequency": "Day", "interval": 1, "schedule": {"hours": ["8"], "minutes": [20]}, "timeZone": TZ}}},
        f9, [SP, TM, OL])
