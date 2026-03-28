'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';

export type SimulationType = 'water-cycle' | 'circuit' | 'fraction' | 'force' | 'gravity' | 'number-line';

interface SimulationSceneProps {
  type: SimulationType;
  params?: Record<string, unknown>;
  onComplete?: (result: unknown) => void;
  showControls?: boolean;
  showLabels?: boolean;
  className?: string;
}

// Loading fallback
function LoadingFallback() {
  return (
    <div style={{
      width: '100%',
      height: '400px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
      borderRadius: '12px',
    }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
        <p>Loading simulation...</p>
      </div>
    </div>
  );
}

// Error fallback
function ErrorFallback({ error }: { error: string }) {
  return (
    <div style={{
      width: '100%',
      height: '400px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #7F1D1D 0%, #991B1B 100%)',
      borderRadius: '12px',
    }}>
      <div style={{ textAlign: 'center', color: 'white', padding: '20px' }}>
        <p style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</p>
        <p>Failed to load simulation</p>
        <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '8px' }}>{error}</p>
      </div>
    </div>
  );
}

// Dynamic imports for each simulation
const WaterCycle3D = dynamic(
  () => import('./WaterCycle3D').then((mod) => mod.default),
  { ssr: false, loading: () => <LoadingFallback /> }
);

const CircuitBuilder = dynamic(
  () => import('./CircuitBuilder').then((mod) => mod.default),
  { ssr: false, loading: () => <LoadingFallback /> }
);

const FractionVisualizer = dynamic(
  () => import('./FractionVisualizer').then((mod) => mod.default),
  { ssr: false, loading: () => <LoadingFallback /> }
);

const PhysicsLab = dynamic(
  () => import('./PhysicsLab').then((mod) => mod.default),
  { ssr: false, loading: () => <LoadingFallback /> }
);

// Number line visualization (simpler, no 3D needed)
function NumberLineVisualization({ startValue, moveValue, showControls }: {
  startValue: number;
  moveValue: number;
  showControls?: boolean;
}) {
  const [position, setPosition] = useState(startValue);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleMove = (direction: 'left' | 'right') => {
    setIsAnimating(true);
    const step = direction === 'right' ? 1 : -1;
    setPosition((prev) => prev + step);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const markers = [];
  for (let i = -10; i <= 10; i++) {
    markers.push(i);
  }

  return (
    <div style={{ width: '100%', padding: '20px 0' }}>
      {/* Number line */}
      <div style={{
        position: 'relative',
        height: '80px',
        background: 'linear-gradient(180deg, #1E1B4B 0%, #312E81 100%)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        {/* Line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '0',
          right: '0',
          height: '2px',
          background: '#6366F1',
        }} />

        {/* Markers */}
        {markers.map((num) => (
          <div
            key={num}
            style={{
              position: 'absolute',
              left: `${((num + 10) / 20) * 100}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: '2px',
              height: num % 5 === 0 ? '20px' : '10px',
              background: num % 5 === 0 ? '#A5B4FC' : '#6366F1',
              margin: '0 auto',
            }} />
            {num % 5 === 0 && (
              <span style={{
                position: 'absolute',
                top: '25px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#A5B4FC',
                fontSize: '12px',
                fontWeight: 'bold',
              }}>
                {num}
              </span>
            )}
          </div>
        ))}

        {/* Position indicator */}
        <div
          style={{
            position: 'absolute',
            left: `${((position + 10) / 20) * 100}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'left 0.3s ease-out',
          }}
        >
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: '#22C55E',
            border: '3px solid white',
            boxShadow: isAnimating ? '0 0 20px #22C55E' : '0 0 10px rgba(34, 197, 94, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
          }}>
            {position}
          </div>
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '16px',
        }}>
          <button
            onClick={() => handleMove('left')}
            style={{
              padding: '8px 24px',
              background: '#374151',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            ← Left
          </button>
          <button
            onClick={() => handleMove('right')}
            style={{
              padding: '8px 24px',
              background: '#22C55E',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Right →
          </button>
        </div>
      )}

      {/* Result display */}
      <div style={{
        textAlign: 'center',
        marginTop: '16px',
        color: '#A5B4FC',
        fontSize: '14px',
      }}>
        Start: {startValue} | Move: {moveValue > 0 ? '+' : ''}{moveValue} | Result: {startValue + moveValue}
      </div>
    </div>
  );
}

export default function SimulationScene({
  type,
  params = {},
  onComplete,
  showControls = true,
  showLabels = true,
  className,
}: SimulationSceneProps) {
  const [error, setError] = useState<string | null>(null);

  try {
    switch (type) {
      case 'water-cycle':
        return (
          <div className={className}>
            <Suspense fallback={<LoadingFallback />}>
              <WaterCycle3D
                activeStage={(params.activeStage as 'evaporation' | 'condensation' | 'precipitation' | 'collection' | 'all') || 'all'}
                onStageClick={onComplete as (stage: string) => void}
                showLabels={showLabels}
              />
            </Suspense>
          </div>
        );

      case 'circuit':
        return (
          <div className={className}>
            <Suspense fallback={<LoadingFallback />}>
              <CircuitBuilder
                onComplete={onComplete as (success: boolean) => void}
                showHints={showLabels}
              />
            </Suspense>
          </div>
        );

      case 'fraction':
        return (
          <div className={className}>
            <Suspense fallback={<LoadingFallback />}>
              <FractionVisualizer
                numerator={(params.numerator as number) || 1}
                denominator={(params.denominator as number) || 4}
                showLabels={showLabels}
                interactive={showControls}
                onSelectFraction={onComplete as (n: number, d: number) => void}
              />
            </Suspense>
          </div>
        );

      case 'force':
        return (
          <div className={className}>
            <Suspense fallback={<LoadingFallback />}>
              <PhysicsLab
                simulationType="force"
                initialForce={(params.force as number) || 10}
                initialMass={(params.mass as number) || 2}
                showControls={showControls}
                onForceChange={onComplete as (result: unknown) => void}
              />
            </Suspense>
          </div>
        );

      case 'gravity':
        return (
          <div className={className}>
            <Suspense fallback={<LoadingFallback />}>
              <PhysicsLab
                simulationType="gravity"
                initialMass={(params.mass as number) || 2}
                showControls={showControls}
              />
            </Suspense>
          </div>
        );

      case 'number-line':
        return (
          <div className={className}>
            <NumberLineVisualization
              startValue={(params.startValue as number) || 0}
              moveValue={(params.moveValue as number) || 3}
              showControls={showControls}
            />
          </div>
        );

      default:
        return <ErrorFallback error={`Unknown simulation type: ${type}`} />;
    }
  } catch (err) {
    return <ErrorFallback error={err instanceof Error ? err.message : 'Unknown error'} />;
  }
}