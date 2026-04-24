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
    <div className="grid h-dvh w-full grid-rows-[auto_minmax(0,1fr)_auto] items-center overflow-hidden px-3 pb-3 pt-14 sm:px-4 sm:pb-4 sm:pt-14"
      style={{ background: 'linear-gradient(180deg, #1a0a00 0%, #0d0d1a 50%, #0a1a0a 100%)' }}>

      {/* TTS toggle */}
      <button onClick={toggleTTS}
        className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full text-lg transition-all hover:scale-110"
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
      <div className="relative z-10 flex justify-center gap-2">
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
          className="my-3 flex max-h-full min-h-0 w-full max-w-[min(92vw,680px)] flex-col overflow-hidden rounded-3xl shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(20,15,40,0.97), rgba(10,8,25,0.97))',
            border: `3px solid ${panel.color}`,
            boxShadow: `0 0 40px ${panel.color}44`,
          }}>

          {/* Panel header */}
          <div className="flex flex-shrink-0 items-center gap-3 px-4 py-3 sm:px-5"
            style={{ background: `linear-gradient(135deg, ${panel.color}33, transparent)` }}>
            <span className="text-3xl sm:text-4xl">{panel.emoji}</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-70" style={{ color: panel.color }}>
                {panel.character}
              </p>
              <p className="text-base font-black leading-tight text-white sm:text-lg">{panel.title}</p>
            </div>
          </div>

          {/* Panel body */}
          <div className="min-h-0 flex-1 px-4 pb-4 sm:px-5">
            <p className="mb-3 mt-2 whitespace-pre-line text-xs leading-5 text-gray-300 sm:text-sm sm:leading-6">
              {panel.content}
            </p>

            {/* Number line visuals */}
            {panel.visual === 'numberline' && (
              <div className="mb-2 rounded-2xl p-2 sm:p-3"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <NumberLine start={0} move={0} animate={false} />
              </div>
            )}
            {(panel.visual === 'example_pos' || panel.visual === 'example_neg') && (
              <div className="mb-2 rounded-2xl p-2 sm:p-3"
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
      <div className="relative z-10 flex flex-shrink-0 gap-3">
        {panelIndex > 0 && (
          <button onClick={() => setPanelIndex(i => i - 1)}
            className="rounded-2xl border border-gray-600 px-5 py-2.5 text-sm font-bold text-gray-400 transition-all hover:bg-white/5 sm:px-6 sm:py-3">
            ← Back
          </button>
        )}
        <motion.button
          onClick={() => { if (isLast) { gameTTS.stop(); setScene('QUIZ'); } else setPanelIndex(i => i + 1); }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="rounded-2xl px-7 py-2.5 text-sm font-black text-black transition-all sm:px-8 sm:py-3"
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
