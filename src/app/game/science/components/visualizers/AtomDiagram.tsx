'use client';

import { useState, useEffect } from 'react';

interface AtomDiagramProps {
  highlightStage?: string;
}

export default function AtomDiagram({ highlightStage }: AtomDiagramProps) {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((p) => (p + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Determine what to highlight
  const showNucleus = !highlightStage || highlightStage.toLowerCase().includes('nucleus') || highlightStage.toLowerCase().includes('proton') || highlightStage.toLowerCase().includes('neutron');
  const showElectrons = !highlightStage || highlightStage.toLowerCase().includes('electron') || highlightStage.toLowerCase().includes('shell');
  const showShells = !highlightStage || highlightStage.toLowerCase().includes('shell') || highlightStage.toLowerCase().includes('orbit');

  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(168, 85, 247, 0.3)',
    }}>
      {/* Atom visualization */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '280px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width="280" height="280" viewBox="0 0 280 280">
          {/* Electron shells */}
          <ellipse
            cx="140"
            cy="140"
            rx="60"
            ry="40"
            fill="none"
            stroke={showShells ? '#a855f7' : '#4c1d95'}
            strokeWidth="1.5"
            strokeDasharray="5,5"
            opacity="0.6"
            transform={`rotate(${animationPhase}, 140, 140)`}
          />
          <ellipse
            cx="140"
            cy="140"
            rx="100"
            ry="70"
            fill="none"
            stroke={showShells ? '#a855f7' : '#4c1d95'}
            strokeWidth="1.5"
            strokeDasharray="5,5"
            opacity="0.6"
            transform={`rotate(${animationPhase + 60}, 140, 140)`}
          />
          <ellipse
            cx="140"
            cy="140"
            rx="130"
            ry="90"
            fill="none"
            stroke={showShells ? '#a855f7' : '#4c1d95'}
            strokeWidth="1.5"
            strokeDasharray="5,5"
            opacity="0.4"
            transform={`rotate(${animationPhase + 120}, 140, 140)`}
          />

          {/* Electrons orbiting */}
          {showElectrons && (
            <>
              <circle
                cx={140 + 60 * Math.cos(animationPhase * Math.PI / 180)}
                cy={140 + 40 * Math.sin(animationPhase * Math.PI / 180)}
                r="6"
                fill="#60a5fa"
                style={{ filter: 'drop-shadow(0 0 4px #60a5fa)' }}
              />
              <circle
                cx={140 + 100 * Math.cos((animationPhase + 120) * Math.PI / 180)}
                cy={140 + 70 * Math.sin((animationPhase + 120) * Math.PI / 180)}
                r="6"
                fill="#60a5fa"
                style={{ filter: 'drop-shadow(0 0 4px #60a5fa)' }}
              />
              <circle
                cx={140 + 100 * Math.cos((animationPhase + 240) * Math.PI / 180)}
                cy={140 + 70 * Math.sin((animationPhase + 240) * Math.PI / 180)}
                r="6"
                fill="#60a5fa"
                style={{ filter: 'drop-shadow(0 0 4px #60a5fa)' }}
              />
            </>
          )}

          {/* Nucleus */}
          {showNucleus && (
            <g style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }}>
              <circle cx="135" cy="140" r="18" fill="#ef4444" />
              <circle cx="145" cy="135" r="16" fill="#fbbf24" />
              <circle cx="140" cy="145" r="14" fill="#ef4444" />
              <text x="140" y="144" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">+</text>
            </g>
          )}
        </svg>

        {/* Labels */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          fontSize: '12px',
          color: '#a855f7',
        }}>
          Electrons (e⁻)
        </div>
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          fontSize: '12px',
          color: '#ef4444',
        }}>
          Nucleus (p⁺, n⁰)
        </div>
      </div>

      {/* Key */}
      <div style={{
        marginTop: '8px',
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        fontSize: '11px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#ef4444',
          }} />
          <span style={{ color: '#fca5a5' }}>Protons (+)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#fbbf24',
          }} />
          <span style={{ color: '#fcd34d' }}>Neutrons (0)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#60a5fa',
          }} />
          <span style={{ color: '#93c5fd' }}>Electrons (-)</span>
        </div>
      </div>
    </div>
  );
}