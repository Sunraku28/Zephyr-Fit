import { useState } from 'react';
import TopNav from '../components/layout/TopNav';
import QuestHeader from '../components/layout/QuestHeader';
import { JOINTS } from '../data/joints';
import AnatomyScan from '../components/AnatomyScan';

export default function MapPage({ constraints, toggleJoint, onFinish, onBack, xp, username }) {
  const activeJoints = JOINTS.filter(j => constraints.includes(j.constraintId));
  const [painIntensities, setPainIntensities] = useState({});

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
                <div className="mt-4 pt-3 border-t border-glass-border">
                  <label className="block text-xs font-bold text-text mb-2">Pain Intensity</label>
                  <div className="relative w-full h-8 flex items-center bg-input-bg rounded-full border border-input-border px-3">
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={painIntensities[j.constraintId] || 50} 
                      onChange={(e) => setPainIntensities({ ...painIntensities, [j.constraintId]: parseInt(e.target.value) })} 
                      className="w-full h-full opacity-0 absolute inset-0 cursor-pointer z-10"
                    />
                    <div className="w-full h-1 bg-glass-border rounded-full relative overflow-hidden pointer-events-none">
                      <div className="h-full bg-accent-base" style={{ width: `${painIntensities[j.constraintId] || 50}%` }}></div>
                    </div>
                    <div className="absolute top-1/2 -mt-2 w-4 h-4 rounded-full bg-accent-base border-2 border-[var(--glass-bg)] shadow-[0_0_8px_var(--accent-shadow)] pointer-events-none" style={{ left: `calc(12px + (100% - 24px) * ${(painIntensities[j.constraintId] || 50) / 100} - 8px)` }}></div>
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] font-mono uppercase tracking-widest text-text-dim">
                    <span>Mild</span>
                    <span>Mod</span>
                    <span>Severe</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="cta-button max-w-[1040px] mt-[22px]" onClick={onFinish}>Generate Adaptive Plan (+500 Coins)</button>
    </div>
  );
}