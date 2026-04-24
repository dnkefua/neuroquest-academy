'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ScienceLabStage from '@/components/lesson-stages/ScienceLabStage';
import { getGameQuestById } from '@/lib/questData';
import { gameAudio } from '../../shared/audio';
import { gameTTS, useTTSCleanup, useTTSSettings } from '../../shared/tts';
import TopicVisualizer from '../components/visualizers/TopicVisualizer';
import { useScienceStore } from '../store/gameStore';
import { generateTeachingPanels } from '../utils/teachingContent';
import { inferScienceLabMode } from '../utils/visualMappings';

export default function CloudSpiritTeaching() {
  const currentGrade = useScienceStore((s) => s.currentGrade);
  const currentQuestId = useScienceStore((s) => s.currentQuestId);
  const setScene = useScienceStore((s) => s.setScene);
  const { enabled: ttsOn } = useTTSSettings();

  const [panelIndex, setPanelIndex] = useState(0);
  const [musicOn, setMusicOn] = useState(true);

  useTTSCleanup();

  const quest = useMemo(() => getGameQuestById(currentQuestId) || null, [currentQuestId]);
  const panels = useMemo(() => generateTeachingPanels(quest), [quest]);
  const panel = panels[panelIndex];
  const isLast = panelIndex === panels.length - 1;
  const labMode = inferScienceLabMode(quest?.title || 'Science', undefined);

  useEffect(() => {
    if (!panel || !ttsOn) return;
    const shortSummary = panel.content.split('\n').filter(Boolean).slice(0, 2).join(' ');
    gameTTS.speak(`${panel.title}. ${shortSummary}`);
    return () => gameTTS.stop();
  }, [panel, ttsOn]);

  function toggleMusic() {
    setMusicOn(gameAudio.toggle());
  }

  function go(direction: 1 | -1) {
    gameAudio.playClick();
    setPanelIndex((value) => value + direction);
  }

  if (!panel) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#08131f]">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="relative flex h-dvh flex-col items-center overflow-hidden px-2 pb-2 pt-14 sm:px-4 sm:pb-4 sm:pt-16"
      style={{ background: 'linear-gradient(180deg, #08131f 0%, #0a1f33 54%, #08111b 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {['10%', '35%', '66%', '84%'].map((left, index) => (
          <motion.div
            key={left}
            className="absolute text-4xl opacity-10"
            style={{ top: `${12 + index * 18}%`, left }}
            animate={{ y: [0, -14, 0], x: [0, 12, 0] }}
            transition={{ duration: 7 + index, repeat: Infinity, ease: 'easeInOut' }}
          >
            {quest?.teacherEmoji || 'Lab'}
          </motion.div>
        ))}
      </div>

      <div className="absolute right-4 top-4 z-20">
        <button
          onClick={toggleMusic}
          className="rounded-full px-3 py-2 text-[11px] font-black tracking-[0.18em] text-white transition-all hover:scale-105"
          style={{
            background: musicOn ? 'rgba(56,189,248,0.18)' : 'rgba(255,255,255,0.08)',
            border: `1px solid ${musicOn ? '#38bdf8' : 'rgba(255,255,255,0.18)'}`,
          }}
        >
          MUSIC
        </button>
      </div>

      <div className="mb-2 flex flex-shrink-0 gap-2">
        {panels.map((_, index) => (
          <div
            key={index}
            className="h-2.5 w-2.5 rounded-full transition-all duration-300"
            style={{ background: index === panelIndex ? panel.color : 'rgba(255,255,255,0.18)' }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={panelIndex}
          initial={{ opacity: 0, x: 60, rotateY: -8 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.35, type: 'spring', damping: 22 }}
          className="z-10 grid min-h-0 w-full max-w-6xl flex-1 grid-rows-[minmax(0,0.54fr)_minmax(0,0.46fr)] gap-2 sm:grid-cols-[1.12fr_0.88fr] sm:grid-rows-1"
        >
          <div
            className="flex min-h-0 flex-col overflow-hidden rounded-[32px]"
            style={{
              background: 'linear-gradient(135deg, rgba(9,16,28,0.97), rgba(8,22,38,0.97))',
              border: `1px solid ${panel.color}55`,
              boxShadow: `0 0 40px ${panel.color}22`,
            }}
          >
            <div className="border-b border-white/8 px-3 py-2 sm:px-5 sm:py-4" style={{ background: `linear-gradient(135deg, ${panel.color}24, transparent)` }}>
              <div className="flex items-center gap-3 sm:gap-4">
                <motion.span
                  className="text-2xl sm:text-4xl"
                  animate={{ rotate: [0, -6, 6, 0], scale: [1, 1.06, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {panel.emoji}
                </motion.span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.24em]" style={{ color: panel.color }}>
                    {panel.character}
                  </p>
                  <p className="line-clamp-1 text-base font-black leading-tight text-white sm:text-xl">{panel.title}</p>
                </div>
              </div>
            </div>

            <div className="min-h-0 flex-1 p-2 sm:p-3">
              <ScienceLabStage
                title={quest?.title || panel.title}
                detail={panel.title}
                mode={labMode}
                accent={panel.color}
                className="h-full min-h-0"
                overlay="none"
              />
            </div>
          </div>

          <div className="grid min-h-0 grid-rows-[minmax(0,0.42fr)_minmax(0,0.58fr)] gap-2 sm:grid-rows-[minmax(0,0.45fr)_minmax(0,0.55fr)]">
            <div className="overflow-hidden rounded-[22px] border border-white/8 bg-white/[0.03] p-3 sm:rounded-[28px] sm:p-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400 sm:mb-2">Quick Brief</p>
              <p className="line-clamp-5 whitespace-pre-line text-xs leading-5 text-slate-100 sm:text-sm sm:leading-6">{panel.content}</p>
            </div>

            <div className="overflow-hidden rounded-[22px] border border-white/8 bg-white/[0.03] p-2 sm:rounded-[28px] sm:p-3">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400 sm:mb-2">Diagram</p>
              <div className="flex h-full items-center justify-center overflow-hidden rounded-2xl bg-slate-950/45 p-2 sm:p-3">
                <TopicVisualizer questTitle={quest?.title || 'Science'} highlightStage={panel.highlightStage} />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="z-10 mt-2 flex flex-shrink-0 gap-3 sm:mt-3 sm:gap-4">
        {panelIndex > 0 && (
          <button
            onClick={() => go(-1)}
            className="rounded-2xl border border-white/12 px-5 py-2.5 text-sm font-bold text-slate-300 transition-all hover:bg-white/5 sm:px-6 sm:py-3"
          >
            Back
          </button>
        )}
        <motion.button
          onClick={() => (isLast ? (gameAudio.playTransition(), setScene('SIMULATION')) : go(1))}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-2xl px-7 py-2.5 text-sm font-black text-slate-950 transition-all sm:px-8 sm:py-3"
          style={{ background: `linear-gradient(135deg, ${panel.color}, ${panel.color}cc)` }}
        >
          {isLast ? 'Launch Simulation' : 'Next'}
        </motion.button>
      </div>

      <div className="absolute bottom-3 left-3 z-10 hidden text-xs text-slate-500 sm:block">
        {quest?.title} - Grade {currentGrade}
      </div>
    </div>
  );
}
