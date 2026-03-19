'use client';
import { useEffect, useRef } from 'react';

function Vial({ index, filled, justFilled }: { index: number; filled: boolean; justFilled: boolean }) {
  const gradId = `vialGrad${index}`;
  const clipId = `vialClip${index}`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <svg width={26} height={50} viewBox="0 0 26 50" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
          <clipPath id={clipId}>
            <rect x={5} y={10} width={16} height={32} rx={2} />
          </clipPath>
        </defs>

        {/* Glass neck */}
        <rect x={9} y={2} width={8} height={10} rx={2}
          fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.4)" strokeWidth={1.2} />
        {/* Glass body */}
        <rect x={4} y={10} width={18} height={33} rx={3}
          fill="rgba(255,255,255,0.06)" stroke={filled ? '#38BDF8' : 'rgba(255,255,255,0.25)'} strokeWidth={1.4} />

        {/* Water fill */}
        {filled && (
          <g clipPath={`url(#${clipId})`}>
            <rect x={5} y={10} width={16} height={32}
              fill={`url(#${gradId})`}
              style={{ animation: justFilled ? 'vial-fill 0.7s ease-out' : 'none' }} />
            {/* Shimmer stripe */}
            <rect x={7} y={14} width={3} height={18} rx={1.5} fill="rgba(255,255,255,0.35)" />
            {/* Surface wave */}
            <ellipse cx={13} cy={11} rx={6} ry={1.8}
              fill="#BAE6FD" opacity={0.7}
              style={{ animation: 'wave-surface 2s ease-in-out infinite' }} />
          </g>
        )}

        {/* Glow when filled */}
        {filled && (
          <rect x={4} y={10} width={18} height={33} rx={3}
            fill="none" stroke="#38BDF8" strokeWidth={2}
            style={{ filter: 'blur(2px)', animation: 'vial-glow 2s ease-in-out infinite' }} />
        )}

        {/* Sparkle burst on just filled */}
        {justFilled && ['−6,−6', '6,−6', '0,−9', '−6,6', '6,6'].map((offset, k) => {
          const [dx, dy] = offset.split(',').map(Number);
          return (
            <text key={k} x={13 + dx} y={26 + dy} textAnchor="middle" fontSize={8}
              style={{ animation: `sparkle-out 0.6s ease-out ${k * 0.06}s forwards`, opacity: 0 }}>
              ✦
            </text>
          );
        })}
      </svg>
      <span style={{ fontSize: 9, fontWeight: 700, color: filled ? '#38BDF8' : 'rgba(255,255,255,0.25)' }}>
        {index + 1}
      </span>

      <style jsx>{`
        @keyframes vial-fill        { from{clip-path:inset(100% 0 0 0)} to{clip-path:inset(0 0 0 0)} }
        @keyframes wave-surface     { 0%,100%{transform:scaleX(1)} 50%{transform:scaleX(0.85)} }
        @keyframes vial-glow        { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes sparkle-out      { 0%{opacity:1;transform:scale(0.5)} 60%{opacity:1;transform:scale(1.4)} 100%{opacity:0;transform:scale(1)} }
      `}</style>
    </div>
  );
}

export default function VialCounter({ collected, total, justCollectedIndex }: {
  collected: number;
  total: number;
  justCollectedIndex: number | null;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 20 }}>🧪</span>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        {Array.from({ length: total }).map((_, i) => (
          <Vial key={i} index={i} filled={i < collected} justFilled={i === justCollectedIndex} />
        ))}
      </div>
      <div style={{ marginLeft: 4 }}>
        <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Vials</p>
        <p style={{ margin: 0, fontWeight: 900, color: '#38BDF8', fontSize: 16 }}>{collected}/{total}</p>
      </div>
    </div>
  );
}
