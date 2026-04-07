import GamePlayerClient from './GamePlayerClient';

export async function generateStaticParams() {
  return [
    { slug: 'lightbot' },
    { slug: 'memory-match' },
    { slug: 'math-runner' },
    { slug: 'word-search' },
    { slug: 'typing-hero' },
  ];
}

export default function GamePlayerPage({ params }: { params: { slug: string } }) {
  return <GamePlayerClient slug={params.slug} />;
}
