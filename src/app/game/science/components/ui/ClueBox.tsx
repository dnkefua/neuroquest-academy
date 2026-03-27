'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopicVisualizer from '../visualizers/TopicVisualizer';
import type { ScienceQuestion } from '../../store/gameStore';
import { useScienceStore } from '../../store/gameStore';
import { getGameQuestById } from '@/lib/questData';
import { gameAudio } from '../../../shared/audio';
import { gameTTS } from '../../../shared/tts';

export default function ScienceClueBox({ question, questionIndex }: {
  question: ScienceQuestion;
  questionIndex: number;
}) {
  const [open, setOpen] = useState(false);
  const { clueUsed, openClue, currentQuestId } = useScienceStore();
  const used = clueUsed[questionIndex];

  // Get quest title for topic visualization
  const quest = useMemo(() => getGameQuestById(currentQuestId), [currentQuestId]);
  const questTitle = quest?.title || 'Science';

  function handleOpen() {
    if (!used) openClue(questionIndex);
    gameAudio.playClick();
    setOpen(true);
    gameTTS.speak(`${question.clue.title}. ${question.clue.example}`);
  }

  return (
    <>
      <motion.button onClick={handleOpen}
        className="relative px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2"
        style={{
          background: used ? 'rgba(20,184,166,0.12)' : 'rgba(20,184,166,0.2)',
          border: '2px solid #14B8A6',
          color: '#14B8A6',
          boxShadow: used ? 'none' : '0 0 14px rgba(20,184,166,0.4)',
        }}
        animate={used ? {} : {
          boxShadow: ['0 0 8px rgba(20,184,166,0.3)', '0 0 22px rgba(20,184,166,0.7)', '0 0 8px rgba(20,184,166,0.3)'],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <span className="text-lg">{used ? '📖' : '💡'}</span>
        {used ? 'View Clue Again' : 'Need a Clue?'}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />

            <motion.div className="relative max-w-lg w-full z-10 rounded-3xl p-7 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #0d1b3e 0%, #0a2240 100%)',
                border: '2px solid rgba(20,184,166,0.5)',
                boxShadow: '0 0 60px rgba(20,184,166,0.2), inset 0 0 40px rgba(0,0,0,0.2)',
              }}
              initial={{ scale: 0.3, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.3, y: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}>

              <div className="text-center mb-3">
                <span className="text-3xl">🔬</span>
              </div>
              <h3 className="text-center font-black text-lg text-teal-300 mb-1">
                🧪 {question.clue.title}
              </h3>
              <div className="w-full h-px bg-teal-700/40 my-4" />

              {/* Topic visualizer */}
              <div className="flex justify-center mb-4">
                <TopicVisualizer questTitle={questTitle} highlightStage={question.clue.highlightStage} />
              </div>

              <p className="text-sm text-teal-100 leading-relaxed whitespace-pre-line mb-5 text-center"
                style={{ fontFamily: 'monospace' }}>
                {question.clue.example}
              </p>

              <button onClick={() => setOpen(false)}
                className="w-full py-3 rounded-2xl font-black text-base transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #0D9488, #14B8A6)', color: 'white' }}>
                ✅ Got it! Close Clue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}