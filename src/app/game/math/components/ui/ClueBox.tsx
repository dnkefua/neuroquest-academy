'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MathExplainer from '@/components/explainer/MathExplainer';
import MathClassroomStage from '@/components/lesson-stages/MathClassroomStage';
import { useEconomyStore } from '@/store/economyStore';
import { gameTTS } from '../../../shared/tts';
import type { Question } from '../../store/gameStore';
import { useGameStore } from '../../store/gameStore';
import { inferMathExplainer } from '../../utils/explainerMappings';

const CLUE_COST = 10;

interface ClueBoxProps {
  question: Question;
  questionIndex: number;
  questId: string;
}

export default function ClueBox({ question, questionIndex, questId }: ClueBoxProps) {
  const [open, setOpen] = useState(false);
  const [showInsufficient, setShowInsufficient] = useState(false);

  const { clueUsed, openClue } = useGameStore();
  const { walletCoins, buyClue, hasClue } = useEconomyStore();
  const explainer = useMemo(() => inferMathExplainer(question), [question]);

  const alreadyPurchased = hasClue(questId, questionIndex) || clueUsed[questionIndex];
  const canAfford = walletCoins >= CLUE_COST;
  const prompt = question.clue.example.split('\n').filter(Boolean)[0] || question.narrative;

  function handleOpen() {
    if (alreadyPurchased) {
      setOpen(true);
      gameTTS.speak(question.clue.title);
      return;
    }

    const bought = buyClue(questId, questionIndex, CLUE_COST);
    if (bought) {
      openClue(questionIndex);
      setOpen(true);
      gameTTS.speak(question.clue.title);
      return;
    }

    setShowInsufficient(true);
    setTimeout(() => setShowInsufficient(false), 2500);
  }

  return (
    <>
      <div className="relative">
        <AnimatePresence>
          {showInsufficient && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: -32 }}
              exit={{ opacity: 0 }}
              className="absolute left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold"
              style={{ background: 'rgba(255,68,0,0.92)', color: 'white' }}
            >
              Need {CLUE_COST - walletCoins} more coins
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleOpen}
          className="relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold sm:rounded-2xl sm:px-4"
          style={{
            background: alreadyPurchased
              ? 'rgba(255,215,0,0.15)'
              : canAfford
                ? 'rgba(255,215,0,0.2)'
                : 'rgba(255,255,255,0.06)',
            border: `2px solid ${alreadyPurchased || canAfford ? '#FFD700' : 'rgba(255,255,255,0.2)'}`,
            color: alreadyPurchased || canAfford ? '#FFD700' : 'rgba(255,255,255,0.4)',
            boxShadow: canAfford && !alreadyPurchased ? '0 0 15px rgba(255,215,0,0.35)' : 'none',
          }}
          animate={
            canAfford && !alreadyPurchased
              ? {
                  boxShadow: [
                    '0 0 10px rgba(255,215,0,0.22)',
                    '0 0 20px rgba(255,215,0,0.5)',
                    '0 0 10px rgba(255,215,0,0.22)',
                  ],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-sm sm:text-base">{alreadyPurchased ? 'Open' : 'Hint'}</span>
          {alreadyPurchased ? 'View Clue' : canAfford ? `Clue - ${CLUE_COST} coins` : `Need ${CLUE_COST} coins`}
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />

            <motion.div
              className="relative z-10 flex h-[calc(100dvh-1rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[24px] p-3 shadow-2xl sm:h-[min(82dvh,700px)] sm:rounded-[32px] sm:p-5"
              style={{
                background: 'linear-gradient(135deg, rgba(20,18,28,0.98), rgba(36,24,18,0.98))',
                border: '1px solid rgba(250,204,21,0.36)',
                boxShadow: '0 0 50px rgba(250,204,21,0.16)',
              }}
              initial={{ scale: 0.3, rotate: -4, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.3, rotate: 4, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <div className="mb-2 flex-shrink-0 text-center sm:mb-3">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-200/70">Math Clue</p>
                <h3 className="mt-1 line-clamp-1 text-lg font-black text-amber-300 sm:mt-2 sm:text-2xl">{question.clue.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-amber-50/85 sm:mt-2 sm:text-sm sm:leading-6">{question.clue.example}</p>
              </div>

              <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,0.45fr)_minmax(0,0.55fr)] gap-2 sm:grid-cols-[0.96fr_1.04fr] sm:grid-rows-1 sm:gap-3">
                <MathClassroomStage
                  title={question.clue.title}
                  prompt={prompt}
                  equation={question.equation}
                  accent="#f59e0b"
                  startValue={question.clue.startValue}
                  moveValue={question.clue.moveValue}
                  className="h-full min-h-0"
                  overlay="none"
                  showEquation={false}
                />

                <div className="flex min-h-0 flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#0d1726] p-2 sm:rounded-[28px] sm:p-3">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45 sm:mb-2">Step By Step</p>
                  <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl">
                    <MathExplainer concept={explainer.concept} values={explainer.values} />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="mt-2 w-full flex-shrink-0 rounded-2xl py-2.5 text-sm font-black text-slate-950 transition-all hover:scale-[1.01] sm:mt-4 sm:py-3 sm:text-base"
                style={{ background: 'linear-gradient(135deg, #facc15, #f59e0b)' }}
              >
                Close Clue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
