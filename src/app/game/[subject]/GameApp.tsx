'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/store/progressStore';
import { getAvailableSubjectsForGrade, type GameQuest } from '@/lib/questData';
import type { CurriculumSubject } from '@/types';
import GameSkeleton from '../shared/components/GameSkeleton';

// Subject themes for consistent styling
const SUBJECT_THEMES: Record<CurriculumSubject, { color: string; bgGradient: string; emoji: string; name: string }> = {
  math: { color: '#8B5CF6', bgGradient: 'linear-gradient(135deg, #0f0c29 0%, #1a0533 100%)', emoji: '🔢', name: 'Mathematics' },
  science: { color: '#0EA5E9', bgGradient: 'linear-gradient(135deg, #041428 0%, #0a2540 50%, #052e16 100%)', emoji: '🔬', name: 'Science' },
  english: { color: '#F59E0B', bgGradient: 'linear-gradient(135deg, #1f1400 0%, #2d1f00 100%)', emoji: '📖', name: 'English' },
  social: { color: '#F59E0B', bgGradient: 'linear-gradient(135deg, #1a0f00 0%, #2a1f00 100%)', emoji: '🌍', name: 'Social Studies' },
  socialSkills: { color: '#EC4899', bgGradient: 'linear-gradient(135deg, #1f001a 0%, #2d0025 100%)', emoji: '💜', name: 'Social Skills' },
};

// Subjects that have full game experiences implemented
const FULL_GAME_SUBJECTS: CurriculumSubject[] = ['math', 'science'];

interface GameAppProps {
  subject: CurriculumSubject;
}

export default function GameApp({ subject }: GameAppProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  const theme = SUBJECT_THEMES[subject];
  const currentGrade = useProgressStore(s => s.currentGrade);

  // Read grade from URL or use user's grade
  const urlGrade = searchParams.get('grade');
  const grade = urlGrade ? parseInt(urlGrade, 10) : currentGrade;

  // Check if this subject has quests for the grade
  const availableSubjects = getAvailableSubjectsForGrade(grade);
  const subjectInfo = availableSubjects.find(s => s.id === subject);
  const hasQuests = subjectInfo?.hasQuests ?? false;

  // Check if this subject has a full game implementation
  const hasFullGame = FULL_GAME_SUBJECTS.includes(subject);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Redirect subjects without full games to lesson page
    if (mounted && !hasFullGame) {
      router.replace(`/lesson/${subject}?grade=${grade}`);
    }
  }, [mounted, hasFullGame, subject, grade, router]);

  if (!mounted) {
    return <GameSkeleton />;
  }

  // For subjects without full games, show loading while redirecting
  if (!hasFullGame) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.bgGradient }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          ⚙️
        </motion.div>
      </div>
    );
  }

  // If no quests available, show coming soon
  if (!hasQuests) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: theme.bgGradient }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md">
          <span className="text-8xl mb-6 block">{theme.emoji}</span>
          <h1 className="font-black text-white text-3xl mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            Coming Soon
          </h1>
          <p className="text-gray-300 mb-6">
            Grade {grade} {theme.name} quests are being prepared!
          </p>
          <button
            onClick={() => router.push('/world-map')}
            className="px-6 py-3 rounded-xl font-bold text-white"
            style={{ background: theme.color }}>
            ← Back to World Map
          </button>
        </motion.div>
      </div>
    );
  }

  // For math and science, render their specific game apps
  // This is handled by the existing pages in /game/math and /game/science
  // The dynamic route won't be used for these subjects
  return null;
}