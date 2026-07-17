import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOnboarding } from './state/useOnboarding';
import AmbientBackground from './components/layout/AmbientBackground';
import LoginPage from './pages/LoginPage';
import VitalsPage from './pages/VitalsPage';
import FuelPage from './pages/FuelPage';
import RankPage from './pages/RankPage';
import MapPage from './pages/MapPage';
import CompletePage from './pages/CompletePage';

export default function App() {
  const {
    stage,
    wipeClass,
    payload,
    xp,
    setPayload,
    setStats,
    setDiet,
    setRank,
    toggleJoint,
    goTo,
    goBack,
    finish,
    restart,
    handleWipeEnd
  } = useOnboarding();

  let page;
  if (stage === 'login') {
    page = <LoginPage onSubmit={(username) => { setPayload(p => ({ ...p, account: { username } })); goTo('vitals'); }} />;
  } else if (stage === 'vitals') {
    page = <VitalsPage stats={payload.stats} setStats={setStats} onNext={() => goTo('fuel')} onBack={goBack} xp={xp} username={payload.account.username} />;
  } else if (stage === 'fuel') {
    page = <FuelPage diet={payload.stats.diet} setDiet={setDiet} onNext={() => goTo('rank')} onBack={goBack} xp={xp} username={payload.account.username} />;
  } else if (stage === 'rank') {
    page = <RankPage rank={payload.activityRank} setRank={setRank} onNext={() => goTo('map')} onBack={goBack} xp={xp} username={payload.account.username} />;
  } else if (stage === 'map') {
    page = <MapPage constraints={payload.bodyConstraints} toggleJoint={toggleJoint} onFinish={finish} onBack={goBack} xp={xp} username={payload.account.username} />;
  } else {
    page = <CompletePage payload={payload} onRestart={restart} />;
  }

  return (
    <React.Fragment>
      <AmbientBackground />
      <div className={`wipe-overlay ${wipeClass}`} onTransitionEnd={handleWipeEnd} />
      
      {/* State Machine + AnimatePresence Page Router */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="w-full z-10 relative"
        >
          {page}
        </motion.div>
      </AnimatePresence>
    </React.Fragment>
  );
}