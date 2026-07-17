export default function BioCore({ size = 120, glow = "#2fe6ff" }) {
  return (
    <div className="biocore relative mx-auto mb-1.5" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <g className="ring-outer">
          <polygon points="60,10 100,32 100,78 60,100 20,78 20,32" fill="none" stroke={glow} strokeWidth="1.2" strokeDasharray="6 8" opacity=".55"/>
        </g>
        <circle cx="60" cy="60" r="34" fill="none" stroke="#b24bff" strokeWidth="1.4" opacity=".5"/>
        <g className="ring-inner">
          <circle cx="60" cy="60" r="24" fill="none" stroke={glow} strokeWidth="2" strokeDasharray="4 10"/>
        </g>
        <circle cx="60" cy="60" r="10" fill={glow} opacity=".85">
          <animate attributeName="r" values="9;12;9" dur="2.4s" repeatCount="indefinite"/>
        </circle>
      </svg>
    </div>
  );
}