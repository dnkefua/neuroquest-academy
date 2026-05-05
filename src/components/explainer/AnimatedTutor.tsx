'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Volume2, Sparkles, RefreshCw } from 'lucide-react';
import type { AnimationStep, AnimatedLesson } from '@/lib/gemma4';
import { generateLesson, generateTutorExplanation } from '@/lib/gemma4';
import styles from './explainer.module.css';

interface AnimatedTutorProps {
  topic: string;
  subject: 'math' | 'science' | 'english' | 'arabic';
  grade: number;
  studentName: string;
  language?: 'EN' | 'AR';
  difficulty?: 'easy' | 'medium' | 'hard';
  emotion?: 'happy' | 'neutral' | 'frustrated' | 'anxious';
  onComplete?: (lesson: AnimatedLesson) => void;
  className?: string;
}

// Visual components for different content types
function FractionVisual({ data }: { data: { numerator: number; denominator: number; highlight?: string } }) {
  const numerator = data.numerator ?? 1;
  const denominator = data.denominator ?? 2;
  const highlight = data.highlight ?? 'none';

  return (
    <div className={styles.fractionVisual}>
      <motion.div 
        className={`${styles.fractionNumber} ${highlight === 'numerator' ? styles.highlighted : ''}`}
        animate={highlight === 'numerator' ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5, repeat: 3 }}
      >
        {numerator}
      </motion.div>
      <div className={styles.fractionLine} />
      <motion.div 
        className={`${styles.fractionNumber} ${highlight === 'denominator' ? styles.highlighted : ''}`}
        animate={highlight === 'denominator' ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5, repeat: 3 }}
      >
        {denominator}
      </motion.div>
      {denominator > 0 && (
        <div className={styles.fractionParts}>
          {Array.from({ length: denominator }).map((_, i) => (
            <motion.div
              key={i}
              className={`${styles.fractionPart} ${i < numerator ? styles.filled : ''}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EquationVisual({ data }: { data: { equation: string; highlight?: string; steps?: string[] } }) {
  return (
    <div className={styles.equationVisual}>
      <motion.div 
        className={styles.mainEquation}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={data.equation}
      >
        {data.equation}
      </motion.div>
      {data.steps && (
        <div className={styles.equationSteps}>
          {data.steps.map((step, i) => (
            <motion.div
              key={i}
              className={styles.equationStep}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.3 }}
            >
              {step}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function DiagramVisual({ data }: { data: { elements: string[]; highlight?: string } }) {
  return (
    <div className={styles.diagramVisual}>
      {data.elements.map((element, i) => {
        const isHighlighted = data.highlight === element;
        return (
          <motion.div
            key={element}
            className={`${styles.diagramElement} ${isHighlighted ? styles.highlighted : ''}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: isHighlighted ? 1.1 : 1 }}
            transition={{ delay: i * 0.2 }}
          >
            {element === 'sun' && '☀️'}
            {element === 'water' && '🌊'}
            {element === 'clouds' && '☁️'}
            {element === 'raindrops' && '🌧️'}
            {element === 'arrows-up' && '↑↑↑'}
            {element === 'vapor' && '💨'}
            {element === 'cycle' && '🔄'}
            {element === 'ocean' && '🌊'}
            {element === 'rivers' && '🏞️'}
            {!['sun', 'water', 'clouds', 'raindrops', 'arrows-up', 'vapor', 'cycle', 'ocean', 'rivers'].includes(element) && element}
          </motion.div>
        );
      })}
    </div>
  );
}

function TextVisual({ data }: { data: { message: string } }) {
  return (
    <motion.div 
      className={styles.textVisual}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      {data.message}
    </motion.div>
  );
}

function ImageVisual({ data }: { data: { emoji: string } }) {
  return (
    <motion.div 
      className={styles.imageVisual}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      <span style={{ fontSize: '4rem' }}>{data.emoji}</span>
    </motion.div>
  );
}

export default function AnimatedTutor({
  topic,
  subject,
  grade,
  studentName,
  language = 'EN',
  difficulty = 'medium',
  emotion = 'neutral',
  onComplete,
  className = '',
}: AnimatedTutorProps) {
  const [lesson, setLesson] = useState<AnimatedLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNarration, setShowNarration] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stepRef = useRef<NodeJS.Timeout | null>(null);

  // Generate lesson on mount
  useEffect(() => {
    async function loadLesson() {
      setLoading(true);
      setError(null);
      try {
        const generatedLesson = await generateLesson({
          subject,
          grade,
          topic,
          language,
          studentName,
          difficulty,
          emotion,
          studentClass: subject as 'math' | 'science' | 'english' | 'arabic',
        });
        setLesson(generatedLesson);
      } catch (err) {
        console.error('Failed to generate lesson:', err);
        setError('Failed to generate lesson content. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadLesson();
  }, [topic, subject, grade, studentName, language, difficulty, emotion]);

  // Auto-play logic
  useEffect(() => {
    if (!lesson || !isPlaying) {
      if (stepRef.current) clearTimeout(stepRef.current);
      return;
    }

    const step = lesson.steps[currentStep];
    if (!step) {
      setIsPlaying(false);
      onComplete?.(lesson);
      return;
    }

    stepRef.current = setTimeout(() => {
      if (currentStep < lesson.steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsPlaying(false);
        onComplete?.(lesson);
      }
    }, step.duration);

    return () => {
      if (stepRef.current) clearTimeout(stepRef.current);
    };
  }, [lesson, isPlaying, currentStep, onComplete]);

  const handlePlay = () => setIsPlaying(!isPlaying);
  
  const handleSkip = () => {
    if (!lesson) return;
    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete?.(lesson);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setCurrentStep(0);
    // Force re-render to trigger useEffect
    setLesson(null);
  };

  if (loading) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.loadingState}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles size={48} className={styles.loadingIcon} />
          </motion.div>
          <p className={styles.loadingText}>Creating your learning adventure...</p>
          <p className={styles.loadingSubtext}>Gemma4 is generating animated explainers</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.errorState}>
          <p className={styles.errorText}>{error}</p>
          <button className={styles.retryButton} onClick={handleRetry}>
            <RefreshCw size={18} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) return null;

  const currentStepData = lesson.steps[currentStep];
  const progress = ((currentStep + 1) / lesson.steps.length) * 100;

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>{lesson.title}</h2>
        <span className={styles.stepCounter}>Step {currentStep + 1} of {lesson.steps.length}</span>
      </div>

      {/* Visual Content Area */}
      <div className={styles.visualArea}>
        <AnimatePresence mode="wait">
          {currentStepData?.visualContent && (
            <motion.div
              key={currentStepData.id}
              className={styles.visualContent}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
            >
              {currentStepData.visualContent.type === 'fraction' && (
                <FractionVisual data={currentStepData.visualContent.data as { numerator: number; denominator: number; highlight?: string }} />
              )}
              {currentStepData.visualContent.type === 'equation' && (
                <EquationVisual data={currentStepData.visualContent.data as { equation: string; highlight?: string; steps?: string[] }} />
              )}
              {currentStepData.visualContent.type === 'diagram' && (
                <DiagramVisual data={currentStepData.visualContent.data as { elements: string[]; highlight?: string }} />
              )}
              {currentStepData.visualContent.type === 'text' && (
                <TextVisual data={currentStepData.visualContent.data as { message: string }} />
              )}
              {currentStepData.visualContent.type === 'image' && (
                <ImageVisual data={currentStepData.visualContent.data as { emoji: string }} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Narration */}
      {showNarration && currentStepData && (
        <motion.div 
          className={styles.narration}
          key={currentStepData.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Volume2 size={18} className={styles.narrationIcon} />
          <span>{currentStepData.narration}</span>
        </motion.div>
      )}

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <motion.div 
          className={styles.progressFill}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Step Indicators */}
      <div className={styles.stepIndicators}>
        {lesson.steps.map((step, i) => (
          <button
            key={step.id}
            className={`${styles.stepDot} ${i === currentStep ? styles.active : ''} ${i < currentStep ? styles.completed : ''}`}
            onClick={() => setCurrentStep(i)}
            title={step.narration.slice(0, 50)}
          />
        ))}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button 
          className={styles.controlButton}
          onClick={handleRestart}
          title="Restart"
        >
          <RefreshCw size={20} />
        </button>
        
        <button 
          className={`${styles.controlButton} ${styles.playButton}`}
          onClick={handlePlay}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        
        <button 
          className={styles.controlButton}
          onClick={handleSkip}
          title="Skip"
        >
          <SkipForward size={20} />
        </button>
      </div>

      {/* Brain Break Tip */}
      <AnimatePresence>
        {currentStep === lesson.steps.length - 1 && (
          <motion.div 
            className={styles.brainBreakTip}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className={styles.tipLabel}>🧠 Brain Break:</span>
            {lesson.brainBreakTip}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
