import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTypingGame } from '../hooks/useTypingGame';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';
import { LEVELS } from '../data/levels';
import type { Level } from '../types';
import Mascot from './Mascot';
import KeyboardVisual from './KeyboardVisual';
import FingerHint from './FingerHint';
import LevelHandsIntro from './LevelHandsIntro';

function LevelIntro({ level, onDone }: { level: Level; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4500);
    const onKey = (e: KeyboardEvent) => { if (e.key !== 'Escape') onDone(); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-6 overflow-y-auto"
      style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.97), rgba(124,58,237,0.97))' }}
      onClick={onDone}
    >
      <div className="text-center text-white max-w-sm w-full py-8">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.1 }} className="text-6xl mb-3">
          {level.emoji}
        </motion.div>
        <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-3xl font-black mb-1">
          {level.title}
        </motion.h2>
        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-base text-purple-200 mb-4">
          {level.subtitle}
        </motion.p>

        {level.newKeys.length > 0 && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }} className="bg-white/15 rounded-2xl px-5 py-3 mb-4">
            <p className="text-xs font-bold text-purple-200 mb-2">✨ Nieuwe toetsen:</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {level.newKeys.map(k => (
                <span key={k} className="bg-white text-purple-700 font-black text-xl px-4 py-1.5 rounded-xl shadow-lg">
                  {k === ',' ? ',' : k === '.' ? '.' : k.toUpperCase()}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Animated hand position guide */}
        <div className="bg-white/10 rounded-2xl px-4 py-3 mb-4" onClick={e => e.stopPropagation()}>
          <LevelHandsIntro allKeys={level.allKeys} />
        </div>

        {level.targetWpm > 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-purple-200 text-sm mb-3">
            🎯 Doel: {level.targetWpm} woorden/minuut voor 3 sterren
          </motion.p>
        )}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-white/40 text-sm">
          Druk op een toets of tik om te beginnen…
        </motion.p>
      </div>
    </motion.div>
  );
}

function PauseOverlay({ onResume, onStop }: { onResume: () => void; onStop: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{ background: 'rgba(30, 10, 80, 0.88)', backdropFilter: 'blur(6px)' }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 20 }}
        transition={{ type: 'spring', damping: 18 }}
        className="text-center"
      >
        <div className="text-6xl mb-3">⏸</div>
        <h2 className="text-3xl font-black text-white mb-8">Gepauzeerd</h2>
        <div className="flex flex-col gap-3 w-56">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={onResume}
            className="py-4 rounded-2xl text-lg font-black text-white cursor-pointer border-none shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}
          >
            ▶ Doorgaan
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={onStop}
            className="py-4 rounded-2xl text-lg font-black text-white/80 bg-white/10 cursor-pointer border border-white/20"
          >
            ✕ Stoppen
          </motion.button>
        </div>
        <p className="text-white/40 text-xs mt-5 font-semibold">Druk op Escape om te hervatten</p>
      </motion.div>
    </motion.div>
  );
}

export default function TypingGame() {
  const { selectedLevelId, saveResult, goTo, getKeyboardHints, getAgeGroup } = useGameStore();
  const theme = useTheme();
  const rawLevel = LEVELS.find(l => l.id === selectedLevelId);
  const isOlder = getAgeGroup() === 'older';
  const level = rawLevel ? {
    ...rawLevel,
    exercises: (isOlder && rawLevel.exercisesOlder) ? rawLevel.exercisesOlder : rawLevel.exercises,
    targetWpm: (isOlder && rawLevel.targetWpmOlder != null) ? rawLevel.targetWpmOlder : rawLevel.targetWpm,
    subtitle: (isOlder && rawLevel.subtitleOlder) ? rawLevel.subtitleOlder : rawLevel.subtitle,
  } : rawLevel;
  const [introComplete, setIntroComplete] = useState(false);
  const keyboardHints = getKeyboardHints();

  const onComplete = useCallback((accuracy: number, stars: number, timeSeconds: number, wpm: number) => {
    if (!rawLevel) return;
    saveResult({ levelId: rawLevel.id, accuracy, stars, timeSeconds, wpm });
  }, [rawLevel, saveResult]);

  const {
    displayChars, exerciseIdx, totalExercises, accuracy, wpm,
    wrongFlash, isComplete, mascotMood, currentKey, timeSeconds,
    progressPercent, isPaused, togglePause,
  } = useTypingGame(level!, onComplete, introComplete);

  useEffect(() => { if (!rawLevel) goTo('levelmap'); }, [rawLevel, goTo]);
  if (!level) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: theme.bgMain }}>

      <AnimatePresence>
        {!introComplete && <LevelIntro level={level} onDone={() => setIntroComplete(true)} />}
      </AnimatePresence>

      <AnimatePresence>
        {isPaused && <PauseOverlay onResume={togglePause} onStop={() => goTo('levelmap')} />}
      </AnimatePresence>

      {/* Header */}
      <div className="backdrop-blur-md shadow-sm px-4 py-3" style={{ background: theme.bgHeader }}>
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => goTo('levelmap')}
            className="font-bold text-lg cursor-pointer bg-transparent border-none"
            style={{ color: theme.accentColor }}
          >
            ← Terug
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">{level.emoji}</span>
              <h1 className="text-base font-black" style={{ color: theme.textTitle }}>{level.title}</h1>
            </div>
            <div
              className="w-full rounded-full h-2 mt-1"
              style={{ background: theme.isDark ? 'rgba(255,255,255,0.07)' : '#EDE9FE' }}
            >
              <motion.div
                className="h-2 rounded-full"
                style={{ background: theme.btnGradient }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right text-sm font-bold">
              <div style={{ color: theme.accentColor }}>{exerciseIdx + 1}/{totalExercises}</div>
              <div style={{ color: theme.isDark ? 'rgba(100,116,139,0.8)' : '#94A3B8' }}>{accuracy}%</div>
            </div>
            {introComplete && !isComplete && (
              <button
                onClick={togglePause}
                className="w-8 h-8 rounded-full font-black text-sm flex items-center justify-center cursor-pointer border-none"
                style={{
                  background: theme.isDark ? 'rgba(129,140,248,0.15)' : '#EDE9FE',
                  color: theme.accentColor,
                }}
                title="Pauzeren (Escape)"
              >
                {isPaused ? '▶' : '⏸'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-between py-4 px-4 max-w-2xl mx-auto w-full">
        <div className="text-center mb-2">
          <p className="font-semibold text-sm" style={{ color: theme.isDark ? 'rgba(100,116,139,0.8)' : '#64748B' }}>
            {level.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-4 w-full justify-center">
          <div className="flex-shrink-0">
            <Mascot mood={isComplete ? 'celebrating' : mascotMood} size={110} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${exerciseIdx}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl shadow-lg p-5 flex-1 min-h-24"
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
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-center text-red-400 text-sm font-bold mt-2">
                  Probeer opnieuw! 🙈
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {introComplete && !isComplete && currentKey && (
          <div className="my-1">
            <FingerHint currentKey={currentKey} isDark={theme.isDark} />
          </div>
        )}

        <div className="flex gap-3 my-3">
          {[
            { value: `${accuracy}%`, label: 'Nauwkeurigheid', color: theme.accentColor },
            { value: `${timeSeconds}s`, label: 'Tijd', color: theme.isDark ? '#38BDF8' : '#3B82F6' },
            { value: wpm, label: 'WPM', color: theme.isDark ? '#34D399' : '#10B981' },
          ].map(s => (
            <div
              key={s.label}
              className="rounded-xl px-3 py-2 text-center shadow-sm flex-1"
              style={{ background: theme.bgCard }}
            >
              <div className="text-lg font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs font-semibold" style={{ color: theme.isDark ? 'rgba(100,116,139,0.7)' : '#94A3B8' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {keyboardHints && (
          <div className="w-full max-w-md">
            <KeyboardVisual currentKey={currentKey} availableKeys={level.allKeys} />
          </div>
        )}
      </div>
    </div>
  );
}
