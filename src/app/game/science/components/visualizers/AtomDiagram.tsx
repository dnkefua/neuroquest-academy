'use client';

import { useState, useEffect } from 'react';

interface AtomDiagramProps {
  highlightStage?: string;
}

const ELEMENTS = [
  { symbol: 'H', name: 'Hydrogen', protons: 1, neutrons: 0, electrons: 1 },
  { symbol: 'He', name: 'Helium', protons: 2, neutrons: 2, electrons: 2 },
  { symbol: 'Li', name: 'Lithium', protons: 3, neutrons: 4, electrons: 3 },
  { symbol: 'C', name: 'Carbon', protons: 6, neutrons: 6, electrons: 6 },
  { symbol: 'N', name: 'Nitrogen', protons: 7, neutrons: 7, electrons: 7 },
  { symbol: 'O', name: 'Oxygen', protons: 8, neutrons: 8, electrons: 8 },
  { symbol: 'Na', name: 'Sodium', protons: 11, neutrons: 12, electrons: 11 },
  { symbol: 'Cl', name: 'Chlorine', protons: 17, neutrons: 18, electrons: 17 },
];

export default function AtomDiagram({ highlightStage }: AtomDiagramProps) {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [selectedElement, setSelectedElement] = useState(ELEMENTS[5]); // Carbon by default
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((p) => (p + 1) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Calculate electron shell configuration
  const getElectronShells = (electrons: number): number[] => {
    const shells: number[] = [];
    let remaining = electrons;
    const shellCapacity = [2, 8, 18, 32]; // 2n² rule

    for (const capacity of shellCapacity) {
      if (remaining <= 0) break;
      const inShell = Math.min(remaining, capacity);
      shells.push(inShell);
      remaining -= inShell;
    }
    return shells;
  };

  const shells = getElectronShells(selectedElement.electrons);

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
      {/* Element selector */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        marginBottom: '12px',
        justifyContent: 'center',
      }}>
        {ELEMENTS.map((el) => (
          <button
            key={el.symbol}
            onClick={() => setSelectedElement(el)}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: `1px solid ${selectedElement.symbol === el.symbol ? '#a855f7' : '#4c1d95'}`,
              background: selectedElement.symbol === el.symbol ? '#581c87' : 'transparent',
              color: selectedElement.symbol === el.symbol ? '#e9d5ff' : '#94a3b8',
              fontSize: '11px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {el.symbol}
          </button>
        ))}
      </div>

      {/* Element info */}
      <div style={{
        textAlign: 'center',
        marginBottom: '8px',
        padding: '8px',
        background: 'rgba(168, 85, 247, 0.1)',
        borderRadius: '8px',
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#e9d5ff' }}>
          {selectedElement.name}
        </div>
        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
          {selectedElement.protons} protons • {selectedElement.neutrons} neutrons • {selectedElement.electrons} electrons
        </div>
      </div>

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
          {shells.map((electronsInShell, shellIndex) => {
            const radius = 50 + shellIndex * 30;
            const rx = radius;
            const ry = radius * 0.7;
            return (
              <g key={shellIndex}>
                <ellipse
                  cx="140"
                  cy="140"
                  rx={rx}
                  ry={ry}
                  fill="none"
                  stroke={showShells ? '#a855f7' : '#4c1d95'}
                  strokeWidth="1.5"
                  strokeDasharray="5,5"
                  opacity={showShells ? 0.6 : 0.3}
                  transform={`rotate(${animationPhase + shellIndex * 30}, 140, 140)`}
                />
                {/* Electrons in this shell */}
                {showElectrons && [...Array(electronsInShell)].map((_, eIndex) => {
                  const angle = (animationPhase + eIndex * (360 / electronsInShell) + shellIndex * 60) * Math.PI / 180;
                  const cx = 140 + rx * Math.cos(angle);
                  const cy = 140 + ry * Math.sin(angle);
                  return (
                    <g key={eIndex}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r="6"
                        fill="#60a5fa"
                        style={{
                          filter: 'drop-shadow(0 0 6px #60a5fa)',
                          opacity: hoveredPart === 'electron' ? 1 : 0.9,
                        }}
                        onMouseEnter={() => setHoveredPart('electron')}
                        onMouseLeave={() => setHoveredPart(null)}
                      />
                      <text
                        x={cx}
                        y={cy + 4}
                        textAnchor="middle"
                        fill="white"
                        fontSize="8"
                        fontWeight="bold"
                      >
                        e⁻
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Nucleus */}
          <g
            style={{
              filter: hoveredPart === 'nucleus' ? 'drop-shadow(0 0 15px #ef4444)' : 'drop-shadow(0 0 8px #ef4444)',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setHoveredPart('nucleus')}
            onMouseLeave={() => setHoveredPart(null)}
          >
            {/* Protons */}
            {[...Array(Math.min(selectedElement.protons, 8))].map((_, i) => {
              const angle = (i / selectedElement.protons) * 360 * Math.PI / 180;
              const cx = 140 + 15 * Math.cos(angle);
              const cy = 140 + 15 * Math.sin(angle);
              return (
                <circle
                  key={`p-${i}`}
                  cx={cx}
                  cy={cy}
                  r="10"
                  fill="#ef4444"
                  stroke="#fca5a5"
                  strokeWidth="1"
                />
              );
            })}
            {/* Neutrons */}
            {[...Array(Math.min(selectedElement.neutrons, 8))].map((_, i) => {
              const angle = ((i + 0.5) / selectedElement.neutrons) * 360 * Math.PI / 180;
              const cx = 140 + 12 * Math.cos(angle);
              const cy = 140 + 12 * Math.sin(angle);
              return (
                <circle
                  key={`n-${i}`}
                  cx={cx}
                  cy={cy}
                  r="9"
                  fill="#fbbf24"
                  stroke="#fcd34d"
                  strokeWidth="1"
                />
              );
            })}
            {/* Center text if small */}
            {selectedElement.protons <= 4 && (
              <text
                x="140"
                y="144"
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
              >
                {selectedElement.symbol}
              </text>
            )}
          </g>
        </svg>

        {/* Hover info */}
        {hoveredPart && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.85)',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #a855f7',
          }}>
            {hoveredPart === 'nucleus' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#fca5a5', fontWeight: 'bold', fontSize: '12px' }}>Nucleus</div>
                <div style={{ color: '#94a3b8', fontSize: '10px' }}>
                  {selectedElement.protons} protons (+) • {selectedElement.neutrons} neutrons (0)
                </div>
              </div>
            )}
            {hoveredPart === 'electron' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#93c5fd', fontWeight: 'bold', fontSize: '12px' }}>Electrons</div>
                <div style={{ color: '#94a3b8', fontSize: '10px' }}>
                  {selectedElement.electrons} electrons (-) in {shells.length} shell{shells.length > 1 ? 's' : ''}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Shell configuration */}
      <div style={{
        marginTop: '8px',
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        flexWrap: 'wrap',
      }}>
        {shells.map((count, index) => (
          <div
            key={index}
            style={{
              padding: '4px 10px',
              background: 'rgba(168, 85, 247, 0.2)',
              borderRadius: '12px',
              border: '1px solid #a855f7',
            }}
          >
            <span style={{ color: '#e9d5ff', fontSize: '11px' }}>
              Shell {index + 1}: <span style={{ fontWeight: 'bold', color: '#93c5fd' }}>{count}e⁻</span>
            </span>
          </div>
        ))}
      </div>

      {/* Key */}
      <div style={{
        marginTop: '12px',
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        fontSize: '11px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#ef4444', border: '1px solid #fca5a5' }} />
          <span style={{ color: '#fca5a5' }}>Proton (+)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#fbbf24', border: '1px solid #fcd34d' }} />
          <span style={{ color: '#fcd34d' }}>Neutron (0)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#60a5fa', border: '1px solid #93c5fd' }} />
          <span style={{ color: '#93c5fd' }}>Electron (-)</span>
        </div>
      </div>
    </div>
  );
}