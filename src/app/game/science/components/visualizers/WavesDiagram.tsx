'use client';

import { useState, useEffect } from 'react';

interface WavesDiagramProps {
  highlightStage?: string;
}

export default function WavesDiagram({ highlightStage }: WavesDiagramProps) {
  const [wavePhase, setWavePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWavePhase((w) => (w + 2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const showAmplitude = !highlightStage || highlightStage.toLowerCase().includes('amplitude') || highlightStage.toLowerCase().includes('loud');
  const showFrequency = !highlightStage || highlightStage.toLowerCase().includes('frequency') || highlightStage.toLowerCase().includes('pitch');
  const showWavelength = !highlightStage || highlightStage.toLowerCase().includes('wavelength') || highlightStage.toLowerCase().includes('wave');

  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #312e81 100%)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(139, 92, 246, 0.3)',
    }}>
      {/* Wave visualization */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width="320" height="180" viewBox="0 0 320 180">
          {/* Background grid */}
          <line x1="0" y1="90" x2="320" y2="90" stroke="#4c1d95" strokeWidth="1" strokeDasharray="5,5" />

          {/* Wave */}
          <path
            d={`M 0,90 ${Array.from({ length: 80 }, (_, i) => {
              const x = i * 4;
              const y = 90 + 40 * Math.sin((x + wavePhase) * Math.PI / 40);
              return `L ${x},${y}`;
            }).join(' ')}`}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
            style={{ filter: 'drop-shadow(0 0 6px #8b5cf6)' }}
          />

          {/* Amplitude markers */}
          {showAmplitude && (
            <g>
              <line x1="280" y1="50" x2="280" y2="130" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" />
              <line x1="275" y1="50" x2="285" y2="50" stroke="#ef4444" strokeWidth="2" />
              <line x1="275" y1="130" x2="285" y2="130" stroke="#ef4444" strokeWidth="2" />
              <text x="300" y="95" fill="#ef4444" fontSize="10">A</text>
              <text x="10" y="95" fill="#ef4444" fontSize="11">Amplitude</text>
            </g>
          )}

          {/* Wavelength marker */}
          {showWavelength && (
            <g>
              <line x1="40" y1="140" x2="120" y2="140" stroke="#22c55e" strokeWidth="2" />
              <line x1="40" y1="135" x2="40" y2="145" stroke="#22c55e" strokeWidth="2" />
              <line x1="120" y1="135" x2="120" y2="145" stroke="#22c55e" strokeWidth="2" />
              <text x="80" y="155" fill="#22c55e" fontSize="10" textAnchor="middle">λ (wavelength)</text>
            </g>
          )}

          {/* Frequency indicator */}
          {showFrequency && (
            <text x="10" y="30" fill="#facc15" fontSize="11">
              Frequency: waves per second
            </text>
          )}
        </svg>
      </div>

      {/* Wave properties */}
      <div style={{
        marginTop: '12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
      }}>
        <div style={{
          padding: '10px',
          borderRadius: '8px',
          background: showAmplitude ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0,0,0,0.2)',
          border: `1px solid ${showAmplitude ? '#ef4444' : 'transparent'}`,
          textAlign: 'center',
        }}>
          <div style={{ color: showAmplitude ? '#ef4444' : '#94a3b8', fontWeight: 'bold', fontSize: '12px' }}>
            Amplitude
          </div>
          <div style={{ color: '#64748b', fontSize: '10px' }}>
            Height of wave
          </div>
          <div style={{ color: '#94a3b8', fontSize: '10px' }}>
            = Loudness (sound)
          </div>
        </div>
        <div style={{
          padding: '10px',
          borderRadius: '8px',
          background: showFrequency ? 'rgba(250, 204, 21, 0.2)' : 'rgba(0,0,0,0.2)',
          border: `1px solid ${showFrequency ? '#facc15' : 'transparent'}`,
          textAlign: 'center',
        }}>
          <div style={{ color: showFrequency ? '#facc15' : '#94a3b8', fontWeight: 'bold', fontSize: '12px' }}>
            Frequency
          </div>
          <div style={{ color: '#64748b', fontSize: '10px' }}>
            Waves per second
          </div>
          <div style={{ color: '#94a3b8', fontSize: '10px' }}>
            = Pitch (sound)
          </div>
        </div>
        <div style={{
          padding: '10px',
          borderRadius: '8px',
          background: showWavelength ? 'rgba(34, 197, 94, 0.2)' : 'rgba(0,0,0,0.2)',
          border: `1px solid ${showWavelength ? '#22c55e' : 'transparent'}`,
          textAlign: 'center',
        }}>
          <div style={{ color: showWavelength ? '#22c55e' : '#94a3b8', fontWeight: 'bold', fontSize: '12px' }}>
            Wavelength
          </div>
          <div style={{ color: '#64748b', fontSize: '10px' }}>
            Distance per wave
          </div>
          <div style={{ color: '#94a3b8', fontSize: '10px' }}>
            λ = v/f
          </div>
        </div>
      </div>

      {/* Formula */}
      <div style={{
        marginTop: '12px',
        textAlign: 'center',
        padding: '10px',
        background: 'rgba(139, 92, 246, 0.1)',
        borderRadius: '8px',
      }}>
        <span style={{ color: '#22c55e', fontWeight: 'bold' }}>λ</span>
        <span style={{ color: '#94a3b8' }}> = </span>
        <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>v</span>
        <span style={{ color: '#94a3b8' }}> / </span>
        <span style={{ color: '#facc15', fontWeight: 'bold' }}>f</span>
        <span style={{ color: '#64748b', fontSize: '11px', marginLeft: '12px' }}>
          wavelength = speed ÷ frequency
        </span>
      </div>
    </div>
  );
}