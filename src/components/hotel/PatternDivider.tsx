export function PatternDivider() {
  return (
    <div className="pattern-divider" aria-hidden="true">
      <span />
      <svg viewBox="0 0 200 28" role="img">
        {/* Central diamond medallion */}
        <path d="M100 4 L108 14 L100 24 L92 14 Z" />
        <path d="M100 8 L104 14 L100 20 L96 14 Z" />
        {/* Side flourishes */}
        <path d="M10 14h44 M146 14h44" />
        {/* Decorative dots */}
        <circle cx="60" cy="14" r="1.5" />
        <circle cx="140" cy="14" r="1.5" />
        <circle cx="74" cy="14" r="1" />
        <circle cx="126" cy="14" r="1" />
        {/* Side arches */}
        <path d="M62 14 Q70 8 78 14 Q86 20 78 14" opacity="0.6" />
        <path d="M122 14 Q130 8 138 14 Q146 20 138 14" opacity="0.6" />
      </svg>
      <span />
    </div>
  );
}
