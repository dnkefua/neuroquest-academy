'use client';

import { useState, useEffect } from 'react';

interface ElectricityDiagramProps {
  highlightStage?: string;
}

export default function ElectricityDiagram({ highlightStage }: ElectricityDiagramProps) {
  const [electronPos, setElectronPos] = useState(0);
  const [circuitOn, setCircuitOn] = useState(true);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (circuitOn) {
        setElectronPos((p) => (p + 2) % 100);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [circuitOn]);

  const showVoltage = !highlightStage || highlightStage.toLowerCase().includes('voltage') || highlightStage.toLowerCase().includes('volt');
  const showCurrent = !highlightStage || highlightStage.toLowerCase().includes('current') || highlightStage.toLowerCase().includes('amp');
  const showResistance = !highlightStage || highlightStage.toLowerCase().includes('resistance') || highlightStage.toLowerCase().includes('resistor');

  // Calculate electrons along circuit path
  const getElectronPosition = (progress: number) => {
    // Circuit path: battery → resistor → lightbulb → ammeter → back to battery
    const segments = [
      { start: 0, end: 15, path: 'horizontal', x1: 40, y1: 120, x2: 100, y2: 120 },
      { start: 15, end: 30, path: 'vertical-down', x1: 100, y1: 120, x2: 100, y2: 40 },
      { start: 30, end: 70, path: 'horizontal', x1: 100, y1: 40, x2: 260, y2: 40 },
      { start: 70, end: 85, path: 'vertical-down', x1: 260, y1: 40, x2: 260, y2: 120 },
      { start: 85, end: 100, path: 'horizontal', x1: 260, y1: 120, x2: 40, y2: 120 },
    ];

    for (const seg of segments) {
      if (progress >= seg.start && progress < seg.end) {
        const t = (progress - seg.start) / (seg.end - seg.start);
        if (seg.path === 'horizontal') {
          return { x: seg.x1 + (seg.x2 - seg.x1) * t, y: seg.y1 };
        } else {
          return { x: seg.x1, y: seg.y1 + (seg.y2 - seg.y1) * t };
        }
      }
    }
    return { x: 40, y: 120 };
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #0f172a 100%)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(250, 204, 21, 0.3)',
    }}>
      {/* Circuit toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '8px',
      }}>
        <button
          onClick={() => setCircuitOn(!circuitOn)}
          style={{
            padding: '6px 16px',
            borderRadius: '20px',
            border: `2px solid ${circuitOn ? '#22c55e' : '#ef4444'}`,
            background: circuitOn ? '#166534' : '#7f1d1d',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          {circuitOn ? '⚡ Circuit ON' : '⭕ Circuit OFF'}
        </button>
      </div>

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
          {/* Circuit wires */}
          <path
            d="M 40,120 L 100,120 L 100,40 L 260,40 L 260,120 L 280,120 L 280,200 L 40,200 L 40,120"
            fill="none"
            stroke={circuitOn ? '#facc15' : '#4a5568'}
            strokeWidth="3"
            opacity={circuitOn ? 0.8 : 0.4}
          />

          {/* Battery */}
          <g
            transform="translate(15, 100)"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHoveredComponent('battery')}
            onMouseLeave={() => setHoveredComponent(null)}
          >
            <rect
              x="0"
              y="0"
              width="24"
              height="40"
              fill={hoveredComponent === 'battery' ? '#fef08a' : '#facc15'}
              rx="3"
              style={{
                filter: hoveredComponent === 'battery' && showVoltage ? 'drop-shadow(0 0 10px #facc15)' : 'none',
                transition: 'all 0.2s ease',
              }}
            />
            <rect x="8" y="-4" width="8" height="4" fill="#facc15" />
            <text x="12" y="58" textAnchor="middle" fill="#facc15" fontSize="10" fontWeight="bold">V</text>
            <text x="12" y="-8" textAnchor="middle" fill="#facc15" fontSize="10">+</text>
            <text x="12" y="70" textAnchor="middle" fill="#94a3b8" fontSize="8">−</text>
            {/* Voltage indicator */}
            {showVoltage && circuitOn && (
              <text x="12" y="25" textAnchor="middle" fill="#1a1a2e" fontSize="10" fontWeight="bold">
                ⚡
              </text>
            )}
          </g>

          {/* Resistor */}
          <g
            transform="translate(140, 25)"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHoveredComponent('resistor')}
            onMouseLeave={() => setHoveredComponent(null)}
          >
            <rect
              x="0"
              y="0"
              width="40"
              height="30"
              fill={hoveredComponent === 'resistor' ? '#fed7aa' : (showResistance ? '#f97316' : '#78350f')}
              rx="4"
              stroke="#f97316"
              strokeWidth="2"
              style={{
                filter: hoveredComponent === 'resistor' ? 'drop-shadow(0 0 8px #f97316)' : 'none',
                transition: 'all 0.2s ease',
              }}
            />
            {/* Zigzag pattern */}
            <path
              d="M 5,15 L 10,8 L 15,22 L 20,8 L 25,22 L 30,8 L 35,15"
              fill="none"
              stroke={circuitOn ? '#fff' : '#a8a29e'}
              strokeWidth="1.5"
            />
            <text x="20" y="45" textAnchor="middle" fill="#f97316" fontSize="10" fontWeight="bold">Ω</text>
          </g>

          {/* Light bulb */}
          <g
            transform="translate(250, 85)"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHoveredComponent('bulb')}
            onMouseLeave={() => setHoveredComponent(null)}
          >
            <circle
              cx="15"
              cy="15"
              r="18"
              fill={circuitOn ? (hoveredComponent === 'bulb' ? '#fef08a' : '#fef9c3') : '#374151'}
              stroke="#facc15"
              strokeWidth="2"
              style={{
                filter: circuitOn ? 'drop-shadow(0 0 15px #facc15)' : 'none',
                transition: 'all 0.3s ease',
              }}
            />
            {/* Filament */}
            <path
              d="M 10,15 Q 15,10 15,15 Q 15,20 20,15"
              fill="none"
              stroke={circuitOn ? '#facc15' : '#6b7280'}
              strokeWidth="1.5"
            />
            <text x="15" y="45" textAnchor="middle" fill="#facc15" fontSize="14">💡</text>
            {/* Glow animation */}
            {circuitOn && showCurrent && (
              <circle
                cx="15"
                cy="15"
                r={20 + Math.sin(electronPos * 0.1) * 3}
                fill="none"
                stroke="#fef08a"
                strokeWidth="1"
                opacity={0.3 + Math.sin(electronPos * 0.1) * 0.2}
              />
            )}
          </g>

          {/* Ammeter */}
          <g
            transform="translate(130, 165)"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHoveredComponent('ammeter')}
            onMouseLeave={() => setHoveredComponent(null)}
          >
            <circle
              cx="20"
              cy="20"
              r="22"
              fill={hoveredComponent === 'ammeter' ? '#bfdbfe' : '#1e3a5f'}
              stroke="#3b82f6"
              strokeWidth="2"
              style={{
                filter: hoveredComponent === 'ammeter' && showCurrent ? 'drop-shadow(0 0 8px #3b82f6)' : 'none',
                transition: 'all 0.2s ease',
              }}
            />
            <text x="20" y="18" textAnchor="middle" fill="#3b82f6" fontSize="16" fontWeight="bold">A</text>
            <text x="20" y="30" textAnchor="middle" fill="#60a5fa" fontSize="8">Ammeter</text>
          </g>

          {/* Voltmeter (on battery) */}
          {showVoltage && (
            <g transform="translate(-10, 80)">
              <circle cx="15" cy="20" r="15" fill="#1e3a5f" stroke="#10b981" strokeWidth="1.5" />
              <text x="15" y="24" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold">V</text>
            </g>
          )}

          {/* Moving electrons */}
          {circuitOn && showCurrent && (
            <>
              {[...Array(6)].map((_, i) => {
                const pos = getElectronPosition((electronPos + i * 16) % 100);
                return (
                  <circle
                    key={i}
                    cx={pos.x}
                    cy={pos.y}
                    r="4"
                    fill="#60a5fa"
                    style={{
                      filter: 'drop-shadow(0 0 4px #60a5fa)',
                      transition: 'cx 0.05s, cy 0.05s',
                    }}
                  />
                );
              })}
            </>
          )}

          {/* Voltage arrows */}
          {showVoltage && circuitOn && (
            <g>
              <path d="M 30,90 L 30,70" stroke="#facc15" strokeWidth="2" markerEnd="url(#arrow-yellow)" />
            </g>
          )}
        </svg>

        {/* Hover info */}
        {hoveredComponent && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.85)',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #facc15',
            fontSize: '11px',
          }}>
            {hoveredComponent === 'battery' && (
              <>
                <div style={{ color: '#facc15', fontWeight: 'bold' }}>🔋 Battery (Voltage Source)</div>
                <div style={{ color: '#94a3b8' }}>Provides electrical potential energy</div>
                <div style={{ color: '#60a5fa' }}>Measured in Volts (V)</div>
              </>
            )}
            {hoveredComponent === 'resistor' && (
              <>
                <div style={{ color: '#f97316', fontWeight: 'bold' }}>⚡ Resistor (Ω)</div>
                <div style={{ color: '#94a3b8' }}>Limits current flow</div>
                <div style={{ color: '#60a5fa' }}>Converts electrical energy to heat</div>
              </>
            )}
            {hoveredComponent === 'bulb' && (
              <>
                <div style={{ color: '#fef08a', fontWeight: 'bold' }}>💡 Light Bulb (Load)</div>
                <div style={{ color: '#94a3b8' }}>Converts electrical energy to light</div>
                <div style={{ color: '#60a5fa' }}>Resistance causes heating → light</div>
              </>
            )}
            {hoveredComponent === 'ammeter' && (
              <>
                <div style={{ color: '#60a5fa', fontWeight: 'bold' }}>📊 Ammeter</div>
                <div style={{ color: '#94a3b8' }}>Measures current (Amps)</div>
                <div style={{ color: '#60a5fa' }}>Connected in series</div>
              </>
            )}
          </div>
        )}
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

      {/* Key components */}
      <div style={{
        marginTop: '12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        fontSize: '10px',
      }}>
        <div
          style={{
            textAlign: 'center',
            padding: '8px',
            borderRadius: '6px',
            background: showVoltage ? 'rgba(250, 204, 21, 0.2)' : 'rgba(0,0,0,0.2)',
            border: `1px solid ${showVoltage ? '#facc15' : 'transparent'}`,
            cursor: 'pointer',
          }}
          onMouseEnter={() => setHoveredComponent('battery')}
          onMouseLeave={() => setHoveredComponent(null)}
        >
          <div style={{ color: showVoltage ? '#facc15' : '#94a3b8', fontWeight: 'bold' }}>⚡ Voltage</div>
          <div style={{ color: '#64748b' }}>Volts (V)</div>
          <div style={{ fontSize: '9px', color: '#475569' }}>Electrical pressure</div>
        </div>
        <div
          style={{
            textAlign: 'center',
            padding: '8px',
            borderRadius: '6px',
            background: showCurrent ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0,0,0,0.2)',
            border: `1px solid ${showCurrent ? '#3b82f6' : 'transparent'}`,
            cursor: 'pointer',
          }}
          onMouseEnter={() => setHoveredComponent('ammeter')}
          onMouseLeave={() => setHoveredComponent(null)}
        >
          <div style={{ color: showCurrent ? '#3b82f6' : '#94a3b8', fontWeight: 'bold' }}>→ Current</div>
          <div style={{ color: '#64748b' }}>Amps (A)</div>
          <div style={{ fontSize: '9px', color: '#475569' }}>Flow of electrons</div>
        </div>
        <div
          style={{
            textAlign: 'center',
            padding: '8px',
            borderRadius: '6px',
            background: showResistance ? 'rgba(249, 115, 22, 0.2)' : 'rgba(0,0,0,0.2)',
            border: `1px solid ${showResistance ? '#f97316' : 'transparent'}`,
            cursor: 'pointer',
          }}
          onMouseEnter={() => setHoveredComponent('resistor')}
          onMouseLeave={() => setHoveredComponent(null)}
        >
          <div style={{ color: showResistance ? '#f97316' : '#94a3b8', fontWeight: 'bold' }}>⏸ Resistance</div>
          <div style={{ color: '#64748b' }}>Ohms (Ω)</div>
          <div style={{ fontSize: '9px', color: '#475569' }}>Opposition to flow</div>
        </div>
      </div>
    </div>
  );
}