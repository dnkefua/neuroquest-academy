import type { SkillNode, SkillNodeStatus, SkillTreeData, SkillTreeEdge } from '@/types';

export function resolveNodeStatus(
  node: SkillNode,
  completedNodeIds: Set<string>,
  inProgressNodeIds: Set<string>
): SkillNodeStatus {
  if (completedNodeIds.has(node.id)) {
    return node.masteryScore >= 90 ? 'mastered' : 'completed';
  }
  if (inProgressNodeIds.has(node.id)) return 'in-progress';
  const prereqsMet = node.prerequisites.every(id => completedNodeIds.has(id));
  return prereqsMet ? 'available' : 'locked';
}

export function computeFogOfWar(nodes: SkillNode[], completedNodeIds: Set<string>): SkillNode[] {
  const reachable = new Set<string>();
  const queue: string[] = [];
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  nodes.filter(n => n.prerequisites.length === 0).forEach(n => {
    queue.push(n.id);
    reachable.add(n.id);
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (completedNodeIds.has(current)) {
      nodes
        .filter(n => n.prerequisites.includes(current))
        .forEach(n => {
          if (!reachable.has(n.id)) {
            reachable.add(n.id);
            queue.push(n.id);
          }
        });
    }
  }

  return nodes.map(n => ({
    ...n,
    fogRevealed: reachable.has(n.id),
    status: resolveNodeStatus(n, completedNodeIds, new Set()),
  }));
}

export function getAvailableNodes(nodes: SkillNode[], completedNodeIds: Set<string>): SkillNode[] {
  return nodes.filter(n => {
    if (completedNodeIds.has(n.id)) return false;
    return n.prerequisites.every(id => completedNodeIds.has(id));
  });
}

export function getProgressionPath(
  nodes: SkillNode[],
  edges: SkillTreeEdge[],
  targetNodeId: string
): string[] {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const visited = new Set<string>();
  const path: string[] = [];

  function dfs(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    const node = nodeMap.get(nodeId);
    if (!node) return;
    node.prerequisites.forEach(dfs);
    path.push(nodeId);
  }

  dfs(targetNodeId);
  return path;
}

export function calculateCompletionPercentage(
  nodes: SkillNode[],
  completedNodeIds: Set<string>
): number {
  if (nodes.length === 0) return 0;
  const completed = nodes.filter(n => completedNodeIds.has(n.id)).length;
  return Math.round((completed / nodes.length) * 100);
}

export function getNextRecommendedNode(
  nodes: SkillNode[],
  completedNodeIds: Set<string>
): SkillNode | null {
  const available = getAvailableNodes(nodes, completedNodeIds);
  if (available.length === 0) return null;
  return available[0];
}

export function buildSkillTreeFromQuests(
  quests: { id: string; grade: number; subject: string; title: string; questions: unknown[] }[],
  programme: string,
  grade: number,
  subject: string,
  layout: 'linear' | 'branching' = 'linear'
): SkillTreeData {
  const nodes: SkillNode[] = [];
  const edges: SkillTreeEdge[] = [];
  const chunkSize = 3;
  const questChunks: typeof quests[] = [];

  for (let i = 0; i < quests.length; i += chunkSize) {
    questChunks.push(quests.slice(i, i + chunkSize));
  }

  const subjectColors: Record<string, string> = {
    math: '#8B5CF6',
    science: '#10B981',
    english: '#F59E0B',
    social: '#3B82F6',
    socialSkills: '#EC4899',
  };

  const subjectEmojis: Record<string, string> = {
    math: '🔢',
    science: '🔬',
    english: '📚',
    social: '🌍',
    socialSkills: '🤝',
  };

  const spacingX = 180;
  const spacingY = 140;
  const nodeTypes: ('quest' | 'boss' | 'milestone')[] = ['quest', 'quest', 'boss'];

  questChunks.forEach((chunk, chunkIndex) => {
    const nodeType = nodeTypes[chunkIndex % nodeTypes.length];
    const nodeId = `node-${subject}-${grade}-${chunkIndex}`;
    const isBoss = nodeType === 'boss';
    const row = Math.floor(chunkIndex / (layout === 'branching' ? 3 : 1));
    const col = layout === 'branching' ? chunkIndex % 3 : chunkIndex;
    const offsetX = layout === 'branching' ? (row % 2 === 0 ? 0 : spacingX / 2) : 0;

    const node: SkillNode = {
      id: nodeId,
      title: isBoss ? `Boss: ${chunk[0]?.title || 'Challenge'}` : chunk[0]?.title || `Quest ${chunkIndex + 1}`,
      subtitle: `${chunk.length} encounter${chunk.length > 1 ? 's' : ''}`,
      type: nodeType,
      subject: subject as any,
      grade,
      programme: programme as any,
      emoji: isBoss ? '⚔️' : subjectEmojis[subject] || '📖',
      color: subjectColors[subject] || '#6B7280',
      position: { x: col * spacingX + offsetX + 100, y: row * spacingY + 80 },
      prerequisites: chunkIndex > 0 ? [`node-${subject}-${grade}-${chunkIndex - 1}`] : [],
      questIds: chunk.map(q => q.id),
      xpReward: isBoss ? 200 : 100,
      coinReward: isBoss ? 150 : 50,
      estimatedMinutes: chunk.length * 10,
      description: `Master ${chunk[0]?.title || 'this topic'} through ${chunk.length} interactive encounter${chunk.length > 1 ? 's' : ''}`,
      fogRevealed: chunkIndex === 0,
      status: chunkIndex === 0 ? 'available' : 'locked',
      masteryScore: 0,
      attempts: 0,
    };

    nodes.push(node);

    if (chunkIndex > 0) {
      edges.push({
        from: `node-${subject}-${grade}-${chunkIndex - 1}`,
        to: nodeId,
        type: 'prerequisite',
      });
    }
  });

  if (nodes.length > 0) {
    const lastNode = nodes[nodes.length - 1];
    const capstoneId = `capstone-${subject}-${grade}`;
    nodes.push({
      id: capstoneId,
      title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Mastery`,
      subtitle: 'Capstone Challenge',
      type: 'capstone',
      subject: subject as any,
      grade,
      programme: programme as any,
      emoji: '🏆',
      color: '#FFD700',
      position: { x: lastNode.position.x, y: lastNode.position.y + spacingY },
      prerequisites: [lastNode.id],
      questIds: [],
      xpReward: 500,
      coinReward: 300,
      estimatedMinutes: 30,
      description: `Prove your mastery of ${subject} with the ultimate challenge`,
      fogRevealed: false,
      status: 'locked',
      masteryScore: 0,
      attempts: 0,
    });
    edges.push({ from: lastNode.id, to: capstoneId, type: 'prerequisite' });
  }

  return {
    id: `tree-${programme.toLowerCase()}-${grade}-${subject}`,
    name: `${programme} Grade ${grade} - ${subject.charAt(0).toUpperCase() + subject.slice(1)}`,
    programme: programme as any,
    grade,
    subject: subject as any,
    nodes,
    edges,
  };
}

export function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    math: '#8B5CF6',
    science: '#10B981',
    english: '#F59E0B',
    social: '#3B82F6',
    socialSkills: '#EC4899',
  };
  return colors[subject] || '#6B7280';
}

export function getNodeStatusColor(status: SkillNodeStatus): string {
  const colors: Record<SkillNodeStatus, string> = {
    locked: '#374151',
    available: '#22C55E',
    'in-progress': '#F59E0B',
    completed: '#3B82F6',
    mastered: '#FFD700',
  };
  return colors[status];
}

export function getNodeGlowColor(status: SkillNodeStatus): string {
  const glows: Record<SkillNodeStatus, string> = {
    locked: 'transparent',
    available: 'rgba(34, 197, 94, 0.4)',
    'in-progress': 'rgba(245, 158, 11, 0.4)',
    completed: 'rgba(59, 130, 246, 0.3)',
    mastered: 'rgba(255, 215, 0, 0.5)',
  };
  return glows[status];
}
