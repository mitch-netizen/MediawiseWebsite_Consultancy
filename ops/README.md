# Mediawise automation: build, deploy and test

Everything here makes the Power Automate flows for the Mediawise Pipeline. Nothing in this folder talks to Power Automate. You build zips, then import them by hand.

## Files

| Path | What it is |
|---|---|
| `ops/flows/build.py` | Generates the legacy import zips. Settings you may need to change are in the CONFIG block at the top. |
| `ops/flows/xero_flows.py` | F4, F7 and F8. Only built with `--xero`. Needs the Magnetism Xero connector. |
| `ops/flows/validate.py` | Checks every zip. Run it after every build. |
| `ops/specs/F5_Won.md` | F5 is not built. This lists what is needed first. |
| `ops/flows/dist/` | Build output (not committed). |

## Build

```
cd ops/flows
python3 build.py            # F1, F2, F3, F6, F9, F10
python3 validate.py
python3 build.py --xero     # also F4, F7, F8, in dist/xero/. Set XERO_TENANT_ID first.
```

No secrets live in these files. The F6 webhook link is never stored here.

## Config values (top of `build.py`)

| Value | Meaning |
|---|---|
| `REVIEW` | Google review link for the F9 results email. Empty means F9 leaves the review paragraph out. Mitch supplies it. Not invented. |
| `SMS_PROVIDER` | `None` (off), `"twilio"` or `"clicksend"`. While `None`, F1 and F2 contain no SMS step and need no SMS connection. |
| `SMS_FROM` | Twilio only: the sending number in +61 format. |
| `XERO_TENANT_ID`, `XERO_ACCOUNT_CODE` | Xero flows only. Tenant ID appears once the connector is connected. |
| `GO_LIVE_PCT`, `GO_LIVE_PCT_BIG`, `BIG_DEAL_OVER` | F8 go live invoice is the proposal value times 0.5 for setups up to $5,000, and times 0.3 above that (bundles pay 40% deposit, 30% at build complete, 30% at go live). The build complete invoice for big deals is raised by hand. |
| `HOWTO_URL` | F8 how to guide link. Empty leaves it out. |

## Deploy a changed flow (Update, not New)

1. Go to make.powerapps.com, then Flows, then Import, then Import Package (Legacy).
2. Upload the zip from `ops/flows/dist/`.
3. Set the flow's import setup to **Update** and pick the existing flow from the list.
4. Pick the existing SharePoint (MWS), Teams and Outlook connections. For the SMS and Xero connectors, pick the new connection.
5. Import. **Import switches the flow off, so turn it back on.**
6. Run the flow's test checklist below.

New flows (F4, F7, F8) use Create as new, not Update.

## F6 webhook (Mitch does this)

1. In Power Automate, open F6 and expand its "manual" trigger. Copy the HTTP POST URL. It contains a signature, so treat it like a password. Do not paste it into chat, email or git.
2. In Jotform, open "Mediawise Solutions: Client Onboarding" (263265428227056), then Settings, Integrations, WebHooks.
3. Paste the URL, save.
4. Submit a test onboarding and check the F6 run history.

## Test checklist per flow

Use a test business name that starts with TEST so the rows are easy to tidy afterwards. Ask before deleting anything.

**F1 New lead**
- Submit the enquiry form with a TEST business. A pipeline row appears, Stage Contacted, Source and Campaign filled.
- Teams alert arrives. It says the row was added.
- Leave the form blank once. Teams still alerts, says the row was NOT created, and the raw data email arrives.
- With SMS on: a text arrives on a real mobile with the booking link and STOP line. With a landline or blank mobile, no text and no error.

**F2 Lead nudge** (runs 8am daily)
- Set a TEST row to Contacted with Created one day ago (or wait). Email arrives with the booking link.
- Day 3 sends the "Still keen" email, plus a text if SMS is on. Day 7 sends the last email and moves Stage to Nurture.
- Not yet proven with a real day 1 lead.

**F3 Discovery booked**
- Book a discovery call from the booking page using the lead's email. Row moves to Discovery booked with the date, prep email arrives, Teams reminder arrives 30 minutes before.
- A booking over 30 days away will make the flow time out waiting. Rebook closer in.
- A calendar event with no matching lead does nothing.

**F6 Onboarding received** (needs the webhook above)
- Submit the onboarding form. Client folder and `Onboarding answers.html` appear in `Documents/Clients/<Business>`. Row moves to Onboarding with kickoff date and baseline.
- Tick fewer access boxes than systems used. The client gets the access email and Next action date is +3 days.
- Submit twice. The second Teams alert says the answers file could not be saved because it exists. That is expected.

**F9 Results report** (runs 8:20am daily)
- Set a TEST row to Live with Go live date 31 days ago. A report draft appears in the client folder and Teams tells Mitch.
- Fill in 30 day result. Next morning the client email goes out with the report attached.
- It sends once only. Needs the Notes column. If Notes is missing, F9 does nothing rather than risk repeat emails.
- If the template is missing, Teams says so and client emails still go out.

**F10 Monday numbers** (Mondays 7am)
- Run it by hand. Email arrives with counts, proposal total, care plan total, new leads and overdue actions.

**F4 Proposal sent** (needs Xero)
- Set a TEST row to Stage Proposal sent with a Proposal value. Within 15 minutes a draft quote appears in Xero, Agreement status becomes Sent, Teams alerts.
- Day 2 and day 5 follow up emails go out in daytime hours until Agreement status is Signed. Test by editing the quote date in Notes.

**F7 Payment received** (needs Xero)
- Mark a TEST invoice paid in Xero with Reference "Deposit - <business>". Within 2 hours Deposit paid ticks, Stage moves to Build, Teams alerts. Same with "Final - <business>" for Final paid.

**F8 Go live** (needs Xero)
- Set a TEST row to Live. A final invoice appears in Xero and is emailed from Xero, the client gets the go live email, Go live date and Next action date (+30 days) fill in.

## What was changed in the review (summary)

- Output path is now `ops/flows/dist`, not a fixed `/home/claude/flows`.
- `safe_fields` now writes only Text, Note, Choice, DateTime and Boolean columns. Number and Currency were already skipped. URL, Lookup, Integer and multi choice columns are now skipped too, because a plain string makes SharePoint reject the whole update.
- F1: Teams alert now always runs, even if creating the row failed, and says so. Before, a failed create meant no alert and a silently lost lead.
- F3: the prep email now sends even if saving the row fails.
- F6: upload loop runs one at a time (it appends to a shared variable). The "heads up" check uses the action's real status. The client access email is skipped if the form had no email.
- F9: does nothing if the Notes column is missing (the Notes markers stop repeat client emails). Client emails skip rows with no email. A missing template no longer blocks the client emails, and Teams says so.
- Package timestamp no longer uses a deprecated Python call.

## Known risks, not changed

- F1 writes the Source text as sent by the form. If the Source column is a Choice list that does not allow other values, an unexpected source would make the row fail to save. The new Teams message would catch it. Allow fill in choices on Source, or tell Claude the exact choices to map to.
- F2 sends on exact day numbers 1, 3 and 7. If the daily run is missed or run twice on a day, an email can be skipped or sent twice.
- SharePoint site time zone is US Pacific, so dates store as 08:00Z. Dates still read correctly. Mitch's setting to change.
- The onboarding form text in the blueprint asks clients to invite mitch.harris@outlook.com.au, which bounces. Check the live Jotform wording says mitch@mediawisesolutions.au (F6's email already does).

## Xero flows: first import checks

Imported 28 Nov. The connector id `shared_xeroaccountingmagnet` was accepted. The first import failed because the parameter names were guessed; they are now `body/method`, `body/uri`, `body/headers`, `body/body`, read from a working action's code view. Still to confirm on the first real run: a draft quote lands in Xero and the contact id comes back. `xj()` reads the reply whether Xero's JSON comes back directly or inside a `body` field; if the contact id is still blank, check the raw output of `Q_find_contact` (F4) or `G_find_contact` (F8) in the run history.
