import { motion, AnimatePresence } from 'framer-motion';

type FingerName = 'pink' | 'ring' | 'middle' | 'index' | 'thumb';
type HandSide = 'left' | 'right' | 'both';

interface FingerInfo {
  finger: FingerName;
  hand: HandSide;
  label: string;
}

const KEY_FINGER: Record<string, FingerInfo> = {
  q: { finger: 'pink',   hand: 'left',  label: 'Linker pink' },
  a: { finger: 'pink',   hand: 'left',  label: 'Linker pink' },
  w: { finger: 'pink',   hand: 'left',  label: 'Linker pink' },
  s: { finger: 'ring',   hand: 'left',  label: 'Linker ringvinger' },
  z: { finger: 'ring',   hand: 'left',  label: 'Linker ringvinger' },
  x: { finger: 'ring',   hand: 'left',  label: 'Linker ringvinger' },
  d: { finger: 'middle', hand: 'left',  label: 'Linker middelvinger' },
  e: { finger: 'middle', hand: 'left',  label: 'Linker middelvinger' },
  c: { finger: 'middle', hand: 'left',  label: 'Linker middelvinger' },
  f: { finger: 'index',  hand: 'left',  label: 'Linker wijsvinger' },
  r: { finger: 'index',  hand: 'left',  label: 'Linker wijsvinger' },
  v: { finger: 'index',  hand: 'left',  label: 'Linker wijsvinger' },
  g: { finger: 'index',  hand: 'left',  label: 'Linker wijsvinger' },
  t: { finger: 'index',  hand: 'left',  label: 'Linker wijsvinger' },
  b: { finger: 'index',  hand: 'left',  label: 'Linker wijsvinger' },
  h: { finger: 'index',  hand: 'right', label: 'Rechter wijsvinger' },
  u: { finger: 'index',  hand: 'right', label: 'Rechter wijsvinger' },
  n: { finger: 'index',  hand: 'right', label: 'Rechter wijsvinger' },
  j: { finger: 'index',  hand: 'right', label: 'Rechter wijsvinger' },
  y: { finger: 'index',  hand: 'right', label: 'Rechter wijsvinger' },
  ',': { finger: 'index', hand: 'right', label: 'Rechter wijsvinger' },
  k: { finger: 'middle', hand: 'right', label: 'Rechter middelvinger' },
  i: { finger: 'middle', hand: 'right', label: 'Rechter middelvinger' },
  ';': { finger: 'middle', hand: 'right', label: 'Rechter middelvinger' },
  l: { finger: 'ring',   hand: 'right', label: 'Rechter ringvinger' },
  o: { finger: 'ring',   hand: 'right', label: 'Rechter ringvinger' },
  '.': { finger: 'ring',  hand: 'right', label: 'Rechter ringvinger' },
  m: { finger: 'pink',   hand: 'right', label: 'Rechter pink' },
  p: { finger: 'pink',   hand: 'right', label: 'Rechter pink' },
  ' ': { finger: 'thumb', hand: 'both',  label: 'Duim (spatiebalk)' },
};

const FINGER_COLORS: Record<FingerName, string> = {
  pink:   '#FCA5A5',
  ring:   '#93C5FD',
  middle: '#86EFAC',
  index:  '#FDE047',
  thumb:  '#C4B5FD',
};

// Left hand: pinky→ring→middle→index (left to right)
const LEFT_FINGERS:  FingerName[] = ['pink', 'ring', 'middle', 'index'];
// Right hand: index→middle→ring→pinky (left to right, mirrored)
const RIGHT_FINGERS: FingerName[] = ['index', 'middle', 'ring', 'pink'];

const FINGER_HEIGHTS: Record<FingerName, number> = {
  pink: 30, ring: 40, middle: 46, index: 38, thumb: 0,
};

interface MiniHandProps {
  side: 'left' | 'right';
  activeFinger: FingerName | null;
  isDark: boolean;
}

function MiniHand({ side, activeFinger, isDark }: MiniHandProps) {
  const fingers = side === 'left' ? LEFT_FINGERS : RIGHT_FINGERS;
  const palmFill   = isDark ? '#1E293B' : '#F1F5F9';
  const palmStroke = isDark ? '#334155' : '#D1D5DB';

  const thumbX = side === 'left' ? 52 : 2;
  const thumbRot = side === 'left' ? 'rotate(28,57,57)' : 'rotate(-28,7,57)';
  const thumbActive = activeFinger === 'thumb';

  return (
    <svg viewBox="0 0 68 88" style={{ width: 68, height: 88, display: 'block', overflow: 'visible' }}>
      {/* Palm */}
      <rect x="1" y="50" width="66" height="34" rx="14"
        fill={palmFill} stroke={palmStroke} strokeWidth="1" />

      {/* Glow layer (behind fingers, renders first) */}
      {fingers.map((f, i) => {
        const isActive = f === activeFinger;
        const h = FINGER_HEIGHTS[f];
        const x = 3 + i * 15;
        const y = 52 - h;
        if (!isActive) return null;
        return (
          <motion.rect key={`glow-${f}`}
            x={x - 3} y={y - 3} width={18} height={h + 6} rx={9}
            fill={FINGER_COLORS[f]}
            animate={{ opacity: [0.25, 0.55, 0.25] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            style={{ filter: 'blur(5px)' }}
          />
        );
      })}

      {/* Finger rects */}
      {fingers.map((f, i) => {
        const isActive = f === activeFinger;
        const h = FINGER_HEIGHTS[f];
        const x = 3 + i * 15;
        const y = 52 - h;
        return (
          <motion.rect key={f}
            x={x} y={y} width="12" height={h} rx="6"
            fill={FINGER_COLORS[f]}
            animate={{ opacity: isActive ? 1 : 0.15 }}
            transition={{ duration: 0.3 }}
          />
        );
      })}

      {/* Thumb glow */}
      {thumbActive && (
        <motion.rect x={thumbX - 2} y={40} width={14} height={30} rx={7}
          fill={FINGER_COLORS.thumb}
          animate={{ opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: 1, repeat: Infinity }}
          transform={thumbRot}
          style={{ filter: 'blur(5px)' }}
        />
      )}

      {/* Thumb */}
      <motion.rect x={thumbX} y={44} width="10" height="26" rx="5"
        fill={FINGER_COLORS.thumb}
        animate={{ opacity: thumbActive ? 1 : 0.15 }}
        transition={{ duration: 0.3 }}
        transform={thumbRot}
      />

      <text x="34" y="87" textAnchor="middle" fontSize="7"
        fill={isDark ? '#475569' : '#9CA3AF'} fontWeight="700">
        {side === 'left' ? 'LINKS' : 'RECHTS'}
      </text>
    </svg>
  );
}

interface FingerHintProps {
  currentKey: string;
  isDark: boolean;
}

export default function FingerHint({ currentKey, isDark }: FingerHintProps) {
  const key = currentKey.toLowerCase();
  const info = KEY_FINGER[key] ?? KEY_FINGER[currentKey];
  if (!info) return null;

  const { finger, hand, label } = info;
  const color = FINGER_COLORS[finger];
  const hintKey = `${hand}-${finger}`;

  const leftActive  = (hand === 'left'  || hand === 'both') ? finger : null;
  const rightActive = (hand === 'right' || hand === 'both') ? finger : null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={hintKey}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="flex flex-col items-center gap-1.5"
      >
        {/* Label badge */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 16 }}
          className="px-4 py-1 rounded-full text-xs font-black tracking-wide"
          style={{
            background: color + '28',
            border: `1.5px solid ${color}70`,
            color: isDark ? color : '#374151',
          }}
        >
          {label}
        </motion.div>

        {/* Mini hands */}
        <div className="flex items-end gap-4">
          <MiniHand side="left"  activeFinger={leftActive}  isDark={isDark} />

          {/* Spacebar indicator */}
          <div className="flex flex-col items-center gap-1 pb-3">
            <motion.div
              className="rounded-full"
              style={{ width: 28, height: 5, background: isDark ? '#1E293B' : '#E5E7EB' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: FINGER_COLORS.thumb + '80' }}
                animate={hand === 'both'
                  ? { width: ['0%', '100%', '0%'] }
                  : { width: '0%' }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </motion.div>
            <span className="text-center leading-none font-bold"
              style={{ fontSize: 7, color: isDark ? '#334155' : '#D1D5DB' }}>
              SPATIE
            </span>
          </div>

          <MiniHand side="right" activeFinger={rightActive} isDark={isDark} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
