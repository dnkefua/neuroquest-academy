import { describe, it, expect, beforeEach } from 'vitest'
import { create } from 'zustand'

interface CoinTransaction {
  amount: number
  type: 'earn' | 'spend'
  source: string
  timestamp: number
}

interface EconomyState {
  totalCoins: number
  walletCoins: number
  coinsSpentOnClues: number
  cluesPurchased: number
  transactions: CoinTransaction[]
  purchasedClues: Record<string, boolean>
  purchasedGames: string[]
  earnCoins: (amount: number, source: string) => void
  spendCoins: (amount: number, source: string) => boolean
  buyClue: (questId: string, questionIndex: number, cost: number) => boolean
  canAffordClue: (cost: number) => boolean
  hasClue: (questId: string, questionIndex: number) => boolean
  buyGame: (gameId: string, cost: number) => boolean
  hasGame: (gameId: string) => boolean
  reset: () => void
}

function createTestEconomyStore() {
  return create<EconomyState>((set, get) => ({
    totalCoins: 0,
    walletCoins: 0,
    coinsSpentOnClues: 0,
    cluesPurchased: 0,
    transactions: [],
    purchasedClues: {},
    purchasedGames: [],

    earnCoins: (amount, source) => {
      const tx: CoinTransaction = { amount, type: 'earn', source, timestamp: Date.now() }
      set((s) => ({
        totalCoins: s.totalCoins + amount,
        walletCoins: s.walletCoins + amount,
        transactions: [tx, ...s.transactions].slice(0, 100),
      }))
    },

    spendCoins: (amount, source) => {
      const { walletCoins } = get()
      if (walletCoins < amount) return false
      const tx: CoinTransaction = { amount, type: 'spend', source, timestamp: Date.now() }
      set((s) => ({
        walletCoins: s.walletCoins - amount,
        transactions: [tx, ...s.transactions].slice(0, 100),
      }))
      return true
    },

    buyClue: (questId, questionIndex, cost) => {
      const key = `${questId}:${questionIndex}`
      const state = get()
      if (state.purchasedClues[key]) return true
      if (state.walletCoins < cost) return false
      const tx: CoinTransaction = {
        amount: cost, type: 'spend',
        source: `clue:${questId}:${questionIndex}`,
        timestamp: Date.now(),
      }
      set((s) => ({
        walletCoins: s.walletCoins - cost,
        coinsSpentOnClues: s.coinsSpentOnClues + cost,
        cluesPurchased: s.cluesPurchased + 1,
        purchasedClues: { ...s.purchasedClues, [key]: true },
        transactions: [tx, ...s.transactions].slice(0, 100),
      }))
      return true
    },

    canAffordClue: (cost) => get().walletCoins >= cost,

    hasClue: (questId, questionIndex) => {
      const key = `${questId}:${questionIndex}`
      return get().purchasedClues[key] ?? false
    },

    buyGame: (gameId, cost) => {
      const state = get()
      if (state.walletCoins < cost) return false
      const tx: CoinTransaction = {
        amount: cost, type: 'spend',
        source: `game:${gameId}`,
        timestamp: Date.now(),
      }
      set((s) => ({
        walletCoins: s.walletCoins - cost,
        purchasedGames: [...s.purchasedGames, gameId],
        transactions: [tx, ...s.transactions].slice(0, 100),
      }))
      return true
    },

    hasGame: (gameId) => get().purchasedGames.includes(gameId),

    reset: () => set({
      totalCoins: 0,
      walletCoins: 0,
      coinsSpentOnClues: 0,
      cluesPurchased: 0,
      transactions: [],
      purchasedClues: {},
      purchasedGames: [],
    }),
  }))
}

describe('economyStore', () => {
  let store: ReturnType<typeof createTestEconomyStore>

  beforeEach(() => {
    store = createTestEconomyStore()
  })

  describe('initial state', () => {
    it('starts with 0 totalCoins', () => {
      expect(store.getState().totalCoins).toBe(0)
    })

    it('starts with 0 walletCoins', () => {
      expect(store.getState().walletCoins).toBe(0)
    })

    it('starts with 0 coinsSpentOnClues', () => {
      expect(store.getState().coinsSpentOnClues).toBe(0)
    })

    it('starts with 0 cluesPurchased', () => {
      expect(store.getState().cluesPurchased).toBe(0)
    })

    it('starts with empty transactions', () => {
      expect(store.getState().transactions).toEqual([])
    })

    it('starts with empty purchasedClues', () => {
      expect(store.getState().purchasedClues).toEqual({})
    })
  })

  describe('earnCoins', () => {
    it('increments totalCoins and walletCoins', () => {
      store.getState().earnCoins(100, 'test')
      expect(store.getState().totalCoins).toBe(100)
      expect(store.getState().walletCoins).toBe(100)
    })

    it('accumulates multiple earnings', () => {
      store.getState().earnCoins(50, 'test1')
      store.getState().earnCoins(75, 'test2')
      expect(store.getState().totalCoins).toBe(125)
      expect(store.getState().walletCoins).toBe(125)
    })

    it('records transaction with correct type', () => {
      store.getState().earnCoins(100, 'math-correct')
      const tx = store.getState().transactions[0]
      expect(tx.type).toBe('earn')
      expect(tx.source).toBe('math-correct')
      expect(tx.amount).toBe(100)
    })

    it('keeps transactions limited to 100', () => {
      for (let i = 0; i < 150; i++) {
        store.getState().earnCoins(1, `tx-${i}`)
      }
      expect(store.getState().transactions.length).toBe(100)
    })
  })

  describe('spendCoins', () => {
    it('returns true and deducts when sufficient funds', () => {
      store.getState().earnCoins(200, 'test')
      const result = store.getState().spendCoins(50, 'clue')
      expect(result).toBe(true)
      expect(store.getState().walletCoins).toBe(150)
    })

    it('returns false and does not deduct when insufficient funds', () => {
      store.getState().earnCoins(30, 'test')
      const result = store.getState().spendCoins(50, 'clue')
      expect(result).toBe(false)
      expect(store.getState().walletCoins).toBe(30)
    })

    it('records spent transaction', () => {
      store.getState().earnCoins(100, 'test')
      store.getState().spendCoins(40, 'clue')
      const tx = store.getState().transactions.find(t => t.type === 'spend')
      expect(tx?.source).toBe('clue')
      expect(tx?.amount).toBe(40)
    })

    it('does not affect totalCoins when spending', () => {
      store.getState().earnCoins(100, 'test')
      store.getState().spendCoins(30, 'clue')
      expect(store.getState().totalCoins).toBe(100)
      expect(store.getState().walletCoins).toBe(70)
    })

    it('returns false when walletCoins is 0', () => {
      expect(store.getState().spendCoins(10, 'clue')).toBe(false)
    })
  })

  describe('buyClue', () => {
    it('returns true when purchase is successful', () => {
      store.getState().earnCoins(200, 'test')
      const result = store.getState().buyClue('quest-1', 0, 20)
      expect(result).toBe(true)
    })

    it('returns true when clue already purchased', () => {
      store.getState().earnCoins(200, 'test')
      store.getState().buyClue('quest-1', 0, 20)
      const result = store.getState().buyClue('quest-1', 0, 20)
      expect(result).toBe(true)
    })

    it('returns false when insufficient funds', () => {
      store.getState().earnCoins(10, 'test')
      const result = store.getState().buyClue('quest-1', 0, 20)
      expect(result).toBe(false)
    })

    it('deducts cost from walletCoins', () => {
      store.getState().earnCoins(100, 'test')
      store.getState().buyClue('quest-1', 2, 30)
      expect(store.getState().walletCoins).toBe(70)
    })

    it('increments cluesPurchased counter', () => {
      store.getState().earnCoins(200, 'test')
      store.getState().buyClue('quest-1', 0, 20)
      store.getState().buyClue('quest-1', 1, 20)
      expect(store.getState().cluesPurchased).toBe(2)
    })

    it('increments coinsSpentOnClues', () => {
      store.getState().earnCoins(200, 'test')
      store.getState().buyClue('quest-1', 0, 30)
      expect(store.getState().coinsSpentOnClues).toBe(30)
    })

    it('marks clue as purchased in purchasedClues map', () => {
      store.getState().earnCoins(200, 'test')
      store.getState().buyClue('quest-1', 0, 20)
      expect(store.getState().hasClue('quest-1', 0)).toBe(true)
      expect(store.getState().hasClue('quest-1', 1)).toBe(false)
    })

    it('tracks clues for different quests separately', () => {
      store.getState().earnCoins(200, 'test')
      store.getState().buyClue('quest-1', 0, 20)
      store.getState().buyClue('quest-2', 0, 20)
      expect(store.getState().hasClue('quest-1', 0)).toBe(true)
      expect(store.getState().hasClue('quest-2', 0)).toBe(true)
    })
  })

  describe('canAffordClue', () => {
    it('returns true when wallet has enough', () => {
      store.getState().earnCoins(100, 'test')
      expect(store.getState().canAffordClue(50)).toBe(true)
    })

    it('returns false when wallet is insufficient', () => {
      store.getState().earnCoins(30, 'test')
      expect(store.getState().canAffordClue(50)).toBe(false)
    })

    it('returns true when wallet equals cost', () => {
      store.getState().earnCoins(50, 'test')
      expect(store.getState().canAffordClue(50)).toBe(true)
    })

    it('returns false when wallet is 0', () => {
      expect(store.getState().canAffordClue(10)).toBe(false)
    })
  })

  describe('buyGame', () => {
    it('returns true when purchase is successful', () => {
      store.getState().earnCoins(500, 'test')
      const result = store.getState().buyGame('game-1', 100)
      expect(result).toBe(true)
    })

    it('returns false when insufficient funds', () => {
      store.getState().earnCoins(50, 'test')
      const result = store.getState().buyGame('game-1', 100)
      expect(result).toBe(false)
    })

    it('deducts cost from walletCoins', () => {
      store.getState().earnCoins(500, 'test')
      store.getState().buyGame('game-1', 100)
      expect(store.getState().walletCoins).toBe(400)
    })

    it('adds game to purchasedGames list', () => {
      store.getState().earnCoins(500, 'test')
      store.getState().buyGame('game-1', 100)
      expect(store.getState().hasGame('game-1')).toBe(true)
    })

    it('can buy multiple games', () => {
      store.getState().earnCoins(500, 'test')
      store.getState().buyGame('game-1', 100)
      store.getState().buyGame('game-2', 150)
      expect(store.getState().hasGame('game-1')).toBe(true)
      expect(store.getState().hasGame('game-2')).toBe(true)
      expect(store.getState().walletCoins).toBe(250)
    })
  })

  describe('hasGame', () => {
    it('returns false for unpurchased game', () => {
      expect(store.getState().hasGame('game-1')).toBe(false)
    })

    it('returns true for purchased game', () => {
      store.getState().earnCoins(500, 'test')
      store.getState().buyGame('game-1', 100)
      expect(store.getState().hasGame('game-1')).toBe(true)
    })
  })

  describe('reset', () => {
    it('resets all state to defaults', () => {
      store.getState().earnCoins(500, 'test')
      store.getState().buyClue('quest-1', 0, 20)
      store.getState().reset()
      expect(store.getState().totalCoins).toBe(0)
      expect(store.getState().walletCoins).toBe(0)
      expect(store.getState().transactions).toHaveLength(0)
      expect(store.getState().purchasedClues).toEqual({})
      expect(store.getState().purchasedGames).toEqual([])
    })
  })
})
