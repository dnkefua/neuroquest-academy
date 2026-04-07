'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocialStore } from '@/store/socialStore';
import type { QuestPartyMember, PeerListing } from '@/store/socialStore';

export default function SocialHub() {
  const [activeTab, setActiveTab] = useState<'party' | 'marketplace'>('party');
  const {
    currentParty,
    createParty,
    leaveParty,
    contributePartyXP,
    getPartyBonus,
    peerListings,
    createListing,
    purchaseHint,
    getComplementaryMatch,
  } = useSocialStore();

  const [partyName, setPartyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showCreateParty, setShowCreateParty] = useState(false);

  const handleCreateParty = () => {
    if (!partyName.trim()) return;
    createParty(partyName.trim());
    setPartyName('');
    setShowCreateParty(false);
  };

  const handleCreateListing = () => {
    const listing: Omit<PeerListing, 'id' | 'sales' | 'rating' | 'createdAt'> = {
      sellerUid: 'self',
      sellerName: 'You',
      sellerGrade: 6,
      questId: 'g6-math-q1',
      questTitle: 'Number Line Basics',
      hintPreview: 'Think of the number line as a path...',
      price: 10,
    };
    createListing(listing);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">👥 Social Hub</h2>
        <p className="text-sm text-gray-400">Quest Parties & Peer Marketplace</p>
      </div>

      <div className="flex gap-2">
        {[
          { id: 'party' as const, label: 'Quest Party', emoji: '⚔️' },
          { id: 'marketplace' as const, label: 'Peer Market', emoji: '🏪' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'party' && (
        <div className="space-y-4">
          {!currentParty ? (
            <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700 text-center">
              <span className="text-4xl mb-4 block">⚔️</span>
              <h3 className="text-lg font-bold text-white mb-2">No Active Party</h3>
              <p className="text-sm text-gray-400 mb-4">
                Form a Quest Party of 3-6 members. When one completes a node, everyone gets an XP boost!
              </p>

              {!showCreateParty ? (
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowCreateParty(true)}
                    className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-500"
                  >
                    Create Party
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 font-medium hover:bg-gray-600"
                  >
                    Join with Code
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 max-w-xs mx-auto">
                  <input
                    type="text"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    placeholder="Party name..."
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white text-sm border border-gray-600"
                  />
                  <button
                    onClick={handleCreateParty}
                    className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium"
                  >
                    Create
                  </button>
                </div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">{currentParty.name}</h3>
                    <p className="text-xs text-gray-400">
                      Level {currentParty.partyLevel} · {currentParty.members.length}/{currentParty.maxMembers} members
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-purple-300 font-bold">{currentParty.totalPartyXP} XP</p>
                    <p className="text-xs text-green-400">+{getPartyBonus()}% party bonus</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-gray-500">Invite code:</span>
                  <code className="px-2 py-1 rounded bg-gray-700 text-purple-300 text-sm font-mono">
                    {currentParty.inviteCode}
                  </code>
                </div>

                <div className="space-y-2">
                  {currentParty.members.map((member) => (
                    <div key={member.uid} className="flex items-center gap-3 p-2 rounded-lg bg-gray-700/30">
                      <span className="text-xl">{member.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">{member.name}</p>
                        <p className="text-xs text-gray-400">Grade {member.grade} · {member.xpContributed} XP</p>
                      </div>
                    </div>
                  ))}
                  {currentParty.members.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Share your invite code to add members!
                    </p>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => contributePartyXP(50)}
                    className="flex-1 px-3 py-2 rounded-lg bg-purple-600/20 text-purple-300 text-sm font-medium hover:bg-purple-600/30"
                  >
                    +50 XP to Party
                  </button>
                  <button
                    onClick={leaveParty}
                    className="px-3 py-2 rounded-lg bg-red-500/20 text-red-300 text-sm font-medium hover:bg-red-500/30"
                  >
                    Leave
                  </button>
                </div>
              </div>

              {getComplementaryMatch() && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                  <p className="text-sm text-green-300">
                    🤝 <strong>Complementary Match Found!</strong> You and a party member have complementary cognitive strengths.
                    Try working on quests together!
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {activeTab === 'marketplace' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Peer Hint Marketplace</h3>
            <button
              onClick={handleCreateListing}
              className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-500"
            >
              + List a Hint
            </button>
          </div>

          {peerListings.length === 0 ? (
            <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700 text-center">
              <span className="text-4xl mb-4 block">🏪</span>
              <p className="text-sm text-gray-400">
                No hints listed yet. Be the first to share your knowledge and earn Neuro-Coins!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {peerListings.map((listing) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-gray-800/50 border border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{listing.questTitle}</p>
                      <p className="text-xs text-gray-400">{listing.hintPreview}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-yellow-400">💰 {listing.price}</p>
                      <p className="text-xs text-gray-500">⭐ {listing.rating} ({listing.sales} sales)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => purchaseHint(listing.id, 'Full hint content here...', listing.price)}
                    className="mt-2 w-full px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 text-sm font-medium hover:bg-purple-600/30"
                  >
                    Purchase Hint
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
