'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getIBContext, getTopicsForSubjectAndGrade, getAvailableGrades, getAllSubjects } from '@/lib/ib-curriculum';
import { generateTopicsForGrade } from '@/lib/topic-generator';
import { generateExplanation } from '@/lib/explanation-generator';
import { generateAnimationSpec } from '@/lib/animation-generator';
import { generateGameDesign } from '@/lib/game-design-engine';

const SUBJECT_EMOJIS: Record<string, string> = {
  math: '🔢', science: '🔬', english: '📚', 'social-studies': '🌍',
  'social-skills': '🤝', 'emotional-regulation': '🧘',
};

export default function LessonPlanner() {
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [selectedGrade, setSelectedGrade] = useState(6);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [generatedPlan, setGeneratedPlan] = useState<LessonPlan | null>(null);

  const topics = useMemo(() => generateTopicsForGrade(selectedSubject, selectedGrade), [selectedSubject, selectedGrade]);
  const subjects = getAllSubjects();
  const grades = getAvailableGrades(selectedSubject);

  const toggleTopic = (id: string) => {
    setSelectedTopics(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const generatePlan = () => {
    if (selectedTopics.length === 0) return;

    const selectedTopicData = topics.filter(t => selectedTopics.includes(t.id));
    const totalMinutes = selectedTopicData.reduce((sum, t) => sum + t.estimatedMinutes, 0);

    const plan: LessonPlan = {
      id: `plan-${Date.now()}`,
      subject: selectedSubject,
      grade: selectedGrade,
      topics: selectedTopicData,
      totalDuration: totalMinutes,
      sessions: selectedTopicData.map((topic, i) => ({
        sessionNumber: i + 1,
        topic,
        explanation: generateExplanation(topic),
        animation: generateAnimationSpec(topic),
        game: generateGameDesign(topic),
        duration: topic.estimatedMinutes,
        activities: generateActivities(topic),
        assessment: generateAssessment(topic),
      })),
      createdAt: new Date().toISOString(),
    };

    setGeneratedPlan(plan);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">📋 Lesson Plan Generator</h2>
        <p className="text-sm text-gray-400">Select topics to generate complete lesson plans with explanations, animations, and games.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {subjects.map(s => (
          <button key={s} onClick={() => { setSelectedSubject(s); setSelectedTopics([]); setGeneratedPlan(null); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${s === selectedSubject ? 'bg-purple-600 text-white' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'}`}>
            {SUBJECT_EMOJIS[s]} {s.replace('-', ' ')}
          </button>
        ))}
        <select value={selectedGrade} onChange={e => { setSelectedGrade(Number(e.target.value)); setSelectedTopics([]); setGeneratedPlan(null); }}
          className="px-3 py-1.5 rounded-lg bg-gray-800 text-white text-sm border border-gray-700">
          {grades.map(g => <option key={g} value={g}>Grade {g}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {topics.map(topic => (
          <button key={topic.id} onClick={() => toggleTopic(topic.id)}
            className={`p-4 rounded-xl border text-left transition-all ${selectedTopics.includes(topic.id) ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 bg-gray-800/30 hover:bg-gray-800/50'}`}>
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-semibold text-white">{topic.title}</h3>
              {selectedTopics.includes(topic.id) && <span className="text-purple-400">✓</span>}
            </div>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{topic.description}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <span>⏱️ {topic.estimatedMinutes}m</span>
              <span className={`px-1.5 py-0.5 rounded ${topic.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' : topic.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}`}>{topic.difficulty}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{selectedTopics.length} topics selected · ~{topics.filter(t => selectedTopics.includes(t.id)).reduce((s, t) => s + t.estimatedMinutes, 0)} minutes</p>
        <button onClick={generatePlan} disabled={selectedTopics.length === 0}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-500 hover:to-blue-500">
          Generate Lesson Plan 🚀
        </button>
      </div>

      <AnimatePresence>
        {generatedPlan && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
              <h3 className="text-xl font-bold text-white">📋 Lesson Plan: {generatedPlan.subject.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())} - Grade {generatedPlan.grade}</h3>
              <p className="text-sm text-gray-400 mt-1">{generatedPlan.sessions.length} sessions · {generatedPlan.totalDuration} minutes total</p>
            </div>

            {generatedPlan.sessions.map((session, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="p-5 rounded-xl bg-gray-800/30 border border-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-bold text-white">Session {session.sessionNumber}: {session.topic.title}</h4>
                  <span className="text-xs text-gray-500">{session.duration} min</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-gray-700/30">
                    <p className="text-xs text-purple-300 font-medium mb-1">📝 Explanation</p>
                    <p className="text-xs text-gray-400">{session.explanation.sections.length} sections · {session.explanation.workedExamples.length} examples</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-700/30">
                    <p className="text-xs text-blue-300 font-medium mb-1">🎬 Animation</p>
                    <p className="text-xs text-gray-400">{session.animation.scenes.length} scenes · {session.animation.interactiveElements.length} interactive</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-700/30">
                    <p className="text-xs text-green-300 font-medium mb-1">🎮 Game</p>
                    <p className="text-xs text-gray-400">{session.game.genre} · {session.game.levels.length} levels</p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-semibold text-white mb-2">Activities</p>
                  <ul className="space-y-1">
                    {session.activities.map((a, j) => (
                      <li key={j} className="text-xs text-gray-400 flex items-start gap-2"><span className="text-purple-400">•</span>{a}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-white mb-2">Assessment</p>
                  <p className="text-xs text-gray-400">{session.assessment}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface LessonPlan {
  id: string;
  subject: string;
  grade: number;
  topics: any[];
  totalDuration: number;
  sessions: {
    sessionNumber: number;
    topic: any;
    explanation: any;
    animation: any;
    game: any;
    duration: number;
    activities: string[];
    assessment: string;
  }[];
  createdAt: string;
}

function generateActivities(topic: any): string[] {
  return [
    `Introduction: Hook question about ${topic.title.toLowerCase()}`,
    `Direct instruction with visual aids`,
    `Guided practice with worked examples`,
    `Independent practice problems`,
    `Real-world application activity`,
    `Exit ticket assessment`,
  ];
}

function generateAssessment(topic: any): string {
  return `Students will demonstrate understanding of ${topic.title.toLowerCase()} by completing ${topic.learningObjectives.length} learning objectives through formative and summative assessments.`;
}
