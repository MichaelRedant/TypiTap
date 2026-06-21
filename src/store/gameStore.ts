import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Screen, LevelProgress, GameResult, MascotVariant, Profile, AgeGroup } from '../types';
import { LEVELS } from '../data/levels';
import { BADGES } from '../data/badges';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function calcStreak(lastPlayedDate: string | null, currentStreak: number): { streak: number; lastPlayedDate: string } {
  const today = todayStr();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (lastPlayedDate === today) return { streak: currentStreak, lastPlayedDate: today };
  if (lastPlayedDate === yesterday) return { streak: currentStreak + 1, lastPlayedDate: today };
  return { streak: 1, lastPlayedDate: today };
}

interface GameStore {
  screen: Screen;
  selectedLevelId: number | null;
  lastResult: GameResult | null;
  profiles: Profile[];
  activeProfileId: string | null;

  goTo: (screen: Screen) => void;
  selectLevel: (levelId: number) => void;
  saveResult: (result: Omit<GameResult, 'newBadges'>) => GameResult;
  getTotalStars: () => number;
  isLevelUnlocked: (levelId: number) => boolean;

  createProfile: (name: string, mascotVariant: MascotVariant, ageGroup: AgeGroup) => void;
  getAgeGroup: () => AgeGroup;
  deleteProfile: (id: string) => void;
  switchProfile: (id: string) => void;
  setMascotVariant: (variant: MascotVariant) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setKeyboardHints: (enabled: boolean) => void;

  getProgress: () => Record<number, LevelProgress>;
  getEarnedBadges: () => string[];
  getMascotVariant: () => MascotVariant;
  getSoundEnabled: () => boolean;
  getKeyboardHints: () => boolean;
  getStreak: () => number;
  getActiveProfile: () => Profile | null;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      screen: 'profiles',
      selectedLevelId: null,
      lastResult: null,
      profiles: [],
      activeProfileId: null,

      goTo: (screen) => set({ screen }),
      selectLevel: (levelId) => set({ selectedLevelId: levelId, screen: 'game' }),

      getActiveProfile: () => {
        const s = get();
        return s.profiles.find(p => p.id === s.activeProfileId) ?? null;
      },
      getProgress: () => get().getActiveProfile()?.progress ?? {},
      getEarnedBadges: () => get().getActiveProfile()?.earnedBadges ?? [],
      getMascotVariant: () => get().getActiveProfile()?.mascotVariant ?? 'orange',
      getSoundEnabled: () => get().getActiveProfile()?.soundEnabled ?? true,
      getKeyboardHints: () => get().getActiveProfile()?.keyboardHints ?? true,
      getStreak: () => get().getActiveProfile()?.streak ?? 0,
      getAgeGroup: () => get().getActiveProfile()?.ageGroup ?? 'young',

      getTotalStars: () => Object.values(get().getProgress()).reduce((sum, p) => sum + p.stars, 0),

      isLevelUnlocked: (levelId) => {
        if (levelId === 1) return true;
        return get().getProgress()[levelId - 1]?.played ?? false;
      },

      createProfile: (name, mascotVariant, ageGroup) => {
        const id = (crypto.randomUUID?.() ?? String(Date.now()));
        const newProfile: Profile = {
          id, name, ageGroup, mascotVariant,
          progress: {}, earnedBadges: [],
          soundEnabled: true, keyboardHints: true,
          streak: 0, lastPlayedDate: null,
        };
        set(s => ({ profiles: [...s.profiles, newProfile], activeProfileId: id, screen: 'home' }));
      },

      deleteProfile: (id) => {
        set(s => {
          const profiles = s.profiles.filter(p => p.id !== id);
          const activeProfileId = s.activeProfileId === id ? (profiles[0]?.id ?? null) : s.activeProfileId;
          return { profiles, activeProfileId, screen: activeProfileId ? 'home' : 'profiles' };
        });
      },

      switchProfile: (id) => set({ activeProfileId: id, screen: 'home', lastResult: null }),

      setMascotVariant: (variant) => {
        set(s => ({ profiles: s.profiles.map(p => p.id === s.activeProfileId ? { ...p, mascotVariant: variant } : p) }));
      },

      setSoundEnabled: (enabled) => {
        set(s => ({ profiles: s.profiles.map(p => p.id === s.activeProfileId ? { ...p, soundEnabled: enabled } : p) }));
      },

      setKeyboardHints: (enabled) => {
        set(s => ({ profiles: s.profiles.map(p => p.id === s.activeProfileId ? { ...p, keyboardHints: enabled } : p) }));
      },

      saveResult: (result) => {
        const state = get();
        const profile = state.profiles.find(p => p.id === state.activeProfileId);
        if (!profile) return { ...result, newBadges: [] };

        const existing = profile.progress[result.levelId];
        const updatedProgress: Record<number, LevelProgress> = {
          ...profile.progress,
          [result.levelId]: {
            stars: Math.max(result.stars, existing?.stars ?? 0),
            bestAccuracy: Math.max(result.accuracy, existing?.bestAccuracy ?? 0),
            bestWpm: Math.max(result.wpm, existing?.bestWpm ?? 0),
            played: true,
          },
        };

        const playedCount = Object.values(updatedProgress).filter(p => p.played).length;
        const existing3Stars = Object.values(updatedProgress).filter(p => p.stars === 3).length;

        const badgeChecks: Array<{ id: string; condition: boolean }> = [
          { id: 'first_key',       condition: playedCount >= 1 },
          { id: 'home_row_hero',   condition: [1,2,3,4,5,6].every(id => updatedProgress[id]?.played) },
          { id: 'top_row_star',    condition: [7,8,9,10,11].every(id => updatedProgress[id]?.played) },
          { id: 'perfect_accuracy',condition: result.accuracy === 100 },
          { id: 'three_stars',     condition: existing3Stars >= 1 },
          { id: 'five_levels',     condition: playedCount >= 5 },
          { id: 'ten_levels',      condition: playedCount >= 10 },
          { id: 'champion',        condition: LEVELS.every(l => updatedProgress[l.id]?.played) },
        ];

        const newBadges: string[] = [];
        for (const check of badgeChecks) {
          if (check.condition && !profile.earnedBadges.includes(check.id)) newBadges.push(check.id);
        }

        const { streak, lastPlayedDate } = calcStreak(profile.lastPlayedDate, profile.streak);
        const fullResult: GameResult = { ...result, newBadges };

        set(s => ({
          profiles: s.profiles.map(p =>
            p.id === s.activeProfileId
              ? { ...p, progress: updatedProgress, earnedBadges: [...profile.earnedBadges, ...newBadges], streak, lastPlayedDate }
              : p
          ),
          lastResult: fullResult,
          screen: 'result',
        }));

        return fullResult;
      },
    }),
    {
      name: 'typitap-progress',
      partialize: (state) => ({ profiles: state.profiles, activeProfileId: state.activeProfileId }),
    }
  )
);
