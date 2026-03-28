'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MathExplainerProps {
  concept: 'number-line' | 'fraction' | 'addition' | 'subtraction' | 'multiplication' | 'division';
  values: {
    startValue?: number;
    moveValue?: number;
    numerator?: number;
    denominator?: number;
    operands?: [number, number];
  };
  autoPlay?: boolean;
  onStepChange?: (step: number, narration: string) => void;
  onComplete?: () => void;
}

// Number line visualization with step-by-step animation
function NumberLineAnimation({ startValue, moveValue, currentStep }: {
  startValue: number;
  moveValue: number;
  currentStep: number;
}) {
  const markers = [];
  const range = 10;
  const center = startValue;
  const endValue = startValue + moveValue;

  for (let i = center - range; i <= center + range; i++) {
    markers.push(i);
  }

  const position = currentStep === 0 ? startValue :
    currentStep === 1 ? startValue :
    currentStep === 2 ? endValue : endValue;

  return (
    <div style={{ width: '100%', height: '200px', position: 'relative' }}>
      {/* Number line */}
      <svg viewBox="0 0 800 200" style={{ width: '100%', height: '100%' }}>
        {/* Main line */}
        <motion.line
          x1="50"
          y1="100"
          x2="750"
          y2="100"
          stroke="#6366F1"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Arrows */}
        <polygon points="750,100 740,95 740,105" fill="#6366F1" />
        <polygon points="50,100 60,95 60,105" fill="#6366F1" />

        {/* Markers */}
        {markers.map((num, i) => {
          const x = 50 + (i / (markers.length - 1)) * 700;
          const isStart = num === startValue;
          const isEnd = num === endValue;
          const isCurrent = num === position;

          return (
            <g key={num}>
              {/* Tick mark */}
              <motion.line
                x1={x}
                y1={num % 5 === 0 ? 90 : 95}
                x2={x}
                y2={num % 5 === 0 ? 110 : 105}
                stroke={num % 5 === 0 ? '#A5B4FC' : '#6366F1'}
                strokeWidth={num % 5 === 0 ? 2 : 1}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
              />

              {/* Label */}
              {num % 5 === 0 && (
                <text
                  x={x}
                  y={130}
                  textAnchor="middle"
                  fill="#A5B4FC"
                  fontSize="14"
                >
                  {num}
                </text>
              )}

              {/* Highlight for start/end positions */}
              {(isStart || isEnd) && currentStep >= (isStart ? 0 : 2) && (
                <motion.circle
                  cx={x}
                  cy={100}
                  r={20}
                  fill="none"
                  stroke={isStart ? '#22C55E' : '#F59E0B'}
                  strokeWidth={3}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </g>
          );
        })}

        {/* Current position indicator */}
        <AnimatePresence>
          {currentStep >= 0 && (
            <motion.g
              key={currentStep}
              initial={{ x: 0 }}
              animate={{
                x: ((position - (center - range)) / (range * 2)) * 700
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <circle cx={50} cy={100} r={15} fill="#22C55E" />
              <text x={50} y={105} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                {position}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* Direction arrow for movement */}
      {currentStep === 2 && moveValue !== 0 && (
        <motion.div
          initial={{ opacity: 0, x: moveValue > 0 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: moveValue > 0 ? '#22C55E' : '#EF4444',
            fontSize: '24px',
            fontWeight: 'bold',
          }}
        >
          {moveValue > 0 ? `→ +${moveValue}` : `← ${moveValue}`}
        </motion.div>
      )}
    </div>
  );
}

// Fraction visualization with animation
function FractionAnimation({ numerator, denominator, currentStep }: {
  numerator: number;
  denominator: number;
  currentStep: number;
}) {
  const blocksPerRow = Math.ceil(Math.sqrt(denominator));

  return (
    <div style={{ width: '100%', height: '300px', position: 'relative' }}>
      {/* Whole shape */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: currentStep >= 0 ? 1 : 0,
          scale: currentStep >= 0 ? 1 : 0.8
        }}
        style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 200,
          height: 200,
          borderRadius: 8,
          background: '#374151',
          border: '2px solid #6366F1',
          display: 'flex',
          flexWrap: 'wrap',
          overflow: 'hidden',
        }}
      >
        {/* Fraction blocks */}
        {Array.from({ length: denominator }).map((_, i) => {
          const row = Math.floor(i / blocksPerRow);
          const col = i % blocksPerRow;
          const isHighlighted = i < numerator;
          const blockSize = 200 / blocksPerRow;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: currentStep >= 1 ? 1 : 0,
                scale: currentStep >= 1 ? 1 : 0,
                background: currentStep >= 2 && isHighlighted ? '#22C55E' : '#64748B',
              }}
              transition={{
                delay: currentStep >= 1 ? i * 0.05 : 0,
                duration: 0.2,
              }}
              style={{
                width: blockSize,
                height: blockSize,
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {currentStep >= 3 && (
                <span style={{ color: 'white', fontSize: 12 }}>
                  {i + 1}
                </span>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Fraction display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: currentStep >= 2 ? 1 : 0, y: currentStep >= 2 ? 0 : 20 }}
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#22C55E' }}>
          <span>{numerator}</span>
          <span style={{ color: '#6366F1' }}>/{denominator}</span>
        </div>
        <div style={{ fontSize: '16px', color: '#A5B4FC' }}>
          {Math.round((numerator / denominator) * 100)}%
        </div>
      </motion.div>
    </div>
  );
}

// Addition/subtraction visualization
function OperationAnimation({ operands, operation, currentStep }: {
  operands: [number, number];
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division';
  currentStep: number;
}) {
  const [a, b] = operands;
  const result = operation === 'addition' ? a + b :
    operation === 'subtraction' ? a - b :
    operation === 'multiplication' ? a * b :
    operation === 'division' ? a / b : 0;

  const operationSymbol = operation === 'addition' ? '+' :
    operation === 'subtraction' ? '−' :
    operation === 'multiplication' ? '×' :
    operation === 'division' ? '÷' : '';

  return (
    <div style={{ width: '100%', height: '300px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* First operand */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: currentStep >= 0 ? 1 : 0, x: currentStep >= 0 ? 0 : -50 }}
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#A5B4FC',
            background: 'rgba(99, 102, 241, 0.2)',
            padding: '20px 30px',
            borderRadius: 12,
          }}
        >
          {a}
        </motion.div>

        {/* Operation symbol */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: currentStep >= 1 ? 1 : 0, scale: currentStep >= 1 ? 1 : 0 }}
          style={{
            fontSize: '48px',
            color: '#F59E0B',
          }}
        >
          {operationSymbol}
        </motion.div>

        {/* Second operand */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: currentStep >= 1 ? 1 : 0, x: currentStep >= 1 ? 0 : 50 }}
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#A5B4FC',
            background: 'rgba(99, 102, 241, 0.2)',
            padding: '20px 30px',
            borderRadius: 12,
          }}
        >
          {b}
        </motion.div>

        {/* Equals */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: currentStep >= 2 ? 1 : 0, scale: currentStep >= 2 ? 1 : 0 }}
          style={{
            fontSize: '48px',
            color: '#64748B',
          }}
        >
          =
        </motion.div>

        {/* Result */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: currentStep >= 3 ? 1 : 0, scale: currentStep >= 3 ? 1 : 0 }}
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: '#22C55E',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.2))',
            padding: '20px 40px',
            borderRadius: 12,
            border: '2px solid #22C55E',
          }}
        >
          {Number.isInteger(result) ? result : result.toFixed(2)}
        </motion.div>
      </div>
    </div>
  );
}

export default function MathExplainer({
  concept,
  values,
  autoPlay = true,
  onStepChange,
  onComplete,
}: MathExplainerProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Define steps for each concept
  const steps = useMemo(() => {
    switch (concept) {
      case 'number-line':
        return [
          { narration: `Let's start at ${values.startValue || 0}`, duration: 2000 },
          { narration: `Now we'll move ${Math.abs(values.moveValue || 0)} steps to the ${values.moveValue && values.moveValue > 0 ? 'right' : 'left'}`, duration: 2500 },
          { narration: `We land at ${(values.startValue || 0) + (values.moveValue || 0)}!`, duration: 2000 },
        ];
      case 'fraction':
        return [
          { narration: `Here we have ${values.denominator || 4} equal parts`, duration: 2000 },
          { narration: `Let's shade ${values.numerator || 1} of them`, duration: 2500 },
          { narration: `So ${values.numerator || 1} out of ${values.denominator || 4} is our fraction`, duration: 2000 },
        ];
      case 'addition':
      case 'subtraction':
      case 'multiplication':
      case 'division':
        const opSymbol = concept === 'addition' ? '+' :
          concept === 'subtraction' ? '−' :
          concept === 'multiplication' ? '×' : '÷';
        return [
          { narration: `First, we have ${values.operands?.[0] || 0}`, duration: 2000 },
          { narration: `Then we ${concept} ${values.operands?.[1] || 0}`, duration: 2000 },
          { narration: `Let's calculate the result`, duration: 2000 },
          { narration: `The answer is ${values.operands ? (concept === 'addition' ? values.operands[0] + values.operands[1] : concept === 'subtraction' ? values.operands[0] - values.operands[1] : concept === 'multiplication' ? values.operands[0] * values.operands[1] : values.operands[0] / values.operands[1]) : 0}`, duration: 2500 },
        ];
      default:
        return [];
    }
  }, [concept, values]);

  // Auto-advance through steps
  useEffect(() => {
    if (autoPlay && currentStep < steps.length) {
      const step = steps[currentStep];
      const timer = setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep((prev) => prev + 1);
          onStepChange?.(currentStep + 1, steps[currentStep + 1].narration);
        } else {
          onComplete?.();
        }
      }, step.duration);

      return () => clearTimeout(timer);
    }
  }, [autoPlay, currentStep, steps, onStepChange, onComplete]);

  // Call onStepChange when step changes
  useEffect(() => {
    if (currentStep < steps.length) {
      onStepChange?.(currentStep, steps[currentStep].narration);
    }
  }, [currentStep, steps, onStepChange]);

  // Render the appropriate visualization
  const renderVisualization = () => {
    switch (concept) {
      case 'number-line':
        return (
          <NumberLineAnimation
            startValue={values.startValue || 0}
            moveValue={values.moveValue || 0}
            currentStep={currentStep}
          />
        );
      case 'fraction':
        return (
          <FractionAnimation
            numerator={values.numerator || 1}
            denominator={values.denominator || 4}
            currentStep={currentStep}
          />
        );
      case 'addition':
      case 'subtraction':
      case 'multiplication':
      case 'division':
        return (
          <OperationAnimation
            operands={values.operands || [0, 0]}
            operation={concept}
            currentStep={currentStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      {renderVisualization()}

      {/* Step indicator */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 8,
      }}>
        {steps.map((_, i) => (
          <motion.div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: i <= currentStep ? '#22C55E' : 'rgba(255, 255, 255, 0.2)',
            }}
            animate={{ scale: i === currentStep ? 1.3 : 1 }}
          />
        ))}
      </div>
    </div>
  );
}