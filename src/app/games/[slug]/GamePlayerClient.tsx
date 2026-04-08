'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface GamePlayerProps {
  slug: string;
}

const GAME_NAMES: Record<string, string> = {
  lightbot: 'Lightbot',
  'memory-match': 'Memory Match',
  'math-runner': 'Math Runner',
  'word-search': 'Word Search',
  'typing-hero': 'Typing Hero',
};

export default function GamePlayerClient({ slug }: GamePlayerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [gameReady, setGameReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`/play/${slug}/index.html`, { method: 'HEAD' })
      .then(r => {
        if (cancelled) return;
        if (!r.ok) {
          setError(true);
          setLoading(false);
          setTimeout(() => router.replace('/game-market'), 3000);
        } else {
          setGameReady(true);
          setLoading(false);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
        setTimeout(() => router.replace('/game-market'), 3000);
      });

    return () => { cancelled = true; };
  }, [slug, router]);

  const gameName = GAME_NAMES[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎮</div>
          <p className="text-white text-lg font-bold">{gameName}</p>
          <p className="text-gray-400 mt-2">Loading game...</p>
          <div className="mt-4 w-48 h-2 bg-gray-800 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-purple-600 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-white text-lg font-bold">Game Not Found</p>
          <p className="text-gray-400 mt-2">Redirecting to game market...</p>
          <button onClick={() => router.push('/game-market')} className="mt-4 px-6 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-500">
            Go to Game Market
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="p-3 bg-gray-900 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-800">
            ← Back
          </button>
          <h2 className="font-bold text-white">{gameName}</h2>
        </div>
        <button onClick={() => { const f = document.getElementById('game-frame') as HTMLIFrameElement; if (f) f.src = f.src; }} className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
          🔄 Restart
        </button>
      </div>
      <div className="flex-1 relative">
        <iframe
          id="game-frame"
          src={`/play/${slug}/index.html`}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups allow-forms"
          title={gameName}
        />
      </div>
    </div>
  );
}
