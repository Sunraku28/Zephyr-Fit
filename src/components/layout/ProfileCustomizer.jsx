import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AVAILABLE_PROFILES, AVAILABLE_FRAMES } from '../../data/profileAssets';

export default function ProfileCustomizer({ profilePic, profileFrame, setProfileAssets, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('menu'); // 'menu' | 'customize'
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef(null);

  // In a real app we'd load these from the public folder,
  // but if they don't exist yet we can render a placeholder color.
  const getPicUrl = (pic) => pic === 'default.png' ? null : `/images/profile/${pic}`;
  const getFrameUrl = (frame) => frame === 'none' ? null : `/images/frames/${frame}`;

  // Color-matched glow for each frame type
  const getGlowColor = (frameName) => {
    if (!frameName || frameName === 'none') return null;
    if (frameName.includes('bronze')) return 'rgba(205,127,50,0.45)';
    if (frameName.includes('silver')) return 'rgba(192,192,220,0.4)';
    if (frameName.includes('gold')) return 'rgba(255,215,0,0.45)';
    if (frameName.includes('platinum')) return 'rgba(180,220,255,0.4)';
    if (frameName.includes('diamond')) return 'rgba(0,200,255,0.5)';
    if (frameName.includes('legendary')) return 'rgba(255,50,50,0.5)';
    if (frameName.includes('prismatic')) return 'rgba(200,100,255,0.5)';
    if (frameName.includes('flame')) return 'rgba(255,100,20,0.55)';
    if (frameName.includes('halo')) return 'rgba(255,230,80,0.45)';
    if (frameName.includes('railgun')) return 'rgba(0,255,200,0.45)';
    if (frameName.includes('infinite') || frameName.includes('loop')) return 'rgba(150,50,255,0.5)';
    return 'rgba(0,232,157,0.35)';
  };

  const handleToggle = () => {
    if (!isOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 12,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen(!isOpen);
    setView('menu');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (btnRef.current && !btnRef.current.contains(e.target)) {
        const portal = document.getElementById('profile-dropdown-portal');
        if (portal && portal.contains(e.target)) return;
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const dropdown = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="profile-dropdown-portal"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-72 border border-panel-border shadow-2xl rounded-2xl p-4 overflow-hidden backdrop-blur-xl"
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            right: dropdownPos.right,
            zIndex: 9999,
            background: 'var(--void)',
          }}
        >
          {view === 'menu' ? (
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setView('customize')}
                className="w-full text-left px-4 py-3 rounded-xl bg-glass-bg border border-transparent hover:border-glass-border hover:bg-glass-bg/50 transition-all font-bold text-text flex items-center gap-3"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                Change Look
              </button>
              <button 
                onClick={onLogout}
                className="w-full text-left px-4 py-3 rounded-xl bg-glass-bg border border-transparent hover:border-red/30 hover:bg-red/10 transition-all font-bold text-red flex items-center gap-3"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                Log out
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <h3 className="text-text text-sm font-semibold mb-2 uppercase tracking-wider">Profile Picture</h3>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_PROFILES.map((pic) => (
                    <button
                      key={pic}
                      onClick={() => setProfileAssets(pic, profileFrame)}
                      className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${profilePic === pic ? 'border-mint scale-110' : 'border-transparent hover:border-panel-border'}`}
                    >
                      {getPicUrl(pic) ? (
                        <img src={getPicUrl(pic)} alt={pic} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-void-2 border border-panel-border" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-text text-sm font-semibold mb-2 uppercase tracking-wider">Frame</h3>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_FRAMES.map((frame) => (
                    <button
                      key={frame}
                      onClick={() => setProfileAssets(profilePic, frame)}
                      className={`relative w-12 h-12 rounded-full border-2 transition-all ${profileFrame === frame ? 'border-mint scale-110' : 'border-transparent hover:border-panel-border'}`}
                    >
                      <div className="absolute inset-2 bg-void-2 rounded-full border border-panel-border" />
                      {getFrameUrl(frame) ? (
                        <motion.img
                          src={getFrameUrl(frame)}
                          alt={frame}
                          className="absolute inset-0 w-full h-full object-cover scale-[1.6] origin-center drop-shadow-[0_0_8px_rgba(0,232,157,0.5)] mix-blend-screen z-20"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-text-dim">None</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setView('menu')}
                  className="w-1/3 py-2 border border-panel-border hover:bg-glass-bg text-text rounded-lg font-bold transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 bg-mint hover:bg-opacity-80 text-void rounded-lg font-bold transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative">
      {/* Current Profile Display */}
      <button
        ref={btnRef}
        onClick={handleToggle}
        className="relative w-16 h-16 rounded-full focus:outline-none focus:ring-2 focus:ring-mint hover:scale-105 transition-transform cursor-pointer"
      >
        {/* Color-matched background glow */}
        {getGlowColor(profileFrame) && (
          <motion.div
            className="absolute inset-0 rounded-full z-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${getGlowColor(profileFrame)} 0%, transparent 70%)`,
              filter: 'blur(6px)',
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          />
        )}

        <div className="absolute inset-2 rounded-full bg-panel overflow-hidden flex items-center justify-center border-2 border-panel-border z-10">
          {getPicUrl(profilePic) ? (
            <img src={getPicUrl(profilePic)} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-void-2 flex items-center justify-center text-text font-bold text-xl">
              ?
            </div>
          )}
        </div>

        {getFrameUrl(profileFrame) && (
          <motion.img
            src={getFrameUrl(profileFrame)}
            alt="Frame"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-[1.6] origin-center drop-shadow-[0_0_8px_rgba(0,232,157,0.5)] mix-blend-screen z-20"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          />
        )}
      </button>

      {/* Portal the dropdown to document.body so it escapes overflow-hidden parents */}
      {createPortal(dropdown, document.body)}
    </div>
  );
}
