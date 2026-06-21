import { motion } from 'framer-motion';

// Belgian AZERTY finger color map
const FINGER_COLORS: Record<string, string> = {
  // Left pinky
  q: '#FCA5A5', a: '#FCA5A5', w: '#FCA5A5',
  // Left ring
  s: '#93C5FD', z: '#93C5FD', x: '#93C5FD',
  // Left middle
  d: '#86EFAC', e: '#86EFAC', c: '#86EFAC',
  // Left index (f+g columns)
  f: '#FDE047', r: '#FDE047', v: '#FDE047',
  g: '#FDE047', t: '#FDE047', b: '#FDE047',
  // Right index (h+j columns)
  h: '#FDE047', u: '#FDE047', n: '#FDE047',
  j: '#FDE047', y: '#FDE047', ',': '#FDE047',
  // Right middle
  k: '#86EFAC', i: '#86EFAC', ';': '#86EFAC',
  // Right ring
  l: '#93C5FD', o: '#93C5FD', '.': '#93C5FD',
  // Right pinky
  m: '#FCA5A5', p: '#FCA5A5',
  ' ': '#C4B5FD',
  // Number row
  '1': '#FCA5A5', '2': '#93C5FD', '3': '#86EFAC', '4': '#FDE047', '5': '#FDE047',
  '6': '#FDE047', '7': '#FDE047', '8': '#86EFAC', '9': '#93C5FD', '0': '#FCA5A5',
};

// Belgian AZERTY layout
const ROWS = [
  ['1','2','3','4','5','6','7','8','9','0'],
  ['a','z','e','r','t','y','u','i','o','p'],
  ['q','s','d','f','g','h','j','k','l','m'],
  ['w','x','c','v','b','n',',',';','.'],
];

interface KeyboardVisualProps {
  currentKey: string;
  availableKeys: string[];
}

function Key({ char, isCurrent, isAvailable }: { char: string; isCurrent: boolean; isAvailable: boolean }) {
  const bg = isCurrent
    ? FINGER_COLORS[char] ?? '#E2E8F0'
    : isAvailable
    ? (FINGER_COLORS[char] ?? '#E2E8F0') + '80'
    : '#F1F5F9';

  const label = char === ' ' ? 'SPATIE' : char.toUpperCase();

  return (
    <motion.div
      animate={isCurrent ? { scale: [1, 1.18, 1], boxShadow: ['0 0 0px transparent', '0 0 10px rgba(124,58,237,0.5)', '0 0 0px transparent'] } : { scale: 1 }}
      transition={isCurrent ? { duration: 0.6, repeat: Infinity } : {}}
      style={{ backgroundColor: bg }}
      className={`
        flex items-center justify-center rounded-md text-xs font-bold
        w-8 h-8 border-b-2 select-none
        ${isCurrent ? 'border-purple-500 text-slate-800 shadow-md' : isAvailable ? 'border-slate-300 text-slate-600' : 'border-slate-200 text-slate-300'}
      `}
    >
      {label}
    </motion.div>
  );
}

export default function KeyboardVisual({ currentKey, availableKeys }: KeyboardVisualProps) {
  const offsets = ['pl-0', 'pl-0', 'pl-4', 'pl-6'];

  return (
    <div className="flex flex-col items-center gap-1 p-3 bg-white/60 rounded-2xl shadow-inner backdrop-blur-sm">
      {ROWS.map((row, ri) => (
        <div key={ri} className={`flex gap-1 ${offsets[ri]}`}>
          {row.map(char => (
            <Key
              key={char}
              char={char}
              isCurrent={currentKey === char}
              isAvailable={availableKeys.includes(char)}
            />
          ))}
        </div>
      ))}
      <motion.div
        animate={currentKey === ' ' ? { scale: [1, 1.08, 1], boxShadow: ['0 0 0px transparent', '0 0 10px rgba(124,58,237,0.5)', '0 0 0px transparent'] } : { scale: 1 }}
        transition={currentKey === ' ' ? { duration: 0.6, repeat: Infinity } : {}}
        style={{ backgroundColor: currentKey === ' ' ? '#C4B5FD' : '#E5E7EB' }}
        className={`mt-1 h-8 w-48 flex items-center justify-center rounded-md text-xs font-bold border-b-2 select-none ${currentKey === ' ' ? 'border-purple-500 shadow-md text-slate-800' : 'border-slate-300 text-slate-500'}`}
      >
        SPATIE
      </motion.div>
      <p className="text-xs text-slate-400 mt-1">Kleuren = welke vinger gebruiken</p>
    </div>
  );
}
