import LessonClient from './LessonClient';

// Pre-generate all known subject pages for static export
export function generateStaticParams() {
  return [
    { subject: 'math' },
    { subject: 'science' },
    { subject: 'english' },
    { subject: 'social-skills' },
    { subject: 'emotional-regulation' },
  ];
}

export default function LessonPage() {
  return <LessonClient />;
}
