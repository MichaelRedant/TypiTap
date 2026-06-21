import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MascotVariant, AgeGroup, YoungMascotVariant, OlderMascotVariant } from '../types';
import { useGameStore } from '../store/gameStore';
import Mascot, { MASCOT_VARIANTS, OLDER_MASCOT_VARIANTS } from './Mascot';

const YOUNG_VARIANTS = Object.entries(MASCOT_VARIANTS) as [YoungMascotVariant, typeof MASCOT_VARIANTS[YoungMascotVariant]][];
const OLDER_VARIANTS = Object.entries(OLDER_MASCOT_VARIANTS) as [OlderMascotVariant, typeof OLDER_MASCOT_VARIANTS[OlderMascotVariant]][];

const BG_KEYS = [
  { char: 'A', x: '5%',  y: '12%', size: 48, delay: 0.0, dur: 4.2 },
  { char: 'S', x: '14%', y: '62%', size: 38, delay: 0.8, dur: 3.8 },
  { char: 'D', x: '82%', y: '20%', size: 44, delay: 0.4, dur: 4.5 },
  { char: 'F', x: '88%', y: '68%', size: 34, delay: 1.1, dur: 3.6 },
  { char: 'J', x: '6%',  y: '78%', size: 40, delay: 0.6, dur: 4.1 },
  { char: 'K', x: '90%', y: '44%', size: 36, delay: 0.2, dur: 3.9 },
  { char: '⏎', x: '78%', y: '82%', size: 38, delay: 1.3, dur: 4.0 },
  { char: '⌫', x: '20%', y: '88%', size: 32, delay: 0.9, dur: 3.7 },
];

// ─── Create profile modal ──────────────────────────────────────────────────────

function CreateProfileModal({ onClose }: { onClose: () => void }) {
  const { createProfile } = useGameStore();
  const [step, setStep] = useState<'name' | 'mascot'>('name');
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('young');
  const [mascot, setMascot] = useState<MascotVariant>('orange');

  function handleAgeGroupSelect(group: AgeGroup) {
    setAgeGroup(group);
    setMascot(group === 'young' ? 'orange' : 'robot');
  }

  function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) return;
    createProfile(trimmed, mascot, ageGroup);
    onClose();
  }

  const isOlder = ageGroup === 'older';
  const variants = isOlder ? OLDER_VARIANTS : YOUNG_VARIANTS;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(7,9,15,0.92)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 24 }}
        transition={{ type: 'spring', damping: 20, stiffness: 240 }}
        className="w-full max-w-sm rounded-3xl p-6 shadow-2xl"
        style={{
          background: 'linear-gradient(160deg, #0D1220, #111827)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {step === 'name' ? (
            <motion.div key="name" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-black text-center mb-1" style={{ color: 'rgba(255,255,255,0.92)' }}>
                Nieuw profiel
              </h2>
              <p className="text-center text-sm mb-5" style={{ color: 'rgba(100,116,139,0.9)' }}>
                Wie gaat er typen?
              </p>

              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && name.trim() && setStep('mascot')}
                placeholder="Jouw naam..."
                maxLength={20}
                autoFocus
                className="w-full px-4 py-3 rounded-2xl text-lg font-black outline-none mb-5"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.9)',
                  caretColor: '#818CF8',
                }}
              />

              <p className="text-xs font-semibold mb-3 text-center uppercase tracking-widest" style={{ color: 'rgba(100,116,139,0.8)', letterSpacing: '0.2em' }}>
                Hoe oud ben je?
              </p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {([
                  { group: 'young' as AgeGroup, emoji: '🐱', label: 'Jonger dan 10', sub: 'speelse interface' },
                  { group: 'older' as AgeGroup, emoji: '🤖', label: '10 jaar of ouder', sub: 'gamer interface' },
                ] as const).map(({ group, emoji, label, sub }) => (
                  <motion.button
                    key={group}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAgeGroupSelect(group)}
                    className="flex flex-col items-center py-4 px-3 rounded-2xl cursor-pointer border-none outline-none transition-all"
                    style={{
                      background: ageGroup === group
                        ? 'rgba(129,140,248,0.15)'
                        : 'rgba(255,255,255,0.04)',
                      border: ageGroup === group
                        ? '1px solid rgba(129,140,248,0.5)'
                        : '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <span className="text-3xl mb-1">{emoji}</span>
                    <span className="text-sm font-black" style={{ color: 'rgba(255,255,255,0.85)' }}>{label}</span>
                    <span className="text-xs mt-0.5" style={{ color: 'rgba(100,116,139,0.8)' }}>{sub}</span>
                  </motion.button>
                ))}
              </div>

              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClose}
                  className="flex-1 py-3 rounded-2xl text-base font-black cursor-pointer border-none"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(148,163,184,0.8)' }}>
                  Annuleren
                </motion.button>
                <motion.button
                  whileHover={{ scale: name.trim() ? 1.03 : 1 }}
                  whileTap={{ scale: name.trim() ? 0.97 : 1 }}
                  onClick={() => name.trim() && setStep('mascot')}
                  className="flex-[2] py-3 rounded-2xl text-base font-black text-white cursor-pointer border-none shadow-lg"
                  style={{ background: name.trim() ? 'linear-gradient(135deg, #818CF8, #38BDF8)' : 'rgba(255,255,255,0.1)' }}
                >
                  Volgende →
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="mascot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-black text-center mb-1" style={{ color: 'rgba(255,255,255,0.92)' }}>
                {isOlder ? 'Kies je karakter' : 'Kies je mascotte'}
              </h2>
              <p className="text-center text-sm mb-4" style={{ color: 'rgba(100,116,139,0.9)' }}>
                {isOlder ? `Hey ${name} — welk karakter past bij jou?` : `Hoi ${name}! Wie gaat er met jou typen?`}
              </p>

              <div className="grid grid-cols-5 gap-2 mb-5">
                {variants.map(([key, info]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMascot(key as MascotVariant)}
                    className="flex flex-col items-center p-2 rounded-2xl cursor-pointer border-none outline-none transition-all"
                    style={{
                      background: mascot === key ? 'rgba(129,140,248,0.18)' : 'rgba(255,255,255,0.04)',
                      border: mascot === key ? '1px solid rgba(129,140,248,0.5)' : '1px solid rgba(255,255,255,0.07)',
                      outline: mascot === key ? '2px solid rgba(129,140,248,0.3)' : 'none',
                      outlineOffset: 2,
                    }}
                  >
                    <Mascot mood="happy" size={48} variant={key as MascotVariant} />
                    <span className="text-xs font-black mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>{info.name}</span>
                  </motion.button>
                ))}
              </div>

              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setStep('name')}
                  className="flex-1 py-3 rounded-2xl text-base font-black cursor-pointer border-none"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(148,163,184,0.8)' }}>
                  ← Terug
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCreate}
                  className="flex-[2] py-3 rounded-2xl text-base font-black text-white cursor-pointer border-none shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #818CF8, #38BDF8)' }}
                >
                  Aanmaken!
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ─── Profile screen ────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { profiles, switchProfile, deleteProfile } = useGameStore();
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function handleDelete(id: string) {
    if (confirmDelete === id) {
      deleteProfile(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #07090F 0%, #0D1220 55%, #080C16 100%)' }}
      onClick={() => setConfirmDelete(null)}
    >
      {/* Grid background */}
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
          transition={{ delay: k.delay, duration: k.dur, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
        >
          {k.char}
        </motion.div>
      ))}

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 relative z-10"
      >
        <div className="flex items-end justify-center mb-3">
          {['T','y','p','i','T','a','p'].map((l, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.1 + i * 0.06, type: 'spring', stiffness: 180, damping: 16 }}
              style={{
                fontWeight: 900,
                fontSize: 'clamp(40px, 8vw, 60px)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                background: i < 4
                  ? 'linear-gradient(135deg, #C4B5FD, #818CF8)'
                  : 'linear-gradient(135deg, #60A5FA, #38BDF8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
              }}
            >
              {l}
            </motion.span>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm font-semibold uppercase tracking-widest"
          style={{ color: 'rgba(100,116,139,0.7)', letterSpacing: '0.2em' }}
        >
          {profiles.length === 0 ? 'Maak je eerste profiel' : 'Wie gaat er typen?'}
        </motion.p>
      </motion.div>

      {/* Empty state — neutral keyboard visual, no mascot yet */}
      {profiles.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="mb-8 relative z-10 flex flex-col items-center gap-3"
        >
          {/* Home row keys */}
          <div className="flex gap-2">
            {['Q','S','D','F','G','H','J','K','L','M'].map((k, i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.04, type: 'spring', stiffness: 200 }}
                className="flex items-center justify-center rounded-xl font-mono font-black"
                style={{
                  width: 36, height: 36, fontSize: 13,
                  color: k === 'F' || k === 'J'
                    ? 'rgba(129,140,248,0.9)'
                    : 'rgba(255,255,255,0.35)',
                  background: k === 'F' || k === 'J'
                    ? 'rgba(129,140,248,0.15)'
                    : 'rgba(255,255,255,0.05)',
                  border: k === 'F' || k === 'J'
                    ? '1px solid rgba(129,140,248,0.35)'
                    : '1px solid rgba(255,255,255,0.07)',
                  boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.4)',
                }}
              >
                {k}
              </motion.div>
            ))}
          </div>
          {/* Spacebar */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, type: 'spring' }}
            className="flex items-center justify-center rounded-xl font-mono text-xs font-semibold"
            style={{
              width: 180, height: 28,
              color: 'rgba(255,255,255,0.18)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.4)',
              letterSpacing: '0.15em',
            }}
          >
            SPACE
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            style={{ color: 'rgba(100,116,139,0.5)', fontSize: 11, letterSpacing: '0.1em' }}
          >
            Maak een profiel om te beginnen
          </motion.p>
        </motion.div>
      )}

      {/* Profile cards */}
      <div className="w-full max-w-sm flex flex-col gap-3 mb-8 relative z-10">
        {profiles.map((profile, i) => {
          const totalStars = Object.values(profile.progress).reduce((s, p) => s + p.stars, 0);
          const levelsPlayed = Object.values(profile.progress).filter(p => p.played).length;
          const isDeleting = confirmDelete === profile.id;
          const isOlder = profile.ageGroup === 'older';

          return (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative"
            >
              <motion.button
                whileHover={{ scale: 1.02, borderColor: 'rgba(129,140,248,0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setConfirmDelete(null); switchProfile(profile.id); }}
                className="w-full flex items-center gap-4 rounded-3xl p-4 cursor-pointer border-none text-left"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <div style={{ filter: 'drop-shadow(0 0 12px rgba(129,140,248,0.3))' }}>
                  <Mascot mood="happy" size={68} variant={profile.mascotVariant} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xl font-black truncate" style={{ color: 'rgba(255,255,255,0.92)' }}>
                    {profile.name}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-semibold" style={{ color: 'rgba(100,116,139,0.8)' }}>
                      {levelsPlayed === 0
                        ? 'Nog niet gestart'
                        : `${levelsPlayed} level${levelsPlayed !== 1 ? 's' : ''} · ${totalStars}⭐`}
                    </span>
                    {isOlder && (
                      <span className="text-xs font-black px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(56,189,248,0.12)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.25)' }}>
                        10+
                      </span>
                    )}
                  </div>
                </div>
                <span style={{ color: 'rgba(129,140,248,0.7)', fontSize: 20 }}>▶</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={e => { e.stopPropagation(); handleDelete(profile.id); }}
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black cursor-pointer border-none transition-colors"
                style={{
                  background: isDeleting ? '#EF4444' : 'rgba(255,255,255,0.07)',
                  color: isDeleting ? 'white' : 'rgba(100,116,139,0.7)',
                }}
              >
                {isDeleting ? '!' : '×'}
              </motion.button>

              <AnimatePresence>
                {isDeleting && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-8 right-0 text-white text-xs font-black px-3 py-1 rounded-xl shadow"
                    style={{ background: '#EF4444' }}
                  >
                    Nogmaals klikken om te verwijderen
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* New profile button */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setShowCreate(true)}
        className="px-10 py-4 rounded-3xl text-lg font-black text-white cursor-pointer border-none relative z-10"
        style={{
          background: 'linear-gradient(135deg, #818CF8, #38BDF8)',
          boxShadow: '0 8px 32px rgba(129,140,248,0.3)',
        }}
      >
        + Nieuw profiel
      </motion.button>

      {/* Made by */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-6 flex flex-col items-center gap-1 pointer-events-none"
      >
        <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.12)', marginBottom: 4 }} />
        <p style={{ color: 'rgba(100,116,139,0.6)', fontSize: 10, fontWeight: 500, letterSpacing: '0.18em' }}>MADE BY</p>
        <p style={{ color: 'rgba(148,163,184,0.5)', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>Michaël Redant</p>
      </motion.div>

      <AnimatePresence>
        {showCreate && <CreateProfileModal onClose={() => setShowCreate(false)} />}
      </AnimatePresence>
    </div>
  );
}
