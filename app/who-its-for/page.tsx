import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "../components/CtaBand";

export const metadata: Metadata = {
  title: "Who it's for",
  description: "Established regional businesses turning over $1M to $20M, with a team, a stack of software and growth that's costing more effort than it should.",
};

const signs = [
  { text: "Every quote, hire and decision still runs through you", href: "/services/revenue-and-sales" },
  { text: "Marketing money goes out each month and nobody can say what it brings back", href: "/services/marketing" },
  { text: "The sales team works hard, but the pipeline lives in heads and inboxes", href: "/services/revenue-and-sales" },
  { text: "Staff key the same job into three different systems", href: "/services/systems-and-automation" },
  { text: "Invoices drift past 30, 60, 90 days because nobody has time to chase", href: "/services/systems-and-automation" },
  { text: "You find out how last month went when the accountant tells you", href: "/services/systems-and-automation" },
];

export default function WhoItsFor() {
  return (
    <>
      <section className="hero hero-split">
        <div className="container">
          <h1>Built for businesses past the start up stage.</h1>
          <div className="size-band" aria-label="Annual turnover range">
            <span className="size-low">$1M</span>
            <span className="size-bar" aria-hidden="true" />
            <span className="size-high">$20M</span>
          </div>
          <p className="lead">You&apos;ve got a team, a stack of software and plenty of work. But every extra dollar of growth is costing more effort than the last one.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Sound familiar?</h2>
          <ul className="tick-list">
            {signs.map((s) => (
              <li key={s.text}>
                <Link href={s.href}>
                  <span className="tick" aria-hidden="true" />
                  <span>{s.text}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="muted" style={{ marginTop: 28 }}>Each one links to the part of the business where I&apos;d start.</p>
        </div>
      </section>

      <section className="section dots">
        <div className="container split">
          <h2>Why size matters</h2>
          <div>
            <p>Under about a million, the owner usually is the system, and that&apos;s fine. Somewhere past it, the business gets bigger than one person can hold in their head. That&apos;s when the leaks start.</p>
            <p>You&apos;re big enough that a fix pays for itself quickly, and small enough that it can be done in weeks, not a two year transformation program.</p>
          </div>
        </div>
      </section>

      <CtaBand title="Recognise two or more?" text="That's usually enough to be worth a 20 minute chat." />
    </>
  );
}
