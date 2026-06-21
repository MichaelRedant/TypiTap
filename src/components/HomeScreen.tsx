import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Mascot from './Mascot';
import MascotPicker from './MascotPicker';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';
import { LEVELS } from '../data/levels';
import { ALL_MASCOT_VARIANTS } from './Mascot';

function getGreeting(name: string, isDark: boolean): string {
  const h = new Date().getHours();
  if (isDark) {
    if (h < 12) return `Goedemorgen, ${name}. 🌅`;
    if (h < 18) return `Hey ${name}. 👾`;
    return `Goedenavond, ${name}. 🌙`;
  }
  if (h < 12) return `Goedemorgen, ${name}! ☀️`;
  if (h < 18) return `Goedemiddag, ${name}! 👋`;
  return `Goedenavond, ${name}! 🌙`;
}

export default function HomeScreen() {
  const {
    goTo, getTotalStars, getProgress, getMascotVariant, getActiveProfile,
    getSoundEnabled, setSoundEnabled, getKeyboardHints, setKeyboardHints, getStreak,
  } = useGameStore();
  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const progress = getProgress();
  const mascotVariant = getMascotVariant();
  const activeProfile = getActiveProfile();
  const soundEnabled = getSoundEnabled();
  const keyboardHints = getKeyboardHints();
  const streak = getStreak();
  const totalStars = getTotalStars();
  const levelsPlayed = Object.values(progress).filter(p => p.played).length;
  const maxStars = LEVELS.length * 3;
  const mascotName = ALL_MASCOT_VARIANTS[mascotVariant]?.name ?? '';

  const textColor = theme.isDark ? 'rgba(255,255,255,0.9)' : undefined;
  const subtleColor = theme.isDark ? 'rgba(255,255,255,0.45)' : undefined;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ background: theme.bgMain }}>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="text-center"
      >
        {activeProfile && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-sm font-bold mb-1"
            style={{ color: theme.textSubtle }}
          >
            {getGreeting(activeProfile.name, theme.isDark)}
          </motion.p>
        )}
        <h1 className="text-7xl font-black mb-1"
          style={{ background: theme.isDark
            ? 'linear-gradient(135deg, #38BDF8, #7DD3FC)'
            : 'linear-gradient(135deg, #7C3AED, #EC4899)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          TypiTap
        </h1>
        <p className="text-xl font-semibold mb-1" style={{ color: theme.textSubtle }}>
          {theme.isDark
            ? `Type samen met ${mascotName}! ⌨️`
            : `Leer blind typen met ${mascotName} de kat! 🐱`}
        </p>
        <div className="flex items-center justify-center gap-2 mb-2">
          <button
            onClick={() => goTo('profiles')}
            className="text-sm font-bold hover:opacity-80 cursor-pointer bg-transparent border-none"
            style={{ color: theme.textSubtle }}
          >
            👤 {activeProfile?.name ?? ''} · Wissel profiel
          </button>
          {streak >= 2 && (
            <span className="text-sm font-black text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">
              🔥 {streak}
            </span>
          )}
        </div>
      </motion.div>

      {/* Mascot */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
        className="flex flex-col items-center"
      >
        <Mascot mood="happy" size={200} />
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPicker(true)}
          className="mt-2 px-5 py-2 rounded-full text-sm font-black cursor-pointer border-none"
          style={{
            color: theme.accentColor,
            background: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.8)',
          }}
        >
          ✏️ {theme.isDark ? 'Verander karakter' : 'Verander mascotte'}
        </motion.button>
      </motion.div>

      {/* Settings toggles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="flex gap-2 mt-3"
      >
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-black cursor-pointer border-none transition-all"
          style={{
            background: soundEnabled
              ? (theme.isDark ? 'rgba(14,165,233,0.2)' : 'rgba(124,58,237,0.1)')
              : (theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
            color: soundEnabled ? theme.accentColor : (theme.isDark ? '#475569' : '#94A3B8'),
          }}
        >
          {soundEnabled ? '🔊' : '🔇'} Geluid
        </button>
        <button
          onClick={() => setKeyboardHints(!keyboardHints)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-black cursor-pointer border-none transition-all"
          style={{
            background: keyboardHints
              ? (theme.isDark ? 'rgba(14,165,233,0.2)' : 'rgba(124,58,237,0.1)')
              : (theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
            color: keyboardHints ? theme.accentColor : (theme.isDark ? '#475569' : '#94A3B8'),
          }}
        >
          ⌨️ {keyboardHints ? 'Toetsen aan' : 'Toetsen uit'}
        </button>
      </motion.div>

      {levelsPlayed > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="mt-4 flex gap-4 text-center">
          <div className="rounded-2xl px-5 py-3 shadow" style={{ background: theme.bgCard }}>
            <div className="text-3xl font-black" style={{ color: theme.accentColor }}>{levelsPlayed}</div>
            <div className="text-sm font-semibold" style={{ color: theme.isDark ? '#475569' : '#94A3B8' }}>levels</div>
          </div>
          <div className="rounded-2xl px-5 py-3 shadow" style={{ background: theme.bgCard }}>
            <div className="text-3xl font-black text-yellow-500">{totalStars}<span className="text-2xl">⭐</span></div>
            <div className="text-sm font-semibold" style={{ color: theme.isDark ? '#475569' : '#94A3B8' }}>van {maxStars}</div>
          </div>
        </motion.div>
      )}

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => goTo('levelmap')}
        className="mt-6 px-12 py-5 rounded-3xl text-2xl font-black text-white shadow-lg cursor-pointer border-none outline-none"
        style={{ background: theme.btnGradient, boxShadow: theme.isDark ? '0 8px 30px rgba(2,132,199,0.35)' : '0 8px 30px rgba(124,58,237,0.35)' }}
      >
        {levelsPlayed > 0 ? '▶ Doorgaan!' : '🚀 Spelen!'}
      </motion.button>

      {levelsPlayed > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => goTo('stats')}
          className="mt-3 px-8 py-3 rounded-2xl text-base font-black cursor-pointer border-none"
          style={{ color: theme.accentColor, background: theme.bgCard }}
        >
          🏅 Mijn badges
        </motion.button>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-5 text-sm font-semibold"
        style={{ color: theme.isDark ? '#334155' : '#C4B5FD' }}
      >
        15 levels · Nederlands · Gratis & offline
      </motion.p>

      <AnimatePresence>
        {showPicker && <MascotPicker onClose={() => setShowPicker(false)} />}
      </AnimatePresence>
    </div>
  );
}
