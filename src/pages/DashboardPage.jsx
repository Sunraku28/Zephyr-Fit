import { useState, useEffect } from 'react';
import BioCore from '../components/BioCore';
import AnatomyScan from '../components/AnatomyScan';
import ProfileCustomizer from '../components/layout/ProfileCustomizer';
import ExerciseModelAnimation from '../components/ExerciseModelAnimation';

export default function DashboardPage({ payload, setPayload, onRestart, setProfileAssets }) {
  const username = payload?.account?.username || 'User';
  const initial = username.charAt(0).toUpperCase();
  const diet = payload?.stats?.diet || 'balanced';

  const s = payload?.dashboardState || {};

  // UI State
  const [activeTab, setActiveTab] = useState(s.activeTab || 'home');
  const [selectedConstraints, setSelectedConstraints] = useState(s.selectedConstraints || payload?.bodyConstraints || []);
  const [painIntensity, setPainIntensity] = useState(s.painIntensity || 50);
  const [painNotes, setPainNotes] = useState(s.painNotes || '');

  // Schedule View State
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [scheduleMode, setScheduleMode] = useState(s.scheduleMode || null); // 'diet' | 'workout' | null
  const [selectedDay, setSelectedDay] = useState(s.selectedDay || 'Monday');

  // Generate some dynamic mock tasks based on user payload
  const [dietTasks, setDietTasks] = useState(s.dietTasks || [
    { id: 'd1', label: 'Morning Hydration (1L Water)', done: false },
    { id: 'd2', label: diet === 'vegan' ? 'Plant-based Protein Breakfast' : 'High-Protein Breakfast', done: false },
    { id: 'd3', label: diet === 'keto' ? 'Avocado & Greens Lunch' : 'Balanced Greens Lunch', done: false },
    { id: 'd4', label: 'Low-Carb Dinner', done: false },
  ]);

  const [workoutTasks, setWorkoutTasks] = useState(s.workoutTasks || [
    { id: 'w1', label: 'Dynamic Warmup (10m)', done: false },
    { id: 'w2', label: 'Bicep Curls (3x12)', done: false },
    { id: 'w3', label: payload?.activityRank === 'beginner' ? 'Light Core Stabilization' : 'Advanced Core Circuit', done: false },
    { id: 'w4', label: payload?.bodyConstraints?.includes('knee') ? 'Low-Impact Swim/Cycle (20m)' : 'Cardio (20m)', done: false },
  ]);

  const [weeklyTasks, setWeeklyTasks] = useState(s.weeklyTasks || {
    diet: DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: [
        { id: `d1-${day}`, label: 'Morning Hydration (1L Water)', done: false },
        { id: `d2-${day}`, label: diet === 'vegan' ? `Plant-based Protein (${day})` : `High-Protein Breakfast (${day})`, done: false },
        { id: `d3-${day}`, label: diet === 'keto' ? `Low-Carb Meal Prep` : `Balanced Greens Lunch`, done: false },
        { id: `d4-${day}`, label: `Evening Fasting Protocol`, done: false },
      ]
    }), {}),
    workout: DAYS.reduce((acc, day, idx) => ({
      ...acc,
      [day]: [
        { id: `w1-${day}`, label: 'Dynamic Warmup (10m)', done: false },
        { id: `w2-${day}`, label: idx % 2 === 0 ? 'Upper Body Focus' : 'Lower Body / Core Focus', done: false },
        { id: `w3-${day}`, label: idx === 6 ? 'Active Recovery / Stretch' : 'Cardio Finisher (15m)', done: false },
      ]
    }), {})
  });

  const toggleDietTask = (id) => {
    setDietTasks(tasks => tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const toggleWorkoutTask = (id) => {
    setWorkoutTasks(tasks => tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const toggleWeeklyTask = (type, day, id) => {
    setWeeklyTasks(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [day]: prev[type][day].map(t => t.id === id ? { ...t, done: !t.done } : t)
      }
    }));
  };

  const toggleJointSelection = (joint) => {
    setSelectedConstraints(prev => 
      prev.includes(joint.constraintId) 
        ? prev.filter(c => c !== joint.constraintId)
        : [...prev, joint.constraintId]
    );
  };

  const handleSaveSchedule = () => {
    // Save logic would go here
    setActiveTab('home');
  };

  useEffect(() => {
    if (!setPayload) return;
    setPayload(p => ({
      ...p,
      dashboardState: {
        activeTab,
        selectedConstraints,
        painIntensity,
        painNotes,
        scheduleMode,
        selectedDay,
        dietTasks,
        workoutTasks,
        weeklyTasks
      }
    }));
  }, [activeTab, selectedConstraints, painIntensity, painNotes, scheduleMode, selectedDay, dietTasks, workoutTasks, weeklyTasks, setPayload]);

  return (
    <div className="w-full h-screen flex relative z-10 p-4 md:p-6 gap-6 box-border max-w-[1200px] mx-auto">
      {/* Sidebar hidden completely so we use horizontal top navbar */}
      <aside className="hidden">
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[calc(100vh-48px)] overflow-hidden rounded-3xl">
        {/* Header containing horizontal navbar */}
        <header className="relative z-50 flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 glass border border-glass-border rounded-3xl p-4 px-7 shadow-lg">
          <div className="flex items-center gap-3">
            <BioCore size={32} glow="var(--accent-base)" className="" />
            <div>
              <h1 className="text-[20px] md:text-[24px] font-extrabold text-text tracking-tight leading-none">Zephyr Fit</h1>
              <p className="text-[10px] text-text-dim font-mono uppercase tracking-[0.2em] mt-1">Level 1 • {payload?.activityRank || 'Novice'}</p>
            </div>
          </div>
          
          {/* Top Horizontal Navigation Navbar */}
          <nav className="flex items-center gap-2 md:gap-3 bg-glass-bg/50 p-1.5 rounded-2xl border border-glass-border/30">
            <button 
              onClick={() => setActiveTab('home')} 
              className={`px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-all ${activeTab === 'home' ? 'bg-accent-base text-void shadow-[0_0_12px_var(--accent-shadow)]' : 'text-text-dim hover:text-accent-base hover:bg-glass-bg'}`}
            >
              Home
            </button>
            <button 
              onClick={() => { setActiveTab('schedule'); setScheduleMode(null); setSelectedDay('Monday'); }} 
              className={`px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-all ${activeTab === 'schedule' ? 'bg-accent-bg text-accent-base border border-accent-border/50 shadow-[0_0_10px_var(--accent-shadow)]' : 'text-text-dim hover:text-accent-base hover:bg-glass-bg'}`}
            >
              Schedule
            </button>
            <button 
              onClick={() => setActiveTab('heatmap')} 
              className={`px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-all ${activeTab === 'heatmap' ? 'bg-accent-bg text-accent-base border border-accent-border/50 shadow-[0_0_10px_var(--accent-shadow)]' : 'text-text-dim hover:text-accent-base hover:bg-glass-bg'}`}
            >
              Heatmap
            </button>
            <button 
              onClick={() => setActiveTab('update')} 
              className={`px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-all ${activeTab === 'update' ? 'bg-accent-bg text-accent-base border border-accent-border/50 shadow-[0_0_10px_var(--accent-shadow)]' : 'text-text-dim hover:text-accent-base hover:bg-glass-bg'}`}
            >
              Adapt Plan
            </button>
          </nav>

          {/* User Avatar Customizer */}
          <ProfileCustomizer 
            profilePic={payload.account?.profilePic}
            profileFrame={payload.account?.profileFrame}
            setProfileAssets={setProfileAssets}
            onLogout={onRestart}
          />
        </header>

        {activeTab === 'home' ? (
          <div className="flex-1 overflow-y-scroll pr-2 pb-10 flex flex-col gap-6 custom-scrollbar">
            {/* Diet Section */}
            <section className="glass rounded-3xl p-7 border border-glass-border">
              <div className="flex items-center justify-between mb-5 border-b border-glass-border pb-4">
                <h2 className="text-xl font-extrabold text-text flex items-center gap-2">
                  Diet 
                </h2>
                <span className="text-[10px] font-mono text-accent-base uppercase tracking-widest bg-accent-bg border border-accent-border/30 px-3 py-1.5 rounded-lg">
                  {diet}
                </span>
              </div>
              
              <div className="flex flex-col gap-3">
                {dietTasks.map(task => (
                  <label key={task.id} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${task.done ? 'bg-glass-bg border-accent-border/30' : 'border-transparent hover:bg-glass-bg/50 hover:border-glass-border'}`}>
                    <input type="checkbox" className="hidden" checked={task.done} onChange={() => toggleDietTask(task.id)} />
                    <div className={`w-[22px] h-[22px] rounded-md flex items-center justify-center border-2 transition-all ${task.done ? 'bg-accent-base border-accent-base shadow-[0_0_10px_var(--accent-shadow)]' : 'border-text-dim hover:border-accent-base/50'}`}>
                      {task.done && <span className="text-glass-bg text-sm font-bold leading-none select-none">&#10003;</span>}
                    </div>
                    <span className={`text-[15px] font-medium transition-all ${task.done ? 'text-text-dim line-through decoration-text-dimmer/50' : 'text-text'}`}>
                      {task.label}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* Workout Section */}
            <section className="glass rounded-3xl p-7 border border-glass-border">
              <div className="flex items-center justify-between mb-5 border-b border-glass-border pb-4">
                <h2 className="text-xl font-extrabold text-text flex items-center gap-2">
                  Workout
                </h2>
                <span className="text-[10px] font-mono text-accent-base uppercase tracking-widest bg-accent-bg border border-accent-border/30 px-3 py-1.5 rounded-lg">
                  {payload?.bodyConstraints?.length > 0 ? 'Adapted' : 'Standard'}
                </span>
              </div>
              
              <div className="flex flex-col gap-4">
                {workoutTasks.map(task => (
                  <label key={task.id} className={`flex items-center justify-between gap-6 p-5 md:p-6 min-h-[120px] rounded-3xl cursor-pointer transition-all border ${task.done ? 'bg-glass-bg border-accent-border/30' : 'border-transparent hover:bg-glass-bg/50 hover:border-glass-border shadow-sm'}`}>
                    <div className="flex items-center gap-5">
                      <input type="checkbox" className="hidden" checked={task.done} onChange={() => toggleWorkoutTask(task.id)} />
                      <div className={`w-[24px] h-[24px] rounded-md flex items-center justify-center border-2 transition-all flex-shrink-0 ${task.done ? 'bg-accent-base border-accent-base shadow-[0_0_10px_var(--accent-shadow)]' : 'border-text-dim hover:border-accent-base/50'}`}>
                        {task.done && <span className="text-glass-bg text-sm font-bold leading-none select-none">&#10003;</span>}
                      </div>
                      <span className={`text-[16px] font-bold tracking-wide transition-all ${task.done ? 'text-text-dim line-through decoration-text-dimmer/50' : 'text-text'}`}>
                        {task.label}
                      </span>
                    </div>
                    <ExerciseModelAnimation exerciseName={task.label} sizeClass="w-20 h-20 md:w-24 md:h-24" />
                  </label>
                ))}
              </div>
            </section>
          </div>
        ) : activeTab === 'schedule' ? (
          <div className="flex-1 overflow-hidden flex flex-col custom-scrollbar">
            {!scheduleMode ? (
              <div className="h-full flex flex-col items-center justify-center p-4">
                <div className="flex flex-col gap-6 w-full max-w-[400px]">
                  <button 
                    onClick={() => setScheduleMode('diet')}
                    className="glass rounded-3xl p-10 border border-glass-border hover:border-accent-border hover:bg-accent-bg/10 hover:shadow-[0_0_30px_var(--accent-shadow)] transition-all flex flex-col items-center justify-center gap-4 group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-accent-bg flex items-center justify-center text-accent-base group-hover:scale-110 transition-transform">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <h2 className="text-2xl font-extrabold text-text">Diet Schedule</h2>
                    <p className="text-text-dimmer text-sm text-center">View your 7-day nutrition and meal planning breakdown.</p>
                  </button>
                  <button 
                    onClick={() => setScheduleMode('workout')}
                    className="glass rounded-3xl p-10 border border-glass-border hover:border-accent-border hover:bg-accent-bg/10 hover:shadow-[0_0_30px_var(--accent-shadow)] transition-all flex flex-col items-center justify-center gap-4 group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-accent-bg flex items-center justify-center text-accent-base group-hover:scale-110 transition-transform">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>
                    </div>
                    <h2 className="text-2xl font-extrabold text-text">Workout Schedule</h2>
                    <p className="text-text-dimmer text-sm text-center">View your adaptive 7-day fitness routine and recovery days.</p>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="flex items-center justify-between mb-4 px-2">
                  <button onClick={() => setScheduleMode(null)} className="text-text-dim hover:text-accent-base font-medium flex items-center gap-2 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    Back to Selection
                  </button>
                  <h2 className="text-lg font-bold text-text uppercase tracking-widest">{scheduleMode} Plan</h2>
                </div>
                
                {/* 7-Day Navigation Bar */}
                <div className="glass rounded-2xl p-2 mb-6 border border-glass-border flex overflow-x-auto scrollbar-hide">
                  {DAYS.map(day => (
                    <button 
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`flex-1 min-w-[80px] px-3 py-2.5 rounded-xl font-bold text-sm transition-all text-center ${selectedDay === day ? 'bg-accent-base text-void shadow-md' : 'text-text-dim hover:bg-glass-bg hover:text-accent-base'}`}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>

                {/* Day Content */}
                <div className="flex-1 overflow-y-scroll pr-2 pb-10 custom-scrollbar">
                  <section className="glass rounded-3xl p-7 border border-glass-border">
                    <div className="flex items-center justify-between mb-5 border-b border-glass-border pb-4">
                      <h2 className="text-xl font-extrabold text-text flex items-center gap-2">
                        {selectedDay} {scheduleMode === 'diet' ? 'Meals' : 'Routine'}
                      </h2>
                      <span className="text-[10px] font-mono text-accent-base uppercase tracking-widest bg-accent-bg border border-accent-border/30 px-3 py-1.5 rounded-lg">
                        {scheduleMode === 'diet' ? diet : (payload?.bodyConstraints?.length > 0 ? 'Adapted' : 'Standard')}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      {weeklyTasks[scheduleMode][selectedDay].map(task => (
                        <div key={task.id} className={`flex items-center justify-between gap-6 ${scheduleMode === 'workout' ? 'p-5 md:p-6 min-h-[120px]' : 'p-4'} rounded-3xl border border-glass-border bg-glass-bg/30`}>
                          <div className="flex items-center gap-4">
                            {scheduleMode !== 'workout' && (
                              <div className="w-[10px] h-[10px] rounded-full bg-accent-base shadow-[0_0_8px_var(--accent-shadow)] flex-shrink-0"></div>
                            )}
                            <span className="text-[16px] font-bold text-text tracking-wide">
                              {task.label}
                            </span>
                          </div>
                          {scheduleMode === 'workout' && (
                            <ExerciseModelAnimation exerciseName={task.label} sizeClass="w-20 h-20 md:w-24 md:h-24" />
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'heatmap' ? (
          <div className="flex-1 overflow-y-scroll pr-2 pb-10 flex flex-col gap-6 custom-scrollbar">
            <section className="glass rounded-3xl p-7 border border-glass-border flex flex-col h-full">
              <h2 className="text-xl font-extrabold text-text mb-6">Activity Heatmap</h2>
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 90 }).map((_, i) => {
                  const intensity = Math.random();
                  let colorClass = 'bg-glass-bg border border-glass-border';
                  if (intensity > 0.8) colorClass = 'bg-accent-base border-accent-base shadow-[0_0_8px_var(--accent-shadow)]';
                  else if (intensity > 0.5) colorClass = 'bg-accent-base/70 border-accent-base/70';
                  else if (intensity > 0.2) colorClass = 'bg-accent-base/40 border-accent-base/40';
                  
                  return (
                    <div 
                      key={i} 
                      className={`w-4 h-4 md:w-5 md:h-5 rounded-md ${colorClass} transition-all hover:scale-110 cursor-pointer`}
                      title={`Day ${90 - i} days ago`}
                    />
                  );
                })}
              </div>
              <div className="mt-8 flex items-center justify-end gap-3 text-sm text-text-dim">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-md bg-glass-bg border border-glass-border" />
                  <div className="w-4 h-4 rounded-md bg-accent-base/40" />
                  <div className="w-4 h-4 rounded-md bg-accent-base/70" />
                  <div className="w-4 h-4 rounded-md bg-accent-base shadow-[0_0_8px_var(--accent-shadow)]" />
                </div>
                <span>More</span>
              </div>
            </section>
          </div>
        ) : (
          <div className="flex-1 overflow-y-scroll pr-2 pb-10 flex flex-col gap-6 custom-scrollbar">
            <section className="glass rounded-3xl p-7 border border-glass-border flex flex-col h-full">
              <h2 className="text-xl font-extrabold text-text mb-2">Update Schedule</h2>
              <p className="text-text-dim text-sm mb-6">Log any new pain points or stiffness to adapt your workout schedule.</p>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="flex flex-col items-center bg-glass-bg rounded-2xl border border-glass-border p-6 h-full">
                  <AnatomyScan constraints={selectedConstraints} toggleJoint={toggleJointSelection} size={280} />
                </div>
                
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="block text-sm font-bold text-text mb-3">Pain Intensity</label>
                    <div className="relative w-full h-10 flex items-center bg-input-bg rounded-full border border-input-border px-4">
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={painIntensity} 
                        onChange={(e) => setPainIntensity(e.target.value)} 
                        className="w-full h-full opacity-0 absolute inset-0 cursor-pointer z-10"
                      />
                      <div className="w-full h-1.5 bg-glass-border rounded-full relative overflow-hidden pointer-events-none">
                        <div className="h-full bg-accent-base" style={{ width: `${painIntensity}%` }}></div>
                      </div>
                      <div className="absolute top-1/2 -mt-3 w-6 h-6 rounded-full bg-accent-base border-2 border-[var(--glass-bg)] shadow-[0_0_12px_var(--accent-shadow)] pointer-events-none" style={{ left: `calc(16px + (100% - 32px) * ${painIntensity / 100} - 12px)` }}></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs font-mono uppercase tracking-widest text-text-dim">
                      <span>Mild</span>
                      <span>Moderate</span>
                      <span>Extreme</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text mb-3">Context & Notes</label>
                    <textarea 
                      className="w-full bg-input-bg border border-input-border rounded-2xl p-4 text-sm text-text focus:border-accent-base focus:bg-accent-bg focus:outline-none transition-all resize-none min-h-[120px]"
                      placeholder="E.g., Felt a sharp pain during squats yesterday..."
                      value={painNotes}
                      onChange={(e) => setPainNotes(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="mt-auto pt-4">
                    <button onClick={handleSaveSchedule} className="cta-button w-full shadow-[0_0_20px_var(--accent-shadow)]">
                      Save & Adapt Plan
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
