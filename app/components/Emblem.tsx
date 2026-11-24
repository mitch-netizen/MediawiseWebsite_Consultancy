// Line-art emblems for the three service areas. Decorative.
type Tone = "gold" | "teal" | "blue";

export function Emblem({ tone, size = 400 }: { tone: Tone; size?: number }) {
  const s = { width: "100%", maxWidth: size, height: "auto", display: "block" } as const;
  if (tone === "gold") {
    return (
      <svg viewBox="0 0 360 360" aria-hidden="true" style={s}>
        <circle cx="180" cy="180" r="170" fill="none" stroke="#d8c38a" strokeWidth="1" opacity="0.35" />
        <circle cx="180" cy="180" r="132" fill="none" stroke="#d8c38a" strokeWidth="1" opacity="0.6" />
        <circle cx="180" cy="180" r="94" fill="none" stroke="#d8c38a" strokeWidth="1.25" />
        <circle cx="180" cy="180" r="56" fill="none" stroke="#ffffff" strokeWidth="1.25" />
        <circle cx="180" cy="180" r="18" fill="#d8c38a" />
        <circle cx="273" cy="87" r="7" fill="#02d8be" />
        <circle cx="86" cy="248" r="5" fill="#ffffff" opacity="0.8" />
        <circle cx="300" cy="250" r="4" fill="#ffffff" opacity="0.6" />
      </svg>
    );
  }
  if (tone === "teal") {
    return (
      <svg viewBox="0 0 360 360" aria-hidden="true" style={s}>
        <line x1="20" y1="60" x2="340" y2="60" stroke="#d8c38a" strokeWidth="1" opacity="0.45" />
        <line x1="55" y1="120" x2="305" y2="120" stroke="#d8c38a" strokeWidth="1" opacity="0.65" />
        <line x1="90" y1="180" x2="270" y2="180" stroke="#d8c38a" strokeWidth="1.25" />
        <line x1="125" y1="240" x2="235" y2="240" stroke="#ffffff" strokeWidth="1.25" />
        <line x1="155" y1="300" x2="205" y2="300" stroke="#02d8be" strokeWidth="4" strokeLinecap="round" />
        <g fill="#ffffff" opacity="0.75">
          <circle cx="20" cy="60" r="3" /><circle cx="340" cy="60" r="3" />
          <circle cx="55" cy="120" r="3" /><circle cx="305" cy="120" r="3" />
          <circle cx="90" cy="180" r="3" /><circle cx="270" cy="180" r="3" />
        </g>
        <path d="M305 120 C 330 140, 340 175, 332 215" fill="none" stroke="#d8c38a" strokeWidth="1" strokeDasharray="2 6" />
        <circle cx="332" cy="222" r="5" fill="#d8c38a" />
        <circle cx="180" cy="300" r="10" fill="none" stroke="#02d8be" strokeWidth="1" opacity="0.6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 360 360" aria-hidden="true" style={s}>
      <g stroke="#d8c38a" strokeWidth="1" opacity="0.7">
        <line x1="60" y1="70" x2="180" y2="50" /><line x1="180" y1="50" x2="300" y2="90" />
        <line x1="60" y1="70" x2="90" y2="200" /><line x1="180" y1="50" x2="220" y2="180" />
        <line x1="300" y1="90" x2="220" y2="180" /><line x1="90" y1="200" x2="220" y2="180" />
        <line x1="220" y1="180" x2="300" y2="290" /><line x1="90" y1="200" x2="150" y2="310" />
        <line x1="150" y1="310" x2="300" y2="290" />
      </g>
      <g fill="#223447" stroke="#ffffff" strokeWidth="1.25">
        <rect x="44" y="54" width="32" height="32" rx="6" /><rect x="164" y="34" width="32" height="32" rx="6" />
        <rect x="284" y="74" width="32" height="32" rx="6" /><rect x="74" y="184" width="32" height="32" rx="6" />
        <rect x="134" y="294" width="32" height="32" rx="6" />
      </g>
      <rect x="200" y="160" width="40" height="40" rx="8" fill="#0097e0" />
      <rect x="284" y="274" width="32" height="32" rx="6" fill="none" stroke="#5cc6f7" strokeWidth="1.5" />
      <circle cx="260" cy="235" r="5" fill="#5cc6f7" />
      <circle cx="120" cy="60" r="4" fill="#ffffff" opacity="0.8" />
    </svg>
  );
}

// Small dark-ink icons for the services list on light backgrounds
export function MiniEmblem({ tone }: { tone: Tone }) {
  const s = { width: 88, height: 88, display: "block", flex: "none" } as const;
  if (tone === "gold") {
    return (
      <svg viewBox="0 0 96 96" aria-hidden="true" style={s}>
        <circle cx="48" cy="48" r="8" fill="#1b2b3a" />
        <circle cx="48" cy="48" r="20" fill="none" stroke="#1b2b3a" strokeWidth="1.5" />
        <circle cx="48" cy="48" r="32" fill="none" stroke="#1b2b3a" strokeWidth="1.5" opacity="0.6" />
        <circle cx="48" cy="48" r="44" fill="none" stroke="#b39a52" strokeWidth="1.5" />
      </svg>
    );
  }
  if (tone === "teal") {
    return (
      <svg viewBox="0 0 96 96" aria-hidden="true" style={s}>
        <line x1="8" y1="20" x2="88" y2="20" stroke="#1b2b3a" strokeWidth="1.5" />
        <line x1="18" y1="38" x2="78" y2="38" stroke="#1b2b3a" strokeWidth="1.5" />
        <line x1="28" y1="56" x2="68" y2="56" stroke="#1b2b3a" strokeWidth="1.5" />
        <line x1="38" y1="74" x2="58" y2="74" stroke="#00705f" strokeWidth="3" />
        <circle cx="86" cy="52" r="4" fill="#00705f" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" style={s}>
      <g stroke="#1b2b3a" strokeWidth="1.5">
        <line x1="20" y1="22" x2="72" y2="22" /><line x1="20" y1="22" x2="30" y2="70" />
        <line x1="72" y1="22" x2="30" y2="70" /><line x1="72" y1="22" x2="78" y2="66" />
        <line x1="30" y1="70" x2="78" y2="66" />
      </g>
      <g fill="#f5f7f6" stroke="#1b2b3a" strokeWidth="1.5">
        <rect x="12" y="14" width="16" height="16" rx="3" /><rect x="64" y="14" width="16" height="16" rx="3" />
        <rect x="22" y="62" width="16" height="16" rx="3" />
      </g>
      <rect x="70" y="58" width="16" height="16" rx="3" fill="#006ca3" />
    </svg>
  );
}

export function Arrow({ color = "currentColor" }: { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 28, height: 28, flex: "none" }}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}
