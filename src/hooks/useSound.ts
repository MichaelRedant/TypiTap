import { useCallback, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export function useSound() {
  const getSoundEnabled = useGameStore(s => s.getSoundEnabled);
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = () => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  };

  const playTone = useCallback((freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not available, silently ignore
    }
  }, []);

  const play = useCallback((type: 'correct' | 'wrong' | 'complete' | 'star') => {
    if (!getSoundEnabled()) return;
    if (type === 'correct') {
      playTone(880, 0.07, 'sine', 0.2);
    } else if (type === 'wrong') {
      playTone(180, 0.12, 'sawtooth', 0.15);
    } else if (type === 'complete') {
      try {
        const ctx = getCtx();
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          const t = ctx.currentTime + i * 0.13;
          gain.gain.setValueAtTime(0.25, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
          osc.start(t);
          osc.stop(t + 0.25);
        });
      } catch {
        // ignore
      }
    } else if (type === 'star') {
      try {
        const ctx = getCtx();
        [660, 880, 1100].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          const t = ctx.currentTime + i * 0.1;
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
          osc.start(t);
          osc.stop(t + 0.15);
        });
      } catch {
        // ignore
      }
    }
  }, [getSoundEnabled, playTone]);

  return { play };
}
