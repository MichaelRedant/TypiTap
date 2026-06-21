import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';
import { LEVELS } from '../data/levels';
import { BADGES } from '../data/badges';
import StarDisplay from './StarDisplay';
import Mascot from './Mascot';
import { useSound } from '../hooks/useSound';

const YOUNG_MESSAGES = [
  '',
  'Goed gedaan! Blijf oefenen! 💪',
  'Heel goed! Je wordt steeds beter! 🎯',
  'Wauw, perfecte score! Je bent een ster! 🌟',
];

const OLDER_MESSAGES = [
  '',
  'Goed begin. Blijf oefenen.',
  'Solide. Je verbetert.',
  'Perfect. Kan je het nog sneller?',
];

function Confetti({ isDark }: { isDark: boolean }) {
  const colors = isDark
    ? ['#38BDF8', '#818CF8', '#34D399', '#60A5FA', '#A78BFA', '#67E8F9']
    : ['#FF6B6B', '#FFE66D', '#4ECDC4', '#A78BFA', '#FB923C', '#34D399'];

  const pieces = useMemo(() =>
    Array.from({ length: 36 }, (_, i) => ({
      id: i,
      x: (i * 2.8) % 100,
      delay: (i * 0.055) % 1.8,
      color: colors[i % 6],
      size: 7 + (i % 5) * 2,
      isCircle: i % 3 === 0,
    }))
  , []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute', left: `${p.x}%`, top: -20,
            width: p.size, height: p.size,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? '50%' : '3px',
          }}
          animate={{ y: 900, rotate: p.isCircle ? 0 : 540, opacity: [1, 1, 0.3, 0] }}
          transition={{ duration: 2.2 + (p.id % 4) * 0.3, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}

export default function ResultScreen() {
  const { lastResult, selectLevel, goTo, isLevelUnlocked, getAgeGroup } = useGameStore();
  const theme = useTheme();
  const { play } = useSound();
  const isOlder = getAgeGroup() === 'older';
  const rawLevel = lastResult ? LEVELS.find(l => l.id === lastResult.levelId) : null;
  const level = rawLevel ? {
    ...rawLevel,
    targetWpm: (isOlder && rawLevel.targetWpmOlder != null) ? rawLevel.targetWpmOlder : rawLevel.targetWpm,
  } : null;
  const nextLevel = rawLevel ? LEVELS.find(l => l.id === rawLevel.id + 1) : null;
  const newBadges = lastResult?.newBadges.map(id => BADGES.find(b => b.id === id)).filter(Boolean) ?? [];

  useEffect(() => {
    if (lastResult) setTimeout(() => play('star'), 300);
  }, [lastResult, play]);

  if (!lastResult || !level) {
    goTo('levelmap');
    return null;
  }

  const stars = lastResult.stars;
  const messages = theme.isDark ? OLDER_MESSAGES : YOUNG_MESSAGES;

  const statCards = [
    {
      value: `${lastResult.accuracy}%`,
      label: 'Nauwkeurigheid',
      bg: theme.isDark ? 'rgba(129,140,248,0.12)' : '#F5F3FF',
      color: theme.isDark ? '#818CF8' : '#7C3AED',
    },
    {
      value: `${lastResult.timeSeconds}s`,
      label: 'Tijd',
      bg: theme.isDark ? 'rgba(56,189,248,0.1)' : '#EFF6FF',
      color: theme.isDark ? '#38BDF8' : '#3B82F6',
    },
    {
      value: lastResult.wpm || '—',
      label: 'WPM',
      bg: theme.isDark ? 'rgba(52,211,153,0.1)' : '#F0FDF4',
      color: theme.isDark ? '#34D399' : '#10B981',
    },
  ];

  return (
    <>
      {stars === 3 && <Confetti isDark={theme.isDark} />}

      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
        style={{ background: theme.bgMain }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div
            className="rounded-3xl shadow-xl p-8 text-center"
            style={{
              background: theme.isDark ? 'rgba(255,255,255,0.05)' : 'white',
              border: theme.isDark ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}
          >
            {/* Mascot */}
            <div className="flex justify-center mb-3">
              <Mascot mood="celebrating" size={130} />
            </div>

            <div className="text-4xl mb-1">{level.emoji}</div>
            <h2
              className="text-xl font-black mb-1"
              style={{ color: theme.textTitle }}
            >
              {level.title}
            </h2>
            <p
              className="text-sm mb-4"
              style={{ color: theme.isDark ? 'rgba(100,116,139,0.9)' : '#64748B' }}
            >
              {messages[stars]}
            </p>

            {/* Stars */}
            <div className="my-5">
              <StarDisplay stars={stars} size="lg" animate />
            </div>

            {/* Stats */}
            <div className="flex gap-3 justify-center mb-6">
              {statCards.map(s => (
                <div key={s.label} className="rounded-2xl px-4 py-3 flex-1" style={{ background: s.bg }}>
                  <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs font-semibold mt-0.5" style={{ color: theme.isDark ? 'rgba(100,116,139,0.7)' : '#94A3B8' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {level.targetWpm > 0 && stars < 3 && (
              <p className="text-xs mb-4 font-semibold" style={{ color: theme.isDark ? 'rgba(100,116,139,0.7)' : '#94A3B8' }}>
                🎯 Doel voor 3⭐: 95% nauwkeurigheid + {level.targetWpm} WPM
              </p>
            )}

            {/* New badges */}
            <AnimatePresence>
              {newBadges.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-2xl p-4 mb-5"
                  style={{
                    background: theme.isDark ? 'rgba(251,191,36,0.1)' : '#FEFCE8',
                    border: `1px solid ${theme.isDark ? 'rgba(251,191,36,0.25)' : '#FDE68A'}`,
                  }}
                >
                  <p className="text-xs font-black mb-2" style={{ color: theme.isDark ? '#FCD34D' : '#92400E' }}>
                    🎊 Nieuwe badges verdiend!
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {newBadges.map(badge => badge && (
                      <motion.div
                        key={badge.id}
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="flex items-center gap-1 rounded-xl px-3 py-1.5 shadow-sm"
                        style={{
                          background: theme.isDark ? 'rgba(255,255,255,0.07)' : 'white',
                        }}
                      >
                        <span className="text-lg">{badge.emoji}</span>
                        <span className="text-xs font-bold" style={{ color: theme.isDark ? 'rgba(255,255,255,0.8)' : '#374151' }}>
                          {badge.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => selectLevel(level.id)}
                className="py-3 rounded-2xl text-base font-black cursor-pointer border-none"
                style={{
                  background: theme.isDark ? 'rgba(129,140,248,0.15)' : '#F5F3FF',
                  color: theme.isDark ? '#818CF8' : '#7C3AED',
                  border: theme.isDark ? '1px solid rgba(129,140,248,0.3)' : '2px solid #DDD6FE',
                }}
              >
                🔄 Opnieuw
              </motion.button>

              {nextLevel && isLevelUnlocked(nextLevel.id) && (
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => selectLevel(nextLevel.id)}
                  className="py-3 rounded-2xl text-base font-black text-white border-none cursor-pointer shadow-md"
                  style={{ background: theme.btnGradient }}
                >
                  {nextLevel.emoji} Volgend level →
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => goTo('levelmap')}
                className="py-3 rounded-2xl text-base font-bold cursor-pointer border-none"
                style={{
                  background: theme.isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                  color: theme.isDark ? 'rgba(148,163,184,0.7)' : '#64748B',
                  border: theme.isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #E2E8F0',
                }}
              >
                📋 Alle levels
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
