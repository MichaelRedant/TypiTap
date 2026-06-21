import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';
import { CHAPTERS, LEVELS } from '../data/levels';
import KeyboardVisual from './KeyboardVisual';
import FingerHint from './FingerHint';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Typing engine for practice (endless loop) ─────────────────────────────────

interface PracticeEngineProps {
  exercises: string[];
  allKeys: string[];
  onStop: () => void;
}

function PracticeEngine({ exercises, allKeys, onStop }: PracticeEngineProps) {
  const theme = useTheme();
  const { getKeyboardHints } = useGameStore();
  const keyboardHints = getKeyboardHints();

  const [pool, setPool] = useState(() => shuffle(exercises));
  const [exIdx, setExIdx] = useState(0);
  const [pos, setPos] = useState(0);
  const [statuses, setStatuses] = useState<('upcoming' | 'current' | 'correct' | 'corrected' | 'error-flash')[]>([]);
  const [hadError, setHadError] = useState<boolean[]>([]);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [startTime] = useState(Date.now);
  const [elapsed, setElapsed] = useState(0);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [round, setRound] = useState(1);

  const current = pool[exIdx] ?? '';

  // Init statuses when exercise changes
  useEffect(() => {
    const len = current.length;
    setStatuses(Array(len).fill('upcoming').map((_, i) => i === 0 ? 'current' : 'upcoming'));
    setHadError(Array(len).fill(false));
    setPos(0);
  }, [exIdx, pool]);

  // Timer
  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 500);
    return () => clearInterval(t);
  }, [startTime]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key === 'Escape') { onStop(); return; }
    const key = e.key;
    if (key.length !== 1 && key !== ' ') return;
    e.preventDefault();

    const expected = current[pos];
    if (expected === undefined) return;

    if (key === expected) {
      setTotalCorrect(n => n + 1);
      setStatuses(prev => {
        const next = [...prev];
        next[pos] = hadError[pos] ? 'corrected' : 'correct';
        if (pos + 1 < next.length) next[pos + 1] = 'current';
        return next;
      });
      const nextPos = pos + 1;
      if (nextPos >= current.length) {
        // Exercise done
        const nextEx = exIdx + 1;
        setDoneCount(n => n + 1);
        if (nextEx >= pool.length) {
          // All done — reshuffle and loop
          setPool(shuffle(exercises));
          setExIdx(0);
          setRound(r => r + 1);
        } else {
          setExIdx(nextEx);
        }
      } else {
        setPos(nextPos);
      }
    } else {
      setTotalWrong(n => n + 1);
      setHadError(prev => { const next = [...prev]; next[pos] = true; return next; });
      setStatuses(prev => { const next = [...prev]; next[pos] = 'error-flash'; return next; });
      setWrongFlash(true);
      setTimeout(() => {
        setWrongFlash(false);
        setStatuses(prev => {
          const next = [...prev];
          if (next[pos] === 'error-flash') next[pos] = 'current';
          return next;
        });
      }, 280);
    }
  }, [current, pos, hadError, exIdx, pool, exercises, onStop]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const totalAttempts = totalCorrect + totalWrong;
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 100;
  const wpm = elapsed > 0 ? Math.round((totalCorrect / 5) / (elapsed / 60)) : 0;
  const currentKey = current[pos] ?? '';

  const displayChars = current.split('').map((char, i) => ({
    char,
    status: statuses[i] ?? 'upcoming',
  }));

  return (
    <div className="flex-1 flex flex-col items-center justify-between py-4 px-4 max-w-2xl mx-auto w-full">
      {/* Stats bar */}
      <div className="flex gap-3 w-full mb-4">
        {[
          { label: 'Nauwkeurigheid', value: `${accuracy}%`, color: theme.accentColor },
          { label: 'WPM', value: wpm, color: theme.isDark ? '#34D399' : '#10B981' },
          { label: 'Oefeningen', value: doneCount, color: theme.isDark ? '#F472B6' : '#EC4899' },
          { label: 'Ronde', value: round, color: theme.isDark ? '#FCD34D' : '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="rounded-xl px-3 py-2 text-center shadow-sm flex-1"
            style={{ background: theme.bgCard }}>
            <div className="text-lg font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs font-semibold" style={{ color: theme.textMuted }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Exercise display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${round}-${exIdx}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.15 }}
          className="rounded-3xl shadow-lg p-6 w-full min-h-28 flex flex-col items-center justify-center"
          style={{
            background: theme.isDark ? 'rgba(255,255,255,0.05)' : 'white',
            border: theme.isDark ? '1px solid rgba(255,255,255,0.08)' : 'none',
          }}
        >
          <div className="flex flex-wrap gap-1 justify-center items-center min-h-16">
            {displayChars.map((dc, i) => (
              <motion.span
                key={i}
                className={`key-box ${dc.char === ' ' ? 'min-w-6' : ''} ${dc.status === 'error-flash' ? 'error-flash' : dc.status}`}
                animate={dc.status === 'error-flash' ? { x: [-4, 4, -4, 4, 0] } : {}}
                transition={{ duration: 0.2 }}
              >
                {dc.char === ' ' ? ' ' : dc.char}
              </motion.span>
            ))}
          </div>
          {wrongFlash && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center text-red-400 text-sm font-bold mt-2">
              Probeer opnieuw! 🙈
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Finger hint */}
      {currentKey && (
        <div className="my-2">
          <FingerHint currentKey={currentKey} isDark={theme.isDark} />
        </div>
      )}

      {/* Progress in pool */}
      <div className="w-full mt-2 mb-2">
        <div className="flex justify-between text-xs mb-1" style={{ color: theme.textMuted }}>
          <span>Oefening {exIdx + 1} van {pool.length}</span>
          <span>{Math.round(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')} min</span>
        </div>
        <div className="w-full rounded-full h-1.5" style={{ background: theme.isDark ? 'rgba(255,255,255,0.07)' : '#EDE9FE' }}>
          <motion.div className="h-1.5 rounded-full" style={{ background: theme.btnGradient }}
            animate={{ width: `${((exIdx) / pool.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Keyboard visual */}
      {keyboardHints && (
        <div className="w-full max-w-md">
          <KeyboardVisual currentKey={currentKey} availableKeys={allKeys} />
        </div>
      )}
    </div>
  );
}

// ── Chapter selector ───────────────────────────────────────────────────────────

interface ChapterConfig {
  chapterId: number;
  exercises: string[];
  allKeys: string[];
}

export default function PracticeScreen() {
  const { goTo, getAgeGroup } = useGameStore();
  const theme = useTheme();
  const [active, setActive] = useState<ChapterConfig | null>(null);

  function startChapter(chapterId: number) {
    const chapter = CHAPTERS.find(c => c.id === chapterId);
    if (!chapter) return;
    const isOlder = getAgeGroup() === 'older';
    const pool: string[] = [];
    const keys = new Set<string>();

    for (const id of chapter.levelIds) {
      const lvl = LEVELS.find(l => l.id === id);
      if (!lvl) continue;
      const exs = (isOlder && lvl.exercisesOlder) ? lvl.exercisesOlder : lvl.exercises;
      pool.push(...exs);
      lvl.allKeys.forEach(k => keys.add(k));
    }

    setActive({ chapterId, exercises: pool, allKeys: [...keys] });
  }

  function startAll() {
    const isOlder = getAgeGroup() === 'older';
    const pool: string[] = [];
    const keys = new Set<string>();
    for (const lvl of LEVELS) {
      const exs = (isOlder && lvl.exercisesOlder) ? lvl.exercisesOlder : lvl.exercises;
      pool.push(...exs);
      lvl.allKeys.forEach(k => keys.add(k));
    }
    setActive({ chapterId: 0, exercises: pool, allKeys: [...keys] });
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: theme.bgMain }}>
      {/* Header */}
      <div className="backdrop-blur-md shadow-sm px-4 py-3 sticky top-0 z-10" style={{ background: theme.bgHeader }}>
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => active ? setActive(null) : goTo('levelmap')}
            className="font-bold text-lg cursor-pointer bg-transparent border-none"
            style={{ color: theme.accentColor }}
          >
            ← {active ? 'Kies hoofdstuk' : 'Terug'}
          </button>
          <h1 className="text-lg font-black flex-1 text-center" style={{ color: theme.textTitle }}>
            🎯 Vrij Oefenen
          </h1>
          {active && (
            <button
              onClick={() => setActive(null)}
              className="text-sm font-bold cursor-pointer bg-transparent border-none"
              style={{ color: theme.textMuted }}
            >
              Stop
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!active ? (
          <motion.div
            key="selector"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="max-w-lg mx-auto px-4 pt-6 w-full flex flex-col gap-4"
          >
            <p className="text-center text-sm font-semibold" style={{ color: theme.textMuted }}>
              Kies een hoofdstuk en oefen eindeloos. De oefeningen worden elke keer gemixt.
            </p>

            {CHAPTERS.map((chapter, ci) => {
              const chapterStyle = theme.chapters[ci] ?? theme.chapters[0];
              const levelCount = chapter.levelIds.length;
              const isOlder = getAgeGroup() === 'older';
              const exCount = chapter.levelIds.reduce((sum, id) => {
                const lvl = LEVELS.find(l => l.id === id);
                if (!lvl) return sum;
                const exs = (isOlder && lvl.exercisesOlder) ? lvl.exercisesOlder : lvl.exercises;
                return sum + exs.length;
              }, 0);

              return (
                <motion.button
                  key={chapter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ci * 0.07 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startChapter(chapter.id)}
                  className={`bg-gradient-to-br ${chapterStyle.bg} rounded-3xl border ${chapterStyle.border} p-5 shadow-md text-left cursor-pointer w-full`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{chapter.emoji}</span>
                    <div className="flex-1">
                      <h2 className={`text-lg font-black ${chapterStyle.title}`}>
                        Hoofdstuk {chapter.id}: {chapter.name}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {levelCount} levels · {exCount} oefeningen in de mix
                      </p>
                    </div>
                    <span className={`text-2xl font-black ${chapterStyle.title}`}>→</span>
                  </div>
                </motion.button>
              );
            })}

            {/* All chapters */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: CHAPTERS.length * 0.07 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startAll}
              className="rounded-3xl p-5 shadow-md text-left cursor-pointer w-full text-white"
              style={{ background: theme.btnGradient }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🌟</span>
                <div className="flex-1">
                  <h2 className="text-lg font-black">Alles door elkaar</h2>
                  <p className="text-sm text-white/70">Alle 25 levels gemixed — de ultieme uitdaging</p>
                </div>
                <span className="text-2xl font-black">→</span>
              </div>
            </motion.button>

            <p className="text-center text-xs pb-6" style={{ color: theme.textMuted }}>
              Druk op Escape om te stoppen tijdens het oefenen
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="engine"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex-1 flex flex-col"
          >
            <PracticeEngine
              exercises={active.exercises}
              allKeys={active.allKeys}
              onStop={() => setActive(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
