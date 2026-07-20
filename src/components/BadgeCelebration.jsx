import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Full-screen LeetCode-style celebration overlay when a badge is earned.
 * Shows the badge image rotating in 3D with sparkles, title, and description.
 */
export default function BadgeCelebration({ badge, onClose }) {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    // Generate sparkle particles (✦ ✧ ★ shapes)
    const pts = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 1.2,
      duration: Math.random() * 2 + 1.5,
      rotation: Math.random() * 360,
    }));
    setSparkles(pts);

    // Auto-close after 6 seconds
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [badge, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="badge-celebration-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
      >
        {/* Sparkle particles — ✦ shapes scattered */}
        {sparkles.map(s => (
          <motion.div
            key={s.id}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              fontSize: s.size,
              color: '#fff',
              pointerEvents: 'none',
              zIndex: 2,
            }}
            animate={{
              opacity: [0, 0.9, 0],
              scale: [0, 1.2, 0],
              rotate: [0, s.rotation],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          >
            ✦
          </motion.div>
        ))}

        {/* 3D Badge container — continuous Y-axis rotation like LeetCode */}
        <div style={{ perspective: 1200, width: 220, height: 220, position: 'relative' }}>
          <motion.div
            className="badge-celebration-badge"
            style={{
              transformStyle: 'preserve-3d',
              width: '100%',
              height: '100%',
              position: 'relative'
            }}
            initial={{ scale: 0, rotateY: -90 }}
            animate={{ scale: 1, rotateY: [0, 360] }}
            transition={{
              scale: { type: 'spring', stiffness: 150, damping: 12, delay: 0.2 },
              rotateY: {
                duration: 4,
                ease: 'linear',
                repeat: Infinity,
                delay: 0.6,
              },
            }}
          >
            {/* 3D Extruded Badge Layers */}
            {badge.image ? (
              <motion.div style={{
                width: '100%',
                height: '100%',
                transformStyle: 'preserve-3d',
                transform: 'rotateX(8deg)' /* Slight tilt to prevent disappearing edge-on */
              }}>
                {[...Array(30)].map((_, i) => {
                  const isFront = i === 29;
                  const isBack = i === 0;
                  const isEdge = !isFront && !isBack;
                  
                  return (
                    <img
                      key={i}
                      src={badge.image}
                      alt={badge.title}
                      style={{
                        position: isFront ? 'relative' : 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        transform: `translateZ(${i - 15}px) ${isBack ? 'rotateY(180deg)' : ''}`,
                        filter: isFront ? 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' : (isEdge ? 'brightness(0.7)' : 'none'),
                        pointerEvents: isFront ? 'auto' : 'none',
                        backfaceVisibility: isEdge ? 'visible' : 'hidden'
                      }}
                    />
                  );
                })}
              </motion.div>
            ) : (
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: badge.colors.bg,
                border: `8px solid ${badge.colors.ring}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 64,
                fontWeight: 900,
                color: badge.colors.ring,
                transform: 'translateZ(15px)',
                backfaceVisibility: 'hidden',
              }}>
                {badge.threshold}
              </div>
            )}
          </motion.div>
        </div>

        {/* Badge type label */}
        <motion.div
          className="badge-celebration-type"
          style={{ color: badge.colors.ring }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          {badge.type === 'total' ? '🏆 TOTAL COUNT' : '🔥 STREAK'}
        </motion.div>

        {/* Title */}
        <motion.h2
          className="badge-celebration-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          {badge.title}
        </motion.h2>

        {/* Description */}
        <motion.p
          className="badge-celebration-desc"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          {badge.description}
        </motion.p>

        {/* Threshold */}
        <motion.div
          className="badge-celebration-threshold"
          style={{ color: badge.colors.ring }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          {badge.type === 'total' ? `${badge.threshold} Days` : `${badge.threshold}-Day Streak`}
        </motion.div>

        {/* Tap to close hint */}
        <motion.p
          className="badge-celebration-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2.5 }}
        >
          Tap anywhere to close
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
