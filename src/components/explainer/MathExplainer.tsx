'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

export type MathExplainerConcept =
  | 'number-line'
  | 'fraction'
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'ratio'
  | 'equation'
  | 'pythagorean'
  | 'scientific';

type MathExplainerValues = {
  startValue?: number;
  moveValue?: number;
  moveValue2?: number;
  numerator?: number;
  denominator?: number;
  operands?: [number, number];
  ratioParts?: [number, number];
  total?: number;
  sideA?: number;
  sideB?: number;
  sideC?: number;
  coefficient?: number;
  constant?: number;
  result?: number;
  solution?: number;
  displayValue?: string;
  exponent?: number;
};

interface MathExplainerProps {
  concept: MathExplainerConcept;
  values: MathExplainerValues;
  autoPlay?: boolean;
  onStepChange?: (step: number, narration: string) => void;
  onComplete?: () => void;
}

type Step = { narration: string; duration: number };

const scenePadding: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: 0,
  padding: '14px 14px 28px',
};

const glassCard: CSSProperties = {
  background: 'linear-gradient(145deg, rgba(15,23,42,0.84), rgba(15,23,42,0.42))',
  border: '1px solid rgba(148,163,184,0.2)',
  boxShadow: '0 18px 45px rgba(0,0,0,0.24)',
};

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '0';
  if (Number.isInteger(value)) return `${value}`;
  return value.toFixed(2).replace(/\.?0+$/, '');
}

function operationResult(operation: 'addition' | 'subtraction' | 'multiplication' | 'division', a: number, b: number) {
  if (operation === 'addition') return a + b;
  if (operation === 'subtraction') return a - b;
  if (operation === 'multiplication') return a * b;
  return b === 0 ? 0 : a / b;
}

function NumberLineAnimation({
  startValue,
  moveValue,
  moveValue2,
  currentStep,
}: {
  startValue: number;
  moveValue: number;
  moveValue2?: number;
  currentStep: number;
}) {
  const firstEnd = startValue + moveValue;
  const finalValue = firstEnd + (moveValue2 ?? 0);

  // Build step-by-step positions for hopping
  const steps = useMemo(() => {
    if (moveValue === 0) return [startValue];
    const dir = moveValue > 0 ? 1 : -1;
    const count = Math.abs(moveValue);
    return Array.from({ length: count + 1 }, (_, i) => startValue + dir * i);
  }, [startValue, moveValue]);

  // Bird hopping state
  const [hopIndex, setHopIndex] = useState(0);
  const [isAirborne, setIsAirborne] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setHopIndex(0);
    setIsAirborne(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (currentStep >= 1 && steps.length > 1) {
      let index = 0;
      intervalRef.current = setInterval(() => {
        index++;
        setIsAirborne(true);
        setTimeout(() => setIsAirborne(false), 180);
        if (index < steps.length) {
          setHopIndex(index);
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 320);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [currentStep, startValue, moveValue]);

  const rawMin = Math.min(-10, startValue, firstEnd, finalValue, 0);
  const rawMax = Math.max(10, startValue, firstEnd, finalValue, 0);
  const tickStep = Math.max(1, Math.ceil((rawMax - rawMin) / 10));
  const min = Math.floor(rawMin / tickStep) * tickStep;
  const max = Math.ceil(rawMax / tickStep) * tickStep;
  const toX = (value: number) => 62 + ((value - min) / (max - min || 1)) * 516;
  const birdValue = (currentStep >= 1 && steps[hopIndex] !== undefined) ? steps[hopIndex] : startValue;
  const birdX = toX(birdValue);
  const moveColor = moveValue >= 0 ? '#34d399' : '#fb7185';

  const ticks = Array.from({ length: Math.floor((max - min) / tickStep) + 1 }, (_, i) => min + tickStep * i);

  const birdY = isAirborne ? 108 : 130;

  return (
    <div style={scenePadding}>
      <svg viewBox="0 0 640 250" style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <linearGradient id="lineGlow" x1="0" x2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="55%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.line
          x1="62" y1="136" x2="578" y2="136"
          stroke="url(#lineGlow)" strokeWidth="5" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <polygon points="578,136 564,128 564,144" fill="#facc15" />
        <polygon points="62,136 76,128 76,144" fill="#38bdf8" />

        {ticks.map((tick, index) => {
          const value = Math.round(tick);
          const x = toX(tick);
          return (
            <g key={value + '-' + index}>
              <motion.line
                x1={x} y1={value === 0 ? 112 : 120}
                x2={x} y2={value === 0 ? 160 : 152}
                stroke={value === 0 ? '#facc15' : 'rgba(226,232,240,0.62)'}
                strokeWidth={value === 0 ? 3 : 1.5}
                initial={{ opacity: 0, y1: 136, y2: 136 }}
                animate={{ opacity: 1, y1: value === 0 ? 112 : 120, y2: value === 0 ? 160 : 152 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
              />
              <text x={x} y="181" textAnchor="middle" fill={value === 0 ? '#facc15' : '#cbd5e1'} fontSize="15" fontWeight={value === 0 ? 800 : 600}>
                {value}
              </text>
            </g>
          );
        })}

        {/* Move arrow */}
        <motion.path
          d={'M ' + toX(startValue) + ' 102 C ' + ((toX(startValue) + toX(firstEnd)) / 2) + ' 42, ' + ((toX(startValue) + toX(firstEnd)) / 2) + ' 42, ' + toX(firstEnd) + ' 102'}
          fill="none" stroke={moveColor} strokeWidth="6" strokeLinecap="round"
          strokeDasharray="9 8"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: currentStep >= 1 ? 1 : 0, pathLength: currentStep >= 1 ? 1 : 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />

        {moveValue2 !== undefined && (
          <motion.path
            d={'M ' + toX(firstEnd) + ' 82 C ' + ((toX(firstEnd) + toX(finalValue)) / 2) + ' 20, ' + ((toX(firstEnd) + toX(finalValue)) / 2) + ' 20, ' + toX(finalValue) + ' 82'}
            fill="none" stroke={moveValue2 >= 0 ? '#a3e635' : '#f97316'} strokeWidth="5" strokeLinecap="round"
            strokeDasharray="7 8"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: currentStep >= 3 ? 1 : 0, pathLength: currentStep >= 3 ? 1 : 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        )}

        {/* Bird group */}
        <motion.g
          animate={{ x: birdX, y: birdY }}
          transition={{ type: 'spring', stiffness: birdY < 125 ? 180 : 300, damping: 12, mass: 0.6 }}
        >
          {/* Body */}
          <ellipse cx={0} cy={0} rx={14} ry={9} fill="#FFD700" stroke="#E6B800" strokeWidth={1} />
          {/* Head */}
          <circle cx={11} cy={-5} r={8} fill="#FFD700" stroke="#E6B800" strokeWidth={1} />
          {/* Wing */}
          <motion.path
            d={isAirborne ? 'M -4,-6 Q 4,-18 12,-8 Q 6,0 -4,-6 Z' : 'M -4,-2 Q 4,-14 12,-4 Q 6,2 -4,-2 Z'}
            fill="#E6B800"
            transition={{ duration: 0.15 }}
          />
          {/* Eye */}
          <circle cx={14} cy={-6} r={2.5} fill="#1a1a2e" />
          <circle cx={14.8} cy={-6.8} r={1} fill="white" />
          {/* Beak */}
          <path d="M 18,-4 L 24,-2.5 L 18,-1 Z" fill="#FF8C00" />
          {/* Tail */}
          <path d="M -12,0 L -20,-8 L -18,4 Z" fill="#E6B800" />
          {/* Feet */}
          <motion.g animate={{ y: isAirborne ? 4 : 0 }}>
            <line x1={-3} y1={9} x2={-6} y2={15} stroke="#FF8C00" strokeWidth={1.5} />
            <line x1={3} y1={9} x2={6} y2={15} stroke="#FF8C00" strokeWidth={1.5} />
          </motion.g>
        </motion.g>

        {/* Number label above bird */}
        <motion.text
          x={birdX} y={birdY - 24}
          textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900"
          animate={{ x: birdX }}
          transition={{ duration: 0.2 }}
        >
          {birdValue}
        </motion.text>

        {/* Result banner */}
        <motion.g
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: currentStep >= 2 ? 1 : 0, scale: currentStep >= 2 ? 1 : 0.85 }}
        >
          <circle cx={toX(finalValue)} cy={136} r="25" fill="none" stroke="#facc15" strokeWidth="3" />
          <text x={toX(finalValue)} y="220" textAnchor="middle" fill="#facc15" fontSize="22" fontWeight="900">
            {formatNumber(startValue)} {moveValue >= 0 ? '+' : '-'} {formatNumber(Math.abs(moveValue))} = {formatNumber(firstEnd)}
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

function FractionAnimation({
  numerator,
  denominator,
  currentStep,
}: {
  numerator: number;
  denominator: number;
  currentStep: number;
}) {
  const safeDenominator = Math.max(2, Math.min(denominator, 12));
  const safeNumerator = Math.max(0, Math.min(numerator, safeDenominator));
  const percent = Math.round((safeNumerator / safeDenominator) * 100);

  return (
    <div style={{ ...scenePadding, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(96px,0.42fr)', gap: 12, alignItems: 'center' }}>
      <div style={{ ...glassCard, height: '100%', borderRadius: 18, padding: 12, display: 'grid', gridTemplateColumns: `repeat(${safeDenominator}, minmax(0, 1fr))`, gap: 5, transform: 'perspective(700px) rotateX(10deg)' }}>
        {Array.from({ length: safeDenominator }).map((_, index) => {
          const active = index < safeNumerator;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 22, rotateX: 40 }}
              animate={{
                opacity: currentStep >= 1 ? 1 : 0.35,
                y: currentStep >= 1 ? 0 : 22,
                rotateX: currentStep >= 1 ? 0 : 40,
                background: currentStep >= 2 && active
                  ? 'linear-gradient(180deg, #34d399, #0f766e)'
                  : 'linear-gradient(180deg, #475569, #1e293b)',
              }}
              transition={{ delay: index * 0.04, duration: 0.28 }}
              style={{
                minHeight: 0,
                borderRadius: 9,
                border: '1px solid rgba(255,255,255,0.16)',
                boxShadow: active && currentStep >= 2 ? '0 0 18px rgba(52,211,153,0.36)' : 'inset 0 1px 0 rgba(255,255,255,0.16)',
              }}
            />
          );
        })}
      </div>

      <motion.div
        style={{ ...glassCard, borderRadius: 18, padding: 12, textAlign: 'center' }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: currentStep >= 2 ? 1 : 0.45, x: currentStep >= 2 ? 0 : 20 }}
      >
        <div style={{ color: '#34d399', fontSize: 'clamp(28px, 7vw, 54px)', fontWeight: 950, lineHeight: 1 }}>
          {safeNumerator}/{safeDenominator}
        </div>
        <div style={{ color: '#bfdbfe', fontSize: 13, fontWeight: 800, marginTop: 8 }}>{percent}% shaded</div>
      </motion.div>
    </div>
  );
}

function OperationAnimation({
  operands,
  operation,
  currentStep,
}: {
  operands: [number, number];
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division';
  currentStep: number;
}) {
  const [a, b] = operands;
  const result = operationResult(operation, a, b);
  const symbol = operation === 'addition' ? '+' : operation === 'subtraction' ? '-' : operation === 'multiplication' ? 'x' : '/';

  const card = (label: string, color: string, delay: number) => (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 45 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay, duration: 0.35 }}
      style={{
        ...glassCard,
        minWidth: 58,
        padding: '12px 14px',
        borderRadius: 16,
        color,
        fontSize: 'clamp(24px, 6vw, 52px)',
        fontWeight: 950,
        textAlign: 'center',
        transformStyle: 'preserve-3d',
      }}
    >
      {label}
    </motion.div>
  );

  return (
    <div style={{ ...scenePadding, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 2vw, 18px)', width: '100%', transform: 'perspective(900px) rotateX(7deg)' }}>
        {card(formatNumber(a), '#bfdbfe', 0)}
        {card(symbol, '#facc15', currentStep >= 1 ? 0.08 : 0)}
        {card(formatNumber(b), '#bfdbfe', currentStep >= 1 ? 0.14 : 0)}
        {card('=', '#94a3b8', currentStep >= 2 ? 0.2 : 0)}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, rotateY: 35 }}
          animate={{ opacity: currentStep >= 3 ? 1 : 0.22, scale: currentStep >= 3 ? 1 : 0.78, rotateY: currentStep >= 3 ? 0 : 35 }}
          transition={{ duration: 0.4 }}
          style={{
            ...glassCard,
            minWidth: 72,
            padding: '14px 18px',
            borderRadius: 18,
            color: '#34d399',
            border: '1px solid rgba(52,211,153,0.46)',
            boxShadow: '0 0 26px rgba(52,211,153,0.22)',
            fontSize: 'clamp(28px, 7vw, 60px)',
            fontWeight: 950,
            textAlign: 'center',
          }}
        >
          {formatNumber(result)}
        </motion.div>
      </div>
    </div>
  );
}

function RatioAnimation({
  ratioParts,
  total,
  currentStep,
}: {
  ratioParts: [number, number];
  total: number;
  currentStep: number;
}) {
  const [first, second] = ratioParts;
  const totalParts = Math.max(2, first + second);
  const unitValue = total / totalParts;
  const firstAmount = first * unitValue;
  const secondAmount = second * unitValue;

  return (
    <div style={{ ...scenePadding, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(110px,0.42fr)', gap: 12, alignItems: 'stretch' }}>
      <div style={{ display: 'grid', gridTemplateRows: '0.58fr 0.42fr', gap: 10, minHeight: 0 }}>
        <div style={{ ...glassCard, borderRadius: 18, padding: 12, display: 'grid', gridTemplateColumns: `repeat(${totalParts}, minmax(0, 1fr))`, gap: 5, alignItems: 'stretch', transform: 'perspective(700px) rotateX(9deg)' }}>
          {Array.from({ length: totalParts }).map((_, index) => {
            const isFirst = index < first;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 26 }}
                animate={{
                  opacity: currentStep >= 0 ? 1 : 0,
                  y: currentStep >= 0 ? 0 : 26,
                  scale: currentStep >= 2 && isFirst ? 1.04 : 1,
                }}
                transition={{ delay: index * 0.05, duration: 0.28 }}
                style={{
                  minHeight: 0,
                  borderRadius: 10,
                  background: isFirst ? 'linear-gradient(180deg, #2dd4bf, #0f766e)' : 'linear-gradient(180deg, #fbbf24, #b45309)',
                  boxShadow: currentStep >= 2 && isFirst ? '0 0 18px rgba(45,212,191,0.45)' : 'inset 0 1px 0 rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.18)',
                }}
              />
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8, minHeight: 0 }}>
          {[
            [`${first}+${second}`, `${totalParts} parts`],
            [formatNumber(unitValue), 'per part'],
            [formatNumber(firstAmount), 'first mix'],
          ].map(([value, label], index) => (
            <motion.div
              key={label}
              style={{ ...glassCard, borderRadius: 16, padding: '8px 6px', textAlign: 'center', minWidth: 0 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: currentStep >= index + 1 ? 1 : 0.35, y: currentStep >= index + 1 ? 0 : 16 }}
            >
              <div style={{ color: index === 2 ? '#2dd4bf' : '#f8fafc', fontSize: 'clamp(16px, 4.6vw, 30px)', fontWeight: 950, lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ color: '#94a3b8', fontSize: 10, fontWeight: 800, marginTop: 5, textTransform: 'uppercase', letterSpacing: 1.2 }}>{label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ ...glassCard, position: 'relative', overflow: 'hidden', borderRadius: 18, padding: 12 }}>
        <motion.div
          style={{
            position: 'absolute',
            left: '18%',
            right: '18%',
            bottom: 18,
            height: '72%',
            border: '2px solid rgba(226,232,240,0.48)',
            borderTop: '0',
            borderRadius: '0 0 20px 20px',
            overflow: 'hidden',
          }}
        >
          <motion.div
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg, #2dd4bf, #0f766e)' }}
            initial={{ height: '0%' }}
            animate={{ height: currentStep >= 2 ? `${Math.max(12, (firstAmount / total) * 100)}%` : '0%' }}
            transition={{ duration: 0.8 }}
          />
          <motion.div
            style={{ position: 'absolute', left: 0, right: 0, bottom: `${Math.max(12, (firstAmount / total) * 100)}%`, background: 'linear-gradient(180deg, #fbbf24, #b45309)' }}
            initial={{ height: '0%' }}
            animate={{ height: currentStep >= 3 ? `${Math.max(12, (secondAmount / total) * 100)}%` : '0%' }}
            transition={{ duration: 0.8 }}
          />
        </motion.div>
        <motion.div
          style={{ position: 'absolute', top: 12, left: 0, right: 0, textAlign: 'center', color: '#f8fafc', fontWeight: 950, fontSize: 'clamp(18px, 4vw, 28px)' }}
          animate={{ opacity: currentStep >= 2 ? 1 : 0.45 }}
        >
          {first}:{second}
        </motion.div>
      </div>
    </div>
  );
}

function EquationBalanceAnimation({
  coefficient,
  constant,
  result,
  solution,
  currentStep,
}: {
  coefficient: number;
  constant: number;
  result: number;
  solution: number;
  currentStep: number;
}) {
  const xBlocks = Math.max(1, Math.min(Math.abs(Math.round(coefficient)), 6));
  const constantLabel = constant >= 0 ? `+${formatNumber(constant)}` : formatNumber(constant);

  return (
    <div style={{ ...scenePadding, display: 'grid', gridTemplateRows: 'minmax(0,1fr) auto', gap: 8 }}>
      <div style={{ position: 'relative', minHeight: 0 }}>
        <motion.div
          style={{ position: 'absolute', left: '18%', right: '18%', top: '47%', height: 8, borderRadius: 999, background: 'linear-gradient(90deg,#38bdf8,#facc15)', transformOrigin: '50% 50%' }}
          animate={{ rotate: currentStep >= 1 ? 0 : [-2, 2, -1] }}
          transition={{ duration: 1.4, repeat: currentStep >= 1 ? 0 : Infinity }}
        />
        <div style={{ position: 'absolute', left: '49%', top: '38%', bottom: '14%', width: 10, borderRadius: 999, background: '#64748b' }} />

        <motion.div
          style={{ ...glassCard, position: 'absolute', left: '4%', top: '16%', width: '39%', minHeight: '45%', borderRadius: 18, padding: 10, display: 'flex', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: 6 }}
          animate={{ y: currentStep >= 1 ? 0 : -4 }}
        >
          {Array.from({ length: xBlocks }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: currentStep >= 2 ? 1.08 : 1 }}
              transition={{ delay: index * 0.06 }}
              style={{ width: 34, height: 34, borderRadius: 10, display: 'grid', placeItems: 'center', background: 'linear-gradient(145deg,#2dd4bf,#0f766e)', color: '#fff', fontWeight: 950, boxShadow: '0 8px 18px rgba(20,184,166,0.22)' }}
            >
              x
            </motion.div>
          ))}
          {constant !== 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: currentStep >= 1 ? 0.25 : 1, scale: currentStep >= 1 ? 0.72 : 1, y: currentStep >= 1 ? -18 : 0 }}
              style={{ minWidth: 42, height: 34, borderRadius: 10, display: 'grid', placeItems: 'center', background: 'linear-gradient(145deg,#f97316,#b45309)', color: '#fff', fontWeight: 950 }}
            >
              {constantLabel}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          style={{ ...glassCard, position: 'absolute', right: '4%', top: '16%', width: '39%', minHeight: '45%', borderRadius: 18, padding: 10, display: 'grid', placeItems: 'center' }}
          animate={{ y: currentStep >= 1 ? 0 : 4 }}
        >
          <motion.div
            style={{ color: '#facc15', fontSize: 'clamp(30px, 8vw, 62px)', fontWeight: 950, lineHeight: 1 }}
            animate={{ scale: currentStep >= 1 ? 0.9 : 1 }}
          >
            {currentStep >= 1 ? formatNumber(result - constant) : formatNumber(result)}
          </motion.div>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8 }}>
        {[
          [`${formatNumber(coefficient)}x ${constantLabel} = ${formatNumber(result)}`, 'start'],
          [`${formatNumber(coefficient)}x = ${formatNumber(result - constant)}`, 'same action'],
          [`x = ${formatNumber(solution)}`, 'solution'],
        ].map(([value, label], index) => (
          <motion.div
            key={label}
            style={{ ...glassCard, borderRadius: 14, padding: '7px 6px', textAlign: 'center', minWidth: 0 }}
            animate={{ opacity: currentStep >= index ? 1 : 0.32, scale: currentStep === index ? 1.02 : 1 }}
          >
            <div style={{ color: index === 2 ? '#34d399' : '#f8fafc', fontSize: 'clamp(12px, 3vw, 20px)', fontWeight: 950, whiteSpace: 'nowrap' }}>{value}</div>
            <div style={{ color: '#94a3b8', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.1 }}>{label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PythagoreanAnimation({
  sideA,
  sideB,
  sideC,
  currentStep,
}: {
  sideA: number;
  sideB: number;
  sideC: number;
  currentStep: number;
}) {
  const a2 = sideA * sideA;
  const b2 = sideB * sideB;
  const c2 = sideC * sideC;

  return (
    <div style={scenePadding}>
      <svg viewBox="0 0 640 275" style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <filter id="pyGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.rect x="45" y="70" width="86" height="132" rx="10" fill="rgba(45,212,191,0.25)" stroke="#2dd4bf" strokeWidth="2" initial={{ scale: 0, opacity: 0 }} animate={{ scale: currentStep >= 1 ? 1 : 0, opacity: currentStep >= 1 ? 1 : 0 }} style={{ transformOrigin: '88px 136px' }} />
        <motion.rect x="132" y="203" width="225" height="48" rx="10" fill="rgba(56,189,248,0.24)" stroke="#38bdf8" strokeWidth="2" initial={{ scale: 0, opacity: 0 }} animate={{ scale: currentStep >= 1 ? 1 : 0, opacity: currentStep >= 1 ? 1 : 0 }} style={{ transformOrigin: '245px 227px' }} />
        <motion.polygon points="358,202 424,132 304,24 238,94" fill="rgba(250,204,21,0.24)" stroke="#facc15" strokeWidth="2" initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: currentStep >= 2 ? 1 : 0, scale: currentStep >= 2 ? 1 : 0.75 }} style={{ transformOrigin: '331px 112px' }} filter="url(#pyGlow)" />

        <motion.path
          d="M132 202 L132 70 L358 202 Z"
          fill="rgba(15,23,42,0.72)"
          stroke="#e2e8f0"
          strokeWidth="4"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0.6 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <path d="M132 178 L156 178 L156 202" fill="none" stroke="#e2e8f0" strokeWidth="3" />

        <text x="96" y="139" fill="#2dd4bf" fontSize="22" fontWeight="900" textAnchor="middle">a={formatNumber(sideA)}</text>
        <text x="245" y="244" fill="#38bdf8" fontSize="22" fontWeight="900" textAnchor="middle">b={formatNumber(sideB)}</text>
        <text x="267" y="118" fill="#facc15" fontSize="22" fontWeight="900" textAnchor="middle" transform="rotate(29 267 118)">c={formatNumber(sideC)}</text>

        {[0, 1, 2].map((dot) => (
          <motion.circle
            key={dot}
            cx={dot === 0 ? 88 : dot === 1 ? 245 : 331}
            cy={dot === 0 ? 136 : dot === 1 ? 227 : 112}
            r="6"
            fill={dot === 2 ? '#facc15' : dot === 1 ? '#38bdf8' : '#2dd4bf'}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: currentStep >= dot + 1 ? 1 : 0, scale: currentStep >= dot + 1 ? [1, 1.8, 1] : 0 }}
            transition={{ duration: 0.7, repeat: currentStep >= dot + 1 ? Infinity : 0, repeatDelay: 0.5 }}
          />
        ))}

        <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: currentStep >= 2 ? 1 : 0.35, x: currentStep >= 2 ? 0 : 20 }}>
          <rect x="420" y="57" width="178" height="153" rx="18" fill="rgba(15,23,42,0.78)" stroke="rgba(226,232,240,0.18)" />
          <text x="509" y="94" fill="#f8fafc" fontSize="22" fontWeight="900" textAnchor="middle">a^2 + b^2 = c^2</text>
          <text x="509" y="128" fill="#bfdbfe" fontSize="19" fontWeight="800" textAnchor="middle">{formatNumber(a2)} + {formatNumber(b2)} = {formatNumber(c2)}</text>
          <motion.text x="509" y="171" fill="#34d399" fontSize="30" fontWeight="950" textAnchor="middle" animate={{ scale: currentStep >= 3 ? [1, 1.08, 1] : 1 }} transition={{ duration: 0.9, repeat: currentStep >= 3 ? Infinity : 0 }}>
            c = {formatNumber(sideC)}
          </motion.text>
        </motion.g>
      </svg>
    </div>
  );
}

function ScientificNotationAnimation({
  displayValue,
  exponent,
  currentStep,
}: {
  displayValue: string;
  exponent: number;
  currentStep: number;
}) {
  const positiveMove = exponent > 0;
  const normalized = positiveMove ? `${displayValue} expands` : `${displayValue} becomes 1 number`;

  return (
    <div style={{ ...scenePadding, display: 'grid', gridTemplateRows: 'minmax(0,1fr) auto', gap: 10 }}>
      <div style={{ ...glassCard, position: 'relative', overflow: 'hidden', borderRadius: 20, padding: 16 }}>
        <div style={{ position: 'absolute', left: 24, right: 24, top: '50%', height: 5, borderRadius: 999, background: 'linear-gradient(90deg,#38bdf8,#2dd4bf,#facc15)' }} />
        <motion.div
          style={{ position: 'absolute', top: 'calc(50% - 18px)', width: 36, height: 36, borderRadius: 18, display: 'grid', placeItems: 'center', background: '#0f172a', border: '3px solid #facc15', color: '#facc15', fontWeight: 950, boxShadow: '0 0 22px rgba(250,204,21,0.35)' }}
          initial={{ left: positiveMove ? '22%' : '74%' }}
          animate={{ left: currentStep >= 1 ? (positiveMove ? '74%' : '22%') : positiveMove ? '22%' : '74%' }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        >
          .
        </motion.div>
        <motion.div
          style={{ position: 'absolute', left: 0, right: 0, top: 28, textAlign: 'center', color: '#f8fafc', fontSize: 'clamp(24px, 7vw, 58px)', fontWeight: 950, letterSpacing: 0 }}
          animate={{ opacity: currentStep >= 0 ? 1 : 0 }}
        >
          {displayValue}
        </motion.div>
        <motion.div
          style={{ position: 'absolute', left: 0, right: 0, bottom: 26, textAlign: 'center', color: '#34d399', fontSize: 'clamp(18px, 5vw, 38px)', fontWeight: 950 }}
          animate={{ opacity: currentStep >= 2 ? 1 : 0, y: currentStep >= 2 ? 0 : 16 }}
        >
          x 10^{formatNumber(exponent)}
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8 }}>
        {[
          ['decimal', displayValue],
          ['places', Math.abs(exponent).toString()],
          ['power', normalized],
        ].map(([label, value], index) => (
          <motion.div
            key={label}
            style={{ ...glassCard, borderRadius: 14, padding: '7px 6px', textAlign: 'center', minWidth: 0 }}
            animate={{ opacity: currentStep >= index ? 1 : 0.32 }}
          >
            <div style={{ color: index === 2 ? '#34d399' : '#f8fafc', fontSize: 'clamp(12px,3vw,19px)', fontWeight: 900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
            <div style={{ color: '#94a3b8', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.1 }}>{label}</div>
          </motion.div>
        ))}
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

  useEffect(() => {
    setCurrentStep(0);
  }, [concept, values]);

  const steps = useMemo<Step[]>(() => {
    switch (concept) {
      case 'number-line': {
        const start = values.startValue ?? 0;
        const move = values.moveValue ?? 0;
        return [
          { narration: `Start at ${start}.`, duration: 900 },
          { narration: `Move ${Math.abs(move)} spaces ${move >= 0 ? 'right' : 'left'}.`, duration: 1100 },
          { narration: `Land on ${start + move}.`, duration: 1200 },
          ...(values.moveValue2 !== undefined
            ? [{ narration: `Make the second move to land on ${start + move + values.moveValue2}.`, duration: 1200 }]
            : []),
        ];
      }
      case 'ratio': {
        const parts = values.ratioParts ?? [3, 5];
        const total = values.total ?? 40;
        return [
          { narration: `Split the ratio into ${parts[0]} plus ${parts[1]} parts.`, duration: 1000 },
          { narration: `The total has ${parts[0] + parts[1]} equal parts.`, duration: 1000 },
          { narration: `One part is ${formatNumber(total / (parts[0] + parts[1]))}.`, duration: 1000 },
          { narration: `The first share is ${formatNumber((parts[0] * total) / (parts[0] + parts[1]))}.`, duration: 1300 },
        ];
      }
      case 'equation':
        return [
          { narration: 'Keep both sides balanced.', duration: 1000 },
          { narration: 'Undo the constant on both sides.', duration: 1000 },
          { narration: 'Split the remaining value equally among the x blocks.', duration: 1000 },
          { narration: `The solution is x equals ${formatNumber(values.solution ?? 0)}.`, duration: 1300 },
        ];
      case 'pythagorean':
        return [
          { narration: 'Start with the right triangle.', duration: 1000 },
          { narration: 'Build squares on the two shorter sides.', duration: 1000 },
          { narration: 'Their areas combine to match the hypotenuse square.', duration: 1100 },
          { narration: `The missing side is ${formatNumber(values.sideC ?? 5)}.`, duration: 1300 },
        ];
      case 'scientific':
        return [
          { narration: 'Watch the decimal point move.', duration: 1000 },
          { narration: 'Count how many places it travels.', duration: 1000 },
          { narration: 'The power of ten records that movement.', duration: 1300 },
        ];
      case 'fraction':
        return [
          { narration: `Show ${values.denominator ?? 4} equal parts.`, duration: 1000 },
          { narration: `Shade ${values.numerator ?? 1} parts.`, duration: 1000 },
          { narration: 'The shaded share is the fraction.', duration: 1300 },
        ];
      case 'addition':
      case 'subtraction':
      case 'multiplication':
      case 'division':
        return [
          { narration: `Start with ${values.operands?.[0] ?? 0}.`, duration: 900 },
          { narration: `Apply ${concept} with ${values.operands?.[1] ?? 0}.`, duration: 900 },
          { narration: 'Calculate the result.', duration: 900 },
          { narration: 'Reveal the answer.', duration: 1200 },
        ];
      default:
        return [];
    }
  }, [concept, values]);

  useEffect(() => {
    if (!autoPlay || steps.length === 0) return;
    const step = steps[currentStep];
    if (!step) return;

    const timer = window.setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
        onStepChange?.(currentStep + 1, steps[currentStep + 1].narration);
      } else {
        onComplete?.();
      }
    }, step.duration);

    return () => window.clearTimeout(timer);
  }, [autoPlay, currentStep, onComplete, onStepChange, steps]);

  useEffect(() => {
    const step = steps[currentStep];
    if (step) onStepChange?.(currentStep, step.narration);
  }, [currentStep, onStepChange, steps]);

  const visualization = useMemo(() => {
    switch (concept) {
      case 'number-line':
        return (
          <NumberLineAnimation
            startValue={values.startValue ?? 0}
            moveValue={values.moveValue ?? 0}
            moveValue2={values.moveValue2}
            currentStep={currentStep}
          />
        );
      case 'fraction':
        return (
          <FractionAnimation
            numerator={values.numerator ?? 1}
            denominator={values.denominator ?? 4}
            currentStep={currentStep}
          />
        );
      case 'ratio':
        return (
          <RatioAnimation
            ratioParts={values.ratioParts ?? [3, 5]}
            total={values.total ?? 40}
            currentStep={currentStep}
          />
        );
      case 'equation': {
        const coefficient = values.coefficient ?? values.operands?.[0] ?? 2;
        const constant = values.constant ?? 0;
        const result = values.result ?? values.operands?.[1] ?? 10;
        const solution = values.solution ?? (coefficient === 0 ? 0 : (result - constant) / coefficient);
        return (
          <EquationBalanceAnimation
            coefficient={coefficient}
            constant={constant}
            result={result}
            solution={solution}
            currentStep={currentStep}
          />
        );
      }
      case 'pythagorean': {
        const sideA = values.sideA ?? values.operands?.[0] ?? 3;
        const sideB = values.sideB ?? values.operands?.[1] ?? 4;
        const sideC = values.sideC ?? Math.sqrt(sideA * sideA + sideB * sideB);
        return <PythagoreanAnimation sideA={sideA} sideB={sideB} sideC={sideC} currentStep={currentStep} />;
      }
      case 'scientific':
        return (
          <ScientificNotationAnimation
            displayValue={values.displayValue ?? '0.00032'}
            exponent={values.exponent ?? -4}
            currentStep={currentStep}
          />
        );
      case 'addition':
      case 'subtraction':
      case 'multiplication':
      case 'division':
        return (
          <OperationAnimation
            operands={values.operands ?? [0, 0]}
            operation={concept}
            currentStep={currentStep}
          />
        );
      default:
        return null;
    }
  }, [concept, currentStep, values]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
        borderRadius: 16,
        background:
          'radial-gradient(circle at 18% 10%, rgba(45,212,191,0.24), transparent 28%), radial-gradient(circle at 82% 18%, rgba(250,204,21,0.15), transparent 25%), linear-gradient(135deg, #07111f 0%, #13233f 58%, #111827 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.16,
          backgroundImage:
            'linear-gradient(rgba(226,232,240,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(226,232,240,0.2) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div style={{ position: 'relative', height: '100%', minHeight: 0 }}>{visualization}</div>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 9,
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 7,
          padding: '5px 7px',
          borderRadius: 999,
          background: 'rgba(2,6,23,0.45)',
          border: '1px solid rgba(148,163,184,0.16)',
        }}
      >
        {steps.map((_, index) => (
          <motion.div
            key={index}
            style={{
              width: index === currentStep ? 18 : 7,
              height: 7,
              borderRadius: 999,
              background: index <= currentStep ? '#34d399' : 'rgba(226,232,240,0.28)',
            }}
            animate={{ width: index === currentStep ? 18 : 7 }}
          />
        ))}
      </div>
    </div>
  );
}
