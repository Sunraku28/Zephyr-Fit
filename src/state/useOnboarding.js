import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const STAGE_ORDER = ['login', 'vitals', 'fuel', 'rank', 'map', 'complete'];
export const XP_MAP = { login: 0, vitals: 100, fuel: 200, rank: 300, map: 400, complete: 500 };

export function useOnboarding() {
  const [stage, setStage] = useState('login');
  const [isGenerating, setIsGenerating] = useState(false);

  const [payload, setPayload] = useState({
    account: { username: '', profilePic: 'default.png', profileFrame: 'none', uid: null },
    stats: { age: 21, weightKg: 75, diet: null, goal: null },
    activityRank: null,
    bodyConstraints: [],
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

  const finish = async () => {
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
        })
      });
      const result = await response.json();
      
      if (result.success && result.plan) {
        const updatedPayload = { ...payload, schedule: result.plan };
        if (payload.account.uid) {
          setDoc(doc(db, "users", payload.account.uid), updatedPayload)
            .catch(err => console.warn("Background sync warning:", err));
        }
        setPayload(updatedPayload);
      }
    } catch (e) {
      console.error("Failed to generate plan:", e);
    }
    setIsGenerating(false);
    goTo('complete');
  };

  const restart = () => {
    setPayload({
      account: { username: '', profilePic: 'default.png', profileFrame: 'none' },
      stats: { age: 21, weightKg: 75, diet: null, goal: null },
      activityRank: null,
      bodyConstraints: []
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