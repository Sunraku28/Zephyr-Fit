export default function AmbientBackground() {
  // Top-down wave path: fills the top, curvy at the bottom
  const wavePath = "M0,0 L1200,0 L1200,100 C900,180 600,20 300,110 C150,150 50,90 0,90 Z";
  
  return (
    <div className="ambient" aria-hidden="true">
      <div className="plankton" />
      <div className="waves-container">
        <svg className="wave w3" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <path d={wavePath} />
        </svg>
        <svg className="wave w2" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <path d={wavePath} />
        </svg>
        <svg className="wave w1" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <path d={wavePath} />
        </svg>
      </div>
    </div>
  );
}