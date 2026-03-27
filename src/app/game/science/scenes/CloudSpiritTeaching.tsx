'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScienceStore } from '../store/gameStore';
import { getGameQuestById } from '@/lib/questData';
import { generateTeachingPanels, type TeachingPanel } from '../utils/teachingContent';
import TopicVisualizer from '../components/visualizers/TopicVisualizer';
import { gameAudio } from '../../shared/audio';
import { gameTTS } from '../../shared/tts';

export default function CloudSpiritTeaching() {
  const setScene = useScienceStore(s => s.setScene);
  const currentQuestId = useScienceStore(s => s.currentQuestId);
  const currentGrade = useScienceStore(s => s.currentGrade);
  const [panelIndex, setPanelIndex] = useState(0);
  const [ttsOn, setTtsOn] = useState(gameTTS.enabled);
  const [musicOn, setMusicOn] = useState(true);

  // Get quest and generate panels dynamically
  const quest = useMemo(() => getGameQuestById(currentQuestId) || null, [currentQuestId]);
  const panels = useMemo(() => generateTeachingPanels(quest), [quest]);

  const panel = panels[panelIndex];
  const isLast = panelIndex === panels.length - 1;

  function toggleTTS() { setTtsOn(gameTTS.toggle()); }
  function toggleMusic() { setMusicOn(gameAudio.toggle()); }

  // Read panel content aloud when it changes
  useEffect(() => {
    if (panel) {
      gameTTS.speak(`${panel.title}. ${panel.content}`);
    }
  }, [panelIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  function go(dir: 1 | -1) {
    gameAudio.playClick();
    setPanelIndex(i => i + dir);
  }

  if (!panel) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #0c1a2e 0%, #0d2137 50%, #0a1a0d 100%)' }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-8"
      style={{ background: 'linear-gradient(180deg, #0c1a2e 0%, #0d2137 50%, #0a1a0d 100%)' }}>

      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {['-20%', '15%', '50%', '75%'].map((left, i) => (
          <motion.div key={i} className="absolute text-5xl opacity-10"
            style={{ top: `${10 + i * 18}%`, left }}
            animate={{ x: [0, 30, 0] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }}>
            {quest?.teacherEmoji || '🔬'}
          </motion.div>
        ))}
      </div>

      {/* Audio controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <button onClick={toggleMusic}
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg hover:scale-110 transition-all"
          style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${musicOn ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.15)'}`, color: musicOn ? '#FFD700' : 'rgba(255,255,255,0.3)' }}>
          🎵
        </button>
        <button onClick={toggleTTS}
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg hover:scale-110 transition-all"
          style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${ttsOn ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.15)'}`, color: ttsOn ? '#38BDF8' : 'rgba(255,255,255,0.3)' }}>
          {ttsOn ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Panel progress dots */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {panels.map((_, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{ background: i === panelIndex ? panel.color : 'rgba(255,255,255,0.18)' }} />
        ))}
      </div>

      {/* Comic panel */}
      <AnimatePresence mode="wait">
        <motion.div key={panelIndex}
          initial={{ opacity: 0, x: 60, rotateY: -12 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.35, type: 'spring', damping: 22 }}
          className="w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(18,14,45,0.97), rgba(8,20,35,0.97))',
            border: `3px solid ${panel.color}`,
            boxShadow: `0 0 40px ${panel.color}44`,
          }}>

          {/* Header */}
          <div className="px-6 py-4 flex items-center gap-4"
            style={{ background: `linear-gradient(135deg, ${panel.color}30, transparent)` }}>
            <motion.span className="text-5xl"
              animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}>
              {panel.emoji}
            </motion.span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60" style={{ color: panel.color }}>
                {panel.character}
              </p>
              <p className="font-black text-white text-lg leading-tight">{panel.title}</p>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 pb-6">
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line mb-4 mt-3">
              {panel.content}
            </p>

            {/* Topic visualizer */}
            {panel.visual && (
              <div className="rounded-2xl p-3 mb-2 flex justify-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <TopicVisualizer
                  questTitle={quest?.title || 'Science'}
                  highlightStage={panel.highlightStage}
                />
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-4 mt-6 z-10">
        {panelIndex > 0 && (
          <button onClick={() => go(-1)}
            className="px-6 py-3 rounded-2xl font-bold text-gray-400 border border-gray-600 hover:bg-white/5 transition-all">
            ← Back
          </button>
        )}
        <motion.button
          onClick={() => isLast ? (gameAudio.playTransition(), setScene('QUIZ')) : go(1)}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="px-8 py-3 rounded-2xl font-black text-black transition-all"
          style={{ background: `linear-gradient(135deg, ${panel.color}, ${panel.color}CC)` }}>
          {isLast ? '🧪 Take the Quiz!' : 'Next →'}
        </motion.button>
      </div>

      {/* Quest info */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500 z-10">
        {quest?.title} • Grade {currentGrade}
      </div>
    </div>
  );
}