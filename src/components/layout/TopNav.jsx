export default function TopNav({ onBack, xp, username, showBack }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-[26px] py-4">
      {showBack ? (
        <button 
          className="flex items-center gap-1.5 bg-panel border border-panel-border text-text-dim px-3.5 py-[9px] rounded-full cursor-pointer text-[13px] tracking-[.03em] transition-all duration-200 hover:text-cyan hover:border-cyan-soft hover:shadow-[0_0_16px_rgba(47,230,255,.15)]" 
          onClick={onBack}
        >
          &#8592; Back
        </button>
      ) : <span />}
      <div className="flex items-center gap-2 bg-panel border border-panel-border px-4 py-2 rounded-full font-mono text-[13px] text-green">
        <span className="w-[7px] h-[7px] rounded-full bg-green shadow-[0_0_8px_#35ffa0]" /> 
        {username ? `OPERATIVE: ${username.toUpperCase()}` : 'GUEST'} &nbsp;·&nbsp; {xp} XP
      </div>
    </div>
  );
}