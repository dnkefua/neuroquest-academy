'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { MISSION_DIALOGUE } from '../data/pirateDialogue';
import { gameTTS } from '../../shared/tts';
import { MATH_QUESTS } from '../data/questData';

export default function MissionBriefing() {
  const { setScene, currentQuestId } = useGameStore();
  const currentQuest = MATH_QUESTS.find(q => q.id === currentQuestId) ?? MATH_QUESTS[0];
  const [lineIndex, setLineIndex] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [titleDone, setTitleDone] = useState(false);
  const [ttsOn, setTtsOn] = useState(true);

  function toggleTTS() {
    const on = gameTTS.toggle();
    setTtsOn(on);
  }

  // Title screen: wait for TTS to finish reading title before showing dialogue
  useEffect(() => {
    gameTTS.afterSpeak(
      'The Chronicles of NeuroQuest. A new adventure begins...',
      () => setTitleDone(true),
      2500,
    );
  }, []);

  // Dialogue: advance to next line only after TTS fully finishes reading current line
  useEffect(() => {
    if (!titleDone) return;
    if (lineIndex >= MISSION_DIALOGUE.length) {
      setShowCard(true);
      gameTTS.speak('Your mission briefing is ready. Press Begin Quest when you are ready!');
      return;
    }
    const line = MISSION_DIALOGUE[lineIndex - 1] ?? MISSION_DIALOGUE[0];
    gameTTS.afterSpeak(line, () => setLineIndex(i => i + 1), 3000);
  }, [lineIndex, titleDone]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full h-screen relative overflow-hidden flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #1a0533 0%, #0d1b2a 50%, #1a0a00 100%)' }}>

      {/* TTS toggle */}
      <button onClick={toggleTTS}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110"
        style={{ background: ttsOn ? 'rgba(62,207,178,0.25)' : 'rgba(255,255,255,0.1)', border: `1px solid ${ttsOn ? '#3ECFB2' : 'rgba(255,255,255,0.2)'}` }}
        title={ttsOn ? 'Turn off read-aloud' : 'Turn on read-aloud'}>
        {ttsOn ? '🔊' : '🔇'}
      </button>

      {/* Stars — deterministic */}
      <div className="absolute inset-0">
        {Array.from({ length: 80 }).map((_, i) => {
          const x = (i * 17.3 + 7) % 100;
          const y = (i * 13.7 + 11) % 60;
          const size = 1 + (i % 2);
          const opacity = 0.2 + (i % 5) * 0.1;
          const dur = 2 + (i % 3);
          const delay = (i % 6) * 0.5;
          return (
            <div key={i} className="absolute rounded-full bg-white"
              style={{ width: size, height: size, left: `${x}%`, top: `${y}%`, opacity, animation: `twinkle ${dur}s ease-in-out ${delay}s infinite` }} />
          );
        })}
      </div>

      {/* Castle silhouette background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center opacity-20 pointer-events-none">
        <div className="text-9xl">🏰</div>
        <p className="text-yellow-300 text-sm font-bold">YOUR CASTLE (Unfinished)</p>
      </div>

      {/* Title */}
      <AnimatePresence>
        {!titleDone && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center z-10">
            <motion.h1
              className="font-black text-5xl md:text-6xl mb-4"
              style={{ color: '#FFD700', textShadow: '0 0 30px rgba(255,215,0,0.6)', fontFamily: 'Georgia, serif' }}>
              ⚔️ THE CHRONICLES OF NEUROQUEST ⚔️
            </motion.h1>
            <motion.p className="text-yellow-400 text-lg" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
              A new adventure begins...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogue */}
      {titleDone && !showCard && (
        <div className="z-10 max-w-lg mx-auto text-center px-6">
          {/* Zara wizard avatar */}
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
            className="text-7xl mb-6 inline-block"
            style={{ filter: 'drop-shadow(0 0 20px #3ECFB2)' }}>
            🧙‍♀️
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div key={lineIndex}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="rounded-3xl p-6 mb-4"
              style={{ background: 'rgba(62,207,178,0.12)', border: '2px solid rgba(62,207,178,0.3)' }}>
              <p className="text-white text-lg font-medium leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                {MISSION_DIALOGUE[lineIndex - 1] ?? ''}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-4">
            {MISSION_DIALOGUE.map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full transition-all duration-300"
                style={{ background: i < lineIndex ? '#3ECFB2' : 'rgba(255,255,255,0.2)' }} />
            ))}
          </div>
        </div>
      )}

      {/* Mission card */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="z-10 max-w-md w-full mx-4 rounded-3xl p-7"
            style={{
              background: 'linear-gradient(135deg, rgba(15,12,41,0.95), rgba(26,5,51,0.95))',
              border: '2px solid rgba(255,215,0,0.5)',
              boxShadow: '0 0 60px rgba(255,215,0,0.2)',
            }}>
            <h2 className="text-center font-black text-2xl text-yellow-400 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
              {currentQuest.emoji} {currentQuest.briefingTitle}
            </h2>
            <p className="text-center text-xs text-yellow-300/70 mb-2">{currentQuest.briefingDescription}</p>
            <div className="w-full h-px bg-yellow-700/40 my-4" />
            {[
              ['🎯 OBJECTIVE', 'Collect 100 Gold Coins'],
              ['📚 SUBJECT', 'Mathematics — Grade 6 IB MYP'],
              ['📖 TOPIC', currentQuest.subtitle],
              ['📊 DIFFICULTY', currentQuest.difficulty],
              ['🏰 REWARD', `Quest Badge + ${currentQuest.locationType === 'boss' ? '500' : '100'} Bonus Coins`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center py-2">
                <span className="text-yellow-600 text-sm font-bold">{label}</span>
                <span className="text-white text-sm">{value}</span>
              </div>
            ))}
            <div className="w-full h-px bg-yellow-700/40 my-4" />
            <div className="flex gap-3 mt-2">
              <button onClick={() => { gameTTS.stop(); setScene('PIRATE_ENCOUNTER'); }}
                className="flex-1 py-4 rounded-2xl font-black text-black text-base transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  boxShadow: '0 0 20px rgba(255,215,0,0.5)',
                  animation: 'pulse-glow 2s ease-in-out infinite',
                }}>
                ⚔️ BEGIN QUEST
              </button>
              <button onClick={() => { gameTTS.stop(); setScene('QUEST_MAP'); }}
                className="px-5 py-4 rounded-2xl font-bold text-gray-400 text-sm border border-gray-600 hover:bg-white/5 transition-all">
                🗺️ Map
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes twinkle { 0%,100%{opacity:0.2} 50%{opacity:0.9} }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 20px rgba(255,215,0,0.4)} 50%{box-shadow:0 0 40px rgba(255,215,0,0.8)} }
      `}</style>
    </div>
  );
}
