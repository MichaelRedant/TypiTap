export type Screen = 'profiles' | 'home' | 'levelmap' | 'game' | 'result' | 'stats' | 'practice';

export interface Profile {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  mascotVariant: MascotVariant;
  progress: Record<number, LevelProgress>;
  earnedBadges: string[];
  soundEnabled: boolean;
  keyboardHints: boolean;
  streak: number;
  lastPlayedDate: string | null; // 'YYYY-MM-DD'
}

export type AgeGroup = 'young' | 'older';
export type YoungMascotVariant = 'orange' | 'blue' | 'green' | 'pink' | 'purple';
export type OlderMascotVariant = 'robot' | 'fox' | 'dragon' | 'owl' | 'wolf';
export type MascotVariant = YoungMascotVariant | OlderMascotVariant;

export type CharStatus = 'upcoming' | 'current' | 'correct' | 'corrected' | 'error-flash';

export type MascotMood = 'happy' | 'oops' | 'celebrating' | 'neutral';

export interface Level {
  id: number;
  title: string;
  subtitle: string;
  subtitleOlder?: string;
  chapter: number;
  chapterName: string;
  newKeys: string[];
  allKeys: string[];
  exercises: string[];
  exercisesOlder?: string[];
  emoji: string;
  targetWpm: number; // 0 = geen snelheidseis (drill levels)
  targetWpmOlder?: number;
}

export interface LevelProgress {
  stars: number;
  bestAccuracy: number;
  bestWpm: number;
  played: boolean;
}

export interface GameResult {
  levelId: number;
  accuracy: number;
  stars: number;
  timeSeconds: number;
  wpm: number;
  newBadges: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
}
