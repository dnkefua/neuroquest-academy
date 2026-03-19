'use client';
import { useEffect, useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

interface NumberLineProps {
  start: number;
  move: number;
  move2?: number;
  animate?: boolean;
}

export default function NumberLine({ start, move, move2, animate = true }: NumberLineProps) {
  const MIN = -10; const MAX = 10; const RANGE = MAX - MIN;
  const W = 560; const PAD = 40;
  const usable = W - PAD * 2;
  const toX = (v: number) => PAD + ((v - MIN) / RANGE) * usable;

  const step1End = start + move;
  const step2End = move2 !== undefined ? step1End + move2 : null;
  const finalEnd = step2End ?? step1End;

  const dotControls = useAnimationControls();

  useEffect(() => {
    if (!animate) return;
    async function run() {
      await dotControls.set({ cx: toX(start) });
      await new Promise(r => setTimeout(r, 600));
      await dotControls.start({ cx: toX(step1End), transition: { duration: 1.2, ease: 'easeInOut' } });
      if (step2End !== null) {
        await new Promise(r => setTimeout(r, 400));
        await dotControls.start({ cx: toX(step2End), transition: { duration: 0.9, ease: 'easeInOut' } });
      }
    }
    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, move, move2]);

  const ticks = Array.from({ length: RANGE + 1 }, (_, i) => MIN + i);

  return (
    <div className="w-full overflow-x-auto">
      <svg width={W} height={90} className="mx-auto block">
        {/* Axis line */}
        <line x1={PAD} y1={45} x2={W - PAD} y2={45} stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
        {/* Arrows */}
        <polygon points={`${PAD-6},41 ${PAD-6},49 ${PAD-14},45`} fill="rgba(255,255,255,0.3)" />
        <polygon points={`${W-PAD+6},41 ${W-PAD+6},49 ${W-PAD+14},45`} fill="rgba(255,255,255,0.3)" />

        {/* Ticks + labels */}
        {ticks.map(v => {
          const x = toX(v);
          const isZero = v === 0;
          return (
            <g key={v}>
              <line x1={x} y1={isZero ? 32 : 38} x2={x} y2={52} stroke={isZero ? '#FFD700' : 'rgba(255,255,255,0.4)'} strokeWidth={isZero ? 2 : 1} />
              <text x={x} y={68} textAnchor="middle" fontSize={v % 5 === 0 || isZero ? 11 : 9}
                fill={isZero ? '#FFD700' : 'rgba(255,255,255,0.6)'} fontFamily="monospace">
                {v}
              </text>
            </g>
          );
        })}

        {/* Move arrow */}
        {animate && (
          <motion.line
            x1={toX(start)} y1={35} x2={toX(step1End)} y2={35}
            stroke={move >= 0 ? '#FFD700' : '#818CF8'}
            strokeWidth={3} strokeDasharray="6 3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: 'easeInOut' }}
          />
        )}

        {/* Start dot */}
        <circle cx={toX(start)} cy={45} r={7} fill="#6366F1" stroke="white" strokeWidth={2} />
        <text x={toX(start)} y={25} textAnchor="middle" fontSize={9} fill="#818CF8">start</text>

        {/* Animated end dot */}
        <motion.circle
          cy={45} r={9}
          fill={finalEnd >= 0 ? '#FFD700' : '#EF4444'}
          stroke="white" strokeWidth={2}
          initial={{ cx: toX(start) }}
          animate={dotControls}
          style={{ filter: 'drop-shadow(0 0 6px currentColor)' }}
        />
        <text x={toX(finalEnd)} y={88} textAnchor="middle" fontSize={10} fill="#FFD700" fontWeight="bold">= {finalEnd}</text>
      </svg>
    </div>
  );
}
