'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CountdownBar from './CountdownBar';
import { gameTTS, sanitizeForTTS, useTTSCleanup, useTTSSettings } from './tts';

type QuestConceptIntroProps = {
  subjectLabel: string;
  questTitle: string;
  questSubtitle?: string;
  conceptTitle: string;
  explanation: string;
  keyIdeas: string[];
  equation?: string;
  teacherName?: string;
  teacherAvatar?: string;
  accent: string;
  secondary: string;
  visual: ReactNode;
  onStart: () => void;
  onBack: () => void;
  startLabel?: string;
};

function shortLine(value: string, fallback: string): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (!clean) return fallback;
  return clean.length > 180 ? `${clean.slice(0, 176).trim()}...` : clean;
}

export default function QuestConceptIntro({
  subjectLabel,
  questTitle,
  questSubtitle,
  conceptTitle,
  explanation,
  keyIdeas,
  equation,
  teacherName = 'Learning Guide',
  teacherAvatar = 'Guide',
  accent,
  secondary,
  visual,
  onStart,
  onBack,
  startLabel = 'Start Challenge',
}: QuestConceptIntroProps) {
  const { enabled: ttsOn } = useTTSSettings();
  const [activeIdea, setActiveIdea] = useState(0);

  useTTSCleanup();

  const ttsScript = useMemo(() => {
    const ideas = keyIdeas.slice(0, 3).join('. ');
    return sanitizeForTTS(`${questTitle}. ${conceptTitle}. ${explanation}. ${ideas}.`);
  }, [conceptTitle, explanation, keyIdeas, questTitle]);

  useEffect(() => {
    if (!ttsOn) return;
    gameTTS.speak(ttsScript, 0.92);
    return () => gameTTS.stop();
  }, [ttsOn, ttsScript]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIdea((value) => (value + 1) % Math.max(1, keyIdeas.length));
    }, 1800);
    return () => window.clearInterval(timer);
  }, [keyIdeas.length]);

  return (
    <div
      className="relative flex h-dvh w-full flex-col overflow-hidden px-2 pb-2 pt-14 sm:px-4 sm:pb-4 sm:pt-16"
      style={{ background: `radial-gradient(circle at 18% 8%, ${accent}2b, transparent 30%), linear-gradient(180deg, #07111f 0%, #101827 55%, #080d16 100%)` }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10 mx-auto grid min-h-0 w-full max-w-6xl flex-1 grid-rows-[auto_minmax(0,1fr)_auto] gap-2">
        <header
          className="grid gap-2 border border-white/10 bg-white/[0.05] p-3 backdrop-blur-md sm:grid-cols-[minmax(0,1fr)_auto] sm:p-4"
          style={{ boxShadow: `0 24px 70px ${accent}12` }}
        >
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/55">
                {subjectLabel}
              </span>
              <span className="px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: accent, background: `${accent}18`, border: `1px solid ${accent}35` }}>
                Fast concept launch
              </span>
            </div>
            <h1 className="line-clamp-2 font-nunito text-2xl font-black leading-tight text-white sm:text-4xl">
              {questTitle}
            </h1>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-300">{questSubtitle || conceptTitle}</p>
          </div>

          <div className="flex items-center gap-3 border border-white/10 bg-black/20 px-3 py-2">
            <div className="grid h-12 w-12 place-items-center border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.12em] text-white">
              {teacherAvatar}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">Guide</p>
              <p className="text-sm font-black text-white">{teacherName}</p>
            </div>
          </div>
        </header>

        <section className="grid min-h-0 gap-2 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,.88fr)]">
          <div className="min-h-0 overflow-hidden border border-white/10 bg-[#0b1422]">
            {visual}
          </div>

          <div className="grid min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] gap-2">
            <div className="border border-white/10 bg-white/[0.05] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: accent }}>
                Concept
              </p>
              <h2 className="mt-1 font-nunito text-2xl font-black text-white">{conceptTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-200">{shortLine(explanation, 'Watch the model, name the rule, then try the challenge.')}</p>
              {equation && (
                <div className="mt-3 border border-white/10 bg-black/20 px-3 py-2 font-mono text-lg font-black" style={{ color: accent }}>
                  {equation}
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['See', 'Say', 'Solve'].map((label, index) => (
                <div key={label} className="border border-white/10 bg-white/[0.04] p-3 text-center">
                  <div className="mx-auto mb-2 h-1.5 w-full" style={{ background: index <= activeIdea ? `linear-gradient(90deg, ${accent}, ${secondary})` : 'rgba(255,255,255,0.12)' }} />
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-300">{label}</p>
                </div>
              ))}
            </div>

            <div className="min-h-0 overflow-hidden border border-white/10 bg-white/[0.05] p-3">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/45">Key ideas</p>
              <div className="grid h-full content-start gap-2 overflow-auto pr-1">
                <AnimatePresence initial={false}>
                  {keyIdeas.slice(0, 4).map((idea, index) => (
                    <motion.div
                      key={idea}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0, scale: activeIdea === index ? 1.01 : 1 }}
                      exit={{ opacity: 0, x: -16 }}
                      className="border p-3 text-sm font-semibold leading-6"
                      style={{
                        borderColor: activeIdea === index ? accent : 'rgba(255,255,255,0.1)',
                        background: activeIdea === index ? `${accent}16` : 'rgba(255,255,255,0.035)',
                        color: activeIdea === index ? '#fff' : 'rgb(203 213 225)',
                      }}
                    >
                      {idea}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        <footer className="relative z-10 grid gap-2 sm:grid-cols-[1fr_auto_auto] sm:items-center">
          <CountdownBar seconds={3} color1={accent} color2={secondary} active />
          <button
            onClick={() => {
              gameTTS.stop();
              onBack();
            }}
            className="border border-white/12 bg-white/[0.04] px-5 py-3 text-sm font-black text-slate-300 transition hover:bg-white/[0.08]"
          >
            Back
          </button>
          <motion.button
            onClick={() => {
              gameTTS.stop();
              onStart();
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-7 py-3 text-sm font-black text-slate-950"
            style={{ background: `linear-gradient(135deg, ${accent}, ${secondary})` }}
          >
            {startLabel}
          </motion.button>
        </footer>
      </div>
    </div>
  );
}
