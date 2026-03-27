'use client';
import { useState } from 'react';

interface Stage {
  id: string;
  emoji: string;
  label: string;
  color: string;
  cx: number;
  cy: number;
  tip: string;
}

const STAGES: Stage[] = [
  { id: 'evaporation',   emoji: '☀️', label: 'Evaporation',   color: '#F59E0B', cx: 80,  cy: 130, tip: 'Sun heats water → rises as vapor' },
  { id: 'condensation',  emoji: '☁️', label: 'Condensation',  color: '#93C5FD', cx: 240, cy: 40,  tip: 'Vapor cools → forms clouds' },
  { id: 'precipitation', emoji: '🌧️', label: 'Precipitation', color: '#3B82F6', cx: 390, cy: 130, tip: 'Clouds release rain or snow' },
  { id: 'collection',    emoji: '💧', label: 'Collection',    color: '#14B8A6', cx: 240, cy: 210, tip: 'Water gathers in rivers & oceans' },
];

// Arrow paths connecting stages in cycle order
const ARROWS = [
  { d: 'M 110,115 Q 160,20 210,45', color: '#F59E0B', stage: 'evaporation' },
  { d: 'M 270,45 Q 340,30 370,115', color: '#93C5FD', stage: 'condensation' },
  { d: 'M 390,160 Q 380,200 290,210',color: '#3B82F6', stage: 'precipitation' },
  { d: 'M 185,215 Q 120,230 90,160', color: '#14B8A6', stage: 'collection' },
];

interface WaterCycleDiagramProps {
  highlightStage?: string;
}

export default function WaterCycleDiagram({ highlightStage }: WaterCycleDiagramProps) {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const activeStage = highlightStage || 'all';

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 480 }}>
      <svg viewBox="0 0 480 260" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
        <defs>
          {ARROWS.map((a, i) => (
            <marker key={i} id={`arrowhead-${i}`} markerWidth="8" markerHeight="8"
              refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={a.color} opacity={0.8} />
            </marker>
          ))}
        </defs>

        {/* Background oval */}
        <ellipse cx={240} cy={130} rx={220} ry={115}
          fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />

        {/* Animated arrows */}
        {ARROWS.map((a, i) => {
          const isActive = activeStage === 'all' || activeStage === a.stage;
          return (
            <path key={i} d={a.d}
              fill="none"
              stroke={a.color}
              strokeWidth={isActive ? 2.5 : 1.2}
              strokeDasharray="8 5"
              opacity={isActive ? 0.9 : 0.25}
              markerEnd={`url(#arrowhead-${i})`}
              style={{
                strokeDashoffset: 0,
                animation: isActive ? `dash-flow 1.8s linear infinite` : 'none',
              }}
            />
          );
        })}

        {/* Stage nodes */}
        {STAGES.map(s => {
          const isActive = activeStage === 'all' || activeStage === s.id;
          return (
            <g key={s.id} style={{ cursor: 'pointer' }}
              onClick={() => setTooltip(tooltip === s.tip ? null : s.tip)}
              onMouseEnter={() => setTooltip(s.tip)}
              onMouseLeave={() => setTooltip(null)}>
              {/* Glow ring when active */}
              {isActive && (
                <circle cx={s.cx} cy={s.cy} r={28}
                  fill="none" stroke={s.color} strokeWidth={2}
                  opacity={0.4}
                  style={{ animation: 'pulse-ring 1.5s ease-in-out infinite' }} />
              )}
              {/* Node circle */}
              <circle cx={s.cx} cy={s.cy} r={22}
                fill={isActive ? `${s.color}30` : 'rgba(255,255,255,0.05)'}
                stroke={isActive ? s.color : 'rgba(255,255,255,0.15)'}
                strokeWidth={isActive ? 2 : 1} />
              {/* Emoji */}
              <text x={s.cx} y={s.cy + 6} textAnchor="middle" fontSize={16}>{s.emoji}</text>
              {/* Label */}
              <text x={s.cx} y={s.cy + 36} textAnchor="middle"
                fontSize={9} fontWeight={isActive ? 700 : 400}
                fill={isActive ? s.color : 'rgba(255,255,255,0.4)'}>
                {s.label}
              </text>
            </g>
          );
        })}

        <style>{`
          @keyframes dash-flow  { to { stroke-dashoffset: -26; } }
          @keyframes pulse-ring { 0%,100%{r:24;opacity:0.3} 50%{r:30;opacity:0.6} }
        `}</style>
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(15,12,41,0.95)', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 10, padding: '6px 12px', fontSize: 11, color: 'white',
          whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 10,
          marginBottom: 4,
        }}>
          {tooltip}
        </div>
      )}
    </div>
  );
}