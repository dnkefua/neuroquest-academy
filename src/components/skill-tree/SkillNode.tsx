'use client';
import { motion } from 'framer-motion';
import type { SkillNode, SkillNodeStatus } from '@/types';
import { getNodeStatusColor, getNodeGlowColor } from '@/lib/skill-tree-utils';

interface SkillNodeProps {
  node: SkillNode;
  onClick: (node: SkillNode) => void;
  size?: number;
}

const statusAnimations: Record<SkillNodeStatus, { scale: number; rotate: number }> = {
  locked: { scale: 1, rotate: 0 },
  available: { scale: 1.05, rotate: 0 },
  'in-progress': { scale: 1.08, rotate: 0 },
  completed: { scale: 1, rotate: 0 },
  mastered: { scale: 1.02, rotate: 0 },
};

export default function SkillNodeComponent({ node, onClick, size = 80 }: SkillNodeProps) {
  const statusColor = getNodeStatusColor(node.status);
  const glowColor = getNodeGlowColor(node.status);
  const isLocked = node.status === 'locked';
  const isAvailable = node.status === 'available';
  const isInProgress = node.status === 'in-progress';
  const isCompleted = node.status === 'completed' || node.status === 'mastered';

  const anim = statusAnimations[node.status];

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: isLocked ? 0.4 : 1,
        scale: anim.scale,
        rotate: anim.rotate,
      }}
      whileHover={isLocked ? {} : { scale: 1.15, filter: 'brightness(1.2)' }}
      whileTap={isLocked ? {} : { scale: 0.95 }}
      onClick={() => !isLocked && onClick(node)}
      style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {isAvailable && (
        <motion.circle
          cx={node.position.x}
          cy={node.position.y}
          r={size / 2 + 8}
          fill="none"
          stroke={statusColor}
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {isInProgress && (
        <motion.circle
          cx={node.position.x}
          cy={node.position.y}
          r={size / 2 + 6}
          fill="none"
          stroke={statusColor}
          strokeWidth={2}
          strokeDasharray="8 4"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${node.position.x}px ${node.position.y}px` }}
        />
      )}

      <circle
        cx={node.position.x}
        cy={node.position.y}
        r={size / 2}
        fill={isCompleted ? statusColor : isLocked ? '#1F2937' : node.color}
        stroke={statusColor}
        strokeWidth={isInProgress ? 3 : 2}
        filter={isAvailable || isInProgress ? `drop-shadow(0 0 8px ${glowColor})` : undefined}
      />

      {node.masteryScore > 0 && (
        <circle
          cx={node.position.x}
          cy={node.position.y}
          r={size / 2 - 4}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={4}
          strokeDasharray={`${(node.masteryScore / 100) * 2 * Math.PI * (size / 2 - 4)} ${2 * Math.PI * (size / 2 - 4)}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${node.position.x} ${node.position.y})`}
        />
      )}

      <text
        x={node.position.x}
        y={node.position.y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.35}
        fill={isLocked ? '#6B7280' : '#FFFFFF'}
        style={{ pointerEvents: 'none' }}
      >
        {isLocked ? '🔒' : node.emoji}
      </text>

      <text
        x={node.position.x}
        y={node.position.y + size / 2 + 16}
        textAnchor="middle"
        fontSize={11}
        fill={isLocked ? '#6B7280' : '#E5E7EB'}
        fontWeight={isAvailable || isInProgress ? '600' : '400'}
        style={{ pointerEvents: 'none' }}
      >
        {node.title.length > 18 ? node.title.slice(0, 16) + '...' : node.title}
      </text>

      {node.masteryScore > 0 && (
        <text
          x={node.position.x}
          y={node.position.y + size / 2 + 30}
          textAnchor="middle"
          fontSize={10}
          fill={getNodeStatusColor(node.status === 'mastered' ? 'mastered' : 'completed')}
          fontWeight="600"
          style={{ pointerEvents: 'none' }}
        >
          {node.masteryScore}%
        </text>
      )}

      {isAvailable && (
        <motion.text
          x={node.position.x}
          y={node.position.y - size / 2 - 8}
          textAnchor="middle"
          fontSize={10}
          fill="#22C55E"
          fontWeight="700"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ pointerEvents: 'none' }}
        >
          START
        </motion.text>
      )}
    </motion.g>
  );
}
