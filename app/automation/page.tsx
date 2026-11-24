import type { Metadata } from "next";
import Link from "next/link";
import { offers, aud } from "../lib/content";
import CtaBand from "../components/CtaBand";

export const metadata: Metadata = {
  title: "Automation for regional business",
  description: "Five fixed price automations for regional businesses: enquiries, quotes, invoices, onboarding and weekly numbers. Live in 2 to 3 weeks.",
};

export default function Automation() {
  return (
    <>
      <section className="hero dots">
        <div className="container">
          <span className="eyebrow">Fixed price automation</span>
          <h1>Your admin shouldn&apos;t need a night shift.</h1>
          <p className="lead">Five automations that take the repetitive work off your plate. Fixed price, built in Power Automate on the systems you already pay for, and live in 2 to 3 weeks.</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid grid-2">
          {offers.map((o) => (
            <Link key={o.slug} href={`/automation/${o.slug}`} className="card">
              <h3>{o.name}</h3>
              <p>{o.problem}</p>
              <p className="muted">{o.fixes}</p>
              <div className="price-tag">{aud(o.price)} <span className="small muted">+ GST · live in {o.weeks} weeks</span></div>
              <span className="more">See what&apos;s included</span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand title="Not sure which one?" text="Tell me what eats your week and I'll tell you which fix pays for itself first." />
    </>
  );
}
