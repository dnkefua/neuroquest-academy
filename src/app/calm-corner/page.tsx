'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { getUserProfile, updateEmotion } from '@/lib/firestore';
import type { UserProfile, EmotionKey } from '@/types';
import { EMOTIONS } from '@/lib/constants';
import BreathingCircle from '@/components/BreathingCircle';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

type Tab = 'breathe' | 'ground' | 'move' | 'visualize';
type Phase = 'check-in' | 'activities' | 'check-out';

const GROUNDING_PROMPTS = [
  { emoji: '👀', text: 'Name 5 things you can SEE right now...', count: 5 },
  { emoji: '✋', text: 'Name 4 things you can TOUCH around you...', count: 4 },
  { emoji: '👂', text: 'Name 3 things you can HEAR...', count: 3 },
  { emoji: '👃', text: 'Name 2 things you can SMELL...', count: 2 },
  { emoji: '👅', text: 'Name 1 thing you can TASTE...', count: 1 },
];

const MOVEMENT_ACTIVITIES = [
  { name: 'Shake It Out', emoji: '🕺', instruction: 'Stand up and shake your hands for 10 seconds, then your arms, then your whole body!', duration: 30 },
  { name: 'Mindful Stretch', emoji: '🧘', instruction: 'Reach your arms up high, then slowly bend to each side. Hold each stretch for 5 breaths.', duration: 45 },
  { name: 'Neck Rolls', emoji: '🔄', instruction: 'Slowly roll your neck in circles — 3 one way, 3 the other. Go gently!', duration: 30 },
  { name: 'Shoulder Squeeze', emoji: '💪', instruction: 'Squeeze your shoulders up to your ears, hold for 3 counts, then release. Repeat 5 times.', duration: 30 },
  { name: 'Toe Taps', emoji: '🦶', instruction: 'Tap your right toe 5 times, then your left toe 5 times. Alternate and feel the rhythm!', duration: 20 },
  { name: 'Butterfly Hug', emoji: '🦋', instruction: 'Cross your arms over your chest and gently tap your shoulders, alternating left and right.', duration: 30 },
];

const VISUALIZATION_SCRIPTS = [
  {
    title: 'Safe Place',
    emoji: '🏝️',
    script: 'Close your eyes. Imagine a place where you feel completely safe and happy. It could be real or imaginary. Notice the colors around you. Feel the temperature on your skin. Hear the gentle sounds. You are safe here.',
  },
  {
    title: 'Floating Cloud',
    emoji: '☁️',
    script: 'Imagine you are a soft, fluffy cloud floating in a bright blue sky. With each breath, you float higher and lighter. Your worries drift away like other clouds passing by. You are peaceful and free.',
  },
  {
    title: 'Warm Light',
    emoji: '✨',
    script: 'Picture a warm, golden light above your head. As you breathe in, the light slowly moves down through your body, relaxing every part it touches. Your head, your shoulders, your arms, your chest, your legs. You are filled with calm, warm light.',
  },
];

function FloatingParticle({ delay, x, duration }: { delay: number; x: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 4 + Math.random() * 8,
        height: 4 + Math.random() * 8,
        left: `${x}%`,
        bottom: '-10px',
        background: `rgba(168, 218, 220, ${0.2 + Math.random() * 0.3})`,
      }}
      animate={{
        y: -window.innerHeight - 50,
        x: [0, Math.sin(delay) * 30, 0],
        opacity: [0, 0.6, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

function EmotionSelector({
  title,
  subtitle,
  onSelect,
  selected,
}: {
  title: string;
  subtitle: string;
  onSelect: (emotion: EmotionKey) => void;
  selected?: EmotionKey | null;
}) {
  return (
    <div className="text-center">
      <h2 className="font-nunito text-2xl font-black text-gray-800 mb-1">{title}</h2>
      <p className="font-dmsans text-gray-500 mb-6">{subtitle}</p>
      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
        {EMOTIONS.map((e) => (
          <motion.button
            key={e.key}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(e.key)}
            className={`p-4 rounded-2xl border-2 transition-all ${
              selected === e.key
                ? `${e.bg} ${e.color} border-current shadow-lg`
                : 'border-gray-100 hover:border-purple-200 bg-white'
            }`}
          >
            <div className="text-4xl mb-2">{e.emoji}</div>
            <div className={`text-xs font-nunito font-bold ${selected === e.key ? e.color : 'text-gray-500'}`}>
              {e.label}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function BreathingExercise() {
  return (
    <div className="text-center">
      <h3 className="font-nunito text-xl font-black text-gray-800 mb-2">Box Breathing</h3>
      <p className="font-dmsans text-gray-500 mb-6 text-sm">
        Breathe in for 4, hold for 4, out for 4, hold for 4
      </p>
      <BreathingCircle />
    </div>
  );
}

function GroundingExercise() {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  const handleNext = useCallback(() => {
    setCompleted((prev) => [...prev, step]);
    if (step < GROUNDING_PROMPTS.length - 1) {
      setStep((s) => s + 1);
    }
  }, [step]);

  const handleReset = useCallback(() => {
    setStep(0);
    setCompleted([]);
  }, []);

  const isComplete = step >= GROUNDING_PROMPTS.length - 1 && completed.length === GROUNDING_PROMPTS.length;

  return (
    <div className="text-center">
      <h3 className="font-nunito text-xl font-black text-gray-800 mb-2">5-4-3-2-1 Grounding</h3>
      <p className="font-dmsans text-gray-500 mb-6 text-sm">
        Use your senses to connect with the present moment
      </p>

      <div className="flex justify-center gap-2 mb-6">
        {GROUNDING_PROMPTS.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              completed.includes(i) ? 'bg-brand-teal' : i === step ? 'bg-brand-teal/50 animate-pulse' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 mb-6 border border-teal-100"
          >
            <div className="text-5xl mb-4">{GROUNDING_PROMPTS[step].emoji}</div>
            <p className="font-nunito font-bold text-teal-800 text-lg mb-2">
              {GROUNDING_PROMPTS[step].text}
            </p>
            <p className="font-dmsans text-teal-600 text-sm">
              Think of {GROUNDING_PROMPTS[step].count} thing{GROUNDING_PROMPTS[step].count > 1 ? 's' : ''}...
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 mb-6 border border-teal-100"
          >
            <div className="text-5xl mb-4">🌟</div>
            <p className="font-nunito font-black text-teal-800 text-xl mb-2">
              You&apos;re grounded and present!
            </p>
            <p className="font-dmsans text-teal-600">Great job connecting with your senses.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center gap-3">
        {!isComplete ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="bg-brand-teal text-white font-nunito font-black px-8 py-3 rounded-2xl hover:opacity-90 transition-all"
          >
            {step === 0 ? 'Start' : 'Done, Next →'}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="bg-brand-teal text-white font-nunito font-black px-8 py-3 rounded-2xl hover:opacity-90 transition-all"
          >
            Do It Again 🔄
          </motion.button>
        )}
      </div>
    </div>
  );
}

function MovementExercise() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setCompletedCount((c) => c + 1);
    }
  }, [timeLeft, isRunning]);

  const startExercise = useCallback(() => {
    setTimeLeft(MOVEMENT_ACTIVITIES[currentIndex].duration);
    setIsRunning(true);
  }, [currentIndex]);

  const nextExercise = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % MOVEMENT_ACTIVITIES.length);
    setIsRunning(false);
    setTimeLeft(0);
  }, []);

  const activity = MOVEMENT_ACTIVITIES[currentIndex];
  const progress = activity.duration > 0 ? ((activity.duration - timeLeft) / activity.duration) * 100 : 0;

  return (
    <div className="text-center">
      <h3 className="font-nunito text-xl font-black text-gray-800 mb-2">Movement Break</h3>
      <p className="font-dmsans text-gray-500 mb-2 text-sm">
        Get your body moving to reset your mind
      </p>
      {completedCount > 0 && (
        <p className="font-nunito text-sm text-brand-teal font-bold mb-4">
          ✅ {completedCount} completed!
        </p>
      )}

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 mb-6 border border-purple-100"
      >
        <div className="text-6xl mb-4">{activity.emoji}</div>
        <h4 className="font-nunito text-lg font-black text-gray-800 mb-2">{activity.name}</h4>
        <p className="font-dmsans text-gray-600 leading-relaxed mb-4">{activity.instruction}</p>

        {isRunning && (
          <div className="mb-4">
            <div className="w-full bg-purple-100 rounded-full h-3 mb-2">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="font-nunito font-black text-2xl text-brand-purple">{timeLeft}s</p>
          </div>
        )}
      </motion.div>

      <div className="flex justify-center gap-3">
        {!isRunning && timeLeft === 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startExercise}
            className="bg-brand-purple text-white font-nunito font-black px-8 py-3 rounded-2xl hover:opacity-90 transition-all"
          >
            Start {activity.name} ▶
          </motion.button>
        )}
        {isRunning && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRunning(false)}
            className="bg-gray-200 text-gray-700 font-nunito font-bold px-6 py-3 rounded-2xl hover:bg-gray-300 transition-all"
          >
            Pause ⏸
          </motion.button>
        )}
        {!isRunning && timeLeft > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRunning(true)}
            className="bg-brand-purple text-white font-nunito font-black px-6 py-3 rounded-2xl hover:opacity-90 transition-all"
          >
            Resume ▶
          </motion.button>
        )}
        {!isRunning && timeLeft === 0 && completedCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextExercise}
            className="bg-brand-teal text-white font-nunito font-black px-6 py-3 rounded-2xl hover:opacity-90 transition-all"
          >
            Next Activity →
          </motion.button>
        )}
      </div>
    </div>
  );
}

function VisualizationExercise() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => setElapsed((e) => e + 1), 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, elapsed]);

  const script = VISUALIZATION_SCRIPTS[currentIndex];

  return (
    <div className="text-center">
      <h3 className="font-nunito text-xl font-black text-gray-800 mb-2">Guided Visualization</h3>
      <p className="font-dmsans text-gray-500 mb-6 text-sm">
        Close your eyes and imagine...
      </p>

      <div className="flex justify-center gap-2 mb-6">
        {VISUALIZATION_SCRIPTS.map((s, i) => (
          <button
            key={s.title}
            onClick={() => {
              setCurrentIndex(i);
              setIsPlaying(false);
              setElapsed(0);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-nunito font-bold transition-all ${
              i === currentIndex
                ? 'bg-brand-purple text-white shadow-md'
                : 'bg-purple-50 text-gray-500 hover:bg-purple-100'
            }`}
          >
            {s.emoji} {s.title}
          </button>
        ))}
      </div>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 mb-6 border border-indigo-100"
      >
        <div className="text-5xl mb-4">{script.emoji}</div>
        <p className="font-dmsans text-gray-700 leading-relaxed text-base italic">
          &ldquo;{script.script}&rdquo;
        </p>
      </motion.div>

      {isPlaying && (
        <p className="font-nunito text-sm text-gray-400 mb-4">
          Listening for {elapsed}s... breathe slowly
        </p>
      )}

      <div className="flex justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-indigo-500 text-white font-nunito font-black px-8 py-3 rounded-2xl hover:opacity-90 transition-all"
        >
          {isPlaying ? 'Pause ⏸' : 'Begin Visualization ✨'}
        </motion.button>
      </div>
    </div>
  );
}

async function logCalmCornerSession(uid: string, data: {
  beforeEmotion: string;
  afterEmotion: string | null;
  activitiesUsed: string[];
  durationSeconds: number;
}) {
  try {
    await addDoc(collection(db, 'users', uid, 'calmCornerSessions'), {
      ...data,
      timestamp: new Date().toISOString(),
    });
  } catch {
    // Silently fail if Firestore is unavailable
  }
}

export default function CalmCornerPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>('check-in');
  const [tab, setTab] = useState<Tab>('breathe');
  const [beforeEmotion, setBeforeEmotion] = useState<EmotionKey | null>(null);
  const [afterEmotion, setAfterEmotion] = useState<EmotionKey | null>(null);
  const [sessionStart] = useState(Date.now());
  const [activitiesUsed, setActivitiesUsed] = useState<Set<Tab>>(new Set());

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.replace('/auth'); return; }
      const p = await getUserProfile(user.uid);
      if (!p?.name) { router.replace('/onboarding'); return; }
      setProfile(p);
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  const handleBeforeEmotion = useCallback(async (emotion: EmotionKey) => {
    setBeforeEmotion(emotion);
    if (profile) {
      await updateEmotion(profile.uid, emotion);
    }
    setPhase('activities');
  }, [profile]);

  const handleAfterEmotion = useCallback(async (emotion: EmotionKey) => {
    setAfterEmotion(emotion);
    if (profile) {
      await updateEmotion(profile.uid, emotion);
      const durationSeconds = Math.round((Date.now() - sessionStart) / 1000);
      await logCalmCornerSession(profile.uid, {
        beforeEmotion: beforeEmotion ?? 'neutral',
        afterEmotion: emotion,
        activitiesUsed: Array.from(activitiesUsed),
        durationSeconds,
      });
    }
    setPhase('check-in');
    router.push('/dashboard');
  }, [profile, beforeEmotion, activitiesUsed, sessionStart, router]);

  const handleTabChange = useCallback((newTab: Tab) => {
    setTab(newTab);
    setActivitiesUsed((prev) => new Set(prev).add(newTab));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #E8F4F8 0%, #F0E6FF 50%, #FFF0F5 100%)' }}>
        <div className="text-center">
          <motion.div className="text-6xl mb-4" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            🧘
          </motion.div>
          <p className="font-nunito text-xl text-purple-600 font-bold">Entering Calm Corner...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const isRTL = profile.language === 'AR';

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ background: 'linear-gradient(160deg, #E8F4F8 0%, #F0E6FF 50%, #FFF0F5 100%)' }}
    >
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 2}
            x={(i * 17 + 5) % 100}
            duration={15 + i * 2}
          />
        ))}
      </div>

      {/* Header */}
      <header className="bg-white/60 backdrop-blur-md border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧘</span>
            <span className="font-nunito font-black text-purple-700 text-lg">Calm Corner</span>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-500 font-dmsans hover:text-gray-700 bg-white/50 px-4 py-2 rounded-xl transition-all"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {phase === 'check-in' && (
            <motion.div
              key="check-in"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card"
            >
              <EmotionSelector
                title="How are you feeling right now?"
                subtitle="Take a moment to check in with yourself"
                onSelect={handleBeforeEmotion}
                selected={beforeEmotion}
              />
            </motion.div>
          )}

          {phase === 'activities' && (
            <motion.div
              key="activities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Tabs */}
              <div className="flex bg-white/70 backdrop-blur-sm rounded-2xl p-1.5 mb-6 gap-1 shadow-sm">
                {([
                  { key: 'breathe' as Tab, label: '🫧 Breathe' },
                  { key: 'ground' as Tab, label: '🌟 Ground' },
                  { key: 'move' as Tab, label: '🕺 Move' },
                  { key: 'visualize' as Tab, label: '✨ Imagine' },
                ]).map((t) => (
                  <button
                    key={t.key}
                    onClick={() => handleTabChange(t.key)}
                    className={`flex-1 py-3 rounded-xl text-sm font-nunito font-bold transition-all ${
                      tab === t.key
                        ? 'bg-white text-brand-purple shadow-md'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Activity Content */}
              <div className="card">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {tab === 'breathe' && <BreathingExercise />}
                    {tab === 'ground' && <GroundingExercise />}
                    {tab === 'move' && <MovementExercise />}
                    {tab === 'visualize' && <VisualizationExercise />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Return Button */}
              <div className="text-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPhase('check-out')}
                  className="bg-gradient-to-r from-brand-purple to-indigo-500 text-white font-nunito font-black px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-lg"
                >
                  I&apos;m Feeling Better — Check Out ✨
                </motion.button>
              </div>
            </motion.div>
          )}

          {phase === 'check-out' && (
            <motion.div
              key="check-out"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card"
            >
              <EmotionSelector
                title="How do you feel now?"
                subtitle="Notice any changes in how you feel"
                onSelect={handleAfterEmotion}
                selected={afterEmotion}
              />

              <div className="mt-6 p-4 bg-purple-50 rounded-2xl text-center">
                <p className="font-nunito font-bold text-purple-700">
                  {beforeEmotion && afterEmotion && beforeEmotion !== afterEmotion
                    ? "Great job! You took care of yourself. 💜"
                    : "Thank you for taking time for yourself. 🌟"}
                </p>
                <p className="font-dmsans text-sm text-purple-600 mt-1">
                  Your session has been saved. Ready to return to learning!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
