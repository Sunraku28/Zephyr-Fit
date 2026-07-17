import { JOINTS } from '../data/joints';

function FigureOutline({ cx }) {
  return (
    <g className="figure-outline" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
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

export default function AnatomyScan({ constraints, toggleJoint, size = 320 }) {
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 340 400" className="w-full" style={{ maxWidth: size }}>
        <FigureOutline cx={90} />
        <g opacity=".35"><FigureOutline cx={250} /></g>
        {JOINTS.filter(j => j.view === 'front').map(j => (
          <JointDot key={j.id} joint={j} active={constraints.includes(j.constraintId)} onToggle={(id) => toggleJoint(JOINTS.find(x => x.id === id))} />
        ))}
        {JOINTS.filter(j => j.view === 'back').map(j => (
          <JointDot key={j.id} joint={j} active={constraints.includes(j.constraintId)} onToggle={(id) => toggleJoint(JOINTS.find(x => x.id === id))} />
        ))}
      </svg>
      <div className="flex justify-between w-full font-mono text-[11px] tracking-[.15em] text-text-dimmer mt-2 uppercase" style={{ maxWidth: size }}>
        <span>&#8592; FRONT</span><span>BACK &#8594;</span>
      </div>
    </div>
  );
}
