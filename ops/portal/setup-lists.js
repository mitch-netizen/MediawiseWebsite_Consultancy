/*
 * Mediawise ops portal: creates the four lists, their views, overdue colouring and the seed rows.
 *
 * HOW TO RUN (Mitch does this, signed in as himself; nothing here asks for a password):
 *   1. In Chrome or Edge, open your Pipeline list on the site you want the lists in
 *      (default: https://mediawisesolutions667-my.sharepoint.com/personal/mitch_mediawisesolutions_au).
 *   2. Open DevTools (Cmd+Option+J on a Mac), go to Console, paste this whole file, press Enter.
 *   3. Approve the confirm box. It prints each step and a summary at the end.
 *
 * Safe to run twice: it skips lists, columns and views that already exist and only seeds an empty list.
 * It never deletes or edits anything that already exists, and it never touches Mediawise Pipeline.
 * Not tested against the live site when written (no signed in browser was available), so read the
 * console output. If a step fails it says which one and carries on with the rest.
 *
 * SITE: change this line to put the lists on another site, for example the Mediawise team site.
 * If you do, set JOBS_SITE in ops/flows/build.py to the same address and rebuild F7 and F8.
 */
(async () => {
  const SITE = "https://mediawisesolutions667-my.sharepoint.com/personal/mitch_mediawisesolutions_au";
  if (location.origin !== new URL(SITE).origin) {
    alert("Open a page on " + new URL(SITE).origin + " first, then paste this again.");
    return;
  }
  if (!confirm("Create the Mediawise Jobs, Prospects, Agent Log and Tasks lists on\n" + SITE + "\n(existing ones are left alone)?")) return;

  const log = (...a) => console.log("%c[portal]", "color:#0a7", ...a);
  const problems = [];
  const digest = (await (await fetch(SITE + "/_api/contextinfo", { method: "POST", credentials: "same-origin", headers: { Accept: "application/json;odata=verbose" } })).json()).d.GetContextWebInformation.FormDigestValue;

  const api = async (path, method = "GET", body, extra = {}) => {
    const r = await fetch(SITE + "/_api/" + path, {
      method, credentials: "same-origin",
      headers: { Accept: "application/json;odata=verbose", "Content-Type": "application/json;odata=verbose", "X-RequestDigest": digest, ...extra },
      body: body ? JSON.stringify(body) : undefined,
    });
    const t = await r.text();
    if (!r.ok) throw new Error(method + " " + path + " " + r.status + " " + t.slice(0, 300));
    return t ? JSON.parse(t) : {};
  };
  const step = async (label, fn) => { try { const v = await fn(); log("ok", label); return v; } catch (e) { problems.push(label + ": " + e.message); console.error("[portal] FAILED", label, e.message); } };
  const L = n => `web/lists/getbytitle('${n}')`;
  const x = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  // ---------- column builders (all Choice columns allow fill in values, like Pipeline) ----------
  const base = (t, n, i) => `Type="${t}" DisplayName="${x(n)}" Name="${i}" StaticName="${i}"`;
  const C = {
    text: (n, i) => `<Field ${base("Text", n, i)}/>`,
    note: (n, i) => `<Field ${base("Note", n, i)} NumLines="6" RichText="FALSE"/>`,
    date: (n, i) => `<Field ${base("DateTime", n, i)} Format="DateOnly"/>`,
    money: (n, i) => `<Field ${base("Currency", n, i)} Decimals="2" LCID="3081"/>`,
    num: (n, i, min, max) => `<Field ${base("Number", n, i)} Decimals="0"${min != null ? ` Min="${min}"` : ""}${max != null ? ` Max="${max}"` : ""}/>`,
    yesno: (n, i) => `<Field ${base("Boolean", n, i)}><Default>0</Default></Field>`,
    choice: (n, i, opts, def) => `<Field ${base("Choice", n, i)} Format="Dropdown" FillInChoice="TRUE"><CHOICES>${opts.map(o => `<CHOICE>${x(o)}</CHOICE>`).join("")}</CHOICES>${def ? `<Default>${x(def)}</Default>` : ""}</Field>`,
  };

  const OFFERS = ["01 Never miss an enquiry", "02 Quotes out the same day", "03 Get paid faster", "04 Onboarding on autopilot", "05 Monday morning numbers", "Starter bundle", "Growth bundle", "Full system bundle", "Bespoke"];

  // ---------- list definitions ----------
  const LISTS = {
    "Mediawise Jobs": {
      desc: "Client delivery. One row per job, kept up to date by flows F7 and F8.",
      cols: [
        ["Offer", C.choice("Offer", "Offer", OFFERS)],
        ["Stage", C.choice("Stage", "Stage", ["Won", "Onboarding", "Build", "Live", "Care plan", "Done"], "Won")],
        ["Setup value ex GST", C.money("Setup value ex GST", "SetupValueExGST")],
        ["Care plan per month ex GST", C.money("Care plan per month ex GST", "CarePlanPerMonthExGST")],
        ["Kickoff date", C.date("Kickoff date", "KickoffDate")],
        ["Go live date", C.date("Go live date", "GoLiveDate")],
        ["Next action", C.text("Next action", "NextAction")],
        ["Next action date", C.date("Next action date", "NextActionDate")],
        ["Client folder", C.text("Client folder", "ClientFolder")],
        ["Pipeline ID", C.num("Pipeline ID", "PipelineID", 0)],
        ["Notes", C.note("Notes", "Notes")],
      ],
    },
    "Mediawise Prospects": {
      desc: "Output from the BDM agent. Nothing is sent until Status is Approved.",
      cols: [
        ["Contact name", C.text("Contact name", "ContactName")],
        ["Contact email", C.text("Contact email", "ContactEmail")],
        ["Industry", C.text("Industry", "Industry")],
        ["Location", C.text("Location", "Location")],
        ["Fit score", C.num("Fit score", "FitScore", 1, 5)],
        ["Status", C.choice("Status", "ProspectStatus", ["New", "Drafted", "Approved", "Sent", "Replied", "Booked", "Passed"], "New")],
        ["Source", C.text("Source", "Source")],
        ["Draft first message", C.note("Draft first message", "DraftFirstMessage")],
        ["Notes", C.note("Notes", "Notes")],
      ],
    },
    "Mediawise Agent Log": {
      desc: "What each agent did, and what it needs from Mitch.",
      cols: [
        ["Agent", C.choice("Agent", "Agent", ["BDM", "Marketing and research", "Automation engineer"])],
        ["Details", C.note("Details", "Details")],
        ["Needs from Mitch", C.text("Needs from Mitch", "NeedsFromMitch")],
        ["Resolved", C.yesno("Resolved", "Resolved")],
        ["Run date", C.date("Run date", "RunDate")],
      ],
    },
    "Mediawise Tasks": {
      desc: "Open items for Mitch and the agents.",
      cols: [
        ["Owner", C.choice("Owner", "Owner", ["Mitch", "BDM", "Marketing", "Automation"], "Mitch")],
        ["Due date", C.date("Due date", "DueDate")],
        ["Detail", C.note("Detail", "Detail")],
        ["Status", C.choice("Status", "TaskStatus", ["Open", "Done"], "Open")],
      ],
    },
  };

  // ---------- create lists and columns ----------
  const IN = {}; // IN[list][display title] = internal name
  for (const [name, def] of Object.entries(LISTS)) {
    const found = (await api(`web/lists?$filter=Title eq '${name}'&$select=Title`)).d.results;
    if (found.length) log("exists, leaving as is:", name);
    else await step("create list " + name, () => api("web/lists", "POST", { __metadata: { type: "SP.List" }, BaseTemplate: 100, Title: name, Description: def.desc, AllowContentTypes: true, ContentTypesEnabled: false }));
    const have = async () => (await api(`${L(name)}/fields?$filter=Hidden eq false&$select=Title,InternalName`)).d.results;
    let fields = await have();
    for (const [title, xml] of def.cols) {
      if (fields.some(f => f.Title === title)) continue;
      await step(`${name}: column ${title}`, () => api(`${L(name)}/fields/createfieldasxml`, "POST", { parameters: { __metadata: { type: "SP.XmlSchemaFieldCreationInformation" }, SchemaXml: xml, Options: 24 } }));
    }
    fields = await have();
    IN[name] = Object.fromEntries(fields.map(f => [f.Title, f.InternalName]));
  }

  // ---------- views ----------
  const and = cs => cs.length === 1 ? cs[0] : `<And>${cs[0]}${and(cs.slice(1))}</And>`;
  const eq = (f, v) => `<Eq><FieldRef Name="${f}"/><Value Type="Text">${x(v)}</Value></Eq>`;
  const neq = (f, v) => `<Neq><FieldRef Name="${f}"/><Value Type="Text">${x(v)}</Value></Neq>`;
  const notnull = f => `<IsNotNull><FieldRef Name="${f}"/></IsNotNull>`;
  const order = (f, asc) => `<OrderBy><FieldRef Name="${f}" Ascending="${asc ? "TRUE" : "FALSE"}"/></OrderBy>`;

  const addView = async (list, title, query, fieldTitles) => {
    const names = fieldTitles.map(t => t === "Title" ? "LinkTitle" : IN[list][t]).filter(Boolean);
    const existing = (await api(`${L(list)}/views?$filter=Title eq '${title}'&$select=Title`)).d.results;
    if (existing.length) { log("view exists:", list, "/", title); return; }
    await step(`${list}: view ${title}`, async () => {
      await api(`${L(list)}/views`, "POST", { __metadata: { type: "SP.View" }, Title: title, ViewQuery: query, RowLimit: 100, Paged: true, PersonalView: false });
      const v = `${L(list)}/views/getbytitle('${title}')/viewfields`;
      await api(`${v}/removeallviewfields`, "POST");
      for (const n of names) await api(`${v}/addviewfield('${n}')`, "POST");
    });
  };

  const J = IN["Mediawise Jobs"], P = IN["Mediawise Prospects"], A = IN["Mediawise Agent Log"], T = IN["Mediawise Tasks"];
  await addView("Mediawise Jobs", "Jobs board",
    `<GroupBy Collapse="FALSE" GroupLimit="30"><FieldRef Name="${J["Stage"]}"/></GroupBy>${order(J["Next action date"], true)}`,
    ["Title", "Offer", "Setup value ex GST", "Care plan per month ex GST", "Next action", "Next action date", "Go live date"]);
  await addView("Mediawise Jobs", "Due in 3 days",
    `${order(J["Next action date"], true)}<Where>${and([notnull(J["Next action date"]), `<Leq><FieldRef Name="${J["Next action date"]}"/><Value Type="DateTime"><Today OffsetDays="3"/></Value></Leq>`, neq(J["Stage"], "Done")])}</Where>`,
    ["Title", "Stage", "Next action", "Next action date"]);
  await addView("Mediawise Prospects", "Awaiting approval",
    `${order(P["Fit score"], false)}<Where>${eq(P["Status"], "Drafted")}</Where>`,
    ["Title", "Contact name", "Industry", "Location", "Fit score", "Draft first message"]);
  await addView("Mediawise Agent Log", "Needs you",
    `${order("ID", false)}<Where>${and([notnull(A["Needs from Mitch"]), `<Neq><FieldRef Name="${A["Resolved"]}"/><Value Type="Boolean">1</Value></Neq>`])}</Where>`,
    ["Title", "Agent", "Needs from Mitch", "Run date"]);
  await addView("Mediawise Tasks", "Open for Mitch",
    `${order(T["Due date"], true)}<Where>${and([eq(T["Owner"], "Mitch"), eq(T["Status"], "Open")])}</Where>`,
    ["Title", "Due date", "Detail", "Status"]);

  // ---------- overdue colouring (dates in the past turn red, unless the job or task is finished) ----------
  const overdue = (done) => JSON.stringify({
    $schema: "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
    elmType: "div",
    txtContent: "=if(@currentField, toLocaleDateString(@currentField), '')",
    style: { color: `=if(@currentField && @currentField < @now && ${done}, '#a4262c', '')`, "font-weight": `=if(@currentField && @currentField < @now && ${done}, '600', '400')` },
  });
  await step("overdue colour on Jobs Next action date", () => api(`${L("Mediawise Jobs")}/fields/getbyinternalnameortitle('${J["Next action date"]}')`, "POST",
    { __metadata: { type: "SP.FieldDateTime" }, CustomFormatter: overdue(`[$${J["Stage"]}] != 'Done'`) }, { "X-HTTP-Method": "MERGE", "IF-MATCH": "*" }));
  await step("overdue colour on Tasks Due date", () => api(`${L("Mediawise Tasks")}/fields/getbyinternalnameortitle('${T["Due date"]}')`, "POST",
    { __metadata: { type: "SP.FieldDateTime" }, CustomFormatter: overdue(`[$${T["Status"]}] != 'Done'`) }, { "X-HTTP-Method": "MERGE", "IF-MATCH": "*" }));

  // ---------- seed rows (only into an empty list) ----------
  const seed = async (list, rows) => {
    const n = (await api(`${L(list)}/items?$top=1&$select=Id`)).d.results.length;
    if (n) { log("not empty, not seeding:", list); return; }
    const type = (await api(`${L(list)}?$select=ListItemEntityTypeFullName`)).d.ListItemEntityTypeFullName;
    for (const row of rows) {
      const body = { __metadata: { type } };
      for (const [k, v] of Object.entries(row)) body[k === "Title" ? "Title" : IN[list][k]] = v;
      await step(`${list}: seed "${row.Title}"`, () => api(`${L(list)}/items`, "POST", body));
    }
  };

  await seed("Mediawise Tasks", [
    { Title: "Import the fixed F4, F7 and F8 with Update", Owner: "Mitch", Status: "Open",
      Detail: "Zips are in ops/flows/dist/xero. Import each at make.powerapps.com with Update (import switches the flow off). F7 and F8 now also write to Mediawise Jobs, so the Jobs list has to exist first. Then rerun F4 on the TEST Xero Check row (pipeline id 4), check the draft quote and contact in Xero, delete both and the row, and switch F4 on. The F8 live test needs your OK because it creates and emails a real invoice." },
    { Title: "Verify the Google Business Profile", Owner: "Mitch", Status: "Open",
      Detail: "The profile (managed by the mitch@mediawisesolutions.com.au Google account) shows Verification required. Once verified, copy the review link. Claude then sets REVIEW in ops/flows/build.py, rebuilds F9 and you import it with Update." },
    { Title: "Answer the 4 open questions on the referral terms", Owner: "Mitch", Status: "Open",
      Detail: "Draft terms with the questions at the end: https://claude.ai/artifact/Kf5iqQ1N9a7dusvfjAA58c" },
    { Title: "Set up the SMS connector (ClickSend or Twilio)", Owner: "Mitch", Status: "Open",
      Detail: "Once it is connected, Claude sets SMS_PROVIDER, rebuilds F1 and F2, and you import them with Update to switch the SMS steps on. The site wording stays at email and SMS until then." },
    { Title: "Answer the open F5 Won questions", Owner: "Mitch", Status: "Open",
      Detail: "See ops/specs/F5_Won.md. Still open: a real Jotform Sign completion email (none in the inbox yet), the client folder template (default none, F6 keeps making folders), and Planner or a Teams task list (default Teams)." },
    { Title: "Decide the Stripe display name and representative email", Owner: "Mitch", Status: "Open",
      Detail: "Both still show .com.au in Stripe. The business website is already mediawisesolutions.au." },
    { Title: "Schedule the three agents", Owner: "Mitch", Status: "Open",
      Detail: "BDM (weekly, Monday), Marketing and research (weekly, Friday) and Automation engineer (daily). None are scheduled yet. See the three Agent Log rows." },
  ]);

  const today = new Date().toISOString().slice(0, 10);
  await seed("Mediawise Agent Log", [
    { Title: "BDM agent planned, not scheduled", Agent: "BDM", Resolved: false, "Run date": today, "Needs from Mitch": "Say go and I will schedule it",
      Details: "Runs weekly on Monday. Finds prospects that fit, gives each a fit score from 1 to 5 and drafts a first message into Mediawise Prospects. Nothing is sent without your approval: you set Status to Approved first. Currently NOT scheduled." },
    { Title: "Marketing and research agent planned, not scheduled", Agent: "Marketing and research", Resolved: false, "Run date": today, "Needs from Mitch": "Say go and I will schedule it",
      Details: "Runs weekly on Friday. Writes the campaign brief, does the research and drafts the next article from the content marketing strategy. Currently NOT scheduled." },
    { Title: "Automation engineer agent planned, not scheduled", Agent: "Automation engineer", Resolved: false, "Run date": today, "Needs from Mitch": "Say go and I will schedule it",
      Details: "Runs daily. Checks the flow runs for failures and goes through the open flow items. Currently NOT scheduled." },
  ]);

  // ---------- summary ----------
  console.log("\n[portal] DONE. Lists:");
  for (const n of Object.keys(LISTS)) console.log("  " + n + ": " + SITE + "/Lists/" + encodeURIComponent(n));
  if (problems.length) { console.warn("[portal] " + problems.length + " step(s) failed. Copy this back to Claude:\n" + problems.join("\n")); alert("Finished with " + problems.length + " problem(s). See the Console."); }
  else alert("All four lists, their views and the seed rows are in place.");
})();
