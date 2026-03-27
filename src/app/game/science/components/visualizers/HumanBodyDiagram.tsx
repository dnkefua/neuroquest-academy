'use client';

interface HumanBodyDiagramProps {
  highlightStage?: string;
}

// Body systems
const BODY_SYSTEMS = [
  { id: 'circulatory', name: 'Circulatory', emoji: '❤️', description: 'Heart pumps blood', x: 25, y: 30 },
  { id: 'respiratory', name: 'Respiratory', emoji: '🫁', description: 'Lungs exchange gases', x: 75, y: 30 },
  { id: 'nervous', name: 'Nervous', emoji: '🧠', description: 'Brain controls body', x: 50, y: 15 },
  { id: 'digestive', name: 'Digestive', emoji: '🍽️', description: 'Stomach breaks down food', x: 50, y: 55 },
  { id: 'skeletal', name: 'Skeletal', emoji: '🦴', description: 'Bones support body', x: 20, y: 70 },
  { id: 'muscular', name: 'Muscular', emoji: '💪', description: 'Muscles enable movement', x: 80, y: 70 },
];

export default function HumanBodyDiagram({ highlightStage }: HumanBodyDiagramProps) {
  const isHighlighted = (id: string) => {
    if (!highlightStage) return false;
    return highlightStage.toLowerCase().includes(id.toLowerCase());
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #1e1b4b 100%)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(236, 72, 153, 0.3)',
    }}>
      {/* Body outline */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '280px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width="200" height="260" viewBox="0 0 200 260">
          {/* Body outline */}
          <ellipse cx="100" cy="35" rx="30" ry="35" fill="#374151" stroke="#ec4899" strokeWidth="2" />
          <rect x="70" y="70" width="60" height="100" fill="#374151" stroke="#ec4899" strokeWidth="2" rx="10" />
          <rect x="50" y="170" width="25" height="80" fill="#374151" stroke="#ec4899" strokeWidth="2" rx="5" />
          <rect x="125" y="170" width="25" height="80" fill="#374151" stroke="#ec4899" strokeWidth="2" rx="5" />
          <rect x="65" y="170" width="30" height="15" fill="#374151" stroke="#ec4899" strokeWidth="2" rx="3" />
          <rect x="105" y="170" width="30" height="15" fill="#374151" stroke="#ec4899" strokeWidth="2" rx="3" />

          {/* Heart */}
          <text x="85" y="100" fontSize="20" style={{ filter: isHighlighted('circulatory') ? 'drop-shadow(0 0 6px #ef4444)' : 'none' }}>❤️</text>
          {/* Lungs */}
          <text x="120" y="95" fontSize="16">🫁</text>
          {/* Brain */}
          <text x="88" y="40" fontSize="18" style={{ filter: isHighlighted('nervous') ? 'drop-shadow(0 0 6px #8b5cf6)' : 'none' }}>🧠</text>
          {/* Stomach */}
          <text x="90" y="130" fontSize="18" style={{ filter: isHighlighted('digestive') ? 'drop-shadow(0 0 6px #f59e0b)' : 'none' }}>🍽️</text>
        </svg>

        {/* System labels */}
        {BODY_SYSTEMS.map((sys) => (
          <div
            key={sys.id}
            style={{
              position: 'absolute',
              left: `${sys.x}%`,
              top: `${sys.y}%`,
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <div style={{
              fontSize: '24px',
              filter: isHighlighted(sys.id) ? `drop-shadow(0 0 8px #ec4899)` : 'none',
              transform: isHighlighted(sys.id) ? 'scale(1.2)' : 'scale(1)',
              transition: 'all 0.3s ease',
            }}>
              {sys.emoji}
            </div>
            {isHighlighted(sys.id) && (
              <div style={{
                fontSize: '10px',
                color: '#ec4899',
                whiteSpace: 'nowrap',
                textShadow: '0 0 4px #000',
              }}>
                {sys.name}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Systems legend */}
      <div style={{
        marginTop: '12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        fontSize: '10px',
        color: '#94a3b8',
      }}>
        {BODY_SYSTEMS.map((sys) => (
          <div key={sys.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>{sys.emoji}</span>
            <span style={{ color: isHighlighted(sys.id) ? '#ec4899' : '#94a3b8' }}>
              {sys.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}