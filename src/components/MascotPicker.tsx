import { motion, AnimatePresence } from 'framer-motion';
import type { MascotVariant, YoungMascotVariant, OlderMascotVariant } from '../types';
import { useGameStore } from '../store/gameStore';
import Mascot, { MASCOT_VARIANTS, OLDER_MASCOT_VARIANTS } from './Mascot';

interface MascotPickerProps {
  onClose: () => void;
}

export default function MascotPicker({ onClose }: MascotPickerProps) {
  const { getMascotVariant, setMascotVariant, getAgeGroup } = useGameStore();
  const current = getMascotVariant();
  const isOlder = getAgeGroup() === 'older';

  const variants = isOlder
    ? Object.entries(OLDER_MASCOT_VARIANTS) as [OlderMascotVariant, typeof OLDER_MASCOT_VARIANTS[OlderMascotVariant]][]
    : Object.entries(MASCOT_VARIANTS) as [YoungMascotVariant, typeof MASCOT_VARIANTS[YoungMascotVariant]][];

  const allVariants = { ...MASCOT_VARIANTS, ...OLDER_MASCOT_VARIANTS };
  const currentInfo = allVariants[current as keyof typeof allVariants];

  const accentColor = isOlder ? '#0284C7' : '#7C3AED';
  const selectedRing = isOlder ? 'ring-sky-400' : 'ring-purple-400';
  const selectedBg = isOlder ? 'bg-sky-50' : 'bg-purple-50';
  const previewBg = isOlder ? 'bg-slate-100' : 'bg-purple-50';
  const titleColor = isOlder ? 'text-sky-600' : 'text-purple-700';
  const overlayBg = isOlder ? 'rgba(2,132,199,0.85)' : 'rgba(109,40,217,0.85)';
  const btnGradient = isOlder ? 'linear-gradient(135deg, #0284C7, #0369A1)' : 'linear-gradient(135deg, #7C3AED, #6D28D9)';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: overlayBg, backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 18, stiffness: 260 }}
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 className={`text-2xl font-black ${titleColor} text-center mb-1`}>
          {isOlder ? 'Kies je karakter' : 'Kies je mascotte! 🐱'}
        </h2>
        <p className="text-center text-slate-400 text-sm mb-6">
          {isOlder ? 'Welk karakter past bij jou?' : 'Wie gaat er met jou typen?'}
        </p>

        <div className="grid grid-cols-5 gap-2 mb-6">
          {variants.map(([key, info]) => {
            const selected = current === key;
            return (
              <motion.button
                key={key}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMascotVariant(key as MascotVariant)}
                className={`flex flex-col items-center p-2 rounded-2xl cursor-pointer border-none outline-none transition-all ${
                  selected ? `ring-4 ${selectedRing} ring-offset-2 ${selectedBg}` : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <Mascot mood="happy" size={56} variant={key as MascotVariant} />
                <span className="text-xs font-black text-slate-700 mt-1">{info.name}</span>
                {selected && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: accentColor }} className="text-xs font-black">
                    ✓
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`flex items-center gap-4 ${previewBg} rounded-2xl p-4 mb-5`}
          >
            <Mascot mood="happy" size={80} variant={current} />
            <div>
              <p className={`text-xl font-black ${titleColor}`}>{currentInfo?.name}</p>
              <p className="text-sm text-slate-500">
                {isOlder ? 'is jouw tik-partner!' : 'is jouw tik-maatje!'}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="w-full py-4 rounded-2xl text-lg font-black text-white cursor-pointer border-none shadow-lg"
          style={{ background: btnGradient }}
        >
          ✓ Klaar!
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
