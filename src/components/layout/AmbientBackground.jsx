export default function AmbientBackground() {
  const wavePath = "M0,60 Q300,120 600,60 T1200,60 L1200,120 L0,120 Z";
  
  return (
    <div className="ambient" aria-hidden="true">
      <div className="stars" />
      <div className="waves-container">
        <svg className="wave w3" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d={wavePath} />
        </svg>
        <svg className="wave w2" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d={wavePath} />
        </svg>
        <svg className="wave w1" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d={wavePath} />
        </svg>
      </div>
    </div>
  );
}