'use client';

import { useMemo } from 'react';
import ScienceExplainer from '@/components/explainer/ScienceExplainer';
import ScienceLabStage from '@/components/lesson-stages/ScienceLabStage';
import { getGameQuestById } from '@/lib/questData';
import QuestConceptIntro from '../../shared/QuestConceptIntro';
import TopicVisualizer from '../components/visualizers/TopicVisualizer';
import { getScienceDetail, inferScienceExplainerConcept, inferScienceLabMode } from '../utils/visualMappings';
import { getQuestById, useScienceStore } from '../store/gameStore';

function getScienceKeyIdeas(title: string, explanation: string): string[] {
  const text = `${title} ${explanation}`.toLowerCase();

  if (text.includes('force') || text.includes('motion') || text.includes('speed')) {
    return [
      'A force is a push or pull that can change motion.',
      'More force usually creates more acceleration when mass stays the same.',
      'More mass needs more force to change motion quickly.',
      explanation,
    ];
  }

  if (text.includes('circuit') || text.includes('current') || text.includes('electric')) {
    return [
      'A complete circuit gives current a closed path.',
      'The battery supplies energy and the bulb converts it to light.',
      'A break anywhere in the loop stops the current.',
      explanation,
    ];
  }

  if (text.includes('water') || text.includes('evaporation') || text.includes('condensation')) {
    return [
      'The Sun adds energy and water evaporates.',
      'Water vapour cools and condenses into clouds.',
      'Precipitation returns water to the surface and the loop continues.',
      explanation,
    ];
  }

  return [
    'Name the system before you answer.',
    'Connect the visible model to the scientific rule.',
    'Use evidence from the animation, not a guess.',
    explanation,
  ];
}

export default function ScienceConceptIntro() {
  const currentGrade = useScienceStore((s) => s.currentGrade);
  const currentQuestId = useScienceStore((s) => s.currentQuestId);
  const setScene = useScienceStore((s) => s.setScene);
  const questions = useScienceStore((s) => s.questions);
  const quest = getQuestById(currentQuestId, currentGrade);
  const fullQuest = useMemo(() => getGameQuestById(currentQuestId), [currentQuestId]);
  const firstQuestion = questions[0];

  const questTitle = fullQuest?.title || quest?.title || 'Science Quest';
  const explainerConcept = firstQuestion ? inferScienceExplainerConcept(questTitle, firstQuestion) : null;
  const labMode = firstQuestion ? inferScienceLabMode(questTitle, firstQuestion) : 'lab';
  const detail = firstQuestion ? getScienceDetail(firstQuestion) : quest?.briefingDescription || 'Explore the science model.';
  const explanation = firstQuestion?.clue.explanation || firstQuestion?.clue.example || quest?.briefingDescription || detail;

  if (!quest || !firstQuestion) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#08131f]">
        <p className="text-white">Loading concept...</p>
      </div>
    );
  }

  return (
    <QuestConceptIntro
      subjectLabel={`Grade ${currentGrade} Science`}
      questTitle={quest.title}
      questSubtitle={quest.subtitle}
      conceptTitle={firstQuestion.clue.title}
      explanation={explanation}
      keyIdeas={getScienceKeyIdeas(questTitle, explanation)}
      teacherName={quest.teacherName}
      teacherAvatar={quest.teacherEmoji || 'Lab'}
      accent={firstQuestion.spiritColor || quest.color || '#14B8A6'}
      secondary={quest.glowColor || '#38BDF8'}
      startLabel="Open Lab Sequence"
      onBack={() => setScene('MISSION_BRIEFING')}
      onStart={() => setScene('CLOUD_TEACHING')}
      visual={
        <div className="grid h-full min-h-[420px] grid-rows-[minmax(0,.5fr)_minmax(0,.5fr)] gap-2 p-2">
          <ScienceLabStage
            title={questTitle}
            detail={detail}
            mode={labMode}
            accent={firstQuestion.spiritColor || '#14B8A6'}
            className="h-full min-h-0"
            overlay="none"
          />
          <div className="grid min-h-0 grid-cols-2 gap-2">
            <div className="min-h-0 overflow-hidden border border-white/10 bg-slate-950">
              {explainerConcept ? (
                <ScienceExplainer concept={explainerConcept} autoPlay showLabels />
              ) : (
                <div className="flex h-full items-center justify-center px-5 text-center text-sm leading-6 text-slate-300">
                  Watch the lab model first, then use the diagram to name the evidence.
                </div>
              )}
            </div>
            <div className="flex min-h-0 items-center justify-center overflow-hidden border border-white/10 bg-slate-950 p-3">
              <TopicVisualizer questTitle={questTitle} highlightStage={firstQuestion.clue.highlightStage} />
            </div>
          </div>
        </div>
      }
    />
  );
}
