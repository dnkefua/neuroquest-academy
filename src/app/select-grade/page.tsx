'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile, updateUserProfile } from '@/lib/firestore';
import { useProgressStore } from '@/store/progressStore';
import { gameTTS } from '@/app/game/shared/tts';
import toast from 'react-hot-toast';

const GRADE_INFO: Record<number, { programme: string; topic: string; emoji: string }> = {
  1: { programme: 'PYP', topic: 'Counting & Numbers', emoji: '🔢' },
  2: { programme: 'PYP', topic: 'Place Value & Operations', emoji: '➕' },
  3: { programme: 'PYP', topic: 'Multiplication & Division', emoji: '✖️' },
  4: { programme: 'PYP', topic: 'Decimals & Geometry', emoji: '📐' },
  5: { programme: 'PYP', topic: 'Fractions & Data', emoji: '📊' },
  6: { programme: 'MYP', topic: 'Integers & Negative Numbers', emoji: '➖' },
  7: { programme: 'MYP', topic: 'Fractions & Percents', emoji: '💯' },
  8: { programme: 'MYP', topic: 'Ratios & Geometry', emoji: '📐' },
  9: { programme: 'MYP', topic: 'Algebra & Pythagoras', emoji: '📐' },
  10: { programme: 'MYP', topic: 'Quadratic Equations', emoji: '📈' },
  11: { programme: 'DP', topic: 'Functions & Calculus', emoji: '∫' },
  12: { programme: 'DP', topic: 'Advanced Mathematics', emoji: '🎓' },
};

export default function SelectGradePage() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [currentGrade, setCurrentGrade] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let redirected = false;
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user && !redirected) {
        redirected = true;
        router.replace('/auth');
        return;
      }
      if (user) {
        setUid(user.uid);
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setName(profile.name || 'Explorer');
          setCurrentGrade(profile.grade || null);
          setSelectedGrade(profile.grade || null);
        }
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  async function handleContinue() {
    if (!uid || !selectedGrade) return;
    setSaving(true);

    try {
      // Update profile with selected grade
      await updateUserProfile(uid, { grade: selectedGrade });

      // Sync to progress store
      useProgressStore.getState().setCurrentGrade(selectedGrade);

      gameTTS.speak(`Grade ${selectedGrade} selected. Let's begin!`);
      toast.success(`Grade ${selectedGrade} selected! 🎯`);

      // Navigate to world map
      router.push('/world-map');
    } catch (err) {
      console.error('Error updating grade:', err);
      toast.error('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(180deg, #0f0c29 0%, #1a1040 50%, #0d1b2a 100%)' }}>
        <div className="text-white text-xl font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(180deg, #0f0c29 0%, #1a1040 50%, #0d1b2a 100%)' }}>
      <div className="w-full max-w-lg">
        {/* Stars background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{
                width: 1 + (i % 2),
                height: 1 + (i % 2),
                left: `${(i * 17.3 + 7) % 100}%`,
                top: `${(i * 13.7 + 11) % 100}%`,
                opacity: 0.2 + (i % 5) * 0.1,
                animation: `twinkle ${2 + (i % 4)}s ease-in-out ${(i % 8) * 0.5}s infinite`,
              }} />
          ))}
        </div>

        <div className="relative z-10 text-center mb-8">
          <div className="text-6xl mb-4">🏫</div>
          <h1 className="font-black text-3xl text-white mb-2"
            style={{ fontFamily: 'Georgia, serif', textShadow: '0 0 20px rgba(139,92,246,0.6)' }}>
            Welcome{name ? `, ${name}` : ''}!
          </h1>
          <p className="text-purple-300 text-lg">Select your grade to begin your adventure</p>
          {currentGrade && (
            <p className="text-yellow-400 text-sm mt-2">
              Current: Grade {currentGrade} ({GRADE_INFO[currentGrade]?.programme})
            </p>
          )}
        </div>

        <div className="relative z-10 rounded-3xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(15,12,41,0.95), rgba(26,5,51,0.95))',
            border: '2px solid rgba(139,92,246,0.4)',
            boxShadow: '0 0 60px rgba(139,92,246,0.2)',
          }}>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => {
              const info = GRADE_INFO[g];
              const isSelected = selectedGrade === g;
              const isCurrent = currentGrade === g;
              return (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`relative p-4 rounded-2xl text-center transition-all ${
                    isSelected
                      ? 'scale-105'
                      : 'hover:scale-102'
                  }`}
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(20,184,166,0.3))'
                      : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${isSelected ? 'rgba(139,92,246,0.8)' : 'rgba(255,255,255,0.1)'}`,
                    boxShadow: isSelected ? '0 0 25px rgba(139,92,246,0.5)' : 'none',
                  }}>
                  <div className="text-2xl mb-1">{info.emoji}</div>
                  <div className="font-bold text-white text-sm">Grade {g}</div>
                  <div className="text-xs mt-0.5"
                    style={{ color: isSelected ? '#a78bfa' : 'rgba(255,255,255,0.5)' }}>
                    {info.programme}
                  </div>
                  {isCurrent && !isSelected && (
                    <div className="absolute -top-1 -right-1 text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded-full font-bold">
                      Current
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {selectedGrade && (
            <div className="mt-4 p-3 rounded-xl text-center"
              style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
              <p className="text-purple-300 text-sm">
                <span className="font-bold text-white">Grade {selectedGrade}</span> — {GRADE_INFO[selectedGrade]?.topic}
              </p>
              <p className="text-purple-400 text-xs mt-0.5">
                {GRADE_INFO[selectedGrade]?.programme} Curriculum
              </p>
            </div>
          )}

          <button
            onClick={handleContinue}
            disabled={!selectedGrade || saving}
            className="w-full mt-6 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              boxShadow: '0 0 30px rgba(255,215,0,0.4)',
            }}>
            {saving ? '⏳ Saving...' : '⚔️ Begin Adventure'}
          </button>
        </div>

        <p className="relative z-10 text-center text-gray-500 text-xs mt-6">
          You can change your grade anytime from settings
        </p>
      </div>

      <style jsx>{`
        @keyframes twinkle { 0%,100%{opacity:0.2} 50%{opacity:0.9} }
      `}</style>
    </div>
  );
}