// Animated illustrations, one per service area. Decorative only.

export default function AreaArt({ tone }: { tone: "gold" | "teal" | "blue" }) {
  if (tone === "gold") {
    // Marketing: a signal radiating out and being picked up
    return (
      <svg className="art art-signal" viewBox="0 0 400 400" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx="200" cy="200" r="40" className="ring" style={{ animationDelay: `${i * 0.9}s` }} />
        ))}
        <circle cx="200" cy="200" r="22" className="core" />
        {[[70, 90], [330, 120], [300, 320], [90, 300], [210, 40]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="9" className="ping" style={{ animationDelay: `${0.8 + i * 0.6}s` }} />
        ))}
      </svg>
    );
  }
  if (tone === "teal") {
    // Revenue: a pipeline narrowing, with work slipping out of one stage
    const bars = [340, 280, 210, 150, 110];
    return (
      <svg className="art art-pipe" viewBox="0 0 400 400" aria-hidden="true">
        {bars.map((w, i) => (
          <rect key={i} x={(400 - w) / 2} y={40 + i * 66} width={w} height="44" rx="22" className="bar" style={{ animationDelay: `${i * 0.12}s` }} />
        ))}
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={302} cy={194} r="7" className="slip" style={{ animationDelay: `${i * 1.1}s` }} />
        ))}
      </svg>
    );
  }
  // Systems: connected nodes with work passing between them
  const nodes = [[80, 90], [200, 70], [320, 110], [110, 230], [250, 210], [340, 300], [170, 330]];
  const links = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 4], [3, 4], [4, 5], [3, 6], [6, 5]];
  return (
    <svg className="art art-net" viewBox="0 0 400 400" aria-hidden="true">
      {links.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} className="wire" />
      ))}
      {links.map(([a, b], i) => (
        <circle key={`p${i}`} r="6" className="pulse" style={{ ["--x1" as string]: `${nodes[a][0]}px`, ["--y1" as string]: `${nodes[a][1]}px`, ["--x2" as string]: `${nodes[b][0]}px`, ["--y2" as string]: `${nodes[b][1]}px`, animationDelay: `${i * 0.45}s` }} />
      ))}
      {nodes.map(([x, y], i) => (
        <rect key={`n${i}`} x={x - 16} y={y - 16} width="32" height="32" rx="8" className="box" />
      ))}
    </svg>
  );
}
