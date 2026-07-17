import TopNav from '../components/layout/TopNav';
import QuestHeader from '../components/layout/QuestHeader';
import { JOINTS } from '../data/joints';

function FigureOutline({ cx }) {
  return (
    <g stroke="rgba(150,170,255,.35)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx={cx} cy={34} r="16"/>
      <line x1={cx} y1={50} x2={cx} y2={70}/>
      <path d={`M${cx-27},96 L${cx-18},70 L${cx+18},70 L${cx+27},96 L${cx+20},205 L${cx-20},205 Z`}/>
      <line x1={cx-27} y1={96} x2={cx-34} y2={150}/>
      <line x1={cx+27} y1={96} x2={cx+34} y2={150}/>
      <line x1={cx-16} y1={205} x2={cx-18} y2={288}/>
      <line x1={cx+16} y1={205} x2={cx+18} y2={288}/>
      <line x1={cx-18} y1={288} x2={cx-16} y2={362}/>
      <line x1={cx+18} y1={288} x2={cx+16} y2={362}/>
    </g>
  );
}

function JointDot({ joint, active, onToggle }) {
  return (
    <g 
      className={"joint-dot" + (active ? ' active' : '')} 
      onClick={() => onToggle(joint.id)} 
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(joint.id); }}
    >
      <circle className="joint-ring-outer" cx={joint.cx} cy={joint.cy} r="9"/>
      <circle className="joint-core" cx={joint.cx} cy={joint.cy} r="4.5"/>
      <circle cx={joint.cx} cy={joint.cy} r="13" fill="transparent"/>
    </g>
  );
}

export default function MapPage({ constraints, toggleJoint, onFinish, onBack, xp, username }) {
  const activeJoints = JOINTS.filter(j => constraints.includes(j.constraintId));

  return (
    <div className="screen">
      <TopNav onBack={onBack} xp={xp} username={username} showBack />
      <QuestHeader step={4} total={4} label="Character Creation" />
      <span className="eyebrow w-full text-center">Vulnerability Map</span>
      <h2 className="step-title w-full text-center">Scan Your Body Constraints</h2>
      <p className="step-desc text-center mx-auto mb-6">Tap any joint that needs care. We'll auto-exclude risky movements.</p>

      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-5 w-full max-w-[1040px] items-stretch">
        <div className="glass p-[22px] flex flex-col items-center">
          <p className="font-mono text-[11.5px] tracking-[.18em] uppercase text-text-dim m-0 mb-[18px] text-center">Anatomy Scan</p>
          <svg viewBox="0 0 340 400" className="w-full max-w-[320px]">
            <FigureOutline cx={90} />
            <g opacity=".35"><FigureOutline cx={250} /></g>
            {JOINTS.filter(j => j.view === 'front').map(j => (
              <JointDot key={j.id} joint={j} active={constraints.includes(j.constraintId)} onToggle={(id) => toggleJoint(JOINTS.find(x => x.id === id))} />
            ))}
            {JOINTS.filter(j => j.view === 'back').map(j => (
              <JointDot key={j.id} joint={j} active={constraints.includes(j.constraintId)} onToggle={(id) => toggleJoint(JOINTS.find(x => x.id === id))} />
            ))}
          </svg>
          <div className="flex justify-between w-full max-w-[320px] font-mono text-[11px] tracking-[.15em] text-text-dimmer mt-2 uppercase">
            <span>&#8592; FRONT PROFILE</span><span>BACK PROFILE &#8594;</span>
          </div>
        </div>

        <div className="glass p-[22px] flex flex-col">
          <p className="font-mono text-[11.5px] tracking-[.18em] uppercase text-text-dim m-0 mb-[18px] text-center">Active Body Constraints</p>
          <div className="flex-1 overflow-y-auto mt-1.5 pr-0.5">
            {activeJoints.length === 0 && (
              <div className="text-text-dimmer text-[13.5px] text-center py-7 px-2.5 border border-dashed border-panel-border rounded-xl">
                No constraints logged. Tap a joint on the scan to flag pain or stiffness.
              </div>
            )}
            {activeJoints.map(j => (
              <div className="badge-card" key={j.id}>
                <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold tracking-[.04em] text-red bg-red/15 border border-red/35 px-2.5 py-1 rounded-full mb-1.5">
                  &#9888; {j.badge}
                </div>
                <p className="text-[12.5px] text-text-dim leading-[1.45] m-0">
                  Excluding: <b className="text-green font-semibold">{j.exclude.join(', ')}</b>. Activating low-impact alternatives.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="map-cta" onClick={onFinish}>Generate Adaptive Plan (+500 Coins)</button>
    </div>
  );
}