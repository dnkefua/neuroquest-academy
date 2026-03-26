import { notFound } from 'next/navigation';
import GameApp from './GameApp';

// Pre-generate all known subject pages for static export.
// NOTE: [subject]/GameApp dynamically imports the correct game for each subject,
// so even if this overwrites subject-specific pages, the correct game renders.
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