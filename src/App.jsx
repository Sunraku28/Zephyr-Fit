import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOnboarding } from './state/useOnboarding';
import AmbientBackground from './components/layout/AmbientBackground';
import ThemeToggle from './components/ThemeToggle';
import LoginPage from './pages/LoginPage';
import VitalsPage from './pages/VitalsPage';
import FuelPage from './pages/FuelPage';
import RankPage from './pages/RankPage';
import SchedulePage from './pages/SchedulePage';
import MapPage from './pages/MapPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const {
    stage,
    payload,
    xp,
    isGenerating,
    setPayload,
    setStats,
    setDiet,
    setRank,
    setWorkoutDays,
    setEquipment,
    toggleJoint,
    setProfileAssets,
    goTo,
    goBack,
    finish,
    restart,
  } = useOnboarding();

  let page;
  if (stage === 'login') {
    page = <LoginPage onSubmit={({ needsOnboarding, payload: newPayload }) => { 
      setPayload(newPayload); 
      if (needsOnboarding) {
        goTo('vitals'); 
      } else {
        goTo('dashboard');
      }
    }} />;
  } else if (stage === 'vitals') {
    page = <VitalsPage stats={payload.stats} setStats={setStats} onNext={() => goTo('fuel')} onBack={goBack} xp={xp} username={payload.account.username} />;
  } else if (stage === 'fuel') {
    page = <FuelPage diet={payload.stats.diet} setDiet={setDiet} onNext={() => goTo('rank')} onBack={goBack} xp={xp} username={payload.account.username} />;
  } else if (stage === 'rank') {
    page = <RankPage rank={payload.activityRank} setRank={setRank} onNext={() => goTo('schedule')} onBack={goBack} xp={xp} username={payload.account.username} />;
  } else if (stage === 'schedule') {
    page = <SchedulePage 
      workoutDays={payload.stats.workoutDays} 
      setWorkoutDays={setWorkoutDays} 
      equipment={payload.stats.equipment}
      setEquipment={setEquipment}
      onNext={() => goTo('map')} 
      onBack={goBack} 
      xp={xp} 
      username={payload.account.username} 
    />;
  } else if (stage === 'map') {
    page = (
      <div className="relative w-full h-full">
        <MapPage constraints={payload.bodyConstraints} toggleJoint={toggleJoint} onFinish={(intensities) => finish(intensities)} onBack={goBack} xp={xp} username={payload.account.username} />
        {isGenerating && (
          <div className="absolute inset-0 z-50 bg-void/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-accent-base/30 border-t-accent-base rounded-full animate-spin mb-4"></div>
            <p className="text-accent-base font-bold tracking-widest uppercase">Generating Plan...</p>
          </div>
        )}
      </div>
    );
  } else {
    page = <DashboardPage payload={payload} setPayload={setPayload} onRestart={restart} setProfileAssets={setProfileAssets} />;
  }

  return (
    <React.Fragment>
      <AmbientBackground />
      <ThemeToggle />
      
      {/* Smooth fade transition between pages */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="w-full z-10 relative"
        >
          {page}
        </motion.div>
      </AnimatePresence>
    </React.Fragment>
  );
}