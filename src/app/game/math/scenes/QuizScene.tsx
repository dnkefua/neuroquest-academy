'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { gameTTS, useTTSCleanup, stripParens } from '../../shared/tts';
import { useEconomyStore } from '@/store/economyStore';
import ClueBox from '../components/ui/ClueBox';
import ConceptAnimation from '../../shared/ConceptAnimation';
import { getGameQuestById } from '@/lib/questData';

const GRADE_THEMES: Record<number, { name: string; emoji: string; color1: string; color2: string }> = {
  1:  { name: 'Zara the Fairy',      emoji: '🧚',  color1: '#22C55E', color2: '#10B981' },
  2:  { name: 'Marco the Wizard',    emoji: '🧙',  color1: '#8B5CF6', color2: '#6366F1' },
  3:  { name: 'Luna the Explorer',   emoji: '🌟',  color1: '#F59E0B', color2: '#EF4444' },
  4:  { name: 'Rex the Builder',     emoji: '🏗️', color1: '#14B8A6', color2: '#0EA5E9' },
  5:  { name: 'Maya the Detective',  emoji: '🔍',  color1: '#EC4899', color2: '#8B5CF6' },
  6:  { name: 'Captain Plus',        emoji: '🏴‍☠️', color1: '#8B5CF6', color2: '#6366F1' },
  7:  { name: 'Sage the Scholar',    emoji: '📚',  color1: '#F59E0B', color2: '#D97706' },
  8:  { name: 'Atlas the Navigator', emoji: '🧭',  color1: '#14B8A6', color2: '#0891B2' },
  9:  { name: 'Pythagoras Jr.',      emoji: '📐',  color1: '#6366F1', color2: '#4F46E5' },
  10: { name: 'Nova the Alchemist',  emoji: '⚗️',  color1: '#EC4899', color2: '#DB2777' },
  11: { name: 'Professor Limit',     emoji: '🎓',  color1: '#0EA5E9', color2: '#0284C7' },
  12: { name: 'Master Calculus',     emoji: '🏆',  color1: '#FFD700', color2: '#FFA500' },
};

export default function QuizScene() {
  const { questions, currentQuestion, score, answerQuestion, nextQuestion, currentGrade, currentQuestId } = useGameStore();
  const { earnCoins } = useEconomyStore();
  const q = questions[currentQuestion];
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [ttsOn, setTtsOn] = useState(gameTTS.enabled);

  useTTSCleanup();
  const theme = GRADE_THEMES[currentGrade] || GRADE_THEMES[6];
  const quest = useMemo(() => getGameQuestById(currentQuestId), [currentQuestId]);

  useEffect(() => {
    setSelected(null);
    setAnswered(false);
    setFeedback(null);
  }, [currentQuestion]);

  useEffect(() => {
    if (!ttsOn || !q) return;
    gameTTS.speak(`${theme.name} asks: ${stripParens(q.question)}`);
    return () => gameTTS.stop();
  }, [currentQuestion, ttsOn]);

  function handleConfirm() {
    if (selected === null) return;
    const correct = selected === q.correct;
    setAnswered(true);
    setFeedback(correct ? 'correct' : 'wrong');
    answerQuestion(correct);
    if (correct) earnCoins(30, 'correct_answer');
  }

  function handleNext() {
    setSelected(null); setAnswered(false); setFeedback(null);
    nextQuestion();
  }

  if (!q) return (
    <div className="h-dvh flex items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #0f0c29 0%, #1a0533 100%)' }}>
      <p className="text-white">Loading…</p>
    </div>
  );

  return (
    <div className="h-dvh overflow-hidden flex flex-col items-center px-3 py-2"
      style={{ background: `linear-gradient(180deg, ${theme.color1}12 0%, ${theme.color2}12 100%)` }}>

      {/* TTS toggle */}
      <button onClick={() => setTtsOn(gameTTS.toggle())}
        className="absolute top-2 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center text-sm"
        style={{ background: ttsOn ? `${theme.color1}40` : 'rgba(255,255,255,0.1)', border: `1px solid ${ttsOn ? theme.color1 : 'rgba(255,255,255,0.2)'}` }}>
        {ttsOn ? '🔊' : '🔇'}
      </button>

      {/* Compact HUD */}
      <div className="w-full max-w-xl flex-shrink-0 mb-1.5 flex items-center justify-between px-3 py-1.5 rounded-2xl"
        style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{theme.emoji}</span>
          <span className="text-white font-bold text-xs">{theme.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-xs">Score: {score}</span>
          <span className="text-yellow-400 text-xs font-bold">💰 {useEconomyStore.getState().walletCoins}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xl flex-shrink-0 mb-1.5">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${theme.color1}, ${theme.color2})` }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
        </div>
        <p className="text-center text-white/50 text-[10px] mt-0.5">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div key={currentQuestion}
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          className="w-full max-w-xl flex-1 min-h-0 flex flex-col rounded-3xl overflow-hidden"
          style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            {/* Animation */}
            <div className="px-3 pt-3">
              <ConceptAnimation subject="math" questTitle={quest?.title} color1={theme.color1} color2={theme.color2} />
            </div>

            {/* Narrator */}
            <div className="px-4 pb-2 flex items-start gap-2.5"
              style={{ background: `linear-gradient(135deg, ${theme.color1}18, transparent)` }}>
              <motion.span className="text-2xl flex-shrink-0"
                animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                {theme.emoji}
              </motion.span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.color1 }}>
                  {theme.name} asks:
                </p>
                <p className="text-gray-200 text-xs leading-snug mt-0.5 line-clamp-2">{q.narrative}</p>
              </div>
            </div>

            <div className="px-4 pt-1.5 pb-2">
              {/* Question */}
              <div className="mb-2.5 p-2.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-white font-bold text-sm">{q.question}</p>
                {q.equation && (
                  <p className="font-mono text-base font-black mt-1" style={{ color: theme.color1 }}>
                    {q.equation}
                  </p>
                )}
              </div>

              {/* Options — 2-column grid */}
              <div className="grid grid-cols-2 gap-1.5">
                {q.options.map((opt, i) => {
                  const isSelected = selected === i, isCorrect = i === q.correct;
                  let bg = 'rgba(255,255,255,0.06)', border = 'rgba(255,255,255,0.15)', textColor = 'white';
                  if (answered) {
                    if (isCorrect)               { bg = 'rgba(0,200,80,0.25)';  border = '#00C851'; textColor = '#00FF6A'; }
                    else if (isSelected && !isCorrect) { bg = 'rgba(255,68,68,0.25)'; border = '#FF4444'; textColor = '#FF8888'; }
                    else                         { bg = 'rgba(255,255,255,0.03)'; border = 'rgba(255,255,255,0.05)'; textColor = 'rgba(255,255,255,0.3)'; }
                  } else if (isSelected) { bg = `${theme.color1}30`; border = theme.color1; }
                  return (
                    <motion.button key={i}
                      onClick={() => !answered && setSelected(i)}
                      whileHover={!answered ? { scale: 1.03 } : {}}
                      whileTap={!answered ? { scale: 0.97 } : {}}
                      className="py-2.5 px-2 rounded-2xl font-bold text-xs transition-all text-center"
                      style={{ background: bg, border: `2px solid ${border}`, color: textColor }}>
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pinned footer */}
          <div className="flex-shrink-0 px-4 pb-3 pt-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <AnimatePresence>
              {feedback && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl px-3 py-1.5 mb-2 text-center font-bold text-xs overflow-hidden"
                  style={{
                    background: feedback === 'correct' ? 'rgba(0,200,80,0.2)' : 'rgba(255,100,0,0.2)',
                    border: `1px solid ${feedback === 'correct' ? '#00C851' : '#FF6400'}`,
                    color: feedback === 'correct' ? '#00FF6A' : '#FFA040',
                  }}>
                  {feedback === 'correct' ? '✨ CORRECT! +30 Coins!' : '❌ Not quite — try again or move on!'}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center justify-between gap-2">
              <ClueBox question={q} questionIndex={currentQuestion} questId={useGameStore.getState().currentQuestId} />
              {!answered ? (
                <motion.button onClick={handleConfirm} disabled={selected === null}
                  whileHover={selected !== null ? { scale: 1.05 } : {}}
                  whileTap={selected !== null ? { scale: 0.95 } : {}}
                  className="px-5 py-2 rounded-2xl font-black text-white text-xs disabled:opacity-40"
                  style={{ background: `linear-gradient(135deg, ${theme.color1}, ${theme.color2})` }}>
                  Confirm ✓
                </motion.button>
              ) : (
                <div className="flex gap-1.5">
                  {feedback === 'wrong' && (
                    <button onClick={() => { setAnswered(false); setFeedback(null); setSelected(null); }}
                      className="px-3 py-2 rounded-2xl font-bold text-xs"
                      style={{ background: 'rgba(255,100,0,0.3)', border: '1px solid #FF6400', color: '#FFA040' }}>
                      💪 Retry
                    </button>
                  )}
                  <motion.button onClick={handleNext}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 rounded-2xl font-black text-white text-xs"
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
