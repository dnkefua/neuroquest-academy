'use client';
import { motion } from 'framer-motion';

export type Subject = 'science' | 'math' | 'english' | 'social' | 'socialSkills';

// Per-subject animated background particles and main icon
const SUBJECT_CONFIG: Record<Subject, {
  particles: { emoji: string; x: string; y: string; delay: number; size: string }[];
  bg: string;
}> = {
  science: {
    particles: [
      { emoji: '⚛️', x: '8%',  y: '15%', delay: 0,    size: 'text-lg' },
      { emoji: '🔭', x: '82%', y: '10%', delay: 0.4,  size: 'text-base' },
      { emoji: '💡', x: '70%', y: '60%', delay: 0.8,  size: 'text-sm' },
      { emoji: '🧬', x: '18%', y: '65%', delay: 1.2,  size: 'text-sm' },
    ],
    bg: 'radial-gradient(ellipse at 30% 50%, rgba(14,165,233,0.18) 0%, rgba(99,102,241,0.12) 100%)',
  },
  math: {
    particles: [
      { emoji: '∑',  x: '7%',  y: '20%', delay: 0,    size: 'text-xl font-black' },
      { emoji: 'π',  x: '80%', y: '15%', delay: 0.5,  size: 'text-lg font-black' },
      { emoji: '∞',  x: '72%', y: '60%', delay: 1.0,  size: 'text-base font-black' },
      { emoji: '△',  x: '15%', y: '60%', delay: 0.7,  size: 'text-base' },
    ],
    bg: 'radial-gradient(ellipse at 70% 40%, rgba(139,92,246,0.18) 0%, rgba(14,165,233,0.12) 100%)',
  },
  english: {
    particles: [
      { emoji: '✍️', x: '8%',  y: '12%', delay: 0,    size: 'text-lg' },
      { emoji: '📝', x: '80%', y: '15%', delay: 0.6,  size: 'text-base' },
      { emoji: '"',  x: '70%', y: '60%', delay: 0.9,  size: 'text-2xl font-black' },
      { emoji: '💬', x: '16%', y: '65%', delay: 0.3,  size: 'text-sm' },
    ],
    bg: 'radial-gradient(ellipse at 40% 50%, rgba(245,158,11,0.18) 0%, rgba(239,68,68,0.12) 100%)',
  },
  social: {
    particles: [
      { emoji: '🌍', x: '7%',  y: '15%', delay: 0,    size: 'text-base' },
      { emoji: '🏛️', x: '80%', y: '12%', delay: 0.5,  size: 'text-base' },
      { emoji: '⚖️', x: '72%', y: '58%', delay: 1.0,  size: 'text-sm' },
      { emoji: '📜', x: '15%', y: '62%', delay: 0.8,  size: 'text-sm' },
    ],
    bg: 'radial-gradient(ellipse at 50% 50%, rgba(245,158,11,0.18) 0%, rgba(132,204,22,0.12) 100%)',
  },
  socialSkills: {
    particles: [
      { emoji: '🤝', x: '7%',  y: '12%', delay: 0,    size: 'text-base' },
      { emoji: '🌟', x: '80%', y: '15%', delay: 0.5,  size: 'text-base' },
      { emoji: '💬', x: '72%', y: '58%', delay: 0.9,  size: 'text-sm' },
      { emoji: '❤️', x: '15%', y: '62%', delay: 0.7,  size: 'text-sm' },
    ],
    bg: 'radial-gradient(ellipse at 30% 60%, rgba(236,72,153,0.18) 0%, rgba(139,92,246,0.12) 100%)',
  },
};

// Map science topic titles → relevant main icon
const SCIENCE_ICON_MAP: [string, string][] = [
  ['water cycle', '🌊'],  ['cell', '🦠'],           ['atom', '⚛️'],
  ['electric', '⚡'],     ['human body', '🫀'],      ['ecosystem', '🌿'],
  ['food chain', '🌿'],   ['force', '💨'],           ['photosynthesis', '🌱'],
  ['wave', '〰️'],         ['periodic', '⚗️'],        ['chemical', '🧪'],
  ['evolution', '🧬'],    ['genetic', '🧬'],         ['thermodynamics', '🌡️'],
  ['gravity', '🌐'],      ['newton', '🍎'],          ['reproduction', '🧬'],
  ['organic', '⚗️'],      ['ecology', '🌍'],
];

const MATH_ICON_MAP: [string, string][] = [
  ['fraction', '½'],      ['ratio', '∶'],            ['percent', '%'],
  ['equation', '='],      ['pythagorean', '△'],      ['volume', '📦'],
  ['linear', '📈'],       ['quadratic', 'x²'],       ['statistic', '📊'],
  ['probabilit', '🎲'],   ['calculus', '∫'],          ['vector', '→'],
  ['differential', 'd/dx'], ['geometry', '📐'],      ['inequalit', '≤'],
];

const ENGLISH_ICON_MAP: [string, string][] = [
  ['argumentat', '⚔️'],   ['rebuttal', '💬'],        ['descriptive', '🖊️'],
  ['narrative', '📖'],    ['comparati', '⚖️'],        ['voice', '🎭'],
  ['prose', '✍️'],        ['drama', '🎭'],            ['non-fiction', '📰'],
  ['speech', '🎤'],       ['intertextual', '🔗'],    ['cultural', '🌐'],
  ['literature', '📚'],   ['extended', '📄'],         ['grammar', '✏️'],
  ['poetry', '🎵'],       ['analysis', '🔍'],
];

const SOCIAL_ICON_MAP: [string, string][] = [
  ['environment', '🌿'],  ['migration', '✈️'],        ['renaissance', '🎨'],
  ['trade', '⚓'],         ['ideology', '📋'],         ['movement', '✊'],
  ['development', '🏗️'], ['cold war', '🧊'],          ['independence', '🏳️'],
  ['refugee', '🤲'],      ['climate', '🌡️'],          ['authoritarian', '⚡'],
  ['human rights', '✊'], ['sustainability', '♻️'],
];

const SOCIAL_SKILLS_ICON_MAP: [string, string][] = [
  ['public speaking', '🎤'], ['confidence', '💪'],    ['identity', '🪞'],
  ['relationship', '🤝'],    ['emotion', '🧠'],       ['goal', '🎯'],
  ['mindset', '💡'],         ['decision', '⚖️'],      ['leadership', '👑'],
  ['volunteer', '💚'],       ['wellbeing', '🌿'],     ['global', '🌍'],
  ['financial', '💰'],       ['resilience', '🌊'],    ['diversity', '🌈'],
];

const SUBJECT_ICON_MAPS: Record<Subject, [string, string][]> = {
  science: SCIENCE_ICON_MAP,
  math: MATH_ICON_MAP,
  english: ENGLISH_ICON_MAP,
  social: SOCIAL_ICON_MAP,
  socialSkills: SOCIAL_SKILLS_ICON_MAP,
};

const DEFAULT_ICONS: Record<Subject, string> = {
  science: '🔬', math: '📐', english: '📚', social: '🌍', socialSkills: '💜',
};

function getMainIcon(subject: Subject, questTitle?: string): string {
  if (!questTitle) return DEFAULT_ICONS[subject];
  const lower = questTitle.toLowerCase();
  const map = SUBJECT_ICON_MAPS[subject];
  for (const [key, icon] of map) {
    if (lower.includes(key)) return icon;
  }
  return DEFAULT_ICONS[subject];
}

interface QuestBannerProps {
  subject: Subject;
  questTitle?: string;
  color1: string;
  color2: string;
}

export default function QuestBanner({ subject, questTitle, color1, color2 }: QuestBannerProps) {
  const cfg = SUBJECT_CONFIG[subject];
  const mainIcon = getMainIcon(subject, questTitle);

  return (
    <div className="relative h-[72px] flex items-center justify-center overflow-hidden rounded-2xl mb-2 flex-shrink-0"
      style={{ background: cfg.bg, border: `1px solid ${color1}28` }}>

      {/* Dot grid background */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${color1} 1px, transparent 1px)`,
          backgroundSize: '18px 18px',
        }} />

      {/* Animated particles */}
      {cfg.particles.map((p, i) => (
        <motion.span key={i}
          className={`absolute select-none ${p.size} opacity-50`}
          style={{ left: p.x, top: p.y, color: color1 }}
          animate={{ y: [0, -6, 0], opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 2.8 + i * 0.4, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}>
          {p.emoji}
        </motion.span>
      ))}

      {/* Main icon — center pulsing */}
      <motion.div className="relative z-10 flex items-center justify-center"
        animate={{ scale: [1, 1.12, 1], rotate: [0, 3, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
        <span className="text-4xl drop-shadow-lg">{mainIcon}</span>
      </motion.div>

      {/* Color accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${color1}, ${color2}, transparent)` }} />
    </div>
  );
}
