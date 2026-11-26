import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { offers, offerPayments, aud, BOOKING_URL, SITE_URL } from "../../lib/content";
import { pageMeta } from "../../lib/seo";
import JsonLd from "../../components/JsonLd";
import CtaBand from "../../components/CtaBand";

export function generateStaticParams() {
  return offers.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const o = offers.find((x) => x.slug === slug);
  return o ? pageMeta(`/automation/${o.slug}`, `${o.name}: Fixed Price Automation`, `${o.fixes} Fixed price ${aud(o.price)} plus GST, built in Power Automate and live in ${o.weeks} weeks.`) : {};
}

export default async function OfferPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const o = offers.find((x) => x.slug === slug);
  if (!o) notFound();
  const others = offers.filter((x) => x.slug !== o.slug);
  const url = `${SITE_URL}/automation/${o.slug}`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: o.name,
        serviceType: "Business process automation",
        description: `${o.problem} ${o.fixes}`,
        url,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Australia" },
        offers: {
          "@type": "Offer",
          url,
          price: o.price,
          priceCurrency: "AUD",
          priceSpecification: { "@type": "PriceSpecification", price: o.price, priceCurrency: "AUD", valueAddedTaxIncluded: false },
          description: `Fixed price, live in ${o.weeks} weeks. Optional care plan from ${aud(o.carePlan)} plus GST a month.`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Automation builds", item: `${SITE_URL}/automation` },
          { "@type": "ListItem", position: 3, name: o.name, item: url },
        ],
      },
    ],
  };
  return (
    <>
      <JsonLd data={ld} />
      <section className="hero">
        <div className="container">
          <span className="eyebrow">{o.name}</span>
          <h1>{o.headline}</h1>
          <p className="lead" style={{ marginTop: 24 }}>{o.problem}</p>
          <p className="serif">{o.fixes}</p>
          <div className="btn-row">
            <a className="btn btn-primary" href={offerPayments[o.slug].url} rel="noopener noreferrer">Pay {aud(offerPayments[o.slug].deposit)} + GST deposit to book</a>
            <a className="btn btn-ghost" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a 20 minute chat</a>
            <Link className="btn btn-ghost" href="/contact">Send an enquiry</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <h2>What I build</h2>
            <ul className="checks">
              {o.included.map((i) => <li key={i}>{i}</li>)}
              <li>A 45 minute handover with a recorded walkthrough and a one page how to guide</li>
              <li>14 days of support after go live</li>
              <li>A results report 30 days after go live</li>
            </ul>
          </div>
          <div>
            <div className="card featured" style={{ marginBottom: 24 }}>
              <span className="eyebrow">Fixed price</span>
              <div className="price-tag" style={{ marginTop: 0 }}>{aud(o.price)} <span className="small muted">+ GST</span></div>
              <p style={{ marginTop: 16 }}>Live in {o.weeks} weeks (day {o.goLiveDay} from kickoff). Optional care plan from {aud(o.carePlan)} + GST a month after that.</p>
              <p className="muted small" style={{ marginBottom: 0 }}>50% deposit to book your start date, 50% on go live.</p>
            </div>
            <h3>What we measure</h3>
            <p className="muted">{o.measure}. We record it before I start and check it again 30 days after go live.</p>
            <h3 style={{ marginTop: 24 }}>Not included</h3>
            <ul className="crosses">
              {o.excluded.map((e) => <li key={e}>{e}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section dots">
        <div className="container">
          <h2>How it runs</h2>
          <div className="steps">
            <div className="step"><h3>Kickoff</h3><p>A 60 minute call, system access, and the baseline number recorded.</p></div>
            <div className="step"><h3>Build</h3><p>I build and test it on your systems while you keep running the business.</p></div>
            <div className="step"><h3>Test</h3><p>You try it with real examples, I fix anything that needs it.</p></div>
            <div className="step"><h3>Go live</h3><p>Switched on, with a handover session and 14 days of support.</p></div>
            <div className="step"><h3>Day 30</h3><p>Before and after numbers, so you can see what changed.</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Other fixes</h2>
          <div className="grid grid-2">
            {others.map((x) => (
              <Link key={x.slug} href={`/automation/${x.slug}`} className="card">
                <h3>{x.name}</h3>
                <p className="muted" style={{ marginBottom: 0 }}>{x.fixes}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
