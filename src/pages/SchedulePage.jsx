import React from 'react';
import TopNav from '../components/layout/TopNav';
import QuestHeader from '../components/layout/QuestHeader';

const EQUIPMENT_OPTIONS = [
  { id: 'full_gym', name: 'Full Gym', desc: 'Access to machines, barbells, etc.' },
  { id: 'dumbbells_bands', name: 'Dumbbells / Bands', desc: 'Basic home gym setup.' },
  { id: 'no_equipment', name: 'No Equipment', desc: 'Bodyweight only.' }
];

export default function SchedulePage({ workoutDays, setWorkoutDays, equipment, setEquipment, onNext, onBack, xp, username }) {
  const ready = workoutDays && equipment;

  return (
    <div className="screen">
      <TopNav onBack={onBack} xp={xp} username={username} showBack />
      <QuestHeader step={4} total={5} label="Character Creation" />
      <span className="eyebrow w-full text-center">Schedule Protocol</span>
      <h2 className="step-title w-full text-center">Time & Equipment</h2>
      <p className="step-desc text-center mx-auto mb-7">How many days per week can you dedicate, and what equipment do you have?</p>

      <div className="flex flex-wrap justify-center gap-4 w-full max-w-[640px] mb-8">
        {[1, 2, 3, 4, 5, 6, 7].map(days => {
          const active = workoutDays === days;
          const dimmed = workoutDays && !active;
          return (
            <div 
              key={days}
              className={"glass rank-card w-24 h-24 flex flex-col items-center justify-center cursor-pointer" + (active ? ' active' : '') + (dimmed ? ' dimmed' : '')} 
              onClick={() => setWorkoutDays(days)}
            >
              <p className="font-extrabold text-3xl m-0">{days}</p>
              <p className="text-xs text-text-dim uppercase tracking-wider mt-1">{days === 1 ? 'Day' : 'Days'}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-[640px]">
        {EQUIPMENT_OPTIONS.map(opt => {
          const active = equipment === opt.id;
          const dimmed = equipment && !active;
          return (
            <div 
              key={opt.id}
              className={"glass rank-card flex flex-col items-center justify-center cursor-pointer p-4" + (active ? ' active' : '') + (dimmed ? ' dimmed' : '')} 
              onClick={() => setEquipment(opt.id)}
            >
              <p className="font-extrabold tracking-[.06em] text-[14px] m-0 mb-1 text-center">{opt.name}</p>
              <p className="text-[11px] text-text-dim leading-[1.4] m-0 text-center">{opt.desc}</p>
            </div>
          );
        })}
      </div>

      <button className="cta-button max-w-[400px] mt-[34px]" disabled={!ready} onClick={onNext}>Continue &#8594;</button>
    </div>
  );
}
