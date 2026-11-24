import Link from "next/link";
import { BOOKING_URL, areas } from "./lib/content";
import CtaBand from "./components/CtaBand";
import FlowHero from "./components/FlowHero";

const more = [
  { href: "/who-its-for", title: "Who it's for", body: "Established businesses turning over $1M to $20M, and the signs it's time." },
  { href: "/how-it-works", title: "How it works", body: "A 20 minute chat, a look at where it's leaking, then the fixes." },
  { href: "/automation", title: "Automation builds", body: "Five fixed price builds, live in 2 to 3 weeks." },
  { href: "/about", title: "About Mitch", body: "A decade running revenue teams, from SCA to Coca-Cola Amatil." },
];

export default function Home() {
  return (
    <>
      <section className="hero hero-home">
        <div className="container">
          <h1>Your business has outgrown the way it runs.</h1>
          <p className="lead">
            I&apos;m Mitch Harris. I help established regional businesses tighten the chain from first enquiry to cash in the bank: the marketing, the sales and the systems in between.
          </p>
          <div className="btn-row">
            <a className="btn btn-primary" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a 20 minute chat</a>
            <Link className="btn btn-ghost" href="/who-its-for">Is this you?</Link>
          </div>
          <FlowHero />
          <p className="flow-caption">Where the money usually leaks. Tap a stage to see how I fix it.</p>
        </div>
      </section>

      <section className="area-tiles" aria-label="What I help with">
        {areas.map((a) => (
          <Link key={a.slug} href={`/services/${a.slug}`} className={`area-tile tone-${a.tone}`}>
            <div className="container">
              <span className="tile-stage">{a.stages}</span>
              <span className="tile-name">{a.name}</span>
              <span className="tile-line">{a.headline}</span>
              <span className="tile-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="section">
        <div className="container">
          <div className="more-grid">
            {more.map((m) => (
              <Link key={m.href} href={m.href} className="more-link">
                <span className="more-title">{m.title}</span>
                <span className="more-body">{m.body}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
