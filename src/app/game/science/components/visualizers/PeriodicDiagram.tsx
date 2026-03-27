'use client';

import { useState } from 'react';

interface PeriodicDiagramProps {
  highlightStage?: string;
}

// Simplified periodic table - key elements
const ELEMENTS = [
  { symbol: 'H', name: 'Hydrogen', number: 1, group: 'nonmetal', x: 0, y: 0 },
  { symbol: 'He', name: 'Helium', number: 2, group: 'noble', x: 17, y: 0 },
  { symbol: 'Li', name: 'Lithium', number: 3, group: 'alkali', x: 0, y: 1 },
  { symbol: 'C', name: 'Carbon', number: 6, group: 'nonmetal', x: 2, y: 2 },
  { symbol: 'N', name: 'Nitrogen', number: 7, group: 'nonmetal', x: 3, y: 2 },
  { symbol: 'O', name: 'Oxygen', number: 8, group: 'nonmetal', x: 4, y: 2 },
  { symbol: 'Na', name: 'Sodium', number: 11, group: 'alkali', x: 0, y: 3 },
  { symbol: 'Mg', name: 'Magnesium', number: 12, group: 'alkaline', x: 1, y: 3 },
  { symbol: 'Fe', name: 'Iron', number: 26, group: 'transition', x: 6, y: 4 },
  { symbol: 'Cu', name: 'Copper', number: 29, group: 'transition', x: 9, y: 4 },
  { symbol: 'Au', name: 'Gold', number: 79, group: 'transition', x: 11, y: 6 },
];

const GROUP_COLORS: Record<string, string> = {
  alkali: '#ef4444',
  alkaline: '#f97316',
  transition: '#facc15',
  nonmetal: '#22c55e',
  noble: '#3b82f6',
};

export default function PeriodicDiagram({ highlightStage }: PeriodicDiagramProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const isHighlighted = (symbol: string) => {
    if (!highlightStage) return false;
    return highlightStage.toLowerCase().includes(symbol.toLowerCase());
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #1e293b 100%)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(168, 85, 247, 0.3)',
    }}>
      {/* Mini periodic table */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '4px',
        marginBottom: '12px',
      }}>
        {ELEMENTS.map((el) => (
          <div
            key={el.symbol}
            onClick={() => setSelected(el.symbol)}
            style={{
              padding: '8px 4px',
              borderRadius: '4px',
              background: isHighlighted(el.symbol) || selected === el.symbol
                ? GROUP_COLORS[el.group]
                : 'rgba(0,0,0,0.3)',
              border: `2px solid ${GROUP_COLORS[el.group]}`,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              transform: isHighlighted(el.symbol) || selected === el.symbol ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>{el.symbol}</div>
            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.7)' }}>{el.number}</div>
          </div>
        ))}
      </div>

      {/* Selected element info */}
      {selected && (
        <div style={{
          padding: '12px',
          background: 'rgba(168, 85, 247, 0.1)',
          borderRadius: '8px',
          marginBottom: '12px',
        }}>
          {(() => {
            const el = ELEMENTS.find((e) => e.symbol === selected);
            if (!el) return null;
            return (
              <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: GROUP_COLORS[el.group] }}>
                  {el.name} ({el.symbol})
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Atomic Number: {el.number} | Group: {el.group}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Legend */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        fontSize: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#ef4444' }} />
          <span style={{ color: '#94a3b8' }}>Alkali Metals</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#facc15' }} />
          <span style={{ color: '#94a3b8' }}>Transition Metals</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#22c55e' }} />
          <span style={{ color: '#94a3b8' }}>Nonmetals</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#3b82f6' }} />
          <span style={{ color: '#94a3b8' }}>Noble Gases</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#f97316' }} />
          <span style={{ color: '#94a3b8' }}>Alkaline Earth</span>
        </div>
      </div>

      {/* Key concept */}
      <div style={{
        marginTop: '12px',
        padding: '10px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '11px',
        color: '#94a3b8',
      }}>
        Elements arranged by atomic number & electron configuration
      </div>
    </div>
  );
}