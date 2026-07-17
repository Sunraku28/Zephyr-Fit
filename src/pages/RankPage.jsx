import TopNav from '../components/layout/TopNav';
import QuestHeader from '../components/layout/QuestHeader';
import { RANKS } from '../data/ranks';

export default function RankPage({ rank, setRank, onNext, onBack, xp, username }) {
  return (
    <div className="screen">
      <TopNav onBack={onBack} xp={xp} username={username} showBack />
      <QuestHeader step={3} total={4} label="Character Creation" />
      <span className="eyebrow w-full text-center">Baseline Assessment</span>
      <h2 className="step-title w-full text-center">Choose Your Activity Rank</h2>
      <p className="step-desc text-center mx-auto mb-7">Pick the tier that best matches your current baseline fitness.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-[920px]">
        {RANKS.map(r => {
          const active = rank === r.id;
          const dimmed = rank && !active;
          const Icon = r.Icon;
          return (
            <div 
              key={r.id}
              className={"glass rank-card" + (active ? ' active' : '') + (dimmed ? ' dimmed' : '')}
              onClick={() => setRank(r.id)}
            >
              <span className="font-mono text-[11px] text-text-dimmer tracking-[.15em]">{r.tier}</span>
              <Icon className="w-[46px] h-[46px] my-3.5 mx-auto text-text-dim transition-colors duration-200 active:text-cyan" />
              <p className="font-extrabold tracking-[.06em] text-[15px] m-0 mb-1.5">{r.name}</p>
              <p className="text-xs text-text-dim leading-[1.4] m-0">{r.desc}</p>
            </div>
          );
        })}
      </div>

      <button className="cta-button max-w-[400px] mt-[34px]" disabled={!rank} onClick={onNext}>Continue &#8594;</button>
    </div>
  );
}