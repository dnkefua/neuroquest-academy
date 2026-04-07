'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCognitiveStore } from '@/store/cognitiveStore';

interface MicroSprintTimerProps {
  maxMinutes?: number;
  onComplete?: () => void;
  onBreakSuggestion?: () => void;
  children: React.ReactNode;
}

export default function MicroSprintTimer({ maxMinutes = 10, onComplete, onBreakSuggestion, children }: MicroSprintTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(maxMinutes * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);
  const [errors, setErrors] = useState(0);

  const { shouldSuggestBreak, profile } = useCognitiveStore();

  const totalSeconds = maxMinutes * 60;
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const progress = ((totalSeconds - secondsRemaining) / totalSeconds) * 100;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const isLow = secondsRemaining <= 60;
  const isCritical = secondsRemaining <= 15;

  useEffect(() => {
    if (!isRunning || isPaused) return;

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          onComplete?.();
          return 0;
        }

        if (prev === 120) setShowWarning(true);
        if (prev === 60) {
          setShowWarning(true);
          const shouldBreak = shouldSuggestBreak(maxMinutes, errors);
          if (shouldBreak) setShowBreakPrompt(true);
        }
        if (prev === 10) setShowWarning(true);

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, maxMinutes, errors, shouldSuggestBreak, onComplete]);

  useEffect(() => {
    if (showWarning && secondsRemaining > 0) {
      const timeout = setTimeout(() => setShowWarning(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [showWarning, secondsRemaining]);

  const handlePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const handleResume = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const handleReset = useCallback(() => {
    setSecondsRemaining(maxMinutes * 60);
    setIsRunning(true);
    setIsPaused(false);
    setShowWarning(false);
    setShowBreakPrompt(false);
    setErrors(0);
  }, [maxMinutes]);

  const handleTakeBreak = useCallback(() => {
    setIsPaused(true);
    onBreakSuggestion?.();
  }, [onBreakSuggestion]);

  const handleContinue = useCallback(() => {
    setShowBreakPrompt(false);
    handleResume();
  }, [handleResume]);

  const timerColor = isCritical ? '#EF4444' : isLow ? '#F59E0B' : '#8B5CF6';

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#1F2937"
                strokeWidth="6"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={timerColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-bold text-white" style={{ color: timerColor }}>
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Micro-Sprint</p>
            <p className="text-xs text-gray-400">
              {isPaused ? 'Paused' : isRunning ? 'In progress...' : 'Complete!'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePause}
            className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 transition-colors"
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 transition-colors"
          >
            ↺ Reset
          </button>
        </div>
      </div>

      <div className="w-full h-1.5 bg-gray-800 rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: timerColor }}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium ${
              isCritical
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
            }`}
          >
            {isCritical
              ? '⚡ 10 seconds left! Finish strong!'
              : secondsRemaining <= 60
              ? '⏱️ 1 minute remaining! Wrap up your sprint!'
              : '⏱️ 2 minutes left!'}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBreakPrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30"
          >
            <p className="text-sm text-purple-300 mb-3">
              🧠 Your cognitive profile suggests a break. Your attention span is around{' '}
              {profile.attentionSpanMinutes} minutes.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleTakeBreak}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-500 transition-colors"
              >
                Take Brain Break
              </button>
              <button
                onClick={handleContinue}
                className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-600 transition-colors"
              >
                Continue Sprint
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </div>
  );
}
