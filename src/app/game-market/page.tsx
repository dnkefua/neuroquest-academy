"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Game = { slug: string; title: string; author?: string; built?: boolean; notes?: string };

export default function GameMarketPage() {
  const [games, setGames] = useState<Game[] | null>(null);

  useEffect(() => {
    fetch('/games/manifest.json')
      .then(r => r.json())
      .then((j) => setGames(j))
      .catch(() => setGames([]));
  }, []);

  if (!games) return <div className="p-6">Loading games…</div>;

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Game Market</h1>
      <p className="text-sm text-gray-600 mb-6">Play educational games after completing your lessons. Tap Play to open a game in a touch-friendly player.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {games.map(g => (
          <div key={g.slug} className="border rounded-xl p-4 bg-white shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-xl">🎮</div>
              <div className="flex-1">
                <h3 className="font-bold">{g.title}</h3>
                <div className="text-xs text-gray-500">{g.author}</div>
                {g.notes && <div className="text-xs text-gray-400 mt-1">{g.notes}</div>}
              </div>
              <div className="flex flex-col items-end gap-2">
                {g.built ? (
                  <Link href={`/games/${g.slug}`} className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm">Play</Link>
                ) : (
                  <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 text-sm" disabled>Build required</button>
                )}
                <a href={`/games/${g.slug}`} className="text-xs text-gray-400 mt-1">Open player</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
