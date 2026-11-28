# =====================================================================================================
# XERO FLOWS (F4, F7, F8). NEEDS THE MAGNETISM XERO CONNECTOR ("Xero Accounting - Magnetism").
# This file is run by build.py only when you pass --xero. It shares build.py's helpers and settings.
#
# STATUS: written but never imported or run, because the connector is not connected yet.
# Every Xero call uses the connector's "Send an HTTP request to Xero" action (operation id
# send-http-request, parameters xero-tenant-id, body/method, body/uri, body/headers, body/body (confirmed 28 Nov
# from a working action), against the normal Xero Accounting API. No Xero record type names are guessed.
# Two things to confirm on first import (see ops/README.md): the connector id shared_xeroaccountingmagnet,
# and the reply shape (xj() handles the Xero JSON directly or inside a 'body' field).
#
# F7 and F8 also create and update the matching row in the Mediawise Jobs list (see jobs_sync below).
#
# F5 (Won) is NOT generated. See ops/specs/F5_Won.md.
# =====================================================================================================

XERO_API = "https://api.xero.com/api.xro/2.0"
QUOTE_STATUS = "DRAFT"   # DRAFT: Mitch checks the quote in Xero first. Use "SENT" only once happy with it.


def xr(method, uri, body, after):
    """One Xero API call via Magnetism. The reply text is at body('<action>')?['body'] (a JSON string)."""
    # Magnetism only accepts the full Accounting API address, so every path is prefixed here.
    if uri.startswith("@"):
        uri = "@concat('" + XERO_API + "'," + uri[1:] + ")"
    else:
        uri = XERO_API + uri
    # Parameter names confirmed 28 Nov from the code view of a working Magnetism action:
    # body/method, body/uri, body/headers (list of name/value pairs), body/body (text).
    headers = [{"name": "Accept", "value": "application/json"}]
    p = {"xero-tenant-id": XERO_TENANT_ID, "body/method": method, "body/uri": uri, "body/headers": headers}
    if body is not None:
        headers.append({"name": "Content-Type", "value": "application/json"})
        p["body/body"] = body
    return conn(XR, "send-http-request", p, after)


def xj(name):
    """Parsed JSON reply of a Xero action (an empty object when there is no reply).
    Works whether the connector returns the Xero JSON directly or wrapped in a 'body' field (text or object)."""
    return f"json(string(coalesce(body('{name}')?['body'],body('{name}'),json('{{}}'))))"


def xero_contact_actions(prefix, name_expr, email_expr, after):
    """Finds the Xero contact by exact name, creates it if missing, leaves the id in variable ContactId."""
    q = f"concat('/Contacts?where=',encodeUriComponent(concat('Name==\"',replace({name_expr},'\"',''),'\"')))"
    return {
        prefix + "_find_contact": xr("GET", "@" + q, None, after),
        prefix + "_reset_id": {"type": "SetVariable", "runAfter": {prefix + "_find_contact": ["Succeeded", "Failed"]},
            "inputs": {"name": "ContactId", "value": f"@coalesce(first(coalesce({xj(prefix + '_find_contact')}?['Contacts'],json('[]')))?['ContactID'],'')"}},
        prefix + "_if_new_contact": {"type": "If", "runAfter": {prefix + "_reset_id": ["Succeeded"]}, "expression": {"equals": ["@variables('ContactId')", ""]},
            "actions": {
                prefix + "_contact_body": {"type": "Compose", "runAfter": {}, "inputs": {"Contacts": [{"Name": f"@{name_expr}", "EmailAddress": f"@coalesce({email_expr},'')"}]}},
                prefix + "_create_contact": xr("POST", "/Contacts", f"@string(outputs('{prefix}_contact_body'))", {prefix + "_contact_body": ["Succeeded"]}),
                prefix + "_set_new_id": {"type": "SetVariable", "runAfter": {prefix + "_create_contact": ["Succeeded"]},
                    "inputs": {"name": "ContactId", "value": f"@coalesce(first(coalesce({xj(prefix + '_create_contact')}?['Contacts'],json('[]')))?['ContactID'],'')"}}},
            "else": {"actions": {}}},
    }


assert XERO_TENANT_ID, "Set XERO_TENANT_ID at the top of build.py before building the Xero flows"

NOTES_OK = f"not(empty({M}?['Notes']))"
acct = {"AccountCode": XERO_ACCOUNT_CODE} if XERO_ACCOUNT_CODE else {}
ID_VAR = {"type": "InitializeVariable", "runAfter": {"Get_pipeline_items": ["Succeeded"]}, "inputs": {"variables": [{"name": "ContactId", "type": "string", "value": ""}]}}


def notes_has(item, marker):
    return f"contains(coalesce({C(item, 'Notes')},''),'{marker}')"


# ---------------- F4 Proposal sent ----------------
# Mitch sets Stage to "Proposal sent" and fills Proposal value ex GST. That Stage change is the "button" from
# the blueprint (it avoids a list button trigger whose id could not be verified). Polls every 15 minutes.
P = "items('For_each_quote_to_make')"
f4 = column_map_actions({})
f4["Set_up_contact_id"] = ID_VAR
f4["Quotes_to_make"] = {"type": "Query", "runAfter": {"Set_up_contact_id": ["Succeeded"]}, "inputs": {"from": "@body('Get_pipeline_items')?['value']",
    "where": f"@and({NOTES_OK},equals({C('item()', 'Stage')},'Proposal sent'),greater(float(coalesce({C('item()', 'Proposal value ex GST')},0)),0),not({notes_has('item()', '[Xero quote created')}))"}}
quote_body = {"Quotes": [{
    "Contact": {"ContactID": "@variables('ContactId')"}, "Date": f"@{today_local}",
    "ExpiryDate": f"@formatDateTime(addDays(convertFromUtc(utcNow(),'{TZ}'),14),'yyyy-MM-dd')",
    "LineAmountTypes": "Exclusive", "Title": "Mediawise Solutions proposal", "Reference": f"@{P}?['Title']", "Status": QUOTE_STATUS,
    "LineItems": [{"Description": f"@concat('Mediawise Solutions proposal for ',{P}?['Title'])", "Quantity": 1,
                   "UnitAmount": f"@float({C(P, 'Proposal value ex GST')})", "TaxType": "OUTPUT", **acct}]}]}
q_marker = (f"concat(coalesce({C(P, 'Notes')},''),{NL},'[Xero quote created ',{today_local},' ',"
            f"coalesce({xj('Create_quote')}?['Quotes']?[0]?['QuoteNumber'],'no number'),']')")
qs_acts, qs_last, qs_body = safe_fields("Quote", [("Agreement status", "'Sent'"), ("Next action date", "formatDateTime(addDays(utcNow(),2),'yyyy-MM-dd')"), ("Notes", q_marker)], {"Create_quote": ["Succeeded"]})
qs_acts["Quote_save"] = sp_update(f"{P}?['ID']", qs_body, {qs_last: ["Succeeded"]})
f4["For_each_quote_to_make"] = {"type": "Foreach", "foreach": "@body('Quotes_to_make')", "runAfter": {"Quotes_to_make": ["Succeeded"]},
    "runtimeConfiguration": {"concurrency": {"repetitions": 1}}, "actions": {
    **xero_contact_actions("Q", f"{P}?['Title']", C(P, "Email"), {}),
    "Quote_body": {"type": "Compose", "runAfter": {"Q_if_new_contact": ["Succeeded"]}, "inputs": quote_body},
    "Create_quote": xr("POST", "/Quotes", "@string(outputs('Quote_body'))", {"Quote_body": ["Succeeded"]}),
    "Quote_failed_alert": teams(f"<p><b>Xero quote failed for @{{{P}?['Title']}}.</b> Check the proposal value and the Xero connection. The flow tries again in 15 minutes.</p>", {"Create_quote": ["Failed"]}),
    **qs_acts,
    "Quote_done_alert": teams(f"<p><b>Xero quote ({QUOTE_STATUS}) created for @{{{P}?['Title']}}.</b></p><p>Check it in Xero, then send the agreement from Jotform Sign. Follow ups go out on day 2 and day 5 until Agreement status is Signed.</p>", {"Quote_save": ["Succeeded"]}),
}}


def followup(n, days_min, subj, body):
    """Daytime email to a client who has a quote but has not signed. Marked in Notes so it only sends once."""
    F = f"items('For_each_followup_{n}')"
    qd = lambda it: f"substring(coalesce({C(it, 'Notes')},''),add(indexOf(coalesce({C(it, 'Notes')},''),'[Xero quote created '),20),10)"
    age = lambda it: f"div(sub(ticks(utcNow()),ticks({qd(it)})),864000000000)"
    hour = f"int(formatDateTime(convertFromUtc(utcNow(),'{TZ}'),'HH'))"
    prev = {"For_each_quote_to_make": ["Succeeded", "Failed", "Skipped"]} if n == 1 else {"For_each_followup_1": ["Succeeded", "Failed", "Skipped"]}
    due = {"type": "Query", "runAfter": prev, "inputs": {"from": "@body('Get_pipeline_items')?['value']",
        "where": (f"@and({NOTES_OK},equals({C('item()', 'Stage')},'Proposal sent'),not(equals({C('item()', 'Agreement status')},'Signed')),"
                  f"not(empty({C('item()', 'Email')})),{notes_has('item()', '[Xero quote created')},not({notes_has('item()', f'[Follow up {n} sent')}),"
                  f"greaterOrEquals({age('item()')},{days_min}),greaterOrEquals({hour},8),less({hour},17))")}}
    fs_acts, fs_last, fs_body = safe_fields(f"Fu{n}", [("Notes", f"concat(coalesce({C(F, 'Notes')},''),{NL},'[Follow up {n} sent ',{today_local},']')")], {f"Send_follow_up_{n}": ["Succeeded"]})
    fs_acts[f"Fu{n}_save"] = sp_update(f"{F}?['ID']", fs_body, {fs_last: ["Succeeded"]})
    first_n = f"first(split(coalesce({C(F, 'Contact name')},'there'),' '))"
    loop = {"type": "Foreach", "foreach": f"@body('Followup_{n}_due')", "runAfter": {f"Followup_{n}_due": ["Succeeded"]},
            "runtimeConfiguration": {"concurrency": {"repetitions": 1}}, "actions": {
        f"Send_follow_up_{n}": email(f"@{{{C(F, 'Email')}}}", subj, body.replace("FIRST", f"@{{{first_n}}}"), {}), **fs_acts}}
    return {f"Followup_{n}_due": due, f"For_each_followup_{n}": loop}


f4.update(followup(1, 2, "Your Mediawise proposal", f"<p>Hi FIRST,</p><p>Just checking you got the proposal and agreement. Happy to talk through any of it, or reply with questions and I will get back to you the same day.</p>{SIG}"))
f4.update(followup(2, 5, "Still keen to help", f"<p>Hi FIRST,</p><p>Last nudge from me on the proposal. If the timing is not right, no worries at all. If you want to go ahead, the agreement is ready to sign and I can start as soon as the deposit lands.</p>{SIG}"))
package("xero/F4_Mediawise_Proposal_sent.zip", "F4 Mediawise Proposal sent", "NEEDS XERO: creates the Xero quote when Stage is Proposal sent, then day 2 and day 5 follow ups",
        {"Recurrence": {"type": "Recurrence", "recurrence": {"frequency": "Minute", "interval": 15, "timeZone": TZ}}}, f4, [SP, TM, OL, XR])


# ---------------- Mediawise Jobs sync (used by F7 and F8) ----------------
# One row per job in the "Mediawise Jobs" list, matched on its Pipeline ID column (the Pipeline row's ID).
# Same patterns as the rest of the flows: columns are found by display title at run time (its own column map,
# because the Jobs list has different internal names), safe_fields writes only columns that exist, and a missing
# column or list never stops the Pipeline update. A problem is reported in Teams instead.
# Number and Currency columns are written as real numbers or null (never wrapped in empty(), never strings).
def jobs_sync(p, id_expr, create_pairs, update_pairs, after):
    """Returns the actions that create or update the Jobs row for one Pipeline row. p is a unique prefix."""
    if not JOBS_SYNC:
        return {}
    JM, JC, JI, MATCH_J = f"outputs('{p}_Jobs_column_map')", f"{p}_Get_jobs_columns", f"{p}_Get_jobs_items", f"{p}_Job_match"
    has_id = f"@empty({JM}?['Pipeline ID'])"
    jfields = lambda pre, pairs, aft: safe_fields(pre, pairs, aft, cols=JC, types=JOBS_TYPES)
    u_acts, u_last, u_body = jfields(p + "U", update_pairs, {})
    u_acts[p + "U_save"] = sp_update(f"first(body('{MATCH_J}'))?['ID']", u_body, {u_last: ["Succeeded"]}, JOBS_LIST, JOBS_SITE)
    n_acts, n_last, n_body = jfields(p + "N", create_pairs, {})
    n_acts[p + "N_create"] = sp_create_item(n_body, {n_last: ["Succeeded"]}, JOBS_LIST, JOBS_SITE)
    return {
        JC: sp_get(f"_api/web/lists/getbytitle('{JOBS_LIST}')/fields?$filter=Hidden eq false and ReadOnlyField eq false&$select=Title,InternalName,TypeAsString", after, JOBS_SITE),
        p + "_Jobs_titles": {"type": "Select", "runAfter": {JC: ["Succeeded"]}, "inputs": {"from": f"@body('{JC}')?['value']", "select": "@concat('\"',item()?['Title'],'\":\"',item()?['InternalName'],'\"')"}},
        p + "_Jobs_column_map": {"type": "Compose", "runAfter": {p + "_Jobs_titles": ["Succeeded"]}, "inputs": f"@json(concat('{{',join(body('{p}_Jobs_titles'),','),'}}'))"},
        JI: sp_get(f"_api/web/lists/getbytitle('{JOBS_LIST}')/items?$top=5000", {p + "_Jobs_column_map": ["Succeeded"]}, JOBS_SITE),
        MATCH_J: {"type": "Query", "runAfter": {JI: ["Succeeded"]}, "inputs": {"from": f"@body('{JI}')?['value']",
            "where": f"@equals(float(coalesce(item()?[coalesce({JM}?['Pipeline ID'],'__none__')],-1)),float({id_expr}))"}},
        p + "_If_job_exists": {"type": "If", "runAfter": {MATCH_J: ["Succeeded"]},
            "expression": {"and": [{"equals": [has_id, False]}, {"greater": [f"@length(body('{MATCH_J}'))", 0]}]},
            "actions": u_acts,
            "else": {"actions": {p + "_If_can_create": {"type": "If", "runAfter": {}, "expression": {"equals": [has_id, False]}, "actions": n_acts,
                "else": {"actions": {p + "_No_pipeline_id_alert": teams(f"<p><b>The {JOBS_LIST} list has no Pipeline ID column, so no Jobs row was created.</b> Add a Number column called Pipeline ID.</p>", {})}}}}}},
        p + "_Jobs_problem_alert": teams(f"<p><b>The {JOBS_LIST} list was not updated.</b> The Pipeline row is fine. Check that the list exists and add the row by hand.</p>", {p + "_If_job_exists": ["Failed", "Skipped", "TimedOut"]}),
    }


def num_or_null(item, colname):
    """A Pipeline Currency value as a number when it is above zero, else null. Never uses empty() on Currency."""
    return f"if(greater(float(coalesce({C(item, colname)},0)),0),float({C(item, colname)}),null)"


def jobs_pairs(item, stage, next_action, next_date, extra=()):
    """(create_pairs, update_pairs). Update leaves Title, Offer and Pipeline ID alone."""
    common = [("Stage", f"'{stage}'"), ("Setup value ex GST", num_or_null(item, "Proposal value ex GST")),
              ("Care plan per month ex GST", num_or_null(item, "Care plan per month ex GST")),
              ("Next action", f"'{next_action}'"), ("Next action date", next_date), *extra]
    create = [("Title", f"{item}?['Title']"),
              ("Offer", f"if(empty(string(coalesce({C(item, 'Offer interest')},''))),null,{C(item, 'Offer interest')})"),
              ("Kickoff date", C(item, "Kickoff date")), ("Client folder", C(item, "Client folder")),
              ("Pipeline ID", f"{item}?['ID']")] + common
    return create, common

# ---------------- F7 Payment received ----------------
# Reads PAID sales invoices from Xero and matches the pipeline row by contact name = Title.
# The invoice Reference must start with "Deposit" or "Final" (F8 writes "Final - <business>").
# SEE ops/specs/F5_Won.md: deposits are currently taken with Stripe links, not Xero invoices.
V7 = "items('For_each_paid_invoice')"
ROW = "first(body('Row_for_invoice'))"
f7 = column_map_actions({})
f7["Get_paid_invoices"] = xr("GET", "/Invoices?where=Status%3D%3D%22PAID%22%20AND%20Type%3D%3D%22ACCREC%22&order=UpdatedDateUTC%20DESC", None, {"Get_pipeline_items": ["Succeeded"]})
# Deposit paid and Final paid are Choice columns (fill in allowed), not Yes/No, so write and check the text "Yes".
dep_set = f"json(concat('{{\"',{M}?['Deposit paid'],'\":\"Yes\"}}'))"
fin_set = f"json(concat('{{\"',{M}?['Final paid'],'\":\"Yes\"}}'))"
stage_acts, stage_last, stage_body = safe_fields("Build", [("Stage", "'Build'")], {"Tick_deposit_paid": ["Succeeded"]})
stage_acts["Stage_save"] = sp_update(f"{ROW}?['ID']", stage_body, {stage_last: ["Succeeded"]})
jobs7 = jobs_pairs(ROW, "Build", "Start the build", today_local)
already = lambda colname: {"not": {"equals": [f"@toLower(string(coalesce({ROW}?[coalesce({M}?['{colname}'],'__none__')],'')))", "yes"]}}
f7["For_each_paid_invoice"] = {"type": "Foreach", "foreach": f"@coalesce({xj('Get_paid_invoices')}?['Invoices'],json('[]'))", "runAfter": {"Get_paid_invoices": ["Succeeded"]},
    "runtimeConfiguration": {"concurrency": {"repetitions": 1}}, "actions": {
    "Row_for_invoice": {"type": "Query", "runAfter": {}, "inputs": {"from": "@body('Get_pipeline_items')?['value']",
        "where": f"@equals(toLower(trim(coalesce(item()?['Title'],''))),toLower(trim(coalesce({V7}?['Contact']?['Name'],''))))"}},
    "If_deposit_invoice": {"type": "If", "runAfter": {"Row_for_invoice": ["Succeeded"]},
        "expression": {"and": [{"greater": ["@length(body('Row_for_invoice'))", 0]}, {"equals": [f"@startsWith(toLower(coalesce({V7}?['Reference'],'')),'deposit')", True]},
                               already("Deposit paid"), {"equals": [f"@empty({M}?['Deposit paid'])", False]}]},
        "actions": {"Tick_deposit_paid": sp_update(f"{ROW}?['ID']", "@" + dep_set, {}), **stage_acts,
                    **jobs_sync("J7", f"{ROW}?['ID']", *jobs7, {"Stage_save": ["Succeeded"]}),
                    "Deposit_alert": teams(f"<p><b>Deposit paid: @{{{V7}?['Contact']?['Name']}}.</b> Stage moved to Build. Time to start.</p>", {"Stage_save": ["Succeeded", "Failed"]})},
        "else": {"actions": {}}},
    "If_final_invoice": {"type": "If", "runAfter": {"If_deposit_invoice": ["Succeeded", "Failed"]},
        "expression": {"and": [{"greater": ["@length(body('Row_for_invoice'))", 0]}, {"equals": [f"@startsWith(toLower(coalesce({V7}?['Reference'],'')),'final')", True]},
                               already("Final paid"), {"equals": [f"@empty({M}?['Final paid'])", False]}]},
        "actions": {"Tick_final_paid": sp_update(f"{ROW}?['ID']", "@" + fin_set, {}),
                    "Final_alert": teams(f"<p><b>Final invoice paid: @{{{V7}?['Contact']?['Name']}}.</b></p>", {"Tick_final_paid": ["Succeeded"]})},
        "else": {"actions": {}}},
}}
package("xero/F7_Mediawise_Payment_received.zip", "F7 Mediawise Payment received", "NEEDS XERO: every 2 hours, ticks Deposit paid or Final paid from paid Xero invoices",
        {"Recurrence": {"type": "Recurrence", "recurrence": {"frequency": "Hour", "interval": 2, "timeZone": TZ}}}, f7, [SP, TM, XR])

# ---------------- F8 Go live ----------------
# Mitch sets Stage to "Live". Polls every 15 minutes. Marker "[Go live processed" in Notes stops repeats.
G8 = "items('For_each_go_live')"
f8 = column_map_actions({})
f8["Set_up_contact_id"] = ID_VAR
f8["Go_lives_to_process"] = {"type": "Query", "runAfter": {"Set_up_contact_id": ["Succeeded"]}, "inputs": {"from": "@body('Get_pipeline_items')?['value']",
    "where": f"@and({NOTES_OK},equals({C('item()', 'Stage')},'Live'),greater(float(coalesce({C('item()', 'Proposal value ex GST')},0)),0),not({notes_has('item()', '[Go live processed')}))"}}
_pv = f"float({C(G8, 'Proposal value ex GST')})"
final_amt = f"float(formatNumber(mul({_pv},if(greater({_pv},{BIG_DEAL_OVER}),{GO_LIVE_PCT_BIG},{GO_LIVE_PCT})),'0.00','en-US'))"
inv_body = {"Invoices": [{"Type": "ACCREC", "Contact": {"ContactID": "@variables('ContactId')"}, "Date": f"@{today_local}",
    "DueDate": f"@formatDateTime(addDays(convertFromUtc(utcNow(),'{TZ}'),14),'yyyy-MM-dd')", "LineAmountTypes": "Exclusive",
    "Reference": f"@concat('Final - ',{G8}?['Title'])", "Status": "AUTHORISED",
    "LineItems": [{"Description": f"@concat('Final payment, Mediawise Solutions setup for ',{G8}?['Title'])", "Quantity": 1, "UnitAmount": "@" + final_amt, "TaxType": "OUTPUT", **acct}]}]}
inv_id = f"{xj('Create_final_invoice')}?['Invoices']?[0]?['InvoiceID']"
g_acts, g_last, g_body = safe_fields("GoLive", [
    ("Go live date", f"coalesce({C(G8, 'Go live date')},formatDateTime(utcNow(),'yyyy-MM-dd'))"),
    ("Next action date", "formatDateTime(addDays(utcNow(),30),'yyyy-MM-dd')"),
    ("Notes", f"concat(coalesce({C(G8, 'Notes')},''),{NL},'[Go live processed ',{today_local},']')")], {"Email_how_to": ["Succeeded", "Failed"]})
g_acts["GoLive_save"] = sp_update(f"{G8}?['ID']", g_body, {g_last: ["Succeeded"]})
jobs8 = jobs_pairs(G8, "Live", "Send the 30 day results report", "formatDateTime(addDays(utcNow(),30),'yyyy-MM-dd')",
                   extra=[("Go live date", f"coalesce({C(G8, 'Go live date')},formatDateTime(utcNow(),'yyyy-MM-dd'))")])
howto = f"<p>Here is your how to guide: <a href=\"{HOWTO_URL}\">open the guide</a>.</p>" if HOWTO_URL else ""
f8["For_each_go_live"] = {"type": "Foreach", "foreach": "@body('Go_lives_to_process')", "runAfter": {"Go_lives_to_process": ["Succeeded"]},
    "runtimeConfiguration": {"concurrency": {"repetitions": 1}}, "actions": {
    **xero_contact_actions("G", f"{G8}?['Title']", C(G8, "Email"), {}),
    "Invoice_body": {"type": "Compose", "runAfter": {"G_if_new_contact": ["Succeeded"]}, "inputs": inv_body},
    "Create_final_invoice": xr("POST", "/Invoices", "@string(outputs('Invoice_body'))", {"Invoice_body": ["Succeeded"]}),
    "Invoice_failed_alert": teams(f"<p><b>Final invoice failed in Xero for @{{{G8}?['Title']}}.</b> Nothing was sent to the client. The flow tries again in 15 minutes.</p>", {"Create_final_invoice": ["Failed"]}),
    "Email_invoice_from_Xero": xr("POST", f"@concat('/Invoices/',{inv_id},'/Email')", None, {"Create_final_invoice": ["Succeeded"]}),
    "Email_how_to": email(f"@{{{C(G8, 'Email')}}}", "You are live",
        f"<p>Hi @{{first(split(coalesce({C(G8, 'Contact name')},'there'),' '))}},</p><p>Your new setup is now live. Your final invoice is on its way from Xero in a separate email.</p>{howto}"
        f"<p>If anything looks off or you want a change, reply to this email or call me on 0409 265 711. I will check in again in 30 days with your results.</p>{SIG}", {"Email_invoice_from_Xero": ["Succeeded", "Failed"]}),
    **g_acts,
    **jobs_sync("J8", f"{G8}?['ID']", *jobs8, {"GoLive_save": ["Succeeded"]}),
    "Go_live_alert": teams(f"<p><b>Go live processed: @{{{G8}?['Title']}}.</b> Final invoice created in Xero (@{{{final_amt}}} ex GST), client emailed, 30 day report set.</p>", {"GoLive_save": ["Succeeded"]}),
}}
package("xero/F8_Mediawise_Go_live.zip", "F8 Mediawise Go live", "NEEDS XERO: when Stage is Live, create and send the final Xero invoice, email the client, set the 30 day follow up",
        {"Recurrence": {"type": "Recurrence", "recurrence": {"frequency": "Minute", "interval": 15, "timeZone": TZ}}}, f8, [SP, TM, OL, XR])
