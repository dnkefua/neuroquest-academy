'use client';

import { useState, useEffect } from 'react';

interface CellDiagramProps {
  highlightStage?: string;
}

// Cell organelles with detailed info
const ORGANELLES = [
  {
    id: 'nucleus',
    name: 'Nucleus',
    emoji: '🔵',
    description: 'The control center of the cell - contains DNA and directs all activities',
    function: 'Stores genetic information',
    color: '#3b82f6',
    x: 50, y: 45, size: 35,
    animate: true,
  },
  {
    id: 'membrane',
    name: 'Cell Membrane',
    emoji: '🧱',
    description: 'The protective outer layer that controls what enters and exits',
    function: 'Selective barrier',
    color: '#22c55e',
    x: 50, y: 50, size: 100, // Full cell
    animate: false,
  },
  {
    id: 'cytoplasm',
    name: 'Cytoplasm',
    emoji: '💧',
    description: 'The gel-like fluid that fills the cell and suspends organelles',
    function: 'Medium for cellular reactions',
    color: '#4ade80',
    x: 50, y: 50, size: 90,
    animate: false,
  },
  {
    id: 'mitochondria',
    name: 'Mitochondria',
    emoji: '⚡',
    description: 'The powerhouse of the cell - produces ATP energy through cellular respiration',
    function: 'Energy production (ATP)',
    color: '#f97316',
    x: 70, y: 35, size: 20,
    animate: true,
  },
  {
    id: 'ribosome',
    name: 'Ribosomes',
    emoji: '🔹',
    description: 'Tiny protein factories that read mRNA and build proteins',
    function: 'Protein synthesis',
    color: '#a855f7',
    x: 25, y: 65, size: 12,
    animate: true,
  },
  {
    id: 'er',
    name: 'Endoplasmic Reticulum',
    emoji: '〰️',
    description: 'A network of membranes for protein folding and transport',
    function: 'Protein folding & transport',
    color: '#ec4899',
    x: 65, y: 55, size: 25,
    animate: true,
  },
  {
    id: 'golgi',
    name: 'Golgi Apparatus',
    emoji: '📦',
    description: 'The packaging center - modifies, sorts, and ships proteins',
    function: 'Protein packaging',
    color: '#f59e0b',
    x: 80, y: 70, size: 18,
    animate: true,
  },
  {
    id: 'vacuole',
    name: 'Vacuole',
    emoji: '🫧',
    description: 'Storage containers for water, nutrients, and waste',
    function: 'Storage',
    color: '#06b6d4',
    x: 25, y: 35, size: 22,
    animate: true,
  },
];

export default function CellDiagram({ highlightStage }: CellDiagramProps) {
  const [hoveredOrg, setHoveredOrg] = useState<string | null>(null);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [floatPhase, setFloatPhase] = useState(0);

  // Animation loops
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulsePhase((p) => (p + 1) % 100);
    }, 50);
    const floatInterval = setInterval(() => {
      setFloatPhase((f) => (f + 1) % 360);
    }, 30);
    return () => {
      clearInterval(pulseInterval);
      clearInterval(floatInterval);
    };
  }, []);

  const isHighlighted = (id: string) => {
    if (!highlightStage) return false;
    return highlightStage.toLowerCase().includes(id.toLowerCase());
  };

  // Floating animation for organelles
  const getFloatOffset = (id: string, baseY: number) => {
    const offset = Math.sin(floatPhase * Math.PI / 180 + baseY) * 3;
    return offset;
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(100, 200, 255, 0.3)',
    }}>
      {/* Info panel for hovered organelle */}
      {hoveredOrg && (
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.85)',
          borderRadius: '8px',
          padding: '8px 12px',
          zIndex: 10,
          maxWidth: '280px',
          border: `1px solid ${ORGANELLES.find(o => o.id === hoveredOrg)?.color || '#4ade80'}`,
        }}>
          <div style={{ color: ORGANELLES.find(o => o.id === hoveredOrg)?.color, fontWeight: 'bold', fontSize: '12px' }}>
            {ORGANELLES.find(o => o.id === hoveredOrg)?.name}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '10px', marginTop: '2px' }}>
            {ORGANELLES.find(o => o.id === hoveredOrg)?.description}
          </div>
        </div>
      )}

      {/* Cell visualization */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width="300" height="300" viewBox="0 0 300 300">
          {/* Cell membrane - animated outer ring */}
          <ellipse
            cx="150"
            cy="150"
            rx={140 + Math.sin(pulsePhase * 0.1) * 3}
            ry={120 + Math.cos(pulsePhase * 0.1) * 3}
            fill="none"
            stroke="#22c55e"
            strokeWidth="4"
            opacity="0.6"
            style={{ filter: 'drop-shadow(0 0 10px #22c55e)' }}
          />

          {/* Cytoplasm gradient */}
          <ellipse
            cx="150"
            cy="150"
            rx="135"
            ry="115"
            fill="url(#cytoplasmGradient)"
          />

          {/* Gradient definition */}
          <defs>
            <radialGradient id="cytoplasmGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2d5a3e" />
              <stop offset="70%" stopColor="#1a3f2a" />
              <stop offset="100%" stopColor="#0f2918" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Endoplasmic Reticulum - wavy network */}
          <g style={{ opacity: isHighlighted('er') || hoveredOrg === 'er' ? 1 : 0.7 }}>
            <path
              d={`M ${100 + Math.sin(floatPhase * 0.05) * 5},120
                  Q 120,${130 + Math.sin(floatPhase * 0.03) * 10} 140,125
                  Q 160,${120 + Math.cos(floatPhase * 0.04) * 8} 180,130
                  Q 200,${140 + Math.sin(floatPhase * 0.02) * 6} 190,150
                  Q 175,${160 + Math.cos(floatPhase * 0.05) * 10} 160,155
                  Q 140,${150 + Math.sin(floatPhase * 0.03) * 8} 120,158`}
              fill="none"
              stroke={isHighlighted('er') || hoveredOrg === 'er' ? '#f472b6' : '#ec4899'}
              strokeWidth="3"
              strokeLinecap="round"
              style={{ filter: isHighlighted('er') || hoveredOrg === 'er' ? 'url(#glow)' : 'none' }}
            />
          </g>

          {/* Golgi Apparatus - stacked curves */}
          <g style={{ opacity: isHighlighted('golgi') || hoveredOrg === 'golgi' ? 1 : 0.7 }}>
            {[0, 1, 2, 3].map((i) => (
              <path
                key={i}
                d={`M ${215 + Math.sin(floatPhase * 0.04 + i) * 3},${175 + i * 8}
                    Q ${235 + Math.sin(floatPhase * 0.03) * 4},${170 + i * 8 + Math.cos(floatPhase * 0.05) * 3}
                    ${255 + Math.cos(floatPhase * 0.04) * 2},${180 + i * 8}`}
                fill="none"
                stroke={isHighlighted('golgi') || hoveredOrg === 'golgi' ? '#fbbf24' : '#f59e0b'}
                strokeWidth="4"
                strokeLinecap="round"
                style={{ filter: isHighlighted('golgi') || hoveredOrg === 'golgi' ? 'url(#glow)' : 'none' }}
              />
            ))}
          </g>

          {/* Mitochondria - bean shaped with inner folds */}
          <g
            style={{
              opacity: isHighlighted('mitochondria') || hoveredOrg === 'mitochondria' ? 1 : 0.7,
              transform: `translate(${Math.sin(floatPhase * 0.03) * 2}px, ${Math.cos(floatPhase * 0.04) * 2}px)`,
            }}
          >
            <ellipse
              cx="210"
              cy="105"
              rx="25"
              ry="15"
              fill={isHighlighted('mitochondria') || hoveredOrg === 'mitochondria' ? '#f97316' : '#ea580c'}
              style={{ filter: isHighlighted('mitochondria') || hoveredOrg === 'mitochondria' ? 'url(#glow)' : 'none' }}
            />
            <path
              d="M 195,105 Q 200,100 210,105 Q 220,110 225,105"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
            />
          </g>

          {/* Vacuole - large bubble */}
          <g style={{ opacity: isHighlighted('vacuole') || hoveredOrg === 'vacuole' ? 1 : 0.7 }}>
            <ellipse
              cx="75"
              cy="110"
              rx="30"
              ry="25"
              fill={isHighlighted('vacuole') || hoveredOrg === 'vacuole' ? '#22d3ee' : '#0891b2'}
              fillOpacity="0.4"
              stroke={isHighlighted('vacuole') || hoveredOrg === 'vacuole' ? '#22d3ee' : '#06b6d4'}
              strokeWidth="2"
              style={{ filter: isHighlighted('vacuole') || hoveredOrg === 'vacuole' ? 'url(#glow)' : 'none' }}
            />
            <ellipse
              cx="75"
              cy="110"
              rx="20"
              ry="15"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          </g>

          {/* Ribosomes - small dots floating */}
          {[...Array(8)].map((_, i) => (
            <circle
              key={i}
              cx={60 + i * 25 + Math.sin(floatPhase * 0.05 + i) * 3}
              cy={195 + Math.cos(floatPhase * 0.04 + i * 0.5) * 5}
              r="4"
              fill={isHighlighted('ribosome') || hoveredOrg === 'ribosome' ? '#c084fc' : '#a855f7'}
              style={{
                filter: isHighlighted('ribosome') || hoveredOrg === 'ribosome' ? 'url(#glow)' : 'none',
                opacity: 0.8,
              }}
            />
          ))}

          {/* Nucleus - large central structure */}
          <g style={{
            transform: `scale(${isHighlighted('nucleus') || hoveredOrg === 'nucleus' ? 1.05 : 1})`,
            transformOrigin: '150px 150px',
            transition: 'transform 0.3s ease',
          }}>
            <ellipse
              cx="150"
              cy="150"
              rx="40"
              ry="35"
              fill="#1e40af"
              stroke={isHighlighted('nucleus') || hoveredOrg === 'nucleus' ? '#60a5fa' : '#3b82f6'}
              strokeWidth="3"
              style={{ filter: isHighlighted('nucleus') || hoveredOrg === 'nucleus' ? 'url(#glow)' : 'none' }}
            />
            {/* Nuclear envelope */}
            <ellipse
              cx="150"
              cy="150"
              rx="35"
              ry="30"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="1"
              strokeDasharray="4,2"
            />
            {/* Nucleolus */}
            <circle
              cx="155"
              cy="145"
              r="10"
              fill="#2563eb"
              stroke="#3b82f6"
              strokeWidth="1"
            />
            {/* Chromatin dots */}
            {[...Array(6)].map((_, i) => (
              <circle
                key={i}
                cx={140 + (i % 3) * 10}
                cy={155 + Math.floor(i / 3) * 10}
                r="2"
                fill="#60a5fa"
                opacity="0.6"
              />
            ))}
          </g>

          {/* Animated particles moving through cell */}
          {[...Array(5)].map((_, i) => (
            <circle
              key={`particle-${i}`}
              cx={50 + (floatPhase * 2 + i * 60) % 200}
              cy={150 + Math.sin((floatPhase + i * 50) * 0.05) * 50}
              r="2"
              fill="#4ade80"
              opacity="0.5"
            />
          ))}
        </svg>

        {/* Interactive labels */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
        }}>
          {ORGANELLES.filter(org => org.id !== 'membrane' && org.id !== 'cytoplasm').map((org) => (
            <div
              key={org.id}
              style={{
                position: 'absolute',
                left: `${org.x}%`,
                top: `${org.y}%`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'auto',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredOrg(org.id)}
              onMouseLeave={() => setHoveredOrg(null)}
            >
              <div style={{
                fontSize: '20px',
                filter: isHighlighted(org.id) || hoveredOrg === org.id
                  ? `drop-shadow(0 0 8px ${org.color})`
                  : 'none',
                transform: isHighlighted(org.id) || hoveredOrg === org.id ? 'scale(1.2)' : 'scale(1)',
                transition: 'all 0.3s ease',
              }}>
                {org.emoji}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend with hover effects */}
      <div style={{
        marginTop: '12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '4px',
        fontSize: '9px',
      }}>
        {ORGANELLES.filter(org => org.id !== 'membrane' && org.id !== 'cytoplasm').map((org) => (
          <div
            key={org.id}
            onMouseEnter={() => setHoveredOrg(org.id)}
            onMouseLeave={() => setHoveredOrg(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              padding: '4px',
              borderRadius: '4px',
              background: hoveredOrg === org.id ? `${org.color}20` : 'transparent',
              border: `1px solid ${hoveredOrg === org.id ? org.color : 'transparent'}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '12px' }}>{org.emoji}</span>
            <span style={{ color: hoveredOrg === org.id ? org.color : '#94a3b8', fontSize: '8px' }}>
              {org.name}
            </span>
          </div>
        ))}
      </div>

      {/* Function display */}
      {hoveredOrg && (
        <div style={{
          marginTop: '8px',
          padding: '8px 12px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '6px',
          textAlign: 'center',
        }}>
          <span style={{ color: ORGANELLES.find(o => o.id === hoveredOrg)?.color, fontWeight: 'bold', fontSize: '11px' }}>
            {ORGANELLES.find(o => o.id === hoveredOrg)?.function}
          </span>
        </div>
      )}
    </div>
  );
}