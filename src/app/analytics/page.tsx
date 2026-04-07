'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PredictiveAnalytics from '@/components/predictive-analytics/PredictiveAnalytics';
import { useCognitiveStore } from '@/store/cognitiveStore';
import { useSkillTreeStore } from '@/store/skillTreeStore';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'careers'>('overview');
  const { isBaselineComplete } = useCognitiveStore.getState();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold mt-1">📊 Analytics & Future-Pathing</h1>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { id: 'overview' as const, label: 'Overview', emoji: '📈' },
            { id: 'careers' as const, label: 'Career Paths', emoji: '🚀' },
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

        {!isBaselineComplete ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <span className="text-6xl mb-4 block">🧠</span>
            <h2 className="text-2xl font-bold text-white mb-2">Complete Your Cognitive Baseline</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Take the 10-minute assessment to unlock personalized analytics, predictive insights, and career readiness tracking.
            </p>
            <Link
              href="/cognitive-baseline"
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-500 hover:to-blue-500 transition-all"
            >
              Start Assessment →
            </Link>
          </motion.div>
        ) : (
          <PredictiveAnalytics />
        )}
      </div>
    </div>
  );
}
