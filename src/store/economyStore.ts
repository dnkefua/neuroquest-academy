'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CoinTransaction } from '@/types';
import { useDailyRewardStore } from './dailyRewardStore';

export const COIN_TABLE = {
  PYP: { correct: 20, boss: 50,  clue_cost: 5  },
  MYP: { correct: 30, boss: 75,  clue_cost: 10 },
  DP:  { correct: 50, boss: 150, clue_cost: 20 },
} as const;

export const BONUS_COINS = {
  gradeComplete:       100,
  programmeUnlock:     250,
  bossDefeated:        500,
  graduation:         1000,
  clueFreeMultiplier:  1.5,
} as const;

interface EconomyState {
  totalCoins: number;
  walletCoins: number;
  coinsSpentOnClues: number;
  cluesPurchased: number;
  transactions: CoinTransaction[];
  purchasedClues: Record<string, boolean>;
  purchasedGames: string[];

  earnCoins: (amount: number, source: string) => void;
  earnCoinsWithMultiplier: (baseAmount: number, source: string) => void;
  spendCoins: (amount: number, source: string) => boolean;
  buyClue: (questId: string, questionIndex: number, cost: number) => boolean;
  canAffordClue: (cost: number) => boolean;
  hasClue: (questId: string, questionIndex: number) => boolean;
  buyGame: (gameId: string, cost: number) => boolean;
  hasGame: (gameId: string) => boolean;
  getCoinMultiplier: () => number;
  reset: () => void;
}

const DEFAULT_STATE = {
  totalCoins: 0,
  walletCoins: 0,
  coinsSpentOnClues: 0,
  cluesPurchased: 0,
  transactions: [] as CoinTransaction[],
  purchasedClues: {} as Record<string, boolean>,
};

export const useEconomyStore = create<EconomyState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      earnCoins: (amount, source) => {
        const tx: CoinTransaction = { amount, type: 'earn', source, timestamp: Date.now() };
        set((s) => ({
          totalCoins: s.totalCoins + amount,
          walletCoins: s.walletCoins + amount,
          transactions: [tx, ...s.transactions].slice(0, 100),
        }));
      },

      earnCoinsWithMultiplier: (baseAmount, source) => {
        const multiplier = useDailyRewardStore.getState().getMultiplier('coins');
        const actualAmount = Math.round(baseAmount * multiplier);
        const label = multiplier > 1 ? `${source} (x${multiplier})` : source;
        get().earnCoins(actualAmount, label);
      },

      spendCoins: (amount, source) => {
        const { walletCoins } = get();
        if (walletCoins < amount) return false;
        const tx: CoinTransaction = { amount, type: 'spend', source, timestamp: Date.now() };
        set((s) => ({
          walletCoins: s.walletCoins - amount,
          transactions: [tx, ...s.transactions].slice(0, 100),
        }));
        return true;
      },

      buyClue: (questId, questionIndex, cost) => {
        const key = `${questId}:${questionIndex}`;
        const state = get();
        if (state.purchasedClues[key]) return true;
        const dailyReward = useDailyRewardStore.getState();
        if (dailyReward.useFreeClue()) {
          const tx: CoinTransaction = {
            amount: 0, type: 'earn',
            source: `free-clue:${questId}:${questionIndex}`,
            timestamp: Date.now(),
          };
          set((s) => ({
            purchasedClues: { ...s.purchasedClues, [key]: true },
            cluesPurchased: s.cluesPurchased + 1,
            transactions: [tx, ...s.transactions].slice(0, 100),
          }));
          return true;
        }
        if (state.walletCoins < cost) return false;
        const tx: CoinTransaction = {
          amount: cost, type: 'spend',
          source: `clue:${questId}:${questionIndex}`,
          timestamp: Date.now(),
        };
        set((s) => ({
          walletCoins: s.walletCoins - cost,
          coinsSpentOnClues: s.coinsSpentOnClues + cost,
          cluesPurchased: s.cluesPurchased + 1,
          purchasedClues: { ...s.purchasedClues, [key]: true },
          transactions: [tx, ...s.transactions].slice(0, 100),
        }));
        return true;
      },

      canAffordClue: (cost) => {
        const state = get();
        const dailyReward = useDailyRewardStore.getState();
        return state.walletCoins >= cost || dailyReward.useFreeClue();
      },

      hasClue: (questId, questionIndex) => {
        const key = `${questId}:${questionIndex}`;
        return get().purchasedClues[key] ?? false;
      },

      purchasedGames: [],

      buyGame: (gameId, cost) => {
        const state = get();
        if (state.purchasedGames.includes(gameId)) return true;
        if (state.walletCoins < cost) return false;
        const tx: CoinTransaction = {
          amount: cost, type: 'spend',
          source: `game:${gameId}`,
          timestamp: Date.now(),
        };
        set((s) => ({
          walletCoins: s.walletCoins - cost,
          purchasedGames: [...s.purchasedGames, gameId],
          transactions: [tx, ...s.transactions].slice(0, 100),
        }));
        return true;
      },

      hasGame: (gameId) => get().purchasedGames.includes(gameId),

      getCoinMultiplier: () => useDailyRewardStore.getState().getMultiplier('coins'),

      reset: () => set(DEFAULT_STATE),
    }),
    {
      name: 'nq-economy',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
          length: 0,
          clear: () => {},
          key: () => null,
        }
      ),
      partialize: (s) => ({
        totalCoins: s.totalCoins,
        walletCoins: s.walletCoins,
        coinsSpentOnClues: s.coinsSpentOnClues,
        cluesPurchased: s.cluesPurchased,
        purchasedClues: s.purchasedClues,
        purchasedGames: s.purchasedGames,
      }),
    }
  )
);
