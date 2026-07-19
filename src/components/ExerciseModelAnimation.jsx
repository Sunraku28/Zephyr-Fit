import React from 'react';

const ANIM_STYLE = `
  @keyframes curl-forearm {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-120deg); }
  }
  @keyframes bicep-bulge {
    0%, 100% {
      transform: translate(0, 0) scale(1);
      stroke-width: 3.5;
      opacity: 0.3;
    }
    50% {
      transform: translate(1.5px, 1.5px) scale(1.15);
      stroke-width: 8;
      opacity: 0.95;
    }
  }
  @keyframes run-left-leg {
    0%, 100% { transform: rotate(30deg); }
    50% { transform: rotate(-30deg); }
  }
  @keyframes run-right-leg {
    0%, 100% { transform: rotate(-30deg); }
    50% { transform: rotate(30deg); }
  }
  @keyframes run-left-arm {
    0%, 100% { transform: rotate(-25deg); }
    50% { transform: rotate(25deg); }
  }
  @keyframes run-right-arm {
    0%, 100% { transform: rotate(25deg); }
    50% { transform: rotate(-25deg); }
  }
  @keyframes run-bounce {
    0%, 100% { transform: translateY(0); }
    25% { transform: translateY(-2px); }
    75% { transform: translateY(2px); }
  }
  @keyframes crunch-torso {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-35deg); }
  }
  @keyframes jack-arms {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-70deg); }
  }
  @keyframes jack-arms-r {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(70deg); }
  }
  @keyframes jack-legs {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-25deg); }
  }
  @keyframes jack-legs-r {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(25deg); }
  }
  @keyframes muscle-pulse {
    0%, 100% { opacity: 0.45; }
    50% { opacity: 0.85; }
  }
  @keyframes idle-breathe {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(1.04); }
  }
`;

function getType(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('curl') || n.includes('bicep') || n.includes('upper body')) return 'curl';
  if (n.includes('cardio') || n.includes('run') || n.includes('swim') || n.includes('cycle') || n.includes('finisher')) return 'run';
  if (n.includes('core') || n.includes('plank') || n.includes('crunch') || n.includes('stabiliz') || n.includes('circuit')) return 'core';
  if (n.includes('warmup') || n.includes('stretch') || n.includes('recovery') || n.includes('jack')) return 'warmup';
  return 'idle';
}

// Stick figure colors
const SKIN = '#c8d6e5';
const JOINT = '#636e72';

function CurlAnimation() {
  return (
    <svg viewBox="0 0 100 120" className="w-full h-full">
      {/* Head */}
      <circle cx="50" cy="18" r="9" fill={SKIN} stroke={JOINT} strokeWidth="1.5" />
      {/* Body */}
      <line x1="50" y1="27" x2="50" y2="68" stroke={SKIN} strokeWidth="3" strokeLinecap="round" />
      {/* Left leg */}
      <line x1="50" y1="68" x2="38" y2="95" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="38" y1="95" x2="35" y2="112" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
      {/* Right leg */}
      <line x1="50" y1="68" x2="62" y2="95" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="62" y1="95" x2="65" y2="112" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
      {/* Left arm (static) */}
      <line x1="50" y1="35" x2="32" y2="50" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="50" x2="30" y2="68" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
      {/* Right upper arm */}
      <line x1="50" y1="35" x2="68" y2="50" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
      {/* RED MUSCLE GLOW: Bicep line on the upper arm, bulges and moves dynamically in sync */}
      <line 
        x1="55" y1="39" 
        x2="63.5" y2="46" 
        stroke="#ef4444" 
        strokeLinecap="round" 
        style={{ 
          transformOrigin: '58px 42px',
          animation: 'bicep-bulge 1.2s ease-in-out infinite' 
        }} 
      />
      {/* Right forearm (animated curl) */}
      <g style={{ transformOrigin: '68px 50px', animation: 'curl-forearm 1.2s ease-in-out infinite' }}>
        <line x1="68" y1="50" x2="70" y2="68" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
        {/* Dumbbell */}
        <rect x="64" y="67" width="12" height="4" rx="2" fill="#636e72" />
      </g>
    </svg>
  );
}

function RunAnimation() {
  return (
    <svg viewBox="0 0 100 120" className="w-full h-full">
      <g style={{ animation: 'run-bounce 0.6s ease-in-out infinite' }}>
        {/* Head */}
        <circle cx="50" cy="16" r="9" fill={SKIN} stroke={JOINT} strokeWidth="1.5" />
        {/* Body */}
        <line x1="50" y1="25" x2="50" y2="62" stroke={SKIN} strokeWidth="3" strokeLinecap="round" />
        {/* Left arm */}
        <g style={{ transformOrigin: '50px 32px', animation: 'run-left-arm 0.6s ease-in-out infinite' }}>
          <line x1="50" y1="32" x2="35" y2="50" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
        </g>
        {/* Right arm */}
        <g style={{ transformOrigin: '50px 32px', animation: 'run-right-arm 0.6s ease-in-out infinite' }}>
          <line x1="50" y1="32" x2="65" y2="50" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
        </g>
        {/* Left leg with nested red muscle glow lines so they move together */}
        <g style={{ transformOrigin: '50px 62px', animation: 'run-left-leg 0.6s ease-in-out infinite' }}>
          <line x1="50" y1="62" x2="40" y2="88" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="40" y1="88" x2="38" y2="112" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
          {/* Left Quad */}
          <line x1="50" y1="62" x2="40" y2="88" stroke="#ef4444" strokeWidth="5.5" strokeLinecap="round" opacity="0.55" style={{ animation: 'muscle-pulse 0.6s ease-in-out infinite' }} />
          {/* Left Calf */}
          <line x1="40" y1="88" x2="38" y2="112" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" opacity="0.4" style={{ animation: 'muscle-pulse 0.6s ease-in-out infinite' }} />
        </g>
        {/* Right leg with nested red muscle glow lines so they move together */}
        <g style={{ transformOrigin: '50px 62px', animation: 'run-right-leg 0.6s ease-in-out infinite' }}>
          <line x1="50" y1="62" x2="60" y2="88" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="60" y1="88" x2="62" y2="112" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
          {/* Right Quad */}
          <line x1="50" y1="62" x2="60" y2="88" stroke="#ef4444" strokeWidth="5.5" strokeLinecap="round" opacity="0.55" style={{ animation: 'muscle-pulse 0.6s ease-in-out infinite 0.3s' }} />
          {/* Right Calf */}
          <line x1="60" y1="88" x2="62" y2="112" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" opacity="0.4" style={{ animation: 'muscle-pulse 0.6s ease-in-out infinite 0.3s' }} />
        </g>
      </g>
    </svg>
  );
}

function CoreAnimation() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full">
      {/* Floor line */}
      <line x1="5" y1="70" x2="115" y2="70" stroke="#334155" strokeWidth="1" strokeDasharray="4 3" />
      {/* Legs (static, bent knees) */}
      <line x1="55" y1="62" x2="70" y2="45" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="70" y1="45" x2="75" y2="65" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="55" y1="62" x2="72" y2="50" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
      {/* Torso + Head (animated crunch) with nested red muscle glow lines so they move together */}
      <g style={{ transformOrigin: '55px 62px', animation: 'crunch-torso 1.5s ease-in-out infinite' }}>
        {/* Torso */}
        <line x1="55" y1="62" x2="30" y2="62" stroke={SKIN} strokeWidth="3" strokeLinecap="round" />
        {/* Head */}
        <circle cx="22" cy="62" r="8" fill={SKIN} stroke={JOINT} strokeWidth="1.5" />
        {/* Arms folded on chest */}
        <line x1="40" y1="58" x2="32" y2="55" stroke={SKIN} strokeWidth="2" strokeLinecap="round" />
        <line x1="40" y1="66" x2="32" y2="63" stroke={SKIN} strokeWidth="2" strokeLinecap="round" />
        {/* Abs line along torso */}
        <line x1="50" y1="62" x2="35" y2="62" stroke="#ef4444" strokeWidth="5.5" strokeLinecap="round" opacity="0.65" style={{ animation: 'muscle-pulse 1.5s ease-in-out infinite' }} />
      </g>
    </svg>
  );
}

function WarmupAnimation() {
  return (
    <svg viewBox="0 0 100 120" className="w-full h-full">
      {/* Head */}
      <circle cx="50" cy="16" r="9" fill={SKIN} stroke={JOINT} strokeWidth="1.5" />
      {/* Body */}
      <line x1="50" y1="25" x2="50" y2="65" stroke={SKIN} strokeWidth="3" strokeLinecap="round" />
      {/* Chest/shoulder line (static) */}
      <line x1="50" y1="25" x2="50" y2="65" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" opacity="0.4" style={{ animation: 'muscle-pulse 0.7s ease-in-out infinite' }} />
      {/* Left arm */}
      <g style={{ transformOrigin: '50px 30px', animation: 'jack-arms 0.7s ease-in-out infinite' }}>
        <line x1="50" y1="30" x2="30" y2="50" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="50" x2="24" y2="38" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {/* Right arm */}
      <g style={{ transformOrigin: '50px 30px', animation: 'jack-arms-r 0.7s ease-in-out infinite' }}>
        <line x1="50" y1="30" x2="70" y2="50" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="70" y1="50" x2="76" y2="38" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {/* Left leg with nested red muscle glow */}
      <g style={{ transformOrigin: '50px 65px', animation: 'jack-legs 0.7s ease-in-out infinite' }}>
        <line x1="50" y1="65" x2="38" y2="90" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="90" x2="35" y2="112" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="65" x2="38" y2="90" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" opacity="0.35" style={{ animation: 'muscle-pulse 0.7s ease-in-out infinite' }} />
      </g>
      {/* Right leg with nested red muscle glow */}
      <g style={{ transformOrigin: '50px 65px', animation: 'jack-legs-r 0.7s ease-in-out infinite' }}>
        <line x1="50" y1="65" x2="62" y2="90" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="62" y1="90" x2="65" y2="112" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="65" x2="62" y2="90" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" opacity="0.35" style={{ animation: 'muscle-pulse 0.7s ease-in-out infinite' }} />
      </g>
    </svg>
  );
}

function IdleAnimation() {
  return (
    <svg viewBox="0 0 100 120" className="w-full h-full">
      <g style={{ transformOrigin: '50px 68px', animation: 'idle-breathe 2.5s ease-in-out infinite' }}>
        {/* Head */}
        <circle cx="50" cy="18" r="9" fill={SKIN} stroke={JOINT} strokeWidth="1.5" />
        {/* Body */}
        <line x1="50" y1="27" x2="50" y2="68" stroke={SKIN} strokeWidth="3" strokeLinecap="round" />
        {/* Left arm */}
        <line x1="50" y1="35" x2="32" y2="52" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="52" x2="30" y2="70" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
        {/* Right arm */}
        <line x1="50" y1="35" x2="68" y2="52" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="68" y1="52" x2="70" y2="70" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
        {/* Left leg */}
        <line x1="50" y1="68" x2="40" y2="92" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="40" y1="92" x2="38" y2="112" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
        {/* Right leg */}
        <line x1="50" y1="68" x2="60" y2="92" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="60" y1="92" x2="62" y2="112" stroke={SKIN} strokeWidth="2.5" strokeLinecap="round" />
        {/* Subtle full body glow line along torso */}
        <line x1="50" y1="27" x2="50" y2="68" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" opacity="0.25" style={{ animation: 'muscle-pulse 2.5s ease-in-out infinite' }} />
      </g>
    </svg>
  );
}

export default function ExerciseModelAnimation({ exerciseName, sizeClass = "w-20 h-20" }) {
  const type = getType(exerciseName);

  return (
    <div className={`${sizeClass} flex-shrink-0 rounded-2xl overflow-hidden relative bg-[#0f172a] border border-glass-border/40 shadow-lg flex items-center justify-center p-1`}>
      <style>{ANIM_STYLE}</style>
      {type === 'curl' && <CurlAnimation />}
      {type === 'run' && <RunAnimation />}
      {type === 'core' && <CoreAnimation />}
      {type === 'warmup' && <WarmupAnimation />}
      {type === 'idle' && <IdleAnimation />}
    </div>
  );
}
