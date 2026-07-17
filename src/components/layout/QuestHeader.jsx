export default function QuestHeader({ step, total, label }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="w-full max-w-[760px] mx-auto mb-[34px]">
      <div className="flex justify-between items-baseline mb-2.5">
        <span className="font-mono text-xs tracking-[.18em] uppercase text-text-dim">{label} · Step {step} of {total}</span>
        <span className="font-mono text-xs text-mint">{pct}% SYNCED</span>
      </div>
      <div className="h-2 rounded-full bg-white/[.05] overflow-hidden border border-white/[.08] relative backdrop-blur-sm">
        <div className="xp-fill h-full rounded-full bg-gradient-to-r from-mint to-[#00d4ff] shadow-[0_0_16px_rgba(0,232,157,.30)]" style={{ width: pct + '%' }} />
      </div>
    </div>
  );
}