'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NumberLine from './NumberLine';
import type { Question } from '../../store/gameStore';
import { useGameStore } from '../../store/gameStore';
import { useEconomyStore } from '@/store/economyStore';
import { gameTTS } from '../../../shared/tts';

const QUEST_ID = 'g6-math';
const CLUE_COST = 10;  // MYP grade 6

interface ClueBoxProps {
  question: Question;
  questionIndex: number;
}

export default function ClueBox({ question, questionIndex }: ClueBoxProps) {
  const [open, setOpen] = useState(false);
  const [showInsufficient, setShowInsufficient] = useState(false);

  const { clueUsed, openClue } = useGameStore();
  const { walletCoins, buyClue, hasClue } = useEconomyStore();

  const alreadyPurchased = hasClue(QUEST_ID, questionIndex) || clueUsed[questionIndex];
  const canAfford = walletCoins >= CLUE_COST;

  function handleOpen() {
    if (alreadyPurchased) {
      setOpen(true);
      gameTTS.speak(`${question.clue.title}. ${question.clue.example}`);
      return;
    }
    const bought = buyClue(QUEST_ID, questionIndex, CLUE_COST);
    if (bought) {
      openClue(questionIndex);
      setOpen(true);
      gameTTS.speak(`${question.clue.title}. ${question.clue.example}`);
    } else {
      setShowInsufficient(true);
      setTimeout(() => setShowInsufficient(false), 2500);
    }
  }

  return (
    <>
      <div className="relative">
        {/* Insufficient coins tooltip */}
        <AnimatePresence>
          {showInsufficient && (
            <motion.div
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: -32 }} exit={{ opacity: 0 }}
              className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold z-20"
              style={{ background: 'rgba(255,68,0,0.9)', color: 'white' }}>
              💸 Need {CLUE_COST - walletCoins} more coins!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clue button */}
        <motion.button
          onClick={handleOpen}
          className="relative px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2"
          style={{
            background: alreadyPurchased
              ? 'rgba(255,215,0,0.15)'
              : canAfford
              ? 'rgba(255,215,0,0.2)'
              : 'rgba(255,255,255,0.06)',
            border: `2px solid ${alreadyPurchased ? '#FFD700' : canAfford ? '#FFD700' : 'rgba(255,255,255,0.2)'}`,
            color: alreadyPurchased ? '#FFD700' : canAfford ? '#FFD700' : 'rgba(255,255,255,0.4)',
            boxShadow: (canAfford && !alreadyPurchased) ? '0 0 15px rgba(255,215,0,0.4)' : 'none',
          }}
          animate={(canAfford && !alreadyPurchased) ? {
            boxShadow: [
              '0 0 10px rgba(255,215,0,0.3)',
              '0 0 20px rgba(255,215,0,0.6)',
              '0 0 10px rgba(255,215,0,0.3)',
            ],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}>
          <span className="text-lg">{alreadyPurchased ? '📖' : '💡'}</span>
          {alreadyPurchased
            ? 'View Clue'
            : canAfford
            ? `Clue — ${CLUE_COST} 💰`
            : `Need ${CLUE_COST} 💰`}
        </motion.button>
      </div>

      {/* Clue Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />

            <motion.div
              className="relative max-w-lg w-full z-10 rounded-3xl p-8 shadow-2xl"
              style={{
                background: 'radial-gradient(ellipse at center, #F5DEB3 0%, #DEB887 50%, #C4A35A 100%)',
                border: '3px solid #8B6914',
                boxShadow: '0 0 60px rgba(139,105,20,0.5), inset 0 0 40px rgba(0,0,0,0.1)',
              }}
              initial={{ scale: 0.3, rotate: -5, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.3, rotate: 5, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}>

              <div className="text-center mb-3">
                <span className="text-3xl">🔏</span>
              </div>

              <h3 className="text-center font-black text-xl text-amber-900 mb-1"
                style={{ fontFamily: 'Georgia, serif' }}>
                📜 {question.clue.title}
              </h3>

              <div className="w-full h-px bg-amber-700/40 my-4" />

              <p className="text-sm font-bold text-amber-800 mb-3 text-center">💡 How to solve it:</p>
              <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-line mb-5 text-center"
                style={{ fontFamily: 'Georgia, serif' }}>
                {question.clue.example}
              </p>

              <div className="rounded-2xl p-3 mb-5"
                style={{ background: 'rgba(15,12,41,0.85)', border: '1px solid rgba(255,215,0,0.3)' }}>
                <NumberLine
                  start={question.clue.startValue}
                  move={question.clue.moveValue}
                  move2={question.clue.moveValue2}
                  animate={true}
                />
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-full py-3 rounded-2xl font-black text-base transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #8B6914, #C4A35A)', color: 'white' }}>
                ✨ Got it! Close Clue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
