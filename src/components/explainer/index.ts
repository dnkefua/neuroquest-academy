/**
 * AI Explainer Animations for NeuroQuest
 *
 * This module provides animated diagram components synchronized with narration
 * for interactive learning experiences.
 *
 * Components:
 * - AnimatedTutor: Full lesson component with AI-generated content
 * - AnimatedDiagram: Base component for step-by-step animations
 * - MathExplainer: Math concept visualizations
 * - ScienceExplainer: Science concept visualizations
 * - DiagramSequencer: Syncs diagrams with TTS narration
 *
 * Usage:
 * ```typescript
 * import { AnimatedTutor } from '@/components/explainer';
 *
 * function LessonPage() {
 *   return (
 *     <AnimatedTutor
 *       topic="Fractions"
 *       subject="math"
 *       grade={8}
 *       studentName="Kai"
 *       onComplete={(lesson) => console.log(lesson)}
 *     />
 *   );
 * }
 * ```
 */

export { default as AnimatedTutor } from './AnimatedTutor';
export { default as AnimatedDiagram } from './AnimatedDiagram';
export { default as MathExplainer } from './MathExplainer';
export { default as ScienceExplainer } from './ScienceExplainer';
export { default as DiagramSequencer, useDiagramSequencer } from './DiagramSequencer';

export type { AnimationStep, AnimatedLesson, TutorExplanation } from '@/lib/gemma4';
export type { SequencerStep } from './DiagramSequencer';
