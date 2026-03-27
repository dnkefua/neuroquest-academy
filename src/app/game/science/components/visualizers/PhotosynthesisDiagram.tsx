'use client';

import { useState, useEffect } from 'react';

interface PhotosynthesisDiagramProps {
  highlightStage?: string;
}

export default function PhotosynthesisDiagram({ highlightStage }: PhotosynthesisDiagramProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const showLight = !highlightStage || highlightStage.toLowerCase().includes('light') || highlightStage.toLowerCase().includes('sun');
  const showCo2 = !highlightStage || highlightStage.toLowerCase().includes('co2') || highlightStage.toLowerCase().includes('carbon');
  const showOxygen = !highlightStage || highlightStage.toLowerCase().includes('oxygen') || highlightStage.toLowerCase().includes('o2');
  const showGlucose = !highlightStage || highlightStage.toLowerCase().includes('glucose') || highlightStage.toLowerCase().includes('sugar');

  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',
      background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(34, 197, 94, 0.3)',
    }}>
      {/* Leaf cross-section */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '280px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width="320" height="260" viewBox="0 0 320 260">
          {/* Leaf shape */}
          <ellipse cx="160" cy="130" rx="120" ry="80" fill="#166534" stroke="#22c55e" strokeWidth="3" />

          {/* Veins */}
          <line x1="160" y1="50" x2="160" y2="210" stroke="#15803d" strokeWidth="3" />
          <line x1="100" y1="90" x2="160" y2="130" stroke="#15803d" strokeWidth="2" />
          <line x1="220" y1="90" x2="160" y2="130" stroke="#15803d" strokeWidth="2" />
          <line x1="100" y1="170" x2="160" y2="130" stroke="#15803d" strokeWidth="2" />
          <line x1="220" y1="170" x2="160" y2="130" stroke="#15803d" strokeWidth="2" />

          {/* Chloroplasts */}
          {[0, 60, 120, 180, 240].map((angle, i) => (
            <ellipse
              key={i}
              cx={160 + 40 * Math.cos((angle + phase) * Math.PI / 180)}
              cy={130 + 30 * Math.sin((angle + phase) * Math.PI / 180)}
              rx="20"
              ry="12"
              fill="#15803d"
              stroke="#22c55e"
              strokeWidth="1"
              style={{ filter: 'drop-shadow(0 0 4px #22c55e)' }}
            />
          ))}

          {/* Sun (light input) */}
          {showLight && (
            <g>
              <circle cx="80" cy="30" r="25" fill="#facc15" style={{ filter: 'drop-shadow(0 0 10px #facc15)' }} />
              <text x="80" y="35" textAnchor="middle" fontSize="20">☀️</text>
              {/* Light rays */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line
                  key={angle}
                  x1={80 + 30 * Math.cos(angle * Math.PI / 180)}
                  y1={30 + 30 * Math.sin(angle * Math.PI / 180)}
                  x2={80 + 40 * Math.cos(angle * Math.PI / 180)}
                  y2={30 + 40 * Math.sin(angle * Math.PI / 180)}
                  stroke="#facc15"
                  strokeWidth="2"
                />
              ))}
              {/* Arrow to leaf */}
              <path d="M 100,45 L 130,80" stroke="#facc15" strokeWidth="3" markerEnd="url(#arrow-yellow)" />
            </g>
          )}

          {/* CO2 input */}
          {showCo2 && (
            <g>
              <text x="30" y="130" fontSize="14" fill="#94a3b8">CO₂</text>
              <path d="M 55,130 L 80,130" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-gray)" />
            </g>
          )}

          {/* O2 output */}
          {showOxygen && (
            <g>
              <text x="280" y="100" fontSize="14" fill="#60a5fa">O₂</text>
              <path d="M 260,110 L 230,120" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow-blue)" />
            </g>
          )}

          {/* Glucose output */}
          {showGlucose && (
            <g>
              <text x="280" y="160" fontSize="14" fill="#f97316">C₆H₁₂O₆</text>
              <path d="M 260,150 L 230,140" stroke="#f97316" strokeWidth="2" markerEnd="url(#arrow-orange)" />
            </g>
          )}

          {/* Arrow markers */}
          <defs>
            <marker id="arrow-yellow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#facc15" />
            </marker>
            <marker id="arrow-gray" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
            <marker id="arrow-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
            </marker>
            <marker id="arrow-orange" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Equation */}
      <div style={{
        textAlign: 'center',
        padding: '12px',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        marginTop: '8px',
      }}>
        <div style={{ fontSize: '14px', color: '#facc15', fontWeight: 'bold' }}>
          6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂
        </div>
        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
          Carbon dioxide + Water + Sunlight → Glucose + Oxygen
        </div>
      </div>

      {/* Key */}
      <div style={{
        marginTop: '12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        fontSize: '10px',
        textAlign: 'center',
      }}>
        <div>
          <div style={{ fontSize: '16px' }}>☀️</div>
          <div style={{ color: '#facc15' }}>Light</div>
        </div>
        <div>
          <div style={{ fontSize: '16px' }}>💨</div>
          <div style={{ color: '#94a3b8' }}>CO₂ In</div>
        </div>
        <div>
          <div style={{ fontSize: '16px' }}>💨</div>
          <div style={{ color: '#60a5fa' }}>O₂ Out</div>
        </div>
        <div>
          <div style={{ fontSize: '16px' }}>🍬</div>
          <div style={{ color: '#f97316' }}>Glucose</div>
        </div>
      </div>
    </div>
  );
}