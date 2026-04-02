'use client';

import { useSearchParams } from 'next/navigation';
import GameApp from './GameApp';

export default function SocialSkillsPage() {
  const searchParams = useSearchParams();
  const grade = parseInt(searchParams?.get('grade') || '1', 10);

  return <GameApp grade={grade} />;
}