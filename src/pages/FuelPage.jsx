import { useState } from 'react';
import TopNav from '../components/layout/TopNav';
import QuestHeader from '../components/layout/QuestHeader';
import IconLeaf from '../components/icons/IconLeaf';
import IconDrumstick from '../components/icons/IconDrumstick';

export default function FuelPage({ diet, setDiet, onNext, onBack, xp, username }) {
  const [bounce, setBounce] = useState(null);

  const choose = (val) => {
    setDiet(val);
    setBounce(val);
    setTimeout(() => setBounce(null), 450);
  };

  return (
    <div className="screen">
      <TopNav onBack={onBack} xp={xp} username={username} showBack />
      <QuestHeader step={2} total={4} label="Character Creation" />
      <span className="eyebrow w-full text-center">Fuel Protocol</span>
      <h2 className="step-title w-full text-center">Choose Your Diet Class</h2>
      <p className="step-desc text-center mx-auto mb-7">Your fuel type shapes the nutrition overlay of your adaptive plan.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-[640px]">
        <div 
          className={"glass fuel-card" + (diet === 'veg' ? ' active' : '') + (bounce === 'veg' ? ' bounce' : '')} 
          onClick={() => choose('veg')}
        >
          <IconLeaf className="w-14 h-14 mx-auto mb-3.5 text-text-dim transition-colors duration-250 active:text-green" />
          <p className="font-extrabold tracking-[.08em] text-base m-0 mb-1">VEG</p>
          <p className="text-[12.5px] text-text-dim m-0">Plant-based fuel matrix</p>
        </div>
        <div 
          className={"glass fuel-card" + (diet === 'non_veg' ? ' active' : '') + (bounce === 'non_veg' ? ' bounce' : '')} 
          onClick={() => choose('non_veg')}
        >
          <IconDrumstick className="w-14 h-14 mx-auto mb-3.5 text-text-dim transition-colors duration-250 active:text-green" />
          <p className="font-extrabold tracking-[.08em] text-base m-0 mb-1">NON-VEG</p>
          <p className="text-[12.5px] text-text-dim m-0">High-protein fuel matrix</p>
        </div>
      </div>

      <button className="cta-button max-w-[400px] mt-[34px]" disabled={!diet} onClick={onNext}>Continue &#8594;</button>
    </div>
  );
}