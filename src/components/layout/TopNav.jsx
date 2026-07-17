export default function TopNav({ onBack, xp, username, showBack }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between pl-[26px] pr-[70px] py-4">
      {showBack ? (
        <button 
          className="nav-pill flex items-center gap-1.5 text-text-dim px-3.5 py-[9px] rounded-full cursor-pointer text-[13px] tracking-[.03em] transition-all duration-300" 
          style={{ '--hover-color': 'var(--accent-base)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-base)'}
          onMouseLeave={e => e.currentTarget.style.color = ''}
          onClick={onBack}
        >
          &#8592; Back
        </button>
      ) : <span />}
      <div className="nav-pill flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[13px]" style={{ color: 'var(--accent-base)' }}>
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: 'var(--accent-base)', boxShadow: '0 0 10px var(--accent-shadow)' }} /> 
        {username ? `OPERATIVE: ${username.toUpperCase()}` : 'GUEST'} &nbsp;·&nbsp; {xp} XP
      </div>
    </div>
  );
}