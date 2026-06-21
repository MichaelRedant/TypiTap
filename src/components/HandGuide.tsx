import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const FINGER_COLORS: Record<string, string> = {
  q: '#FCA5A5', a: '#FCA5A5', w: '#FCA5A5',
  s: '#93C5FD', z: '#93C5FD', x: '#93C5FD',
  d: '#86EFAC', e: '#86EFAC', c: '#86EFAC',
  f: '#FDE047', r: '#FDE047', v: '#FDE047',
  g: '#FDE047', t: '#FDE047', b: '#FDE047',
  h: '#FDE047', u: '#FDE047', n: '#FDE047',
  j: '#FDE047', y: '#FDE047', ',': '#FDE047',
  k: '#86EFAC', i: '#86EFAC', ';': '#86EFAC',
  l: '#93C5FD', o: '#93C5FD', '.': '#93C5FD',
  m: '#FCA5A5', p: '#FCA5A5',
  '1': '#FCA5A5', '2': '#93C5FD', '3': '#86EFAC', '4': '#FDE047', '5': '#FDE047',
  '6': '#FDE047', '7': '#FDE047', '8': '#86EFAC', '9': '#93C5FD', '0': '#FCA5A5',
};

const AZERTY_ROWS = [
  ['1','2','3','4','5','6','7','8','9','0'],
  ['a','z','e','r','t','y','u','i','o','p'],
  ['q','s','d','f','g','h','j','k','l','m'],
  ['w','x','c','v','b','n',',',';','.'],
];

const HOME_ROW = ['q','s','d','f','g','h','j','k','l','m'];

const FINGER_LEGEND = [
  { label: 'Pink (L)',      color: '#FCA5A5', keys: ['1','Q','A','W'] },
  { label: 'Ring (L)',      color: '#93C5FD', keys: ['2','S','Z','X'] },
  { label: 'Middel (L)',    color: '#86EFAC', keys: ['3','D','E','C'] },
  { label: 'Wijsvinger (L)',color: '#FDE047', keys: ['4','5','F','R','V','G','T','B'] },
  { label: 'Wijsvinger (R)',color: '#FDE047', keys: ['6','7','H','J','U','Y','N',','] },
  { label: 'Middel (R)',    color: '#86EFAC', keys: ['8','K','I',';'] },
  { label: 'Ring (R)',      color: '#93C5FD', keys: ['9','L','O','.'] },
  { label: 'Pink (R)',      color: '#FCA5A5', keys: ['0','M','P'] },
];

const TIPS = [
  { icon: '🖐', text: 'Leg de vingers op de thuisrij: Q-S-D-F links en J-K-L-M rechts.' },
  { icon: '👆', text: 'Voel het bultje op F en J — dat zijn je ankers. Je vingers gaan altijd terug naar die positie.' },
  { icon: '👍', text: 'Beide duimen rusten licht op de spatiebalk.' },
  { icon: '🙈', text: 'Kijk niet naar het toetsenbord. Vertrouw op je spiergeheugen.' },
  { icon: '📐', text: 'Elke vinger dekt altijd dezelfde kolom, ongeacht de rij.' },
  { icon: '💆', text: 'Houd je polsen recht en ontspannen — niet op het bureau leunen.' },
];

function LeftHand({ isDark }: { isDark: boolean }) {
  const palm = isDark ? '#1E293B' : '#F8FAFC';
  const stroke = isDark ? '#334155' : '#CBD5E1';
  const text = isDark ? '#64748B' : '#94A3B8';
  return (
    <svg viewBox="0 0 115 185" style={{ width: 115, height: 185, display: 'block' }}>
      <rect x="5" y="108" width="96" height="64" rx="22" fill={palm} stroke={stroke} strokeWidth="1.5"/>
      {/* Pinky */}
      <rect x="8"  y="46" width="18" height="66" rx="9" fill="#FCA5A5"/>
      {/* Ring */}
      <rect x="29" y="28" width="18" height="84" rx="9" fill="#93C5FD"/>
      {/* Middle */}
      <rect x="50" y="16" width="18" height="96" rx="9" fill="#86EFAC"/>
      {/* Index */}
      <rect x="71" y="28" width="18" height="84" rx="9" fill="#FDE047"/>
      {/* Thumb */}
      <rect x="83" y="98" width="18" height="46" rx="9" fill="#C4B5FD" transform="rotate(33,92,121)"/>
      <text x="54" y="182" textAnchor="middle" fontSize="10" fill={text} fontWeight="700">Linkerhand</text>
    </svg>
  );
}

function RightHand({ isDark }: { isDark: boolean }) {
  const palm = isDark ? '#1E293B' : '#F8FAFC';
  const stroke = isDark ? '#334155' : '#CBD5E1';
  const text = isDark ? '#64748B' : '#94A3B8';
  return (
    <svg viewBox="0 0 115 185" style={{ width: 115, height: 185, display: 'block' }}>
      <rect x="14" y="108" width="96" height="64" rx="22" fill={palm} stroke={stroke} strokeWidth="1.5"/>
      {/* Thumb */}
      <rect x="14" y="98" width="18" height="46" rx="9" fill="#C4B5FD" transform="rotate(-33,23,121)"/>
      {/* Index */}
      <rect x="28" y="28" width="18" height="84" rx="9" fill="#FDE047"/>
      {/* Middle */}
      <rect x="49" y="16" width="18" height="96" rx="9" fill="#86EFAC"/>
      {/* Ring */}
      <rect x="70" y="28" width="18" height="84" rx="9" fill="#93C5FD"/>
      {/* Pinky */}
      <rect x="91" y="46" width="18" height="66" rx="9" fill="#FCA5A5"/>
      <text x="62" y="182" textAnchor="middle" fontSize="10" fill={text} fontWeight="700">Rechterhand</text>
    </svg>
  );
}

interface HandGuideProps {
  onClose: () => void;
}

export default function HandGuide({ onClose }: HandGuideProps) {
  const theme = useTheme();
  const cardBg = theme.isDark ? 'rgba(15,23,42,0.98)' : 'white';
  const cardBorder = theme.isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0';
  const sectionBg = theme.isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC';
  const textMain = theme.isDark ? 'rgba(255,255,255,0.9)' : '#1E293B';
  const textMuted = theme.isDark ? '#64748B' : '#94A3B8';
  const keyBg = theme.isDark ? 'rgba(255,255,255,0.07)' : '#F1F5F9';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-y-auto"
          style={{
            background: cardBg,
            border: cardBorder,
            maxHeight: '92vh',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3 sticky top-0" style={{ background: cardBg, zIndex: 10, borderBottom: cardBorder }}>
            <h2 className="text-xl font-black" style={{ color: theme.textTitle }}>⌨️ Handhouding</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full font-bold text-lg cursor-pointer border-none"
              style={{ background: sectionBg, color: textMuted }}
            >
              ✕
            </button>
          </div>

          <div className="px-5 pb-6 flex flex-col gap-5 pt-4">

            {/* Hand diagram */}
            <div className="rounded-2xl p-4 flex flex-col items-center gap-2" style={{ background: sectionBg }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: textMuted }}>Bovenaanzicht van de handen</p>
              <div className="flex items-end gap-3">
                <LeftHand isDark={theme.isDark} />
                {/* Spacebar + arrow */}
                <div className="flex flex-col items-center gap-2 pb-6">
                  <span className="text-2xl">👇</span>
                  <div
                    className="rounded-xl flex items-center justify-center text-xs font-bold"
                    style={{ width: 56, height: 22, background: '#C4B5FD33', border: '1px solid #C4B5FD66', color: '#A78BFA' }}
                  >
                    SPATIE
                  </div>
                  <span className="text-2xl">👇</span>
                </div>
                <RightHand isDark={theme.isDark} />
              </div>
              {/* Finger color legend inline */}
              <div className="flex gap-2 flex-wrap justify-center mt-1">
                {[
                  { color: '#FCA5A5', label: 'Pink' },
                  { color: '#93C5FD', label: 'Ring' },
                  { color: '#86EFAC', label: 'Middel' },
                  { color: '#FDE047', label: 'Wijsvinger' },
                  { color: '#C4B5FD', label: 'Duim' },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm" style={{ background: f.color }} />
                    <span className="text-xs" style={{ color: textMuted }}>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AZERTY keyboard with colors */}
            <div className="rounded-2xl p-4" style={{ background: sectionBg }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3 text-center" style={{ color: textMuted }}>AZERTY — kleur = welke vinger</p>
              <div className="flex flex-col items-center gap-1.5">
                {AZERTY_ROWS.map((row, ri) => {
                  const offsets = [0, 4, 14, 22];
                  return (
                    <div key={ri} className="flex gap-1" style={{ marginLeft: offsets[ri] }}>
                      {row.map(k => {
                        const isHome = HOME_ROW.includes(k);
                        const isBump = k === 'f' || k === 'j';
                        const bg = FINGER_COLORS[k] ?? keyBg;
                        return (
                          <div
                            key={k}
                            className="flex flex-col items-center justify-center rounded-md font-bold text-xs select-none relative"
                            style={{
                              width: 28, height: 28,
                              background: bg + (isHome ? 'FF' : '99'),
                              border: `2px solid ${bg}`,
                              color: '#374151',
                              boxShadow: isHome ? '0 3px 0 rgba(0,0,0,0.2)' : '0 2px 0 rgba(0,0,0,0.1)',
                              fontSize: 11,
                            }}
                          >
                            {k === ',' ? ',' : k === ';' ? ';' : k === '.' ? '.' : k.toUpperCase()}
                            {isBump && (
                              <span
                                className="absolute bottom-0.5 rounded-full"
                                style={{ width: 5, height: 5, background: 'rgba(0,0,0,0.35)' }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
                {/* Spacebar */}
                <div
                  className="rounded-md flex items-center justify-center text-xs font-bold mt-0.5"
                  style={{ width: 140, height: 24, background: '#C4B5FD99', border: '2px solid #C4B5FD', color: '#5B21B6' }}
                >
                  SPATIE
                </div>
              </div>
              <p className="text-center text-xs mt-3" style={{ color: textMuted }}>
                <strong style={{ color: textMain }}>Thuisrij</strong> (2e rij) heeft vollere kleuren. F en J hebben een <strong style={{ color: textMain }}>bultje ●</strong>.
              </p>
            </div>

            {/* Per finger keys */}
            <div className="rounded-2xl p-4" style={{ background: sectionBg }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: textMuted }}>Per vinger</p>
              <div className="grid grid-cols-2 gap-2">
                {FINGER_LEGEND.map(f => (
                  <div
                    key={f.label}
                    className="flex items-start gap-2 p-2 rounded-xl"
                    style={{ background: f.color + '22', border: `1px solid ${f.color}66` }}
                  >
                    <div className="w-3 h-3 rounded-sm mt-0.5 flex-shrink-0" style={{ background: f.color }} />
                    <div>
                      <div className="text-xs font-black" style={{ color: textMain }}>{f.label}</div>
                      <div className="text-xs" style={{ color: textMuted }}>{f.keys.join(' · ')}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2 p-2 rounded-xl mt-2" style={{ background: '#C4B5FD22', border: '1px solid #C4B5FD66' }}>
                <div className="w-3 h-3 rounded-sm mt-0.5 flex-shrink-0" style={{ background: '#C4B5FD' }} />
                <div>
                  <div className="text-xs font-black" style={{ color: textMain }}>Duimen (L + R)</div>
                  <div className="text-xs" style={{ color: textMuted }}>SPATIE</div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-2xl p-4" style={{ background: sectionBg }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: textMuted }}>Tips</p>
              <div className="flex flex-col gap-2">
                {TIPS.map((tip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex gap-3 items-start"
                  >
                    <span className="text-xl flex-shrink-0 mt-0.5">{tip.icon}</span>
                    <p className="text-sm leading-snug" style={{ color: textMain }}>{tip.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
