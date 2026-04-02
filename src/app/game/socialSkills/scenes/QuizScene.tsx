'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocialSkillsStore } from '../store/gameStore';
import { useProgressStore } from '@/store/progressStore';
import { useEconomyStore } from '@/store/economyStore';
import { gameTTS, useTTSCleanup, stripParens } from '../../shared/tts';
import { gameAudio } from '../../shared/audio';
import ConceptAnimation from '../../shared/ConceptAnimation';
import { getGameQuestById } from '@/lib/questData';

const C1 = '#EC4899', C2 = '#8B5CF6';

export default function QuizScene() {
  const { currentQuestion, questions, currentQuestId, score, clueUsed, answerQuestion, openClue, nextQuestion, setScene } = useSocialSkillsStore();
  const { earnCoins, spendCoins, walletCoins } = useEconomyStore();
  const { completeQuest } = useProgressStore();
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showClue, setShowClue] = useState(false);
  const [ttsOn, setTtsOn] = useState(gameTTS.enabled);

  useTTSCleanup();
  const question = questions[currentQuestion];
  const isLast = currentQuestion >= questions.length - 1;
  const quest = useMemo(() => getGameQuestById(currentQuestId), [currentQuestId]);

  useEffect(() => {
    setSelected(null);
    setShowResult(false);
    setShowClue(false);
  }, [currentQuestion]);

  useEffect(() => {
    if (!ttsOn || !question) return;
    gameTTS.speak(stripParens(question.question));
    return () => gameTTS.stop();
  }, [currentQuestion, ttsOn]);

  if (!question) return (
    <div className="h-dvh flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f0a1f, #1a0f2d)' }}>
      <p className="text-white">Loading…</p>
    </div>
  );

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
    if (isLast) { completeQuest(currentQuestId); earnCoins(100, 'quest_complete'); setScene('VICTORY'); }
    else nextQuestion();
  }

  function handleClue() {
    if (walletCoins >= question.clue.cost && !clueUsed[currentQuestion]) {
      spendCoins(question.clue.cost, 'socialSkills_clue');
      openClue(currentQuestion);
      setShowClue(true);
    }
  }

  return (
    <div className="h-dvh overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(160deg, #0f0a1f 0%, #1a0f2d 60%, #100a20 100%)' }}>

      {/* Compact header */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-1.5 border-b border-white/10"
        style={{ background: 'rgba(0,0,0,0.35)' }}>
        <button onClick={() => { gameTTS.stop(); setScene('QUEST_MAP'); }}
          className="text-xs font-bold text-gray-400 hover:text-white transition-all px-2 py-1 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.06)' }}>← Quit</button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">Score: <span className="text-white font-bold">{score}</span></span>
          <span className="text-xs font-bold" style={{ color: C1 }}>💰 {walletCoins}</span>
        </div>
        <button onClick={() => setTtsOn(gameTTS.toggle())}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${ttsOn ? C1 + '80' : 'rgba(255,255,255,0.15)'}` }}>
          {ttsOn ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex-shrink-0 px-4 pt-1.5 pb-0.5">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${C1}, ${C2})` }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
        </div>
        <p className="text-center text-white/40 text-[10px] mt-0.5">{currentQuestion + 1} / {questions.length}</p>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div key={currentQuestion}
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          className="flex-1 min-h-0 flex flex-col mx-3 mb-2 rounded-2xl overflow-hidden"
          style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${C1}30` }}>

          {/* Scrollable content */}
          <div className="flex-1 min-h-0 overflow-y-auto px-3 pt-2.5 pb-1">
            <ConceptAnimation subject="socialSkills" questTitle={quest?.title} color1={C1} color2={C2} />

            {question.narrative && (
              <p className="text-gray-300 text-xs mb-2 text-center italic line-clamp-2 leading-snug">
                "{question.narrative}"
              </p>
            )}

            <div className="mb-2.5 px-2 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <p className="text-white font-bold text-sm text-center leading-snug">{question.question}</p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-1.5">
              {question.options.map((opt, i) => {
                const isSel = selected === i, isCorr = i === question.correct;
                let bg = 'rgba(255,255,255,0.05)', border = 'rgba(255,255,255,0.1)', color = 'rgba(255,255,255,0.9)';
                if (showResult) {
                  if (isCorr)                { bg = 'rgba(34,197,94,0.2)';   border = '#22C55E'; color = '#86EFAC'; }
                  else if (isSel && !isCorr) { bg = 'rgba(239,68,68,0.2)';   border = '#EF4444'; color = '#FCA5A5'; }
                  else                       { bg = 'rgba(255,255,255,0.02)'; border = 'transparent'; color = 'rgba(255,255,255,0.25)'; }
                } else if (isSel) { bg = `${C1}22`; border = C1; }
                return (
                  <motion.button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
                    className="w-full py-2 px-3 rounded-xl text-left transition-all"
                    style={{ background: bg, border: `2px solid ${border}`, color }}
                    whileHover={selected === null ? { scale: 1.01, x: 2 } : {}}
                    whileTap={selected === null ? { scale: 0.98 } : {}}
                    animate={showResult && isSel && !isCorr ? { x: [-4, 4, -3, 3, 0] } : {}}
                    transition={{ duration: 0.3 }}>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0"
                        style={{ background: showResult && isCorr ? '#22C55E' : 'rgba(255,255,255,0.1)', color: showResult && isCorr ? '#000' : '#fff' }}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1 text-xs leading-snug">{opt}</span>
                      {showResult && isCorr && <span className="text-green-400 text-sm">✓</span>}
                      {showResult && isSel && !isCorr && <span className="text-red-400 text-sm">✗</span>}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Hint button */}
            {!showResult && !showClue && !clueUsed[currentQuestion] && (
              <div className="mt-2 text-center">
                <button onClick={handleClue} disabled={walletCoins < question.clue.cost}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold disabled:opacity-40 transition-all"
                  style={{ background: `${C1}18`, border: `1px solid ${C1}40`, color: C1 }}>
                  💡 Hint ({question.clue.cost} coins)
                </button>
              </div>
            )}
            <AnimatePresence>
              {showClue && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-2 p-3 rounded-xl"
                  style={{ background: `${C1}14`, border: `1px solid ${C1}40` }}>
                  <p className="font-bold text-xs mb-1" style={{ color: C1 }}>💡 {question.clue.title}</p>
                  <p className="text-gray-300 text-xs leading-snug">{question.clue.example}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pinned footer */}
          <div className="flex-shrink-0 px-3 pb-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <AnimatePresence>
              {showResult && selected === question.correct && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-lg px-3 py-1 mb-1.5 text-center text-xs font-bold overflow-hidden"
                  style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid #22C55E', color: '#86EFAC' }}>
                  ✨ Correct! +30 coins
                </motion.div>
              )}
              {showResult && selected !== question.correct && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-lg px-3 py-1 mb-1.5 text-center text-xs font-bold overflow-hidden"
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #EF4444', color: '#FCA5A5' }}>
                  💪 See the correct answer highlighted above
                </motion.div>
              )}
            </AnimatePresence>
            {showResult ? (
              <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                onClick={handleNext} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full py-2.5 rounded-xl font-bold text-white text-sm"
                style={{ background: `linear-gradient(135deg, ${C1}, ${C2})` }}>
                {isLast ? '🏆 Complete Quest' : 'Next Question →'}
              </motion.button>
            ) : (
              <p className="text-center text-white/25 text-xs py-2">Select an answer above</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
