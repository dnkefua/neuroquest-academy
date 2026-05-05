'use client';

import { motion } from 'framer-motion';
import ConceptAnimation from '../../shared/ConceptAnimation';
import QuestConceptIntro from '../../shared/QuestConceptIntro';
import { getQuestById, useEnglishStore } from '../store/gameStore';

function getEnglishKeyIdeas(title: string, clueTitle: string, explanation: string): string[] {
  const text = `${title} ${clueTitle} ${explanation}`.toLowerCase();

  if (text.includes('metaphor') || text.includes('simile') || text.includes('figurative')) {
    return [
      'Find the two things being compared.',
      'Decide whether the comparison uses like or as, or says one thing is another.',
      'Explain the feeling or image the comparison creates.',
      explanation,
    ];
  }

  if (text.includes('rhythm') || text.includes('rhyme') || text.includes('enjambment') || text.includes('meter')) {
    return [
      'Read the line once for meaning, then again for sound.',
      'Notice where the poet makes you pause or continue.',
      'Connect the sound pattern to the poem mood.',
      explanation,
    ];
  }

  if (text.includes('argument') || text.includes('evidence') || text.includes('claim')) {
    return [
      'Separate the claim from the evidence.',
      'Ask whether the evidence proves the claim.',
      'Explain the link in your own words.',
      explanation,
    ];
  }

  return [
    'Preview the text feature before answering.',
    'Name the device or reading move.',
    'Explain how it changes meaning for the reader.',
    explanation,
  ];
}

function EnglishMeaningVisual({
  title,
  clueTitle,
  explanation,
  accent,
}: {
  title: string;
  clueTitle: string;
  explanation: string;
  accent: string;
}) {
  const layers = [
    ['Words', clueTitle],
    ['Meaning', explanation],
    ['Reader effect', 'What should the reader notice, feel, or infer?'],
  ];

  return (
    <div className="grid h-full min-h-[420px] grid-rows-[minmax(0,.48fr)_minmax(0,.52fr)] gap-2 p-2">
      <div className="min-h-0 overflow-hidden border border-white/10 bg-slate-950 p-4">
        <div className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/45">Animated reading model</div>
        <ConceptAnimation subject="english" questTitle={`${title} ${clueTitle}`} color1={accent} color2="#EF4444" />
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {clueTitle.split(/\s+/).slice(0, 6).map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-black text-white"
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="grid min-h-0 gap-2 sm:grid-cols-3">
        {layers.map(([label, value], index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + index * 0.1 }}
            className="min-h-0 overflow-hidden border border-white/10 bg-white/[0.05] p-3"
          >
            <div className="mb-2 h-1.5" style={{ background: `linear-gradient(90deg, ${accent}, #EF4444)` }} />
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">{label}</p>
            <p className="mt-2 line-clamp-6 text-sm font-semibold leading-6 text-slate-200">{value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function EnglishConceptIntro() {
  const currentGrade = useEnglishStore((s) => s.currentGrade);
  const currentQuestId = useEnglishStore((s) => s.currentQuestId);
  const setScene = useEnglishStore((s) => s.setScene);
  const questions = useEnglishStore((s) => s.questions);
  const quest = getQuestById(currentQuestId, currentGrade);
  const firstQuestion = questions[0];

  if (!quest || !firstQuestion) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#1f1400]">
        <p className="text-white">Loading concept...</p>
      </div>
    );
  }

  const explanation = firstQuestion.clue.example || quest.briefingDescription;
  const accent = quest.color || '#F59E0B';

  return (
    <QuestConceptIntro
      subjectLabel={`Grade ${currentGrade} English`}
      questTitle={quest.title}
      questSubtitle={quest.subtitle}
      conceptTitle={firstQuestion.clue.title}
      explanation={explanation}
      keyIdeas={getEnglishKeyIdeas(quest.title, firstQuestion.clue.title, explanation)}
      teacherName={quest.teacherName}
      teacherAvatar={quest.teacherEmoji || 'Read'}
      accent={accent}
      secondary="#EF4444"
      startLabel="Start Reading Challenge"
      onBack={() => setScene('MISSION_BRIEFING')}
      onStart={() => setScene('QUIZ')}
      visual={
        <EnglishMeaningVisual
          title={quest.title}
          clueTitle={firstQuestion.clue.title}
          explanation={explanation}
          accent={accent}
        />
      }
    />
  );
}
