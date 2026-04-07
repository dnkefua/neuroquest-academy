'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SkillNode, SkillTreeData, CurriculumSubject } from '@/types';
import { useSkillTreeStore } from '@/store/skillTreeStore';
import { useProgressStore } from '@/store/progressStore';
import { getSubjectColor, getNodeStatusColor } from '@/lib/skill-tree-utils';
import SkillNodeComponent from './SkillNode';

interface SkillTreeProps {
  programme: string;
  grade: number;
  subject: CurriculumSubject;
  quests: { id: string; grade: number; subject: string; title: string; questions: unknown[] }[];
  onNodeSelect?: (node: SkillNode) => void;
}

export default function SkillTree({ programme, grade, subject, quests, onNodeSelect }: SkillTreeProps) {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [layout] = useState<'linear' | 'branching'>('branching');

  const { trees, registerTree, buildTreeFromQuests, startNode, getNodeStatus } = useSkillTreeStore();
  const { completedQuests } = useProgressStore();

  const treeId = `tree-${programme.toLowerCase()}-${grade}-${subject}`;
  let tree = trees[treeId];

  if (!tree) {
    buildTreeFromQuests(quests, programme, grade, subject, layout);
    tree = trees[treeId];
  }

  if (!tree) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading skill tree...
      </div>
    );
  }

  const completedSet = new Set(completedQuests);
  const progress = tree.nodes.filter(n => completedSet.has(n.id) || n.status === 'completed' || n.status === 'mastered').length;
  const total = tree.nodes.length;
  const percentage = total > 0 ? Math.round((progress / total) * 100) : 0;

  const svgWidth = Math.max(...tree.nodes.map(n => n.position.x)) + 200;
  const svgHeight = Math.max(...tree.nodes.map(n => n.position.y)) + 200;

  const handleNodeClick = (node: SkillNode) => {
    if (node.status !== 'locked') {
      setSelectedNode(node);
      startNode(node.id);
      onNodeSelect?.(node);
    }
  };

  return (
    <div className="relative w-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{tree.name}</h2>
          <p className="text-sm text-gray-400">{progress}/{total} nodes completed</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-32 h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: getSubjectColor(subject) }}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className="text-sm font-semibold text-white">{percentage}%</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/50">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="min-w-full"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="100%" stopColor="#4B5563" />
            </linearGradient>
          </defs>

          {tree.edges.map((edge, i) => {
            const fromNode = tree.nodes.find(n => n.id === edge.from);
            const toNode = tree.nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const isUnlocked = fromNode.status === 'completed' || fromNode.status === 'mastered';

            return (
              <motion.line
                key={`edge-${i}`}
                x1={fromNode.position.x}
                y1={fromNode.position.y}
                x2={toNode.position.x}
                y2={toNode.position.y}
                stroke={isUnlocked ? getNodeStatusColor(fromNode.status) : '#374151'}
                strokeWidth={isUnlocked ? 3 : 2}
                strokeDasharray={!isUnlocked ? '6 4' : '0'}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
            );
          })}

          {tree.nodes.map((node) => (
            <SkillNodeComponent
              key={node.id}
              node={node}
              onClick={handleNodeClick}
            />
          ))}
        </svg>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 p-4 rounded-xl border border-gray-700 bg-gray-800/80"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{selectedNode.emoji}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedNode.title}</h3>
                  <p className="text-sm text-gray-400">{selectedNode.subtitle}</p>
                  <p className="text-sm text-gray-300 mt-1">{selectedNode.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300">
                ✨ {selectedNode.xpReward} XP
              </div>
              <div className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300">
                💰 {selectedNode.coinReward} coins
              </div>
              <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300">
                ⏱️ {selectedNode.estimatedMinutes} min
              </div>
              <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-300">
                📊 {selectedNode.questIds.length} encounters
              </div>
            </div>

            {selectedNode.attempts > 0 && (
              <div className="mt-3 text-sm text-gray-400">
                Attempts: {selectedNode.attempts} | Best: {selectedNode.bestScore || 0}%
              </div>
            )}

            {selectedNode.status === 'available' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-3 px-6 py-2 rounded-lg font-semibold text-white"
                style={{ backgroundColor: getSubjectColor(subject) }}
                onClick={() => {
                  startNode(selectedNode.id);
                  onNodeSelect?.(selectedNode);
                }}
              >
                Begin Quest →
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
