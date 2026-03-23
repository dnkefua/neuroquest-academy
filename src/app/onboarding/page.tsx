'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserProfile } from '@/lib/firestore';
import { useProgressStore } from '@/store/progressStore';
import toast from 'react-hot-toast';
import type { StudentClass } from '@/types';

const STUDENT_STEPS = ['role', 'class', 'name', 'grade', 'language'] as const;
const PARENT_STEPS = ['role', 'name', 'grade', 'language'] as const;
type StudentStep = typeof STUDENT_STEPS[number];
type ParentStep = typeof PARENT_STEPS[number];
type Step = StudentStep | ParentStep;

const CLASSES: Array<{
  val: StudentClass;
  emoji: string;
  label: string;
  desc: string;
  realm: string;
  color: string;
}> = [
  {
    val: 'math',
    emoji: '🐉',
    label: 'Math Quester',
    desc: 'Equation Dragons, Number Spells & Crystal Calculations',
    realm: 'The Equation Realm',
    color: '#8B5CF6',
  },
  {
    val: 'science',
    emoji: '🔬',
    label: 'Science Explorer',
    desc: 'Atom Golems, Discovery Lab & Element Alchemy',
    realm: 'The Discovery Labyrinth',
    color: '#14B8A6',
  },
  {
    val: 'english',
    emoji: '📜',
    label: 'Language Bard',
    desc: 'Grammar Sphinx, Word Magic & Story Scrolls',
    realm: 'The Library of Words',
    color: '#3B82F6',
  },
  {
    val: 'arabic',
    emoji: '🏛️',
    label: 'History Keeper',
    desc: 'Ancient Ruins, Memory Temples & Hieroglyph Puzzles',
    realm: 'The Memory Temple',
    color: '#F97316',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [role, setRole] = useState<'student' | 'parent'>('student');
  const [studentClass, setStudentClass] = useState<StudentClass>('math');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState(5);
  const [language, setLanguage] = useState<'EN' | 'AR'>('EN');
  const [saving, setSaving] = useState(false);

  const steps = role === 'student' ? STUDENT_STEPS : PARENT_STEPS;
  const [step, setStep] = useState<Step>('role');

  useEffect(() => {
    let redirected = false;
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user && !redirected) {
        redirected = true;
        router.replace('/auth');
      } else if (user) {
        setUid(user.uid);
      }
    });
    return () => unsub();
  }, [router]);

  // Reset step when role changes
  function handleRoleSelect(r: 'student' | 'parent') {
    setRole(r);
    setStep(r === 'student' ? 'class' : 'name');
  }

  function nextStep() {
    const idx = (steps as readonly string[]).indexOf(step);
    if (idx < steps.length - 1) {
      setStep(steps[idx + 1]);
    }
  }

  async function finish() {
    if (!uid) return;
    setSaving(true);
    try {
      await createUserProfile(uid, {
        uid,
        name,
        email: auth.currentUser?.email ?? '',
        role,
        grade,
        language,
        ...(role === 'student' ? { studentClass } : {}),
      });

      // Sync selected grade to the progress store
      const progressStore = useProgressStore.getState();
      if (progressStore.currentGrade < grade) {
        for (let g = progressStore.currentGrade; g < grade; g++) {
          progressStore.completeGrade(g);
        }
      }

      toast.success(`Welcome to NeuroQuest, ${name}! 🎉`);
      router.push('/dashboard');
    } catch (err) {
      console.error('Firestore error:', err);
      toast.error(`Failed: ${(err as Error).message}`, { duration: 8000 });
    } finally {
      setSaving(false);
    }
  }

  const stepIndex = (steps as readonly string[]).indexOf(step);
  const progress = ((stepIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🌟</div>
          <h1 className="font-nunito text-2xl font-black text-gray-800">Let&apos;s set up your space!</h1>
          <p className="text-gray-500 font-dmsans text-sm mt-1">Step {stepIndex + 1} of {steps.length}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-purple-100 rounded-full h-2.5 mb-8">
          <div
            className="bg-brand-purple h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="card">
          {/* ── STEP 1: Role ── */}
          {step === 'role' && (
            <div>
              <h2 className="font-nunito text-xl font-bold text-gray-800 mb-2">Who are you? 👋</h2>
              <p className="text-gray-500 font-dmsans text-sm mb-6">This helps us personalise your experience</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: 'student', emoji: '🎒', label: 'Student', desc: "I'm here to learn!" },
                  { val: 'parent', emoji: '👨‍👩‍👧', label: 'Parent', desc: 'Supporting my child' },
                ].map((r) => (
                  <button
                    key={r.val}
                    onClick={() => handleRoleSelect(r.val as 'student' | 'parent')}
                    className={`p-5 rounded-2xl border-2 text-center transition-all ${
                      role === r.val
                        ? 'border-brand-purple bg-brand-purple-light'
                        : 'border-purple-100 hover:border-purple-200'
                    }`}
                  >
                    <div className="text-4xl mb-2">{r.emoji}</div>
                    <div className="font-nunito font-bold text-gray-800">{r.label}</div>
                    <div className="text-xs text-gray-500 mt-1 font-dmsans">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Class (students only) ── */}
          {step === 'class' && (
            <div>
              <h2 className="font-nunito text-xl font-bold text-gray-800 mb-1">Choose your Class! ⚔️</h2>
              <p className="text-gray-500 font-dmsans text-sm mb-4">
                Your class unlocks a unique realm of quests. Choose wisely — you can change later!
              </p>
              <div className="space-y-3">
                {CLASSES.map((c) => (
                  <button
                    key={c.val}
                    onClick={() => { setStudentClass(c.val); }}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                      studentClass === c.val
                        ? 'border-2'
                        : 'border-purple-100 hover:border-purple-200'
                    }`}
                    style={{
                      borderColor: studentClass === c.val ? c.color : undefined,
                      background: studentClass === c.val ? `${c.color}15` : undefined,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-4xl flex-shrink-0">{c.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-nunito font-black text-gray-800">{c.label}</span>
                          {studentClass === c.val && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                              style={{ background: c.color, color: '#fff' }}>Selected</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
                        <p className="text-xs mt-1 font-semibold" style={{ color: c.color }}>
                          🏰 {c.realm}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={nextStep}
                className="w-full mt-5 bg-gradient-to-r from-brand-purple to-brand-teal text-white font-nunito font-black py-3.5 rounded-2xl hover:opacity-90 active:scale-95 transition-all"
              >
                Choose {CLASSES.find(c => c.val === studentClass)?.label} ⚔️
              </button>
            </div>
          )}

          {/* ── STEP 3: Name ── */}
          {step === 'name' && (
            <div>
              <h2 className="font-nunito text-xl font-bold text-gray-800 mb-2">What&apos;s your name? ✨</h2>
              <p className="text-gray-500 font-dmsans text-sm mb-6">We&apos;ll use this to greet you!</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your first name..."
                className="input-field text-lg"
                autoFocus
              />
              <button
                onClick={() => name.trim() && nextStep()}
                disabled={!name.trim()}
                className="w-full mt-6 bg-brand-purple text-white font-nunito font-black py-3.5 rounded-2xl hover:bg-purple-600 active:scale-95 transition-all disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}

          {/* ── STEP 4: Grade ── */}
          {step === 'grade' && (
            <div>
              <h2 className="font-nunito text-xl font-bold text-gray-800 mb-2">What grade are you in? 📚</h2>
              <p className="text-gray-500 font-dmsans text-sm mb-6">This helps us pick the right lessons</p>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    className={`py-3 rounded-xl font-nunito font-bold text-sm transition-all ${
                      grade === g
                        ? 'bg-brand-purple text-white'
                        : 'bg-purple-50 text-gray-700 hover:bg-purple-100'
                    }`}
                  >
                    Grade {g}
                  </button>
                ))}
              </div>
              <button onClick={nextStep} className="w-full mt-6 bg-brand-purple text-white font-nunito font-black py-3.5 rounded-2xl hover:bg-purple-600 active:scale-95 transition-all">
                Next →
              </button>
            </div>
          )}

          {/* ── STEP 5: Language ── */}
          {step === 'language' && (
            <div>
              <h2 className="font-nunito text-xl font-bold text-gray-800 mb-2">Preferred language? 🌍</h2>
              <p className="text-gray-500 font-dmsans text-sm mb-6">Lessons will be delivered in this language</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: 'EN' as const, flag: '🇬🇧', label: 'English' },
                  { val: 'AR' as const, flag: '🇦🇪', label: 'العربية' },
                ].map((l) => (
                  <button
                    key={l.val}
                    onClick={() => setLanguage(l.val)}
                    className={`p-5 rounded-2xl border-2 text-center transition-all ${
                      language === l.val
                        ? 'border-brand-purple bg-brand-purple-light'
                        : 'border-purple-100 hover:border-purple-200'
                    }`}
                  >
                    <div className="text-4xl mb-2">{l.flag}</div>
                    <div className="font-nunito font-bold text-gray-800">{l.label}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={finish}
                disabled={saving}
                className="w-full mt-6 bg-gradient-to-r from-brand-purple to-brand-teal text-white font-nunito font-black py-3.5 rounded-2xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
              >
                {saving ? '⏳ Setting up...' : "🚀 Let's Go!"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
