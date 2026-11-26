import type { Metadata } from "next";
import Link from "next/link";
import { offers, offerPayments, aud, BOOKING_URL, EMAIL, PHONE, PHONE_HREF } from "../lib/content";
import { pageMeta } from "../lib/seo";
import EnquiryForm from "../components/EnquiryForm";

// Campaign landing page: one job, get a 20 minute chat booked. Kept out of search results and the sitemap.
export const metadata: Metadata = {
  ...pageMeta("/get-paid-faster-chat", "Get Paid Faster: Stop Chasing Invoices", "Staged invoice reminders in Xero or MYOB, fixed price and live in about 2 weeks. Book a 20 minute chat."),
  robots: { index: false, follow: true },
};

export default function GetPaidFasterChat() {
  const o = offers.find((x) => x.slug === "get-paid-faster")!;
  const pay = offerPayments[o.slug];
  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="eyebrow">For regional businesses on Xero or MYOB</span>
          <h1>Stop chasing invoices. Get paid faster.</h1>
          <p className="lead" style={{ marginTop: 24 }}>Your accounting system does the follow ups, politely and on time. Fixed price. Live in about {o.weeks} weeks.</p>
          <p className="serif">{aud(o.price)} + GST</p>
          <div className="btn-row">
            <a className="btn btn-primary" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a 20 minute chat<span className="sr-only"> (opens in a new tab)</span></a>
            <a className="btn btn-ghost" href="#details">Or send me a few details</a>
          </div>
          <p className="muted small" style={{ marginTop: 16 }}>Straight talk, no pitch deck. I tell you whether I can help.</p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <h2>The problem</h2>
            <p>{o.problem}</p>
            <p className="muted">{o.fixes}</p>
          </div>
          <div>
            <h3>What you get</h3>
            <ul className="checks">
              {o.included.map((i) => <li key={i}>{i}</li>)}
              <li>A 45 minute handover with a recorded walkthrough</li>
              <li>14 days of support after go live</li>
              <li>A results report 30 days after go live</li>
            </ul>
            <h3 style={{ marginTop: 24 }}>What you don&apos;t get</h3>
            <ul className="crosses">
              {o.excluded.map((e) => <li key={e}>{e}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>How it works</h2>
          <ol className="three-steps">
            <li>
              <span className="step-num tone-gold">1</span>
              <h3>A 20 minute chat</h3>
              <p>You tell me how invoices get chased today. I tell you straight whether I can help.</p>
            </li>
            <li>
              <span className="step-num tone-teal">2</span>
              <h3>Pick a start date</h3>
              <p>A {aud(pay.deposit)} + GST deposit books your kickoff. The build takes about {o.weeks} weeks.</p>
            </li>
            <li>
              <span className="step-num tone-blue">3</span>
              <h3>Go live and measure</h3>
              <p>14 days of support, then a results report 30 days later with your average days to get paid.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <h2>Who is behind it</h2>
            <p>I&apos;m Mitch Harris. I spent ten years in commercial leadership, including as General Sales Manager at Southern Cross Austereo, leading a team of 12 and a portfolio of around $7M. I&apos;m based in Central Queensland, in person around Gladstone and Rockhampton and online Australia wide.</p>
            <p className="muted small">Fixed price {aud(o.price)} + GST, about {o.weeks} weeks to go live. Optional care plan {aud(o.carePlan)} + GST a month after that, 3 month minimum. Want more than one fix? <Link href="/pricing">See the bundles</Link>.</p>
          </div>
          <div id="details" className="card featured">
            <h3>Send me a few details</h3>
            <p>Prefer to talk? Call <a href={PHONE_HREF}>{PHONE}</a> or email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
            <EnquiryForm title="Enquiry form" />
          </div>
        </div>
      </section>
    </>
  );
}
