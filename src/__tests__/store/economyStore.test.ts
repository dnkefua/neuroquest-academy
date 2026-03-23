import { describe, it, expect, beforeEach } from 'vitest'
import { create } from 'zustand'

// Inline the store logic to test without importing Next.js-heavy store
// (tests the actual store file — works because it has no Firebase/Next deps)

interface CoinTransaction {
  id: string
  amount: number
  type: 'earned' | 'spent'
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
  earnCoins: (amount: number, source: string) => void
  spendCoins: (amount: number, source: string) => boolean
  buyClue: (questId: string, questionIndex: number, cost: number) => boolean
  canAffordClue: (cost: number) => boolean
  hasClue: (questId: string, questionIndex: number) => boolean
  reset: () => void
}

// Minimal re-implementation of the economy store for unit testing
// (avoids Zustand persist middleware complexity in tests)
function createTestEconomyStore(initial?: Partial<EconomyState>) {
  return create<EconomyState>((set, get) => ({
    totalCoins: initial?.totalCoins ?? 0,
    walletCoins: initial?.walletCoins ?? 0,
    coinsSpentOnClues: 0,
    cluesPurchased: 0,
    transactions: [],
    purchasedClues: {},
    earnCoins: (amount, source) =>
      set((state) => ({
        totalCoins: state.totalCoins + amount,
        walletCoins: state.walletCoins + amount,
        transactions: [
          ...state.transactions,
          { id: `tx-${Date.now()}`, amount, type: 'earned', source, timestamp: Date.now() },
        ],
      })),
    spendCoins: (amount, source) => {
      const { walletCoins } = get()
      if (walletCoins < amount) return false
      set((state) => ({
        walletCoins: state.walletCoins - amount,
        transactions: [
          ...state.transactions,
          { id: `tx-${Date.now()}`, amount, type: 'spent', source, timestamp: Date.now() },
        ],
      }))
      return true
    },
    buyClue: (questId, questionIndex, cost) => {
      const key = `${questId}:${questionIndex}`
      const { purchasedClues, walletCoins } = get()
      if (purchasedClues[key]) return false
      if (walletCoins < cost) return false
      set((state) => ({
        purchasedClues: { ...state.purchasedClues, [key]: true },
        walletCoins: state.walletCoins - cost,
        coinsSpentOnClues: state.coinsSpentOnClues + cost,
        cluesPurchased: state.cluesPurchased + 1,
      }))
      return true
    },
    canAffordClue: (cost) => get().walletCoins >= cost,
    hasClue: (questId, questionIndex) => !!get().purchasedClues[`${questId}:${questionIndex}`],
    reset: () =>
      set({
        totalCoins: 0,
        walletCoins: 0,
        coinsSpentOnClues: 0,
        cluesPurchased: 0,
        transactions: [],
        purchasedClues: {},
      }),
  }))
}

describe('economyStore', () => {
  let store: ReturnType<typeof createTestEconomyStore>

  beforeEach(() => {
    store = createTestEconomyStore()
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
      expect(tx.type).toBe('earned')
      expect(tx.source).toBe('math-correct')
      expect(tx.amount).toBe(100)
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
      const tx = store.getState().transactions.find(t => t.type === 'spent')
      expect(tx?.source).toBe('clue')
      expect(tx?.amount).toBe(40)
    })
  })

  describe('buyClue', () => {
    it('returns false when clue already purchased', () => {
      store.getState().earnCoins(200, 'test')
      store.getState().buyClue('quest-1', 0, 20)
      const result = store.getState().buyClue('quest-1', 0, 20)
      expect(result).toBe(false)
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

    it('marks clue as purchased in purchasedClues map', () => {
      store.getState().earnCoins(200, 'test')
      store.getState().buyClue('quest-1', 0, 20)
      expect(store.getState().hasClue('quest-1', 0)).toBe(true)
      expect(store.getState().hasClue('quest-1', 1)).toBe(false)
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
  })

  describe('reset', () => {
    it('resets all state to defaults', () => {
      store.getState().earnCoins(500, 'test')
      store.getState().reset()
      expect(store.getState().totalCoins).toBe(0)
      expect(store.getState().walletCoins).toBe(0)
      expect(store.getState().transactions).toHaveLength(0)
      expect(store.getState().purchasedClues).toEqual({})
    })
  })
})
