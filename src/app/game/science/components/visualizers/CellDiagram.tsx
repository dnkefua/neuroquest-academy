'use client';

interface CellDiagramProps {
  highlightStage?: string;
}

// Cell organelles with positions for animated display
const ORGANELLES = [
  { id: 'nucleus', name: 'Nucleus', emoji: '🔵', description: 'Controls the cell, contains DNA', x: 50, y: 45 },
  { id: 'membrane', name: 'Cell Membrane', emoji: '🧱', description: 'Controls what enters/exits', x: 50, y: 5 },
  { id: 'cytoplasm', name: 'Cytoplasm', emoji: '💧', description: 'Gel-like fluid inside cell', x: 20, y: 50 },
  { id: 'mitochondria', name: 'Mitochondria', emoji: '⚡', description: 'Powerhouse - makes energy (ATP)', x: 75, y: 35 },
  { id: 'ribosome', name: 'Ribosomes', emoji: '🔹', description: 'Makes proteins', x: 30, y: 70 },
  { id: 'er', name: 'Endoplasmic Reticulum', emoji: '〰️', description: 'Transport system', x: 65, y: 60 },
  { id: 'golgi', name: 'Golgi Apparatus', emoji: '📦', description: 'Packages proteins', x: 80, y: 70 },
  { id: 'vacuole', name: 'Vacuole', emoji: '🫧', description: 'Storage container', x: 25, y: 30 },
];

export default function CellDiagram({ highlightStage }: CellDiagramProps) {
  const isHighlighted = (id: string) => {
    if (!highlightStage) return false;
    return highlightStage.toLowerCase().includes(id.toLowerCase());
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
      {/* Cell visualization */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '280px',
        background: 'radial-gradient(ellipse at center, #2d4a3e 0%, #1a2f25 70%)',
        borderRadius: '50%',
        border: '3px solid #4ade80',
        boxShadow: 'inset 0 0 30px rgba(74, 222, 128, 0.2)',
      }}>
        {/* Organelle labels */}
        {ORGANELLES.map((org) => (
          <div
            key={org.id}
            style={{
              position: 'absolute',
              left: `${org.x}%`,
              top: `${org.y}%`,
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{
              fontSize: '24px',
              filter: isHighlighted(org.id) ? 'drop-shadow(0 0 8px #4ade80)' : 'none',
              transform: isHighlighted(org.id) ? 'scale(1.3)' : 'scale(1)',
            }}>
              {org.emoji}
            </div>
            {isHighlighted(org.id) && (
              <div style={{
                fontSize: '10px',
                color: '#4ade80',
                whiteSpace: 'nowrap',
                textShadow: '0 0 4px #000',
                marginTop: '2px',
              }}>
                {org.name}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        marginTop: '12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '6px',
        fontSize: '11px',
        color: '#94a3b8',
      }}>
        {ORGANELLES.slice(0, 4).map((org) => (
          <div key={org.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>{org.emoji}</span>
            <span style={{ color: isHighlighted(org.id) ? '#4ade80' : '#94a3b8' }}>
              {org.name}
            </span>
          </div>
        ))}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '6px',
        fontSize: '11px',
        color: '#94a3b8',
      }}>
        {ORGANELLES.slice(4).map((org) => (
          <div key={org.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>{org.emoji}</span>
            <span style={{ color: isHighlighted(org.id) ? '#4ade80' : '#94a3b8' }}>
              {org.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}