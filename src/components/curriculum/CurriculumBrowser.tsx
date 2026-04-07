'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllSubjects, getAvailableGrades, getIBContext } from '@/lib/ib-curriculum';
import { generateTopicsForGrade, getTopicsBySubject } from '@/lib/topic-generator';
import { generateExplanation } from '@/lib/explanation-generator';
import { generateAnimationSpec } from '@/lib/animation-generator';
import { generateGameDesign } from '@/lib/game-design-engine';
import type { GeneratedTopic } from '@/lib/topic-generator';

const SUBJECT_EMOJIS: Record<string, string> = {
  math: '🔢',
  science: '🔬',
  english: '📚',
  'social-studies': '🌍',
  'social-skills': '🤝',
  'emotional-regulation': '🧘',
};

const SUBJECT_COLORS: Record<string, string> = {
  math: '#8B5CF6',
  science: '#10B981',
  english: '#F59E0B',
  'social-studies': '#3B82F6',
  'social-skills': '#EC4899',
  'emotional-regulation': '#06B6D4',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: '#22C55E',
  intermediate: '#F59E0B',
  advanced: '#EF4444',
};

export default function CurriculumBrowser() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [selectedTopic, setSelectedTopic] = useState<GeneratedTopic | null>(null);
  const [activeTab, setActiveTab] = useState<'topics' | 'explanation' | 'animation' | 'game'>('topics');
  const [searchQuery, setSearchQuery] = useState('');

  const subjects = getAllSubjects();
  const grades = getAvailableGrades(selectedSubject);

  const topics = useMemo(() => {
    const all = generateTopicsForGrade(selectedSubject, selectedGrade);
    if (!searchQuery) return all;
    const q = searchQuery.toLowerCase();
    return all.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.unit.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  }, [selectedSubject, selectedGrade, searchQuery]);

  const explanation = useMemo(() => {
    if (!selectedTopic) return null;
    return generateExplanation(selectedTopic);
  }, [selectedTopic]);

  const animation = useMemo(() => {
    if (!selectedTopic) return null;
    return generateAnimationSpec(selectedTopic);
  }, [selectedTopic]);

  const game = useMemo(() => {
    if (!selectedTopic) return null;
    return generateGameDesign(selectedTopic);
  }, [selectedTopic]);

  const ibContext = getIBContext(selectedSubject, selectedGrade);

  const handleTopicSelect = (topic: GeneratedTopic) => {
    setSelectedTopic(topic);
    setActiveTab('explanation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold mt-1">📖 IB Curriculum Framework</h1>
            <p className="text-sm text-gray-400 mt-1">
              Browse topics, explanations, animations, and game designs for Grades 1-12
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Based on publicly available IB subject guides</p>
            <button onClick={() => router.push('/lesson-planner')}
              className="text-xs text-purple-400 hover:text-purple-300 mt-1">
              📋 Lesson Planner →
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {subjects.map(subject => (
            <button
              key={subject}
              onClick={() => {
                setSelectedSubject(subject);
                setSelectedTopic(null);
                setActiveTab('topics');
                const subjectGrades = getAvailableGrades(subject);
                if (subjectGrades.length > 0 && !subjectGrades.includes(selectedGrade)) {
                  setSelectedGrade(subjectGrades[0]);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                subject === selectedSubject
                  ? 'text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              style={subject === selectedSubject ? { backgroundColor: SUBJECT_COLORS[subject] } : {}}
            >
              <span>{SUBJECT_EMOJIS[subject]}</span>
              <span className="capitalize">{subject.replace('-', ' ')}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Grade:</label>
            <select
              value={selectedGrade}
              onChange={(e) => {
                setSelectedGrade(Number(e.target.value));
                setSelectedTopic(null);
                setActiveTab('topics');
              }}
              className="px-3 py-1.5 rounded-lg bg-gray-800 text-white text-sm border border-gray-700"
            >
              {grades.map(g => (
                <option key={g} value={g}>Grade {g} ({ibContext?.framework || ''})</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics..."
              className="w-full px-3 py-1.5 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 placeholder-gray-500"
            />
          </div>

          {ibContext && (
            <div className="text-right text-xs text-gray-400">
              <p className="font-semibold text-white">{ibContext.framework}</p>
              <p>{ibContext.unit}</p>
            </div>
          )}
        </div>

        {selectedTopic ? (
          <div>
            <button
              onClick={() => { setSelectedTopic(null); setActiveTab('topics'); }}
              className="text-sm text-gray-400 hover:text-white mb-4 inline-block"
            >
              ← Back to Topics
            </button>

            <div className="flex gap-2 mb-6">
              {[
                { id: 'explanation' as const, label: 'Explanation', emoji: '📝' },
                { id: 'animation' as const, label: 'Animation', emoji: '🎬' },
                { id: 'game' as const, label: 'Game Design', emoji: '🎮' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {tab.emoji} {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'explanation' && explanation && (
                <motion.div
                  key="explanation"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                    <h2 className="text-2xl font-bold text-white mb-2">{explanation.title}</h2>
                    <p className="text-gray-300 mb-4">{explanation.introduction}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedTopic.keyConcepts.map(c => (
                        <span key={c} className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">{c}</span>
                      ))}
                      <span
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ backgroundColor: `${DIFFICULTY_COLORS[selectedTopic.difficulty]}20`, color: DIFFICULTY_COLORS[selectedTopic.difficulty] }}
                      >
                        {selectedTopic.difficulty}
                      </span>
                    </div>
                  </div>

                  {explanation.sections.map((section, i) => (
                    <div key={i} className="p-5 rounded-xl bg-gray-800/30 border border-gray-700/50">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">
                          {section.visualType === 'diagram' ? '📊' :
                           section.visualType === 'number-line' ? '📏' :
                           section.visualType === 'chart' ? '📈' :
                           section.visualType === 'timeline' ? '⏳' :
                           section.visualType === 'map' ? '🗺️' : '🖱️'}
                        </span>
                        <h3 className="text-lg font-semibold text-white">{section.heading}</h3>
                      </div>
                      <p className="text-gray-300 mb-3">{section.content}</p>
                      <ul className="space-y-1">
                        {section.keyPoints.map((point, j) => (
                          <li key={j} className="text-sm text-gray-400 flex items-start gap-2">
                            <span className="text-purple-400 mt-0.5">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {explanation.workedExamples.length > 0 && (
                    <div className="p-5 rounded-xl bg-gray-800/30 border border-gray-700/50">
                      <h3 className="text-lg font-semibold text-white mb-3">📝 Worked Examples</h3>
                      {explanation.workedExamples.map((example, i) => (
                        <div key={i} className="mb-4 p-4 rounded-lg bg-gray-700/30">
                          <p className="font-semibold text-white mb-2">{example.title}: {example.problem}</p>
                          <ol className="space-y-1 mb-3">
                            {example.steps.map((step, j) => (
                              <li key={j} className="text-sm text-gray-300">
                                <span className="text-purple-400 font-medium">{j + 1}.</span> {step}
                              </li>
                            ))}
                          </ol>
                          <p className="text-sm text-green-400">✅ {example.solution}</p>
                          <p className="text-xs text-gray-500 mt-1">💡 {example.checkUnderstanding}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {explanation.commonMisconceptions.length > 0 && (
                    <div className="p-5 rounded-xl bg-red-500/10 border border-red-500/30">
                      <h3 className="text-lg font-semibold text-red-300 mb-3">⚠️ Common Misconceptions</h3>
                      <ul className="space-y-2">
                        {explanation.commonMisconceptions.map((m, i) => (
                          <li key={i} className="text-sm text-red-200 flex items-start gap-2">
                            <span>❌</span> {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-5 rounded-xl bg-gray-800/30 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-3">📚 Key Vocabulary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {explanation.keyVocabulary.map((v, i) => (
                        <div key={i} className="p-3 rounded-lg bg-gray-700/30">
                          <p className="font-semibold text-purple-300">{v.term}</p>
                          <p className="text-sm text-gray-400">{v.definition}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-gray-800/30 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-3">📋 Summary</h3>
                    <p className="text-gray-300">{explanation.summary}</p>
                    <p className="text-xs text-gray-500 mt-2">Estimated read time: {explanation.estimatedReadTime} minutes</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'animation' && animation && (
                <motion.div
                  key="animation"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                    <h2 className="text-2xl font-bold text-white mb-2">🎬 {animation.title}</h2>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                      <span>Type: {animation.type}</span>
                      <span>Duration: {animation.duration} min</span>
                      <span>Component: {animation.componentType}</span>
                    </div>
                  </div>

                  {animation.scenes.map((scene, i) => (
                    <div key={i} className="p-5 rounded-xl bg-gray-800/30 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">Scene {i + 1}: {scene.title}</h3>
                        <span className="text-xs text-gray-500">{scene.duration} min</span>
                      </div>
                      <p className="text-gray-300 mb-3">{scene.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {scene.elements.map((el, j) => (
                          <span key={j} className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs">{el}</span>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="p-5 rounded-xl bg-gray-800/30 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-3">🖱️ Interactive Elements</h3>
                    {animation.interactiveElements.map((el, i) => (
                      <div key={i} className="mb-3 p-3 rounded-lg bg-gray-700/30">
                        <p className="font-semibold text-purple-300">{el.type}</p>
                        <p className="text-sm text-gray-300">{el.prompt}</p>
                        <p className="text-xs text-green-400 mt-1">💡 {el.feedback}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'game' && game && (
                <motion.div
                  key="game"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                    <h2 className="text-2xl font-bold text-white mb-2">🎮 {game.title}</h2>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-3">
                      <span>Genre: {game.genre}</span>
                      <span>Play time: {game.estimatedPlayTime} min</span>
                      <span>Component: {game.componentType}</span>
                    </div>
                    <p className="text-gray-300 italic">{game.narrative}</p>
                  </div>

                  <div className="p-5 rounded-xl bg-gray-800/30 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-3">⚙️ Game Mechanics</h3>
                    {game.mechanics.map((m, i) => (
                      <div key={i} className="mb-3 p-3 rounded-lg bg-gray-700/30">
                        <p className="font-semibold text-purple-300">{m.name}</p>
                        <p className="text-sm text-gray-300">{m.description}</p>
                        <p className="text-xs text-green-400 mt-1">📚 {m.learningConnection}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 rounded-xl bg-gray-800/30 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-3">🏔️ Levels</h3>
                    {game.levels.map((level, i) => (
                      <div key={i} className="mb-4 p-4 rounded-lg bg-gray-700/30">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-white">{level.title}</p>
                          {level.bossChallenge && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">BOSS</span>}
                        </div>
                        <p className="text-sm text-gray-300 mb-2">{level.objective}</p>
                        <ul className="space-y-1">
                          {level.challenges.map((c, j) => (
                            <li key={j} className="text-xs text-gray-400">• {c}</li>
                          ))}
                        </ul>
                        {level.bossChallenge && (
                          <p className="text-xs text-red-300 mt-2">⚔️ {level.bossChallenge}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-5 rounded-xl bg-gray-800/30 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-3">🏆 Rewards</h3>
                    <div className="flex flex-wrap gap-2">
                      {game.rewards.map((r, i) => (
                        <div key={i} className="px-3 py-2 rounded-lg bg-gray-700/50">
                          <p className="text-sm font-semibold text-yellow-300">
                            {r.type === 'xp' ? '✨' : r.type === 'coins' ? '💰' : r.type === 'badge' ? '🏅' : r.type === 'unlock' ? '🔓' : '⚡'} {r.name}
                          </p>
                          <p className="text-xs text-gray-400">{r.condition}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topics.map((topic, i) => (
              <motion.button
                key={topic.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => handleTopicSelect(topic)}
                className="p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 text-left transition-all hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-white text-sm">{topic.title}</h3>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                    style={{ backgroundColor: `${DIFFICULTY_COLORS[topic.difficulty]}20`, color: DIFFICULTY_COLORS[topic.difficulty] }}
                  >
                    {topic.difficulty}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-2 line-clamp-2">{topic.description}</p>
                <div className="flex flex-wrap gap-1">
                  {topic.keyConcepts.slice(0, 2).map(c => (
                    <span key={c} className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px]">{c}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>⏱️ {topic.estimatedMinutes} min</span>
                  <span>📝 {topic.learningObjectives.length} objectives</span>
                </div>
              </motion.button>
            ))}

            {topics.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <span className="text-4xl mb-4 block">📭</span>
                <p>No topics found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
