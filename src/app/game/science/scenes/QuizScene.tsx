'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScienceStore } from '../store/gameStore';
import { getGameQuestById } from '@/lib/questData';
import ScienceClueBox from '../components/ui/ClueBox';
import VialCounter from '../components/ui/VialCounter';
import TopicVisualizer from '../components/visualizers/TopicVisualizer';
import { gameAudio } from '../../shared/audio';
import { gameTTS, useTTSCleanup } from '../../shared/tts';

export default function ScienceQuizScene() {
  const { questions, currentQuestion, score, vialsCollected, currentQuestId, currentGrade, answerQuestion, collectVial, nextQuestion } = useScienceStore();
  const q = questions[currentQuestion];

  // Get quest title for topic visualization
  const quest = useMemo(() => getGameQuestById(currentQuestId), [currentQuestId]);
  const questTitle = quest?.title || 'Science';
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [shaking, setShaking] = useState(false);
  const [justFilledVial, setJustFilledVial] = useState<number | null>(null);
  const filledRef = useRef(vialsCollected);
  const [ttsOn, setTtsOn] = useState(gameTTS.enabled);

  // Cleanup TTS on unmount
  useTTSCleanup();

  function toggleTTS() { setTtsOn(gameTTS.toggle()); }

  useEffect(() => {
    setSelected(null); setAnswered(false); setFeedback(null); setJustFilledVial(null);
  }, [currentQuestion]);

  // Read question aloud on each new question
  useEffect(() => {
    gameTTS.speak(`${q.spirit} says: ${q.narrative}. Question: ${q.question}`);
    return () => gameTTS.stop(); // Stop TTS when question changes or unmounts
  }, [currentQuestion, q.spirit, q.narrative, q.question]);

  function handleConfirm() {
    if (selected === null) return;
    const correct = selected === q.correct;
    setAnswered(true);
    setFeedback(correct ? 'correct' : 'wrong');
    answerQuestion(correct);
    if (correct) {
      gameAudio.playCorrect();
      if (currentQuestion < 4) { // only 4 vials for Q1-4
        collectVial();
        setJustFilledVial(filledRef.current);
        filledRef.current += 1;
        gameAudio.playCollect();
      }
      gameTTS.afterSpeak('Correct! Crystal Vial collected! The Cloud Spirits cheer!', () => nextQuestion(), 2600);
    } else {
      gameAudio.playWrong();
      gameTTS.speak('Not quite, explorer! Try again or open a clue for help.');
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }

  function handleTryAgain() {
    setAnswered(false); setFeedback(null); setSelected(null);
  }

  return (
    <div className={`w-full min-h-screen flex flex-col items-center justify-center px-4 py-6 relative overflow-hidden ${shaking ? 'shake' : ''}`}
      style={{ background: 'linear-gradient(180deg, #0c1a2e 0%, #0d2137 60%, #091a10 100%)' }}>

      {/* TTS toggle */}
      <button onClick={toggleTTS}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110"
        style={{ background: ttsOn ? 'rgba(20,184,166,0.25)' : 'rgba(255,255,255,0.1)', border: `1px solid ${ttsOn ? '#14B8A6' : 'rgba(255,255,255,0.2)'}` }}
        title={ttsOn ? 'Turn off read-aloud' : 'Turn on read-aloud'}>
        {ttsOn ? '🔊' : '🔇'}
      </button>

      {/* Torch flames */}
      {[-1, 1].map(side => (
        <div key={side} className="absolute top-1/4 text-3xl"
          style={{ [side < 0 ? 'left' : 'right']: '3%', animation: 'flicker 0.5s ease-in-out infinite alternate' }}>
          🔥
        </div>
      ))}

      {/* HUD */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl mb-4 flex items-center justify-between px-4 py-3 rounded-2xl"
        style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(56,189,248,0.2)' }}>
        <VialCounter collected={vialsCollected} total={4} justCollectedIndex={justFilledVial} />
        <div className="text-center">
          <p className="text-xs text-gray-400">Question</p>
          <p className="font-black text-white text-lg">{currentQuestion + 1} / {questions.length}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Score</p>
          <p className="font-black text-teal-400 text-lg">💧 {score}/{questions.length}</p>
        </div>
      </motion.div>

      {/* Topic visualizer */}
      <div className="w-full max-w-xl mb-3 rounded-2xl px-4 py-2"
        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(56,189,248,0.1)' }}>
        <TopicVisualizer questTitle={questTitle} />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div key={currentQuestion}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: 'rgba(12,26,46,0.97)', border: `2px solid ${q.spiritColor}44` }}>

          {/* Spirit narrator */}
          <div className="px-6 pt-5 pb-3 flex items-start gap-3"
            style={{ background: `linear-gradient(135deg, ${q.spiritColor}18, transparent)` }}>
            <motion.span className="text-4xl flex-shrink-0"
              animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              {q.spiritEmoji}
            </motion.span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: q.spiritColor }}>
                {q.spirit} says:
              </p>
              <p className="text-gray-200 text-sm leading-relaxed mt-1">{q.narrative}</p>
            </div>
          </div>

          <div className="px-6 pb-5">
            {/* Question */}
            <div className="my-4 p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <p className="text-white font-bold text-base">❓ {q.question}</p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-2 mb-4">
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect = i === q.correct;
                let bg = 'rgba(255,255,255,0.05)';
                let border = 'rgba(255,255,255,0.12)';
                let textColor = 'rgba(255,255,255,0.9)';
                if (answered) {
                  if (isCorrect)                  { bg = 'rgba(0,200,80,0.2)';  border = '#00C851'; textColor = '#00FF6A'; }
                  else if (isSelected && !isCorrect) { bg = 'rgba(255,68,68,0.2)'; border = '#FF4444'; textColor = '#FF8888'; }
                  else                            { bg = 'rgba(255,255,255,0.02)'; border = 'transparent'; textColor = 'rgba(255,255,255,0.25)'; }
                } else if (isSelected) {
                  bg = `${q.spiritColor}22`; border = q.spiritColor;
                }
                return (
                  <motion.button key={i}
                    onClick={() => !answered && setSelected(i)}
                    whileHover={!answered ? { scale: 1.01, x: 4 } : {}}
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    animate={answered && isSelected && !isCorrect ? { x: [-5, 5, -4, 4, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="py-3 px-4 rounded-2xl font-semibold text-sm text-left transition-all"
                    style={{ background: bg, border: `1.5px solid ${border}`, color: textColor }}>
                    <span className="mr-2 opacity-50">{['A', 'B', 'C', 'D'][i]}.</span>{opt}
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {feedback && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-2xl p-3 mb-4 text-center font-bold text-sm"
                  style={{
                    background: feedback === 'correct' ? 'rgba(0,200,80,0.15)' : 'rgba(255,100,0,0.15)',
                    border: `1px solid ${feedback === 'correct' ? '#00C851' : '#FF6400'}`,
                    color: feedback === 'correct' ? '#00FF6A' : '#FFA040',
                  }}>
                  {feedback === 'correct'
                    ? `☁️ CORRECT! ${q.reward} — The Cloud Spirits cheer! 🎉`
                    : `🌩️ "Not quite, explorer! Try again or use a clue!"`}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3">
              <ScienceClueBox question={q} questionIndex={currentQuestion} />
              {!answered ? (
                <motion.button onClick={handleConfirm} disabled={selected === null}
                  whileHover={selected !== null ? { scale: 1.05 } : {}}
                  whileTap={selected !== null ? { scale: 0.95 } : {}}
                  className="px-8 py-3 rounded-2xl font-black text-black text-sm disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)' }}>
                  🧪 Confirm!
                </motion.button>
              ) : feedback === 'wrong' ? (
                <button onClick={handleTryAgain}
                  className="px-6 py-3 rounded-2xl font-black text-sm"
                  style={{ background: 'rgba(255,100,0,0.2)', border: '1px solid #FF6400', color: '#FFA040' }}>
                  💪 Try Again
                </button>
              ) : null}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <style jsx>{`
        @keyframes flicker { 0%{transform:scale(1) rotate(-3deg)} 100%{transform:scale(1.1) rotate(3deg)} }
      `}</style>
    </div>
  );
}
