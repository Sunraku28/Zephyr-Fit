import TopNav from '../components/layout/TopNav';
import QuestHeader from '../components/layout/QuestHeader';
import { JOINTS } from '../data/joints';
import AnatomyScan from '../components/AnatomyScan';

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
          <AnatomyScan constraints={constraints} toggleJoint={toggleJoint} />
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

      <button className="cta-button max-w-[1040px] mt-[22px]" onClick={onFinish}>Generate Adaptive Plan (+500 Coins)</button>
    </div>
  );
}