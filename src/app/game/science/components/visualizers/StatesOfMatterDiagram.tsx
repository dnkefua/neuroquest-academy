'use client';

import { useState, useEffect } from 'react';

interface StatesOfMatterDiagramProps {
  highlightStage?: string;
}

export default function StatesOfMatterDiagram({ highlightStage }: StatesOfMatterDiagramProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const showSolid = !highlightStage || highlightStage.toLowerCase().includes('solid');
  const showLiquid = !highlightStage || highlightStage.toLowerCase().includes('liquid');
  const showGas = !highlightStage || highlightStage.toLowerCase().includes('gas');

  // Particle positions for each state
  const solidParticles = [
    { x: 50, y: 50 }, { x: 70, y: 50 }, { x: 90, y: 50 },
    { x: 50, y: 70 }, { x: 70, y: 70 }, { x: 90, y: 70 },
    { x: 50, y: 90 }, { x: 70, y: 90 }, { x: 90, y: 90 },
  ];

  const liquidParticles = [
    { x: 50 + Math.sin(phase * 0.1) * 5, y: 60 + Math.cos(phase * 0.08) * 8 },
    { x: 70 + Math.cos(phase * 0.12) * 6, y: 55 + Math.sin(phase * 0.1) * 10 },
    { x: 90 + Math.sin(phase * 0.08) * 8, y: 70 + Math.cos(phase * 0.12) * 6 },
    { x: 55 + Math.cos(phase * 0.15) * 10, y: 80 + Math.sin(phase * 0.1) * 8 },
    { x: 75 + Math.sin(phase * 0.1) * 8, y: 75 + Math.cos(phase * 0.08) * 10 },
    { x: 95 + Math.cos(phase * 0.08) * 5, y: 85 + Math.sin(phase * 0.12) * 6 },
  ];

  const gasParticles = [
    { x: 50 + Math.sin(phase * 0.2 + 0) * 40, y: 50 + Math.cos(phase * 0.15 + 0) * 35 },
    { x: 70 + Math.cos(phase * 0.18 + 1) * 35, y: 60 + Math.sin(phase * 0.22 + 1) * 30 },
    { x: 90 + Math.sin(phase * 0.25 + 2) * 30, y: 50 + Math.cos(phase * 0.2 + 2) * 40 },
    { x: 60 + Math.cos(phase * 0.22 + 3) * 38, y: 80 + Math.sin(phase * 0.18 + 3) * 25 },
    { x: 80 + Math.sin(phase * 0.15 + 4) * 32, y: 70 + Math.cos(phase * 0.25 + 4) * 35 },
  ];

  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(99, 102, 241, 0.3)',
    }}>
      {/* Three states */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
      }}>
        {/* Solid */}
        <div style={{
          background: showSolid ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          padding: '12px',
          border: `2px solid ${showSolid ? '#ef4444' : 'rgba(239, 68, 68, 0.3)'}`,
        }}>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px' }}>🧊</span>
            <div style={{ color: showSolid ? '#fca5a5' : '#94a3b8', fontSize: '12px', fontWeight: 'bold' }}>
              SOLID
            </div>
          </div>
          <svg width="100" height="100" viewBox="0 0 140 140">
            {/* Container */}
            <rect x="30" y="30" width="80" height="80" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.5" />

            {/* Particles - tightly packed, vibrating */}
            {solidParticles.map((p, i) => (
              <circle
                key={i}
                cx={p.x + Math.sin(phase * 0.3 + i) * 2}
                cy={p.y + Math.cos(phase * 0.3 + i) * 2}
                r="8"
                fill="#ef4444"
                style={{ filter: 'drop-shadow(0 0 4px #ef4444)' }}
              />
            ))}
          </svg>
          <div style={{ textAlign: 'center', fontSize: '9px', color: '#64748b' }}>
            Fixed shape<br />Vibrating particles
          </div>
        </div>

        {/* Liquid */}
        <div style={{
          background: showLiquid ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          padding: '12px',
          border: `2px solid ${showLiquid ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)'}`,
        }}>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px' }}>💧</span>
            <div style={{ color: showLiquid ? '#93c5fd' : '#94a3b8', fontSize: '12px', fontWeight: 'bold' }}>
              LIQUID
            </div>
          </div>
          <svg width="100" height="100" viewBox="0 0 140 140">
            {/* Container */}
            <path d="M 30,40 L 30,110 L 110,110 L 110,40 L 100,30 L 40,30 Z" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />

            {/* Particles - loosely packed, flowing */}
            {liquidParticles.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="8"
                fill="#3b82f6"
                style={{ filter: 'drop-shadow(0 0 4px #3b82f6)' }}
              />
            ))}
          </svg>
          <div style={{ textAlign: 'center', fontSize: '9px', color: '#64748b' }}>
            Takes container shape<br />Particles can move
          </div>
        </div>

        {/* Gas */}
        <div style={{
          background: showGas ? 'rgba(34, 197, 94, 0.2)' : 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          padding: '12px',
          border: `2px solid ${showGas ? '#22c55e' : 'rgba(34, 197, 94, 0.3)'}`,
        }}>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px' }}>💨</span>
            <div style={{ color: showGas ? '#4ade80' : '#94a3b8', fontSize: '12px', fontWeight: 'bold' }}>
              GAS
            </div>
          </div>
          <svg width="100" height="100" viewBox="0 0 140 140">
            {/* Container */}
            <rect x="30" y="30" width="80" height="80" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.5" />

            {/* Particles - spread out, fast moving */}
            {gasParticles.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="6"
                fill="#22c55e"
                style={{ filter: 'drop-shadow(0 0 6px #22c55e)' }}
              />
            ))}
          </svg>
          <div style={{ textAlign: 'center', fontSize: '9px', color: '#64748b' }}>
            Fills container<br />Fast random motion
          </div>
        </div>
      </div>

      {/* State changes */}
      <div style={{
        marginTop: '12px',
        padding: '12px',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
      }}>
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>
          State Changes
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          fontSize: '10px',
          flexWrap: 'wrap',
        }}>
          <span style={{ color: '#fca5a5' }}>🧊 SOLID</span>
          <span style={{ color: '#fcd34d' }}>+ heat →</span>
          <span style={{ color: '#93c5fd' }}>💧 LIQUID</span>
          <span style={{ color: '#fcd34d' }}>+ heat →</span>
          <span style={{ color: '#4ade80' }}>💨 GAS</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          fontSize: '10px',
          marginTop: '4px',
          flexWrap: 'wrap',
        }}>
          <span style={{ color: '#22c55e' }}>← cool</span>
          <span style={{ color: '#64748b' }}>|</span>
          <span style={{ color: '#22c55e' }}>← cool</span>
        </div>
      </div>

      {/* Key */}
      <div style={{
        marginTop: '12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        fontSize: '10px',
        textAlign: 'center',
      }}>
        <div>
          <div style={{ color: '#fca5a5', fontWeight: 'bold' }}>Particles:</div>
          <div style={{ color: '#64748b' }}>Close together</div>
          <div style={{ color: '#64748b' }}>Fixed positions</div>
        </div>
        <div>
          <div style={{ color: '#93c5fd', fontWeight: 'bold' }}>Particles:</div>
          <div style={{ color: '#64748b' }}>Close together</div>
          <div style={{ color: '#64748b' }}>Can slide past</div>
        </div>
        <div>
          <div style={{ color: '#4ade80', fontWeight: 'bold' }}>Particles:</div>
          <div style={{ color: '#64748b' }}>Far apart</div>
          <div style={{ color: '#64748b' }}>Move freely</div>
        </div>
      </div>
    </div>
  );
}