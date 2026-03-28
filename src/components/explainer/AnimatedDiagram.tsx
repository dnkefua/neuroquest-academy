'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AnimationStep {
  id: string;
  content: string;
  duration: number; // ms
  delay?: number; // ms before this step starts
  highlightElements?: string[];
  narration?: string; // Text to speak during this step
}

interface AnimatedDiagramProps {
  steps: AnimationStep[];
  currentStep: number;
  onStepComplete?: (stepId: string) => void;
  autoPlay?: boolean;
  showProgress?: boolean;
  className?: string;
  children?: React.ReactNode; // The actual diagram/visual content
}

// Animation variants for different elements
export const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideInFromLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
  },
  slideInFromRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  },
  scaleIn: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
  },
  draw: {
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    exit: { pathLength: 0 },
  },
};

// Progress bar component
function ProgressBar({ progress, total }: { progress: number; total: number }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 4,
      background: 'rgba(255, 255, 255, 0.1)',
    }}>
      <motion.div
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, #22C55E, #10B981)',
        }}
        initial={{ width: 0 }}
        animate={{ width: `${(progress / total) * 100}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}

// Step indicator dots
function StepIndicators({ current, total }: { current: number; total: number }) {
  return (
    <div style={{
      display: 'flex',
      gap: 8,
      justifyContent: 'center',
      padding: '8px 0',
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: i <= current ? '#22C55E' : 'rgba(255, 255, 255, 0.2)',
          }}
          animate={{
            scale: i === current ? 1.3 : 1,
            opacity: i <= current ? 1 : 0.5,
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}

// Narration text overlay
function NarrationOverlay({ text, visible }: { text: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '12px 24px',
            borderRadius: 12,
            maxWidth: '80%',
            textAlign: 'center',
          }}
        >
          <p style={{
            color: 'white',
            fontSize: 16,
            lineHeight: 1.5,
            margin: 0,
          }}>
            {text}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AnimatedDiagram({
  steps,
  currentStep,
  onStepComplete,
  autoPlay = false,
  showProgress = true,
  className,
  children,
}: AnimatedDiagramProps) {
  const [activeStep, setActiveStep] = useState(currentStep);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with external currentStep prop
  useEffect(() => {
    setActiveStep(currentStep);
  }, [currentStep]);

  // Auto-play timer
  useEffect(() => {
    if (isPlaying && activeStep < steps.length) {
      const step = steps[activeStep];
      const duration = step?.duration || 2000;

      timerRef.current = setTimeout(() => {
        if (activeStep < steps.length - 1) {
          setActiveStep((prev) => prev + 1);
          onStepComplete?.(step.id);
        } else {
          setIsPlaying(false);
          onStepComplete?.(step.id);
        }
      }, duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, activeStep, steps, onStepComplete]);

  // Play/pause control
  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Go to specific step
  const goToStep = useCallback((step: number) => {
    setActiveStep(step);
    if (autoPlay) {
      setIsPlaying(true);
    }
  }, [autoPlay]);

  // Current step data
  const currentStepData = steps[activeStep];

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
        borderRadius: 12,
      }}
    >
      {/* Main content area */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100% - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Diagram content passed as children */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {/* Step content overlay */}
        {currentStepData && (
          <motion.div
            key={`content-${activeStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              right: 20,
            }}
          >
            <h3 style={{
              color: '#A5B4FC',
              fontSize: 18,
              fontWeight: 'bold',
              margin: 0,
            }}>
              {currentStepData.content}
            </h3>
          </motion.div>
        )}

        {/* Narration overlay */}
        {currentStepData?.narration && (
          <NarrationOverlay text={currentStepData.narration} visible={true} />
        )}
      </div>

      {/* Controls area */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '12px 16px',
        background: 'rgba(0, 0, 0, 0.3)',
      }}>
        {/* Step indicators */}
        <StepIndicators current={activeStep} total={steps.length} />

        {/* Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
        }}>
          {/* Previous button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => goToStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: 8,
              color: 'white',
              cursor: activeStep === 0 ? 'not-allowed' : 'pointer',
              opacity: activeStep === 0 ? 0.5 : 1,
            }}
          >
            ← Previous
          </motion.button>

          {/* Play/Pause button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            style={{
              padding: '8px 24px',
              background: isPlaying ? '#EF4444' : '#22C55E',
              border: 'none',
              borderRadius: 8,
              color: 'white',
              cursor: 'pointer',
            }}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </motion.button>

          {/* Next button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => goToStep(Math.min(steps.length - 1, activeStep + 1))}
            disabled={activeStep === steps.length - 1}
            style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: 8,
              color: 'white',
              cursor: activeStep === steps.length - 1 ? 'not-allowed' : 'pointer',
              opacity: activeStep === steps.length - 1 ? 0.5 : 1,
            }}
          >
            Next →
          </motion.button>
        </div>
      </div>

      {/* Progress bar */}
      {showProgress && <ProgressBar progress={activeStep + 1} total={steps.length} />}
    </div>
  );
}