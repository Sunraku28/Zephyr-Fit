export default function QuestHeader({ step, total, label }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="w-full max-w-[760px] mx-auto mb-[34px]">
      <div className="flex justify-between items-baseline mb-2.5">
        <span className="font-mono text-xs tracking-[.18em] uppercase text-text-dim">{label} · Step {step} of {total}</span>
        <span className="font-mono text-xs" style={{ color: 'var(--accent-base)' }}>{pct}% SYNCED</span>
      </div>
      <div className="progress-track h-2 rounded-full overflow-hidden relative backdrop-blur-sm">
        <div className="xp-fill h-full rounded-full transition-all duration-300" style={{ width: pct + '%', background: 'var(--accent-base)', boxShadow: '0 0 16px var(--accent-shadow)' }} />
      </div>
    </div>
  );
}