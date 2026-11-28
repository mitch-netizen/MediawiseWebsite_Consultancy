import Link from "next/link";
import { BOOKING_URL, areas } from "./lib/content";
import CtaBand from "./components/CtaBand";
import { MiniEmblem, Arrow } from "./components/Emblem";

const stages = [
  { x: 14, label: "Get found", who: "Marketing" },
  { x: 383, label: "Win the work", who: "Revenue and sales" },
  { x: 752, label: "Deliver it", who: "Systems and automation" },
  { x: 1122, label: "Get paid", who: "Systems and automation" },
];

const blurbs: Record<string, string> = {
  marketing: "Marketing that's judged on the work it brings in. Strategy, campaigns and part time marketing leadership.",
  "revenue-and-sales": "Win more of the work you're already paying to attract. Diagnostics, sales process and team coaching.",
  "systems-and-automation": "Deliver and bill without the double handling. Five fixed price automation builds, plus bespoke work.",
};

export default function Home() {
  return (
    <>
      <section className="hero hero-home">
        <div className="container">
          <p className="kicker">Marketing, revenue and systems for established regional businesses</p>
          <h1>Your business has outgrown the way it runs.</h1>
          <p className="lead">
            I&apos;m Mitch Harris. I help businesses turning over $1M to $20M tighten the chain from first enquiry to cash in the bank.
          </p>
          <div className="btn-row">
            <a className="btn btn-primary" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a 20 minute chat<span className="sr-only"> (opens in a new tab)</span></a>
            <Link className="text-link" href="/how-it-works">See how it works</Link>
          </div>

          <figure className="chain">
            <svg viewBox="0 0 1136 80" role="img" aria-label="Four stages from enquiry to payment: get found, win the work, deliver it, get paid">
              <line x1="14" y1="40" x2="1122" y2="40" stroke="#d8c38a" strokeWidth="1" opacity="0.55" />
              <line className="chain-run" x1="14" y1="40" x2="400" y2="40" stroke="#02d8be" strokeWidth="2" />
              <circle cx="400" cy="40" r="5" fill="#02d8be" />
              {stages.map((s) => (
                <g key={s.label}>
                  <circle cx={s.x} cy="40" r="13" fill="#223447" stroke="#d8c38a" strokeWidth="1.25" />
                  <circle cx={s.x} cy="40" r="4" fill="#d8c38a" />
                </g>
              ))}
            </svg>
            <ol className="chain-labels">
              {stages.map((s) => (
                <li key={s.label}>
                  <span className="chain-stage">{s.label}</span>
                  <span className="chain-who">{s.who}</span>
                </li>
              ))}
            </ol>
          </figure>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <div className="intro-split">
            <h2>Three areas. One chain.</h2>
            <p className="muted">A leak in one usually starts in another, so I work across all three. Pick the one that hurts most and start there.</p>
          </div>
          <div className="service-rows">
            {areas.map((a) => (
              <Link key={a.slug} href={`/services/${a.slug}`} className={`service-row tone-${a.tone}`}>
                <MiniEmblem tone={a.tone} />
                <div>
                  <span className="row-stage">{a.stages}</span>
                  <h3>{a.name}</h3>
                </div>
                <p>{blurbs[a.slug]}</p>
                <Arrow />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="statement">
        <div className="container statement-inner">
          <p className="statement-text">I took a regional sales team to the number one national revenue ranking. Now I help owners do the same with their own business.</p>
          <div className="statement-by">
            <p className="by-name">Mitch Harris</p>
            <p className="by-role">Former General Sales Manager, Southern Cross Austereo. Led a team of 12 and a portfolio of around $7M across Rockhampton, Gladstone and Emerald.</p>
            <Link className="text-link gold" href="/about">More about me</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>How it works</h2>
          <ol className="three-steps">
            <li>
              <span className="step-num tone-gold">1</span>
              <h3>A 20 minute chat</h3>
              <p>You tell me what&apos;s not working. I tell you straight whether I can help.</p>
            </li>
            <li>
              <span className="step-num tone-teal">2</span>
              <h3>Find the leaks</h3>
              <p>I map the chain from enquiry to cash and hand you a prioritised plan. Bespoke, and quoted upfront.</p>
            </li>
            <li>
              <span className="step-num tone-blue">3</span>
              <h3>Fix them</h3>
              <p>Part time leadership, project work, or a fixed price automation build. Often a mix.</p>
            </li>
          </ol>
          <p style={{ marginTop: 40 }}><Link className="text-link" href="/who-its-for">Not sure it&apos;s you? See who I work with</Link></p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
