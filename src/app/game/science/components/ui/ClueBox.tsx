'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ScienceExplainer from '@/components/explainer/ScienceExplainer';
import ScienceLabStage from '@/components/lesson-stages/ScienceLabStage';
import { getGameQuestById } from '@/lib/questData';
import { gameAudio } from '../../../shared/audio';
import { gameTTS } from '../../../shared/tts';
import type { ScienceQuestion } from '../../store/gameStore';
import { useScienceStore } from '../../store/gameStore';
import TopicVisualizer from '../visualizers/TopicVisualizer';
import { getScienceDetail, inferScienceExplainerConcept, inferScienceLabMode } from '../../utils/visualMappings';

export default function ScienceClueBox({
  question,
  questionIndex,
}: {
  question: ScienceQuestion;
  questionIndex: number;
}) {
  const [open, setOpen] = useState(false);
  const [visualTab, setVisualTab] = useState<'explainer' | 'diagram'>('explainer');
  const { clueUsed, currentQuestId, openClue } = useScienceStore();
  const used = clueUsed[questionIndex];

  const quest = useMemo(() => getGameQuestById(currentQuestId), [currentQuestId]);
  const questTitle = quest?.title || 'Science';
  const detail = getScienceDetail(question);
  const labMode = inferScienceLabMode(questTitle, question);
  const explainerConcept = inferScienceExplainerConcept(questTitle, question);

  function handleOpen() {
    if (!used) openClue(questionIndex);
    gameAudio.playClick();
    setVisualTab('explainer');
    setOpen(true);
    gameTTS.speak(question.clue.title);
  }

  return (
    <>
      <motion.button
        onClick={handleOpen}
        className="relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold sm:rounded-2xl sm:px-4"
        style={{
          background: used ? 'rgba(20,184,166,0.12)' : 'rgba(20,184,166,0.2)',
          border: '2px solid #14B8A6',
          color: '#14B8A6',
          boxShadow: used ? 'none' : '0 0 14px rgba(20,184,166,0.35)',
        }}
        animate={
          used
            ? {}
            : {
                boxShadow: [
                  '0 0 8px rgba(20,184,166,0.25)',
                  '0 0 22px rgba(20,184,166,0.55)',
                  '0 0 8px rgba(20,184,166,0.25)',
                ],
              }
        }
        transition={{ duration: 2, repeat: Infinity }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-sm sm:text-base">{used ? 'Open' : 'Hint'}</span>
        {used ? 'View Clue Again' : 'Need a Clue?'}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />

            <motion.div
              className="relative z-10 flex h-[calc(100dvh-1rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[24px] p-3 shadow-2xl sm:h-[min(82dvh,700px)] sm:rounded-[32px] sm:p-5"
              style={{
                background: 'linear-gradient(135deg, #08131f 0%, #0a1f33 100%)',
                border: '1px solid rgba(20,184,166,0.42)',
                boxShadow: '0 0 50px rgba(20,184,166,0.18)',
              }}
              initial={{ scale: 0.3, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.3, y: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <div className="mb-2 flex-shrink-0 text-center sm:mb-3">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-200/70">Science Clue</p>
                <h3 className="mt-1 line-clamp-1 text-lg font-black text-teal-300 sm:mt-2 sm:text-2xl">{question.clue.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-teal-50/85 sm:mt-2 sm:text-sm sm:leading-6">{detail}</p>
              </div>

              <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,0.45fr)_minmax(0,0.55fr)] gap-2 sm:grid-cols-[0.96fr_1.04fr] sm:grid-rows-1 sm:gap-3">
                <ScienceLabStage
                  title={questTitle}
                  detail={question.clue.title}
                  mode={labMode}
                  accent={question.spiritColor}
                  className="h-full min-h-0"
                  overlay="none"
                />

                <div className="flex min-h-0 flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#0d1726] p-2 sm:rounded-[28px] sm:p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Visual Support</p>
                    <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1 text-[10px] font-bold uppercase tracking-[0.18em]">
                      {(['explainer', 'diagram'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setVisualTab(tab)}
                          className="rounded-xl px-3 py-1.5 transition-all"
                          style={{
                            background: visualTab === tab ? question.spiritColor : 'transparent',
                            color: visualTab === tab ? '#03131d' : 'rgba(255,255,255,0.65)',
                          }}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-[#101b2a]">
                    {visualTab === 'explainer' ? (
                      explainerConcept ? (
                        <ScienceExplainer concept={explainerConcept} autoPlay showLabels={false} />
                      ) : (
                        <div className="flex h-full items-center justify-center px-6 text-center text-sm leading-7 text-slate-300">
                          Use the lab model and diagram together to connect the concept.
                        </div>
                      )
                    ) : (
                      <div className="flex h-full items-center justify-center overflow-hidden p-3">
                        <TopicVisualizer questTitle={questTitle} highlightStage={question.clue.highlightStage} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="mt-2 w-full flex-shrink-0 rounded-2xl py-2.5 text-sm font-black text-slate-950 transition-all hover:scale-[1.01] sm:mt-4 sm:py-3 sm:text-base"
                style={{ background: 'linear-gradient(135deg, #0D9488, #14B8A6)' }}
              >
                Close Clue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
