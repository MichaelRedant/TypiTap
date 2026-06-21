import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { ThemeProvider } from './context/ThemeContext';
import SplashScreen from './components/SplashScreen';
import ProfileScreen from './components/ProfileScreen';
import HomeScreen from './components/HomeScreen';
import LevelMap from './components/LevelMap';
import TypingGame from './components/TypingGame';
import ResultScreen from './components/ResultScreen';
import StatsScreen from './components/StatsScreen';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const screen = useGameStore(s => s.screen);
  const activeProfileId = useGameStore(s => s.activeProfileId);
  const effectiveScreen = activeProfileId ? screen : 'profiles';

  return (
    <ThemeProvider>
      {/* Main app — always rendered beneath the splash */}
      <AnimatePresence mode="wait">
        <motion.div
          key={effectiveScreen}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="min-h-screen"
        >
          {effectiveScreen === 'profiles' && <ProfileScreen />}
          {effectiveScreen === 'home'     && <HomeScreen />}
          {effectiveScreen === 'levelmap' && <LevelMap />}
          {effectiveScreen === 'game'     && <TypingGame />}
          {effectiveScreen === 'result'   && <ResultScreen />}
          {effectiveScreen === 'stats'    && <StatsScreen />}
        </motion.div>
      </AnimatePresence>

      {/* Splash overlay — fades out and reveals the app beneath */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onDone={() => setShowSplash(false)} />
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
}
