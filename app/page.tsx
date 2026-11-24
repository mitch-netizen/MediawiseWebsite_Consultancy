import Link from "next/link";
import { BOOKING_URL, offers, services, aud } from "./lib/content";
import CtaBand from "./components/CtaBand";

const chain = [
  { stage: "Get found", leak: "Ad spend nobody can tie back to a sale", who: "Marketing" },
  { stage: "Win the work", leak: "Quotes that go quiet and never get chased", who: "Revenue and sales" },
  { stage: "Deliver it", leak: "The same job keyed into three systems", who: "Systems and automation" },
  { stage: "Get paid", leak: "Invoices sitting at 45 days", who: "Systems and automation" },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Your business has outgrown the way it runs.</h1>
          <p className="lead">
            I&apos;m Mitch Harris. I work with established regional businesses to tighten the chain from first enquiry to cash in the bank: the marketing that brings work in, the sales process that wins it, and the systems that deliver and bill it.
          </p>
          <div className="btn-row">
            <a className="btn btn-primary" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a 20 minute chat</a>
            <Link className="btn btn-ghost" href="#how">See how I work</Link>
          </div>

          <ol className="chain" aria-label="Where money usually leaks between enquiry and payment">
            {chain.map((c) => (
              <li key={c.stage}>
                <span className="stage">{c.stage}</span>
                <span className="node" aria-hidden="true" />
                <span className="drip" aria-hidden="true" />
                <p className="leak">{c.leak}</p>
                <p className="who">{c.who}</p>
              </li>
            ))}
          </ol>
          <p className="chain-caption">Where the money usually leaks, and who fixes it.</p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <h2>Built for businesses past the start up stage</h2>
            <p className="lead">You&apos;re turning over somewhere between $1M and $20M. You&apos;ve got a team, a stack of software and plenty of work. But every extra dollar of growth is costing more effort than the last one.</p>
          </div>
          <div>
            <p className="muted">Usually it looks something like this:</p>
            <ul className="signs">
              <li>Every quote, hire and decision still runs through you</li>
              <li>Marketing money goes out each month and nobody can say what it brings back</li>
              <li>The sales team works hard, but the pipeline lives in heads and inboxes</li>
              <li>Staff key the same job into three different systems</li>
              <li>You find out how last month went when the accountant tells you</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="how" className="section dots">
        <div className="container">
          <h2>Three areas, one chain</h2>
          <p className="lead" style={{ marginBottom: 48 }}>Most consultants fix one link and hand you off. I work across all three, because a leak in one usually starts in another.</p>
          <div className="services">
            {services.map((s) => (
              <div key={s.title} className="service">
                <div>
                  <span className="link">{s.link}</span>
                  <h3>{s.title}</h3>
                </div>
                <p>{s.body}</p>
                <div>
                  <ul>
                    {s.points.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                  <Link className="more" href={s.href}>{s.cta}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>How working together runs</h2>
          <div className="steps three" style={{ marginTop: 40 }}>
            <div className="step">
              <h3>A 20 minute chat</h3>
              <p>You tell me what&apos;s not working. I tell you straight whether I can help, and if I can&apos;t, who can.</p>
            </div>
            <div className="step">
              <h3>Find the leaks</h3>
              <p>I spend time inside the business mapping the chain end to end, then hand you a prioritised plan with the cost of each fix. Fixed fee, agreed upfront.</p>
            </div>
            <div className="step">
              <h3>Fix them</h3>
              <p>Either I stay on part time as your marketing and revenue lead, or I build the fixes as fixed price projects. Often it&apos;s a bit of both. You choose.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section dots">
        <div className="container">
          <h2>Fixed price automation builds</h2>
          <p className="lead" style={{ marginBottom: 40 }}>Five common fixes with a set scope and price. Built on your systems, live in 2 to 3 weeks, and measured before and after.</p>
          <div className="offer-rows">
            {offers.map((o) => (
              <Link key={o.slug} href={`/automation/${o.slug}`} className="offer-row">
                <h3>{o.name}</h3>
                <p>{o.fixes}</p>
                <span className="price">{aud(o.price)} + GST</span>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 28 }}><Link href="/pricing" style={{ color: "var(--teal-ink)", fontWeight: 600 }}>Bundles, care plans and payment terms</Link></p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <h2>I&apos;ve run the revenue, not just advised on it</h2>
            <p>Most of my career has been in commercial leadership, where the targets are real and they don&apos;t move. That&apos;s the lens I bring: if a plan doesn&apos;t change what your team does on Monday morning, it&apos;s just a document.</p>
            <Link className="btn btn-ghost" href="/about" style={{ marginTop: 16 }}>More about me</Link>
          </div>
          <ul className="record">
            <li><strong>Southern Cross Austereo</strong>General Sales Manager across Rockhampton, Gladstone and Emerald. Led a team of 12 and a portfolio of around $7M, and took the region to the number one national regional revenue ranking.</li>
            <li><strong>Coca-Cola Amatil</strong>Commercial and sales experience with one of the country&apos;s biggest distributors.</li>
            <li><strong>Hospitality management</strong>Paul Irvin Hotels and Heron Island, so I know the other side of the counter too.</li>
            <li><strong>Certified</strong>Microsoft Power Automate, Smartsheet and advanced Salesforce CRM reporting.</li>
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
