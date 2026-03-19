'use client';

import { motion } from 'framer-motion';

const SUBJECT_THEMES: Record<string, { wall: string; accent: string; items: string[] }> = {
  math:                  { wall: 'from-blue-50 via-indigo-50 to-blue-100',  accent: '#6366F1', items: ['📐', '🔢', '📊', '✏️', '📏'] },
  science:               { wall: 'from-teal-50 via-green-50 to-teal-100',   accent: '#14B8A6', items: ['🔬', '⚗️', '🧪', '🌱', '🔭'] },
  english:               { wall: 'from-amber-50 via-yellow-50 to-amber-100', accent: '#F59E0B', items: ['📚', '✒️', '📖', '🖊️', '📝'] },
  'social-skills':       { wall: 'from-orange-50 via-rose-50 to-orange-100', accent: '#F97316', items: ['🤝', '💬', '❤️', '👥', '🌟'] },
  'emotional-regulation':{ wall: 'from-purple-50 via-pink-50 to-purple-100', accent: '#8B5CF6', items: ['🧠', '🌈', '💜', '🌸', '✨'] },
};

const FLOAT_POSITIONS = [
  { x: '5%',  y: '15%', delay: 0 },
  { x: '88%', y: '20%', delay: 0.5 },
  { x: '12%', y: '65%', delay: 1 },
  { x: '80%', y: '60%', delay: 1.5 },
  { x: '50%', y: '80%', delay: 0.8 },
];

interface Props {
  subject: string;
  children: React.ReactNode;
}

export default function ClassroomShell({ subject, children }: Props) {
  const theme = SUBJECT_THEMES[subject] ?? SUBJECT_THEMES.math;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Classroom wall background */}
      <div className={`fixed inset-0 -z-10 bg-gradient-to-b ${theme.wall}`} />

      {/* Floor perspective strip */}
      <div
        className="fixed bottom-0 left-0 right-0 h-32 -z-10"
        style={{
          background: 'linear-gradient(to top, rgba(139,90,43,0.12), transparent)',
          transform: 'perspective(400px) rotateX(10deg)',
          transformOrigin: 'bottom',
        }}
      />

      {/* Floating classroom items */}
      {theme.items.map((item, i) => (
        <motion.div
          key={i}
          className="fixed text-3xl pointer-events-none select-none -z-5 opacity-20"
          style={{ left: FLOAT_POSITIONS[i].x, top: FLOAT_POSITIONS[i].y }}
          animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: FLOAT_POSITIONS[i].delay }}
        >
          {item}
        </motion.div>
      ))}

      {/* Top accent stripe */}
      <div className="fixed top-0 left-0 right-0 h-1 -z-5" style={{ background: theme.accent }} />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
