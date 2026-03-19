'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { PIRATE_PANELS } from '../data/pirateDialogue';
import NumberLine from '../components/ui/NumberLine';
import { gameTTS } from '../../shared/tts';

export default function PirateEncounter() {
  const setScene = useGameStore(s => s.setScene);
  const [panelIndex, setPanelIndex] = useState(0);
  const [ttsOn, setTtsOn] = useState(gameTTS.enabled);
  const panel = PIRATE_PANELS[panelIndex];
  const isLast = panelIndex === PIRATE_PANELS.length - 1;

  // Read panel aloud whenever it changes
  useEffect(() => {
    const text = `${panel.title}. ${panel.content.replace(/\n/g, '. ')}`;
    gameTTS.speak(text);
  }, [panelIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleTTS() {
    const on = gameTTS.toggle();
    setTtsOn(on);
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-8"
      style={{ background: 'linear-gradient(180deg, #1a0a00 0%, #0d0d1a 50%, #0a1a0a 100%)' }}>

      {/* TTS toggle */}
      <button onClick={toggleTTS}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110"
        style={{ background: ttsOn ? 'rgba(192,57,43,0.25)' : 'rgba(255,255,255,0.1)', border: `1px solid ${ttsOn ? '#C0392B' : 'rgba(255,255,255,0.2)'}` }}
        title={ttsOn ? 'Turn off read-aloud' : 'Turn on read-aloud'}>
        {ttsOn ? '🔊' : '🔇'}
      </button>

      {/* Torch flames */}
      {[-1, 1].map(side => (
        <div key={side} className="absolute top-1/3 text-4xl"
          style={{ [side < 0 ? 'left' : 'right']: '5%', animation: 'flicker 0.5s ease-in-out infinite alternate' }}>
          🔥
        </div>
      ))}

      {/* Scene counter */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2">
        {PIRATE_PANELS.map((_, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full transition-all"
            style={{ background: i === panelIndex ? panel.color : 'rgba(255,255,255,0.2)' }} />
        ))}
      </div>

      {/* Comic panel */}
      <AnimatePresence mode="wait">
        <motion.div key={panelIndex}
          initial={{ opacity: 0, x: 60, rotateY: -15 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.4, type: 'spring', damping: 25 }}
          className="w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(20,15,40,0.97), rgba(10,8,25,0.97))',
            border: `3px solid ${panel.color}`,
            boxShadow: `0 0 40px ${panel.color}44`,
          }}>

          {/* Panel header */}
          <div className="px-6 py-4 flex items-center gap-4"
            style={{ background: `linear-gradient(135deg, ${panel.color}33, transparent)` }}>
            <span className="text-5xl">{panel.emoji}</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-70" style={{ color: panel.color }}>
                {panel.character}
              </p>
              <p className="font-black text-white text-lg leading-tight">{panel.title}</p>
            </div>
          </div>

          {/* Panel body */}
          <div className="px-6 pb-6">
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line mb-4 mt-2">
              {panel.content}
            </p>

            {/* Number line visuals */}
            {panel.visual === 'numberline' && (
              <div className="rounded-2xl p-3 mb-4"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <NumberLine start={0} move={0} animate={false} />
              </div>
            )}
            {(panel.visual === 'example_pos' || panel.visual === 'example_neg') && (
              <div className="rounded-2xl p-3 mb-4"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <NumberLine
                  start={(panel as { exampleStart: number }).exampleStart}
                  move={(panel as { exampleMove: number }).exampleMove}
                  animate={true}
                />
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-4 mt-6">
        {panelIndex > 0 && (
          <button onClick={() => setPanelIndex(i => i - 1)}
            className="px-6 py-3 rounded-2xl font-bold text-gray-400 border border-gray-600 hover:bg-white/5 transition-all">
            ← Back
          </button>
        )}
        <motion.button
          onClick={() => { if (isLast) { gameTTS.stop(); setScene('QUIZ'); } else setPanelIndex(i => i + 1); }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="px-8 py-3 rounded-2xl font-black text-black transition-all"
          style={{ background: `linear-gradient(135deg, ${panel.color}, ${panel.color}CC)` }}>
          {isLast ? '⚔️ Face the Quiz!' : 'Next →'}
        </motion.button>
      </div>

      <style jsx>{`
        @keyframes flicker { 0%{transform:scale(1) rotate(-3deg)} 100%{transform:scale(1.1) rotate(3deg)} }
      `}</style>
    </div>
  );
}
