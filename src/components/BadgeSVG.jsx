import React from 'react';

/**
 * All badge definitions — Total Count & Streak
 */
export const BADGE_DEFINITIONS = [
  // ── Total Count Badges ──
  {
    id: 'total-50',
    type: 'total',
    threshold: 50,
    title: 'Iron Starter',
    description: '50 total workout days completed. The iron path has begun.',
    colors: { ring: '#4ade80', glow: '#22c55e', bg: '#14532d', icon: '#86efac' },
    icon: 'dumbbell',
    image: '/images/badges/50-days-total.png',
  },
  {
    id: 'total-100',
    type: 'total',
    threshold: 100,
    title: 'Steel Warrior',
    description: '100 total workout days. Forged in sweat and steel.',
    colors: { ring: '#f97316', glow: '#ea580c', bg: '#7c2d12', icon: '#fdba74' },
    icon: 'kettlebell',
    image: '/images/badges/100-days-total.png',
  },
  {
    id: 'total-200',
    type: 'total',
    threshold: 200,
    title: 'Titanium Beast',
    description: '200 total workout days. Unstoppable force of nature.',
    colors: { ring: '#3b82f6', glow: '#2563eb', bg: '#1e3a5f', icon: '#93c5fd' },
    icon: 'barbell',
    image: '/images/badges/200-days-total.png',
  },
  {
    id: 'total-300',
    type: 'total',
    threshold: 300,
    title: 'Platinum Legend',
    description: '300 total workout days. A living legend of the gym.',
    colors: { ring: '#eab308', glow: '#ca8a04', bg: '#713f12', icon: '#fde047' },
    icon: 'crown',
    image: '/images/badges/300-days-total.png',
  },
  // ── Streak Badges ──
  {
    id: 'streak-1',
    type: 'streak',
    threshold: 1,
    title: 'First Step',
    description: '1-day streak! The hardest step is the first one.',
    colors: { ring: '#f8fafc', glow: '#e2e8f0', bg: '#0f172a', icon: '#ffffff' },
    icon: 'spark',
    image: '/images/badges/30-days-streak.png',
  },
  {
    id: 'streak-30',
    type: 'streak',
    threshold: 30,
    title: 'Flame Ignited',
    description: '30-day streak! Your fire is lit.',
    colors: { ring: '#ef4444', glow: '#dc2626', bg: '#7f1d1d', icon: '#fca5a5' },
    icon: 'flame',
    image: '/images/badges/1-day-streak.png',
  },
  {
    id: 'streak-60',
    type: 'streak',
    threshold: 60,
    title: 'Inferno Rising',
    description: '60-day streak! Burning through limits.',
    colors: { ring: '#f59e0b', glow: '#d97706', bg: '#78350f', icon: '#fcd34d' },
    icon: 'bolt',
    image: '/images/badges/60-days-streak.png',
  },
  {
    id: 'streak-90',
    type: 'streak',
    threshold: 90,
    title: 'Unbreakable',
    description: '90-day streak! Nothing can stop you now.',
    colors: { ring: '#8b5cf6', glow: '#7c3aed', bg: '#4c1d95', icon: '#c4b5fd' },
    icon: 'shield',
    image: '/images/badges/90-days-streak.png',
  },
  {
    id: 'streak-150',
    type: 'streak',
    threshold: 150,
    title: 'Mythic Discipline',
    description: '150-day streak! Discipline of a demigod.',
    colors: { ring: '#06b6d4', glow: '#0891b2', bg: '#164e63', icon: '#67e8f9' },
    icon: 'diamond',
    image: '/images/badges/150-days-streak.png',
  },
  {
    id: 'streak-210',
    type: 'streak',
    threshold: 210,
    title: 'Immortal Grind',
    description: '210-day streak! You have transcended mortal limits.',
    colors: { ring: '#f43f5e', glow: '#e11d48', bg: '#881337', icon: '#fda4af' },
    icon: 'star',
    image: '/images/badges/210-days-streak.png',
  },
];

/**
 * Circular badge component — uses the generated image if available,
 * with a glowing round border styled to the badge color.
 */
export default function BadgeSVG({ badge, earned = false, size = 120, onClick }) {
  const { colors, title, image } = badge;

  return (
    <div
      onClick={onClick}
      className="badge-svg-wrapper"
      style={{ width: size, height: size, cursor: earned ? 'pointer' : 'default' }}
      title={earned ? title : '???'}
    >
      <div
        className={`badge-circle ${earned ? 'badge-circle-earned' : 'badge-circle-locked'}`}
        style={{
          width: size,
          height: size,
          '--badge-ring-color': colors.ring,
          '--badge-glow-color': colors.glow,
        }}
      >
        {earned && image ? (
          <img
            src={image}
            alt={title}
            className="badge-image"
            style={{ width: size - 8, height: size - 8 }}
          />
        ) : (
          <div className="badge-lock-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <svg width={size * 0.3} height={size * 0.3} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
