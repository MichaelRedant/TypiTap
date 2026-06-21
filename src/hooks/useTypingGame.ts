import { useState, useEffect, useCallback, useRef } from 'react';
import type { Level, CharStatus, MascotMood } from '../types';
import { useSound } from './useSound';

interface DisplayChar {
  char: string;
  status: CharStatus;
  hadError: boolean;
}

interface UseTypingGameReturn {
  displayChars: DisplayChar[];
  exerciseIdx: number;
  totalExercises: number;
  accuracy: number;
  wpm: number;
  wrongFlash: boolean;
  isComplete: boolean;
  mascotMood: MascotMood;
  currentKey: string;
  timeSeconds: number;
  progressPercent: number;
  isPaused: boolean;
  togglePause: () => void;
}

function calcStars(accuracy: number, wpm: number, targetWpm: number): number {
  const speedOk = targetWpm === 0 || wpm >= targetWpm;
  if (accuracy >= 95 && speedOk) return 3;
  if (accuracy >= 78) return 2;
  return 1;
}

export function useTypingGame(
  level: Level,
  onComplete: (accuracy: number, stars: number, timeSeconds: number, wpm: number) => void,
  introComplete: boolean,
): UseTypingGameReturn {
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [currentPos, setCurrentPos] = useState(0);
  const [charStatuses, setCharStatuses] = useState<CharStatus[]>([]);
  const [charErrors, setCharErrors] = useState<boolean[]>([]);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [wrongPresses, setWrongPresses] = useState(0);
  const [correctPresses, setCorrectPresses] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [mascotMood, setMascotMood] = useState<MascotMood>('neutral');
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);
  const pauseStartRef = useRef<number | null>(null);
  const totalPausedMsRef = useRef(0);

  const { play } = useSound();

  const currentExercise = level.exercises[exerciseIdx] ?? '';

  useEffect(() => {
    const len = currentExercise.length;
    setCharStatuses(Array(len).fill('upcoming').map((_, i) => i === 0 ? 'current' : 'upcoming'));
    setCharErrors(Array(len).fill(false));
    setCurrentPos(0);
  }, [exerciseIdx, currentExercise]);

  useEffect(() => {
    if (startTime && !isComplete && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeSeconds(Math.floor((Date.now() - startTime - totalPausedMsRef.current) / 1000));
      }, 500);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTime, isComplete, isPaused]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => {
      if (!prev) {
        // Pausing
        pauseStartRef.current = Date.now();
      } else {
        // Resuming
        if (pauseStartRef.current) {
          totalPausedMsRef.current += Date.now() - pauseStartRef.current;
          pauseStartRef.current = null;
        }
      }
      return !prev;
    });
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!introComplete) return;
    if (completedRef.current) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      togglePause();
      return;
    }

    if (isPaused) return;

    const key = e.key;
    if (key.length !== 1 && key !== ' ') return;
    const typedKey = key === ' ' ? ' ' : key;

    e.preventDefault();

    if (!startTime) setStartTime(Date.now());

    const expected = currentExercise[currentPos];
    if (expected === undefined) return;

    if (typedKey === expected) {
      play('correct');
      setCorrectPresses(n => n + 1);
      setMascotMood('happy');
      setTimeout(() => setMascotMood('neutral'), 300);

      setCharStatuses(prev => {
        const next = [...prev];
        next[currentPos] = charErrors[currentPos] ? 'corrected' : 'correct';
        const nextPos = currentPos + 1;
        if (nextPos < next.length) next[nextPos] = 'current';
        return next;
      });

      const nextPos = currentPos + 1;
      if (nextPos >= currentExercise.length) {
        const nextExIdx = exerciseIdx + 1;
        if (nextExIdx >= level.exercises.length) {
          completedRef.current = true;
          setIsComplete(true);
          setMascotMood('celebrating');
          play('complete');
          const totalCorrect = correctPresses + 1;
          const total = totalCorrect + wrongPresses;
          const acc = total > 0 ? Math.round((totalCorrect / total) * 100) : 100;
          const elapsed = startTime
            ? Math.floor((Date.now() - startTime - totalPausedMsRef.current) / 1000)
            : 0;
          const calculatedWpm = elapsed > 0 ? Math.round((totalCorrect / 5) / (elapsed / 60)) : 0;
          const stars = calcStars(acc, calculatedWpm, level.targetWpm);
          setTimeout(() => onComplete(acc, stars, elapsed, calculatedWpm), 800);
        } else {
          setExerciseIdx(nextExIdx);
        }
      } else {
        setCurrentPos(nextPos);
      }
    } else {
      play('wrong');
      setWrongPresses(n => n + 1);
      setMascotMood('oops');
      setCharErrors(prev => { const next = [...prev]; next[currentPos] = true; return next; });
      setCharStatuses(prev => { const next = [...prev]; next[currentPos] = 'error-flash'; return next; });
      setWrongFlash(true);
      setTimeout(() => {
        setWrongFlash(false);
        setMascotMood('neutral');
        setCharStatuses(prev => {
          const next = [...prev];
          if (next[currentPos] === 'error-flash') next[currentPos] = 'current';
          return next;
        });
      }, 300);
    }
  }, [introComplete, isPaused, currentExercise, currentPos, charErrors, exerciseIdx, level.exercises.length, level.targetWpm, startTime, correctPresses, wrongPresses, play, onComplete, togglePause]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const displayChars: DisplayChar[] = currentExercise.split('').map((char, i) => ({
    char,
    status: charStatuses[i] ?? 'upcoming',
    hadError: charErrors[i] ?? false,
  }));

  const totalAttempts = correctPresses + wrongPresses;
  const accuracy = totalAttempts > 0 ? Math.round((correctPresses / totalAttempts) * 100) : 100;
  const wpm = timeSeconds > 0 ? Math.round((correctPresses / 5) / (timeSeconds / 60)) : 0;
  const totalCharsInLevel = level.exercises.reduce((sum, ex) => sum + ex.length, 0);
  const charsBeforeCurrentEx = level.exercises.slice(0, exerciseIdx).reduce((sum, ex) => sum + ex.length, 0);
  const progressPercent = Math.round(((charsBeforeCurrentEx + currentPos) / totalCharsInLevel) * 100);

  return {
    displayChars, exerciseIdx, totalExercises: level.exercises.length,
    accuracy, wpm, wrongFlash, isComplete, mascotMood,
    currentKey: currentExercise[currentPos] ?? '',
    timeSeconds, progressPercent, isPaused, togglePause,
  };
}

export { calcStars };
