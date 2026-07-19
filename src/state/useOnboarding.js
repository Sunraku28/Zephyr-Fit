import { useState, useEffect, useRef } from 'react';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../firebase';

export const STAGE_ORDER = ['login', 'vitals', 'fuel', 'rank', 'map', 'dashboard'];
export const XP_MAP = { login: 0, vitals: 100, fuel: 200, rank: 300, map: 400, dashboard: 500 };

export function useOnboarding() {
  const [stage, setStage] = useState('login');
  const [isGenerating, setIsGenerating] = useState(false);

  const [payload, setPayload] = useState({
    account: { username: '', profilePic: 'default.png', profileFrame: 'none', uid: null },
    stats: { age: 21, weightKg: 75, diet: null, goal: null },
    activityRank: null,
    bodyConstraints: [],
    painIntensities: {},
    schedule: null,
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

  const finish = async (painIntensities = {}) => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: payload.stats.age,
          weight: payload.stats.weightKg,
          goal: payload.stats.goal,
          dietClass: payload.stats.diet,
          activityRank: payload.activityRank,
          bodyConstraints: payload.bodyConstraints,
          painIntensities: painIntensities,
        })
      });
      const result = await response.json();
      
      if (result.success && result.plan) {
        const finalPayload = { ...payload, schedule: result.plan, painIntensities };
        setPayload(finalPayload);
        syncData(finalPayload);
        console.log('Zephyr onboarding payload saved with schedule:', JSON.parse(JSON.stringify(finalPayload)));
        setIsGenerating(false);
        goTo('dashboard');
      } else {
        console.error("Plan generation returned no data:", result);
        setIsGenerating(false);
      }
    } catch (e) {
      console.error("Failed to generate plan:", e);
      setIsGenerating(false);
    }
  };

  const restart = () => {
    setPayload({
      account: { username: '', profilePic: 'default.png', profileFrame: 'none' },
      stats: { age: 21, weightKg: 75, diet: null, goal: null },
      activityRank: null,
      bodyConstraints: [],
      painIntensities: {}
    });
    goTo('login');
  };

  return {
    stage,
    payload,
    xp,
    isGenerating,
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