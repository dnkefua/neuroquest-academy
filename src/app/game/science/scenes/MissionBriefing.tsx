'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CountdownBar from '../../shared/CountdownBar';
import { gameAudio } from '../../shared/audio';
import { gameTTS, useTTSCleanup, useTTSSettings } from '../../shared/tts';
import { getQuestById, useScienceStore } from '../store/gameStore';

function getScienceDialogue(
  quest: { title: string; locationName: string; subtitle: string } | null,
): string[] {
  const title = quest?.title || 'Science Quest';
  const location = quest?.locationName || 'the lab';
  const subtitle = quest?.subtitle || 'today’s concept';

  return [`Welcome to ${location}. We are opening a live lab on ${title} and ${subtitle.toLowerCase()} before your challenge starts.`];
}

export default function ScienceMissionBriefing() {
  const currentQuestId = useScienceStore((s) => s.currentQuestId);
  const currentGrade = useScienceStore((s) => s.currentGrade);
  const setScene = useScienceStore((s) => s.setScene);
  const quest = getQuestById(currentQuestId, currentGrade);
  const { enabled: ttsOn } = useTTSSettings();

  const [lineIndex, setLineIndex] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [musicOn, setMusicOn] = useState(true);

  useTTSCleanup();

  useEffect(() => {
    gameAudio.startBackground('adventure');
    return () => gameAudio.stopBackground();
  }, []);

  const missionDialogue = useMemo(
    () =>
      getScienceDialogue(
        quest
          ? {
              title: quest.title,
              locationName: quest.locationName,
              subtitle: quest.subtitle,
            }
          : null,
      ),
    [quest],
  );

  const activeLine = missionDialogue[Math.min(lineIndex, Math.max(missionDialogue.length - 1, 0))] ?? '';
  const teacherAvatar = quest?.teacherEmoji || 'Lab';

  useEffect(() => {
    if (!ttsOn) {
      setShowCard(true);
      return;
    }

    if (lineIndex >= missionDialogue.length) {
      setShowCard(true);
      return;
    }

    gameTTS.afterSpeak(missionDialogue[lineIndex], () => setLineIndex((value) => value + 1), 900);
    return () => gameTTS.stop();
  }, [lineIndex, missionDialogue, ttsOn]);

  function toggleMusic() {
    setMusicOn(gameAudio.toggle());
  }

  return (
    <div
      className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden px-3 py-3 pt-16"
      style={{ background: 'radial-gradient(circle at top, rgba(56,189,248,0.18), transparent 28%), linear-gradient(180deg, #071421 0%, #0c1f33 55%, #09111d 100%)' }}
    >
      <div className="absolute right-3 top-3 z-20 flex gap-2">
        <button
          onClick={toggleMusic}
          className="rounded-full px-3 py-2 text-[11px] font-black tracking-[0.18em] text-white transition-all hover:scale-105"
          style={{
            background: musicOn ? 'rgba(56,189,248,0.18)' : 'rgba(255,255,255,0.08)',
            border: `1px solid ${musicOn ? '#38bdf8' : 'rgba(255,255,255,0.18)'}`,
          }}
          title={musicOn ? 'Mute music' : 'Unmute music'}
        >
          MUSIC
        </button>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute inset-x-0 top-[18%] h-px bg-cyan-300/10" />
        <div className="absolute inset-x-0 top-[38%] h-px bg-cyan-300/10" />
        <div className="absolute inset-x-0 top-[58%] h-px bg-cyan-300/10" />
        <div className="absolute inset-x-0 top-[78%] h-px bg-cyan-300/10" />
        <div className="absolute bottom-0 left-[18%] top-0 w-px bg-cyan-300/10" />
        <div className="absolute bottom-0 left-[50%] top-0 w-px bg-cyan-300/10" />
        <div className="absolute bottom-0 left-[82%] top-0 w-px bg-cyan-300/10" />
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 w-[min(86vw,860px)] -translate-x-1/2">
        <div className="grid grid-cols-3 gap-2 opacity-45 sm:gap-4 sm:opacity-60">
          {['Classroom Pod', 'Lab Bench', 'Experiment Bay'].map((label) => (
            <div key={label} className="rounded-[20px] border border-cyan-300/10 bg-white/5 px-2 py-3 text-center backdrop-blur-sm sm:rounded-[28px] sm:px-4 sm:py-5">
              <div className="mx-auto mb-2 h-8 w-8 rounded-xl border border-cyan-300/15 bg-cyan-300/5 sm:mb-3 sm:h-14 sm:w-14 sm:rounded-2xl" />
              <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-cyan-100/65 sm:text-[11px] sm:tracking-[0.24em]">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {!showCard && (
        <div className="z-10 mx-auto max-w-xl px-3 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full border border-sky-300/25 bg-sky-300/10 text-3xl text-white shadow-[0_0_34px_rgba(56,189,248,0.22)]"
          >
            {teacherAvatar}
          </motion.div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-sky-200/70">
            {quest?.teacherName || 'Science Guide'}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={lineIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-3xl border border-sky-300/20 bg-slate-950/60 p-4 backdrop-blur-sm"
            >
              <p className="text-base font-medium leading-7 text-white">{activeLine}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-3 flex justify-center gap-2">
            {missionDialogue.map((_, index) => (
              <div
                key={index}
                className="h-2 w-2 rounded-full transition-all duration-300"
                style={{ background: index < lineIndex ? '#38bdf8' : 'rgba(255,255,255,0.18)' }}
              />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="z-10 mx-3 max-h-[calc(100dvh-6rem)] w-full max-w-md overflow-hidden rounded-3xl p-4 sm:p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(7,20,33,0.96), rgba(8,28,47,0.96))',
              border: '1px solid rgba(56,189,248,0.34)',
              boxShadow: '0 0 44px rgba(56,189,248,0.16)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <h2 className="mb-1 line-clamp-2 text-center text-xl font-black text-sky-300 sm:text-2xl">{quest?.title || 'Science Quest'}</h2>
            <p className="mb-2 line-clamp-2 text-center text-xs text-sky-100/70">
              {quest?.briefingDescription || 'Step into the lab and master the concept.'}
            </p>

            <div className="my-3 h-px w-full bg-sky-300/15" />

            {[
              ['Objective', quest?.briefingDescription || 'Complete the guided challenge'],
              ['Programme', `Grade ${currentGrade} science`],
              ['Topic', quest?.subtitle || quest?.title || 'Science'],
              ['Mode', '3D classroom, lab, and challenge sequence'],
              ['Reward', `Coins plus ${quest?.difficulty || 'Intermediate'} badge`],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-3 py-1.5">
                <span className="text-xs font-bold text-sky-200/70 sm:text-sm">{label}</span>
                <span className="line-clamp-2 max-w-[68%] text-right text-xs text-white sm:text-sm">{value}</span>
              </div>
            ))}

            <div className="my-3 h-px w-full bg-sky-300/15" />

            <CountdownBar seconds={2} color1="#38bdf8" color2="#0ea5e9" active={showCard} />

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => {
                  gameAudio.playTransition();
                  setScene('CONCEPT_INTRO');
                }}
                className="flex-1 rounded-2xl py-3 text-sm font-black text-slate-950 transition-all hover:scale-105 active:scale-95 sm:text-base"
                style={{ background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', boxShadow: '0 0 18px rgba(56,189,248,0.35)' }}
              >
                Preview Concept
              </button>
              <button
                onClick={() => setScene('QUEST_MAP')}
                className="rounded-2xl border border-white/12 px-4 py-3 text-sm font-bold text-slate-300 transition-all hover:bg-white/5"
              >
                Quests
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
