import Link from "next/link";

const stages = [
  { stage: "Get found", leak: "Ad spend nobody can tie back to a sale", who: "Marketing", href: "/services/marketing", tone: "gold" },
  { stage: "Win the work", leak: "Quotes that go quiet and never get chased", who: "Revenue and sales", href: "/services/revenue-and-sales", tone: "teal" },
  { stage: "Deliver it", leak: "The same job keyed into three systems", who: "Systems and automation", href: "/services/systems-and-automation", tone: "blue" },
  { stage: "Get paid", leak: "Invoices sitting at 45 days", who: "Systems and automation", href: "/services/systems-and-automation", tone: "blue" },
];

export default function FlowHero() {
  return (
    <div className="flow">
      <div className="flow-track" aria-hidden="true">
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} className="particle" style={{ animationDelay: `${i * -0.9}s` }} />
        ))}
      </div>
      <ol className="flow-stages" aria-label="Where money leaks between enquiry and payment">
        {stages.map((s, i) => (
          <li key={s.stage} className={`tone-${s.tone}`}>
            <Link href={s.href} className="flow-stage">
              <span className="node" aria-hidden="true" />
              <span className="drop" aria-hidden="true" style={{ animationDelay: `${0.6 + i * 0.7}s` }} />
              <span className="stage">{s.stage}</span>
              <span className="leak">{s.leak}</span>
              <span className="who">{s.who}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
