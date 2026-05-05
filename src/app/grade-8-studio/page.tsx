'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Atom,
  BookOpenText,
  Brain,
  Check,
  ChevronLeft,
  Eye,
  FlaskConical,
  Gamepad2,
  Gauge,
  Languages,
  Lightbulb,
  Pause,
  Play,
  ScanSearch,
  Sparkles,
  Target,
  Volume2,
  Wand2,
} from 'lucide-react';
import { getCurriculumQuestsByGradeSubject } from '@/lib/questData';
import type { CurriculumQuest, CurriculumSubject } from '@/types';
import type { MathExplainerConcept } from '@/components/explainer/MathExplainer';

const MathExplainer = dynamic(() => import('@/components/explainer/MathExplainer'), {
  ssr: false,
  loading: () => <ExplainerFallback label="Loading math explainer" />,
});

const ScienceExplainer = dynamic(() => import('@/components/explainer/ScienceExplainer'), {
  ssr: false,
  loading: () => <ExplainerFallback label="Loading science explainer" />,
});

type StudioSubject = Extract<CurriculumSubject, 'math' | 'science' | 'english'>;
type SupportMode = 'clarity' | 'focus' | 'sensory' | 'challenge';
type MathValues = {
  startValue?: number;
  moveValue?: number;
  moveValue2?: number;
  numerator?: number;
  denominator?: number;
  operands?: [number, number];
  ratioParts?: [number, number];
  total?: number;
  sideA?: number;
  sideB?: number;
  sideC?: number;
  coefficient?: number;
  constant?: number;
  result?: number;
  solution?: number;
  displayValue?: string;
  exponent?: number;
};

type StudioConcept = {
  id: string;
  subject: StudioSubject;
  title: string;
  subtitle: string;
  skill: string;
  gameLoop: string;
  evidenceMove: string;
  accent: string;
  gradient: string;
  math?: {
    concept: MathExplainerConcept;
    values: MathValues;
  };
  science?: {
    concept: 'water-cycle' | 'circuit' | 'force' | 'gravity' | 'states-of-matter';
  };
  english?: {
    device: string;
    source: string;
    reveal: string;
    microPrompt: string;
  };
};

const SUBJECTS: Array<{
  id: StudioSubject;
  label: string;
  icon: typeof Gauge;
  accent: string;
}> = [
  { id: 'math', label: 'Math', icon: Gauge, accent: '#f59e0b' },
  { id: 'science', label: 'Science', icon: FlaskConical, accent: '#14b8a6' },
  { id: 'english', label: 'English', icon: BookOpenText, accent: '#8b5cf6' },
];

const CONCEPTS: StudioConcept[] = [
  {
    id: 'integer-racer',
    subject: 'math',
    title: 'Integer Motion Racer',
    subtitle: 'Negative integers become left-right movement, speed, and route choice.',
    skill: 'Integer operations',
    gameLoop: 'Correct moves increase speed; wrong moves replay the number-line jump in slow motion.',
    evidenceMove: 'Students explain direction, distance, and final position before the car boosts.',
    accent: '#f59e0b',
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    math: { concept: 'number-line', values: { startValue: 5, moveValue: -10 } },
  },
  {
    id: 'balance-vault',
    subject: 'math',
    title: 'Equation Balance Vault',
    subtitle: 'Equations are physical balance machines with removable blocks.',
    skill: 'Two-step equations',
    gameLoop: 'Each inverse operation unlocks a vault ring; the final x value opens the gate.',
    evidenceMove: 'The learner states the same operation on both sides.',
    accent: '#38bdf8',
    gradient: 'from-sky-400 via-cyan-400 to-emerald-400',
    math: { concept: 'equation', values: { coefficient: 4, constant: -3, result: 21, solution: 6 } },
  },
  {
    id: 'ratio-lab',
    subject: 'math',
    title: 'Ratio Mix Lab',
    subtitle: 'Parts, units, and totals become liquid layers students can see.',
    skill: 'Ratio and proportion',
    gameLoop: 'Balanced mixtures power drones; imbalance creates a visible diagnostic replay.',
    evidenceMove: 'Students identify total parts, unit value, and target share.',
    accent: '#22c55e',
    gradient: 'from-emerald-400 via-lime-400 to-yellow-300',
    math: { concept: 'ratio', values: { ratioParts: [3, 5], total: 40 } },
  },
  {
    id: 'pythagoras-city',
    subject: 'math',
    title: 'Pythagoras Skyline',
    subtitle: 'Right triangles become city beams, ramps, and area tiles.',
    skill: 'Pythagorean theorem',
    gameLoop: 'Students repair a skyline bridge by matching square areas.',
    evidenceMove: 'The learner connects a squared plus b squared to c squared.',
    accent: '#a855f7',
    gradient: 'from-violet-500 via-fuchsia-500 to-pink-500',
    math: { concept: 'pythagorean', values: { sideA: 3, sideB: 4, sideC: 5 } },
  },
  {
    id: 'force-arena',
    subject: 'science',
    title: 'Force Arena',
    subtitle: 'Forces show up as arrows, acceleration, mass, and motion trails.',
    skill: 'Forces and motion',
    gameLoop: 'Correct predictions let students tune force and mass before the simulation launches.',
    evidenceMove: 'Students compare force, mass, and acceleration in one sentence.',
    accent: '#ef4444',
    gradient: 'from-red-400 via-orange-500 to-yellow-400',
    science: { concept: 'force' },
  },
  {
    id: 'circuit-keeper',
    subject: 'science',
    title: 'Circuit Keeper',
    subtitle: 'Current becomes visible flow through battery, switch, wire, and bulb.',
    skill: 'Electric circuits',
    gameLoop: 'A complete circuit lights the district; incomplete circuits show the missing path.',
    evidenceMove: 'The learner names the closed loop and energy source.',
    accent: '#06b6d4',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-500',
    science: { concept: 'circuit' },
  },
  {
    id: 'water-cycle-dome',
    subject: 'science',
    title: 'Water Cycle Dome',
    subtitle: 'Evaporation, condensation, precipitation, and collection animate as a loop.',
    skill: 'Earth systems',
    gameLoop: 'Students restore a desert biosphere by sequencing the cycle correctly.',
    evidenceMove: 'The learner links heat, state change, cloud formation, and rainfall.',
    accent: '#0ea5e9',
    gradient: 'from-sky-400 via-teal-400 to-green-400',
    science: { concept: 'water-cycle' },
  },
  {
    id: 'metaphor-forge',
    subject: 'english',
    title: 'Metaphor Forge',
    subtitle: 'Figurative language becomes layered visual meaning, not a definition to memorize.',
    skill: 'Poetry and literary devices',
    gameLoop: 'Students forge stronger lines to power a narrative scene.',
    evidenceMove: 'The learner identifies source image, target idea, and emotional effect.',
    accent: '#8b5cf6',
    gradient: 'from-violet-500 via-purple-500 to-cyan-400',
    english: {
      device: 'Metaphor',
      source: 'The sun was a golden coin.',
      reveal: 'The sentence does not say the sun is like a coin. It directly maps coin qualities onto the sun: round, bright, valuable, and glowing.',
      microPrompt: 'Turn "the classroom was quiet" into a metaphor with a clear mood.',
    },
  },
  {
    id: 'rhythm-mapper',
    subject: 'english',
    title: 'Rhythm Mapper',
    subtitle: 'Meter, line breaks, and sound devices become pulse tracks students can arrange.',
    skill: 'Poetic structure',
    gameLoop: 'Learners place beats on a pulse grid to unlock the next stanza.',
    evidenceMove: 'The learner claps the pattern, names the device, then explains the effect.',
    accent: '#ec4899',
    gradient: 'from-pink-500 via-rose-400 to-amber-300',
    english: {
      device: 'Enjambment',
      source: 'A thought runs across the line break',
      reveal: 'The line break controls pace. When the sentence continues, the reader is pulled forward before the idea settles.',
      microPrompt: 'Write one sentence that breaks after a surprising word.',
    },
  },
];

const SUPPORT_MODES: Array<{
  id: SupportMode;
  title: string;
  detail: string;
  icon: typeof Eye;
}> = [
  {
    id: 'clarity',
    title: 'Dual-coded clarity',
    detail: 'Every concept pairs words with motion, shape, color, and a student-owned explanation.',
    icon: Eye,
  },
  {
    id: 'focus',
    title: 'Focus cockpit',
    detail: 'Short loops, visible progress, one active choice, and no surprise transitions.',
    icon: Target,
  },
  {
    id: 'sensory',
    title: 'Sensory tuning',
    detail: 'Motion, contrast, captions, pacing, and audio can adapt without changing the lesson goal.',
    icon: Activity,
  },
  {
    id: 'challenge',
    title: 'Error replay',
    detail: 'Mistakes trigger a calm diagnostic animation instead of a dead-end red mark.',
    icon: ScanSearch,
  },
];

const ANIMATION_FRONTIER = [
  'Embodied simulations where math and science rules move objects on screen.',
  'Concept x-ray layers that separate vocabulary, visual model, formula, and real-world meaning.',
  'Calm error replays that show the wrong turn and the recovery path.',
  'Student agency controls for motion, contrast, captions, and challenge level.',
  'Micro-sprint game loops tuned for attention variability and working-memory load.',
  'Multilingual bridge moments for Emirates international classrooms.',
];

function ExplainerFallback({ label }: { label: string }) {
  return (
    <div className="grid h-full min-h-[320px] place-items-center bg-slate-950 text-slate-200">
      <div className="flex items-center gap-3 text-sm font-bold">
        <span className="h-3 w-3 animate-pulse rounded-full bg-cyan-300" />
        {label}
      </div>
    </div>
  );
}

function getQuestStats(quests: CurriculumQuest[]) {
  const questions = quests.reduce((sum, quest) => sum + quest.questions.length, 0);
  const bossCount = quests.filter((quest) => quest.boss || quest.bossChallenge).length;
  const minutes = Math.max(45, quests.length * 18);
  return { questions, bossCount, minutes };
}

function EnglishVisualizer({ concept, motionEnabled }: { concept: StudioConcept; motionEnabled: boolean }) {
  const words = concept.english?.source.split(' ') ?? [];

  return (
    <div className="relative h-full min-h-[320px] overflow-hidden bg-[#10131b] p-5 text-white">
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="relative grid h-full min-h-[300px] grid-rows-[auto_1fr_auto] gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.16em] text-purple-200">{concept.english?.device}</div>
            <h3 className="mt-1 font-nunito text-2xl font-black">Meaning Layers</h3>
          </div>
          <Languages className="h-8 w-8 text-cyan-300" />
        </div>

        <div className="grid content-center gap-5">
          <div className="flex flex-wrap justify-center gap-2">
            {words.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                initial={{ opacity: 0, y: 18, rotateX: 25 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: motionEnabled ? index * 0.08 : 0, duration: motionEnabled ? 0.35 : 0 }}
                className="border border-white/15 bg-white/10 px-3 py-2 text-lg font-black text-white shadow-[0_12px_35px_rgba(0,0,0,.24)]"
              >
                {word}
              </motion.span>
            ))}
          </div>

          <div className="mx-auto grid w-full max-w-2xl grid-cols-3 gap-3">
            {['image', 'idea', 'effect'].map((layer, index) => (
              <motion.div
                key={layer}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: motionEnabled ? 0.35 + index * 0.12 : 0 }}
                className="border border-white/12 bg-white/[0.06] p-3 text-center"
              >
                <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{layer}</div>
                <div className="mt-2 h-2 bg-gradient-to-r from-purple-400 via-cyan-300 to-amber-300" />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_.8fr]">
          <p className="border border-white/12 bg-white/[0.06] p-4 text-sm leading-6 text-slate-200">
            {concept.english?.reveal}
          </p>
          <p className="border border-cyan-300/25 bg-cyan-300/10 p-4 text-sm font-bold leading-6 text-cyan-100">
            {concept.english?.microPrompt}
          </p>
        </div>
      </div>
    </div>
  );
}

function ConceptStage({
  concept,
  motionEnabled,
  captionsEnabled,
}: {
  concept: StudioConcept;
  motionEnabled: boolean;
  captionsEnabled: boolean;
}) {
  return (
    <div className="relative min-h-[420px] overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl shadow-slate-950/30">
      <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${concept.gradient}`} />
      <AnimatePresence mode="wait">
        <motion.div
          key={concept.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: motionEnabled ? 0.28 : 0 }}
          className="h-full"
        >
          {concept.math && (
            <MathExplainer
              concept={concept.math.concept}
              values={concept.math.values}
              autoPlay={motionEnabled}
            />
          )}
          {concept.science && (
            <ScienceExplainer
              concept={concept.science.concept}
              autoPlay={motionEnabled}
              showLabels={captionsEnabled}
            />
          )}
          {concept.english && <EnglishVisualizer concept={concept} motionEnabled={motionEnabled} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Grade8StudioPage() {
  const [activeSubject, setActiveSubject] = useState<StudioSubject>('math');
  const [activeConceptId, setActiveConceptId] = useState('integer-racer');
  const [activeMode, setActiveMode] = useState<SupportMode>('clarity');
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const subjectConcepts = useMemo(
    () => CONCEPTS.filter((concept) => concept.subject === activeSubject),
    [activeSubject],
  );

  const activeConcept = useMemo(
    () => subjectConcepts.find((concept) => concept.id === activeConceptId) ?? subjectConcepts[0],
    [activeConceptId, subjectConcepts],
  );

  const quests = useMemo(() => getCurriculumQuestsByGradeSubject(8, activeSubject), [activeSubject]);
  const stats = useMemo(() => getQuestStats(quests), [quests]);
  const selectedSupport = SUPPORT_MODES.find((mode) => mode.id === activeMode) ?? SUPPORT_MODES[0];
  const SupportIcon = selectedSupport.icon;

  function selectSubject(subject: StudioSubject) {
    setActiveSubject(subject);
    const firstConcept = CONCEPTS.find((concept) => concept.subject === subject);
    if (firstConcept) setActiveConceptId(firstConcept.id);
  }

  return (
    <main
      className={`min-h-screen ${
        highContrast
          ? 'bg-black text-white'
          : 'bg-[linear-gradient(180deg,#f8fafc_0%,#ecfeff_42%,#fff7ed_100%)] text-slate-950'
      }`}
    >
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="inline-flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Emirates International Students</div>
            <h1 className="truncate font-nunito text-xl font-black text-slate-950 sm:text-2xl">Grade 8 Animated Learning Studio</h1>
          </div>
          <Link
            href="/game-market"
            className="ml-auto hidden items-center gap-2 bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-cyan-700 sm:inline-flex"
          >
            Game Market <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className={`${focusMode ? 'hidden lg:block' : ''} space-y-4`}>
          <div className="border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Brain className="h-5 w-5 text-cyan-700" />
              <h2 className="font-nunito text-lg font-black">Studio Controls</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Motion', icon: motionEnabled ? Play : Pause, active: motionEnabled, action: () => setMotionEnabled((value) => !value) },
                { label: 'Captions', icon: Volume2, active: captionsEnabled, action: () => setCaptionsEnabled((value) => !value) },
                { label: 'Focus', icon: Target, active: focusMode, action: () => setFocusMode((value) => !value) },
                { label: 'Contrast', icon: Eye, active: highContrast, action: () => setHighContrast((value) => !value) },
              ].map((control) => {
                const Icon = control.icon;
                return (
                  <button
                    key={control.label}
                    onClick={control.action}
                    className={`flex min-h-20 flex-col items-center justify-center gap-2 border px-3 py-2 text-sm font-black transition ${
                      control.active
                        ? 'border-slate-950 bg-slate-950 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {control.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Subject</div>
            <div className="grid gap-2">
              {SUBJECTS.map((subject) => {
                const Icon = subject.icon;
                const isActive = activeSubject === subject.id;
                return (
                  <button
                    key={subject.id}
                    onClick={() => selectSubject(subject.id)}
                    className={`flex items-center gap-3 border p-3 text-left transition ${
                      isActive ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white hover:border-cyan-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" style={{ color: isActive ? subject.accent : undefined }} />
                    <span className="font-black">{subject.label}</span>
                    {isActive && <Check className="ml-auto h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Grade 8 Scope</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                ['Quests', quests.length],
                ['Questions', stats.questions],
                ['Bosses', stats.bossCount],
              ].map(([label, value]) => (
                <div key={label} className="border border-slate-200 bg-slate-50 p-3 text-center">
                  <div className="font-nunito text-2xl font-black text-slate-950">{value}</div>
                  <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
            <div className="relative overflow-hidden border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${activeConcept.gradient}`} />
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-cyan-800">
                    <Sparkles className="h-4 w-4" />
                    Animated explainer and game loop
                  </div>
                  <h2 className="font-nunito text-3xl font-black leading-tight text-slate-950 sm:text-5xl">{activeConcept.title}</h2>
                  <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{activeConcept.subtitle}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Skill</div>
                    <div className="mt-1 font-black text-slate-950">{activeConcept.skill}</div>
                  </div>
                  <div className="border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Minutes</div>
                    <div className="mt-1 font-black text-slate-950">{stats.minutes}</div>
                  </div>
                </div>
              </div>

              <ConceptStage
                concept={activeConcept}
                motionEnabled={motionEnabled}
                captionsEnabled={captionsEnabled}
              />
            </div>

            <aside className={`${focusMode ? 'hidden xl:block' : ''} grid gap-4`}>
              <div className="border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5 text-amber-600" />
                  <h3 className="font-nunito text-lg font-black">Game Learning Loop</h3>
                </div>
                <p className="text-sm leading-6 text-slate-700">{activeConcept.gameLoop}</p>
                <div className="mt-4 border-l-4 border-amber-400 bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-950">
                  {activeConcept.evidenceMove}
                </div>
              </div>

              <div className="border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <SupportIcon className="h-5 w-5 text-cyan-700" />
                  <h3 className="font-nunito text-lg font-black">{selectedSupport.title}</h3>
                </div>
                <p className="text-sm leading-6 text-slate-700">{selectedSupport.detail}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {SUPPORT_MODES.map((mode) => {
                    const Icon = mode.icon;
                    const selected = mode.id === activeMode;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setActiveMode(mode.id)}
                        className={`flex min-h-16 items-center justify-center border p-2 transition ${
                          selected ? 'border-cyan-600 bg-cyan-50 text-cyan-900' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-cyan-300'
                        }`}
                        title={mode.title}
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>
          </section>

          <section className={`${focusMode ? 'hidden' : ''} grid gap-3 md:grid-cols-2 xl:grid-cols-3`}>
            {subjectConcepts.map((concept) => {
              const selected = concept.id === activeConcept.id;
              return (
                <button
                  key={concept.id}
                  onClick={() => setActiveConceptId(concept.id)}
                  className={`group overflow-hidden border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 ${
                    selected ? 'border-slate-950 ring-2 ring-slate-950/10' : 'border-slate-200 hover:border-cyan-300'
                  }`}
                >
                  <div className={`mb-4 h-1.5 bg-gradient-to-r ${concept.gradient}`} />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-nunito text-lg font-black text-slate-950">{concept.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{concept.subtitle}</p>
                    </div>
                    <Lightbulb className="h-5 w-5 flex-none text-slate-400 transition group-hover:text-cyan-600" />
                  </div>
                </button>
              );
            })}
          </section>

          <section className={`${focusMode ? 'hidden' : ''} grid gap-5 lg:grid-cols-[.8fr_1.2fr]`}>
            <div className="border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-purple-600" />
                <h3 className="font-nunito text-xl font-black">Frontier Animation System</h3>
              </div>
              <div className="grid gap-2">
                {ANIMATION_FRONTIER.map((item) => (
                  <div key={item} className="flex gap-3 border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                    <Atom className="mt-0.5 h-4 w-4 flex-none text-cyan-700" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-emerald-300" />
                <h3 className="font-nunito text-xl font-black">Grade 8 Quest Feed</h3>
              </div>
              <div className="grid max-h-[390px] gap-3 overflow-auto pr-1">
                {quests.slice(0, 8).map((quest) => (
                  <div key={quest.id} className="border border-white/12 bg-white/[0.04] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-nunito text-lg font-black">{quest.title}</h4>
                        <p className="mt-1 text-sm leading-6 text-slate-300">{quest.theme}</p>
                      </div>
                      <span className="border border-white/12 bg-white/[0.06] px-2 py-1 text-xs font-black text-cyan-100">
                        {quest.questions.length} Q
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-300">
                      <span className="bg-white/[0.08] px-2 py-1">{quest.programme}</span>
                      <span className="bg-white/[0.08] px-2 py-1">{quest.realmName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
