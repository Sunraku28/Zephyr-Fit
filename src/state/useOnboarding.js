import { useState } from 'react';

export const STAGE_ORDER = ['login', 'vitals', 'fuel', 'rank', 'map', 'complete'];
export const XP_MAP = { login: 0, vitals: 100, fuel: 200, rank: 300, map: 400, complete: 500 };

export function useOnboarding() {
  const [stage, setStage] = useState('login');

  const [payload, setPayload] = useState({
    account: { username: '' },
    stats: { age: 21, weightKg: 75, diet: null },
    activityRank: null,
    bodyConstraints: [],
  });

  const goTo = (next) => {
    setStage(next);
  };

  const setStats = (updater) => {
    setPayload(p => ({
      ...p,
      stats: typeof updater === 'function' ? updater(p.stats) : updater
    }));
  };

  const setDiet = (val) => {
    setPayload(p => ({ ...p, stats: { ...p.stats, diet: val } }));
  };

  const setRank = (val) => {
    setPayload(p => ({ ...p, activityRank: val }));
  };

  const toggleJoint = (joint) => {
    setPayload(p => {
      const has = p.bodyConstraints.includes(joint.constraintId);
      return {
        ...p,
        bodyConstraints: has
          ? p.bodyConstraints.filter(c => c !== joint.constraintId)
          : [...p.bodyConstraints, joint.constraintId]
      };
    });
  };

  const idx = STAGE_ORDER.indexOf(stage);
  const goBack = () => idx > 0 && goTo(STAGE_ORDER[idx - 1]);
  const xp = XP_MAP[stage];

  const finish = () => {
    console.log('Zephyr onboarding payload:', JSON.parse(JSON.stringify(payload)));
    goTo('complete');
  };

  const restart = () => {
    setPayload({
      account: { username: '' },
      stats: { age: 21, weightKg: 75, diet: null },
      activityRank: null,
      bodyConstraints: []
    });
    goTo('login');
  };

  return {
    stage,
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
  };
}