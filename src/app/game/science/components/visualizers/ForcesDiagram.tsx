'use client';

import { useState, useEffect } from 'react';

interface ForcesDiagramProps {
  highlightStage?: string;
}

export default function ForcesDiagram({ highlightStage }: ForcesDiagramProps) {
  const [forceAnim, setForceAnim] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setForceAnim((f) => (f + 1) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const showNewton1 = !highlightStage || highlightStage.toLowerCase().includes('first') || highlightStage.toLowerCase().includes('inertia');
  const showNewton2 = !highlightStage || highlightStage.toLowerCase().includes('second') || highlightStage.toLowerCase().includes('f=ma');
  const showNewton3 = !highlightStage || highlightStage.toLowerCase().includes('third') || highlightStage.toLowerCase().includes('action');
  const showForces = !highlightStage || highlightStage.toLowerCase().includes('force') || highlightStage.toLowerCase().includes('motion');

  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #1e293b 100%)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(59, 130, 246, 0.3)',
    }}>
      {/* Force visualization */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '280px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width="320" height="240" viewBox="0 0 320 240">
          {/* Object */}
          <rect
            x={140 + (showNewton2 ? Math.sin(forceAnim * 0.1) * 20 : 0)}
            y="100"
            width="40"
            height="40"
            fill="#3b82f6"
            rx="4"
            style={{ filter: 'drop-shadow(0 0 8px #3b82f6)' }}
          />
          <text x={160 + (showNewton2 ? Math.sin(forceAnim * 0.1) * 20 : 0)} y="125" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
            m
          </text>

          {/* Force arrow (F) */}
          {showForces && (
            <g>
              <line
                x1="80"
                y1="120"
                x2="130"
                y2="120"
                stroke="#ef4444"
                strokeWidth="4"
                markerEnd="url(#arrowhead)"
              />
              <text x="80" y="108" fill="#ef4444" fontSize="14" fontWeight="bold">F</text>
            </g>
          )}

          {/* Acceleration arrow (a) */}
          {showNewton2 && (
            <g>
              <line
                x1="185"
                y1="120"
                x2={185 + forceAnim * 0.5}
                y2="120"
                stroke="#22c55e"
                strokeWidth="3"
                strokeDasharray="5,5"
                markerEnd="url(#arrowhead-green)"
              />
              <text x="220" y="108" fill="#22c55e" fontSize="14" fontWeight="bold">a</text>
            </g>
          )}

          {/* Velocity arrow (v) */}
          <g>
            <line
              x1="160"
              y1="160"
              x2={160 + (showNewton2 ? 30 : 0)}
              y2="160"
              stroke="#facc15"
              strokeWidth="2"
              strokeDasharray="3,3"
            />
            <text x="180" y="175" fill="#facc15" fontSize="10">v</text>
          </g>

          {/* Arrow markers */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
            </marker>
            <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
            </marker>
          </defs>

          {/* Ground */}
          <line x1="40" y1="150" x2="280" y2="150" stroke="#64748b" strokeWidth="2" strokeDasharray="10,5" />
        </svg>
      </div>

      {/* Newton's Laws */}
      <div style={{
        marginTop: '12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        fontSize: '10px',
      }}>
        <div style={{
          padding: '8px',
          borderRadius: '6px',
          background: showNewton1 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0,0,0,0.2)',
          border: `1px solid ${showNewton1 ? '#ef4444' : 'transparent'}`,
        }}>
          <div style={{ color: showNewton1 ? '#ef4444' : '#94a3b8', fontWeight: 'bold' }}>
            1st Law
          </div>
          <div style={{ color: '#64748b' }}>
            Object at rest stays at rest
          </div>
        </div>
        <div style={{
          padding: '8px',
          borderRadius: '6px',
          background: showNewton2 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(0,0,0,0.2)',
          border: `1px solid ${showNewton2 ? '#22c55e' : 'transparent'}`,
        }}>
          <div style={{ color: showNewton2 ? '#22c55e' : '#94a3b8', fontWeight: 'bold' }}>
            2nd Law
          </div>
          <div style={{ color: '#64748b' }}>
            F = ma
          </div>
        </div>
        <div style={{
          padding: '8px',
          borderRadius: '6px',
          background: showNewton3 ? 'rgba(250, 204, 21, 0.2)' : 'rgba(0,0,0,0.2)',
          border: `1px solid ${showNewton3 ? '#facc15' : 'transparent'}`,
        }}>
          <div style={{ color: showNewton3 ? '#facc15' : '#94a3b8', fontWeight: 'bold' }}>
            3rd Law
          </div>
          <div style={{ color: '#64748b' }}>
            Action = Reaction
          </div>
        </div>
      </div>

      {/* Formula */}
      <div style={{
        marginTop: '8px',
        textAlign: 'center',
        padding: '8px',
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '6px',
      }}>
        <span style={{ color: '#ef4444', fontWeight: 'bold' }}>F</span>
        <span style={{ color: '#94a3b8' }}> = </span>
        <span style={{ color: '#facc15', fontWeight: 'bold' }}>m</span>
        <span style={{ color: '#94a3b8' }}> × </span>
        <span style={{ color: '#22c55e', fontWeight: 'bold' }}>a</span>
        <span style={{ color: '#64748b', fontSize: '11px', marginLeft: '12px' }}>
          Force = mass × acceleration
        </span>
      </div>
    </div>
  );
}