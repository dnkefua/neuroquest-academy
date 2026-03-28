'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useScienceStore, getQuestById } from '../store/gameStore';
import { SCIENCE_MISSION_DIALOGUE } from '../data/scienceData';
import { gameAudio } from '../../shared/audio';
import { gameTTS, useTTSCleanup } from '../../shared/tts';

export default function ScienceMissionBriefing() {
  const setScene = useScienceStore(s => s.setScene);
  const currentQuestId = useScienceStore(s => s.currentQuestId);
  const currentGrade = useScienceStore(s => s.currentGrade);
  const router = useRouter();
  const quest = getQuestById(currentQuestId, currentGrade);
  const [lineIndex, setLineIndex] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [titleDone, setTitleDone] = useState(false);
  const [ttsOn, setTtsOn] = useState(gameTTS.enabled);
  const [musicOn, setMusicOn] = useState(true);

  // Cleanup TTS on unmount
  useTTSCleanup();

  function toggleTTS() { setTtsOn(gameTTS.toggle()); }
  function toggleMusic() { setMusicOn(gameAudio.toggle()); }

  useEffect(() => { gameAudio.startBackground('desert'); }, []);

  useEffect(() => {
    gameAudio.startBackground('desert');
    return () => gameAudio.stopBackground(); // Cleanup music on unmount
  }, []);

  // Title screen: wait for TTS to finish before showing dialogue
  useEffect(() => {
    const questTitle = quest?.title ?? 'Science Quest';
    const questSub = quest?.subtitle ?? 'A scientific adventure begins...';
    gameTTS.afterSpeak(
      `${questTitle}. ${questSub}`,
      () => setTitleDone(true),
      2800,
    );
    return () => gameTTS.stop(); // Cleanup on unmount
  }, [quest?.title, quest?.subtitle]);

  // Dialogue: advance only after TTS fully finishes reading each line
  useEffect(() => {
    if (!titleDone) return;
    if (lineIndex >= SCIENCE_MISSION_DIALOGUE.length) { setShowCard(true); return; }
    const currentLine = SCIENCE_MISSION_DIALOGUE[lineIndex];
    gameTTS.afterSpeak(currentLine ?? '', () => setLineIndex(i => i + 1), 3000);
  }, [lineIndex, titleDone]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(180deg, #1A6FA8 0%, #2196B0 30%, #E8A44A 70%, #C27B2A 100%)' }}>

      {/* Audio controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <button onClick={toggleMusic}
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110"
          style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${musicOn ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.2)'}`, color: musicOn ? '#FFD700' : 'rgba(255,255,255,0.3)' }}
          title={musicOn ? 'Mute music' : 'Unmute music'}>
          🎵
        </button>
        <button onClick={toggleTTS}
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110"
          style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${ttsOn ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.2)'}`, color: ttsOn ? '#38BDF8' : 'rgba(255,255,255,0.3)' }}
          title={ttsOn ? 'Turn off read-aloud' : 'Turn on read-aloud'}>
          {ttsOn ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Desert scene elements */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 0 }}>
        {/* Sand dunes */}
        <svg viewBox="0 0 800 160" className="w-full" preserveAspectRatio="none">
          <path d="M0,80 Q100,20 200,60 Q300,100 400,40 Q500,0 600,50 Q700,90 800,60 L800,160 L0,160 Z"
            fill="#E8C99A" />
          <path d="M0,100 Q150,50 300,80 Q450,110 600,70 Q700,50 800,80 L800,160 L0,160 Z"
            fill="#D4B07A" opacity={0.7} />
        </svg>
        {/* Palm trees */}
        {[120, 650].map((x, i) => (
          <div key={i} style={{ position: 'absolute', bottom: 55, left: x, fontSize: 40 }}>🌴</div>
        ))}
        {/* Oasis pool */}
        <div style={{ position: 'absolute', bottom: 70, left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{
            width: 80, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
            boxShadow: '0 0 20px rgba(56,189,248,0.4)',
          }} />
        </div>
        {/* Dry fountain */}
        <div style={{ position: 'absolute', bottom: 95, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <div style={{ fontSize: 32 }}>⛲</div>
          <div style={{
            fontSize: 10, color: '#8B4513', fontWeight: 700, background: 'rgba(255,255,255,0.8)',
            borderRadius: 8, padding: '2px 6px', marginTop: 2, whiteSpace: 'nowrap',
          }}>
            Needs: 4 Crystal Vials 💧
          </div>
        </div>
      </div>

      {/* Clouds with faces (Cloud Spirits) */}
      <div className="absolute top-8 w-full pointer-events-none" style={{ zIndex: 0 }}>
        {[
          { left: '5%', delay: 0, emoji: '😤' },
          { left: '30%', delay: 1, emoji: '😏' },
          { left: '60%', delay: 0.5, emoji: '😈' },
          { left: '82%', delay: 1.5, emoji: '🤨' },
        ].map((c, i) => (
          <motion.div key={i}
            className="absolute text-4xl select-none"
            style={{ left: c.left }}
            animate={{ x: [0, -8, 0], y: [0, -5, 0] }}
            transition={{ duration: 3 + i, delay: c.delay, repeat: Infinity, ease: 'easeInOut' }}>
            ☁️<span style={{ position: 'absolute', top: 6, left: 8, fontSize: 16 }}>{c.emoji}</span>
          </motion.div>
        ))}
      </div>

      {/* Title card */}
      <AnimatePresence>
        {!titleDone && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center z-10">
            <motion.h1 className="font-black text-4xl md:text-5xl mb-3"
              style={{ color: '#FFF', textShadow: '0 0 30px rgba(56,189,248,0.6)', fontFamily: 'Georgia, serif' }}>
              {quest?.emoji ?? '🔬'} {quest?.title ?? 'THE WATER CYCLE EXPEDITION'}
            </motion.h1>
            <motion.p className="text-sky-200 text-lg"
              animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
              {quest?.subtitle ?? 'A desert adventure begins...'}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogue phase */}
      {titleDone && !showCard && (
        <div className="z-10 max-w-lg mx-auto text-center px-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
            className="text-7xl mb-5 inline-block"
            style={{ filter: 'drop-shadow(0 0 16px #14B8A6)' }}>
            🧙‍♀️
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div key={lineIndex}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="rounded-3xl p-5 mb-4"
              style={{ background: 'rgba(14,165,233,0.15)', border: '2px solid rgba(56,189,248,0.35)', backdropFilter: 'blur(8px)' }}>
              <p className="text-white text-lg font-medium leading-relaxed">
                {SCIENCE_MISSION_DIALOGUE[lineIndex - 1] ?? ''}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-3">
            {SCIENCE_MISSION_DIALOGUE.map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full transition-all duration-300"
                style={{ background: i < lineIndex ? '#38BDF8' : 'rgba(255,255,255,0.2)' }} />
            ))}
          </div>
        </div>
      )}

      {/* Mission card */}
      <AnimatePresence>
        {showCard && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="z-10 max-w-md w-full mx-4 rounded-3xl p-7"
            style={{
              background: 'rgba(10,34,64,0.95)',
              border: '2px solid rgba(56,189,248,0.5)',
              boxShadow: '0 0 60px rgba(56,189,248,0.2)',
              backdropFilter: 'blur(12px)',
            }}>
            <h2 className="text-center font-black text-2xl text-sky-300 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
              {quest?.teacherEmoji ?? '🔬'} MISSION: {quest?.title?.toUpperCase() ?? 'THE WATER QUEST'}
            </h2>
            <div className="w-full h-px bg-sky-700/40 my-4" />
            {[
              ['🎯 OBJECTIVE', quest?.briefingDescription ?? 'Complete the quest challenges'],
              ['📚 SUBJECT',   'Science — IB MYP Grade 6'],
              ['📖 TOPIC',     quest?.subtitle ?? 'The Water Cycle'],
              ['🏆 REWARD',    `Earn coins + ${quest?.difficulty ?? 'Beginner'} Badge`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center py-2">
                <span className="text-sky-600 text-sm font-bold">{label}</span>
                <span className="text-white text-sm">{value}</span>
              </div>
            ))}
            <div className="w-full h-px bg-sky-700/40 my-4" />
            <div className="flex gap-3 mt-2">
              <button onClick={() => { gameAudio.playTransition(); setScene('CLOUD_TEACHING'); }}
                className="flex-1 py-4 rounded-2xl font-black text-black text-base transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)', boxShadow: '0 0 20px rgba(56,189,248,0.5)' }}>
                🧪 BEGIN EXPEDITION
              </button>
              <button onClick={() => setScene('QUEST_MAP')}
                className="px-5 py-4 rounded-2xl font-bold text-gray-400 text-sm border border-gray-600 hover:bg-white/5 transition-all">
                🗺️ Quests
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
