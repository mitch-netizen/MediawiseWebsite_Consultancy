import type { Metadata } from "next";
import { pageMeta } from "../lib/seo";
import Link from "next/link";
import { BOOKING_URL, faqs } from "../lib/content";
import JsonLd from "../components/JsonLd";
import CtaBand from "../components/CtaBand";

export const metadata: Metadata = pageMeta("/how-it-works", "How It Works and FAQs", "How working with Mediawise Solutions runs: a 20 minute chat, a look at where the business is leaking, then the fixes. Plus answers to common questions on pricing, tools and timing.");

const steps = [
  {
    title: "A 20 minute chat",
    body: "You tell me what's not working. I tell you straight whether I can help, and if I can't, who can. No slides and no hard sell.",
    detail: ["Online, or in person around Gladstone and Rockhampton"],
  },
  {
    title: "Find the leaks",
    body: "I spend time inside the business mapping the chain from enquiry to cash, talk to the people doing the work, and look at the numbers. You get a prioritised plan with the cost of each fix.",
    detail: ["Bespoke to your business and quoted upfront"],
  },
  {
    title: "Fix them",
    body: "Either I stay on part time as your marketing and revenue lead, or I build the fixes as projects. Often it's a bit of both. You choose.",
    detail: ["Automation builds have a fixed scope and price", "Everything else is bespoke and quoted to suit"],
  },
  {
    title: "Check the numbers",
    body: "We record the number before a fix goes in and check it again afterwards, so you can see what changed.",
    detail: ["Automation builds include a 30 day results report"],
  },
];

export default function HowItWorks() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Straight talk, then the work.</h1>
          <p className="lead">No strategy deck that sits in a drawer. Here&apos;s how a typical engagement runs.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ol className="journey">
            {steps.map((s) => (
              <li key={s.title}>
                <div>
                  <h2>{s.title}</h2>
                </div>
                <div>
                  <p className="lead">{s.body}</p>
                  <ul className="checks">
                    {s.detail.map((d) => <li key={d}>{d}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
          <div className="btn-row">
            <a className="btn btn-primary" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book the 20 minute chat</a>
            <Link className="btn btn-ghost" href="/pricing">See pricing</Link>
          </div>
        </div>
      </section>

      <section className="section white" id="faq">
        <div className="container intro-split top">
          <h2>Common questions</h2>
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }} />

      <CtaBand />
    </>
  );
}
