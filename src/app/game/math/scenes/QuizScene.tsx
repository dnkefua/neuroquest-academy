'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import ClueBox from '../components/ui/ClueBox';
import GoldCounter from '../components/ui/GoldCounter';
import NumberLine from '../components/ui/NumberLine';
import { gameTTS } from '../../shared/tts';
import { useEconomyStore } from '@/store/economyStore';

const PIRATE_NAMES = ['Captain Plus', 'Navigator Minus', 'Jolly Zero', 'Parrot Pete', 'Gold-Eye Greta'];
const PIRATE_EMOJIS = ['🏴‍☠️', '🗺️', '🧭', '🦜', '🔭'];

export default function QuizScene() {
  const { questions, currentQuestion, score, goldCoins, answerQuestion, addGold, nextQuestion } = useGameStore();
  const { earnCoins } = useEconomyStore();
  const q = questions[currentQuestion];
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [shaking, setShaking] = useState(false);

  // Reset per question
  useEffect(() => {
    setSelected(null);
    setAnswered(false);
    setFeedback(null);
  }, [currentQuestion]);

  // Read question aloud
  useEffect(() => {
    const text = `${pirateName} says: ${q.narrative}. Question: ${q.question}. ${q.equation}.`;
    gameTTS.speak(text);
  }, [currentQuestion]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelect(i: number) {
    if (answered && i !== selected) return;
    if (answered && feedback === 'correct') return;
    setSelected(i);
  }

  function handleConfirm() {
    if (selected === null) return;
    const correct = selected === q.correct;
    setAnswered(true);
    setFeedback(correct ? 'correct' : 'wrong');
    answerQuestion(correct);
    if (correct) {
      addGold(20);
      earnCoins(30, 'g6-math-correct');  // MYP rate
      gameTTS.afterSpeak('Correct! Plus 20 Gold Coins! The pirates cheer!', () => nextQuestion(), 2500);
    } else {
      gameTTS.speak('Not quite! Try again, or check the clue for a hint.');
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }

  function handleTryAgain() {
    if (feedback === 'correct') return;
    // Wrong — reset selection but keep answered=false to allow retry
    setAnswered(false);
    setFeedback(null);
    setSelected(null);
  }

  const pirateName = PIRATE_NAMES[currentQuestion % PIRATE_NAMES.length];
  const pirateEmoji = PIRATE_EMOJIS[currentQuestion % PIRATE_EMOJIS.length];
  const [ttsOn, setTtsOn] = useState(gameTTS.enabled);

  function toggleTTS() {
    const on = gameTTS.toggle();
    setTtsOn(on);
  }

  return (
    <div className={`w-full min-h-screen flex flex-col items-center justify-center px-4 py-6 relative overflow-hidden ${shaking ? 'shake' : ''}`}
      style={{ background: 'linear-gradient(180deg, #0d0d1a 0%, #1a0533 100%)' }}>

      {/* Torches */}
      {[-1, 1].map(side => (
        <div key={side} className="absolute top-1/4 text-3xl"
          style={{ [side < 0 ? 'left' : 'right']: '3%', animation: 'flicker 0.5s ease-in-out infinite alternate' }}>
          🔥
        </div>
      ))}

      {/* TTS toggle */}
      <button onClick={toggleTTS}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110"
        style={{ background: ttsOn ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.1)', border: `1px solid ${ttsOn ? '#8B5CF6' : 'rgba(255,255,255,0.2)'}` }}
        title={ttsOn ? 'Turn off read-aloud' : 'Turn on read-aloud'}>
        {ttsOn ? '🔊' : '🔇'}
      </button>

      {/* HUD */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl mb-4 flex items-center justify-between px-4 py-2 rounded-2xl"
        style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,215,0,0.2)' }}>
        <GoldCounter coins={goldCoins} target={100} />
        <div className="text-center">
          <p className="text-xs text-gray-400">Question</p>
          <p className="font-black text-white text-lg">{currentQuestion + 1} / {questions.length}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Score</p>
          <p className="font-black text-green-400 text-lg">⭐ {score}/{questions.length}</p>
        </div>
      </motion.div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div key={currentQuestion}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: 'rgba(15,12,41,0.95)', border: '2px solid rgba(139,92,246,0.4)' }}>

          {/* Pirate narrator */}
          <div className="px-6 pt-5 pb-3 flex items-start gap-3"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), transparent)' }}>
            <span className="text-4xl flex-shrink-0">{pirateEmoji}</span>
            <div>
              <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">{pirateName} says:</p>
              <p className="text-gray-200 text-sm leading-relaxed mt-1">{q.narrative}</p>
            </div>
          </div>

          <div className="px-6 pb-5">
            {/* Question */}
            <div className="my-4 p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p className="text-white font-bold text-base mb-2">❓ {q.question}</p>
              <p className="font-mono text-yellow-400 text-xl font-black tracking-wider">{q.equation}</p>
            </div>

            {/* Number line preview */}
            <div className="rounded-xl p-2 mb-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <NumberLine start={q.numberLineStart} move={q.numberLineMove} move2={q.numberLineMove2} animate={answered && feedback === 'correct'} />
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3 mb-4">
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
                  bg = 'rgba(99,102,241,0.3)'; border = '#6366F1';
                }
                return (
                  <motion.button key={i}
                    onClick={() => !answered ? handleSelect(i) : undefined}
                    whileHover={!answered ? { scale: 1.03 } : {}}
                    whileTap={!answered ? { scale: 0.97 } : {}}
                    animate={answered && isSelected && !isCorrect ? { x: [-6, 6, -4, 4, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="py-4 px-3 rounded-2xl font-black text-2xl transition-all"
                    style={{ background: bg, border: `2px solid ${border}`, color: textColor }}>
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback banner */}
            <AnimatePresence>
              {feedback && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-2xl p-3 mb-4 text-center font-bold text-sm"
                  style={{
                    background: feedback === 'correct' ? 'rgba(0,200,80,0.2)' : 'rgba(255,100,0,0.2)',
                    border: `1px solid ${feedback === 'correct' ? '#00C851' : '#FF6400'}`,
                    color: feedback === 'correct' ? '#00FF6A' : '#FFA040',
                  }}>
                  {feedback === 'correct'
                    ? `⚓ CORRECT! +20 Gold Coins! 💰 The pirates cheer!`
                    : `🏴‍☠️ "ARRR! Let's try again, landlubber!" — Try another option, or check the clue!`}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom actions */}
            <div className="flex items-center justify-between gap-3">
              <ClueBox question={q} questionIndex={currentQuestion} />
              {!answered ? (
                <motion.button
                  onClick={handleConfirm}
                  disabled={selected === null}
                  whileHover={selected !== null ? { scale: 1.05 } : {}}
                  whileTap={selected !== null ? { scale: 0.95 } : {}}
                  className="px-8 py-3 rounded-2xl font-black text-black text-sm disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}>
                  ⚔️ Confirm!
                </motion.button>
              ) : feedback === 'wrong' ? (
                <button onClick={handleTryAgain}
                  className="px-6 py-3 rounded-2xl font-black text-sm"
                  style={{ background: 'rgba(255,100,0,0.3)', border: '1px solid #FF6400', color: '#FFA040' }}>
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
