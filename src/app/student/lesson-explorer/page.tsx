'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStudent } from '@/contexts/StudentContext';
import { AnimatedTutor } from '@/components/explainer';
import { BookOpen, Play, Star, Clock, ChevronRight, Sparkles, ArrowLeft } from 'lucide-react';

const lessonsData = [
  { id: '1', title: 'Understanding Fractions', subject: 'math', grade: 8, duration: '20 min', xp: 150, difficulty: 'medium', completed: true, emoji: '🍕' },
  { id: '2', title: 'Linear Equations', subject: 'math', grade: 8, duration: '25 min', xp: 175, difficulty: 'medium', completed: true, emoji: '📐' },
  { id: '3', title: 'Introduction to Algebra', subject: 'math', grade: 8, duration: '30 min', xp: 200, difficulty: 'hard', completed: false, emoji: '🔢' },
  { id: '4', title: 'The Water Cycle', subject: 'science', grade: 8, duration: '25 min', xp: 175, difficulty: 'medium', completed: false, emoji: '💧' },
  { id: '5', title: 'Chemical Reactions', subject: 'science', grade: 8, duration: '30 min', xp: 200, difficulty: 'hard', completed: false, emoji: '⚗️' },
  { id: '6', title: 'Writing Skills', subject: 'english', grade: 8, duration: '20 min', xp: 150, difficulty: 'easy', completed: false, emoji: '✍️' },
];

export default function LessonExplorerPage() {
  const router = useRouter();
  const { profile, loading, isDemoMode } = useStudent();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'math' | 'science' | 'english'>('all');

  const filteredLessons = filter === 'all' ? lessonsData : lessonsData.filter(l => l.subject === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #F5F3FF 0%, #EEF9F8 50%, #FFF7ED 100%)' }}>
        <div className="text-4xl animate-bounce">🧠</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #F5F3FF 0%, #EEF9F8 50%, #FFF7ED 100%)' }}>
      <header className="bg-white/70 backdrop-blur-md border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-purple-100 rounded-full"><ArrowLeft size={20} className="text-purple-600" /></button>
            <div>
              <h1 className="font-nunito text-xl font-black text-gray-800">Lesson Explorer</h1>
              <p className="text-sm text-gray-500">Powered by Gemma4 AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-purple-100 px-3 py-1.5 rounded-full">
            <Sparkles size={14} className="text-purple-600" />
            <span className="text-sm font-medium text-purple-700">{profile?.xp || 0} XP</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {selectedLesson && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedLesson(null)}>
            <motion.div className="bg-white rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-nunito text-xl font-black">AI Lesson: {lessonsData.find(l => l.id === selectedLesson)?.title}</h2>
                <button onClick={() => setSelectedLesson(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <AnimatedTutor topic={lessonsData.find(l => l.id === selectedLesson)?.title || 'Lesson'} subject={(lessonsData.find(l => l.id === selectedLesson)?.subject as 'math' | 'science' | 'english' | 'arabic') || 'math'} grade={profile?.grade || 8} studentName={profile?.name || 'Student'} onComplete={() => setSelectedLesson(null)} />
            </motion.div>
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {(['all', 'math', 'science', 'english'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${filter === f ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-purple-50'}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div className="bg-white rounded-2xl p-4 shadow-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><Play size={20} className="text-green-600" /></div>
              <div><div className="text-2xl font-black text-gray-800">{lessonsData.filter(l => l.completed).length}</div><div className="text-xs text-gray-500">Completed</div></div>
            </div>
          </motion.div>
          <motion.div className="bg-white rounded-2xl p-4 shadow-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center"><Star size={20} className="text-purple-600" /></div>
              <div><div className="text-2xl font-black text-gray-800">{lessonsData.filter(l => l.completed).length * 150}</div><div className="text-xs text-gray-500">XP Earned</div></div>
            </div>
          </motion.div>
          <motion.div className="bg-white rounded-2xl p-4 shadow-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center"><Clock size={20} className="text-orange-600" /></div>
              <div><div className="text-2xl font-black text-gray-800">{Math.round(lessonsData.filter(l => !l.completed).length * 25)}</div><div className="text-xs text-gray-500">Minutes Left</div></div>
            </div>
          </motion.div>
        </div>

        <h2 className="font-nunito text-lg font-bold text-gray-800 mb-4">Available Lessons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLessons.map((lesson, i) => (
            <motion.div key={lesson.id} className={`bg-white rounded-2xl p-5 shadow-md border-2 ${lesson.completed ? 'border-green-200' : 'border-gray-100'} hover:shadow-lg transition-all ${!lesson.completed ? 'cursor-pointer' : ''}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => !lesson.completed && setSelectedLesson(lesson.id)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{lesson.emoji}</div>
                  <div>
                    <h3 className="font-nunito font-bold text-gray-800">{lesson.title}</h3>
                    <p className="text-sm text-gray-500">{lesson.subject} · Grade {lesson.grade}</p>
                  </div>
                </div>
                {lesson.completed && <div className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">✓ Done</div>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Clock size={14} /> {lesson.duration}</span>
                  <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500" /> {lesson.xp} XP</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${lesson.difficulty === 'easy' ? 'bg-green-100 text-green-700' : lesson.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{lesson.difficulty}</span>
                </div>
                {!lesson.completed && <button className="flex items-center gap-1 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-700"><Play size={14} /> Start</button>}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center gap-4">
            <div className="text-4xl">🤖</div>
            <div>
              <h3 className="font-nunito font-bold text-lg">Need Help Understanding?</h3>
              <p className="text-purple-100 text-sm">Gemma4 AI creates personalized explanations just for you. Click any lesson to get started!</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
