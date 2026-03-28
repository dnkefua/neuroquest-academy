'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { gameTTS, useTTSCleanup } from '../../shared/tts';
import { useEconomyStore } from '@/store/economyStore';
import ClueBox from '../components/ui/ClueBox';

const GRADE_THEMES: Record<number, { name: string; emoji: string; color1: string; color2: string }> = {
  1: { name: 'Zara the Fairy', emoji: '🧚', color1: '#22C55E', color2: '#10B981' },
  2: { name: 'Marco the Wizard', emoji: '🧙', color1: '#8B5CF6', color2: '#6366F1' },
  3: { name: 'Luna the Explorer', emoji: '🌟', color1: '#F59E0B', color2: '#EF4444' },
  4: { name: 'Rex the Builder', emoji: '🏗️', color1: '#14B8A6', color2: '#0EA5E9' },
  5: { name: 'Maya the Detective', emoji: '🔍', color1: '#EC4899', color2: '#8B5CF6' },
  6: { name: 'Captain Plus', emoji: '🏴‍☠️', color1: '#8B5CF6', color2: '#6366F1' },
  7: { name: 'Sage the Scholar', emoji: '📚', color1: '#F59E0B', color2: '#D97706' },
  8: { name: 'Atlas the Navigator', emoji: '🧭', color1: '#14B8A6', color2: '#0891B2' },
  9: { name: 'Pythagoras Jr.', emoji: '📐', color1: '#6366F1', color2: '#4F46E5' },
  10: { name: 'Nova the Alchemist', emoji: '⚗️', color1: '#EC4899', color2: '#DB2777' },
  11: { name: 'Professor Limit', emoji: '🎓', color1: '#0EA5E9', color2: '#0284C7' },
  12: { name: 'Master Calculus', emoji: '🏆', color1: '#FFD700', color2: '#FFA500' },
};

export default function QuizScene() {
  const { questions, currentQuestion, score, answerQuestion, nextQuestion, currentGrade } = useGameStore();
  const { earnCoins } = useEconomyStore();
  const q = questions[currentQuestion];
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [ttsOn, setTtsOn] = useState(gameTTS.enabled);

  useTTSCleanup();
  const theme = GRADE_THEMES[currentGrade] || GRADE_THEMES[6];

  useEffect(() => {
    setSelected(null);
    setAnswered(false);
    setFeedback(null);
  }, [currentQuestion]);

  useEffect(() => {
    if (q) {
      gameTTS.speak(`${theme.name} asks: ${q.question}`);
      return () => gameTTS.stop();
    }
  }, [currentQuestion, q, theme.name]);

  function handleConfirm() {
    if (selected === null) return;
    const correct = selected === q.correct;
    setAnswered(true);
    setFeedback(correct ? 'correct' : 'wrong');
    answerQuestion(correct);
    if (correct) earnCoins(30, 'correct_answer');
  }

  function handleNext() {
    setSelected(null);
    setAnswered(false);
    setFeedback(null);
    nextQuestion();
  }

  if (!q) {
    return (
      <div className="h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(180deg, #0f0c29 0%, #1a0533 100%)' }}>
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center px-4 py-3"
      style={{ background: `linear-gradient(180deg, ${theme.color1}15 0%, ${theme.color2}15 100%)` }}>

      {/* TTS toggle */}
      <button onClick={() => setTtsOn(gameTTS.toggle())}
        className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center text-base"
        style={{ background: ttsOn ? `${theme.color1}40` : 'rgba(255,255,255,0.1)', border: `1px solid ${ttsOn ? theme.color1 : 'rgba(255,255,255,0.2)'}` }}>
        {ttsOn ? '🔊' : '🔇'}
      </button>

      {/* HUD */}
      <div className="w-full max-w-xl flex-shrink-0 mb-2 flex items-center justify-between px-4 py-2 rounded-2xl"
        style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{theme.emoji}</span>
          <span className="text-white font-bold text-xs">{theme.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/70 text-xs">Score: {score}</span>
          <span className="text-yellow-400 text-xs font-bold">💰 {useEconomyStore.getState().walletCoins}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xl flex-shrink-0 mb-2">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${theme.color1}, ${theme.color2})` }}
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-center text-white/50 text-xs mt-0.5">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      {/* Question Card — fills remaining space, scrolls internally */}
      <AnimatePresence mode="wait">
        <motion.div key={currentQuestion}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="w-full max-w-xl flex-1 min-h-0 flex flex-col rounded-3xl overflow-hidden"
          style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            {/* Narrator */}
            <div className="px-5 pt-4 pb-2 flex items-start gap-3"
              style={{ background: `linear-gradient(135deg, ${theme.color1}20, transparent)` }}>
              <span className="text-3xl flex-shrink-0">{theme.emoji}</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.color1 }}>
                  {theme.name} asks:
                </p>
                <p className="text-gray-200 text-sm leading-relaxed mt-0.5">{q.narrative}</p>
              </div>
            </div>

            <div className="px-5 pt-2 pb-3">
              {/* Question */}
              <div className="mb-3 p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-white font-bold text-base">{q.question}</p>
                {q.equation && (
                  <p className="font-mono text-lg font-black mt-1" style={{ color: theme.color1 }}>
                    {q.equation}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrect = i === q.correct;
                  let bg = 'rgba(255,255,255,0.06)';
                  let border = 'rgba(255,255,255,0.15)';
                  let textColor = 'white';
                  if (answered) {
                    if (isCorrect) { bg = 'rgba(0,200,80,0.25)'; border = '#00C851'; textColor = '#00FF6A'; }
                    else if (isSelected && !isCorrect) { bg = 'rgba(255,68,68,0.25)'; border = '#FF4444'; textColor = '#FF8888'; }
                    else { bg = 'rgba(255,255,255,0.03)'; border = 'rgba(255,255,255,0.05)'; textColor = 'rgba(255,255,255,0.3)'; }
                  } else if (isSelected) {
                    bg = `${theme.color1}30`; border = theme.color1;
                  }
                  return (
                    <motion.button key={i}
                      onClick={() => !answered && setSelected(i)}
                      whileHover={!answered ? { scale: 1.03 } : {}}
                      whileTap={!answered ? { scale: 0.97 } : {}}
                      className="py-3 px-3 rounded-2xl font-bold text-sm transition-all text-center"
                      style={{ background: bg, border: `2px solid ${border}`, color: textColor }}>
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pinned bottom: feedback + actions */}
          <div className="flex-shrink-0 px-5 pb-4 pt-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>

            {/* Feedback */}
            <AnimatePresence>
              {feedback && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl px-3 py-2 mb-2 text-center font-bold text-sm overflow-hidden"
                  style={{
                    background: feedback === 'correct' ? 'rgba(0,200,80,0.2)' : 'rgba(255,100,0,0.2)',
                    border: `1px solid ${feedback === 'correct' ? '#00C851' : '#FF6400'}`,
                    color: feedback === 'correct' ? '#00FF6A' : '#FFA040',
                  }}>
                  {feedback === 'correct' ? '✨ CORRECT! +30 Coins!' : '❌ Not quite — try again or move on!'}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2">
              <ClueBox question={q} questionIndex={currentQuestion} questId={useGameStore.getState().currentQuestId} />
              {!answered ? (
                <motion.button onClick={handleConfirm} disabled={selected === null}
                  whileHover={selected !== null ? { scale: 1.05 } : {}}
                  whileTap={selected !== null ? { scale: 0.95 } : {}}
                  className="px-6 py-2.5 rounded-2xl font-black text-white text-sm disabled:opacity-40"
                  style={{ background: `linear-gradient(135deg, ${theme.color1}, ${theme.color2})` }}>
                  Confirm ✓
                </motion.button>
              ) : (
                <div className="flex gap-2">
                  {feedback === 'wrong' && (
                    <button onClick={() => { setAnswered(false); setFeedback(null); setSelected(null); }}
                      className="px-4 py-2.5 rounded-2xl font-bold text-sm"
                      style={{ background: 'rgba(255,100,0,0.3)', border: '1px solid #FF6400', color: '#FFA040' }}>
                      💪 Retry
                    </button>
                  )}
                  <motion.button onClick={handleNext}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 rounded-2xl font-black text-white text-sm"
                    style={{ background: `linear-gradient(135deg, ${theme.color1}, ${theme.color2})` }}>
                    Next →
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
