export default function BioCore({ size = 120, glow = "var(--accent-base)", className = "mx-auto mb-1.5" }) {
  return (
    <div className={`biocore relative ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <defs>
          <filter id="bioGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <g className="ring-outer">
          <polygon points="60,10 100,32 100,78 60,100 20,78 20,32" fill="none" stroke={glow} strokeWidth="1.2" strokeDasharray="6 8" opacity=".45" filter="url(#bioGlow)"/>
        </g>
        <circle cx="60" cy="60" r="34" fill="none" stroke={glow} strokeWidth="1" opacity=".3"/>
        <g className="ring-inner">
          <circle cx="60" cy="60" r="24" fill="none" stroke={glow} strokeWidth="1.5" strokeDasharray="4 10" filter="url(#bioGlow)"/>
        </g>
        <circle cx="60" cy="60" r="10" fill={glow} opacity=".8" filter="url(#bioGlow)">
          <animate attributeName="r" values="9;12;9" dur="2.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values=".7;1;.7" dur="2.4s" repeatCount="indefinite"/>
        </circle>
      </svg>
    </div>
  );
}