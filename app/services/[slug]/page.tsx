import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { areas, offers, aud, BOOKING_URL, SITE_URL } from "../../lib/content";
import { pageMeta } from "../../lib/seo";
import JsonLd from "../../components/JsonLd";
import CtaBand from "../../components/CtaBand";
import { Emblem, Arrow } from "../../components/Emblem";

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = areas.find((x) => x.slug === slug);
  return a ? pageMeta(`/services/${a.slug}`, a.seoTitle, a.intro) : {};
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = areas.find((x) => x.slug === slug);
  if (!a) notFound();
  const others = areas.filter((x) => x.slug !== a.slug);
  const isSystems = a.slug === "systems-and-automation";

  const url = `${SITE_URL}/services/${a.slug}`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: a.name,
        serviceType: a.name,
        description: a.intro,
        url,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: [{ "@type": "AdministrativeArea", name: "Central Queensland" }, { "@type": "Country", name: "Australia" }],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${a.name} services`,
          itemListElement: a.work.map((w) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: w.title, description: w.body } })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/#services` },
          { "@type": "ListItem", position: 3, name: a.name, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={ld} />
      <section className="hero">
        <div className="container area-hero-inner">
          <div>
            <p className="kicker"><Link href="/#services">Services</Link> <span aria-hidden="true">/</span> {a.name}</p>
            <h1>{a.headline}</h1>
            <p className="lead">{a.intro}</p>
            <div className="btn-row">
              <a className="btn btn-primary" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a 20 minute chat</a>
            </div>
          </div>
          <div className="area-art"><Emblem tone={a.tone} /></div>
        </div>
      </section>

      <section className="section">
        <div className="container intro-split top">
          <h2>Where it usually leaks</h2>
          <ul className="plain-list">
            {a.leaks.map((l) => <li key={l}>{l}</li>)}
          </ul>
        </div>
      </section>

      <section className="section white">
        <div className="container">
          <h2>What I do</h2>
          <div className={`work-grid tone-${a.tone}`}>
            {a.work.map((w) => (
              <div key={w.title} className="work-item">
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </div>
            ))}
          </div>
          <p className={`note tone-${a.tone}`}>
            {isSystems
              ? "The five automation builds have a fixed scope and price. Everything else is bespoke, shaped around your business and quoted to suit."
              : `All ${a.name.toLowerCase()} work is bespoke, shaped around your business and quoted to suit.`}
          </p>
        </div>
      </section>

      {isSystems && (
        <section className="section">
          <div className="container">
            <h2>Fixed price automation builds</h2>
            <div className="offer-rows">
              {offers.map((o) => (
                <Link key={o.slug} href={`/automation/${o.slug}`} className="offer-row">
                  <h3>{o.name}</h3>
                  <p>{o.fixes}</p>
                  <span className="price">{aud(o.price)} + GST</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <p className="row-stage" style={{ color: "#4a5c69", marginBottom: 20 }}>The rest of the chain</p>
          <div className="next-areas">
            {others.map((o) => (
              <Link key={o.slug} href={`/services/${o.slug}`} className={`next-area tone-${o.tone}`}>
                <span>
                  <span className="next-stage">{o.stages}</span>
                  <span className="next-name">{o.name}</span>
                </span>
                <Arrow />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
