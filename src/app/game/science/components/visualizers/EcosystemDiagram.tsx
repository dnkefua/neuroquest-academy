'use client';

interface EcosystemDiagramProps {
  highlightStage?: string;
}

// Food chain levels
const FOOD_CHAIN = [
  { level: 'producers', name: 'Producers', emoji: '🌿', description: 'Plants make food via photosynthesis', color: '#22c55e' },
  { level: 'primary', name: 'Primary Consumers', emoji: '🐛', description: 'Herbivores eat plants', color: '#84cc16' },
  { level: 'secondary', name: 'Secondary Consumers', emoji: '🐸', description: 'Carnivores eat herbivores', color: '#eab308' },
  { level: 'tertiary', name: 'Tertiary Consumers', emoji: '🦅', description: 'Top predators', color: '#f97316' },
  { level: 'decomposers', name: 'Decomposers', emoji: '🍄', description: 'Break down dead matter', color: '#a855f7' },
];

export default function EcosystemDiagram({ highlightStage }: EcosystemDiagramProps) {
  const isHighlighted = (level: string) => {
    if (!highlightStage) return false;
    return highlightStage.toLowerCase().includes(level.toLowerCase()) ||
           highlightStage.toLowerCase().includes('food') ||
           highlightStage.toLowerCase().includes('chain');
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',
      background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(34, 197, 94, 0.3)',
    }}>
      {/* Food chain visualization */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '12px',
      }}>
        {/* Energy flow arrow */}
        <div style={{
          textAlign: 'center',
          color: '#fbbf24',
          fontSize: '12px',
          marginBottom: '8px',
        }}>
          ☀️ Energy Flow →
        </div>

        {/* Trophic levels */}
        {FOOD_CHAIN.map((level, index) => (
          <div
            key={level.level}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px',
              borderRadius: '8px',
              background: isHighlighted(level.level)
                ? `rgba(${level.color === '#22c55e' ? '34, 197, 94' : level.color === '#84cc16' ? '132, 204, 22' : level.color === '#eab308' ? '234, 179, 8' : level.color === '#f97316' ? '249, 115, 22' : '168, 85, 247'}, 0.3)`
                : 'rgba(0, 0, 0, 0.2)',
              border: `2px solid ${isHighlighted(level.level) ? level.color : 'transparent'}`,
              transition: 'all 0.3s ease',
              transform: isHighlighted(level.level) ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <div style={{
              fontSize: '28px',
              filter: isHighlighted(level.level) ? `drop-shadow(0 0 8px ${level.color})` : 'none',
            }}>
              {level.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                color: isHighlighted(level.level) ? level.color : '#94a3b8',
                fontWeight: 'bold',
                fontSize: '13px',
              }}>
                {level.name}
              </div>
              <div style={{
                color: '#64748b',
                fontSize: '10px',
              }}>
                {level.description}
              </div>
            </div>
            {index < FOOD_CHAIN.length - 1 && (
              <div style={{
                position: 'absolute',
                right: '20px',
                color: '#fbbf24',
                fontSize: '16px',
              }}>
                ↑
              </div>
            )}
          </div>
        ))}

        {/* Decomposers loop back */}
        <div style={{
          textAlign: 'center',
          color: '#a855f7',
          fontSize: '11px',
          marginTop: '4px',
        }}>
          🔄 Decomposers return nutrients to soil → Producers
        </div>
      </div>

      {/* Legend */}
      <div style={{
        marginTop: '12px',
        padding: '10px',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        fontSize: '10px',
        color: '#94a3b8',
        textAlign: 'center',
      }}>
        Only ~10% of energy transfers to the next level
      </div>
    </div>
  );
}