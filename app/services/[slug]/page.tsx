import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { areas, offers, aud, BOOKING_URL } from "../../lib/content";
import CtaBand from "../../components/CtaBand";
import AreaArt from "../../components/AreaArt";

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = areas.find((x) => x.slug === slug);
  return a ? { title: a.name, description: a.intro } : {};
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = areas.find((x) => x.slug === slug);
  if (!a) notFound();
  const others = areas.filter((x) => x.slug !== a.slug);

  return (
    <>
      <section className={`area-hero tone-${a.tone}`}>
        <div className="container area-hero-inner">
          <div>
            <span className="area-kicker">{a.stages}</span>
            <h1>{a.headline}</h1>
            <p className="lead">{a.intro}</p>
            <div className="btn-row">
              <a className="btn btn-dark" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a 20 minute chat</a>
            </div>
          </div>
          <AreaArt tone={a.tone} />
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <h2>Where it usually leaks</h2>
          <ul className={`leak-list tone-${a.tone}`}>
            {a.leaks.map((l) => <li key={l}>{l}</li>)}
          </ul>
        </div>
      </section>

      <section className="section dots">
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
          <p className="formats"><strong>Ways to work together:</strong> {a.formats.join(", ")}. {a.slug === "systems-and-automation" ? "The five builds have a fixed scope and price. Everything else is bespoke and quoted to suit your business." : "All bespoke, shaped around your business and quoted to suit."}</p>
        </div>
      </section>

      {a.slug === "systems-and-automation" && (
        <section className="section">
          <div className="container">
            <h2>Fixed price builds</h2>
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
          <h2>The rest of the chain</h2>
          <div className="next-areas">
            {others.map((o) => (
              <Link key={o.slug} href={`/services/${o.slug}`} className={`next-area tone-${o.tone}`}>
                <span className="tile-stage">{o.stages}</span>
                <span className="next-name">{o.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
