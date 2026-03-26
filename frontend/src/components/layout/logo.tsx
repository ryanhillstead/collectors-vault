import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 hover:opacity-90 transition-opacity select-none flex-shrink-0"
      aria-label="Collector's Vault"
    >
      <VaultIcon />
      <div className="flex flex-col gap-0.5">
        <span className="logo-text text-2xl">COLLECTOR&apos;S</span>
        <span className="logo-text text-2xl">VAULT</span>
      </div>
    </Link>
  );
}

function VaultIcon() {
  // All coordinates are in a 56×56 viewBox, rendered at height=50
  // to match the two-line text block height.
  const cx = 28, cy = 28;

  // Bolts at 45° on the door ring area (r=16 from door center)
  const bolts = [45, 135, 225, 315].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return { x: cx + 16 * Math.cos(a), y: cy + 16 * Math.sin(a) };
  });

  // Spokes: from wheel ring edge (r=7) to door face edge (r=13)
  const spokes = [0, 90, 180, 270].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return {
      x1: cx + 7 * Math.cos(a), y1: cy + 7 * Math.sin(a),
      x2: cx + 13 * Math.cos(a), y2: cy + 13 * Math.sin(a),
    };
  });

  return (
    <svg
      height="50"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Body shadow */}
      <rect x="5" y="5" width="50" height="50" rx="12" fill="#0D1B2A" opacity="0.35" />

      {/* Main body */}
      <rect x="3" y="3" width="50" height="50" rx="12" fill="#1D4ED8" stroke="#0D1B2A" strokeWidth="2.5" />

      {/* Body top highlight */}
      <ellipse cx="26" cy="9" rx="18" ry="4" fill="white" opacity="0.22" />

      {/* Door outer ring */}
      <circle cx={cx} cy={cy} r="20" fill="#2563EB" stroke="#0D1B2A" strokeWidth="2.5" />

      {/* Door face */}
      <circle cx={cx} cy={cy} r="13" fill="#60A5FA" stroke="#0D1B2A" strokeWidth="2" />

      {/* Door face shine */}
      <ellipse cx="22" cy="21" rx="5" ry="3" fill="white" opacity="0.35" transform="rotate(-30 22 21)" />

      {/* Wheel ring */}
      <circle cx={cx} cy={cy} r="7" fill="none" stroke="#0D1B2A" strokeWidth="3.5" />
      <circle cx={cx} cy={cy} r="7" fill="none" stroke="#FCD34D" strokeWidth="2.5" />

      {/* Spokes */}
      {spokes.map((s, i) => (
        <g key={i}>
          <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#0D1B2A" strokeWidth="3.5" strokeLinecap="round" />
          <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}

      {/* Hub */}
      <circle cx={cx} cy={cy} r="4" fill="#FCD34D" stroke="#0D1B2A" strokeWidth="2" />
      <circle cx={cx} cy={cy} r="2" fill="#0D1B2A" />

      {/* Bolts */}
      {bolts.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r="2.8" fill="#FCD34D" stroke="#0D1B2A" strokeWidth="1.5" />
      ))}

      {/* Left hinges */}
      <rect x="1" y="13" width="5" height="8" rx="2" fill="#FCD34D" stroke="#0D1B2A" strokeWidth="1.5" />
      <rect x="1" y="35" width="5" height="8" rx="2" fill="#FCD34D" stroke="#0D1B2A" strokeWidth="1.5" />
    </svg>
  );
}
