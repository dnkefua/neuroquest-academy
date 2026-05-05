'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CountdownBar from '../../shared/CountdownBar';
import { gameTTS, useTTSCleanup, useTTSSettings } from '../../shared/tts';
import { getQuestById, useGameStore } from '../store/gameStore';
import { useProgressStore } from '@/store/progressStore';

const GRADE_INFO: Record<number, { programme: string; topic: string }> = {
  1: { programme: 'PYP', topic: 'Counting and Numbers' },
  2: { programme: 'PYP', topic: 'Place Value and Operations' },
  3: { programme: 'PYP', topic: 'Multiplication and Division' },
  4: { programme: 'PYP', topic: 'Decimals and Geometry' },
  5: { programme: 'PYP', topic: 'Fractions and Data' },
  6: { programme: 'MYP', topic: 'Integers and Negative Numbers' },
  7: { programme: 'MYP', topic: 'Fractions and Percents' },
  8: { programme: 'MYP', topic: 'Ratios and Geometry' },
  9: { programme: 'MYP', topic: 'Algebra and Pythagoras' },
  10: { programme: 'MYP', topic: 'Quadratic Equations' },
  11: { programme: 'DP', topic: 'Functions and Calculus' },
  12: { programme: 'DP', topic: 'Advanced Mathematics' },
};

function getQuestDialogue(
  quest: { locationName: string; theme: string } | null,
): string[] {
  const location = quest?.locationName || 'the Number Kingdom';
  const theme = quest?.theme || 'mathematics';
  return [`Welcome to ${location}. We are training ${theme} with one fast demo and a short challenge.`];
}

export default function MissionBriefing() {
  const { currentGrade, currentQuestId, setScene } = useGameStore();
  const userName = useProgressStore((s) => s.userName);
  const currentQuest = getQuestById(currentQuestId, currentGrade);
  const gradeInfo = GRADE_INFO[currentGrade] || { programme: 'IB', topic: 'Mathematics' };
  const { enabled: ttsOn } = useTTSSettings();

  const [lineIndex, setLineIndex] = useState(0);
  const [showCard, setShowCard] = useState(false);

  useTTSCleanup();

  useEffect(() => {
    gameTTS.setGrade(currentGrade);
    gameTTS.setUserName(userName);
  }, [currentGrade, userName]);

  const missionDialogue = useMemo(
    () =>
      getQuestDialogue(
        currentQuest
          ? {
              locationName: currentQuest.locationName,
              theme: currentQuest.theme,
            }
          : null,
      ),
    [currentQuest],
  );

  const activeLine = missionDialogue[Math.min(lineIndex, Math.max(missionDialogue.length - 1, 0))] ?? '';
  const teacherAvatar = currentQuest?.teacherEmoji && currentQuest.teacherEmoji !== '8'
    ? currentQuest.teacherEmoji
    : 'Guide';

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

  return (
    <div
      className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden px-3 py-3 pt-16"
      style={{ background: 'linear-gradient(180deg, #0b1220 0%, #111c32 56%, #1d0f1f 100%)' }}
    >
      <div className="absolute inset-0">
        {Array.from({ length: 72 }).map((_, index) => {
          const x = (index * 17.3 + 7) % 100;
          const y = (index * 13.7 + 11) % 62;
          const size = 1 + (index % 2);
          const opacity = 0.18 + (index % 5) * 0.08;
          const duration = 2 + (index % 3);
          const delay = (index % 6) * 0.45;
          return (
            <div
              key={index}
              className="absolute rounded-full bg-white"
              style={{
                width: size,
                height: size,
                left: `${x}%`,
                top: `${y}%`,
                opacity,
                animation: `twinkle ${duration}s ease-in-out ${delay}s infinite`,
              }}
            />
          );
        })}
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[42%] bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0),rgba(10,15,25,0.94))]" />
      <div className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 text-center opacity-25">
        <div className="mx-auto mb-3 h-16 w-40 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-sm" />
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200/70">Math Academy</p>
      </div>

      {!showCard && (
        <div className="z-10 mx-auto max-w-lg px-3 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 text-3xl text-white shadow-[0_0_30px_rgba(34,211,238,0.18)]"
          >
            {teacherAvatar}
          </motion.div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-cyan-200/70">
            {currentQuest?.teacherName || 'Math Guide'}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={lineIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-3 rounded-3xl p-4"
              style={{ background: 'rgba(17,24,39,0.72)', border: '1px solid rgba(34,211,238,0.2)' }}
            >
              <p className="text-base font-medium leading-7 text-white">{activeLine}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex justify-center gap-2">
            {missionDialogue.map((_, index) => (
              <div
                key={index}
                className="h-2 w-2 rounded-full transition-all duration-300"
                style={{ background: index < lineIndex ? '#22d3ee' : 'rgba(255,255,255,0.18)' }}
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
              background: 'linear-gradient(135deg, rgba(9,14,26,0.96), rgba(25,18,46,0.96))',
              border: '1px solid rgba(250,204,21,0.4)',
              boxShadow: '0 0 40px rgba(250,204,21,0.16)',
            }}
          >
            <h2 className="mb-1 line-clamp-2 text-center text-xl font-black text-amber-300 sm:text-2xl">
              {currentQuest?.briefingTitle || 'Math Quest'}
            </h2>
            <p className="mb-2 line-clamp-2 text-center text-xs text-amber-100/70">
              {currentQuest?.briefingDescription || `Complete this ${gradeInfo.topic} challenge.`}
            </p>

            <div className="my-3 h-px w-full bg-amber-400/15" />

            {[
              ['Objective', 'Collect 100 gold coins'],
              ['Programme', `Grade ${currentGrade} - ${gradeInfo.programme}`],
              ['Topic', currentQuest?.theme || currentQuest?.subtitle || gradeInfo.topic],
              ['Level', currentQuest?.difficulty || 'Beginner'],
              ['Reward', `Quest badge + ${currentQuest?.locationType === 'boss' ? '500' : '100'} bonus coins`],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-3 py-1.5">
                <span className="text-xs font-bold text-amber-200/70 sm:text-sm">{label}</span>
                <span className="line-clamp-2 max-w-[68%] text-right text-xs text-white sm:text-sm">{value}</span>
              </div>
            ))}

            <div className="my-3 h-px w-full bg-amber-400/15" />

            <CountdownBar seconds={2} color1="#facc15" color2="#f59e0b" active={showCard} />

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => {
                  gameTTS.stop();
                  setScene('CONCEPT_INTRO');
                }}
                className="flex-1 rounded-2xl py-3 text-sm font-black text-slate-950 transition-all hover:scale-105 active:scale-95 sm:text-base"
                style={{
                  background: 'linear-gradient(135deg, #facc15, #f59e0b)',
                  boxShadow: '0 0 18px rgba(250,204,21,0.35)',
                }}
              >
                Preview Concept
              </button>
              <button
                onClick={() => {
                  gameTTS.stop();
                  setScene('QUEST_MAP');
                }}
                className="rounded-2xl border border-white/12 px-4 py-3 text-sm font-bold text-slate-300 transition-all hover:bg-white/5"
              >
                Map
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.92;
          }
        }
      `}</style>
    </div>
  );
}
