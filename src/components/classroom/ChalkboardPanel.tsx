'use client';

import { motion } from 'framer-motion';

interface Props {
  heading: string;
  content: string;
  activity?: string;
  sectionIndex: number;
}

export default function ChalkboardPanel({ heading, content, activity, sectionIndex }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative rounded-lg overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a3a1a 0%, #2d5a27 50%, #1e4a1e 100%)',
        border: '10px solid #5c3d1e',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3), 0 8px 40px rgba(0,0,0,0.35)',
      }}
    >
      {/* Chalk dust overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(ellipse at 30% 30%, white 0%, transparent 60%)' }}
      />

      {/* Corner number */}
      <div className="absolute top-3 right-4 text-green-300/40 font-nunito font-black text-5xl select-none">
        {sectionIndex + 1}
      </div>

      <div className="relative p-6 md:p-8">
        {/* Heading — chalk style */}
        <h2
          className="font-nunito font-black text-xl md:text-2xl mb-4"
          style={{ color: '#e8f5e8', textShadow: '1px 1px 2px rgba(0,0,0,0.5)', letterSpacing: '0.02em' }}
        >
          {heading}
        </h2>

        {/* Chalk underline */}
        <div className="w-24 h-0.5 mb-4 rounded-full opacity-50" style={{ background: '#b8d5b8' }} />

        {/* Content */}
        <p
          className="font-dmsans leading-relaxed text-base md:text-lg"
          style={{ color: '#d4ecd4', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
        >
          {content}
        </p>

        {/* Activity box — sticky note style */}
        {activity && (
          <motion.div
            initial={{ rotate: -1, scale: 0.95 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="mt-5 rounded-xl p-4"
            style={{ background: '#FFD166', boxShadow: '2px 4px 12px rgba(0,0,0,0.3)' }}
          >
            <p className="font-nunito font-bold text-gray-800 text-sm mb-1">✏️ Try This!</p>
            <p className="font-dmsans text-gray-700 text-sm leading-relaxed">{activity}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
