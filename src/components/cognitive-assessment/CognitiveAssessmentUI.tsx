'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCognitiveStore } from '@/store/cognitiveStore';
import type { CognitiveDomain } from '@/types';

const ASSESSMENT_QUESTIONS: Record<CognitiveDomain, { question: string; options: string[]; correct: number; domain: CognitiveDomain }[]> = {
  memory: [
    { question: 'Remember this sequence: 3, 7, 2, 9. What was the third number?', options: ['3', '7', '2', '9'], correct: 2, domain: 'memory' },
    { question: 'Which word was NOT in this list: Apple, River, Mountain, Book?', options: ['Apple', 'River', 'Cloud', 'Book'], correct: 2, domain: 'memory' },
    { question: 'What color was the circle shown 5 seconds ago?', options: ['Red', 'Blue', 'Green', 'Yellow'], correct: 1, domain: 'memory' },
    { question: 'Recall the number: 841. What was the middle digit?', options: ['8', '4', '1', '0'], correct: 1, domain: 'memory' },
  ],
  logic: [
    { question: 'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?', options: ['Yes', 'No', 'Cannot tell', 'Only sometimes'], correct: 0, domain: 'logic' },
    { question: 'What comes next: 2, 6, 18, 54, ...?', options: ['108', '162', '72', '216'], correct: 1, domain: 'logic' },
    { question: 'A is taller than B. B is taller than C. Who is shortest?', options: ['A', 'B', 'C', 'Cannot tell'], correct: 2, domain: 'logic' },
    { question: 'If it takes 5 machines 5 minutes to make 5 widgets, how long for 100 machines to make 100 widgets?', options: ['100 min', '5 min', '20 min', '1 min'], correct: 1, domain: 'logic' },
  ],
  linguistics: [
    { question: 'Which word is a synonym for "enormous"?', options: ['Tiny', 'Huge', 'Fast', 'Quiet'], correct: 1, domain: 'linguistics' },
    { question: 'Complete the analogy: Hot is to Cold as Up is to ...', options: ['High', 'Down', 'Sky', 'Tall'], correct: 1, domain: 'linguistics' },
    { question: 'Which sentence is grammatically correct?', options: ['Me and him went', 'He and I went', 'Him and I goes', 'I and him goes'], correct: 1, domain: 'linguistics' },
    { question: 'What does "benevolent" mean?', options: ['Cruel', 'Kind and generous', 'Confused', 'Angry'], correct: 1, domain: 'linguistics' },
  ],
  spatial: [
    { question: 'If you fold a square paper in half diagonally, what shape do you get?', options: ['Rectangle', 'Triangle', 'Circle', 'Pentagon'], correct: 1, domain: 'spatial' },
    { question: 'How many faces does a cube have?', options: ['4', '6', '8', '12'], correct: 1, domain: 'spatial' },
    { question: 'If you rotate the letter "N" 180 degrees, what does it look like?', options: ['Z', 'N', 'U', 'M'], correct: 1, domain: 'spatial' },
    { question: 'Which 3D shape has a circular base and comes to a point?', options: ['Cylinder', 'Cone', 'Sphere', 'Pyramid'], correct: 1, domain: 'spatial' },
  ],
  attention: [
    { question: 'Count how many times the letter "e" appears: "The elephant eats leaves."', options: ['4', '5', '6', '7'], correct: 2, domain: 'attention' },
    { question: 'Which number is different: 4, 8, 12, 15, 20?', options: ['4', '8', '12', '15'], correct: 3, domain: 'attention' },
    { question: 'Find the odd one out: 🍎 🍊 🍋 🍇 🥕', options: ['🍎', '🍊', '🍋', '🥕'], correct: 3, domain: 'attention' },
    { question: 'How many words have more than 4 letters: "The quick brown fox jumps over the lazy dog"?', options: ['3', '4', '5', '6'], correct: 2, domain: 'attention' },
  ],
  'processing-speed': [
    { question: 'Quick! What is 7 × 8?', options: ['54', '56', '58', '63'], correct: 1, domain: 'processing-speed' },
    { question: 'What is 144 ÷ 12?', options: ['10', '11', '12', '14'], correct: 2, domain: 'processing-speed' },
    { question: 'What is 25 + 37?', options: ['52', '62', '72', '63'], correct: 1, domain: 'processing-speed' },
    { question: 'What is 100 - 37?', options: ['63', '67', '73', '77'], correct: 0, domain: 'processing-speed' },
  ],
};

const DOMAIN_INFO: Record<CognitiveDomain, { emoji: string; label: string; color: string }> = {
  memory: { emoji: '🧠', label: 'Memory', color: '#8B5CF6' },
  logic: { emoji: '🔮', label: 'Logic', color: '#06B6D4' },
  linguistics: { emoji: '📖', label: 'Linguistics', color: '#F59E0B' },
  spatial: { emoji: '🗺️', label: 'Spatial', color: '#10B981' },
  attention: { emoji: '🎯', label: 'Attention', color: '#EC4899' },
  'processing-speed': { emoji: '⚡', label: 'Processing Speed', color: '#3B82F6' },
};

export default function CognitiveAssessmentUI() {
  const router = useRouter();
  const { submitAssessment, baselineProgress, isBaselineComplete, startBaseline, completeBaseline } = useCognitiveStore();

  const [started, setStarted] = useState(false);
  const [currentDomainIndex, setCurrentDomainIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [scores, setScores] = useState<Record<CognitiveDomain, { correct: number; total: number; timeMs: number }>>({} as Record<CognitiveDomain, { correct: number; total: number; timeMs: number }>);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [domainStartTime, setDomainStartTime] = useState(Date.now());

  const domains = Object.keys(DOMAIN_INFO) as CognitiveDomain[];
  const currentDomain = domains[currentDomainIndex];
  const questions = ASSESSMENT_QUESTIONS[currentDomain];
  const currentQuestion = questions[currentQuestionIndex];
  const info = DOMAIN_INFO[currentDomain];

  const handleStart = () => {
    startBaseline();
    setStarted(true);
    setDomainStartTime(Date.now());
    setQuestionStartTime(Date.now());
  };

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const handleNext = () => {
    const timeTaken = Date.now() - questionStartTime;
    const isCorrect = selectedAnswer === currentQuestion.correct;

    setScores(prev => ({
      ...prev,
      [currentDomain]: {
        correct: (prev[currentDomain]?.correct || 0) + (isCorrect ? 1 : 0),
        total: (prev[currentDomain]?.total || 0) + 1,
        timeMs: (prev[currentDomain]?.timeMs || 0) + timeTaken,
      },
    }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setQuestionStartTime(Date.now());
    } else {
      const domainScore = (scores[currentDomain]?.correct || 0) + (isCorrect ? 1 : 0);
      const domainTotal = (scores[currentDomain]?.total || 0) + 1;
      const domainTime = (scores[currentDomain]?.timeMs || 0) + (Date.now() - questionStartTime);

      submitAssessment({
        domain: currentDomain,
        score: domainScore,
        maxScore: domainTotal,
        timeTakenMs: domainTime,
        questionsAttempted: domainTotal,
        questionsCorrect: domainScore,
      });

      if (currentDomainIndex < domains.length - 1) {
        setCurrentDomainIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setQuestionStartTime(Date.now());
      } else {
        completeBaseline();
      }
    }
  };

  const overallProgress = ((currentDomainIndex * 4 + currentQuestionIndex) / (domains.length * 4)) * 100;

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <span className="text-6xl mb-6 block">🧠</span>
          <h1 className="text-3xl font-bold text-white mb-3">Cognitive Baseline Assessment</h1>
          <p className="text-gray-400 mb-8">
            Discover how your brain works! This quick assessment maps your strengths across 6 cognitive domains.
            It takes about 10 minutes and helps us personalize your learning journey.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {domains.map(domain => (
              <div key={domain} className="p-3 rounded-xl bg-gray-800/50 border border-gray-700">
                <span className="text-2xl">{DOMAIN_INFO[domain].emoji}</span>
                <p className="text-xs text-gray-400 mt-1">{DOMAIN_INFO[domain].label}</p>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg"
          >
            Start Assessment 🚀
          </motion.button>

          <button
            onClick={() => router.push('/dashboard')}
            className="block mx-auto mt-4 text-sm text-gray-500 hover:text-gray-300"
          >
            Skip for now
          </button>
        </motion.div>
      </div>
    );
  }

  if (isBaselineComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <span className="text-6xl mb-6 block">🎉</span>
          <h1 className="text-3xl font-bold text-white mb-3">Assessment Complete!</h1>
          <p className="text-gray-400 mb-8">
            Your cognitive profile is ready. We will use this to personalize your learning experience.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {domains.map(domain => {
              const score = scores[domain];
              const pct = score ? Math.round((score.correct / score.total) * 100) : 0;
              return (
                <div key={domain} className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                  <span className="text-2xl">{DOMAIN_INFO[domain].emoji}</span>
                  <p className="text-sm font-semibold text-white mt-1">{DOMAIN_INFO[domain].label}</p>
                  <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: DOMAIN_INFO[domain].color }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{pct}%</p>
                </div>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/dashboard')}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg"
          >
            Go to Dashboard 🏠
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Exit
          </button>
          <div className="text-sm text-gray-400">
            {currentDomainIndex + 1}/{domains.length} · Question {currentQuestionIndex + 1}/{questions.length}
          </div>
        </div>

        <div className="w-full h-2 bg-gray-800 rounded-full mb-8">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: info.color }}
            animate={{ width: `${overallProgress}%` }}
          />
        </div>

        <div className="text-center mb-8">
          <span className="text-4xl mb-3 block">{info.emoji}</span>
          <h2 className="text-xl font-bold text-white">{info.label}</h2>
        </div>

        <motion.div
          key={`${currentDomainIndex}-${currentQuestionIndex}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700 mb-6"
        >
          <p className="text-lg text-white mb-6">{currentQuestion.question}</p>

          <div className="space-y-3">
            {currentQuestion.options.map((option, i) => {
              let bgClass = 'bg-gray-700/50 hover:bg-gray-700 border-gray-600';
              if (showResult) {
                if (i === currentQuestion.correct) bgClass = 'bg-green-500/20 border-green-500';
                else if (i === selectedAnswer) bgClass = 'bg-red-500/20 border-red-500';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${bgClass} ${
                    showResult ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <span className="text-white">{option}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold"
              >
                {currentQuestionIndex < questions.length - 1 || currentDomainIndex < domains.length - 1
                  ? 'Next →'
                  : 'See Results 🎉'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
