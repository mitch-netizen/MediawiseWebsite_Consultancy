import { BOOKING_URL } from "../lib/content";

export default function CtaBand({ title = "Let's find your time back.", text = "20 minutes, no slides, no hard sell. Just a straight look at where the time and money is going." }: { title?: string; text?: string }) {
  return (
    <section className="cta-band section-tight">
      <div className="container">
        <div>
          <h2>{title}</h2>
          <p className="muted" style={{ marginTop: 12, marginBottom: 0 }}>{text}</p>
        </div>
        <a className="btn btn-primary" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a 20 minute chat</a>
      </div>
    </section>
  );
}
