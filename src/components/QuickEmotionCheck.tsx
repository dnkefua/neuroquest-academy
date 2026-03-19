'use client';

import { motion } from 'framer-motion';

type Feeling = 'fine' | 'ok' | 'frustrated';

interface Props {
  onSelect: (feeling: Feeling) => void;
}

const OPTIONS: { feeling: Feeling; emoji: string; label: string; bg: string }[] = [
  { feeling: 'fine',       emoji: '😊', label: 'Fine!',      bg: 'bg-green-50 border-green-200 hover:bg-green-100' },
  { feeling: 'ok',         emoji: '😐', label: 'Okay',       bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
  { feeling: 'frustrated', emoji: '😤', label: 'Frustrated', bg: 'bg-red-50 border-red-200 hover:bg-red-100' },
];

export default function QuickEmotionCheck({ onSelect }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
      className="mt-3 p-4 bg-purple-50 rounded-2xl border border-purple-100"
    >
      <p className="font-nunito font-bold text-purple-700 text-sm mb-3">
        💭 How are you feeling after that question?
      </p>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.feeling}
            onClick={() => onSelect(opt.feeling)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border-2 transition-all active:scale-95 ${opt.bg}`}
          >
            <span className="text-2xl">{opt.emoji}</span>
            <span className="text-xs font-dmsans font-medium text-gray-600">{opt.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
