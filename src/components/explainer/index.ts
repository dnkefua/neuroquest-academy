/**
 * AI Explainer Animations for NeuroQuest
 *
 * This module provides animated diagram components synchronized with narration
 * for interactive learning experiences.
 *
 * Components:
 * - AnimatedDiagram: Base component for step-by-step animations
 * - MathExplainer: Math concept visualizations (number line, fractions, operations)
 * - ScienceExplainer: Science concept visualizations (water cycle, circuits, forces)
 * - DiagramSequencer: Syncs diagrams with TTS narration
 *
 * Usage:
 * ```typescript
 * import { MathExplainer, ScienceExplainer, DiagramSequencer } from '@/components/explainer';
 * import { useTTS } from '@/app/game/shared/tts';
 *
 * function LessonComponent() {
 *   const { speak } = useTTS();
 *
 *   return (
 *     <DiagramSequencer
 *       steps={[
 *         { id: 'intro', narration: 'Let us explore fractions', duration: 2000 },
 *         { id: 'divide', narration: 'First, we divide the whole', duration: 2500 },
 *       ]}
 *       onNarration={(text) => speak(text)}
 *     >
 *       <MathExplainer concept="fraction" values={{ numerator: 3, denominator: 4 }} />
 *     </DiagramSequencer>
 *   );
 * }
 * ```
 */

export { default as AnimatedDiagram } from './AnimatedDiagram';
export { default as MathExplainer } from './MathExplainer';
export { default as ScienceExplainer } from './ScienceExplainer';
export { default as DiagramSequencer, useDiagramSequencer } from './DiagramSequencer';

export type { AnimationStep } from './AnimatedDiagram';
export type { SequencerStep } from './DiagramSequencer';