'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { CurriculumSubject, SkillNode } from '@/types';
import SkillTree from '@/components/skill-tree/SkillTree';
import DailyRewardChest from '@/components/daily-reward/DailyRewardChest';
import { useDailyRewardStore } from '@/store/dailyRewardStore';
import { useSkillTreeStore } from '@/store/skillTreeStore';
import { useProgressStore } from '@/store/progressStore';
import { MYP_QUESTS } from '@/curriculum/data/grades6-10';
import { PYP_QUESTS } from '@/curriculum/data/grades1-5';
import { DP_QUESTS } from '@/curriculum/data/grades11-12';
import { getSubjectColor } from '@/lib/skill-tree-utils';

const SUBJECTS: { id: CurriculumSubject; label: string; emoji: string }[] = [
  { id: 'math', label: 'Math', emoji: '🔢' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'english', label: 'English', emoji: '📚' },
  { id: 'social', label: 'Social Studies', emoji: '🌍' },
  { id: 'socialSkills', label: 'Social Skills', emoji: '🤝' },
];

function getQuestsForGrade(grade: number, subject: CurriculumSubject) {
  let allQuests: { id: string; grade: number; subject: string; title: string; questions: unknown[] }[] = [];

  if (grade <= 5) {
    allQuests = PYP_QUESTS.filter(q => q.grade === grade && q.subject === subject);
  } else if (grade <= 10) {
    allQuests = MYP_QUESTS.filter(q => q.grade === grade && q.subject === subject);
  } else {
    allQuests = DP_QUESTS.filter(q => q.grade === grade && q.subject === subject);
  }

  return allQuests;
}

export default function SkillTreePage() {
  const { currentGrade, currentProgramme } = useProgressStore();
  const { canClaimToday } = useDailyRewardStore();
  const { totalNodesCompleted, totalNodesMastered } = useSkillTreeStore();

  const [selectedSubject, setSelectedSubject] = useState<CurriculumSubject>('math');
  const [showRewardChest, setShowRewardChest] = useState(false);

  const quests = getQuestsForGrade(currentGrade, selectedSubject);

  const handleNodeSelect = (node: SkillNode) => {
    const firstQuestId = node.questIds[0];
    if (firstQuestId) {
      window.location.href = `/game/${selectedSubject}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold mt-1">
              🗺️ {currentProgramme} Grade {currentGrade} Skill Tree
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Nodes Completed</p>
              <p className="text-xl font-bold text-green-400">{totalNodesCompleted}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Nodes Mastered</p>
              <p className="text-xl font-bold text-yellow-400">{totalNodesMastered}</p>
            </div>
            {canClaimToday() && (
              <button
                onClick={() => setShowRewardChest(true)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold hover:from-yellow-400 hover:to-orange-400 transition-all"
              >
                🎁 Daily Reward
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {SUBJECTS.map((subj) => {
            const subjectQuests = getQuestsForGrade(currentGrade, subj.id);
            const isActive = subj.id === selectedSubject;
            return (
              <button
                key={subj.id}
                onClick={() => setSelectedSubject(subj.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
                style={isActive ? { backgroundColor: getSubjectColor(subj.id) } : {}}
              >
                <span>{subj.emoji}</span>
                <span>{subj.label}</span>
                <span className="text-xs opacity-70">({subjectQuests.length})</span>
              </button>
            );
          })}
        </div>

        {quests.length > 0 ? (
          <SkillTree
            programme={currentProgramme}
            grade={currentGrade}
            subject={selectedSubject}
            quests={quests}
            onNodeSelect={handleNodeSelect}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <span className="text-4xl mb-4">📭</span>
            <p className="text-lg">No quests available for {SUBJECTS.find(s => s.id === selectedSubject)?.label}</p>
            <p className="text-sm mt-1">Check back soon for new content!</p>
          </div>
        )}
      </div>

      <DailyRewardChest
        isOpen={showRewardChest}
        onClose={() => setShowRewardChest(false)}
      />
    </div>
  );
}
