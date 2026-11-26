import type { Metadata } from "next";
import { pageMeta } from "../lib/seo";
import { BOOKING_URL, EMAIL, PHONE, PHONE_HREF, ENQUIRY_FORM_URL } from "../lib/content";

export const metadata: Metadata = pageMeta("/contact", "Contact Mitch Harris", "Book a 20 minute chat or send an enquiry to Mediawise Solutions. In person around Gladstone and Rockhampton, online Australia wide. Phone 0409 265 711.");

export default function Contact() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container">
          <span className="eyebrow">Contact</span>
          <h1>Tell me what&apos;s eating your week.</h1>
          <p className="lead">Send it through below, or skip straight to a 20 minute chat. You&apos;ll hear back fast either way.</p>
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div>
            <iframe className="form-embed" src={ENQUIRY_FORM_URL} title="Mediawise Solutions enquiry form" loading="lazy" />
          </div>
          <div>
            <div className="card featured">
              <h2 className="h3-style">Prefer to talk?</h2>
              <p>Grab a 20 minute slot. No slides, no hard sell, just a straight look at where the time is going.</p>
              <a className="btn btn-primary" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a 20 minute chat<span className="sr-only"> (opens in a new tab)</span></a>
            </div>
            <div className="card" style={{ marginTop: 24 }}>
              <h2 className="h3-style">Direct</h2>
              <p style={{ marginBottom: 8 }}><a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
              <p style={{ marginBottom: 0 }}><a href={PHONE_HREF}>{PHONE}</a></p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
