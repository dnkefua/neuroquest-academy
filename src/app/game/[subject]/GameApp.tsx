'use client';

import { useSearchParams } from 'next/navigation';
import { useProgressStore } from '@/store/progressStore';
import type { CurriculumSubject } from '@/types';
import dynamic from 'next/dynamic';

// Dynamically import each subject's GameApp so this route properly renders
// the game for any subject (avoiding a blank screen when the static export
// overwrites subject-specific pages with this [subject] route).
const MathGameApp = dynamic(() => import('../math/GameApp'), { ssr: false });
const ScienceGameApp = dynamic(() => import('../science/GameApp'), { ssr: false });
const EnglishGameApp = dynamic(() => import('../english/GameApp'), { ssr: false });
const SocialGameApp = dynamic(() => import('../social/GameApp'), { ssr: false });
const SocialSkillsGameApp = dynamic(() => import('../socialSkills/GameApp'), { ssr: false });

interface GameAppProps {
  subject: CurriculumSubject;
}

export default function GameApp({ subject }: GameAppProps) {
  const searchParams = useSearchParams();
  const currentGrade = useProgressStore(s => s.currentGrade);
  const urlGrade = searchParams?.get('grade');
  const grade = urlGrade ? parseInt(urlGrade, 10) : currentGrade;

  switch (subject) {
    case 'math':        return <MathGameApp />;
    case 'science':     return <ScienceGameApp />;
    case 'english':     return <EnglishGameApp />;
    case 'social':      return <SocialGameApp grade={grade} />;
    case 'socialSkills': return <SocialSkillsGameApp grade={grade} />;
    default:            return null;
  }
}