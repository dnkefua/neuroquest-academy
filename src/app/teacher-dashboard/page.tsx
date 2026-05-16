'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Eye,
  Flame,
  Gamepad2,
  Gauge,
  GraduationCap,
  Layers3,
  Lightbulb,
  MousePointerClick,
  Play,
  Plus,
  Rocket,
  RotateCcw,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  Wand2,
  Zap,
} from 'lucide-react';
import type { MathExplainerConcept } from '@/components/explainer/MathExplainer';
import styles from './teacher.module.css';

const MathExplainer = dynamic(() => import('@/components/explainer/MathExplainer'), {
  ssr: false,
  loading: () => <div className={styles.visualFallback}>Loading concept model</div>,
});

const ScienceExplainer = dynamic(() => import('@/components/explainer/ScienceExplainer'), {
  ssr: false,
  loading: () => <div className={styles.visualFallback}>Loading science model</div>,
});

type Subject = 'math' | 'science' | 'english';
type Need = 'visual' | 'focus' | 'confidence' | 'challenge';
type QuestStatus = 'draft' | 'assigned';
type WorkspaceTab = 'forge' | 'preview' | 'analytics';

type ForgeInput = {
  classId: string;
  subject: Subject;
  topic: string;
  learnerNeed: Need;
  duration: '5' | '10' | '15';
};

type QuestBlueprint = {
  id: string;
  title: string;
  className: string;
  subject: Subject;
  topic: string;
  learnerNeed: Need;
  status: QuestStatus;
  generatedAt: string;
  promise: string;
  explainer: {
    title: string;
    steps: string[];
    mathConcept?: MathExplainerConcept;
    scienceConcept?: 'water-cycle' | 'circuit' | 'force' | 'gravity' | 'states-of-matter';
  };
  challenge: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  rewards: {
    xp: number;
    badge: string;
    streakBoost: number;
  };
  teacherMoves: string[];
  evidence: string[];
};

type StudentSnapshot = {
  name: string;
  avatar: string;
  mastery: number;
  streak: number;
  xp: number;
  status: 'Ready' | 'Needs hint' | 'Stretch';
};

const classes = [
  { id: '8a-math', name: '8A Mathematics', subject: 'math' as Subject, students: 28, mastery: 72, attention: 3, next: 'Integer operations' },
  { id: '8b-math', name: '8B Mathematics', subject: 'math' as Subject, students: 25, mastery: 68, attention: 2, next: 'Linear equations' },
  { id: '8a-science', name: '8A Science', subject: 'science' as Subject, students: 30, mastery: 75, attention: 1, next: 'Forces and motion' },
];

const students: StudentSnapshot[] = [
  { name: 'Mariam Al-Sayed', avatar: 'MA', mastery: 91, streak: 12, xp: 2840, status: 'Stretch' },
  { name: 'Kai Chen', avatar: 'KC', mastery: 58, streak: 3, xp: 1420, status: 'Needs hint' },
  { name: 'Amina Okafor', avatar: 'AO', mastery: 77, streak: 7, xp: 2190, status: 'Ready' },
  { name: 'James Wilson', avatar: 'JW', mastery: 64, streak: 2, xp: 1680, status: 'Needs hint' },
];

const topicPresets: Record<Subject, string[]> = {
  math: ['Integer operations', 'Linear equations', 'Ratio and proportion', 'Pythagorean theorem'],
  science: ['Forces and motion', 'Electric circuits', 'Water cycle systems', 'States of matter'],
  english: ['Metaphor and imagery', 'Persuasive writing', 'Poetry rhythm', 'Inference from text'],
};

const needLabels: Record<Need, string> = {
  visual: 'Visual model first',
  focus: 'Short focus loops',
  confidence: 'Confidence recovery',
  challenge: 'Stretch challenge',
};

const subjectTone: Record<Subject, { accent: string; soft: string; icon: typeof Gauge }> = {
  math: { accent: '#f59e0b', soft: '#fff7ed', icon: Gauge },
  science: { accent: '#14b8a6', soft: '#ecfeff', icon: Activity },
  english: { accent: '#8b5cf6', soft: '#f5f3ff', icon: BookOpen },
};

const demoQuestions: Record<Subject, QuestBlueprint['challenge']> = {
  math: {
    question: 'A student starts at +5 on the number line and moves -9 spaces. Where do they land?',
    options: ['+14', '+4', '-4', '-14'],
    correctIndex: 2,
    explanation: 'Moving negative means travel left. From +5, nine spaces left lands on -4.',
  },
  science: {
    question: 'A cart accelerates more when the same force is applied to which object?',
    options: ['A heavier cart', 'A lighter cart', 'A cart with no wheels', 'Both equally'],
    correctIndex: 1,
    explanation: 'With the same force, lower mass gives greater acceleration.',
  },
  english: {
    question: 'In “the idea was a locked door,” what does the metaphor suggest?',
    options: ['The idea is easy', 'The idea is hidden or difficult to open', 'The idea is made of wood', 'The idea is loud'],
    correctIndex: 1,
    explanation: 'The metaphor maps a locked door onto the idea, suggesting it is difficult to access.',
  },
};

function buildQuest(input: ForgeInput): QuestBlueprint {
  const className = classes.find((item) => item.id === input.classId)?.name ?? 'Grade 8 Class';
  const subjectName = input.subject === 'math' ? 'Math' : input.subject === 'science' ? 'Science' : 'English';
  const needPhrase = needLabels[input.learnerNeed].toLowerCase();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const mathConcept: MathExplainerConcept =
    input.topic.toLowerCase().includes('equation') ? 'equation' :
    input.topic.toLowerCase().includes('ratio') ? 'ratio' :
    input.topic.toLowerCase().includes('pythag') ? 'pythagorean' :
    'number-line';

  const scienceConcept =
    input.topic.toLowerCase().includes('circuit') ? 'circuit' :
    input.topic.toLowerCase().includes('water') ? 'water-cycle' :
    input.topic.toLowerCase().includes('matter') ? 'states-of-matter' :
    'force';

  return {
    id: `quest-${Date.now()}`,
    title: `${input.topic} Quest Forge`,
    className,
    subject: input.subject,
    topic: input.topic,
    learnerNeed: input.learnerNeed,
    status: 'draft',
    generatedAt: timestamp,
    promise: `Turn ${input.topic.toLowerCase()} into a ${input.duration}-minute playable quest with ${needPhrase}, mastery evidence, and teacher-ready intervention notes.`,
    explainer: {
      title: `${subjectName} Concept Burst`,
      steps: [
        'Anchor the concept with a familiar real-world situation.',
        'Show the rule as motion, shape, or language pattern before naming it.',
        'Ask students to predict the next move before revealing the answer.',
        'Replay mistakes as a calm diagnostic path, not a failure state.',
      ],
      mathConcept: input.subject === 'math' ? mathConcept : undefined,
      scienceConcept: input.subject === 'science' ? scienceConcept : undefined,
    },
    challenge: demoQuestions[input.subject],
    rewards: {
      xp: input.learnerNeed === 'challenge' ? 180 : 120,
      badge: input.learnerNeed === 'confidence' ? 'Brave Retry' : input.learnerNeed === 'focus' ? 'Focus Sprint' : 'Concept Builder',
      streakBoost: input.duration === '15' ? 2 : 1,
    },
    teacherMoves: [
      'Project the concept burst for 90 seconds.',
      'Let students vote before the first reveal.',
      'Assign the quest to the class with one required evidence sentence.',
      'Use the mastery table to form a 6-minute support group.',
    ],
    evidence: [
      'Prediction before answer',
      'Correct option with explanation',
      'Hint usage signal',
      'Mastery confidence check',
    ],
  };
}

const initialForge: ForgeInput = {
  classId: '8a-math',
  subject: 'math',
  topic: 'Integer operations',
  learnerNeed: 'visual',
  duration: '10',
};

export default function TeacherDashboardPage() {
  const [forgeInput, setForgeInput] = useState<ForgeInput>(initialForge);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('forge');
  const [blueprint, setBlueprint] = useState<QuestBlueprint>(() => buildQuest(initialForge));
  const [isForging, setIsForging] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [assignedCount, setAssignedCount] = useState(3);

  const activeClass = useMemo(
    () => classes.find((item) => item.id === forgeInput.classId) ?? classes[0],
    [forgeInput.classId],
  );
  const SubjectIcon = subjectTone[forgeInput.subject].icon;
  const isCorrect = selectedAnswer === blueprint.challenge.correctIndex;

  function updateForge<K extends keyof ForgeInput>(key: K, value: ForgeInput[K]) {
    setForgeInput((current) => {
      const next = { ...current, [key]: value };
      if (key === 'subject') {
        next.topic = topicPresets[value as Subject][0];
        const subjectClass = classes.find((item) => item.subject === value);
        if (subjectClass) next.classId = subjectClass.id;
      }
      return next;
    });
  }

  function forgeQuest() {
    setIsForging(true);
    setSelectedAnswer(null);
    window.setTimeout(() => {
      setBlueprint(buildQuest(forgeInput));
      setIsForging(false);
      setActiveTab('preview');
    }, 850);
  }

  function assignQuest() {
    setBlueprint((current) => ({ ...current, status: 'assigned' }));
    setAssignedCount((value) => value + 1);
    setActiveTab('analytics');
  }

  return (
    <div className={styles.commandCenter}>
      <section className={styles.heroPanel}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><Sparkles size={16} /> Signature AI feature</div>
          <h1>AI Quest Forge</h1>
          <p>
            Convert any Grade 8 topic into an explainer, playable challenge, reward loop, and teacher evidence plan in one guided flow.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.primaryButton} onClick={forgeQuest}>
              <Wand2 size={18} /> Forge new quest
            </button>
            <Link href="/grade-8-studio" className={styles.secondaryButton}>
              Open Grade 8 Studio <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <div className={styles.heroMetrics}>
          {[
            ['Assigned quests', assignedCount.toString(), Rocket],
            ['Avg mastery', '76%', Target],
            ['Class streak', '12 days', Flame],
          ].map(([label, value, Icon]) => (
            <div className={styles.metricTile} key={label as string}>
              <Icon size={20} />
              <strong>{value as string}</strong>
              <span>{label as string}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.workspaceGrid}>
        <aside className={styles.controlRail}>
          <div className={styles.panelHeader}>
            <Settings2 size={18} />
            <div>
              <h2>Forge Controls</h2>
              <p>Built for classroom speed</p>
            </div>
          </div>

          <label className={styles.fieldLabel}>Class</label>
          <select className={styles.fieldControl} value={forgeInput.classId} onChange={(event) => updateForge('classId', event.target.value)}>
            {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>

          <label className={styles.fieldLabel}>Subject</label>
          <div className={styles.segmented}>
            {(['math', 'science', 'english'] as Subject[]).map((subject) => (
              <button
                type="button"
                key={subject}
                className={forgeInput.subject === subject ? styles.segmentActive : ''}
                onClick={() => updateForge('subject', subject)}
              >
                {subject}
              </button>
            ))}
          </div>

          <label className={styles.fieldLabel}>Topic</label>
          <select className={styles.fieldControl} value={forgeInput.topic} onChange={(event) => updateForge('topic', event.target.value)}>
            {topicPresets[forgeInput.subject].map((topic) => <option key={topic}>{topic}</option>)}
          </select>

          <label className={styles.fieldLabel}>Learner need</label>
          <div className={styles.needGrid}>
            {(Object.keys(needLabels) as Need[]).map((need) => (
              <button
                type="button"
                key={need}
                onClick={() => updateForge('learnerNeed', need)}
                className={forgeInput.learnerNeed === need ? styles.needActive : ''}
              >
                {needLabels[need]}
              </button>
            ))}
          </div>

          <label className={styles.fieldLabel}>Quest length</label>
          <div className={styles.segmented}>
            {(['5', '10', '15'] as const).map((minutes) => (
              <button
                type="button"
                key={minutes}
                className={forgeInput.duration === minutes ? styles.segmentActive : ''}
                onClick={() => updateForge('duration', minutes)}
              >
                {minutes}m
              </button>
            ))}
          </div>

          <div className={styles.mobileToggles}>
            <button type="button" className={focusMode ? styles.toggleActive : ''} onClick={() => setFocusMode((value) => !value)}>
              <Eye size={16} /> Focus UI
            </button>
            <button type="button" className={lowBandwidth ? styles.toggleActive : ''} onClick={() => setLowBandwidth((value) => !value)}>
              <ShieldCheck size={16} /> Low bandwidth
            </button>
          </div>
        </aside>

        <main className={styles.forgeWorkspace}>
          <div className={styles.tabBar}>
            {[
              ['forge', 'Blueprint', Layers3],
              ['preview', 'Student Preview', Gamepad2],
              ['analytics', 'Teacher Analytics', BarChart3],
            ].map(([id, label, Icon]) => (
              <button
                key={id as string}
                type="button"
                className={activeTab === id ? styles.tabActive : ''}
                onClick={() => setActiveTab(id as WorkspaceTab)}
              >
                <Icon size={17} /> {label as string}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'forge' && (
              <motion.div key="forge" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className={styles.blueprintPanel}>
                <div className={styles.blueprintHeader}>
                  <div className={styles.subjectMark} style={{ background: subjectTone[blueprint.subject].soft, color: subjectTone[blueprint.subject].accent }}>
                    <SubjectIcon size={28} />
                  </div>
                  <div>
                    <span className={styles.statusPill}>{blueprint.status}</span>
                    <h2>{blueprint.title}</h2>
                    <p>{blueprint.promise}</p>
                  </div>
                </div>

                <div className={styles.blueprintCards}>
                  {[
                    ['Explainer', blueprint.explainer.title, 'Four-step concept burst with animation-ready teacher narration.', Brain],
                    ['Game loop', blueprint.challenge.question, 'One answer unlocks feedback, XP, and replay evidence.', Gamepad2],
                    ['Rewards', `${blueprint.rewards.xp} XP + ${blueprint.rewards.badge}`, `Adds ${blueprint.rewards.streakBoost} streak boost.`, Trophy],
                  ].map(([label, title, body, Icon]) => (
                    <article className={styles.blueprintCard} key={label as string}>
                      <Icon size={20} />
                      <span>{label as string}</span>
                      <h3>{title as string}</h3>
                      <p>{body as string}</p>
                    </article>
                  ))}
                </div>

                <div className={styles.teacherMoveGrid}>
                  <div>
                    <h3>Teacher moves</h3>
                    {blueprint.teacherMoves.map((move, index) => (
                      <div className={styles.checkRow} key={move}>
                        <span>{index + 1}</span>
                        {move}
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3>Evidence captured</h3>
                    {blueprint.evidence.map((item) => (
                      <div className={styles.evidenceRow} key={item}>
                        <ClipboardCheck size={16} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <button className={styles.forgeButton} onClick={forgeQuest} disabled={isForging}>
                  {isForging ? <Rocket className={styles.spinSlow} size={20} /> : <Wand2 size={20} />}
                  {isForging ? 'Forging quest...' : 'Generate AI quest'}
                </button>
              </motion.div>
            )}

            {activeTab === 'preview' && (
              <motion.div key="preview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className={styles.previewGrid}>
                <section className={styles.visualStage}>
                  <div className={styles.stageTop}>
                    <span><Play size={15} /> Student quest preview</span>
                    <strong>{blueprint.topic}</strong>
                  </div>
                  {lowBandwidth ? (
                    <div className={styles.lowBandwidthModel}>
                      <Lightbulb size={42} />
                      <h3>Low-bandwidth concept card</h3>
                      <p>{blueprint.explainer.steps[1]}</p>
                    </div>
                  ) : blueprint.subject === 'math' ? (
                    <MathExplainer
                      concept={blueprint.explainer.mathConcept ?? 'number-line'}
                      values={{
                        startValue: 5,
                        moveValue: -9,
                        coefficient: 3,
                        constant: 4,
                        result: 19,
                        solution: 5,
                        ratioParts: [3, 5],
                        total: 40,
                        sideA: 3,
                        sideB: 4,
                        sideC: 5,
                      }}
                      autoPlay={!focusMode}
                    />
                  ) : blueprint.subject === 'science' ? (
                    <ScienceExplainer concept={blueprint.explainer.scienceConcept ?? 'force'} autoPlay={!focusMode} showLabels />
                  ) : (
                    <div className={styles.englishStage}>
                      <span>Metaphor X-ray</span>
                      <h3>“The idea was a locked door.”</h3>
                      <p>Image: locked door. Target: idea. Effect: difficult to access until the learner finds a key.</p>
                    </div>
                  )}
                </section>

                <section className={styles.challengePanel}>
                  <div className={styles.challengeHeader}>
                    <MousePointerClick size={18} />
                    <div>
                      <h2>Interactive check</h2>
                      <p>Teacher can run this live or assign it to students.</p>
                    </div>
                  </div>
                  <p className={styles.questionText}>{blueprint.challenge.question}</p>
                  <div className={styles.answerGrid}>
                    {blueprint.challenge.options.map((option, index) => {
                      const selected = selectedAnswer === index;
                      const correct = index === blueprint.challenge.correctIndex;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setSelectedAnswer(index)}
                          className={
                            selected && correct ? styles.answerCorrect :
                            selected ? styles.answerWrong :
                            selectedAnswer !== null && correct ? styles.answerReveal :
                            ''
                          }
                        >
                          <span>{String.fromCharCode(65 + index)}</span>
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {selectedAnswer !== null && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={isCorrect ? styles.feedbackGood : styles.feedbackCoach}>
                        <CheckCircle2 size={18} />
                        <div>
                          <strong>{isCorrect ? 'Mastery evidence captured' : 'Replay the misconception'}</strong>
                          <p>{blueprint.challenge.explanation}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className={styles.previewActions}>
                    <button className={styles.secondaryButton} onClick={() => setSelectedAnswer(null)}>
                      <RotateCcw size={17} /> Reset
                    </button>
                    <button className={styles.primaryButton} onClick={assignQuest}>
                      <Send size={17} /> Assign to {activeClass.name}
                    </button>
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className={styles.analyticsPanel}>
                <div className={styles.analyticsHeader}>
                  <div>
                    <span className={styles.statusPill}>{blueprint.status}</span>
                    <h2>Classroom command center</h2>
                    <p>Progress, rewards, and intervention signals for the generated quest.</p>
                  </div>
                  <button className={styles.primaryButton} onClick={assignQuest}>
                    <Send size={17} /> Assign quest
                  </button>
                </div>

                <div className={styles.analyticsCards}>
                  {[
                    ['Projected completion', '84%', Clock],
                    ['XP available', `${blueprint.rewards.xp * activeClass.students}`, Award],
                    ['Students needing hints', activeClass.attention.toString(), Target],
                    ['Quest readiness', 'High', ShieldCheck],
                  ].map(([label, value, Icon]) => (
                    <div className={styles.analyticsCard} key={label as string}>
                      <Icon size={20} />
                      <strong>{value as string}</strong>
                      <span>{label as string}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.studentTableModern}>
                  {students.map((student) => (
                    <div className={styles.studentRowModern} key={student.name}>
                      <div className={styles.avatarModern}>{student.avatar}</div>
                      <div className={styles.studentMain}>
                        <strong>{student.name}</strong>
                        <span>{student.status}</span>
                      </div>
                      <div className={styles.progressTrack}><span style={{ width: `${student.mastery}%` }} /></div>
                      <div className={styles.studentMeta}><Flame size={15} /> {student.streak}</div>
                      <div className={styles.studentMeta}><Zap size={15} /> {student.xp}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </section>

      <section className={styles.classStrip}>
        {classes.map((item) => (
          <button
            type="button"
            key={item.id}
            className={forgeInput.classId === item.id ? styles.classActive : ''}
            onClick={() => updateForge('classId', item.id)}
          >
            <GraduationCap size={19} />
            <strong>{item.name}</strong>
            <span>{item.students} students - {item.mastery}% mastery</span>
            <ChevronRight size={17} />
          </button>
        ))}
      </section>
    </div>
  );
}
