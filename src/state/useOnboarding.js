import { useState, useEffect, useRef } from 'react';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../firebase';

export const STAGE_ORDER = ['login', 'vitals', 'fuel', 'rank', 'map', 'dashboard'];
export const XP_MAP = { login: 0, vitals: 100, fuel: 200, rank: 300, map: 400, dashboard: 500 };

export function useOnboarding() {
  const [stage, setStage] = useState('login');

  const [payload, setPayload] = useState({
    account: { username: '', profilePic: 'default.png', profileFrame: 'none' },
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

  const setProfileAssets = (pic, frame) => {
    setPayload(p => ({
      ...p,
      account: { ...p.account, profilePic: pic, profileFrame: frame }
    }));
  };

  const idx = STAGE_ORDER.indexOf(stage);
  const goBack = () => idx > 0 && goTo(STAGE_ORDER[idx - 1]);
  const xp = XP_MAP[stage];

  const syncData = (currentPayload) => {
    if (!currentPayload.account.uid) return;
    const payloadData = { uid: currentPayload.account.uid, payload: currentPayload, onboardingComplete: true };
    
    try {
      localStorage.setItem(`zephyr_onboarding_${currentPayload.account.uid}`, JSON.stringify(payloadData));
    } catch (e) { console.error("Local storage error:", e); }

    // (Local API saving removed per user request)
    try {
      setDoc(doc(db, 'users', currentPayload.account.uid), payloadData).catch(() => {});
    } catch (e) {}
  };

  useEffect(() => {
    // Only auto-save if they have reached the dashboard (onboarding complete)
    if (stage === 'dashboard' && payload.account.uid) {
      // Use a small timeout to debounce rapid state changes
      const timer = setTimeout(() => {
        syncData(payload);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [payload, stage]);

  const finish = () => {
    syncData(payload);
    console.log('Zephyr onboarding payload saved:', JSON.parse(JSON.stringify(payload)));
    goTo('dashboard');
  };

  const restart = () => {
    setPayload({
      account: { username: '', profilePic: 'default.png', profileFrame: 'none' },
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
    setProfileAssets,
    goTo,
    goBack,
    finish,
    restart,
  };
}