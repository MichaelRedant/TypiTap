import { motion } from 'framer-motion';

type FingerName = 'pink' | 'ring' | 'middle' | 'index' | 'thumb';

const KEY_FINGER: Record<string, { finger: FingerName; hand: 'left' | 'right' | 'both' }> = {
  q: { finger: 'pink',   hand: 'left'  }, a: { finger: 'pink',   hand: 'left'  }, w: { finger: 'pink',   hand: 'left'  },
  s: { finger: 'ring',   hand: 'left'  }, z: { finger: 'ring',   hand: 'left'  }, x: { finger: 'ring',   hand: 'left'  },
  d: { finger: 'middle', hand: 'left'  }, e: { finger: 'middle', hand: 'left'  }, c: { finger: 'middle', hand: 'left'  },
  f: { finger: 'index',  hand: 'left'  }, r: { finger: 'index',  hand: 'left'  }, v: { finger: 'index',  hand: 'left'  },
  g: { finger: 'index',  hand: 'left'  }, t: { finger: 'index',  hand: 'left'  }, b: { finger: 'index',  hand: 'left'  },
  h: { finger: 'index',  hand: 'right' }, u: { finger: 'index',  hand: 'right' }, n: { finger: 'index',  hand: 'right' },
  j: { finger: 'index',  hand: 'right' }, y: { finger: 'index',  hand: 'right' }, ',': { finger: 'index', hand: 'right' },
  k: { finger: 'middle', hand: 'right' }, i: { finger: 'middle', hand: 'right' }, ';': { finger: 'middle', hand: 'right' },
  l: { finger: 'ring',   hand: 'right' }, o: { finger: 'ring',   hand: 'right' }, '.': { finger: 'ring',  hand: 'right' },
  m: { finger: 'pink',   hand: 'right' }, p: { finger: 'pink',   hand: 'right' },
  ' ': { finger: 'thumb', hand: 'both' },
};

const COLORS: Record<FingerName, string> = {
  pink: '#FCA5A5', ring: '#93C5FD', middle: '#86EFAC', index: '#FDE047', thumb: '#C4B5FD',
};

const HEIGHTS: Record<FingerName, number> = {
  pink: 30, ring: 40, middle: 46, index: 38, thumb: 0,
};

const LEFT_ORDER:  FingerName[] = ['pink', 'ring', 'middle', 'index'];
const RIGHT_ORDER: FingerName[] = ['index', 'middle', 'ring', 'pink'];

const LABELS: Record<FingerName, string> = {
  pink: 'Pink', ring: 'Ring', middle: 'Middel', index: 'Wijsvinger', thumb: 'Duim',
};

interface HandProps {
  side: 'left' | 'right';
  active: Set<FingerName>;
}

function AnimatedHand({ side, active }: HandProps) {
  const order = side === 'left' ? LEFT_ORDER : RIGHT_ORDER;
  const thumbX = side === 'left' ? 52 : 2;
  const thumbRot = side === 'left' ? 'rotate(28,57,57)' : 'rotate(-28,7,57)';
  const thumbOn = active.has('thumb');

  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 68 90" style={{ width: 86, height: 112, display: 'block', overflow: 'visible' }}>
        {/* Palm */}
        <rect x="1" y="52" width="66" height="34" rx="14"
          fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

        {/* Glow behind active fingers */}
        {order.map((f, i) => {
          if (!active.has(f)) return null;
          const h = HEIGHTS[f]; const x = 3 + i * 15; const y = 54 - h;
          return (
            <motion.rect key={`glow-${f}`}
              x={x - 3} y={y - 3} width={18} height={h + 6} rx={9}
              fill={COLORS[f]}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0.25, 0.5, 0.25] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 + i * 0.08 }}
              style={{ filter: 'blur(6px)' }}
            />
          );
        })}

        {/* Fingers */}
        {order.map((f, i) => {
          const isOn = active.has(f);
          const h = HEIGHTS[f]; const x = 3 + i * 15; const y = 54 - h;
          return (
            <motion.rect key={f}
              x={x} y={y} width="12" height={h} rx="6"
              fill={COLORS[f]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isOn ? 1 : 0.12, y: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 + i * 0.07 }}
            />
          );
        })}

        {/* Thumb glow */}
        {thumbOn && (
          <motion.rect x={thumbX - 2} y={42} width={14} height={30} rx={7}
            fill={COLORS.thumb}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0.25, 0.5, 0.25] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            transform={thumbRot}
            style={{ filter: 'blur(6px)' }}
          />
        )}

        {/* Thumb */}
        <motion.rect x={thumbX} y={46} width="10" height="26" rx="5"
          fill={COLORS.thumb}
          initial={{ opacity: 0 }}
          animate={{ opacity: thumbOn ? 1 : 0.12 }}
          transition={{ delay: 0.45 }}
          transform={thumbRot}
        />

        <motion.text x="34" y="89" textAnchor="middle" fontSize="8"
          fill="rgba(148,163,184,0.6)" fontWeight="700"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        >
          {side === 'left' ? 'LINKS' : 'RECHTS'}
        </motion.text>
      </svg>
    </div>
  );
}

interface LevelHandsIntroProps {
  allKeys: string[];
}

export default function LevelHandsIntro({ allKeys }: LevelHandsIntroProps) {
  const leftActive  = new Set<FingerName>();
  const rightActive = new Set<FingerName>();

  for (const key of allKeys) {
    const info = KEY_FINGER[key.toLowerCase()] ?? KEY_FINGER[key];
    if (!info) continue;
    if (info.hand === 'left'  || info.hand === 'both') leftActive.add(info.finger);
    if (info.hand === 'right' || info.hand === 'both') rightActive.add(info.finger);
  }

  const usedFingers = [...new Set([...leftActive, ...rightActive])].filter(f => f !== 'thumb');

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4, ease: 'easeOut' }}
      className="mt-5"
    >
      {/* Title */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xs font-bold uppercase text-center mb-3"
        style={{ color: 'rgba(167,139,250,0.75)', letterSpacing: '0.18em' }}
      >
        Leg je handen zo neer
      </motion.p>

      {/* Hands + spacebar */}
      <div className="flex items-end justify-center gap-4">
        <AnimatedHand side="left"  active={leftActive}  />

        {/* Spacebar column */}
        <motion.div
          className="flex flex-col items-center gap-1 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <div className="rounded-lg flex items-center justify-center text-center"
            style={{ width: 38, height: 18, background: 'rgba(196,181,253,0.12)', border: '1px solid rgba(196,181,253,0.3)', fontSize: 6, color: 'rgba(196,181,253,0.7)', fontWeight: 700, lineHeight: 1.2 }}>
            SPA<br/>TIE
          </div>
          <div className="text-center" style={{ fontSize: 7, color: 'rgba(100,116,139,0.6)', fontWeight: 600 }}>duim</div>
        </motion.div>

        <AnimatedHand side="right" active={rightActive} />
      </div>

      {/* Active finger chips */}
      <motion.div
        className="flex flex-wrap gap-1.5 justify-center mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
      >
        {usedFingers.map(f => (
          <div key={f}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{ background: COLORS[f] + '1A', border: `1px solid ${COLORS[f]}55` }}
          >
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: COLORS[f] }} />
            <span style={{ fontSize: 9, color: COLORS[f], fontWeight: 700 }}>{LABELS[f]}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
