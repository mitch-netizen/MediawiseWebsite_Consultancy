import { SITE_URL, EMAIL, PHONE, ABN, areas, offers, faqs, aud, bundles, paymentSchedule } from "./content";

export function llmsSummary() {
  return `# Mediawise Solutions

> Mediawise Solutions is a Central Queensland consultancy run by Mitch Harris. It helps established regional Australian businesses, usually turning over $1M to $20M, tighten the chain from first enquiry to cash in the bank across three areas: marketing, revenue and sales, and systems and automation. Five Power Automate automation builds have a fixed scope and price; all other work is bespoke and quoted to suit.

- Founder: Mitch Harris, former General Sales Manager at Southern Cross Austereo (Rockhampton, Gladstone and Emerald), who led a team of 12 and a portfolio of around $7M and took the region to the number one national regional revenue ranking.
- Based in Central Queensland. In person around Gladstone and Rockhampton, online Australia wide.
- Contact: ${EMAIL}, ${PHONE}. Book a 20 minute chat at ${SITE_URL}/contact/
- ABN ${ABN}. Founded 2023.

## Services
${areas.map((a) => `- [${a.name}](${SITE_URL}/services/${a.slug}/): ${a.headline} ${a.intro}`).join("\n")}

## Fixed price automation builds (AUD, plus GST)
${offers.map((o) => `- [${o.name}](${SITE_URL}/automation/${o.slug}/): ${o.fixes} ${aud(o.price)} setup, live in ${o.weeks} weeks.`).join("\n")}

## Key pages
- [Who it's for](${SITE_URL}/who-its-for/): the kind of business Mediawise works with
- [How it works and FAQs](${SITE_URL}/how-it-works/): the engagement process and common questions
- [About Mitch Harris](${SITE_URL}/about/): background and track record
- [Automation pricing](${SITE_URL}/pricing/): setup prices, bundles, care plans and payment terms

## Optional
- [Full text for AI assistants](${SITE_URL}/llms-full.txt)
`;
}

export function llmsFull() {
  return `${llmsSummary()}

---

# Full detail

${areas.map((a) => `## ${a.name} (${a.stages})

${a.headline}

${a.intro}

Where it usually leaks:
${a.leaks.map((l) => `- ${l}`).join("\n")}

What Mitch does:
${a.work.map((w) => `- ${w.title}: ${w.body}`).join("\n")}

Ways to work together: ${a.formats.join(", ")}.
`).join("\n")}

## Automation builds in detail
${offers.map((o) => `### ${o.name}
${o.headline}
${o.problem}
${o.fixes}
Included:
${o.included.map((i) => `- ${i}`).join("\n")}
Not included:
${o.excluded.map((e) => `- ${e}`).join("\n")}
Measured: ${o.measure}.
Price: ${aud(o.price)} plus GST setup. Optional care plan ${aud(o.carePlan)} plus GST a month. Live in ${o.weeks} weeks.
`).join("\n")}
### Bundles
${bundles.map((b) => `- ${b.name} (builds ${b.includes}): ${aud(b.price)} plus GST, saving ${aud(b.saving)}. Care plan ${aud(b.carePlan)} plus GST a month. Payment: ${paymentSchedule(b.depositPercent)}.`).join("\n")}

## Payment terms (automation builds)
- All prices are in AUD and exclude GST. GST (10%) is added at checkout.
- Single builds: 50% deposit to book the start date, 50% on go live.
- Bundles over $5,000: 40% deposit, 30% at build complete, 30% on go live.
- Invoices are due in 7 days.
- Care plans are optional, start after 14 days of included support, have a 3 month minimum, then run month to month with 30 days notice. Extra work is $150 an hour.
- Software subscriptions are in the client's name and paid by the client.
- Marketing, sales, diagnostics and part time leadership work is bespoke and quoted to suit.

## Frequently asked questions
${faqs.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}
`;
}
