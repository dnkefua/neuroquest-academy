'use client';

import { useSearchParams } from 'next/navigation';
import { useProgressStore } from '@/store/progressStore';
import type { CurriculumSubject } from '@/types';
import dynamic from 'next/dynamic';
import QuestGuide from '@/components/quest-guide/QuestGuide';

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

  let GameComponent;
  switch (subject) {
    case 'math':        GameComponent = <MathGameApp />; break;
    case 'science':     GameComponent = <ScienceGameApp />; break;
    case 'english':     GameComponent = <EnglishGameApp />; break;
    case 'social':      GameComponent = <SocialGameApp grade={grade} />; break;
    case 'socialSkills': GameComponent = <SocialSkillsGameApp grade={grade} />; break;
    default:            GameComponent = null;
  }

  return (
    <div className="relative">
      {GameComponent}
      <QuestGuide currentSubject={subject} />
    </div>
  );
}