'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEnglishStore } from '../store/gameStore';
import { useProgressStore } from '@/store/progressStore';
import { useEconomyStore } from '@/store/economyStore';
import { gameTTS } from '../../shared/tts';
import { gameAudio } from '../../shared/audio';

export default function QuizScene() {
  const {
    currentQuestion,
    questions,
    currentQuestId,
    score,
    clueUsed,
    answerQuestion,
    openClue,
    nextQuestion,
    setScene
  } = useEnglishStore();

  const { earnCoins, spendCoins, walletCoins } = useEconomyStore();
  const { completeQuest } = useProgressStore();

  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showClue, setShowClue] = useState(false);
  const [ttsOn, setTtsOn] = useState(gameTTS.enabled);

  const question = questions[currentQuestion];
  const questQuestions = questions;

  useEffect(() => {
    if (question) {
      gameTTS.speak(question.question);
    }
  }, [question]);

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1f1400 0%, #2d1f00 100%)' }}>
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    const correct = index === question.correct;

    gameAudio.playClick();

    if (correct) {
      gameAudio.playCorrect();
      earnCoins(30, 'correct_answer');
      answerQuestion(true);
    } else {
      gameAudio.playWrong();
      answerQuestion(false);
    }

    setShowResult(true);
  };

  const handleNext = () => {
    setSelected(null);
    setShowResult(false);
    setShowClue(false);

    if (currentQuestion >= questQuestions.length - 1) {
      // Quest complete
      completeQuest(currentQuestId);
      earnCoins(100, 'quest_complete'); // Bonus for completing quest
      setScene('VICTORY');
    } else {
      nextQuestion();
    }
  };

  const handleClue = () => {
    if (walletCoins >= question.clue.cost && !clueUsed[currentQuestion]) {
      spendCoins(question.clue.cost, 'english_clue');
      openClue(currentQuestion);
      setShowClue(true);
    }
  };

  const progress = ((currentQuestion + 1) / questQuestions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(135deg, #1f1400 0%, #2d1f00 100%)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10"
        style={{ background: 'rgba(0,0,0,0.3)' }}>
        <button onClick={() => { gameTTS.stop(); setScene('QUEST_MAP'); }}
          className="text-sm font-bold text-gray-400 hover:text-white transition-all">
          ← Quit
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">Score: {score}</span>
          <span className="text-sm text-amber-400">💰 {walletCoins}</span>
        </div>
        <button onClick={() => setTtsOn(gameTTS.toggle())}
          className="w-9 h-9 rounded-full flex items-center justify-center text-base"
          style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${ttsOn ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.15)'}` }}>
          {ttsOn ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 py-2">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #F59E0B, #EF4444)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 text-center mt-1">
          Question {currentQuestion + 1} of {questQuestions.length}
        </p>
      </div>

      {/* Question */}
      <div className="flex-1 px-4 py-6 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="w-full max-w-lg">

            {/* Narrative */}
            {question.narrative && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-300 text-sm mb-4 text-center italic">
                "{question.narrative}"
              </motion.p>
            )}

            {/* Question text */}
            <h2 className="text-white font-bold text-xl mb-6 text-center">
              {question.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selected === index;
                const isCorrect = index === question.correct;
                const showCorrectness = showResult && isSelected;

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selected !== null}
                    className="w-full p-4 rounded-xl text-left transition-all"
                    style={{
                      background: showResult
                        ? isCorrect ? 'rgba(34,197,94,0.2)' : isSelected ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)'
                        : 'rgba(255,255,255,0.05)',
                      border: `2px solid ${showResult
                        ? isCorrect ? '#22C55E' : isSelected ? '#EF4444' : 'rgba(255,255,255,0.1)'
                        : 'rgba(255,255,255,0.1)'}`,
                    }}
                    whileHover={selected === null ? { scale: 1.02 } : {}}
                    whileTap={selected === null ? { scale: 0.98 } : {}}>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{
                          background: showResult && isCorrect ? '#22C55E' : 'rgba(255,255,255,0.1)',
                          color: showResult && isCorrect ? '#000' : '#fff'
                        }}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1 text-white">{option}</span>
                      {showResult && isCorrect && <span className="text-xl">✓</span>}
                      {showResult && isSelected && !isCorrect && <span className="text-xl">✗</span>}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Clue button */}
            {!showResult && !showClue && !clueUsed[currentQuestion] && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center">
                <button
                  onClick={handleClue}
                  disabled={walletCoins < question.clue.cost}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-amber-300 border border-amber-300/30 hover:bg-amber-300/10 transition-all disabled:opacity-50"
                  style={{ background: 'rgba(245,158,11,0.1)' }}>
                  💡 Get Hint ({question.clue.cost} coins)
                </button>
              </motion.div>
            )}

            {/* Clue display */}
            {showClue && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
                <p className="font-bold text-amber-300 text-sm mb-1">💡 {question.clue.title}</p>
                <p className="text-gray-300 text-sm whitespace-pre-line">{question.clue.example}</p>
              </motion.div>
            )}

            {/* Result and Next button */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6">
                <button
                  onClick={handleNext}
                  className="w-full py-4 rounded-xl font-bold text-white text-lg"
                  style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>
                  {currentQuestion >= questQuestions.length - 1 ? 'Complete Quest →' : 'Next Question →'}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}