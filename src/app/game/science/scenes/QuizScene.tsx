'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ScienceExplainer from '@/components/explainer/ScienceExplainer';
import ScienceLabStage from '@/components/lesson-stages/ScienceLabStage';
import { getGameQuestById } from '@/lib/questData';
import { gameAudio } from '../../shared/audio';
import { gameTTS, stripParens, useTTSCleanup, useTTSSettings } from '../../shared/tts';
import ScienceClueBox from '../components/ui/ClueBox';
import VialCounter from '../components/ui/VialCounter';
import TopicVisualizer from '../components/visualizers/TopicVisualizer';
import { useScienceStore } from '../store/gameStore';
import { getScienceDetail, inferScienceExplainerConcept, inferScienceLabMode } from '../utils/visualMappings';

export default function ScienceQuizScene() {
  const {
    answerQuestion,
    collectVial,
    currentQuestion,
    currentQuestId,
    nextQuestion,
    questions,
    score,
    vialsCollected,
  } = useScienceStore();
  const { enabled: ttsOn } = useTTSSettings();

  const q = questions[currentQuestion];
  const quest = useMemo(() => getGameQuestById(currentQuestId), [currentQuestId]);
  const questTitle = quest?.title || 'Science';
  const detail = getScienceDetail(q);
  const labMode = inferScienceLabMode(questTitle, q);
  const explainerConcept = inferScienceExplainerConcept(questTitle, q);

  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [shaking, setShaking] = useState(false);
  const [justFilledVial, setJustFilledVial] = useState<number | null>(null);
  const [visualTab, setVisualTab] = useState<'explainer' | 'diagram'>('explainer');
  const filledRef = useRef(vialsCollected);

  useTTSCleanup();

  useEffect(() => {
    setSelected(null);
    setAnswered(false);
    setFeedback(null);
    setJustFilledVial(null);
    setVisualTab('explainer');
  }, [currentQuestion]);

  useEffect(() => {
    if (!ttsOn || !q) return;
    gameTTS.speak(`Question ${currentQuestion + 1}. ${stripParens(q.question)}`);
    return () => gameTTS.stop();
  }, [currentQuestion, q, ttsOn]);

  function handleConfirm() {
    if (selected === null || !q) return;

    const correct = selected === q.correct;
    setAnswered(true);
    setFeedback(correct ? 'correct' : 'wrong');
    answerQuestion(correct);

    if (correct) {
      gameAudio.playCorrect();
      if (currentQuestion < 4) {
        collectVial();
        setJustFilledVial(filledRef.current);
        filledRef.current += 1;
        gameAudio.playCollect();
      }
      gameTTS.speak('Correct.');
      return;
    }

    gameAudio.playWrong();
    gameTTS.speak('Not quite. Try again or open the clue.');
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }

  function handleTryAgain() {
    setAnswered(false);
    setFeedback(null);
    setSelected(null);
  }

  if (!q) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#08131f]">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className={`relative flex h-dvh w-full flex-col items-center overflow-hidden px-2 pb-2 pt-14 sm:px-3 sm:pb-3 sm:pt-16 ${shaking ? 'shake' : ''}`}
      style={{ background: 'linear-gradient(180deg, #08131f 0%, #0a1f33 58%, #08111b 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2 flex w-full max-w-6xl flex-shrink-0 items-center justify-between rounded-2xl px-3 py-2"
        style={{ background: 'rgba(0,0,0,0.46)', border: '1px solid rgba(56,189,248,0.16)' }}
      >
        <VialCounter collected={vialsCollected} total={4} justCollectedIndex={justFilledVial} />
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400">Question</p>
          <p className="text-sm font-black text-white">
            {currentQuestion + 1} / {questions.length}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400">Score</p>
          <p className="text-sm font-black text-teal-300">
            {score} / {questions.length}
          </p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -20 }}
          className="grid min-h-0 w-full max-w-6xl flex-1 grid-rows-[minmax(0,0.46fr)_minmax(0,0.54fr)] gap-2 sm:grid-cols-[1.12fr_0.88fr] sm:grid-rows-1"
        >
          <div className="grid min-h-0 gap-2 grid-rows-[minmax(0,0.52fr)_minmax(0,0.48fr)] sm:grid-rows-[minmax(0,0.56fr)_minmax(0,0.44fr)]">
            <ScienceLabStage
              title={questTitle}
              detail={q.clue.title}
              mode={labMode}
              accent={q.spiritColor}
              className="h-full min-h-0"
              overlay="none"
            />

            <div className="flex min-h-0 flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0d1726] p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Visual Support</p>
                <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1 text-[10px] font-bold uppercase tracking-[0.18em]">
                  {(['explainer', 'diagram'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setVisualTab(tab)}
                      className="rounded-xl px-3 py-1.5 transition-all"
                      style={{
                        background: visualTab === tab ? q.spiritColor : 'transparent',
                        color: visualTab === tab ? '#03131d' : 'rgba(255,255,255,0.65)',
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-[#101b2a]">
                {visualTab === 'explainer' ? (
                  explainerConcept ? (
                    <ScienceExplainer concept={explainerConcept} autoPlay showLabels={false} />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm leading-6 text-slate-300">
                      This topic is anchored by the lab model and the reference diagram.
                    </div>
                  )
                ) : (
                  <div className="flex h-full items-center justify-center overflow-hidden p-3">
                    <TopicVisualizer questTitle={questTitle} highlightStage={q.clue.highlightStage} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className="flex min-h-0 flex-col overflow-hidden rounded-[28px] shadow-2xl"
            style={{ background: 'rgba(8,19,31,0.97)', border: `1px solid ${q.spiritColor}33` }}
          >
            <div
              className="flex items-start gap-2 px-3 py-2"
              style={{ background: `linear-gradient(135deg, ${q.spiritColor}18, transparent)` }}
            >
              <motion.span
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-[0.12em] text-white sm:h-10 sm:w-10 sm:rounded-2xl sm:text-[10px]"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Guide
              </motion.span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: q.spiritColor }}>
                  {q.spirit}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-gray-200 sm:line-clamp-3">{detail}</p>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col px-3 pb-2 pt-2 sm:px-4 sm:pb-3">
              <div className="mb-1.5 rounded-2xl bg-white/5 p-2 sm:p-3">
                <p className="line-clamp-2 text-xs font-bold leading-5 text-white sm:text-sm sm:leading-6">{q.question}</p>
              </div>

              <div className="grid flex-1 auto-rows-fr grid-cols-2 gap-1.5 sm:gap-2">
                {q.options.map((option, index) => {
                  const isSelected = selected === index;
                  const isCorrect = index === q.correct;
                  let background = 'rgba(255,255,255,0.05)';
                  let border = 'rgba(255,255,255,0.12)';
                  let textColor = 'rgba(255,255,255,0.92)';

                  if (answered) {
                    if (isCorrect) {
                      background = 'rgba(0,200,80,0.18)';
                      border = '#00C851';
                      textColor = '#00FF6A';
                    } else if (isSelected) {
                      background = 'rgba(255,68,68,0.18)';
                      border = '#FF4444';
                      textColor = '#FF9A9A';
                    } else {
                      background = 'rgba(255,255,255,0.02)';
                      border = 'transparent';
                      textColor = 'rgba(255,255,255,0.25)';
                    }
                  } else if (isSelected) {
                    background = `${q.spiritColor}22`;
                    border = q.spiritColor;
                  }

                  return (
                    <motion.button
                      key={index}
                      onClick={() => !answered && setSelected(index)}
                      whileHover={!answered ? { scale: 1.01, x: 3 } : {}}
                      whileTap={!answered ? { scale: 0.98 } : {}}
                      animate={answered && isSelected && !isCorrect ? { x: [-5, 5, -4, 4, 0] } : {}}
                      transition={{ duration: 0.4 }}
                      className="rounded-xl px-2 py-1.5 text-left text-xs font-semibold leading-4 transition-all sm:rounded-2xl sm:px-3 sm:py-2 sm:text-sm sm:leading-5"
                      style={{ background, border: `1.5px solid ${border}`, color: textColor }}
                    >
                      <span className="mr-2 opacity-50">{['A', 'B', 'C', 'D'][index]}.</span>
                      {option}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="flex-shrink-0 border-t border-sky-300/10 px-3 pb-2 pt-2 sm:px-4 sm:pb-3">
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-1.5 line-clamp-1 overflow-hidden rounded-xl px-3 py-1.5 text-center text-[11px] font-bold sm:text-xs"
                    style={{
                      background: feedback === 'correct' ? 'rgba(0,200,80,0.15)' : 'rgba(255,100,0,0.15)',
                      border: `1px solid ${feedback === 'correct' ? '#00C851' : '#FF6400'}`,
                      color: feedback === 'correct' ? '#00FF6A' : '#FFA040',
                    }}
                  >
                    {feedback === 'correct' ? `Correct. ${q.reward}` : 'Not quite. Retry or use the clue.'}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between gap-2">
                <ScienceClueBox question={q} questionIndex={currentQuestion} />
                {!answered ? (
                  <motion.button
                    onClick={handleConfirm}
                    disabled={selected === null}
                    whileHover={selected !== null ? { scale: 1.05 } : {}}
                    whileTap={selected !== null ? { scale: 0.95 } : {}}
                    className="rounded-xl px-4 py-2 text-xs font-black text-slate-950 disabled:opacity-40 sm:rounded-2xl sm:px-5"
                    style={{ background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)' }}
                  >
                    Confirm
                  </motion.button>
                ) : (
                  <div className="flex gap-1.5">
                    {feedback === 'wrong' && (
                      <button
                        onClick={handleTryAgain}
                        className="rounded-xl px-3 py-2 text-xs font-black sm:rounded-2xl"
                        style={{ background: 'rgba(255,100,0,0.2)', border: '1px solid #FF6400', color: '#FFA040' }}
                      >
                        Retry
                      </button>
                    )}
                    <motion.button
                      onClick={() => nextQuestion()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-xl px-4 py-2 text-xs font-black text-slate-950 sm:rounded-2xl sm:px-5"
                      style={{ background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)' }}
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
  );
}
