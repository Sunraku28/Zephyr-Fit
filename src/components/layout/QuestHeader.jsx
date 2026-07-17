export default function QuestHeader({ step, total, label }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="w-full max-w-[760px] mx-auto mb-[34px]">
      <div className="flex justify-between items-baseline mb-2.5">
        <span className="font-mono text-xs tracking-[.18em] uppercase text-text-dim">{label} · Step {step} of {total}</span>
        <span className="font-mono text-xs text-cyan">{pct}% SYNCED</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden border border-panel-border relative">
        <div className="xp-fill h-full rounded-full bg-gradient-to-r from-purple to-cyan shadow-[0_0_14px_rgba(47,230,255,.35)]" style={{ width: pct + '%' }} />
      </div>
    </div>
  );
}