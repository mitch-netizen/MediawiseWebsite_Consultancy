import Link from "next/link";
import { BOOKING_URL, offers, services, aud } from "./lib/content";
import CtaBand from "./components/CtaBand";

export default function Home() {
  return (
    <>
      <section className="hero dots">
        <div className="container">
          <span className="eyebrow">Marketing · Revenue · Automation</span>
          <h1>Revenue strategy <span className="accent">that moves.</span></h1>
          <p className="serif">Senior commercial experience, without the full time hire.</p>
          <p className="lead">
            I help regional businesses grow revenue, sharpen their marketing and fix the systems that eat their week. A decade running real revenue teams, now working inside businesses like yours.
          </p>
          <div className="btn-row">
            <a className="btn btn-primary" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a 20 minute chat</a>
            <Link className="btn btn-ghost" href="/automation">See the automation offers</Link>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="proof">
          <div><strong>#1</strong><span>National regional revenue ranking at Southern Cross Austereo</span></div>
          <div><strong>$7M</strong><span>Revenue portfolio managed across three regional markets</span></div>
          <div><strong>12</strong><span>Person sales team led across Rockhampton, Gladstone and Emerald</span></div>
          <div><strong>10 yrs</strong><span>In commercial leadership, not consulting from the sidelines</span></div>
        </div>
      </div>

      <section id="services" className="section">
        <div className="container">
          <span className="eyebrow">What I do</span>
          <h2>Three ways I help</h2>
          <p className="lead muted" style={{ marginBottom: 40 }}>Most regional businesses don&apos;t need another agency. They need someone senior who&apos;ll get in, work out what&apos;s actually holding them back, and fix it.</p>
          <div className="grid grid-3">
            {services.map((s, i) => (
              <div key={s.title} className={`card${i === 2 ? " featured" : ""}`}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <ul className="checks">
                  {s.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
                {i === 2 ? (
                  <Link className="more" href="/automation">See the five offers</Link>
                ) : (
                  <Link className="more" href="/contact">Talk it through</Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section dots" style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="eyebrow">Fixed price automation</span>
          <h2>Five fixes you&apos;ll see in your numbers</h2>
          <p className="lead muted" style={{ marginBottom: 40 }}>Each one is fixed price, built on the tools you already pay for, and live in 2 to 3 weeks. We measure the number before we start and again 30 days after.</p>
          <div className="grid grid-3">
            {offers.map((o) => (
              <Link key={o.slug} href={`/automation/${o.slug}`} className="card">
                <span className="offer-num">{o.number}</span>
                <h3>{o.name}</h3>
                <p className="muted">{o.fixes}</p>
                <div className="price-tag">{aud(o.price)} <span className="small muted" style={{ fontFamily: "inherit" }}>+ GST</span></div>
                <span className="more">How it works</span>
              </Link>
            ))}
            <Link href="/pricing" className="card featured">
              <span className="offer-num">Bundles</span>
              <h3>Want more than one?</h3>
              <p className="muted">Bundle two, three or all five and save up to $2,000 on setup.</p>
              <span className="more">See pricing</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow">Why work with me</span>
            <h2>Built in the real world</h2>
          </div>
          <div>
            <p>I&apos;ve spent a decade running revenue functions, not writing reports about them. At Southern Cross Austereo I led a team of 12 across Rockhampton, Gladstone and Emerald and took the region to the number one national regional revenue ranking.</p>
            <p>That&apos;s the lens I bring to every job. Strategy has to turn into something your team actually uses on Monday morning, or it&apos;s just a document.</p>
            <Link className="btn btn-ghost" href="/about" style={{ marginTop: 16 }}>More about me</Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
