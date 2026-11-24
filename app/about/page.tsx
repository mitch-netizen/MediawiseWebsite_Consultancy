import type { Metadata } from "next";
import Image from "next/image";
import CtaBand from "../components/CtaBand";

export const metadata: Metadata = {
  title: "About Mitch Harris",
  description: "A decade in commercial leadership, from Southern Cross Austereo to Coca-Cola Amatil. Now helping regional businesses grow revenue and automate the admin.",
};

export default function About() {
  return (
    <>
      <section className="hero dots">
        <div className="container">
          <span className="eyebrow">About</span>
          <h1>I&apos;ve run the revenue. <span className="accent">Now I help you run yours.</span></h1>
          <p className="lead">I&apos;m Mitch Harris. I started Mediawise Solutions in 2023 to give regional businesses the senior commercial help that&apos;s usually only available to big companies in big cities.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
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
                <li>Fixed scope and fixed price, agreed before I start</li>
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

      <section className="section dots" style={{ paddingTop: 0 }}>
        <div className="container split">
          <Image src="/logo-vertical-dark.png" alt="Mediawise Solutions" width={227} height={272} style={{ maxWidth: 220 }} />
          <div>
            <h2>Based in Central Queensland</h2>
            <p>I&apos;m based in Central Queensland and work with businesses right across Australia, in person around Gladstone and Rockhampton and online everywhere else.</p>
            <p className="serif">Revenue strategy that moves.</p>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
