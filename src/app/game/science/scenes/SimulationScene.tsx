'use client';

import { useState } from 'react';
import ScienceExplainer from '@/components/explainer/ScienceExplainer';
import ScienceLabStage from '@/components/lesson-stages/ScienceLabStage';
import InteractiveSimulation from '@/components/simulations/SimulationScene';
import { getGameQuestById } from '@/lib/questData';
import TopicVisualizer from '../components/visualizers/TopicVisualizer';
import { useScienceStore } from '../store/gameStore';
import { getScienceDetail, inferScienceExplainerConcept, inferScienceLabMode } from '../utils/visualMappings';

function getSimulationType(
  mode: ReturnType<typeof inferScienceLabMode>,
  explicitType?: 'water-cycle' | 'circuit' | 'fraction' | 'force' | 'gravity' | 'number-line',
) {
  if (explicitType) return explicitType;
  if (mode === 'water-cycle' || mode === 'circuit' || mode === 'force' || mode === 'gravity') return mode;
  return null;
}

export default function ScienceSimulationScene() {
  const currentGrade = useScienceStore((s) => s.currentGrade);
  const currentQuestId = useScienceStore((s) => s.currentQuestId);
  const currentQuestion = useScienceStore((s) => s.currentQuestion);
  const questions = useScienceStore((s) => s.questions);
  const setScene = useScienceStore((s) => s.setScene);

  const question = questions[currentQuestion];
  const quest = getGameQuestById(currentQuestId);
  const questTitle = quest?.title || 'Science';
  const detail = getScienceDetail(question);
  const labMode = inferScienceLabMode(questTitle, question);
  const explainerConcept = inferScienceExplainerConcept(questTitle, question);
  const simulationType = getSimulationType(labMode, question?.clue.simulationType);
  const [visualTab, setVisualTab] = useState<'explainer' | 'diagram'>('explainer');

  if (!question) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#08131f]">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="flex h-dvh w-full flex-col overflow-hidden px-2 pb-2 pt-14 sm:px-4 sm:pb-4 sm:pt-16"
      style={{ background: 'linear-gradient(180deg, #06111c 0%, #0a1f33 54%, #08111b 100%)' }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-1 min-h-0 flex-col">
        <div className="mb-2 flex flex-shrink-0 items-end justify-between gap-2 rounded-[22px] border border-sky-300/12 bg-slate-950/45 px-3 py-2 backdrop-blur-sm sm:rounded-[28px] sm:px-4 sm:py-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-300/70">3D Lab Demo</p>
            <h1 className="mt-0.5 line-clamp-1 text-base font-black text-white sm:mt-1 sm:text-xl">{question.clue.title || questTitle}</h1>
            <p className="mt-0.5 line-clamp-1 max-w-3xl text-xs leading-5 text-slate-300 sm:mt-1 sm:text-sm sm:leading-6">{detail}</p>
          </div>
          <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-slate-200 sm:block">
            Grade {currentGrade} - Step {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,0.52fr)_minmax(0,0.48fr)] gap-2 sm:grid-cols-[1.12fr_0.88fr] sm:grid-rows-1">
          <div className="grid min-h-0 grid-rows-[minmax(0,0.42fr)_minmax(0,0.58fr)] gap-2">
            <ScienceLabStage
              title={questTitle}
              detail={question.clue.title}
              mode={labMode}
              accent={question.spiritColor}
              className="h-full min-h-0"
              overlay="none"
            />

            <div className="overflow-hidden rounded-[22px] border border-white/10 bg-slate-950/45 p-2 sm:rounded-[28px] sm:p-3">
              <div className="mb-1 flex items-center justify-between sm:mb-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Interactive Model</p>
                <p className="text-[10px] text-slate-500">Preview before the question</p>
              </div>
              {simulationType ? (
                <InteractiveSimulation
                  type={simulationType}
                  params={question.clue.simulationParams}
                  showControls={false}
                  showLabels
                  className="h-full min-h-0 overflow-hidden rounded-2xl"
                />
              ) : (
                <div className="flex h-full items-center justify-center rounded-2xl bg-white/[0.03] px-6 text-center text-sm leading-7 text-slate-300">
                  This topic uses the lab model and diagram together, so the interactive simulation is not needed here.
                </div>
              )}
            </div>
          </div>

          <div className="grid min-h-0 grid-rows-[minmax(0,0.74fr)_auto] gap-2">
            <div className="flex min-h-0 flex-col overflow-hidden rounded-[22px] border border-white/10 bg-slate-950/45 p-2 sm:rounded-[28px] sm:p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Visual Support</p>
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
                      Focus on the 3D lab and the diagram. This topic does not need a second animated explainer panel.
                    </div>
                  )
                ) : (
                  <div className="flex h-full items-center justify-center overflow-hidden p-3">
                    <TopicVisualizer questTitle={questTitle} highlightStage={question.clue.highlightStage} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-[22px] border border-white/10 bg-slate-950/45 px-3 py-2 sm:rounded-[28px] sm:px-4 sm:py-3">
              <div className="line-clamp-2 text-xs text-slate-400 sm:text-sm">
                Watch the motion, check the visual, then answer fast.
              </div>
              <button
                onClick={() => setScene('QUIZ')}
                className="flex-shrink-0 rounded-2xl px-4 py-2.5 text-xs font-black text-slate-950 transition-all hover:scale-105 active:scale-95 sm:px-6 sm:py-3 sm:text-sm"
                style={{ background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', boxShadow: '0 0 18px rgba(56,189,248,0.28)' }}
              >
                Start Question
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
