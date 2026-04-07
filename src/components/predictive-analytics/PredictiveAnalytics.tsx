'use client';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSkillTreeStore } from '@/store/skillTreeStore';
import { useCognitiveStore } from '@/store/cognitiveStore';
import { useProgressStore } from '@/store/progressStore';
import type { PredictiveInsight, CareerReadiness, CurriculumSubject } from '@/types';

const CAREER_FIELDS: { field: string; emoji: string; requiredDomains: string[]; requiredSubjects: CurriculumSubject[] }[] = [
  { field: 'Software Engineering', emoji: '💻', requiredDomains: ['logic', 'spatial', 'attention'], requiredSubjects: ['math', 'science'] },
  { field: 'Medicine', emoji: '🏥', requiredDomains: ['memory', 'attention', 'processing-speed'], requiredSubjects: ['science', 'math'] },
  { field: 'Creative Writing', emoji: '✍️', requiredDomains: ['linguistics', 'memory', 'spatial'], requiredSubjects: ['english'] },
  { field: 'Data Science', emoji: '📊', requiredDomains: ['logic', 'processing-speed', 'attention'], requiredSubjects: ['math', 'science'] },
  { field: 'Architecture', emoji: '🏛️', requiredDomains: ['spatial', 'logic', 'memory'], requiredSubjects: ['math', 'science'] },
  { field: 'Psychology', emoji: '🧠', requiredDomains: ['linguistics', 'memory', 'attention'], requiredSubjects: ['social', 'socialSkills'] },
  { field: 'Law', emoji: '⚖️', requiredDomains: ['linguistics', 'logic', 'memory'], requiredSubjects: ['english', 'social'] },
  { field: 'Music & Arts', emoji: '🎨', requiredDomains: ['spatial', 'memory', 'linguistics'], requiredSubjects: ['english'] },
];

function calculatePredictiveInsights(): PredictiveInsight[] {
  const { profile } = useCognitiveStore.getState();
  const { totalNodesCompleted, totalNodesMastered } = useSkillTreeStore.getState();
  const { subjectMastery } = useProgressStore.getState();

  const subjects: (CurriculumSubject | string)[] = ['math', 'science', 'english', 'social', 'socialSkills'];
  const domains = Object.keys(profile.domains) as (keyof typeof profile.domains)[];

  const insights: PredictiveInsight[] = [];

  domains.forEach(domain => {
    const score = profile.domains[domain];
    const growthRate = profile.assessmentCount > 0 ? 2 : 0;
    const predicted30 = Math.min(100, score + growthRate * 3);
    const predicted90 = Math.min(100, score + growthRate * 9);

    insights.push({
      domain,
      currentMastery: score,
      predictedMastery30d: predicted30,
      predictedMastery90d: predicted90,
      trajectory: score > 60 ? 'rising' : score > 30 ? 'stable' : 'declining',
      estimatedMasteryDate: score >= 80 ? undefined : new Date(Date.now() + (100 - score) * 3 * 86400000).toISOString().split('T')[0],
      isStrength: profile.strengths.includes(domain),
      isFocusArea: profile.weaknesses.includes(domain),
    });
  });

  subjects.forEach(subject => {
    const mastery = subjectMastery[subject] || 0;
    const growthRate = totalNodesCompleted > 0 ? 3 : 1;
    const predicted30 = Math.min(100, mastery + growthRate * 3);
    const predicted90 = Math.min(100, mastery + growthRate * 9);

    insights.push({
      domain: subject as any,
      currentMastery: mastery,
      predictedMastery30d: predicted30,
      predictedMastery90d: predicted90,
      trajectory: mastery > 60 ? 'rising' : mastery > 20 ? 'stable' : 'declining',
      estimatedMasteryDate: mastery >= 80 ? undefined : new Date(Date.now() + (100 - mastery) * 2 * 86400000).toISOString().split('T')[0],
      isStrength: mastery > 50,
      isFocusArea: mastery < 20,
    });
  });

  return insights;
}

function calculateCareerReadiness(): CareerReadiness[] {
  const { profile } = useCognitiveStore.getState();
  const { subjectMastery } = useProgressStore.getState();

  return CAREER_FIELDS.map(career => {
    const domainScores = career.requiredDomains.map(d => profile.domains[d as keyof typeof profile.domains] || 0);
    const subjectScores = career.requiredSubjects.map(s => subjectMastery[s] || 0);
    const allScores = [...domainScores, ...subjectScores];
    const avgAlignment = allScores.reduce((a, b) => a + b, 0) / allScores.length;

    const missingSkills = [
      ...career.requiredDomains.filter(d => (profile.domains[d as keyof typeof profile.domains] || 0) < 50),
      ...career.requiredSubjects.filter(s => (subjectMastery[s] || 0) < 30),
    ];

    const readiness: CareerReadiness['readiness'] =
      avgAlignment >= 70 ? 'expert' : avgAlignment >= 50 ? 'ready' : avgAlignment >= 30 ? 'developing' : 'exploring';

    return {
      field: career.field,
      emoji: career.emoji,
      alignment: Math.round(avgAlignment),
      requiredSkills: [...career.requiredDomains, ...career.requiredSubjects],
      missingSkills,
      readiness,
    };
  }).sort((a, b) => b.alignment - a.alignment);
}

const TRAJECTORY_COLORS = {
  rising: '#22C55E',
  stable: '#F59E0B',
  declining: '#EF4444',
};

const READINESS_COLORS: Record<CareerReadiness['readiness'], string> = {
  exploring: '#6B7280',
  developing: '#F59E0B',
  ready: '#22C55E',
  expert: '#8B5CF6',
};

export default function PredictiveAnalytics() {
  const insights = useMemo(() => calculatePredictiveInsights(), []);
  const careers = useMemo(() => calculateCareerReadiness(), []);
  const { totalNodesCompleted, totalNodesMastered } = useSkillTreeStore.getState();
  const { profile } = useCognitiveStore.getState();

  const topStrengths = insights.filter(i => i.isStrength).slice(0, 3);
  const focusAreas = insights.filter(i => i.isFocusArea).slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">📈 Predictive Mastery Insights</h2>
        <p className="text-sm text-gray-400">Based on your cognitive profile and learning patterns</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Nodes Completed', value: totalNodesCompleted, emoji: '✅', color: '#22C55E' },
          { label: 'Nodes Mastered', value: totalNodesMastered, emoji: '🏆', color: '#FFD700' },
          { label: 'Learning Style', value: profile.learningStyle, emoji: '🎯', color: '#8B5CF6' },
          { label: 'Attention Span', value: `${profile.attentionSpanMinutes}m`, emoji: '⏱️', color: '#06B6D4' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl bg-gray-800/50 border border-gray-700"
          >
            <span className="text-2xl">{stat.emoji}</span>
            <p className="text-lg font-bold text-white mt-1">{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {topStrengths.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-green-400 mb-3">💪 Your Strengths</h3>
          <div className="flex flex-wrap gap-2">
            {topStrengths.map(insight => (
              <span
                key={insight.domain}
                className="px-3 py-1.5 rounded-full bg-green-500/20 text-green-300 text-sm border border-green-500/30"
              >
                {insight.domain} ({insight.currentMastery}%)
              </span>
            ))}
          </div>
        </div>
      )}

      {focusAreas.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-3">🎯 Focus Areas</h3>
          <div className="flex flex-wrap gap-2">
            {focusAreas.map(insight => (
              <span
                key={insight.domain}
                className="px-3 py-1.5 rounded-full bg-yellow-500/20 text-yellow-300 text-sm border border-yellow-500/30"
              >
                {insight.domain} ({insight.currentMastery}%)
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-white mb-3">📊 Domain Trajectories</h3>
        <div className="space-y-3">
          {insights.filter(i => typeof i.domain === 'string' && !['math', 'science', 'english', 'social', 'socialSkills'].includes(i.domain)).map((insight, i) => (
            <motion.div
              key={insight.domain}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white capitalize">{insight.domain}</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${TRAJECTORY_COLORS[insight.trajectory]}20`,
                    color: TRAJECTORY_COLORS[insight.trajectory],
                  }}
                >
                  {insight.trajectory}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${insight.currentMastery}%`, backgroundColor: TRAJECTORY_COLORS[insight.trajectory] }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-10 text-right">{insight.currentMastery}%</span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                <span>30d: {insight.predictedMastery30d}%</span>
                <span>90d: {insight.predictedMastery90d}%</span>
                {insight.estimatedMasteryDate && (
                  <span>Mastery est: {new Date(insight.estimatedMasteryDate).toLocaleDateString()}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-3">🚀 Career Readiness</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {careers.slice(0, 6).map((career, i) => (
            <motion.div
              key={career.field}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{career.emoji}</span>
                  <span className="font-semibold text-white text-sm">{career.field}</span>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: `${READINESS_COLORS[career.readiness]}20`,
                    color: READINESS_COLORS[career.readiness],
                  }}
                >
                  {career.readiness}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${career.alignment}%`, backgroundColor: READINESS_COLORS[career.readiness] }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-10 text-right">{career.alignment}%</span>
              </div>
              {career.missingSkills.length > 0 && (
                <p className="text-xs text-gray-500">
                  Build: {career.missingSkills.join(', ')}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
