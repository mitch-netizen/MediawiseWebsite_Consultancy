# Mediawise Solutions: handover for Claude Code

Owner: Mitch Harris, sole trader, ABN 27 565 980 600. Business email mitch@mediawisesolutions.au (mitch.harris@outlook.com.au bounces, don't use it).
Mitch is on a Mac. He prefers Australian English, no corporate jargon, and no dashes in emails or messages written for him. Never enter passwords; he signs in himself.

Last updated 25 Nov 2026.

## 1. Website (this repo)

- Next.js 16 static export (`output: "export"`, `trailingSlash`). Build with `npm run build`.
- Hosted on Cloudflare Pages, domain mediawisesolutions.au (DNS on Cloudflare).
- Branches:
  - `website-rebuild` is PRODUCTION. Pushing to it deploys the live site.
  - `redesign` is the working branch (preview at redesign.mediawisewebsite-consultancy.pages.dev).
  - Workflow: commit on `redesign`, build, then fast forward and push `website-rebuild`. A change merged into `redesign` is NOT live until `website-rebuild` is pushed. That's what happened with the Stripe links: they sat on `redesign` until 25 Nov.
- Content lives in `app/lib/content.ts`: areas, offers, bundles, faqs and Stripe deposit links.
- SEO: `app/lib/seo.ts` (pageMeta), JSON-LD in layout and pages, `app/robots.ts` allows AI crawlers, `llms.txt` and `llms-full.txt` routes, and `app/sitemap.ts`.
- Positioning: only the five automation builds are fixed scope and fixed price. Everything else (marketing, sales, diagnostics, part time leadership) is bespoke. Keep wording consistent with that.

### Offers (AUD, ex GST)

| Offer | Setup | Deposit | Stripe link |
|---|---|---|---|
| 01 Never miss an enquiry | $1,950 | $975 | https://book.stripe.com/aFa28teHl5GegxJ5OBf7i02 |
| 02 Quotes out the same day | $2,950 | $1,475 | https://book.stripe.com/dRm5kFgPt4Ca6X91ylf7i03 |
| 03 Get paid faster | $1,450 | $725 | https://book.stripe.com/5kQaEZ0QvfgOa9lfpbf7i04 |
| 04 Onboarding on autopilot | $2,950 | $1,475 | https://book.stripe.com/cNifZj1Uz5Gecht4Kxf7i05 |
| 05 Monday morning numbers | $2,450 | $1,225 | https://book.stripe.com/aFa5kF8iX0lU95h4Kxf7i06 |
| Starter bundle | $2,950 | $1,475 (50%) | https://book.stripe.com/4gMdRbeHl9Wu1CPccZf7i07 |
| Growth bundle | $5,450 | $2,180 (40%) | https://book.stripe.com/4gM5kFar5c4C1CPfpbf7i08 |
| Full system bundle | $9,750 | $3,900 (40%) | https://book.stripe.com/bJe3cx42Hb0y81d3Gtf7i09 |

### Care plan links (created 26 Nov, live, kept off the public site)

Monthly subscriptions, `tax_behavior: exclusive`, GST added at checkout, business name and billing address collected. 3 month minimum is stated at checkout, not enforced by Stripe, so cancel by hand if needed. Send the link at go live (it charges straight away). Links are in `carePlanLinks` in `app/lib/content.ts`.

| Plan | Per month ex GST | Link |
|---|---|---|
| 01 Never miss an enquiry | $195 | https://buy.stripe.com/00waEZ2YDgkSbdp0uhf7i0a |
| 02 Quotes out the same day | $195 | https://buy.stripe.com/00wbJ342H0lUftF1ylf7i0b |
| 03 Get paid faster | $145 | https://buy.stripe.com/3cIeVf2YDfgOgxJ7WJf7i0c |
| 04 Onboarding on autopilot | $195 | https://buy.stripe.com/14AeVf0Qv5GeepBdh3f7i0d |
| 05 Monday morning numbers | $295 | https://buy.stripe.com/14A28tar59Wua9lccZf7i0e |
| Starter bundle | $295 | https://buy.stripe.com/7sYeVffLp2u26X990Nf7i0f |
| Growth bundle | $445 | https://buy.stripe.com/cNifZjfLpecKbdp4Kxf7i0g |
| Full system bundle | $695 | https://buy.stripe.com/9B614p7eT7Om5T5dh3f7i0h |

### Stripe

- Live account `acct_1ObOSfS0NVGGcfVp`.
- All 8 deposit prices are `tax_behavior: exclusive`, which is "Include tax in price: No".
- The AU GST registration is active, so GST (10%) is added at checkout once the customer enters a billing address. Verified with a tax calculation: $975 becomes $1,072.50.
- Don't recreate prices. That creates new links, and all 8 links on the site would need swapping.

### Website to do

- [x] Deposit buttons now read "Pay $975 + GST deposit" (live 26 Nov).
- [ ] Stripe business profile still lists mediawisesolutions.com.au. Suggest changing it to .au; Mitch does this in Stripe himself.
- [ ] Jotform enquiry form: the source and utm fields appear visible. They should be hidden.
- [ ] Content marketing strategy doc (12 articles): https://claude.ai/artifact/7juvdwr9GSmBiGj5Djr4cR

## 2. Business automation (Power Automate)

The full plan is the "Mediawise Operating System: Automation Blueprint" doc: https://claude.ai/artifact/8Tf3YBpZEmUrQuYbcbTgtw

### Environment

- Power Automate environment `Default-dbaeb5b4-5314-4b81-a5da-a5412217d466`. Mitch has Premium.
- Not set up yet:
  - Magnetism Xero connector.
  - SMS connector.
- Pipeline list: "Mediawise Pipeline", a Microsoft List in Mitch's OneDrive site https://mediawisesolutions667-my.sharepoint.com/personal/mitch_mediawisesolutions_au
- OneDrive folders:
  - `Documents/Templates` holds the Mediawise Results Report Template.docx.
  - `Documents/Clients/<Business>` holds one folder per client, created by F6.
- The OneDrive site time zone is US Pacific, so date-only values are stored as 08:00Z. Dates still read correctly. Offer to switch it to Brisbane; it's Mitch's setting, so ask first.

### Pipeline list columns (internal names)

| Column | Internal name | Notes |
|---|---|---|
| Title | Title | Business name |
| Contact name | field_1 | |
| Email | field_2 | |
| Mobile | field_3 | Text |
| Industry | field_4 | |
| Source | field_5 | |
| Campaign | field_6 | |
| Biggest time drain | field_7 | |
| Stage | field_9 | Choice: New lead, Contacted, Discovery booked, Proposal sent, Won, Onboarding, Build, Live, Care plan, Lost, Nurture |
| Next action date | field_10 | |
| Proposal value ex GST | | Currency |
| Care plan per month ex GST | field_13 | Currency |
| Kickoff date | field_18 | |
| Go live date | field_19 | |
| Baseline | field_20 | Note |
| 30 day result | field_21 | Note |
| Client folder | field_22 | Text URL |
| Notes | field_24 | |

Column titles have NO brackets ("Proposal value ex GST", not "(ex GST)").

### Flows

`ops/flows/build.py` generates the legacy import zips for every flow (`python3 build.py`).

How the flows are written:
- Every flow looks up columns by display title at run time (column map), so internal names aren't hard coded.
- `safe_fields` writes only the columns that exist, and skips Number and Currency columns.
- Jotform webhooks arrive as multipart, and `rawRequest` keys come doubled (`q2_q2_textbox0`). The `G()` and `g()` helpers coalesce all key variants.
- Never use `createArray()` with no arguments. Use `json('[]')`.

Deploying an updated flow:
1. Go to make.powerapps.com, then flows/import (Import Package Legacy).
2. Set the flow resource to "Update" and pick the existing flow.
3. Pick the existing SharePoint (MWS), Teams and Outlook connections.
4. **Import switches the flow OFF.** Turn it back on afterwards.

| Flow | ID | Status |
|---|---|---|
| F1 New lead | 8fa5238a-1ed1-4a90-b9ad-70e4462af89b | Working. Jotform enquiry webhook, creates the row, Teams alert. |
| F2 Lead nudge | 3f0b96ec-ab0c-49b3-b2cf-bae8af0a8e39 | Runs daily at 8am with no errors. The email path is not yet proven with a real day 1 lead. |
| F3 Discovery booked | 9601d8ee-255c-4dd9-821c-33cc1ec73061 | Working. Calendar trigger with split-on, prep email, Teams reminder. |
| F6 Onboarding received | 0fd31e02-772a-4ad3-b065-1aece3980f20 | Working in testing. **Jotform webhook not yet added** (see below). |
| F9 Results report | 41de8c8a-d3fe-459c-a097-50c718f72e58 | Working. Runs daily at 8:20am. Draft on day 30, then a client email with the report attached once "30 day result" is filled. |
| F10 Monday numbers | 57c08d34-dc32-42e2-9800-d6eb26a95163 | Working. Column names fixed on 25 Nov. |
| F4, F5, F7, F8 | | Not built. Blocked on the Xero connector. |

### Automation to do

- [ ] **F6 webhook.** In Jotform, on the "Mediawise Solutions: Client Onboarding" form (263265428227056), go to Settings, then Integrations, then WebHooks, and add F6's HTTP trigger URL. Get the URL from F6's "manual" trigger in Power Automate. It contains a signature: treat it as a secret and never commit it. Mitch has to do this; the browser pane isn't signed in to Jotform and the Jotform connector can't add webhooks.
- [ ] **Google review link.** Set `REVIEW` in `ops/flows/build.py`, rebuild F9 and redeploy with Update.
- [ ] **Uploads.** If Jotform requires login to view uploads, F6 lists the upload links in Teams instead of saving them.
- [ ] **Test data cleanup** (ask Mitch before deleting):
  - Pipeline row 3 "TEST Flow Check" (now Live, care plan $295) and junk rows 1 and 2.
  - OneDrive folders `Clients/TEST Onboarding Check` and `Clients/TEST Flow Check`.
  - Test calendar events on 25 Nov.
  - Test emails ("Before our chat", "One thing before we kick off", "Your 30 day results", "Monday numbers").
  - Test Jotform submissions.
- [ ] **F4, F5, F7, F8** once the Magnetism Xero connector is connected.
- [ ] **SMS steps in F1 and F2** need a ClickSend or Twilio connector.
