export default function IconSloth({ className }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.2"/>
      <path d="M16 26c1.5 2 3.5 3 8 3s6.5-1 8-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M17 19h3M28 19h3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M35 14l4-3M13 14l-4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".7"/>
      <text x="34" y="10" fontSize="8" fill="currentColor" opacity=".7" fontFamily="monospace">z</text>
    </svg>
  );
}