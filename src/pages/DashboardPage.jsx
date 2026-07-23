import { useState, useMemo, useCallback } from 'react';
import BioCore from '../components/BioCore';
import AnatomyScan from '../components/AnatomyScan';
import Heatmap from '../components/Heatmap';
import BadgeSVG, { BADGE_DEFINITIONS } from '../components/BadgeSVG';
import BadgeCelebration from '../components/BadgeCelebration';
import { JOINTS } from '../data/joints';
import ProfileCustomizer from '../components/layout/ProfileCustomizer';

// Timezone-safe local date formatter (avoids UTC shift from toISOString)
function toLocalDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function DashboardPage({ payload, setPayload, onRestart, setProfileAssets }) {
  const username = payload?.account?.username || 'User';
  const initial = username.charAt(0).toUpperCase();
  const diet = payload?.stats?.diet || 'balanced';

  // UI State
  const [activeTab, setActiveTab] = useState('home');
  const [selectedConstraints, setSelectedConstraints] = useState(payload?.bodyConstraints || []);
  const [painIntensities, setPainIntensities] = useState({});
  const [painNotes, setPainNotes] = useState('');
  const [isAdapting, setIsAdapting] = useState(false);
  const [celebratingBadge, setCelebratingBadge] = useState(null);

  // Schedule View State
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayIndex = new Date().getDay() - 1;
  const currentDay = DAYS[todayIndex >= 0 ? todayIndex : 6];
  
  const [scheduleMode, setScheduleMode] = useState(null); // 'diet' | 'workout' | null
  const [selectedDay, setSelectedDay] = useState('Monday');

  const defaultSchedule = payload?.schedule || {
    diet: DAYS.reduce((acc, day) => ({ ...acc, [day]: [] }), {}),
    workout: DAYS.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  };

  const [weeklyTasks, setWeeklyTasks] = useState(defaultSchedule);

  // ── History & Badge Logic ──
  const history = payload?.history || {};

  const { totalDays, currentStreak, longestStreak } = useMemo(() => {
    const historyDates = Object.keys(history).sort();
    const totalDays = historyDates.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    const checkDate = new Date(today);
    while (true) {
      const ds = toLocalDateStr(checkDate);
      if (history[ds]) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else break;
    }

    let longestStreak = 0, tempStreak = 0;
    const allDates = new Set(historyDates);
    if (historyDates.length > 0) {
      const first = new Date(historyDates[0]);
      const last = new Date(historyDates[historyDates.length - 1]);
      const d = new Date(first);
      while (d <= last) {
        if (allDates.has(toLocalDateStr(d))) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
        d.setDate(d.getDate() + 1);
      }
    }
    return { totalDays, currentStreak, longestStreak };
  }, [history]);

  const earnedBadges = useMemo(() => {
    return BADGE_DEFINITIONS.filter(badge => {
      if (badge.type === 'total') return totalDays >= badge.threshold;
      if (badge.type === 'streak') return longestStreak >= badge.threshold;
      return false;
    }).map(b => b.id);
  }, [totalDays, longestStreak]);

  // Check if a new badge was just earned and trigger celebration
  const checkForNewBadges = useCallback((newHistory) => {
    const historyDates = Object.keys(newHistory).sort();
    const newTotal = historyDates.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let newCurrentStreak = 0;
    const checkDate = new Date(today);
    while (true) {
      const ds = toLocalDateStr(checkDate);
      if (newHistory[ds]) {
        newCurrentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else break;
    }

    let newLongest = 0, ts = 0;
    const allDates = new Set(historyDates);
    if (historyDates.length > 0) {
      const first = new Date(historyDates[0]);
      const last = new Date(historyDates[historyDates.length - 1]);
      const d = new Date(first);
      while (d <= last) {
        if (allDates.has(toLocalDateStr(d))) {
          ts++;
          newLongest = Math.max(newLongest, ts);
        } else {
          ts = 0;
        }
        d.setDate(d.getDate() + 1);
      }
    }

    // Check each badge: was NOT earned before, IS earned now
    for (const badge of BADGE_DEFINITIONS) {
      const wasEarned = earnedBadges.includes(badge.id);
      let isNowEarned = false;
      if (badge.type === 'total') isNowEarned = newTotal >= badge.threshold;
      if (badge.type === 'streak') isNowEarned = newLongest >= badge.threshold;
      if (!wasEarned && isNowEarned) {
        setCelebratingBadge(badge);
        return; // Show one at a time
      }
    }
  }, [earnedBadges]);

  const toggleWeeklyTask = (type, day, id) => {
    setWeeklyTasks(prev => {
      const updated = {
        ...prev,
        [type]: {
          ...prev[type],
          [day]: prev[type][day].map(t => t.id === id ? { ...t, done: !t.done } : t)
        }
      };

      // Check if all workout tasks for the current day are done
      if (type === 'workout' && day === currentDay) {
        const allDone = updated.workout[day].every(t => t.done);
        const todayStr = toLocalDateStr(new Date());

        if (allDone && updated.workout[day].length > 0) {
          // Mark today as complete — use functional updater for latest state
          if (setPayload) {
            setPayload(p => {
              const newHistory = { ...(p.history || {}), [todayStr]: true };
              checkForNewBadges(newHistory);
              return { ...p, history: newHistory };
            });
          }
        } else {
          // Remove today from history — use functional updater
          if (setPayload) {
            setPayload(p => {
              const newHistory = { ...(p.history || {}) };
              delete newHistory[todayStr];
              return { ...p, history: newHistory };
            });
          }
        }
      }

      return updated;
    });
  };

  const toggleDietTask = (id) => toggleWeeklyTask('diet', currentDay, id);
  
  const toggleWorkoutTask = (id) => {
    const todayStr = toLocalDateStr(new Date());
    const tasksForDay = weeklyTasks.workout[currentDay] || [];
    const taskIndex = tasksForDay.findIndex(t => t.id === id);
    if (taskIndex === -1) return;
    const task = tasksForDay[taskIndex];
    const isNowDone = !task.done;
    
    // Determine XP for this task
    let xpValue = 1; // normal exercise
    const sets = parseInt(task.sets) || 0;
    const reps = parseInt(task.reps) || 0;
    if (sets >= 4 || reps >= 12 || (sets * reps) > 30) {
      xpValue = 2; // hard exercise
    }

    if (setPayload) {
      setPayload(p => {
        let currentXp = p.xp || 0;
        let xpHistory = p.xpHistory || {};
        let todayXp = xpHistory[todayStr] || 0;
        
        const totalTasksForDay = tasksForDay.length;
        const maxDailyXp = totalTasksForDay > 4 ? 6 : 4;
        
        if (isNowDone) {
          // Gaining XP
          if (todayXp < maxDailyXp) {
            const xpToAdd = Math.min(xpValue, maxDailyXp - todayXp);
            currentXp += xpToAdd;
            todayXp += xpToAdd;
          }
        } else {
          // Losing XP
          const xpToSubtract = Math.min(xpValue, todayXp);
          currentXp = Math.max(0, currentXp - xpToSubtract);
          todayXp = Math.max(0, todayXp - xpToSubtract);
        }
        
        return {
          ...p,
          xp: currentXp,
          xpHistory: { ...xpHistory, [todayStr]: todayXp }
        };
      });
    }

    toggleWeeklyTask('workout', currentDay, id);
  };
  const toggleJointSelection = (joint) => {
    setSelectedConstraints(prev => 
      prev.includes(joint.constraintId) 
        ? prev.filter(c => c !== joint.constraintId)
        : [...prev, joint.constraintId]
    );
  };

  const handleSaveSchedule = async () => {
    if (isAdapting) return;
    setIsAdapting(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: payload.stats?.age || 25,
          weight: payload.stats?.weightKg || 70,
          goal: payload.stats?.goal || 'general fitness',
          dietClass: payload.stats?.diet || 'balanced',
          activityRank: payload.activityRank || 'beginner',
          bodyConstraints: selectedConstraints,
          level: Math.floor((payload.xp || 0) / 10) + 1,
          painIntensities: payload.painIntensities || {},
          country: payload.account?.country || 'Unknown'
        })
      });
      const result = await response.json();
      if (result.success && result.plan) {
        setWeeklyTasks(result.plan);
        if (setPayload) {
          setPayload({
            ...payload,
            bodyConstraints: selectedConstraints,
            schedule: result.plan
          });
        }
        setActiveTab('schedule');
        setScheduleMode(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdapting(false);
    }
  };

  return (
    <div className="w-full h-screen flex relative z-10 p-4 md:p-6 gap-6 box-border">
      {/* Badge Celebration Overlay */}
      {celebratingBadge && (
        <BadgeCelebration badge={celebratingBadge} onClose={() => setCelebratingBadge(null)} />
      )}

      {/* Sidebar */}
      <aside className="glass hidden md:flex flex-col w-64 rounded-3xl p-6 h-[calc(100vh-48px)] border border-glass-border">
        <div className="flex items-center gap-3 mb-10">
          <BioCore size={36} glow="var(--accent-base)" className="" />
          <span className="font-extrabold text-lg text-text tracking-wide">Zephyr Fit</span>
        </div>
        
        <nav className="flex flex-col gap-3">
          <button onClick={() => setActiveTab('home')} className={`text-left px-5 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-3 ${activeTab === 'home' ? 'bg-accent-bg text-accent-base shadow-[0_0_12px_var(--accent-shadow)] border border-accent-border' : 'text-text-dim hover:text-accent-base hover:bg-glass-bg border border-transparent'}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </button>
          
          <button onClick={() => { setActiveTab('schedule'); setScheduleMode(null); setSelectedDay('Monday'); }} className={`text-left px-5 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-3 ${activeTab === 'schedule' ? 'bg-accent-bg text-accent-base shadow-[0_0_12px_var(--accent-shadow)] border border-accent-border' : 'text-text-dim hover:text-accent-base hover:bg-glass-bg border border-transparent'}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Schedule
          </button>
          
          <button onClick={() => setActiveTab('heatmap')} className={`text-left px-5 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-3 ${activeTab === 'heatmap' ? 'bg-accent-bg text-accent-base shadow-[0_0_12px_var(--accent-shadow)] border border-accent-border' : 'text-text-dim hover:text-accent-base hover:bg-glass-bg border border-transparent'}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Heatmap
          </button>

          <div className="h-px bg-glass-border my-2"></div>

          <button onClick={() => setActiveTab('update')} className={`text-left px-5 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-3 ${activeTab === 'update' ? 'bg-accent-bg text-accent-base shadow-[0_0_12px_var(--accent-shadow)] border border-accent-border' : 'text-text-dim hover:text-accent-base hover:bg-glass-bg border border-transparent'}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>
            Update Schedule
          </button>
        </nav>
        
        <div className="mt-auto">
          <button onClick={onRestart} className="text-sm font-mono tracking-widest text-text-dimmer hover:text-accent-base transition-colors flex items-center gap-2 uppercase">
            &#8635; Restart
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[calc(100vh-48px)] overflow-hidden rounded-3xl">
        {/* Header */}
        <header className="relative z-50 flex justify-between items-center mb-6 glass border border-glass-border rounded-3xl p-4 px-7 shadow-lg">
          <div className="flex items-center gap-5">
            {/* XP Circular Progress */}
            <div className="relative flex items-center justify-center w-[52px] h-[52px]">
              <svg className="absolute w-[52px] h-[52px] -rotate-90 pointer-events-none" viewBox="0 0 52 52">
                {/* Background ring */}
                <circle cx="26" cy="26" r="22" fill="transparent" stroke="var(--glass-border)" strokeWidth="4" />
                {/* Progress ring */}
                <circle 
                  cx="26" cy="26" r="22" 
                  fill="transparent" 
                  stroke="#00e5ff" 
                  strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 22}
                  strokeDashoffset={(2 * Math.PI * 22) - (((payload?.xp || 0) % 10) / 10) * (2 * Math.PI * 22)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(0, 229, 255, 0.7))' }}
                />
              </svg>
              {/* Center Text (Level Number) */}
              <span className="relative z-10 text-lg font-black text-text" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {Math.floor((payload?.xp || 0) / 10) + 1}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text leading-none mb-1.5">{username}</h2>
              <p className="text-[10px] text-text-dim font-mono uppercase tracking-[0.2em]">
                {payload?.activityRank || 'Novice'} • XP: {payload?.xp || 0}/{(Math.floor((payload?.xp || 0) / 10) + 1) * 10}
              </p>
            </div>
          </div>
          
          {/* User Avatar Customizer */}
          <ProfileCustomizer 
            profilePic={payload.account?.profilePic}
            profileFrame={payload.account?.profileFrame}
            setProfileAssets={setProfileAssets}
            onLogout={onRestart}
          />
        </header>

        {activeTab === 'home' ? (
          <div className="flex-1 overflow-y-auto xl:overflow-hidden pr-2 pb-10 flex flex-col xl:flex-row gap-6 scrollbar-hide">
            {/* Workout Section */}
            <section className="glass rounded-3xl p-6 border border-glass-border flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-5 border-b border-glass-border pb-4">
                <h2 className="text-xl font-extrabold text-text flex items-center gap-2">
                  Workout
                </h2>
                <span className="text-[10px] font-mono text-accent-base uppercase tracking-widest bg-accent-bg border border-accent-border/30 px-3 py-1.5 rounded-lg">
                  {payload?.bodyConstraints?.length > 0 ? 'Adapted' : 'Standard'}
                </span>
              </div>
              
              <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2 scrollbar-thin">
                {(weeklyTasks.workout[currentDay] || []).map(task => (
                  <label key={task.id} className={`flex flex-1 items-center gap-6 p-6 rounded-2xl cursor-pointer transition-all border ${task.done ? 'bg-glass-bg border-accent-border/30' : 'border-transparent hover:bg-glass-bg/50 hover:border-glass-border'}`}>
                    <input type="checkbox" className="hidden" checked={task.done} onChange={() => toggleWorkoutTask(task.id)} />
                    <div className={`w-6 h-6 shrink-0 rounded-md flex items-center justify-center border-2 transition-all ${task.done ? 'bg-accent-base border-accent-base shadow-[0_0_12px_var(--accent-shadow)]' : 'border-text-dim hover:border-accent-base/50'}`}>
                      {task.done && <span className="text-void text-sm font-bold leading-none select-none">&#10003;</span>}
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold mb-1 transition-all ${task.done ? 'text-text-dim line-through decoration-text-dimmer/50' : 'text-text'}`}>
                          {task.label}
                        </span>
                        <span className="text-[10px] font-black text-accent-base bg-accent-bg px-2 py-0.5 rounded border border-accent-border/50 shadow-[0_0_10px_var(--accent-shadow)]">
                          +{(parseInt(task.sets) >= 4 || parseInt(task.reps) >= 12 || (parseInt(task.sets) * parseInt(task.reps)) > 30) ? 2 : 1} XP
                        </span>
                      </div>
                      {task.sets && task.reps && (
                        <span className={`text-xs mt-2 font-mono uppercase tracking-widest transition-all ${task.done ? 'text-text-dimmer' : 'text-accent-base'}`}>
                          {task.sets} sets × {task.reps}
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Diet Section */}
            <section className="glass rounded-3xl p-6 border border-glass-border flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-5 border-b border-glass-border pb-4">
                <h2 className="text-xl font-extrabold text-text flex items-center gap-2">
                  Diet 
                </h2>
                <span className="text-[10px] font-mono text-accent-base uppercase tracking-widest bg-accent-bg border border-accent-border/30 px-3 py-1.5 rounded-lg">
                  {diet}
                </span>
              </div>
              
              <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2 scrollbar-thin">
                {(weeklyTasks.diet[currentDay] || []).map(task => (
                  <label key={task.id} className={`flex flex-1 items-center gap-6 p-6 rounded-2xl cursor-pointer transition-all border ${task.done ? 'bg-glass-bg border-accent-border/30' : 'border-transparent hover:bg-glass-bg/50 hover:border-glass-border'}`}>
                    <input type="checkbox" className="hidden" checked={task.done} onChange={() => toggleDietTask(task.id)} />
                    <div className={`w-6 h-6 shrink-0 rounded-md flex items-center justify-center border-2 transition-all ${task.done ? 'bg-accent-base border-accent-base shadow-[0_0_12px_var(--accent-shadow)]' : 'border-text-dim hover:border-accent-base/50'}`}>
                      {task.done && <span className="text-void text-sm font-bold leading-none select-none">&#10003;</span>}
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className={`text-lg font-bold mb-1 transition-all ${task.done ? 'text-text-dim line-through decoration-text-dimmer/50' : 'text-text'}`}>
                        {task.label}
                      </span>
                      {task.ingredients && (
                        <span className={`text-sm leading-relaxed transition-all ${task.done ? 'text-text-dimmer' : 'text-text-dim'}`}>
                          {task.ingredients}
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>
        ) : activeTab === 'schedule' ? (
          <div className="flex-1 overflow-hidden flex flex-col scrollbar-hide">
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
                <div className="flex-1 overflow-y-auto pr-2 pb-10">
                  <section className="glass rounded-3xl p-6 border border-glass-border min-h-full flex flex-col">
                    <div className="flex items-center justify-between mb-5 border-b border-glass-border pb-4">
                      <h2 className="text-xl font-extrabold text-text flex items-center gap-2">
                        {selectedDay} {scheduleMode === 'diet' ? 'Meals' : 'Routine'}
                      </h2>
                      <span className="text-[10px] font-mono text-accent-base uppercase tracking-widest bg-accent-bg border border-accent-border/30 px-3 py-1.5 rounded-lg">
                        {scheduleMode === 'diet' ? diet : (payload?.bodyConstraints?.length > 0 ? 'Adapted' : 'Standard')}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-4 flex-1">
                      {weeklyTasks[scheduleMode][selectedDay].map(task => (
                        <div key={task.id} className="flex flex-1 items-center gap-6 p-6 rounded-2xl border border-glass-border bg-glass-bg/30">
                          <div className="w-3 h-3 shrink-0 rounded-full bg-accent-base shadow-[0_0_12px_var(--accent-shadow)]"></div>
                          <div className="flex flex-col justify-center">
                            <span className="text-lg font-bold text-text mb-1">
                              {task.label}
                            </span>
                            {scheduleMode === 'diet' && task.ingredients && (
                              <span className="text-sm leading-relaxed text-text-dim">
                                {task.ingredients}
                              </span>
                            )}
                            {scheduleMode === 'workout' && task.sets && task.reps && (
                              <span className="text-xs mt-2 font-mono uppercase tracking-widest text-accent-base">
                                {task.sets} sets × {task.reps}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'heatmap' ? (
          /* ════════════════════════════════════════════
             HEATMAP & BADGES TAB
             ════════════════════════════════════════════ */
          <div className="flex-1 overflow-y-auto pr-2 pb-10 flex flex-col gap-6 scrollbar-hide">
            {/* Heatmap Section */}
            <section className="glass rounded-3xl p-6 border border-glass-border">
              <div className="flex items-center justify-between mb-5 border-b border-glass-border pb-4">
                <h2 className="text-xl font-extrabold text-text flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                  Activity Heatmap
                </h2>
                <span className="text-[10px] font-mono text-accent-base uppercase tracking-widest bg-accent-bg border border-accent-border/30 px-3 py-1.5 rounded-lg">
                  Last 365 Days
                </span>
              </div>
              <Heatmap history={history} />
            </section>

            {/* Trophy Case — Total Count Badges */}
            <section className="glass rounded-3xl p-6 border border-glass-border">
              <div className="flex items-center justify-between mb-5 border-b border-glass-border pb-4">
                <h2 className="text-xl font-extrabold text-text flex items-center gap-2">
                  🏆 Trophy Case
                </h2>
                <span className="text-[10px] font-mono text-accent-base uppercase tracking-widest bg-accent-bg border border-accent-border/30 px-3 py-1.5 rounded-lg">
                  {earnedBadges.length} Earned
                </span>
              </div>

              {earnedBadges.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🔒</div>
                  <p className="text-text-dim text-sm font-medium">No badges earned yet.</p>
                  <p className="text-text-dimmer text-xs mt-2">Complete all workouts for a day to start building your streak!</p>
                </div>
              ) : (
                <>
                  {/* Earned Total Count Badges */}
                  {BADGE_DEFINITIONS.filter(b => b.type === 'total' && earnedBadges.includes(b.id)).length > 0 && (
                    <>
                      <div className="badge-section-title">
                        🏋️ Total Workout Days
                      </div>
                      <div className="badges-grid" style={{ marginBottom: 24 }}>
                        {BADGE_DEFINITIONS.filter(b => b.type === 'total' && earnedBadges.includes(b.id)).map(badge => (
                          <div
                            key={badge.id}
                            className="badge-card"
                            onClick={() => setCelebratingBadge(badge)}
                          >
                            <BadgeSVG badge={badge} earned={true} size={80} />
                            <span className="badge-card-title">
                              {badge.title}
                            </span>
                            <span className="badge-card-threshold">
                              {badge.threshold} days
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Earned Streak Badges */}
                  {BADGE_DEFINITIONS.filter(b => b.type === 'streak' && earnedBadges.includes(b.id)).length > 0 && (
                    <>
                      <div className="badge-section-title">
                        🔥 Streak Milestones
                      </div>
                      <div className="badges-grid">
                        {BADGE_DEFINITIONS.filter(b => b.type === 'streak' && earnedBadges.includes(b.id)).map(badge => (
                          <div
                            key={badge.id}
                            className="badge-card"
                            onClick={() => setCelebratingBadge(badge)}
                          >
                            <BadgeSVG badge={badge} earned={true} size={80} />
                            <span className="badge-card-title">
                              {badge.title}
                            </span>
                            <span className="badge-card-threshold">
                              {badge.threshold}-day streak
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </section>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 pb-10 flex flex-col gap-6 scrollbar-hide">
            <section className="glass rounded-3xl p-6 border border-glass-border flex flex-col h-full">
              <h2 className="text-xl font-extrabold text-text mb-2">Update Schedule</h2>
              <p className="text-text-dim text-sm mb-6">Log any new pain points or stiffness to adapt your workout schedule.</p>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="flex flex-col items-center bg-glass-bg rounded-2xl border border-glass-border p-6 h-full">
                  <AnatomyScan constraints={selectedConstraints} toggleJoint={toggleJointSelection} size={280} />
                </div>
                
                <div className="flex flex-col gap-6">
                  {selectedConstraints.length > 0 ? (
                    <div className="flex flex-col gap-4 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin">
                      {selectedConstraints.map(constraintId => {
                        const joint = JOINTS.find(j => j.constraintId === constraintId);
                        const label = joint ? joint.label : constraintId;
                        const value = painIntensities[constraintId] || 50;
                        return (
                          <div key={constraintId} className="bg-glass-bg/50 p-4 rounded-xl border border-glass-border">
                            <label className="block text-sm font-bold text-text mb-3">{label} Pain</label>
                            <div className="relative w-full h-10 flex items-center bg-input-bg rounded-full border border-input-border px-4">
                              <input 
                                type="range" 
                                min="0" max="100" 
                                value={value} 
                                onChange={(e) => setPainIntensities({ ...painIntensities, [constraintId]: parseInt(e.target.value) })} 
                                className="w-full h-full opacity-0 absolute inset-0 cursor-pointer z-10"
                              />
                              <div className="w-full h-1.5 bg-glass-border rounded-full relative overflow-hidden pointer-events-none">
                                <div className="h-full bg-accent-base" style={{ width: `${value}%` }}></div>
                              </div>
                              <div className="absolute top-1/2 -mt-3 w-6 h-6 rounded-full bg-accent-base border-2 border-[var(--glass-bg)] shadow-[0_0_12px_var(--accent-shadow)] pointer-events-none" style={{ left: `calc(16px + (100% - 32px) * ${value / 100} - 12px)` }}></div>
                            </div>
                            <div className="flex justify-between mt-2 text-xs font-mono uppercase tracking-widest text-text-dim">
                              <span>Mild</span>
                              <span>Mod</span>
                              <span>Severe</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-text-dimmer italic p-4 bg-glass-bg/30 rounded-xl border border-glass-border">
                      No pain areas selected. Tap the anatomy model to select a joint.
                    </div>
                  )}

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
                    <button onClick={handleSaveSchedule} disabled={isAdapting} className="cta-button w-full shadow-[0_0_20px_var(--accent-shadow)] disabled:opacity-50">
                      {isAdapting ? 'Adapting Plan...' : 'Save & Adapt Plan'}
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
