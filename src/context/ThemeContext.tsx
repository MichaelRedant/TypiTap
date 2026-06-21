import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useGameStore } from '../store/gameStore';
import { youngTheme, olderTheme } from '../theme';
import type { AppTheme } from '../theme';

const ThemeContext = createContext<AppTheme>(youngTheme);
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const getAgeGroup = useGameStore(s => s.getAgeGroup);
  const theme = getAgeGroup() === 'older' ? olderTheme : youngTheme;
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
