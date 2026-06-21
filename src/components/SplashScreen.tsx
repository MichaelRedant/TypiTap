import { useEffect } from 'react';
import { motion } from 'framer-motion';

const TITLE = ['T', 'y', 'p', 'i', 'T', 'a', 'p'];

const BG_KEYS = [
  { char: 'A', x: '6%',  y: '18%', size: 52, delay: 0.0, dur: 4.2 },
  { char: 'S', x: '16%', y: '68%', size: 40, delay: 0.5, dur: 3.8 },
  { char: 'D', x: '22%', y: '42%', size: 46, delay: 1.0, dur: 4.5 },
  { char: 'F', x: '34%', y: '78%', size: 36, delay: 0.3, dur: 3.6 },
  { char: 'J', x: '55%', y: '14%', size: 44, delay: 0.7, dur: 4.1 },
  { char: 'K', x: '68%', y: '72%', size: 38, delay: 0.2, dur: 3.9 },
  { char: 'L', x: '78%', y: '38%', size: 50, delay: 0.9, dur: 4.3 },
  { char: '⏎', x: '86%', y: '58%', size: 42, delay: 0.4, dur: 4.0 },
  { char: '⌫', x: '46%', y: '84%', size: 34, delay: 0.6, dur: 3.7 },
  { char: 'G', x: '42%', y: '10%', size: 38, delay: 1.1, dur: 4.4 },
  { char: 'H', x: '90%', y: '22%', size: 44, delay: 0.8, dur: 3.5 },
  { char: '⇧', x: '3%',  y: '55%', size: 36, delay: 1.3, dur: 4.2 },
];

interface SplashScreenProps {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 3600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ background: 'linear-gradient(160deg, #07090F 0%, #0D1220 55%, #080C16 100%)' }}
      onClick={onDone}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
    >
      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating keyboard keys */}
      {BG_KEYS.map((k, i) => (
        <motion.div
          key={i}
          className="absolute flex items-center justify-center font-mono font-black pointer-events-none rounded-xl"
          style={{
            left: k.x, top: k.y,
            width: k.size, height: k.size,
            fontSize: k.size * 0.38,
            color: 'rgba(255,255,255,0.055)',
            background: 'rgba(255,255,255,0.028)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.4)',
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: [0, 1, 1, 0.6], y: [16, 0, -10, -20] }}
          transition={{
            delay: k.delay + 0.2,
            duration: k.dur,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        >
          {k.char}
        </motion.div>
      ))}

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8">

        {/* Logo */}
        <div className="flex items-end mb-2">
          {TITLE.map((letter, i) => (
            <motion.span
              key={i}
              style={{
                fontFamily: '"Inter", system-ui, sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(56px, 12vw, 88px)',
                lineHeight: 1,
                background: i < 4
                  ? 'linear-gradient(135deg, #C4B5FD 0%, #818CF8 100%)'
                  : 'linear-gradient(135deg, #60A5FA 0%, #38BDF8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                letterSpacing: '-0.02em',
              }}
              initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                delay: 0.25 + i * 0.07,
                type: 'spring',
                stiffness: 180,
                damping: 16,
              }}
            >
              {letter}
            </motion.span>
          ))}

          {/* Blinking cursor */}
          <motion.span
            style={{
              color: '#60A5FA',
              fontWeight: 200,
              fontSize: 'clamp(56px, 12vw, 88px)',
              lineHeight: 1,
              marginLeft: 4,
              display: 'inline-block',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0, 0] }}
            transition={{
              delay: 1.0,
              duration: 0.65,
              repeat: 4,
              ease: 'easeInOut',
            }}
          >
            |
          </motion.span>
        </div>

        {/* Tagline */}
        <motion.p
          style={{
            color: 'rgba(148,163,184,0.7)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: 40,
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: 0.6 }}
        >
          Leer blind typen · Nederlands
        </motion.p>

        {/* Loading bar */}
        <motion.div
          style={{
            width: 180,
            height: 2,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            style={{
              height: '100%',
              borderRadius: 2,
              background: 'linear-gradient(90deg, #818CF8, #38BDF8)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ delay: 1.55, duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
          />
        </motion.div>
      </div>

      {/* Made by — bottom */}
      <motion.div
        className="absolute bottom-10 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.8 }}
      >
        <div
          style={{
            width: 24,
            height: 1,
            background: 'rgba(255,255,255,0.15)',
            marginBottom: 6,
          }}
        />
        <p style={{ color: 'rgba(100,116,139,0.8)', fontSize: 11, fontWeight: 500, letterSpacing: '0.18em' }}>
          MADE BY
        </p>
        <p style={{ color: 'rgba(148,163,184,0.65)', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em' }}>
          Michaël Redant
        </p>
      </motion.div>

      {/* Skip hint */}
      <motion.p
        className="absolute bottom-4"
        style={{ color: 'rgba(71,85,105,0.6)', fontSize: 10, letterSpacing: '0.1em' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
      >
        tik om door te gaan
      </motion.p>
    </motion.div>
  );
}
