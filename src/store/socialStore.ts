'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface QuestPartyMember {
  uid: string;
  name: string;
  grade: number;
  emoji: string;
  xpContributed: number;
  lastActive: string;
  cognitiveProfile: {
    strengths: string[];
    weaknesses: string[];
  };
}

export interface QuestParty {
  id: string;
  name: string;
  members: QuestPartyMember[];
  maxMembers: number;
  createdAt: string;
  totalPartyXP: number;
  partyLevel: number;
  activeQuest: string | null;
  inviteCode: string;
}

export interface PeerListing {
  id: string;
  sellerUid: string;
  sellerName: string;
  sellerGrade: number;
  questId: string;
  questTitle: string;
  hintPreview: string;
  price: number;
  rating: number;
  sales: number;
  createdAt: string;
}

export interface PeerPurchase {
  listingId: string;
  buyerUid: string;
  hint: string;
  purchasedAt: string;
  price: number;
}

interface SocialState {
  currentParty: QuestParty | null;
  pendingInvites: string[];
  peerListings: PeerListing[];
  myListings: string[];
  myPurchases: PeerPurchase[];
  partyXPBoosts: number;

  createParty: (name: string) => QuestParty;
  joinParty: (inviteCode: string) => boolean;
  leaveParty: () => void;
  addPartyMember: (member: QuestPartyMember) => void;
  contributePartyXP: (xp: number) => void;
  setActiveQuest: (questId: string) => void;
  createListing: (listing: Omit<PeerListing, 'id' | 'sales' | 'rating' | 'createdAt'>) => void;
  removeListing: (listingId: string) => void;
  purchaseHint: (listingId: string, hint: string, price: number) => boolean;
  rateListing: (listingId: string, rating: number) => void;
  getPartyBonus: () => number;
  getComplementaryMatch: () => QuestPartyMember | null;
  reset: () => void;
}

const DEFAULT_STATE = {
  currentParty: null as QuestParty | null,
  pendingInvites: [] as string[],
  peerListings: [] as PeerListing[],
  myListings: [] as string[],
  myPurchases: [] as PeerPurchase[],
  partyXPBoosts: 0,
};

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const useSocialStore = create<SocialState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      createParty: (name) => {
        const party: QuestParty = {
          id: `party-${Date.now()}`,
          name,
          members: [],
          maxMembers: 6,
          createdAt: new Date().toISOString(),
          totalPartyXP: 0,
          partyLevel: 1,
          activeQuest: null,
          inviteCode: generateInviteCode(),
        };
        set({ currentParty: party });
        return party;
      },

      joinParty: (inviteCode) => {
        const party = get().currentParty;
        if (!party) return false;
        if (party.members.length >= party.maxMembers) return false;
        if (party.inviteCode !== inviteCode) return false;
        return true;
      },

      leaveParty: () => {
        set({ currentParty: null });
      },

      addPartyMember: (member) => {
        set((s) => {
          if (!s.currentParty) return s;
          if (s.currentParty.members.length >= s.currentParty.maxMembers) return s;
          return {
            currentParty: {
              ...s.currentParty,
              members: [...s.currentParty.members, member],
            },
          };
        });
      },

      contributePartyXP: (xp) => {
        set((s) => {
          if (!s.currentParty) return s;
          const newTotalXP = s.currentParty.totalPartyXP + xp;
          const newLevel = Math.floor(newTotalXP / 1000) + 1;
          const boost = Math.floor(s.currentParty.members.length * 0.05 * 100) / 100;
          return {
            currentParty: {
              ...s.currentParty,
              totalPartyXP: newTotalXP,
              partyLevel: newLevel,
            },
            partyXPBoosts: boost,
          };
        });
      },

      setActiveQuest: (questId) => {
        set((s) => ({
          currentParty: s.currentParty ? { ...s.currentParty, activeQuest: questId } : null,
        }));
      },

      createListing: (listing) => {
        const newListing: PeerListing = {
          ...listing,
          id: `listing-${Date.now()}`,
          sales: 0,
          rating: 5,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          peerListings: [...s.peerListings, newListing],
          myListings: [...s.myListings, newListing.id],
        }));
      },

      removeListing: (listingId) => {
        set((s) => ({
          peerListings: s.peerListings.filter(l => l.id !== listingId),
          myListings: s.myListings.filter(id => id !== listingId),
        }));
      },

      purchaseHint: (listingId, hint, price) => {
        set((s) => {
          const purchase: PeerPurchase = {
            listingId,
            buyerUid: 'self',
            hint,
            purchasedAt: new Date().toISOString(),
            price,
          };
          return {
            peerListings: s.peerListings.map(l =>
              l.id === listingId ? { ...l, sales: l.sales + 1 } : l
            ),
            myPurchases: [...s.myPurchases, purchase],
          };
        });
        return true;
      },

      rateListing: (listingId, rating) => {
        set((s) => ({
          peerListings: s.peerListings.map(l =>
            l.id === listingId ? { ...l, rating: Math.round((l.rating + rating) / 2 * 10) / 10 } : l
          ),
        }));
      },

      getPartyBonus: () => {
        const party = get().currentParty;
        if (!party || party.members.length < 2) return 0;
        return Math.min(party.members.length * 5, 25);
      },

      getComplementaryMatch: () => {
        const party = get().currentParty;
        if (!party || party.members.length < 2) return null;
        const members = party.members;
        for (let i = 0; i < members.length; i++) {
          for (let j = i + 1; j < members.length; j++) {
            const a = members[i];
            const b = members[j];
            const aHasStrengthBNeeds = a.cognitiveProfile.strengths.some(
              s => b.cognitiveProfile.weaknesses.includes(s)
            );
            const bHasStrengthANeeds = b.cognitiveProfile.strengths.some(
              s => a.cognitiveProfile.weaknesses.includes(s)
            );
            if (aHasStrengthBNeeds || bHasStrengthANeeds) {
              return aHasStrengthBNeeds ? b : a;
            }
          }
        }
        return null;
      },

      reset: () => set(DEFAULT_STATE),
    }),
    {
      name: 'nq-social',
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
        currentParty: s.currentParty,
        pendingInvites: s.pendingInvites,
        myListings: s.myListings,
        myPurchases: s.myPurchases,
        partyXPBoosts: s.partyXPBoosts,
      }),
    }
  )
);
