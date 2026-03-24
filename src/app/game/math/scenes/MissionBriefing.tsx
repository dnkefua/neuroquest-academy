'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, getQuestById } from '../store/gameStore';
import { gameTTS } from '../../shared/tts';

// Grade display info
const GRADE_INFO: Record<number, { programme: string; topic: string }> = {
  1: { programme: 'PYP', topic: 'Counting & Numbers' },
  2: { programme: 'PYP', topic: 'Place Value & Operations' },
  3: { programme: 'PYP', topic: 'Multiplication & Division' },
  4: { programme: 'PYP', topic: 'Decimals & Geometry' },
  5: { programme: 'PYP', topic: 'Fractions & Data' },
  6: { programme: 'MYP', topic: 'Integers & Negative Numbers' },
  7: { programme: 'MYP', topic: 'Fractions & Percents' },
  8: { programme: 'MYP', topic: 'Ratios & Geometry' },
  9: { programme: 'MYP', topic: 'Algebra & Pythagoras' },
  10: { programme: 'MYP', topic: 'Quadratic Equations' },
  11: { programme: 'DP', topic: 'Functions & Calculus' },
  12: { programme: 'DP', topic: 'Advanced Mathematics' },
};

// Generate dynamic dialogue based on quest info
const getQuestDialogue = (quest: { title: string; locationName: string; theme: string; teacherName: string; teacherEmoji: string } | null, grade: number): string[] => {
  const location = quest?.locationName || 'the Number Kingdom';
  const theme = quest?.theme || 'mathematics';
  const teacher = quest?.teacherName || 'Zara the Wise';
  const teacherEmoji = quest?.teacherEmoji || '🧙‍♀️';

  // Grade-specific opening dialogue
  const gradeGreetings: Record<number, string> = {
    1: "Welcome, young Number Seed! 🌱",
    2: "Greetings, Village Scout! 🏘️",
    3: "Welcome, Forest Ranger! 🌲",
    4: "Hail, Ocean Guardian! 🌊",
    5: "Welcome, City Builder! 🏙️",
    6: "Greetings, Dungeon Seeker! ⚔️",
    7: "Welcome, Time Traveller! ⏳",
    8: "Hail, Master Artisan! 🎨",
    9: "Greetings, Tech Wizard! 🔬",
    10: "Welcome, World Diplomat! 🌍",
    11: "Hail, Grand Sage! 📜",
    12: "Welcome, Champion Wizard Warrior! 🏆",
  };

  return [
    `${gradeGreetings[grade] || 'Welcome, brave explorer!'} I am ${teacher} ${teacherEmoji}`,
    `You have entered ${location}...`,
    `Here, you will master: ${theme}!`,
    "Your quest is to collect Gold Coins by solving challenges! 💰",
    "Each correct answer brings you closer to victory!",
    "Are you ready to begin? ⚔️",
  ];
};

export default function MissionBriefing() {
  const { setScene, currentQuestId, currentGrade } = useGameStore();
  const currentQuest = getQuestById(currentQuestId, currentGrade);
  const gradeInfo = GRADE_INFO[currentGrade] || { programme: 'IB', topic: 'Mathematics' };
  const [lineIndex, setLineIndex] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [titleDone, setTitleDone] = useState(false);
  const [ttsOn, setTtsOn] = useState(true);

  // Set grade for TTS voice selection
  useEffect(() => {
    gameTTS.setGrade(currentGrade);
  }, [currentGrade]);

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

  // Get grade-appropriate dialogue
  const questInfo = currentQuest ? {
    title: currentQuest.title,
    locationName: currentQuest.locationName,
    theme: currentQuest.theme,
    teacherName: currentQuest.teacherName,
    teacherEmoji: currentQuest.teacherEmoji,
  } : null;
  const missionDialogue = getQuestDialogue(questInfo, currentGrade);

  // Dialogue: advance to next line only after TTS fully finishes reading current line
  useEffect(() => {
    if (!titleDone) return;
    if (lineIndex >= missionDialogue.length) {
      setShowCard(true);
      gameTTS.speak('Your mission briefing is ready. Press Begin Quest when you are ready!');
      return;
    }
    const line = missionDialogue[lineIndex - 1] ?? missionDialogue[0];
    gameTTS.afterSpeak(line, () => setLineIndex(i => i + 1), 3000);
  }, [lineIndex, titleDone, missionDialogue]); // eslint-disable-line react-hooks/exhaustive-deps

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
                {missionDialogue[lineIndex - 1] ?? ''}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-4">
            {missionDialogue.map((_, i) => (
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
              {currentQuest?.emoji || '⚔️'} {currentQuest?.briefingTitle || 'Math Quest'}
            </h2>
            <p className="text-center text-xs text-yellow-300/70 mb-2">{currentQuest?.briefingDescription || `Complete this ${gradeInfo.topic} challenge!`}</p>
            <div className="w-full h-px bg-yellow-700/40 my-4" />
            {[
              ['🎯 OBJECTIVE', 'Collect 100 Gold Coins'],
              ['📚 PROGRAMME', `Grade ${currentGrade} — ${gradeInfo.programme}`],
              ['📖 TOPIC', currentQuest?.theme || currentQuest?.subtitle || gradeInfo.topic],
              ['📊 DIFFICULTY', currentQuest?.difficulty || 'Beginner'],
              ['🏰 REWARD', `Quest Badge + ${currentQuest?.locationType === 'boss' ? '500' : '100'} Bonus Coins`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center py-2">
                <span className="text-yellow-600 text-sm font-bold">{label}</span>
                <span className="text-white text-sm">{value}</span>
              </div>
            ))}
            <div className="w-full h-px bg-yellow-700/40 my-4" />
            <div className="flex gap-3 mt-2">
              <button onClick={() => { gameTTS.stop(); setScene(currentGrade === 6 ? 'PIRATE_ENCOUNTER' : 'QUIZ'); }}
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
