import type { Metadata } from "next";
import Link from "next/link";
import { offers, bundles, aud } from "../lib/content";
import CtaBand from "../components/CtaBand";

export const metadata: Metadata = {
  title: "Pricing and how it works",
  description: "Fixed setup prices for each automation, bundles, optional care plans and the 2 to 3 week process. All prices in AUD plus GST.",
};

export default function Pricing() {
  return (
    <>
      <section className="hero dots">
        <div className="container">
          <span className="eyebrow">Pricing and how it works</span>
          <h1>Fixed price. <span className="accent">No surprises.</span></h1>
          <p className="lead">You know the total before I start. Anything outside the agreed scope gets quoted in writing first. All prices are in Australian dollars and exclude GST.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2>Automation offers</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Offer</th><th>Setup</th><th>Care plan</th><th>Live in</th></tr>
              </thead>
              <tbody>
                {offers.map((o) => (
                  <tr key={o.slug}>
                    <td><Link href={`/automation/${o.slug}`}>{o.number} {o.name}</Link></td>
                    <td>{aud(o.price)}</td>
                    <td>{aud(o.carePlan)} a month</td>
                    <td>{o.weeks} weeks</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={{ marginTop: 64 }}>Bundles</h2>
          <div className="grid grid-3">
            {bundles.map((b, i) => (
              <div key={b.name} className={`card${i === 2 ? " featured" : ""}`}>
                <span className="offer-num">{b.includes}</span>
                <h3>{b.name}</h3>
                <div className="price-tag" style={{ marginTop: 0 }}>{aud(b.price)}</div>
                <p className="muted" style={{ marginTop: 12 }}>Save {aud(b.saving)} on setup. Care plan {aud(b.carePlan)} a month.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section dots" style={{ paddingTop: 0 }}>
        <div className="container split">
          <div>
            <h2>Care plans</h2>
            <p>Software changes, and automations need looking after. A care plan starts once your 14 days of included support end.</p>
            <ul className="checks">
              <li>Monitoring, and fixes when a connected app changes</li>
              <li>Up to 1 hour a month of small changes</li>
              <li>A monthly one page report on your numbers</li>
              <li>Reply within 1 business day</li>
            </ul>
            <p className="muted small">3 month minimum, then month to month with 30 days notice. Extra work is $150 an hour.</p>
          </div>
          <div>
            <h2>Payment</h2>
            <ul className="checks">
              <li>50% deposit to book your start date, 50% on go live</li>
              <li>Bundles over $5,000: 40% deposit, 30% at build complete, 30% on go live</li>
              <li>Invoices due in 7 days</li>
              <li>Software subscriptions are in your name and paid by you, so you keep ownership</li>
            </ul>
            <h3 style={{ marginTop: 32 }}>Marketing and revenue work</h3>
            <p className="muted">Strategy, campaigns and sales coaching are scoped to the job. <Link href="/contact" style={{ color: "var(--teal)" }}>Tell me what you need</Link> and I&apos;ll send a fixed quote.</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2>How it works</h2>
          <div className="steps">
            <div className="step"><h3>Kickoff</h3><p>Days 1 to 3. We map the current process and record the baseline. You sign off a one page build plan.</p></div>
            <div className="step"><h3>Build</h3><p>Automations, templates and connections built and tested on your systems.</p></div>
            <div className="step"><h3>Test</h3><p>You test with real examples. One round of fixes, then a recorded handover.</p></div>
            <div className="step"><h3>Go live</h3><p>Day 10 or 15. Monitored daily for the first week, with 14 days of support.</p></div>
            <div className="step"><h3>Day 30</h3><p>The before and after numbers, and a short call to go through them.</p></div>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
