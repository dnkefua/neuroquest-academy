'use client';

import { useState, useEffect } from 'react';

interface ElectricityDiagramProps {
  highlightStage?: string;
}

export default function ElectricityDiagram({ highlightStage }: ElectricityDiagramProps) {
  const [electronPos, setElectronPos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElectronPos((p) => (p + 1) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const showVoltage = !highlightStage || highlightStage.toLowerCase().includes('voltage') || highlightStage.toLowerCase().includes('volt');
  const showCurrent = !highlightStage || highlightStage.toLowerCase().includes('current') || highlightStage.toLowerCase().includes('amp');
  const showResistance = !highlightStage || highlightStage.toLowerCase().includes('resistance') || highlightStage.toLowerCase().includes('resistor');

  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #0f172a 100%)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(250, 204, 21, 0.3)',
    }}>
      {/* Circuit visualization */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '280px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width="320" height="240" viewBox="0 0 320 240">
          {/* Circuit path */}
          <path
            d="M 40,120 L 80,120 L 80,40 L 240,40 L 240,120 L 280,120 L 280,200 L 40,200 L 40,120"
            fill="none"
            stroke="#facc15"
            strokeWidth="3"
            opacity="0.6"
          />

          {/* Battery */}
          <g transform="translate(15, 100)">
            <rect x="0" y="0" width="20" height="40" fill="#facc15" rx="2" />
            <text x="10" y="55" textAnchor="middle" fill="#facc15" fontSize="10">V</text>
            <text x="10" y="-5" textAnchor="middle" fill="#facc15" fontSize="10">+</text>
            <text x="10" y="50" textAnchor="middle" fill="#facc15" fontSize="8">−</text>
          </g>

          {/* Resistor */}
          <g transform="translate(130, 25)">
            <rect x="0" y="0" width="60" height="30" fill={showResistance ? '#f97316' : '#78350f'} rx="4" stroke="#f97316" strokeWidth="2" />
            <text x="30" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Ω</text>
          </g>

          {/* Light bulb */}
          <g transform="translate(250, 85)">
            <circle cx="15" cy="15" r="20" fill={showCurrent ? '#fef08a' : '#374151'} stroke="#facc15" strokeWidth="2" />
            <text x="15" y="50" textAnchor="middle" fill="#facc15" fontSize="10">💡</text>
          </g>

          {/* Ammeter */}
          <g transform="translate(130, 165)">
            <circle cx="20" cy="20" r="25" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="2" />
            <text x="20" y="25" textAnchor="middle" fill="#3b82f6" fontSize="14" fontWeight="bold">A</text>
          </g>

          {/* Moving electrons */}
          {showCurrent && (
            <>
              {/* Electrons flowing */}
              {[...Array(6)].map((_, i) => {
                const positions = [
                  { x: 40 + electronPos * 2, y: 120 },
                  { x: 80 + electronPos * 1.5, y: 40 + electronPos * 0.5 },
                  { x: 240, y: 120 + electronPos * 0.8 },
                  { x: 280 - electronPos * 2, y: 200 },
                  { x: 40 + electronPos, y: 200 - electronPos * 0.8 },
                ];
                const pos = positions[i % positions.length];
                return (
                  <circle
                    key={i}
                    cx={pos.x}
                    cy={pos.y}
                    r="4"
                    fill="#60a5fa"
                    style={{ filter: 'drop-shadow(0 0 4px #60a5fa)' }}
                  />
                );
              })}
            </>
          )}

          {/* Voltage arrows */}
          {showVoltage && (
            <g>
              <path d="M 35,80 L 35,60" stroke="#facc15" strokeWidth="2" markerEnd="url(#arrow)" />
              <text x="45" y="70" fill="#facc15" fontSize="10">V</text>
            </g>
          )}
        </svg>
      </div>

      {/* Ohm's Law */}
      <div style={{
        textAlign: 'center',
        marginTop: '12px',
        padding: '12px',
        background: 'rgba(250, 204, 21, 0.1)',
        borderRadius: '8px',
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#facc15', marginBottom: '4px' }}>
          V = I × R
        </div>
        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
          Voltage (V) = Current (I) × Resistance (Ω)
        </div>
      </div>

      {/* Key */}
      <div style={{
        marginTop: '12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        fontSize: '11px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: showVoltage ? '#facc15' : '#94a3b8', fontWeight: 'bold' }}>⚡ Voltage</div>
          <div style={{ color: '#64748b' }}>Volts (V)</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: showCurrent ? '#3b82f6' : '#94a3b8', fontWeight: 'bold' }}>→ Current</div>
          <div style={{ color: '#64748b' }}>Amps (A)</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: showResistance ? '#f97316' : '#94a3b8', fontWeight: 'bold' }}>⏸ Resistance</div>
          <div style={{ color: '#64748b' }}>Ohms (Ω)</div>
        </div>
      </div>
    </div>
  );
}