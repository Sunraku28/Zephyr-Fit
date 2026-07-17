import { useEffect, useRef, useCallback, useMemo } from 'react';
import TopNav from '../components/layout/TopNav';
import QuestHeader from '../components/layout/QuestHeader';

const AGE_MIN = 14, AGE_MAX = 80, ITEM_W = 64;

export default function VitalsPage({ stats, setStats, onNext, onBack, xp, username }) {
  const scrollerRef = useRef(null);
  const ages = useMemo(() => Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => AGE_MIN + i), []);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollLeft = (stats.age - AGE_MIN) * ITEM_W;
    }
  }, [stats.age]);

  const handleScroll = useCallback((e) => {
    const idx = Math.round(e.target.scrollLeft / ITEM_W);
    const newAge = Math.min(Math.max(AGE_MIN + idx, AGE_MIN), AGE_MAX);
    setStats(s => s.age === newAge ? s : ({ ...s, age: newAge }));
  }, [setStats]);

  const nudge = (dir) => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: dir * ITEM_W, behavior: 'smooth' });
    }
  };

  const weightPct = ((stats.weightKg - 30) / (180 - 30)) * 100;

  return (
    <div className="screen">
      <TopNav onBack={onBack} xp={xp} username={username} showBack />
      <QuestHeader step={1} total={4} label="Character Creation" />
      <span className="eyebrow w-full text-center">Vitals Scan</span>
      <h2 className="step-title w-full text-center">Calibrate Your Stats</h2>
      <p className="step-desc text-center mx-auto mb-7">These readings tune load, intensity and recovery pacing across your quest.</p>

      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-[22px] w-full max-w-[760px]">
        <div className="glass p-[26px] relative">
          <p className="font-mono text-[11.5px] tracking-[.18em] uppercase text-text-dim m-0 mb-[18px] text-center">Age</p>
          <div className="text-center font-mono text-[44px] font-bold mb-1.5" style={{ color: 'var(--accent-base)', textShadow: '0 0 25px var(--accent-shadow)' }}>
            {stats.age}<span className="text-sm text-text-dim ml-1.5">YRS</span>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 opacity-40 pointer-events-none" style={{ background: 'linear-gradient(to bottom, var(--accent-base), transparent)' }} />
            <div className="age-scroller" ref={scrollerRef} onScroll={handleScroll}>
              {ages.map(a => (
                <div key={a} className={"age-item" + (a === stats.age ? ' center' : '')}>{a}</div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2.5 mt-2">
            <button className="age-nudge" onClick={() => nudge(-1)}>&#8249;</button>
            <button className="age-nudge" onClick={() => nudge(1)}>&#8250;</button>
          </div>
        </div>

        <div className="glass p-[26px]">
          <p className="font-mono text-[11.5px] tracking-[.18em] uppercase text-text-dim m-0 mb-[18px] text-center">Weight</p>
          <div className="flex items-center justify-center gap-[22px]">
            <div className="flex flex-col justify-between h-[230px] font-mono text-[10px] text-text-dimmer"><span>180</span><span>105</span><span>30</span></div>
            <div className="vgauge-wrap w-[54px] h-[230px] relative flex items-center justify-center">
              <div className="absolute w-[14px] h-full rounded-full gauge-track overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full transition-[height] duration-100 linear rounded-full" style={{ height: weightPct + '%', background: 'var(--accent-base)', boxShadow: '0 0 18px var(--accent-shadow)' }} />
              </div>
              <input
                type="range" min="30" max="180" value={stats.weightKg}
                onChange={e => setStats(s => ({ ...s, weightKg: +e.target.value }))}
              />
            </div>
            <div className="text-center">
              <div className="font-mono text-[34px] font-bold text-text">{stats.weightKg}</div>
              <div className="font-mono text-sm text-rose tracking-[.1em]">KG</div>
            </div>
          </div>
        </div>
      </div>

      <button className="cta-button max-w-[400px] mt-[34px]" onClick={onNext}>Continue &#8594;</button>
    </div>
  );
}