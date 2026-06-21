import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';
import { LEVELS, CHAPTERS } from '../data/levels';
import StarDisplay from './StarDisplay';

export default function LevelMap() {
  const { selectLevel, isLevelUnlocked, getProgress, goTo, getTotalStars } = useGameStore();
  const theme = useTheme();
  const progress = getProgress();
  const totalStars = getTotalStars();
  const maxStars = LEVELS.length * 3;

  return (
    <div className="min-h-screen pb-10" style={{ background: theme.bgMain }}>
      <div className="sticky top-0 z-10 backdrop-blur-md shadow-sm" style={{ background: theme.bgHeader }}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => goTo('home')}
            className="font-bold text-xl cursor-pointer bg-transparent border-none"
            style={{ color: theme.accentColor }}
          >
            ← Terug
          </button>
          <h1 className="text-2xl font-black flex-1 text-center" style={{ color: theme.textTitle }}>Kies een Level</h1>
          <button
            onClick={() => goTo('stats')}
            className="font-bold text-sm cursor-pointer bg-transparent border-none"
            style={{ color: theme.accentColor }}
            title="Badges bekijken"
          >
            🏅 {totalStars}/{maxStars}⭐
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 flex flex-col gap-6">
        {CHAPTERS.map((chapter, ci) => {
          const chapterStyle = theme.chapters[ci] ?? theme.chapters[0];
          const chapterLevels = chapter.levelIds.map(id => LEVELS.find(l => l.id === id)!);
          const completedInChapter = chapterLevels.filter(l => progress[l.id]?.played).length;

          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.1 }}
              className={`bg-gradient-to-br ${chapterStyle.bg} rounded-3xl border ${chapterStyle.border} p-5 shadow-md`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">{chapter.emoji}</span>
                <div className="flex-1">
                  <h2 className={`text-xl font-black ${chapterStyle.title}`}>Hoofdstuk {chapter.id}: {chapter.name}</h2>
                  <p className="text-sm text-slate-500">{completedInChapter}/{chapterLevels.length} levels gespeeld</p>
                </div>
              </div>
              {/* Hoofdstuk voortgangsbalk */}
              {completedInChapter > 0 && (
                <div className="mb-4">
                  <div className="w-full bg-white/60 rounded-full h-2.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round((completedInChapter / chapterLevels.length) * 100)}%` }}
                      transition={{ duration: 0.8, delay: ci * 0.1 + 0.2 }}
                      className={`h-2.5 rounded-full ${chapterStyle.bar}`}
                    />
                  </div>
                  <p className="text-xs text-slate-400 font-semibold text-right mt-0.5">
                    {Math.round((completedInChapter / chapterLevels.length) * 100)}%
                  </p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                {chapterLevels.map((level) => {
                  const unlocked = isLevelUnlocked(level.id);
                  const prog = progress[level.id];
                  const stars = prog?.stars ?? 0;
                  const played = prog?.played ?? false;

                  return (
                    <motion.button
                      key={level.id}
                      whileHover={unlocked ? { scale: 1.05 } : {}}
                      whileTap={unlocked ? { scale: 0.97 } : {}}
                      onClick={() => unlocked && selectLevel(level.id)}
                      className={`
                        flex flex-col items-center p-3 rounded-2xl border-2 transition-all cursor-pointer
                        ${unlocked
                          ? played
                            ? 'bg-white border-transparent shadow-md'
                            : 'bg-white/80 border-dashed border-slate-300 shadow'
                          : 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
                        }
                      `}
                    >
                      <div className="text-2xl mb-1">
                        {unlocked ? level.emoji : '🔒'}
                      </div>
                      <div className="text-xs font-black text-slate-700 text-center leading-tight mb-1">
                        {level.id}. {level.title}
                      </div>
                      {played && <StarDisplay stars={stars} size="sm" />}
                      {played && prog?.bestAccuracy && (
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs text-purple-500 font-bold">{prog.bestAccuracy}%</span>
                          {prog.bestWpm > 0 && (
                            <span className="text-xs text-green-500 font-bold">{prog.bestWpm}wpm</span>
                          )}
                        </div>
                      )}
                      {!played && unlocked && <span className="text-xs text-slate-400 font-semibold">Nieuw!</span>}
                      {!played && !unlocked && <span className="text-xs text-slate-400">🔒</span>}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
