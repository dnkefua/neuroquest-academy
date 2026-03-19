'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserProfile } from '@/lib/firestore';
import { useProgressStore } from '@/store/progressStore';
import toast from 'react-hot-toast';

const STEPS = ['role', 'name', 'grade', 'language'] as const;
type Step = typeof STEPS[number];

export default function OnboardingPage() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<'student' | 'parent'>('student');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState(5);
  const [language, setLanguage] = useState<'EN' | 'AR'>('EN');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace('/auth');
      else setUid(user.uid);
    });
    return () => unsub();
  }, [router]);

  async function finish() {
    if (!uid) return;
    setSaving(true);
    try {
      console.log('Saving profile for uid:', uid);
      await createUserProfile(uid, {
        uid,
        name,
        email: auth.currentUser?.email ?? '',
        role,
        grade,
        language,
      });
      // Sync selected grade to the progress store so World Map starts at the right grade
      const progressStore = useProgressStore.getState();
      if (progressStore.currentGrade < grade) {
        // Mark all grades below as completed to unlock up to the selected grade
        for (let g = progressStore.currentGrade; g < grade; g++) {
          progressStore.completeGrade(g);
        }
      }
      console.log('Profile saved successfully');
      toast.success(`Welcome to NeuroQuest, ${name}! 🎉`);
      router.push('/dashboard');
    } catch (err) {
      console.error('Firestore error:', err);
      toast.error(`Failed: ${(err as Error).message}`, { duration: 8000 });
    } finally {
      setSaving(false);
    }
  }

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🌟</div>
          <h1 className="font-nunito text-2xl font-black text-gray-800">Let&apos;s set up your space!</h1>
          <p className="text-gray-500 font-dmsans text-sm mt-1">Step {stepIndex + 1} of {STEPS.length}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-purple-100 rounded-full h-2.5 mb-8">
          <div
            className="bg-brand-purple h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="card">
          {step === 'role' && (
            <div>
              <h2 className="font-nunito text-xl font-bold text-gray-800 mb-2">Who are you? 👋</h2>
              <p className="text-gray-500 font-dmsans text-sm mb-6">This helps us personalize your experience</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: 'student', emoji: '🎒', label: 'Student', desc: "I'm here to learn!" },
                  { val: 'parent', emoji: '👨‍👩‍👧', label: 'Parent', desc: 'Supporting my child' },
                ].map((r) => (
                  <button
                    key={r.val}
                    onClick={() => setRole(r.val as 'student' | 'parent')}
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
              <button onClick={() => setStep('name')} className="w-full mt-6 bg-brand-purple text-white font-nunito font-black py-3.5 rounded-2xl hover:bg-purple-600 active:scale-95 transition-all">
                Next →
              </button>
            </div>
          )}

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
                onClick={() => name.trim() && setStep('grade')}
                disabled={!name.trim()}
                className="w-full mt-6 bg-brand-purple text-white font-nunito font-black py-3.5 rounded-2xl hover:bg-purple-600 active:scale-95 transition-all disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}

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
              <button onClick={() => setStep('language')} className="w-full mt-6 bg-brand-purple text-white font-nunito font-black py-3.5 rounded-2xl hover:bg-purple-600 active:scale-95 transition-all">
                Next →
              </button>
            </div>
          )}

          {step === 'language' && (
            <div>
              <h2 className="font-nunito text-xl font-bold text-gray-800 mb-2">Preferred language? 🌍</h2>
              <p className="text-gray-500 font-dmsans text-sm mb-6">Lessons will be delivered in this language</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: 'EN', flag: '🇬🇧', label: 'English' },
                  { val: 'AR', flag: '🇦🇪', label: 'العربية' },
                ].map((l) => (
                  <button
                    key={l.val}
                    onClick={() => setLanguage(l.val as 'EN' | 'AR')}
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
