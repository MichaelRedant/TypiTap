import { motion, AnimatePresence } from 'framer-motion';
import type { MascotMood, MascotVariant, YoungMascotVariant, OlderMascotVariant } from '../types';
import { useGameStore } from '../store/gameStore';

interface MascotProps {
  mood: MascotMood;
  size?: number;
  variant?: MascotVariant;
}

export const MASCOT_VARIANTS: Record<YoungMascotVariant, { body: string; inner: string; name: string; emoji: string }> = {
  orange: { body: '#FB923C', inner: '#FBBF24', name: 'Tik',  emoji: '🟠' },
  blue:   { body: '#60A5FA', inner: '#93C5FD', name: 'Finn', emoji: '💙' },
  green:  { body: '#4ADE80', inner: '#86EFAC', name: 'Nino', emoji: '💚' },
  pink:   { body: '#F472B6', inner: '#FBCFE8', name: 'Lola', emoji: '🩷' },
  purple: { body: '#A78BFA', inner: '#C4B5FD', name: 'Pip',  emoji: '💜' },
};

export const OLDER_MASCOT_VARIANTS: Record<OlderMascotVariant, { body: string; inner: string; name: string; emoji: string }> = {
  robot:  { body: '#64748B', inner: '#94A3B8', name: 'Byte', emoji: '🤖' },
  fox:    { body: '#F97316', inner: '#FDBA74', name: 'Zara', emoji: '🦊' },
  dragon: { body: '#10B981', inner: '#6EE7B7', name: 'Drex', emoji: '🐉' },
  owl:    { body: '#4F46E5', inner: '#818CF8', name: 'Nova', emoji: '🦉' },
  wolf:   { body: '#6B7280', inner: '#D1D5DB', name: 'Vex',  emoji: '🐺' },
};

export const ALL_MASCOT_VARIANTS = { ...MASCOT_VARIANTS, ...OLDER_MASCOT_VARIANTS };

const YOUNG_KEYS: YoungMascotVariant[] = ['orange', 'blue', 'green', 'pink', 'purple'];
const OLDER_KEYS: OlderMascotVariant[] = ['robot', 'fox', 'dragon', 'owl', 'wolf'];

export function isOlderVariant(v: MascotVariant): v is OlderMascotVariant {
  return (OLDER_KEYS as string[]).includes(v);
}
export function isYoungVariant(v: MascotVariant): v is YoungMascotVariant {
  return (YOUNG_KEYS as string[]).includes(v);
}

// ─── Young (cat) faces ────────────────────────────────────────────────────────

function HappyFace() {
  return (
    <>
      <ellipse cx="72" cy="82" rx="14" ry="16" fill="white" />
      <circle cx="75" cy="84" r="10" fill="#1E293B" />
      <circle cx="79" cy="80" r="3.5" fill="white" />
      <ellipse cx="128" cy="82" rx="14" ry="16" fill="white" />
      <circle cx="125" cy="84" r="10" fill="#1E293B" />
      <circle cx="129" cy="80" r="3.5" fill="white" />
      <path d="M82,118 Q100,132 118,118" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  );
}
function OopsFace() {
  return (
    <>
      <ellipse cx="72" cy="82" rx="16" ry="18" fill="white" />
      <circle cx="72" cy="84" r="12" fill="#1E293B" />
      <circle cx="76" cy="79" r="4" fill="white" />
      <ellipse cx="128" cy="82" rx="16" ry="18" fill="white" />
      <circle cx="128" cy="84" r="12" fill="#1E293B" />
      <circle cx="132" cy="79" r="4" fill="white" />
      <ellipse cx="100" cy="122" rx="10" ry="10" fill="#1E293B" />
    </>
  );
}
function CelebratingFace() {
  return (
    <>
      <path d="M58,82 Q72,72 86,82" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M114,82 Q128,72 142,82" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M78,115 Q100,135 122,115" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
      <text x="28" y="55" fontSize="22" textAnchor="middle">✨</text>
      <text x="172" y="55" fontSize="22" textAnchor="middle">✨</text>
      <text x="100" y="185" fontSize="18" textAnchor="middle">🎉</text>
    </>
  );
}
function NeutralFace() {
  return (
    <>
      <ellipse cx="72" cy="82" rx="14" ry="15" fill="white" />
      <circle cx="74" cy="84" r="9" fill="#1E293B" />
      <circle cx="77" cy="81" r="3" fill="white" />
      <ellipse cx="128" cy="82" rx="14" ry="15" fill="white" />
      <circle cx="126" cy="84" r="9" fill="#1E293B" />
      <circle cx="129" cy="81" r="3" fill="white" />
      <line x1="84" y1="122" x2="116" y2="122" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
    </>
  );
}

function YoungMascot({ colors, mood }: { colors: { body: string; inner: string }; mood: MascotMood }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="175" rx="55" ry="38" fill={colors.body} />
      <circle cx="100" cy="95" r="72" fill={colors.body} />
      <polygon points="28,44 48,4 68,44" fill={colors.body} />
      <polygon points="34,42 48,12 62,42" fill={colors.inner} />
      <polygon points="132,44 152,4 172,44" fill={colors.body} />
      <polygon points="138,42 152,12 166,42" fill={colors.inner} />
      <AnimatePresence mode="wait">
        <motion.g key={mood} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.15 }}>
          {mood === 'happy'      && <HappyFace />}
          {mood === 'oops'       && <OopsFace />}
          {mood === 'celebrating'&& <CelebratingFace />}
          {mood === 'neutral'    && <NeutralFace />}
        </motion.g>
      </AnimatePresence>
      {mood !== 'celebrating' && (
        <polygon points="95,108 100,103 105,108 100,114" fill="#EC4899" />
      )}
      <line x1="16" y1="100" x2="68" y2="108" stroke="#64748B" strokeWidth="1.5" opacity="0.6" />
      <line x1="16" y1="113" x2="68" y2="113" stroke="#64748B" strokeWidth="1.5" opacity="0.6" />
      <line x1="132" y1="108" x2="184" y2="100" stroke="#64748B" strokeWidth="1.5" opacity="0.6" />
      <line x1="132" y1="113" x2="184" y2="113" stroke="#64748B" strokeWidth="1.5" opacity="0.6" />
      <ellipse cx="58" cy="190" rx="20" ry="12" fill={colors.body} />
      <ellipse cx="142" cy="190" rx="20" ry="12" fill={colors.body} />
    </svg>
  );
}

// ─── Older mascots ─────────────────────────────────────────────────────────────

function RobotMascot({ colors, mood }: { colors: { body: string; inner: string }; mood: MascotMood }) {
  const eyeContent = () => {
    if (mood === 'celebrating') return (
      <>
        {/* Star eyes */}
        <text x="68" y="80" fontSize="22" textAnchor="middle" fill={colors.inner}>★</text>
        <text x="132" y="80" fontSize="22" textAnchor="middle" fill={colors.inner}>★</text>
      </>
    );
    if (mood === 'oops') return (
      <>
        {/* X eyes */}
        <line x1="52" y1="63" x2="84" y2="87" stroke={colors.inner} strokeWidth="4" strokeLinecap="round" />
        <line x1="84" y1="63" x2="52" y2="87" stroke={colors.inner} strokeWidth="4" strokeLinecap="round" />
        <line x1="116" y1="63" x2="148" y2="87" stroke={colors.inner} strokeWidth="4" strokeLinecap="round" />
        <line x1="148" y1="63" x2="116" y2="87" stroke={colors.inner} strokeWidth="4" strokeLinecap="round" />
      </>
    );
    // happy / neutral — LED bars
    return (
      <>
        <rect x="50" y="67" width="36" height="10" rx="3" fill={colors.inner} opacity={mood === 'neutral' ? 0.7 : 1} />
        <rect x="114" y="67" width="36" height="10" rx="3" fill={colors.inner} opacity={mood === 'neutral' ? 0.7 : 1} />
        {mood === 'happy' && (
          <>
            <rect x="50" y="81" width="36" height="6" rx="3" fill={colors.inner} opacity="0.5" />
            <rect x="114" y="81" width="36" height="6" rx="3" fill={colors.inner} opacity="0.5" />
          </>
        )}
      </>
    );
  };

  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* Antenna */}
      <rect x="96" y="4" width="8" height="24" rx="4" fill={colors.body} />
      <circle cx="100" cy="4" r="8" fill={colors.inner} />
      {/* Head */}
      <rect x="30" y="24" width="140" height="100" rx="18" fill={colors.body} />
      {/* Eye panels */}
      <rect x="44" y="57" width="48" height="38" rx="8" fill="rgba(0,0,0,0.3)" />
      <rect x="108" y="57" width="48" height="38" rx="8" fill="rgba(0,0,0,0.3)" />
      <AnimatePresence mode="wait">
        <motion.g key={mood} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          {eyeContent()}
        </motion.g>
      </AnimatePresence>
      {/* Speaker grill */}
      <rect x="58" y="108" width="84" height="10" rx="4" fill="rgba(0,0,0,0.25)" />
      {[68, 82, 96, 110, 124, 132].map(x => (
        <circle key={x} cx={x} cy="113" r="2.5" fill="rgba(0,0,0,0.35)" />
      ))}
      {/* Body */}
      <rect x="38" y="132" width="124" height="58" rx="16" fill={colors.body} />
      {/* Chest panel */}
      <rect x="54" y="143" width="92" height="36" rx="10" fill="rgba(0,0,0,0.2)" />
      {/* Panel lights */}
      <circle cx="76" cy="161" r="7" fill={colors.inner} opacity="0.9" />
      <circle cx="100" cy="161" r="7" fill={colors.inner} opacity={mood === 'happy' || mood === 'celebrating' ? '0.9' : '0.3'} />
      <circle cx="124" cy="161" r="7" fill={colors.inner} opacity={mood === 'celebrating' ? '0.9' : '0.3'} />
      {/* Arms */}
      <rect x="4" y="136" width="32" height="14" rx="7" fill={colors.body} />
      <rect x="164" y="136" width="32" height="14" rx="7" fill={colors.body} />
      {/* Legs */}
      <rect x="56" y="188" width="34" height="10" rx="5" fill={colors.body} />
      <rect x="110" y="188" width="34" height="10" rx="5" fill={colors.body} />
      {mood === 'celebrating' && (
        <>
          <text x="16" y="48" fontSize="18" textAnchor="middle">⚡</text>
          <text x="184" y="48" fontSize="18" textAnchor="middle">⚡</text>
        </>
      )}
    </svg>
  );
}

function FoxMascot({ colors, mood }: { colors: { body: string; inner: string }; mood: MascotMood }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="100" cy="175" rx="52" ry="35" fill={colors.body} />
      {/* Tail (visible on right) */}
      <ellipse cx="158" cy="168" rx="22" ry="14" fill={colors.body} transform="rotate(-20 158 168)" />
      <ellipse cx="162" cy="164" rx="12" ry="8" fill="white" transform="rotate(-20 162 164)" />
      {/* Head */}
      <circle cx="100" cy="95" r="70" fill={colors.body} />
      {/* Big fox ears */}
      <polygon points="22,38 42,-8 66,40" fill={colors.body} />
      <polygon points="28,36 42,2 58,38" fill={colors.inner} />
      <polygon points="134,40 158,-8 178,38" fill={colors.body} />
      <polygon points="142,38 158,2 172,38" fill={colors.inner} />
      {/* Face — snout area */}
      <ellipse cx="100" cy="108" rx="28" ry="20" fill={colors.inner} opacity="0.6" />
      {/* Eyes */}
      <AnimatePresence mode="wait">
        <motion.g key={mood} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.15 }}>
          {(mood === 'happy' || mood === 'neutral') && (
            <>
              <ellipse cx="74" cy="84" rx="13" ry="14" fill="white" />
              <circle cx="77" cy="86" r="9" fill="#1E293B" />
              <circle cx="80" cy="83" r="3" fill="white" />
              <ellipse cx="126" cy="84" rx="13" ry="14" fill="white" />
              <circle cx="123" cy="86" r="9" fill="#1E293B" />
              <circle cx="126" cy="83" r="3" fill="white" />
              {mood === 'happy'
                ? <path d="M85,116 Q100,128 115,116" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                : <line x1="88" y1="118" x2="112" y2="118" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />}
            </>
          )}
          {mood === 'oops' && (
            <>
              <ellipse cx="74" cy="84" rx="14" ry="16" fill="white" />
              <circle cx="74" cy="86" r="10" fill="#1E293B" />
              <circle cx="78" cy="81" r="3.5" fill="white" />
              <ellipse cx="126" cy="84" rx="14" ry="16" fill="white" />
              <circle cx="126" cy="86" r="10" fill="#1E293B" />
              <circle cx="130" cy="81" r="3.5" fill="white" />
              <ellipse cx="100" cy="120" rx="9" ry="9" fill="#1E293B" />
            </>
          )}
          {mood === 'celebrating' && (
            <>
              <path d="M60,84 Q74,74 88,84" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M112,84 Q126,74 140,84" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M82,114 Q100,132 118,114" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
              <text x="24" y="52" fontSize="20" textAnchor="middle">✨</text>
              <text x="176" y="52" fontSize="20" textAnchor="middle">✨</text>
            </>
          )}
        </motion.g>
      </AnimatePresence>
      {/* Nose */}
      {mood !== 'celebrating' && (
        <ellipse cx="100" cy="110" rx="6" ry="4" fill="#1E293B" />
      )}
      {/* Paws */}
      <ellipse cx="60" cy="190" rx="18" ry="11" fill={colors.body} />
      <ellipse cx="140" cy="190" rx="18" ry="11" fill={colors.body} />
    </svg>
  );
}

function DragonMascot({ colors, mood }: { colors: { body: string; inner: string }; mood: MascotMood }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="100" cy="172" rx="56" ry="36" fill={colors.body} />
      {/* Scale hints on body */}
      {[70, 90, 110, 130].map(x => (
        <ellipse key={x} cx={x} cy="178" rx="9" ry="5" fill="rgba(0,0,0,0.12)" />
      ))}
      {/* Head */}
      <circle cx="100" cy="94" r="70" fill={colors.body} />
      {/* Horns */}
      <polygon points="72,28 80,0 90,28" fill={colors.body} />
      <polygon points="75,28 80,4 87,28" fill={colors.inner} />
      <polygon points="110,28 120,0 128,28" fill={colors.body} />
      <polygon points="113,28 120,4 125,28" fill={colors.inner} />
      {/* Spine ridge */}
      <polygon points="94,24 100,8 106,24" fill={colors.inner} opacity="0.7" />
      {/* Face */}
      <AnimatePresence mode="wait">
        <motion.g key={mood} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.15 }}>
          {(mood === 'happy' || mood === 'neutral') && (
            <>
              <ellipse cx="72" cy="84" rx="15" ry="16" fill="white" />
              <circle cx="75" cy="86" r="11" fill="#1E293B" />
              <circle cx="79" cy="82" r="3.5" fill={colors.inner} />
              <ellipse cx="128" cy="84" rx="15" ry="16" fill="white" />
              <circle cx="125" cy="86" r="11" fill="#1E293B" />
              <circle cx="129" cy="82" r="3.5" fill={colors.inner} />
              {mood === 'happy'
                ? <path d="M80,118 Q100,134 120,118" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                : <line x1="84" y1="120" x2="116" y2="120" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />}
            </>
          )}
          {mood === 'oops' && (
            <>
              <ellipse cx="72" cy="84" rx="16" ry="18" fill="white" />
              <circle cx="72" cy="86" r="12" fill="#1E293B" />
              <circle cx="76" cy="81" r="4" fill={colors.inner} />
              <ellipse cx="128" cy="84" rx="16" ry="18" fill="white" />
              <circle cx="128" cy="86" r="12" fill="#1E293B" />
              <circle cx="132" cy="81" r="4" fill={colors.inner} />
              <ellipse cx="100" cy="122" rx="10" ry="8" fill="#1E293B" />
            </>
          )}
          {mood === 'celebrating' && (
            <>
              <path d="M56,84 Q72,72 88,84" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M112,84 Q128,72 144,84" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M78,116 Q100,136 122,116" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
              <text x="22" y="56" fontSize="20" textAnchor="middle">🔥</text>
              <text x="178" y="56" fontSize="20" textAnchor="middle">🔥</text>
            </>
          )}
        </motion.g>
      </AnimatePresence>
      {/* Nostrils */}
      {mood !== 'celebrating' && (
        <>
          <circle cx="95" cy="110" r="3.5" fill="rgba(0,0,0,0.35)" />
          <circle cx="105" cy="110" r="3.5" fill="rgba(0,0,0,0.35)" />
        </>
      )}
      {/* Claws */}
      <ellipse cx="58" cy="190" rx="20" ry="12" fill={colors.body} />
      <ellipse cx="142" cy="190" rx="20" ry="12" fill={colors.body} />
    </svg>
  );
}

function OwlMascot({ colors, mood }: { colors: { body: string; inner: string }; mood: MascotMood }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* Body — rounder, wing marks */}
      <ellipse cx="100" cy="170" rx="60" ry="38" fill={colors.body} />
      {/* Wing marks on body */}
      <path d="M50,158 Q70,148 90,165" stroke="rgba(0,0,0,0.18)" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M150,158 Q130,148 110,165" stroke="rgba(0,0,0,0.18)" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Head */}
      <circle cx="100" cy="94" r="72" fill={colors.body} />
      {/* Feather tufts (not pointy ears) */}
      <path d="M36,42 Q44,18 56,36" fill={colors.body} stroke={colors.body} strokeWidth="2" />
      <path d="M144,36 Q156,18 164,42" fill={colors.body} stroke={colors.body} strokeWidth="2" />
      {/* Giant eye rings (the owl's signature) */}
      <circle cx="70" cy="86" r="26" fill="white" />
      <circle cx="130" cy="86" r="26" fill="white" />
      <circle cx="70" cy="86" r="20" fill={colors.inner} opacity="0.3" />
      <circle cx="130" cy="86" r="20" fill={colors.inner} opacity="0.3" />
      {/* Pupils */}
      <AnimatePresence mode="wait">
        <motion.g key={mood} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.15 }}>
          {(mood === 'happy' || mood === 'neutral') && (
            <>
              <circle cx="73" cy="88" r="14" fill="#1E293B" />
              <circle cx="78" cy="83" r="4.5" fill="white" />
              <circle cx="133" cy="88" r="14" fill="#1E293B" />
              <circle cx="138" cy="83" r="4.5" fill="white" />
              {mood === 'happy'
                ? <path d="M82,120 Q100,132 118,120" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                : <line x1="86" y1="122" x2="114" y2="122" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />}
            </>
          )}
          {mood === 'oops' && (
            <>
              <circle cx="70" cy="90" r="16" fill="#1E293B" />
              <circle cx="76" cy="84" r="5" fill="white" />
              <circle cx="130" cy="90" r="16" fill="#1E293B" />
              <circle cx="136" cy="84" r="5" fill="white" />
              <ellipse cx="100" cy="124" rx="10" ry="8" fill="#1E293B" />
            </>
          )}
          {mood === 'celebrating' && (
            <>
              <text x="70" y="98" fontSize="26" textAnchor="middle">★</text>
              <text x="130" y="98" fontSize="26" textAnchor="middle">★</text>
              <path d="M80,118 Q100,134 120,118" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
              <text x="18" y="54" fontSize="18" textAnchor="middle">✨</text>
              <text x="182" y="54" fontSize="18" textAnchor="middle">✨</text>
            </>
          )}
        </motion.g>
      </AnimatePresence>
      {/* Beak */}
      {mood !== 'celebrating' && (
        <polygon points="94,112 100,104 106,112 100,120" fill="#F59E0B" />
      )}
      {/* Feet */}
      <ellipse cx="62" cy="192" rx="18" ry="10" fill={colors.body} />
      <ellipse cx="138" cy="192" rx="18" ry="10" fill={colors.body} />
    </svg>
  );
}

function WolfMascot({ colors, mood }: { colors: { body: string; inner: string }; mood: MascotMood }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="100" cy="174" rx="54" ry="36" fill={colors.body} />
      {/* Head — slightly wider/more angular */}
      <ellipse cx="100" cy="96" rx="72" ry="68" fill={colors.body} />
      {/* Pointed upright ears */}
      <polygon points="24,50 40,4 60,46" fill={colors.body} />
      <polygon points="30,48 40,10 54,46" fill={colors.inner} />
      <polygon points="140,46 160,4 176,50" fill={colors.body} />
      <polygon points="146,46 160,10 170,48" fill={colors.inner} />
      {/* Muzzle (longer/wider than cat) */}
      <ellipse cx="100" cy="112" rx="32" ry="22" fill={colors.inner} opacity="0.55" />
      {/* Eyes */}
      <AnimatePresence mode="wait">
        <motion.g key={mood} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.15 }}>
          {(mood === 'happy' || mood === 'neutral') && (
            <>
              {/* Slightly angular/almond eyes for a cool look */}
              <path d="M56,80 Q72,70 88,80 Q72,94 56,80Z" fill="white" />
              <circle cx="73" cy="80" r="9" fill="#1E293B" />
              <circle cx="77" cy="76" r="3" fill="white" />
              <path d="M112,80 Q128,70 144,80 Q128,94 112,80Z" fill="white" />
              <circle cx="127" cy="80" r="9" fill="#1E293B" />
              <circle cx="131" cy="76" r="3" fill="white" />
              {mood === 'happy'
                ? <path d="M82,120 Q100,136 118,120" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                : <line x1="86" y1="122" x2="114" y2="122" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />}
            </>
          )}
          {mood === 'oops' && (
            <>
              <ellipse cx="72" cy="82" rx="15" ry="17" fill="white" />
              <circle cx="72" cy="84" r="11" fill="#1E293B" />
              <circle cx="76" cy="79" r="3.5" fill="white" />
              <ellipse cx="128" cy="82" rx="15" ry="17" fill="white" />
              <circle cx="128" cy="84" r="11" fill="#1E293B" />
              <circle cx="132" cy="79" r="3.5" fill="white" />
              <ellipse cx="100" cy="124" rx="10" ry="9" fill="#1E293B" />
            </>
          )}
          {mood === 'celebrating' && (
            <>
              <path d="M56,80 Q72,68 88,80" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M112,80 Q128,68 144,80" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M80,118 Q100,136 120,118" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
              <text x="22" y="54" fontSize="20" textAnchor="middle">🌟</text>
              <text x="178" y="54" fontSize="20" textAnchor="middle">🌟</text>
            </>
          )}
        </motion.g>
      </AnimatePresence>
      {/* Nose */}
      {mood !== 'celebrating' && (
        <ellipse cx="100" cy="112" rx="7" ry="5" fill="#1E293B" />
      )}
      {/* Paws */}
      <ellipse cx="58" cy="190" rx="20" ry="12" fill={colors.body} />
      <ellipse cx="142" cy="190" rx="20" ry="12" fill={colors.body} />
    </svg>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function Mascot({ mood, size = 160, variant }: MascotProps) {
  const getMascotVariant = useGameStore(s => s.getMascotVariant);
  const activeVariant = variant ?? getMascotVariant();

  const bounceAnim = mood === 'celebrating'
    ? { y: [0, -12, 0, -8, 0], transition: { duration: 0.6, repeat: Infinity } }
    : mood === 'oops'
    ? { x: [-4, 4, -4, 4, 0], transition: { duration: 0.3 } }
    : {};

  const isOlder = isOlderVariant(activeVariant);
  const colors = isOlder
    ? OLDER_MASCOT_VARIANTS[activeVariant as OlderMascotVariant]
    : MASCOT_VARIANTS[activeVariant as YoungMascotVariant];

  return (
    <motion.div animate={bounceAnim} style={{ display: 'inline-block', width: size, height: size }}>
      {isOlder ? (
        <>
          {activeVariant === 'robot'  && <RobotMascot  colors={colors} mood={mood} />}
          {activeVariant === 'fox'    && <FoxMascot    colors={colors} mood={mood} />}
          {activeVariant === 'dragon' && <DragonMascot colors={colors} mood={mood} />}
          {activeVariant === 'owl'    && <OwlMascot    colors={colors} mood={mood} />}
          {activeVariant === 'wolf'   && <WolfMascot   colors={colors} mood={mood} />}
        </>
      ) : (
        <YoungMascot colors={colors} mood={mood} />
      )}
    </motion.div>
  );
}
