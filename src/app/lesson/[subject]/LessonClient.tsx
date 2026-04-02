'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { getUserProfile, updateXP, logLessonSession, logIntervention } from '@/lib/firestore';
import { SUBJECTS } from '@/lib/constants';
import type { UserProfile, LessonContent } from '@/types';
import GameHUD from '@/components/game/GameHUD';
import BossArena from '@/components/game/BossArena';
import QuickEmotionCheck from '@/components/QuickEmotionCheck';
import BrainBreakModal from '@/components/BrainBreakModal';
import toast from 'react-hot-toast';

/* ── Boss config per subject ── */
const BOSS_CONFIG: Record<string, { name: string; emoji: string; color: string; bgGradient: string }> = {
  math:                 { name: 'The Equation Dragon',  emoji: '🐉', color: '#8B5CF6', bgGradient: 'linear-gradient(135deg, #0f0c29 0%, #1a0533 100%)' },
  science:              { name: 'The Atom Golem',        emoji: '🤖', color: '#14B8A6', bgGradient: 'linear-gradient(135deg, #022c22 0%, #0d2130 100%)' },
  english:              { name: 'The Grammar Sphinx',    emoji: '🦁', color: '#3B82F6', bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' },
  'social-skills':      { name: 'The Shyness Shadow',   emoji: '👻', color: '#F97316', bgGradient: 'linear-gradient(135deg, #1c0a00 0%, #2c1400 100%)' },
  'emotional-regulation':{ name: 'The Storm Giant',     emoji: '⛈️', color: '#EC4899', bgGradient: 'linear-gradient(135deg, #1f0024 0%, #0c0020 100%)' },
};

const REALM_NAMES: Record<string, string> = {
  math: 'Crystal Caves',
  science: 'Volcano Lab',
  english: 'Sky Library',
  'social-skills': 'Town Square',
  'emotional-regulation': 'Zen Temple',
};

type QuizPhaseState = {
  currentQ: number;
  answered: boolean;
  selected: number | null;
  showEmotionCheck: boolean;
  results: boolean[];
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params?.subject as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [lesson, setLesson] = useState<LessonContent & { ibTopicKey?: string } | null>(null);
  const [loading, setLoading] = useState(true); // lesson still generating
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [currentSection, setCurrentSection] = useState(0);
  const [phase, setPhase] = useState<'intro' | 'lesson' | 'quiz' | 'complete'>('intro');
  const [quizState, setQuizState] = useState<QuizPhaseState>({
    currentQ: 0, answered: false, selected: null, showEmotionCheck: false, results: [],
  });
  const [tutorMsg, setTutorMsg] = useState<string | null>(null);
  const [frustrationCount, setFrustrationCount] = useState(0);
  const [showBrainBreak, setShowBrainBreak] = useState(false);
  const [playerHP, setPlayerHP] = useState(3);
  const [bossHP, setBossHP] = useState(3);
  const [shaking, setShaking] = useState(false);
  const [xpPopups, setXpPopups] = useState<{ id: number; amount: number }[]>([]);
  const popupId = useRef(0);
  const confettiDone = useRef(false);

  const subject = SUBJECTS.find((s) => s.id === subjectId);
  const boss = BOSS_CONFIG[subjectId] ?? BOSS_CONFIG.math;
  const realmName = REALM_NAMES[subjectId] ?? 'The Realm';
  const level = Math.floor((profile?.xp ?? 0) / 100) + 1;
  const isRTL = profile?.language === 'AR';

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.replace('/auth'); return; }
      const p = await getUserProfile(user.uid);
      if (!p?.name) { router.replace('/onboarding'); return; }
      setProfile(p);
      // Show intro immediately — generate lesson in background
      setLoading(false);
      try {
        const { getSubjectDifficulty } = await import('@/lib/firestore');
        const diff = await getSubjectDifficulty(user.uid, subjectId);
        setDifficulty(diff);
        generateLesson(p, diff); // intentionally not awaited
      } catch {
        generateLesson(p, 'medium'); // intentionally not awaited
      }
    });
    return () => unsub();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, subjectId]);

  async function generateLesson(p: UserProfile, diff: string) {
    setLoading(true); // lesson loading in background
    try {
      const res = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subjectId, grade: p.grade, language: p.language,
          studentName: p.name, emotion: p.currentEmotion, difficulty: diff,
        }),
      });
      const data = await res.json();
      setLesson(data.lesson);
      setBossHP(data.lesson.quiz?.length ?? 3);
    } catch {
      toast.error('Could not load quest. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function triggerXPPopup(amount: number) {
    const id = ++popupId.current;
    setXpPopups((prev) => [...prev, { id, amount }]);
    setTimeout(() => setXpPopups((prev) => prev.filter((p) => p.id !== id)), 1200);
  }

  async function handleAnswer(optionIndex: number) {
    if (quizState.answered || !lesson || !profile) return;
    const q = lesson.quiz[quizState.currentQ];
    const correct = optionIndex === q.correct;

    setQuizState((prev) => ({ ...prev, answered: true, selected: optionIndex }));

    if (correct) {
      setBossHP((prev) => Math.max(0, prev - 1));
      triggerXPPopup(15);
      toast.success('+15 XP ⚔️', { duration: 1000 });
      setTimeout(() => advanceQuiz(true), 2000);
    } else {
      // Screen shake + HP loss
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setPlayerHP((prev) => Math.max(0, prev - 1));

      try {
        const res = await fetch('/api/tutor-explanation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: q.question, studentAnswer: q.options[optionIndex],
            correctAnswer: q.options[q.correct], studentName: profile.name,
            grade: profile.grade, language: profile.language,
          }),
        });
        const data = await res.json();
        setTutorMsg(data.explanation);
      } catch {
        setTutorMsg(q.explanation);
      }
      setQuizState((prev) => ({ ...prev, showEmotionCheck: true }));
    }
  }

  function handleEmotionCheck(feeling: 'fine' | 'ok' | 'frustrated') {
    setQuizState((prev) => ({ ...prev, showEmotionCheck: false }));
    if (feeling === 'frustrated') {
      const newCount = frustrationCount + 1;
      setFrustrationCount(newCount);
      if (newCount >= 2 && profile) {
        logIntervention(profile.uid, 'frustrated');
        setShowBrainBreak(true);
        setFrustrationCount(0);
        return;
      }
    }
    advanceQuiz(false);
  }

  function advanceQuiz(wasCorrect: boolean) {
    setQuizState((prev) => {
      const newResults = [...prev.results, wasCorrect];
      const nextQ = prev.currentQ + 1;
      if (nextQ >= (lesson?.quiz.length ?? 3)) {
        finishQuiz(newResults);
        return prev;
      }
      setTutorMsg(null);
      return { currentQ: nextQ, answered: false, selected: null, showEmotionCheck: false, results: newResults };
    });
  }

  async function finishQuiz(results: boolean[]) {
    if (!lesson || !profile) return;
    const correct = results.filter(Boolean).length;
    const xpEarned = correct * 15 + 10;

    await Promise.all([
      updateXP(profile.uid, xpEarned, profile.xp),
      logLessonSession(profile.uid, { subject: subjectId, grade: profile.grade, correct, total: lesson.quiz.length, xpEarned }),
    ]);
    setProfile({ ...profile, xp: profile.xp + xpEarned });

    if (correct >= Math.ceil(lesson.quiz.length / 2) && !confettiDone.current) {
      confettiDone.current = true;
      const confetti = (await import('canvas-confetti')).default;
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 }, colors: [boss.color, '#14B8A6', '#F97316', '#FFD166'] });
    }
    setPhase('complete');
  }

  /* ── Subject not found ── */
  if (!subject) return (
    <div className="min-h-screen game-world flex items-center justify-center">
      <p className="text-white font-nunito">Subject not found</p>
    </div>
  );

  /* ── INTRO (shown immediately, lesson loads in background) ── */
  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center game-world px-4"
        style={{ background: boss.bgGradient }} dir={isRTL ? 'rtl' : 'ltr'}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm w-full text-center space-y-6">
          {/* Portal */}
          <div className="relative inline-block">
            <motion.div className="w-36 h-36 rounded-full mx-auto"
              animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{ background: `conic-gradient(${boss.color}, transparent 60%, ${boss.color})`, filter: `drop-shadow(0 0 24px ${boss.color})` }} />
            <div className="absolute inset-4 rounded-full flex items-center justify-center text-6xl"
              style={{ background: boss.bgGradient }}>
              {subject.emoji}
            </div>
          </div>

          <div>
            <p className="text-xs font-nunito font-black uppercase tracking-widest mb-1" style={{ color: boss.color }}>
              ⚔️ {isRTL ? 'المهمة' : 'Quest Realm'}
            </p>
            <h1 className="font-nunito font-black text-white text-3xl">{realmName}</h1>
            <p className="text-gray-400 font-dmsans text-sm mt-1">{subject.description}</p>
          </div>

          {/* Boss preview */}
          <div className="rounded-2xl p-4 flex items-center gap-4"
            style={{ background: `${boss.color}18`, border: `1px solid ${boss.color}44` }}>
            <span className="text-4xl boss-float inline-block">{boss.emoji}</span>
            <div className="text-left">
              <p className="text-xs text-gray-400 font-dmsans">{isRTL ? 'الخصم' : 'Boss'}</p>
              <p className="font-nunito font-black text-white text-sm">{boss.name}</p>
              <p className="text-xs font-dmsans capitalize" style={{ color: boss.color }}>{difficulty} difficulty</p>
            </div>
          </div>

          {/* Enter button — active once lesson ready */}
          <motion.button
            onClick={() => { if (lesson) setPhase('lesson'); }}
            disabled={loading}
            className="w-full text-white font-nunito font-black py-4 rounded-2xl text-lg relative overflow-hidden disabled:opacity-70"
            style={{ background: `linear-gradient(135deg, ${boss.color}, #14B8A6)` }}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}>
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block">⚙️</motion.span>
                {isRTL ? 'جارٍ تحضير المهمة...' : 'Preparing Quest...'}
              </span>
            ) : (
              <span>⚔️ {isRTL ? 'ادخل المعركة!' : 'Enter Quest!'}</span>
            )}
          </motion.button>

          <button onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-500 font-dmsans hover:text-gray-300 transition-colors">
            ← {isRTL ? 'العودة' : 'Back to Base Camp'}
          </button>
        </motion.div>
      </div>
    );
  }

  if (!lesson) return null;

  /* ── COMPLETE / VICTORY ── */
  if (phase === 'complete') {
    const correct = quizState.results.filter(Boolean).length;
    const xpEarned = correct * 15 + 10;
    const bossDefeated = correct >= Math.ceil(lesson.quiz.length / 2);

    return (
      <div className="min-h-screen flex flex-col game-world" style={{ background: boss.bgGradient }} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <motion.div className="max-w-md w-full text-center space-y-5"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            {/* Trophy / defeat icon */}
            <motion.div
              className={`text-9xl inline-block ${bossDefeated ? 'treasure-glow' : ''}`}
              animate={bossDefeated ? { rotate: [-5, 5, -3, 3, 0], scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.8 }}>
              {bossDefeated ? '🏆' : '💀'}
            </motion.div>

            <h1 className="font-nunito text-3xl font-black text-white">
              {bossDefeated
                ? (isRTL ? 'انتصار أسطوري! 🔥' : 'Legendary Victory! 🔥')
                : (isRTL ? 'ستنتصر في المرة القادمة! 💪' : 'You\'ll win next time! 💪')}
            </h1>

            <p className="text-gray-300 font-dmsans text-sm">
              {bossDefeated
                ? `${boss.name} has been defeated!`
                : `${boss.name} survived... but so did you.`}
            </p>

            {/* Stats card */}
            <div className="rounded-3xl p-5 space-y-3 quest-scroll">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '⭐', value: `+${xpEarned}`, label: isRTL ? 'خبرة' : 'XP Earned', color: 'text-yellow-400' },
                  { icon: '⚔️', value: `${correct}/${lesson.quiz.length}`, label: isRTL ? 'نقاط' : 'Score', color: 'text-green-400' },
                  { icon: '❤️', value: `${playerHP}/3`, label: isRTL ? 'أرواح' : 'Lives Left', color: 'text-red-400' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className={`font-nunito font-black text-lg ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-gray-500 font-dmsans">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-3">
                <p className="text-xs font-nunito font-bold text-gray-400 uppercase mb-1">
                  {isRTL ? 'نصيحة القائد' : 'Commander\'s Note'}
                </p>
                <p className="text-gray-300 font-dmsans text-xs leading-relaxed">{lesson.encouragement}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => router.push('/dashboard')}
                className="flex-1 border border-white/20 text-white font-nunito font-black py-3.5 rounded-2xl hover:bg-white/10 transition-all">
                {isRTL ? '← القاعدة' : '← Base Camp'}
              </button>
              <button
                onClick={() => {
                  setLesson(null); setPhase('intro'); setCurrentSection(0);
                  setQuizState({ currentQ:0, answered:false, selected:null, showEmotionCheck:false, results:[] });
                  setTutorMsg(null); setPlayerHP(3); confettiDone.current = false;
                  if (profile) generateLesson(profile, difficulty);
                }}
                className="flex-1 btn-game-primary text-white font-nunito font-black py-3.5 rounded-2xl">
                {isRTL ? 'قتال مجدداً 🔄' : 'Rematch 🔄'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── QUIZ / BATTLE ── */
  if (phase === 'quiz') {
    const q = lesson.quiz[quizState.currentQ];
    return (
      <div className={`min-h-screen flex flex-col game-world ${shaking ? 'shake' : ''}`}
        style={{ background: boss.bgGradient }}>
        <GameHUD
          playerHP={playerHP} maxHP={3}
          xp={profile?.xp ?? 0} level={level}
          questName={`${boss.name} — ${lesson.title}`}
          questionIndex={quizState.currentQ}
          totalQuestions={lesson.quiz.length}
          phase="battle"
          subjectColor={boss.color}
        />

        {/* XP pop-ups */}
        <div className="fixed inset-0 pointer-events-none z-50">
          {xpPopups.map((p) => (
            <div key={p.id} className="absolute top-1/2 left-1/2 -translate-x-1/2 xp-float">
              <span className="font-nunito font-black text-2xl text-yellow-400 drop-shadow-lg">+{p.amount} XP</span>
            </div>
          ))}
        </div>

        <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 space-y-4">
          <BossArena
            bossName={boss.name}
            bossEmoji={boss.emoji}
            bossColor={boss.color}
            bossHP={bossHP}
            bossMaxHP={lesson.quiz.length}
            question={q.question}
            options={q.options}
            correctIndex={q.correct}
            answered={quizState.answered}
            selected={quizState.selected}
            onAnswer={handleAnswer}
            questionIndex={quizState.currentQ}
            isRTL={isRTL}
            tutorMsg={tutorMsg}
          />

          {quizState.showEmotionCheck && (
            <QuickEmotionCheck onSelect={handleEmotionCheck} />
          )}
        </div>

        {showBrainBreak && <BrainBreakModal onClose={() => { setShowBrainBreak(false); advanceQuiz(false); }} />}
      </div>
    );
  }

  /* ── LESSON READING ── */
  const sec = lesson.sections[currentSection];
  const isLast = currentSection === lesson.sections.length - 1;

  return (
    <div className="min-h-screen flex flex-col game-world" style={{ background: boss.bgGradient }} dir={isRTL ? 'rtl' : 'ltr'}>
      <GameHUD
        playerHP={playerHP} maxHP={3}
        xp={profile?.xp ?? 0} level={level}
        questName={`${realmName}: ${lesson.title}`}
        phase="quest"
        subjectColor={boss.color}
      />

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-4">
        {/* Realm banner */}
        {currentSection === 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl px-5 py-4 flex items-center gap-4"
            style={{ background: `${boss.color}22`, border: `1.5px solid ${boss.color}55` }}>
            <span className="text-4xl">{subject.emoji}</span>
            <div>
              <p className="font-nunito font-black text-white text-lg">{lesson.title}</p>
              <p className="text-gray-400 font-dmsans text-xs mt-0.5">{lesson.intro}</p>
            </div>
          </motion.div>
        )}

        {/* Section progress dots */}
        <div className="flex items-center gap-2 px-1">
          {lesson.sections.map((_, i) => (
            <motion.div key={i}
              className="rounded-full transition-all duration-500"
              style={{
                height: 6,
                flex: i === currentSection ? 3 : 1,
                background: i < currentSection ? boss.color : i === currentSection ? boss.color : 'rgba(255,255,255,0.15)',
                opacity: i <= currentSection ? 1 : 0.4,
              }} />
          ))}
          <span className="text-xs text-gray-500 font-dmsans ml-1">{currentSection + 1}/{lesson.sections.length}</span>
        </div>

        {/* Content scroll */}
        <AnimatePresence mode="wait">
          <motion.div key={currentSection}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}
            className="quest-scroll rounded-3xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-nunito font-black flex-shrink-0"
                style={{ background: boss.color, color: '#fff' }}>
                {currentSection + 1}
              </span>
              <h2 className="font-nunito font-black text-white text-xl pt-1">{sec.heading}</h2>
            </div>

            <p className="font-dmsans text-gray-300 leading-relaxed text-sm">{sec.content}</p>

            {sec.activity && (
              <div className="rounded-2xl p-4"
                style={{ background: `${boss.color}18`, border: `1px solid ${boss.color}44` }}>
                <p className="text-xs font-nunito font-black uppercase mb-1.5" style={{ color: boss.color }}>
                  🎯 {isRTL ? 'التحدي' : 'Challenge'}
                </p>
                <p className="text-sm text-gray-300 font-dmsans">{sec.activity}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentSection > 0 && (
            <button onClick={() => setCurrentSection((c) => c - 1)}
              className="flex-1 border border-white/20 text-white font-nunito font-black py-3.5 rounded-2xl hover:bg-white/10 transition-all">
              ← {isRTL ? 'السابق' : 'Previous'}
            </button>
          )}
          {!isLast ? (
            <button onClick={() => setCurrentSection((c) => c + 1)}
              className="flex-1 btn-game-primary text-white font-nunito font-black py-3.5 rounded-2xl">
              {isRTL ? 'التالي →' : 'Next →'}
            </button>
          ) : (
            <motion.button
              onClick={() => { setPhase('quiz'); setQuizState({ currentQ:0, answered:false, selected:null, showEmotionCheck:false, results:[] }); }}
              className="flex-1 text-white font-nunito font-black py-3.5 rounded-2xl relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${boss.color}, #14B8A6)` }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <span className="relative z-10">⚔️ {isRTL ? 'ابدأ المعركة!' : 'Enter Battle!'}</span>
            </motion.button>
          )}
        </div>

        {/* Brain break button */}
        <button onClick={() => setShowBrainBreak(true)}
          className="w-full text-center text-xs text-gray-500 font-dmsans py-1 hover:text-gray-300 transition-colors">
          🧘 {isRTL ? 'أخذ استراحة' : 'Take a Brain Break'}
        </button>
      </div>

      {showBrainBreak && <BrainBreakModal onClose={() => setShowBrainBreak(false)} />}
    </div>
  );
}
