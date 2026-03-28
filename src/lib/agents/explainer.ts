/**
 * Explainer Agent - Handles visual explanations, diagrams, and animations
 * Coordinates with TTS for synchronized visual/narration delivery
 */

import { AgentResponse, VisualAction, VisualActionType, AGENT_CONFIGS, ExplainerAction } from './types';
import type { LessonSection } from '@/types';

// Predefined visual templates for common concepts
const VISUAL_TEMPLATES: Record<string, { type: VisualActionType; description: string }> = {
  'number-line': { type: 'draw_diagram', description: 'Interactive number line visualization' },
  'diagram': { type: 'draw_diagram', description: 'Step-by-step diagram' },
  'chart': { type: 'show_animation', description: 'Animated chart or graph' },
  'animation': { type: 'show_animation', description: 'Concept animation' },
  'interactive-html': { type: 'present_simulation', description: 'Interactive simulation' },
  'real-world': { type: 'present_slide', description: 'Real-world example' },
};

// Animation presets for different content types
const ANIMATION_PRESETS = {
  fadeIn: { duration: 500, easing: 'ease-in' },
  slideIn: { duration: 300, easing: 'ease-out' },
  zoom: { duration: 400, easing: 'ease-in-out' },
  highlight: { duration: 200, easing: 'linear' },
};

/**
 * Explainer Agent - Manages visual presentations synchronized with narration
 */
export class ExplainerAgent {
  private name: string;
  private currentVisual: VisualAction | null = null;
  private animationQueue: VisualAction[] = [];

  constructor() {
    const config = AGENT_CONFIGS.explainer;
    this.name = config.name;
  }

  /**
   * Generate visual action for a section
   */
  generateVisualForSection(section: LessonSection): AgentResponse {
    const visualType = section.visualType || 'diagram';
    const template = VISUAL_TEMPLATES[visualType] || VISUAL_TEMPLATES.diagram;

    const visual: VisualAction = {
      type: template.type,
      content: section.heading,
      duration: 5000,
      data: {
        keyPoints: section.keyPoints,
        workedExample: section.workedExample,
        realWorldExample: section.realWorldExample,
        activity: section.activity,
      },
    };

    this.currentVisual = visual;

    return {
      agentId: 'explainer',
      action: {
        type: 'SHOW_DIAGRAM',
        content: section.heading,
        data: visual.data,
      },
      visual,
    };
  }

  /**
   * Show a step-by-step diagram animation
   */
  showDiagram(title: string, steps: string[], duration: number = 3000): AgentResponse {
    const stepAnimations = steps.map((step, index) => ({
      type: 'draw_diagram' as const,
      content: step,
      duration: duration / steps.length,
      data: { stepIndex: index, totalSteps: steps.length },
    }));

    this.animationQueue = stepAnimations;

    return {
      agentId: 'explainer',
      action: {
        type: 'SHOW_DIAGRAM',
        content: title,
        data: { steps, animated: true },
      },
      visual: stepAnimations[0],
    };
  }

  /**
   * Present an interactive simulation
   */
  presentSimulation(simulationType: string, params: Record<string, unknown>): AgentResponse {
    const validTypes = ['water-cycle', 'circuit', 'fraction', 'force', 'number-line'] as const;
    const type = validTypes.includes(simulationType as typeof validTypes[number])
      ? simulationType
      : 'interactive-html';

    const visual: VisualAction = {
      type: 'present_simulation',
      content: simulationType,
      duration: 0, // Interactive, no auto-duration
      data: params,
    };

    this.currentVisual = visual;

    return {
      agentId: 'explainer',
      action: {
        type: 'PRESENT_SIMULATION',
        simulationType: simulationType,
        params,
      },
      visual,
    };
  }

  /**
   * Highlight a specific element in the current visual
   */
  highlight(element: string, duration: number = 2000): AgentResponse {
    const visual: VisualAction = {
      type: 'highlight',
      content: element,
      duration,
      data: { highlightType: 'pulse' },
    };

    return {
      agentId: 'explainer',
      action: { type: 'SHOW_DIAGRAM', content: element },
      visual,
    };
  }

  /**
   * Get animation sequence for concept
   */
  getAnimationSequence(conceptType: string, conceptData: Record<string, unknown>): VisualAction[] {
    switch (conceptType) {
      case 'water-cycle':
        return this.waterCycleSequence(conceptData);
      case 'number-line':
        return this.numberLineSequence(conceptData);
      case 'fraction':
        return this.fractionSequence(conceptData);
      default:
        return this.defaultSequence(conceptData);
    }
  }

  /**
   * Water cycle animation sequence
   */
  private waterCycleSequence(data: Record<string, unknown>): VisualAction[] {
    return [
      { type: 'draw_diagram', content: 'Evaporation', duration: 2000, data: { stage: 'evaporation', ...data } },
      { type: 'draw_diagram', content: 'Condensation', duration: 2000, data: { stage: 'condensation', ...data } },
      { type: 'draw_diagram', content: 'Precipitation', duration: 2000, data: { stage: 'precipitation', ...data } },
      { type: 'draw_diagram', content: 'Collection', duration: 2000, data: { stage: 'collection', ...data } },
    ];
  }

  /**
   * Number line animation sequence
   */
  private numberLineSequence(data: Record<string, unknown>): VisualAction[] {
    const startValue = (data.startValue as number) ?? 0;
    const moveValue = (data.moveValue as number) ?? 3;

    return [
      { type: 'show_animation', content: `Start at ${startValue}`, duration: 1500, data: { position: startValue } },
      { type: 'show_animation', content: `Move ${moveValue > 0 ? 'right' : 'left'} ${Math.abs(moveValue)}`, duration: 2000, data: { move: moveValue } },
      { type: 'show_animation', content: `Land at ${startValue + moveValue}`, duration: 1500, data: { position: startValue + moveValue } },
    ];
  }

  /**
   * Fraction visualization sequence
   */
  private fractionSequence(data: Record<string, unknown>): VisualAction[] {
    return [
      { type: 'draw_diagram', content: 'Whole', duration: 1500, data: { fraction: '1/1' } },
      { type: 'draw_diagram', content: 'Divide', duration: 1500, data: { action: 'divide' } },
      { type: 'show_animation', content: 'Parts', duration: 2000, data: { ...data } },
    ];
  }

  /**
   * Default animation sequence
   */
  private defaultSequence(data: Record<string, unknown>): VisualAction[] {
    const keyPoints = (data.keyPoints as string[]) || [];

    return keyPoints.slice(0, 4).map((point, index) => ({
      type: 'present_slide' as const,
      content: point,
      duration: 2000,
      data: { slideIndex: index, ...data },
    }));
  }

  /**
   * Clear current visual
   */
  clear(): void {
    this.currentVisual = null;
    this.animationQueue = [];
  }

  /**
   * Check if there are pending animations
   */
  hasPendingAnimations(): boolean {
    return this.animationQueue.length > 0;
  }

  /**
   * Get next animation in queue
   */
  getNextAnimation(): VisualAction | null {
    return this.animationQueue.shift() || null;
  }
}

// Singleton instance
let explainerInstance: ExplainerAgent | null = null;

export function getExplainer(): ExplainerAgent {
  if (!explainerInstance) {
    explainerInstance = new ExplainerAgent();
  }
  return explainerInstance;
}

export function resetExplainer(): void {
  explainerInstance = null;
}