'use client';

import { useMemo } from 'react';
import MathExplainer from '@/components/explainer/MathExplainer';
import MathClassroomStage from '@/components/lesson-stages/MathClassroomStage';
import QuestConceptIntro from '../../shared/QuestConceptIntro';
import { getQuestById, useGameStore } from '../store/gameStore';
import { inferMathExplainer } from '../utils/explainerMappings';

function getMathKeyIdeas(concept: string, explanation: string): string[] {
  if (concept === 'number-line') {
    return [
      'Positive numbers move right; negative numbers move left.',
      'Adding a negative is the same direction as subtracting.',
      'Say the movement aloud before choosing the answer.',
      explanation,
    ];
  }

  if (concept === 'equation') {
    return [
      'An equation is a balance: whatever happens to one side must happen to the other.',
      'Undo addition or subtraction first, then multiplication or division.',
      'The final value should make the original sentence true.',
      explanation,
    ];
  }

  if (concept === 'ratio') {
    return [
      'A ratio splits a total into equal parts.',
      'Add the ratio parts to find the number of units.',
      'Find one unit, then multiply by the target share.',
      explanation,
    ];
  }

  if (concept === 'pythagorean') {
    return [
      'Only use Pythagoras with right-angled triangles.',
      'Square the two shorter sides, then combine their areas.',
      'The hypotenuse is the longest side opposite the right angle.',
      explanation,
    ];
  }

  return [
    'Look for the operation before calculating.',
    'Use the visual model to check direction, grouping, or balance.',
    'Explain the rule in one sentence, then solve.',
    explanation,
  ];
}

export default function MathConceptIntro() {
  const currentGrade = useGameStore((s) => s.currentGrade);
  const currentQuestId = useGameStore((s) => s.currentQuestId);
  const setScene = useGameStore((s) => s.setScene);
  const questions = useGameStore((s) => s.questions);
  const quest = getQuestById(currentQuestId, currentGrade);
  const firstQuestion = questions[0];

  const explainer = useMemo(
    () => (firstQuestion ? inferMathExplainer(firstQuestion) : null),
    [firstQuestion],
  );

  if (!quest || !firstQuestion || !explainer) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#0b1220]">
        <p className="text-white">Loading concept...</p>
      </div>
    );
  }

  const explanation = firstQuestion.clue.example || quest.briefingDescription;
  const prompt = explanation.split('\n').filter(Boolean)[0] || firstQuestion.narrative;

  return (
    <QuestConceptIntro
      subjectLabel={`Grade ${currentGrade} Math`}
      questTitle={quest.title}
      questSubtitle={quest.theme || quest.subtitle}
      conceptTitle={firstQuestion.clue.title}
      explanation={explanation}
      keyIdeas={getMathKeyIdeas(explainer.concept, explanation)}
      equation={firstQuestion.equation}
      teacherName={quest.teacherName}
      teacherAvatar={quest.teacherEmoji && quest.teacherEmoji !== '8' ? quest.teacherEmoji : 'Math'}
      accent={quest.color || '#14B8A6'}
      secondary={quest.glowColor || '#F59E0B'}
      startLabel="Begin Math Challenge"
      onBack={() => setScene('MISSION_BRIEFING')}
      onStart={() => setScene(currentGrade === 6 ? 'PIRATE_ENCOUNTER' : 'QUIZ')}
      visual={
        <div className="grid h-full min-h-[420px] grid-rows-[minmax(0,.48fr)_minmax(0,.52fr)] gap-2 p-2">
          <MathClassroomStage
            title={quest.title}
            prompt={prompt}
            equation={firstQuestion.equation}
            accent={quest.color || '#14B8A6'}
            startValue={firstQuestion.clue.startValue}
            moveValue={firstQuestion.clue.moveValue}
            className="h-full min-h-0"
            overlay="none"
            showEquation={false}
          />
          <div className="min-h-0 overflow-hidden border border-white/10 bg-slate-950">
            <MathExplainer concept={explainer.concept} values={explainer.values} />
          </div>
        </div>
      }
    />
  );
}
