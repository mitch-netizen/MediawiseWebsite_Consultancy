import type { Metadata } from "next";
import { pageMeta } from "../lib/seo";
import CtaBand from "../components/CtaBand";
import JsonLd from "../components/JsonLd";
import { SITE_URL } from "../lib/content";

export const metadata: Metadata = pageMeta("/about", "About Mitch Harris, Marketing and Revenue Consultant", "Mitch Harris spent a decade in commercial leadership, including General Sales Manager at Southern Cross Austereo across Rockhampton, Gladstone and Emerald. He founded Mediawise Solutions in 2023.");

export default function About() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="eyebrow">About</span>
          <h1>I&apos;ve run the revenue. Now I help you run yours.</h1>
          <p className="lead">I&apos;m Mitch Harris. I started Mediawise Solutions in 2023 to give regional businesses the senior commercial help that&apos;s usually only available to big companies in big cities.</p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <h2>The background</h2>
            <p>Most of my career has been spent in commercial leadership, where the numbers are real and the targets don&apos;t move.</p>
            <p>As General Sales Manager at Southern Cross Austereo, I ran a portfolio of around $7M across Rockhampton, Gladstone and Emerald, led a team of 12, and took the region to the number one national regional revenue ranking. I was also one of SCA&apos;s formally recognised internal trainers.</p>
            <p>Before that I worked at Coca-Cola Amatil and in hospitality management with Paul Irvin Hotels and on Heron Island, so I know what it&apos;s like on the other side of the counter too.</p>
          </div>
          <div>
            <div className="card featured">
              <h3>How I work</h3>
              <ul className="checks">
                <li>Direct and honest about fit. If I&apos;m not the right person, I&apos;ll say so.</li>
                <li>Automation builds have a fixed scope and price. Everything else is bespoke to your business.</li>
                <li>Built on the tools you already pay for, set up in your name</li>
                <li>Measured. We record the number before and after.</li>
              </ul>
            </div>
            <div className="card" style={{ marginTop: 24 }}>
              <h3>Certifications</h3>
              <ul className="checks">
                <li>Microsoft Power Automate</li>
                <li>Smartsheet</li>
                <li>Advanced Salesforce CRM reporting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section dots">
        <div className="container split">
          <h2>Track record</h2>
          <ul className="record">
            <li><strong>Southern Cross Austereo</strong>General Sales Manager across Rockhampton, Gladstone and Emerald. Led a team of 12 and a portfolio of around $7M, took the region to the number one national regional revenue ranking, and was one of SCA&apos;s formally recognised internal trainers.</li>
            <li><strong>Coca-Cola Amatil</strong>Commercial and sales experience with one of the country&apos;s biggest distributors.</li>
            <li><strong>Hospitality management</strong>Paul Irvin Hotels and Heron Island, so I know the other side of the counter too.</li>
            <li><strong>Mediawise Solutions</strong>Founded in 2023. Based in Central Queensland, working with businesses right across Australia.</li>
          </ul>
        </div>
      </section>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ProfilePage", url: `${SITE_URL}/about`, mainEntity: { "@id": `${SITE_URL}/#mitch-harris` } }} />
      <CtaBand />
    </>
  );
}
