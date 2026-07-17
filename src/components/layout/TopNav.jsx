export default function TopNav({ onBack, xp, username, showBack }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-[26px] py-4">
      {showBack ? (
        <button 
          className="flex items-center gap-1.5 bg-white/[.04] border border-white/[.10] backdrop-blur-xl text-text-dim px-3.5 py-[9px] rounded-full cursor-pointer text-[13px] tracking-[.03em] transition-all duration-300 hover:text-mint hover:border-mint/30 hover:bg-mint/[.05] hover:shadow-[0_0_20px_rgba(0,232,157,.10)]" 
          onClick={onBack}
        >
          &#8592; Back
        </button>
      ) : <span />}
      <div className="flex items-center gap-2 bg-white/[.04] border border-white/[.10] backdrop-blur-xl px-4 py-2 rounded-full font-mono text-[13px] text-mint">
        <span className="w-[7px] h-[7px] rounded-full bg-mint shadow-[0_0_10px_rgba(0,232,157,.6)]" /> 
        {username ? `OPERATIVE: ${username.toUpperCase()}` : 'GUEST'} &nbsp;·&nbsp; {xp} XP
      </div>
    </div>
  );
}