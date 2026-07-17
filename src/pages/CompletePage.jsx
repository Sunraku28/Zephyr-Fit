import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import BioCore from '../components/BioCore';

export default function CompletePage({ payload, onRestart }) {
  useEffect(() => {
    const end = Date.now() + 2200;
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0 }, colors: ['#2fe6ff', '#b24bff', '#ffd23f'] });
      confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#2fe6ff', '#b24bff', '#ffd23f'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({ particleCount: 160, spread: 100, origin: { y: .4 }, colors: ['#ffd23f', '#2fe6ff', '#b24bff', '#35ffa0'] });
  }, []);

  return (
    <div className="screen">
      <div className="w-full max-w-[620px] text-center">
        <BioCore size={110} glow="#35ffa0" />
        <h1 className="text-[clamp(28px,5vw,40px)] font-extrabold tracking-[.02em] bg-gradient-to-r from-green to-cyan bg-clip-text text-transparent my-2.5 mx-0 mb-1">
          Level Initialized
        </h1>
        <p className="text-text-dim text-sm mb-[26px]">Your adaptive plan is compiling. +500 Coins credited.</p>
        
        <div className="terminal glass">
          {`{\n`}
          {`  `}<span className="k">"account"</span>{`: { "username": "${payload.account.username}" },\n`}
          {`  `}<span className="k">"stats"</span>{`: { "age": ${payload.stats.age}, "weightKg": ${payload.stats.weightKg}, "diet": "${payload.stats.diet}" },\n`}
          {`  `}<span className="k">"activityRank"</span>{`: "${payload.activityRank}",\n`}
          {`  `}<span className="k">"bodyConstraints"</span>{`: [${payload.bodyConstraints.map(c => `"${c}"`).join(', ')}]\n`}
          {`}`}
        </div>

        <button className="restart-btn" onClick={onRestart}>&#8635; Restart Journey</button>
      </div>
    </div>
  );
}