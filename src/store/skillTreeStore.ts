'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SkillNode, SkillTreeData, SkillNodeStatus } from '@/types';
import {
  resolveNodeStatus,
  computeFogOfWar,
  calculateCompletionPercentage,
  getAvailableNodes,
  getNextRecommendedNode,
  buildSkillTreeFromQuests,
} from '@/lib/skill-tree-utils';

interface SkillTreeState {
  trees: Record<string, SkillTreeData>;
  completedNodes: Record<string, boolean>;
  inProgressNodes: Record<string, boolean>;
  nodeMastery: Record<string, number>;
  nodeAttempts: Record<string, number>;
  nodeBestScores: Record<string, number>;
  lastVisitedNode: string | null;
  totalNodesCompleted: number;
  totalNodesMastered: number;

  registerTree: (tree: SkillTreeData) => void;
  buildTreeFromQuests: (
    quests: { id: string; grade: number; subject: string; title: string; questions: unknown[] }[],
    programme: string,
    grade: number,
    subject: string,
    layout?: 'linear' | 'branching'
  ) => void;
  startNode: (nodeId: string) => void;
  completeNode: (nodeId: string, score: number) => void;
  getNodeStatus: (nodeId: string) => SkillNodeStatus;
  getTreeProgress: (treeId: string) => number;
  getAvailableNodesForTree: (treeId: string) => SkillNode[];
  getNextRecommendedNodeForTree: (treeId: string) => SkillNode | null;
  getNodeMastery: (nodeId: string) => number;
  getNodeAttempts: (nodeId: string) => number;
  getNodeBestScore: (nodeId: string) => number;
  isNodeUnlocked: (nodeId: string) => boolean;
  getLastVisitedNode: () => string | null;
  reset: () => void;
}

const DEFAULT_STATE = {
  trees: {} as Record<string, SkillTreeData>,
  completedNodes: {} as Record<string, boolean>,
  inProgressNodes: {} as Record<string, boolean>,
  nodeMastery: {} as Record<string, number>,
  nodeAttempts: {} as Record<string, number>,
  nodeBestScores: {} as Record<string, number>,
  lastVisitedNode: null as string | null,
  totalNodesCompleted: 0,
  totalNodesMastered: 0,
};

export const useSkillTreeStore = create<SkillTreeState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      registerTree: (tree) => {
        const { completedNodes } = get();
        const completedSet = new Set(Object.keys(completedNodes).filter(k => completedNodes[k]));
        const updatedNodes = computeFogOfWar(tree.nodes, completedSet);
        const updatedTree = { ...tree, nodes: updatedNodes };

        set((s) => ({
          trees: { ...s.trees, [tree.id]: updatedTree },
        }));
      },

      buildTreeFromQuests: (quests, programme, grade, subject, layout = 'linear') => {
        const tree = buildSkillTreeFromQuests(quests, programme, grade, subject, layout);
        get().registerTree(tree);
      },

      startNode: (nodeId) => {
        set((s) => ({
          inProgressNodes: { ...s.inProgressNodes, [nodeId]: true },
          lastVisitedNode: nodeId,
          nodeAttempts: {
            ...s.nodeAttempts,
            [nodeId]: (s.nodeAttempts[nodeId] || 0) + 1,
          },
        }));
      },

      completeNode: (nodeId, score) => {
        set((s) => {
          const newInProgress = { ...s.inProgressNodes };
          delete newInProgress[nodeId];

          const newCompleted = { ...s.completedNodes, [nodeId]: true };
          const newMastery = { ...s.nodeMastery, [nodeId]: score };
          const newBestScores = {
            ...s.nodeBestScores,
            [nodeId]: Math.max(s.nodeBestScores[nodeId] || 0, score),
          };

          const isMastered = score >= 90;
          const newTotalCompleted = s.totalNodesCompleted + (s.completedNodes[nodeId] ? 0 : 1);
          const newTotalMastered = s.totalNodesMastered + (isMastered && !s.nodeMastery[nodeId] ? 1 : 0);

          const updatedTrees = { ...s.trees };
          for (const [treeId, tree] of Object.entries(updatedTrees)) {
            const completedSet = new Set(Object.keys(newCompleted).filter(k => newCompleted[k]));
            updatedTrees[treeId] = {
              ...tree,
              nodes: computeFogOfWar(tree.nodes, completedSet),
            };
          }

          return {
            completedNodes: newCompleted,
            inProgressNodes: newInProgress,
            nodeMastery: newMastery,
            nodeBestScores: newBestScores,
            totalNodesCompleted: newTotalCompleted,
            totalNodesMastered: newTotalMastered,
            trees: updatedTrees,
          };
        });
      },

      getNodeStatus: (nodeId) => {
        const { completedNodes, inProgressNodes } = get();
        const completedSet = new Set(Object.keys(completedNodes).filter(k => completedNodes[k]));
        const inProgressSet = new Set(Object.keys(inProgressNodes).filter(k => inProgressNodes[k]));

        for (const tree of Object.values(get().trees)) {
          const node = tree.nodes.find(n => n.id === nodeId);
          if (node) {
            return resolveNodeStatus(node, completedSet, inProgressSet);
          }
        }
        return 'locked';
      },

      getTreeProgress: (treeId) => {
        const tree = get().trees[treeId];
        if (!tree) return 0;
        const { completedNodes } = get();
        const completedSet = new Set(Object.keys(completedNodes).filter(k => completedNodes[k]));
        return calculateCompletionPercentage(tree.nodes, completedSet);
      },

      getAvailableNodesForTree: (treeId) => {
        const tree = get().trees[treeId];
        if (!tree) return [];
        const { completedNodes } = get();
        const completedSet = new Set(Object.keys(completedNodes).filter(k => completedNodes[k]));
        return getAvailableNodes(tree.nodes, completedSet);
      },

      getNextRecommendedNodeForTree: (treeId) => {
        const tree = get().trees[treeId];
        if (!tree) return null;
        const { completedNodes } = get();
        const completedSet = new Set(Object.keys(completedNodes).filter(k => completedNodes[k]));
        return getNextRecommendedNode(tree.nodes, completedSet);
      },

      getNodeMastery: (nodeId) => get().nodeMastery[nodeId] || 0,

      getNodeAttempts: (nodeId) => get().nodeAttempts[nodeId] || 0,

      getNodeBestScore: (nodeId) => get().nodeBestScores[nodeId] || 0,

      isNodeUnlocked: (nodeId) => {
        const status = get().getNodeStatus(nodeId);
        return status !== 'locked';
      },

      getLastVisitedNode: () => get().lastVisitedNode,

      reset: () => set(DEFAULT_STATE),
    }),
    {
      name: 'nq-skill-tree',
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
        completedNodes: s.completedNodes,
        inProgressNodes: s.inProgressNodes,
        nodeMastery: s.nodeMastery,
        nodeAttempts: s.nodeAttempts,
        nodeBestScores: s.nodeBestScores,
        lastVisitedNode: s.lastVisitedNode,
        totalNodesCompleted: s.totalNodesCompleted,
        totalNodesMastered: s.totalNodesMastered,
      }),
    }
  )
);
