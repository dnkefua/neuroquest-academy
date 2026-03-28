'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

export interface SequencerStep {
  id: string;
  duration: number; // ms
  narration?: string;
  visualAction?: 'highlight' | 'animate' | 'transition' | 'pause';
  data?: Record<string, unknown>;
}

interface DiagramSequencerProps {
  steps: SequencerStep[];
  autoPlay?: boolean;
  onStepStart?: (step: SequencerStep, index: number) => void;
  onStepEnd?: (step: SequencerStep, index: number) => void;
  onSequenceComplete?: () => void;
  onNarration?: (text: string) => void | Promise<void>;
  children?: React.ReactNode;
}

/**
 * DiagramSequencer - Synchronizes diagram animations with TTS narration
 *
 * Usage:
 * ```tsx
 * const { speak } = useTTS();
 *
 * <DiagramSequencer
 *   steps={[
 *     { id: 'intro', narration: 'Let us explore fractions', duration: 2000 },
 *     { id: 'divide', narration: 'First, we divide the whole', duration: 2500, visualAction: 'animate' },
 *     { id: 'shade', narration: 'Then we shade 3 parts', duration: 2000, visualAction: 'highlight' },
 *   ]}
 *   onNarration={(text) => speak(text)}
 * >
 *   <FractionDiagram />
 * </DiagramSequencer>
 * ```
 */
export default function DiagramSequencer({
  steps,
  autoPlay = false,
  onStepStart,
  onStepEnd,
  onSequenceComplete,
  onNarration,
  children,
}: DiagramSequencerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const narrationPromiseRef = useRef<Promise<void> | null>(null);

  const currentStep = steps[currentStepIndex];

  // Process a single step
  const processStep = useCallback(async (step: SequencerStep, index: number) => {
    // Notify step start
    onStepStart?.(step, index);

    // Handle narration
    if (step.narration && onNarration) {
      try {
        narrationPromiseRef.current = Promise.resolve(onNarration(step.narration));
        await narrationPromiseRef.current;
      } catch (error) {
        console.error('Narration error:', error);
      }
    }

    // Wait for remaining duration (if narration finished early)
    if (isPlaying && !isPaused) {
      return new Promise<void>((resolve) => {
        timerRef.current = setTimeout(() => {
          onStepEnd?.(step, index);
          resolve();
        }, step.duration);
      });
    }
  }, [onStepStart, onStepEnd, onNarration, isPlaying, isPaused]);

  // Auto-advance through steps
  useEffect(() => {
    if (!isPlaying || isPaused || currentStepIndex >= steps.length) return;

    const runSequence = async () => {
      await processStep(currentStep, currentStepIndex);

      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
        onSequenceComplete?.();
      }
    };

    runSequence();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, isPaused, currentStepIndex, steps.length, currentStep, processStep, onSequenceComplete]);

  // Control functions
  const play = useCallback(() => {
    setIsPlaying(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(autoPlay);
    setIsPaused(false);
  }, [autoPlay]);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  }, [steps.length]);

  const nextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [currentStepIndex, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Render children (the actual diagram) */}
      {children}

      {/* Control overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
      }}>
        {/* Progress bar */}
        <div style={{
          height: 4,
          background: 'rgba(255,255,255,0.2)',
          borderRadius: 2,
          marginBottom: 8,
        }}>
          <div style={{
            width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
            height: '100%',
            background: '#22C55E',
            borderRadius: 2,
            transition: 'width 0.3s ease',
          }} />
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}>
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: 4,
              color: 'white',
              cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentStepIndex === 0 ? 0.5 : 1,
            }}
          >
            ← Previous
          </button>

          <button
            onClick={isPaused ? resume : isPlaying ? pause : play}
            style={{
              padding: '8px 24px',
              background: isPlaying ? (isPaused ? '#F59E0B' : '#EF4444') : '#22C55E',
              border: 'none',
              borderRadius: 4,
              color: 'white',
              cursor: 'pointer',
            }}
          >
            {!isPlaying ? '▶ Play' : isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>

          <button
            onClick={nextStep}
            disabled={currentStepIndex === steps.length - 1}
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: 4,
              color: 'white',
              cursor: currentStepIndex === steps.length - 1 ? 'not-allowed' : 'pointer',
              opacity: currentStepIndex === steps.length - 1 ? 0.5 : 1,
            }}
          >
            Next →
          </button>

          <button
            onClick={reset}
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: 4,
              color: 'white',
              cursor: 'pointer',
            }}
          >
            ↺ Reset
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for easy TTS integration
export function useDiagramSequencer(
  speak: (text: string) => void | Promise<void>
) {
  const createSequence = useCallback((
    steps: Array<{ narration: string; duration: number; action?: string }>
  ): SequencerStep[] => {
    return steps.map((step, i) => ({
      id: `step-${i}`,
      narration: step.narration,
      duration: step.duration,
      visualAction: step.action as SequencerStep['visualAction'],
    }));
  }, []);

  return { createSequence };
}