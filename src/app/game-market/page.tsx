'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile } from '@/lib/firestore';
import { useEconomyStore } from '@/store/economyStore';
import WalletHUD from '@/components/ui/WalletHUD';

export interface MarketGame {
  slug: string;
  title: string;
  author?: string;
  built?: boolean;
  notes?: string;
  category?: string;
  ageRange?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  description?: string;
  thumbnail?: string;
  tags?: string[];
  skills?: string[];
  price?: number;       // coin cost (0 = free)
  featured?: boolean;
}

const CATEGORIES = [
  { id: 'all', label: 'All Games', emoji: '🎮' },
  { id: 'coding', label: 'Coding', emoji: '💻' },
  { id: 'math', label: 'Math', emoji: '🔢' },
  { id: 'language', label: 'Language', emoji: '📖' },
  { id: 'puzzle', label: 'Puzzle', emoji: '🧩' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'typing', label: 'Typing', emoji: '⌨️' },
  { id: 'memory', label: 'Memory', emoji: '🧠' },
  { id: 'creative', label: 'Creative', emoji: '🎨' },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: '#22C55E',
  Intermediate: '#F59E0B',
  Advanced: '#EF4444',
};

type ViewMode = 'store' | 'library';

export default function GameMarketPage() {
  const router = useRouter();
  const [games, setGames] = useState<MarketGame[] | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('store');
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState<MarketGame | null>(null);
  const [userName, setUserName] = useState('');

  const { walletCoins, buyGame, hasGame, spendCoins } = useEconomyStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.replace('/auth'); return; }
      const p = await getUserProfile(user.uid);
      if (p?.name) setUserName(p.name);
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    fetch('/games/manifest.json')
      .then(r => r.json())
      .then(setGames)
      .catch(() => setGames([]));
  }, []);

  const filteredGames = useMemo(() => {
    if (!games) return [];
    return games.filter(g => {
      const matchesSearch = !search ||
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        (g.tags ?? []).some(t => t.toLowerCase().includes(search.toLowerCase())) ||
        (g.description ?? '').toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' ||
        g.category?.toLowerCase() === selectedCategory ||
        (g.tags ?? []).some(t => t.toLowerCase() === selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [games, search, selectedCategory]);

  const featuredGames = useMemo(() => games?.filter(g => g.featured) ?? [], [games]);
  const ownedGames = useMemo(() => games?.filter(g => hasGame(g.slug) || (g.price === 0 && g.built)) ?? [], [games, hasGame]);

  function handlePurchase(game: MarketGame) {
    const price = game.price ?? 0;
    if (price === 0 || hasGame(game.slug)) {
      router.push(`/games/${game.slug}`);
      return;
    }
    setPurchasing(game.slug);
    const success = buyGame(game.slug, price);
    if (success) {
      setTimeout(() => {
        setPurchasing(null);
        router.push(`/games/${game.slug}`);
      }, 800);
    } else {
      setPurchasing(null);
    }
  }

  if (!games) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #0f0a2e 0%, #1a1145 50%, #0d1b3e 100%)' }}>
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-3">🎮</div>
          <p className="font-nunito font-bold text-purple-300">Loading Game Market...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12"
      style={{ background: 'linear-gradient(160deg, #0f0a2e 0%, #1a1145 50%, #0d1b3e 100%)' }}>

      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-white text-sm font-dmsans transition-colors">← Back</button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏪</span>
            <span className="font-nunito font-black text-white text-lg">Game Market</span>
          </div>
          <div className="ml-auto">
            <WalletHUD compact />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* View Mode Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex bg-white/10 rounded-xl p-1">
            {(['store', 'library'] as const).map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-lg font-nunito font-bold text-sm transition-all ${
                  viewMode === mode
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-gray-400 hover:text-white'
                }`}>
                {mode === 'store' ? '🏪 Store' : '📚 My Games'}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <span className="text-yellow-400">🪙</span>
            <span className="font-nunito font-bold text-yellow-300 text-sm">{walletCoins}</span>
          </div>
        </div>

        {viewMode === 'store' ? (
          <>
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search games, skills, or tags..."
                className="w-full bg-white/10 border border-purple-500/30 rounded-2xl px-5 py-3.5 text-white font-dmsans text-sm placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-nunito font-bold text-xs whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-white/8 text-gray-400 hover:bg-white/15 hover:text-white border border-purple-500/20'
                  }`}>
                  <span>{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Featured Section */}
            {selectedCategory === 'all' && !search && featuredGames.length > 0 && (
              <div>
                <h2 className="font-nunito font-black text-white text-lg mb-3">⭐ Featured Games</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featuredGames.map(game => (
                    <GameCard key={game.slug} game={game} featured
                      owned={hasGame(game.slug)}
                      purchasing={purchasing === game.slug}
                      walletCoins={walletCoins}
                      onPurchase={() => handlePurchase(game)}
                      onDetail={() => setShowDetail(game)} />
                  ))}
                </div>
              </div>
            )}

            {/* All Games Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-nunito font-black text-white text-lg">
                  {selectedCategory === 'all' ? 'All Games' : CATEGORIES.find(c => c.id === selectedCategory)?.label}
                </h2>
                <span className="text-xs text-gray-500 font-dmsans">{filteredGames.length} games</span>
              </div>
              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredGames.map((game, i) => (
                    <motion.div key={game.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}>
                      <GameCard game={game}
                        owned={hasGame(game.slug)}
                        purchasing={purchasing === game.slug}
                        walletCoins={walletCoins}
                        onPurchase={() => handlePurchase(game)}
                        onDetail={() => setShowDetail(game)} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-gray-400 font-dmsans">No games found. Try a different search or category.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* ── My Games Library ── */
          <div>
            <h2 className="font-nunito font-black text-white text-lg mb-3">📚 My Games ({ownedGames.length})</h2>
            {ownedGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ownedGames.map(game => (
                  <GameCard key={game.slug} game={game} owned
                    purchasing={false}
                    walletCoins={walletCoins}
                    onPurchase={() => router.push(`/games/${game.slug}`)}
                    onDetail={() => setShowDetail(game)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🎮</div>
                <h3 className="font-nunito font-black text-white text-xl mb-2">No games yet!</h3>
                <p className="text-gray-400 font-dmsans text-sm mb-4">
                  Complete quests to earn coins and buy games from the store.
                </p>
                <button onClick={() => setViewMode('store')}
                  className="bg-purple-600 text-white font-nunito font-bold px-6 py-2.5 rounded-xl hover:bg-purple-500 transition-all">
                  Browse Store
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Game Detail Modal */}
      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowDetail(null)}>
            <motion.div
              initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl overflow-hidden"
              style={{ background: 'linear-gradient(160deg, #1a1145 0%, #0d1b3e 100%)', border: '1px solid rgba(139,92,246,0.3)' }}
              onClick={e => e.stopPropagation()}>
              {/* Hero */}
              <div className="h-32 relative flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${getCategoryColor(showDetail.category)}40, ${getCategoryColor(showDetail.category)}10)` }}>
                <span className="text-6xl">{getCategoryEmoji(showDetail.category)}</span>
                <button onClick={() => setShowDetail(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-all">
                  &times;
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-nunito font-black text-white text-xl">{showDetail.title}</h3>
                  <p className="text-gray-400 text-xs font-dmsans mt-0.5">by {showDetail.author ?? 'Community'}</p>
                </div>
                {showDetail.description && (
                  <p className="text-gray-300 text-sm font-dmsans leading-relaxed">{showDetail.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {showDetail.difficulty && (
                    <span className="text-xs font-nunito font-bold px-2.5 py-1 rounded-lg"
                      style={{ background: `${DIFFICULTY_COLORS[showDetail.difficulty]}20`, color: DIFFICULTY_COLORS[showDetail.difficulty] }}>
                      {showDetail.difficulty}
                    </span>
                  )}
                  {showDetail.ageRange && (
                    <span className="text-xs font-nunito font-bold px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300">
                      Ages {showDetail.ageRange}
                    </span>
                  )}
                  {showDetail.category && (
                    <span className="text-xs font-nunito font-bold px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300">
                      {showDetail.category}
                    </span>
                  )}
                </div>
                {showDetail.skills && showDetail.skills.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 font-dmsans mb-1.5">Skills developed:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {showDetail.skills.map(s => (
                        <span key={s} className="text-xs bg-teal-500/15 text-teal-300 px-2 py-0.5 rounded-md font-dmsans">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {showDetail.tags && showDetail.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {showDetail.tags.map(t => (
                      <span key={t} className="text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-md font-dmsans">#{t}</span>
                    ))}
                  </div>
                )}
                <div className="pt-2">
                  {showDetail.built ? (
                    <button onClick={() => { setShowDetail(null); handlePurchase(showDetail); }}
                      className="w-full py-3 rounded-xl font-nunito font-black text-white transition-all"
                      style={{ background: hasGame(showDetail.slug) || (showDetail.price ?? 0) === 0
                        ? 'linear-gradient(135deg, #22C55E, #14B8A6)'
                        : walletCoins >= (showDetail.price ?? 0)
                          ? 'linear-gradient(135deg, #8B5CF6, #6366F1)'
                          : '#374151' }}
                      disabled={!hasGame(showDetail.slug) && (showDetail.price ?? 0) > 0 && walletCoins < (showDetail.price ?? 0)}>
                      {hasGame(showDetail.slug) || (showDetail.price ?? 0) === 0
                        ? '▶ Play Now'
                        : walletCoins >= (showDetail.price ?? 0)
                          ? `🪙 Buy for ${showDetail.price} coins`
                          : `Need ${(showDetail.price ?? 0) - walletCoins} more coins`}
                    </button>
                  ) : (
                    <div className="w-full py-3 rounded-xl bg-gray-800 text-center">
                      <p className="text-gray-400 font-nunito font-bold text-sm">Coming Soon</p>
                      {showDetail.notes && <p className="text-gray-500 text-xs font-dmsans mt-1">{showDetail.notes}</p>}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Game Card Component ── */

function GameCard({ game, featured, owned, purchasing, walletCoins, onPurchase, onDetail }: {
  game: MarketGame;
  featured?: boolean;
  owned: boolean;
  purchasing: boolean;
  walletCoins: number;
  onPurchase: () => void;
  onDetail: () => void;
}) {
  const price = game.price ?? 0;
  const canAfford = walletCoins >= price;
  const isFree = price === 0;

  return (
    <div className={`rounded-2xl overflow-hidden transition-all hover:scale-[1.02] cursor-pointer group ${
      featured ? 'row-span-1' : ''
    }`}
      style={{
        background: 'linear-gradient(160deg, rgba(139,92,246,0.08), rgba(20,184,166,0.05))',
        border: `1px solid ${featured ? 'rgba(139,92,246,0.4)' : 'rgba(139,92,246,0.15)'}`,
      }}
      onClick={onDetail}>

      {/* Thumbnail area */}
      <div className="h-24 relative flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${getCategoryColor(game.category)}20, ${getCategoryColor(game.category)}05)` }}>
        {game.thumbnail ? (
          <img src={game.thumbnail} alt={game.title} className="w-16 h-16 object-contain" />
        ) : (
          <span className="text-4xl group-hover:scale-110 transition-transform">{getCategoryEmoji(game.category)}</span>
        )}
        {featured && (
          <span className="absolute top-2 left-2 text-xs bg-yellow-500/90 text-black font-nunito font-black px-2 py-0.5 rounded-lg">
            ⭐ Featured
          </span>
        )}
        {owned && (
          <span className="absolute top-2 right-2 text-xs bg-green-500/90 text-white font-nunito font-bold px-2 py-0.5 rounded-lg">
            Owned
          </span>
        )}
        {!game.built && (
          <span className="absolute top-2 right-2 text-xs bg-gray-600/80 text-gray-300 font-nunito font-bold px-2 py-0.5 rounded-lg">
            Soon
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-nunito font-black text-white text-sm truncate">{game.title}</h3>
            <p className="text-gray-500 text-[10px] font-dmsans">{game.author ?? 'Community'}</p>
          </div>
          {game.difficulty && (
            <span className="text-[10px] font-nunito font-bold px-1.5 py-0.5 rounded-md flex-shrink-0"
              style={{ background: `${DIFFICULTY_COLORS[game.difficulty]}20`, color: DIFFICULTY_COLORS[game.difficulty] }}>
              {game.difficulty}
            </span>
          )}
        </div>

        {game.description && (
          <p className="text-gray-400 text-[11px] font-dmsans line-clamp-2 leading-relaxed">{game.description}</p>
        )}

        {game.tags && game.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {game.tags.slice(0, 3).map(t => (
              <span key={t} className="text-[10px] bg-white/8 text-gray-500 px-1.5 py-0.5 rounded font-dmsans">#{t}</span>
            ))}
          </div>
        )}

        {/* Action Button */}
        <div onClick={e => e.stopPropagation()}>
          {game.built ? (
            <button onClick={onPurchase}
              disabled={purchasing || (!owned && !isFree && !canAfford)}
              className="w-full py-2 rounded-xl font-nunito font-bold text-xs transition-all disabled:opacity-40"
              style={{
                background: owned || isFree
                  ? 'linear-gradient(135deg, #22C55E, #14B8A6)'
                  : canAfford
                    ? 'linear-gradient(135deg, #8B5CF6, #6366F1)'
                    : '#374151',
                color: 'white',
              }}>
              {purchasing ? '⏳ Purchasing...'
                : owned || isFree ? '▶ Play'
                : canAfford ? `🪙 ${price} coins`
                : `🔒 ${price} coins`}
            </button>
          ) : (
            <div className="w-full py-2 rounded-xl bg-white/5 text-center">
              <span className="text-gray-500 font-nunito font-bold text-xs">Coming Soon</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ── */

function getCategoryColor(category?: string): string {
  const colors: Record<string, string> = {
    coding: '#8B5CF6', Programming: '#8B5CF6',
    math: '#F59E0B', Math: '#F59E0B',
    language: '#3B82F6', Language: '#3B82F6',
    puzzle: '#14B8A6', Puzzle: '#14B8A6',
    science: '#22C55E', Science: '#22C55E',
    typing: '#EC4899', Typing: '#EC4899',
    memory: '#F97316', Memory: '#F97316',
    creative: '#06B6D4', Creative: '#06B6D4',
  };
  return colors[category ?? ''] ?? '#8B5CF6';
}

function getCategoryEmoji(category?: string): string {
  const emojis: Record<string, string> = {
    coding: '💻', Programming: '💻',
    math: '🔢', Math: '🔢',
    language: '📖', Language: '📖',
    puzzle: '🧩', Puzzle: '🧩',
    science: '🔬', Science: '🔬',
    typing: '⌨️', Typing: '⌨️',
    memory: '🧠', Memory: '🧠',
    creative: '🎨', Creative: '🎨',
  };
  return emojis[category ?? ''] ?? '🎮';
}
