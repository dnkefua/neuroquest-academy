'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MathExplainer from '@/components/explainer/MathExplainer';
import MathClassroomStage from '@/components/lesson-stages/MathClassroomStage';
import MicroSprintTimer from '@/components/micro-sprint/MicroSprintTimer';
import { useEconomyStore } from '@/store/economyStore';
import { getGameQuestById } from '@/lib/questData';
import ClueBox from '../components/ui/ClueBox';
import { useGameStore } from '../store/gameStore';
import { gameTTS, stripParens, useTTSCleanup, useTTSSettings } from '../../shared/tts';
import { inferMathExplainer } from '../utils/explainerMappings';

const GRADE_THEMES: Record<number, { name: string; emoji: string; color1: string; color2: string }> = {
  1: { name: 'Zara the Fairy', emoji: 'Spark', color1: '#22C55E', color2: '#10B981' },
  2: { name: 'Marco the Wizard', emoji: 'Wise', color1: '#8B5CF6', color2: '#6366F1' },
  3: { name: 'Luna the Explorer', emoji: 'Trail', color1: '#F59E0B', color2: '#EF4444' },
  4: { name: 'Rex the Builder', emoji: 'Build', color1: '#14B8A6', color2: '#0EA5E9' },
  5: { name: 'Maya the Detective', emoji: 'Clue', color1: '#EC4899', color2: '#8B5CF6' },
  6: { name: 'Captain Plus', emoji: 'Quest', color1: '#8B5CF6', color2: '#6366F1' },
  7: { name: 'Sage the Scholar', emoji: 'Learn', color1: '#F59E0B', color2: '#D97706' },
  8: { name: 'Atlas the Navigator', emoji: 'Aim', color1: '#14B8A6', color2: '#0891B2' },
  9: { name: 'Pythagoras Jr.', emoji: 'Proof', color1: '#6366F1', color2: '#4F46E5' },
  10: { name: 'Nova the Alchemist', emoji: 'Lab', color1: '#EC4899', color2: '#DB2777' },
  11: { name: 'Professor Limit', emoji: 'Focus', color1: '#0EA5E9', color2: '#0284C7' },
  12: { name: 'Master Calculus', emoji: 'Peak', color1: '#FFD700', color2: '#FFA500' },
};

export default function QuizScene() {
  const { answerQuestion, currentGrade, currentQuestion, currentQuestId, nextQuestion, questions, score } = useGameStore();
  const { earnCoinsWithMultiplier } = useEconomyStore();
  const { enabled: ttsOn } = useTTSSettings();

  const q = questions[currentQuestion];
  const theme = GRADE_THEMES[currentGrade] || GRADE_THEMES[6];
  const quest = useMemo(() => getGameQuestById(currentQuestId), [currentQuestId]);
  const explainer = useMemo(() => (q ? inferMathExplainer(q) : null), [q]);

  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useTTSCleanup();

  useEffect(() => {
    setSelected(null);
    setAnswered(false);
    setFeedback(null);
  }, [currentQuestion]);

  useEffect(() => {
    if (!ttsOn || !q) return;
    gameTTS.speak(`${theme.name}. ${stripParens(q.question)}`);
    return () => gameTTS.stop();
  }, [currentQuestion, q, theme.name, ttsOn]);

  function handleConfirm() {
    if (selected === null || !q) return;
    const correct = selected === q.correct;
    setAnswered(true);
    setFeedback(correct ? 'correct' : 'wrong');
    answerQuestion(correct);
    if (correct) {
      earnCoinsWithMultiplier(30, 'correct_answer');
    }
  }

  function handleNext() {
    setSelected(null);
    setAnswered(false);
    setFeedback(null);
    nextQuestion();
  }

  if (!q || !explainer) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#0b1220]">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const prompt = q.clue.example.split('\n').filter(Boolean)[0] || q.narrative;

  return (
    <MicroSprintTimer
      maxMinutes={10}
      compact
      onComplete={() => {
        if (currentQuestion < questions.length - 1) {
          nextQuestion();
        }
      }}
    >
      <div
        className="flex h-dvh flex-col items-center overflow-hidden px-2 pb-2 pt-14 sm:px-3 sm:pb-3 sm:pt-16"
        style={{ background: `linear-gradient(180deg, ${theme.color1}12 0%, ${theme.color2}12 100%)` }}
      >
        <div
          className="mb-2 flex w-full max-w-6xl flex-shrink-0 items-center justify-between rounded-2xl px-3 py-2"
          style={{ background: 'rgba(0,0,0,0.46)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Math Classroom</p>
            <p className="text-sm font-black text-white">{quest?.title || theme.name}</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-white/70">Score: {score}</span>
            <span className="font-bold text-amber-300">Coins: {useEconomyStore.getState().walletCoins}</span>
          </div>
        </div>

        <div className="mb-2 w-full max-w-6xl flex-shrink-0">
          <div className="h-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${theme.color1}, ${theme.color2})` }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
          <p className="mt-0.5 text-center text-[10px] text-white/50">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          className="grid min-h-0 w-full max-w-6xl flex-1 grid-rows-[minmax(0,0.46fr)_minmax(0,0.54fr)] gap-2 sm:grid-cols-[1.12fr_0.88fr] sm:grid-rows-1"
          >
            <div className="grid min-h-0 gap-2 grid-rows-[minmax(0,0.52fr)_minmax(0,0.48fr)] sm:grid-rows-[minmax(0,0.56fr)_minmax(0,0.44fr)]">
              <MathClassroomStage
                title={q.clue.title}
                prompt={prompt}
                equation={q.equation}
                accent={theme.color1}
                startValue={q.clue.startValue}
                moveValue={q.clue.moveValue}
                className="h-full min-h-0"
                overlay="none"
                showEquation={false}
              />

              <div className="flex min-h-0 flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0d1726] p-3">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
                  Animated Explainer
                </p>
                <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl">
                  <MathExplainer concept={explainer.concept} values={explainer.values} />
                </div>
              </div>
            </div>

            <div
              className="flex min-h-0 flex-col overflow-hidden rounded-[28px]"
              style={{ background: 'rgba(0,0,0,0.58)', border: '1px solid rgba(255,255,255,0.09)' }}
            >
              <div
                className="flex items-start gap-2 px-3 py-2"
                style={{ background: `linear-gradient(135deg, ${theme.color1}18, transparent)` }}
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-[0.12em] text-white sm:h-10 sm:w-10 sm:rounded-2xl sm:text-[11px]">
                  {theme.emoji}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: theme.color1 }}>
                    {theme.name}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-gray-200 sm:line-clamp-3">{q.narrative}</p>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col px-3 pb-2 pt-2 sm:px-4 sm:pb-3">
                <div className="mb-1.5 rounded-2xl bg-white/5 p-2 sm:p-3">
                  <p className="line-clamp-2 text-xs font-bold leading-5 text-white sm:text-sm sm:leading-6">{q.question}</p>
                  {q.equation && (
                    <p className="mt-1 font-mono text-base font-black" style={{ color: theme.color1 }}>
                      {q.equation}
                    </p>
                  )}
                </div>

                <div className="grid flex-1 auto-rows-fr grid-cols-2 gap-1.5 sm:gap-2">
                  {q.options.map((option, index) => {
                    const isSelected = selected === index;
                    const isCorrect = index === q.correct;
                    let background = 'rgba(255,255,255,0.06)';
                    let border = 'rgba(255,255,255,0.15)';
                    let textColor = 'white';

                    if (answered) {
                      if (isCorrect) {
                        background = 'rgba(0,200,80,0.25)';
                        border = '#00C851';
                        textColor = '#00FF6A';
                      } else if (isSelected) {
                        background = 'rgba(255,68,68,0.25)';
                        border = '#FF4444';
                        textColor = '#FF9A9A';
                      } else {
                        background = 'rgba(255,255,255,0.03)';
                        border = 'rgba(255,255,255,0.05)';
                        textColor = 'rgba(255,255,255,0.35)';
                      }
                    } else if (isSelected) {
                      background = `${theme.color1}30`;
                      border = theme.color1;
                    }

                    return (
                      <motion.button
                        key={index}
                        onClick={() => !answered && setSelected(index)}
                        whileHover={!answered ? { scale: 1.02 } : {}}
                        whileTap={!answered ? { scale: 0.98 } : {}}
                        className="rounded-xl px-2 py-1.5 text-left text-xs font-bold leading-4 transition-all sm:rounded-2xl sm:px-3 sm:py-2 sm:text-sm sm:leading-5"
                        style={{ background, border: `2px solid ${border}`, color: textColor }}
                      >
                        {option}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="flex-shrink-0 border-t border-white/7 px-3 pb-2 pt-2 sm:px-4 sm:pb-3">
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-1.5 line-clamp-1 overflow-hidden rounded-xl px-3 py-1.5 text-center text-[11px] font-bold sm:text-xs"
                      style={{
                        background: feedback === 'correct' ? 'rgba(0,200,80,0.2)' : 'rgba(255,100,0,0.2)',
                        border: `1px solid ${feedback === 'correct' ? '#00C851' : '#FF6400'}`,
                        color: feedback === 'correct' ? '#00FF6A' : '#FFA040',
                      }}
                    >
                      {feedback === 'correct' ? 'Correct. You earned 30 coins.' : 'Not quite yet. Retry or use the clue.'}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between gap-2">
                  <ClueBox question={q} questionIndex={currentQuestion} questId={useGameStore.getState().currentQuestId} />
                  {!answered ? (
                    <motion.button
                      onClick={handleConfirm}
                      disabled={selected === null}
                      whileHover={selected !== null ? { scale: 1.05 } : {}}
                      whileTap={selected !== null ? { scale: 0.95 } : {}}
                      className="rounded-xl px-4 py-2 text-xs font-black text-white disabled:opacity-40 sm:rounded-2xl sm:px-5"
                      style={{ background: `linear-gradient(135deg, ${theme.color1}, ${theme.color2})` }}
                    >
                      Confirm
                    </motion.button>
                  ) : (
                    <div className="flex gap-1.5">
                      {feedback === 'wrong' && (
                        <button
                          onClick={() => {
                            setAnswered(false);
                            setFeedback(null);
                            setSelected(null);
                          }}
                          className="rounded-xl px-3 py-2 text-xs font-bold sm:rounded-2xl"
                          style={{ background: 'rgba(255,100,0,0.3)', border: '1px solid #FF6400', color: '#FFA040' }}
                        >
                          Retry
                        </button>
                      )}
                      <motion.button
                        onClick={handleNext}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-xl px-4 py-2 text-xs font-black text-white sm:rounded-2xl sm:px-5"
                        style={{ background: `linear-gradient(135deg, ${theme.color1}, ${theme.color2})` }}
                      >
                        Next
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </MicroSprintTimer>
  );
}
