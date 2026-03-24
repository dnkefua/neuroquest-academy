import { notFound } from 'next/navigation';
import GameApp from './GameApp';

// Pre-generate all known subject pages for static export
export function generateStaticParams() {
  return [
    { subject: 'math' },
    { subject: 'science' },
    { subject: 'english' },
    { subject: 'social' },
    { subject: 'socialSkills' },
  ];
}

export default function SubjectGamePage({ params }: { params: { subject: string } }) {
  const validSubjects = ['math', 'science', 'english', 'social', 'socialSkills'];
  if (!validSubjects.includes(params.subject)) {
    notFound();
  }
  return <GameApp subject={params.subject as 'math' | 'science' | 'english' | 'social' | 'socialSkills'} />;
}