'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocialStore } from '../store/gameStore';
import { useProgressStore } from '@/store/progressStore';
import { useEconomyStore } from '@/store/economyStore';
import { gameTTS, useTTSCleanup } from '../../shared/tts';
import { gameAudio } from '../../shared/audio';

const ACCENT = { color1: '#F59E0B', color2: '#EF4444' };

export default function QuizScene() {
  const { currentQuestion, questions, currentQuestId, score, clueUsed, answerQuestion, openClue, nextQuestion, setScene } = useSocialStore();
  const { earnCoins, spendCoins, walletCoins } = useEconomyStore();
  const { completeQuest } = useProgressStore();
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showClue, setShowClue] = useState(false);
  const [ttsOn, setTtsOn] = useState(gameTTS.enabled);

  useTTSCleanup();
  const question = questions[currentQuestion];
  const isLast = currentQuestion >= questions.length - 1;

  useEffect(() => {
    setSelected(null);
    setShowResult(false);
    setShowClue(false);
  }, [currentQuestion]);

  useEffect(() => {
    if (question) {
      gameTTS.speak(question.question);
      return () => gameTTS.stop();
    }
  }, [question]);

  if (!question) {
    return (
      <div className="h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0a1a0f 0%, #0d2815 100%)' }}>
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  function handleAnswer(index: number) {
    if (selected !== null) return;
    setSelected(index);
    const correct = index === question.correct;
    gameAudio.playClick();
    if (correct) { gameAudio.playCorrect(); earnCoins(30, 'correct_answer'); answerQuestion(true); }
    else { gameAudio.playWrong(); answerQuestion(false); }
    setShowResult(true);
  }

  function handleNext() {
    if (isLast) {
      completeQuest(currentQuestId);
      earnCoins(100, 'quest_complete');
      setScene('VICTORY');
    } else {
      nextQuestion();
    }
  }

  function handleClue() {
    if (walletCoins >= question.clue.cost && !clueUsed[currentQuestion]) {
      spendCoins(question.clue.cost, 'social_clue');
      openClue(currentQuestion);
      setShowClue(true);
    }
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(135deg, #0a1a0f 0%, #0d2815 100%)' }}>

      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b border-white/10"
        style={{ background: 'rgba(0,0,0,0.3)' }}>
        <button onClick={() => { gameTTS.stop(); setScene('QUEST_MAP'); }}
          className="text-sm font-bold text-gray-400 hover:text-white transition-all">← Quit</button>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">Score: {score}</span>
          <span className="text-xs text-amber-400">💰 {walletCoins}</span>
        </div>
        <button onClick={() => setTtsOn(gameTTS.toggle())}
          className="w-9 h-9 rounded-full flex items-center justify-center text-base"
          style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${ttsOn ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.15)'}` }}>
          {ttsOn ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex-shrink-0 px-4 py-1.5">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${ACCENT.color1}, ${ACCENT.color2})` }}
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
        </div>
        <p className="text-xs text-gray-400 text-center mt-0.5">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-2">
        <AnimatePresence mode="wait">
          <motion.div key={currentQuestion}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="w-full max-w-lg mx-auto pt-3">

            {question.narrative && (
              <p className="text-gray-300 text-sm mb-3 text-center italic">"{question.narrative}"</p>
            )}

            <h2 className="text-white font-bold text-lg mb-4 text-center">{question.question}</h2>

            {/* Options */}
            <div className="space-y-2">
              {question.options.map((option, index) => {
                const isSelected = selected === index;
                const isCorrect = index === question.correct;
                return (
                  <motion.button key={index} onClick={() => handleAnswer(index)}
                    disabled={selected !== null}
                    className="w-full p-3 rounded-xl text-left transition-all"
                    style={{
                      background: showResult ? isCorrect ? 'rgba(34,197,94,0.2)' : isSelected ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.05)',
                      border: `2px solid ${showResult ? isCorrect ? '#22C55E' : isSelected ? '#EF4444' : 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.1)'}`,
                    }}
                    whileHover={selected === null ? { scale: 1.02 } : {}}
                    whileTap={selected === null ? { scale: 0.98 } : {}}>
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                        style={{ background: showResult && isCorrect ? '#22C55E' : 'rgba(255,255,255,0.1)', color: showResult && isCorrect ? '#000' : '#fff' }}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1 text-white text-sm">{option}</span>
                      {showResult && isCorrect && <span>✓</span>}
                      {showResult && isSelected && !isCorrect && <span>✗</span>}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Clue hint button */}
            {!showResult && !showClue && !clueUsed[currentQuestion] && (
              <div className="mt-3 text-center">
                <button onClick={handleClue} disabled={walletCoins < question.clue.cost}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-amber-300 border border-amber-300/30 hover:bg-amber-300/10 transition-all disabled:opacity-50"
                  style={{ background: 'rgba(245,158,11,0.1)' }}>
                  💡 Hint ({question.clue.cost} coins)
                </button>
              </div>
            )}

            {/* Clue display */}
            {showClue && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 rounded-xl"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
                <p className="font-bold text-amber-300 text-sm mb-1">💡 {question.clue.title}</p>
                <p className="text-gray-300 text-sm">{question.clue.example}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pinned footer — Next always visible after answering */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <AnimatePresence>
          {showResult && (
            <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              onClick={handleNext}
              className="w-full py-3 rounded-xl font-bold text-white text-base"
              style={{ background: `linear-gradient(135deg, ${ACCENT.color1}, ${ACCENT.color2})` }}>
              {isLast ? 'Complete Quest 🏆' : 'Next Question →'}
            </motion.button>
          )}
          {!showResult && (
            <p className="text-center text-white/30 text-xs">Select an answer above</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
