'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GamePlayer({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const router = useRouter();

  useEffect(() => {
    // Basic safety: if no static build exists, show message
    fetch(`/games/${slug}/index.html`, { method: 'HEAD' }).then(r => {
      if (!r.ok) {
        // redirect back to market with message
        router.replace('/game-market');
      }
    }).catch(() => router.replace('/game-market'));
  }, [slug, router]);

  const iframeSrc = `/games/${slug}/index.html`;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-3 bg-white border-b flex items-center gap-3">
        <button onClick={() => router.back()} className="text-sm text-gray-600">← Back</button>
        <h2 className="font-bold">Game Player — {slug}</h2>
      </div>
      <div className="flex-1">
        <iframe id="game-frame" src={iframeSrc} className="w-full h-full" frameBorder={0} allowFullScreen sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups" />
      </div>
    </div>
  );
}
