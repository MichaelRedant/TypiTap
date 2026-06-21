import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';
import { BADGES } from '../data/badges';
import { LEVELS } from '../data/levels';

export default function StatsScreen() {
  const { goTo, getProgress, getEarnedBadges, getTotalStars } = useGameStore();
  const theme = useTheme();
  const progress = getProgress();
  const earnedBadges = getEarnedBadges();
  const totalStars = getTotalStars();
  const levelsPlayed = Object.values(progress).filter(p => p.played).length;
  const levels3Stars = Object.values(progress).filter(p => p.stars === 3).length;
  const maxStars = LEVELS.length * 3;

  const played = Object.values(progress).filter(p => p.played);
  const bestAccuracy = played.length > 0 ? Math.max(...played.map(p => p.bestAccuracy)) : 0;
  const bestWpm = played.length > 0 ? Math.max(...played.map(p => p.bestWpm ?? 0)) : 0;

  const cardBg = theme.isDark ? 'rgba(255,255,255,0.05)' : 'white';
  const cardBorder = theme.isDark ? '1px solid rgba(255,255,255,0.08)' : 'none';
  const mutedText = theme.isDark ? 'rgba(100,116,139,0.8)' : '#94A3B8';

  const statItems = [
    { value: totalStars, label: `van ${maxStars} sterren`, color: '#F59E0B' },
    { value: levelsPlayed, label: `van ${LEVELS.length} levels`, color: theme.accentColor },
    { value: levels3Stars, label: 'levels met 3⭐', color: '#10B981' },
    { value: bestWpm || '—', label: 'beste WPM', color: theme.isDark ? '#38BDF8' : '#3B82F6' },
  ];

  return (
    <div className="min-h-screen pb-10" style={{ background: theme.bgMain }}>
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md shadow-sm" style={{ background: theme.bgHeader }}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => goTo('home')}
            className="font-bold text-xl cursor-pointer bg-transparent border-none"
            style={{ color: theme.accentColor }}
          >
            ← Terug
          </button>
          <h1 className="text-2xl font-black flex-1 text-center" style={{ color: theme.textTitle }}>
            {theme.isDark ? 'Statistieken' : 'Mijn Prestaties'}
          </h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 flex flex-col gap-5">

        {/* Stat grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3"
        >
          {statItems.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 text-center shadow"
              style={{ background: cardBg, border: cardBorder }}
            >
              <div className="text-4xl font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs font-bold mt-1" style={{ color: mutedText }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Accuracy bar */}
        {bestAccuracy > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-4 shadow"
            style={{ background: cardBg, border: cardBorder }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-black" style={{ color: theme.isDark ? 'rgba(255,255,255,0.8)' : '#475569' }}>
                Beste nauwkeurigheid
              </span>
              <span className="text-xl font-black" style={{ color: theme.accentColor }}>{bestAccuracy}%</span>
            </div>
            <div
              className="w-full rounded-full h-3"
              style={{ background: theme.isDark ? 'rgba(255,255,255,0.07)' : '#EDE9FE' }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${bestAccuracy}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-3 rounded-full"
                style={{ background: theme.btnGradient }}
              />
            </div>
          </motion.div>
        )}

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl p-5 shadow"
          style={{ background: cardBg, border: cardBorder }}
        >
          <h2 className="text-lg font-black mb-4" style={{ color: theme.textTitle }}>
            🏅 Badges ({earnedBadges.length}/{BADGES.length})
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {BADGES.map((badge, i) => {
              const earned = earnedBadges.includes(badge.id);
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.04 }}
                  className="flex items-center gap-3 p-3 rounded-2xl"
                  style={{
                    background: earned
                      ? (theme.isDark ? 'rgba(251,191,36,0.1)' : '#FEFCE8')
                      : (theme.isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC'),
                    border: earned
                      ? `1px solid ${theme.isDark ? 'rgba(251,191,36,0.25)' : '#FDE68A'}`
                      : `1px solid ${theme.isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9'}`,
                    opacity: earned ? 1 : 0.45,
                  }}
                >
                  <span className={`text-3xl ${earned ? '' : 'grayscale'}`}>{badge.emoji}</span>
                  <div>
                    <div
                      className="text-sm font-black"
                      style={{ color: theme.isDark ? 'rgba(255,255,255,0.85)' : '#374151' }}
                    >
                      {badge.name}
                    </div>
                    <div className="text-xs" style={{ color: mutedText }}>{badge.description}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {earnedBadges.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm font-semibold"
            style={{ color: mutedText }}
          >
            {theme.isDark ? 'Speel je eerste level om badges te unlocken.' : 'Speel je eerste level om badges te verdienen! 🚀'}
          </motion.p>
        )}
      </div>
    </div>
  );
}
