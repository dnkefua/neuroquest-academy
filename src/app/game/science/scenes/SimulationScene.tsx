'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useScienceStore } from '../store/gameStore';
import { gameTTS, useTTSCleanup, stripParens } from '../../shared/tts';
import { gameAudio } from '../../shared/audio';

// Dynamic imports for 3D simulations (SSR-safe)
const WaterCycle3D = dynamic(
  () => import('@/components/simulations/WaterCycle3D').then(m => m.default),
  { ssr: false, loading: () => <LoadingFallback /> }
);

const CircuitBuilder = dynamic(
  () => import('@/components/simulations/CircuitBuilder').then(m => m.default),
  { ssr: false, loading: () => <LoadingFallback /> }
);

const FractionVisualizer = dynamic(
  () => import('@/components/simulations/FractionVisualizer').then(m => m.default),
  { ssr: false, loading: () => <LoadingFallback /> }
);

const PhysicsLab = dynamic(
  () => import('@/components/simulations/PhysicsLab').then(m => m.default),
  { ssr: false, loading: () => <LoadingFallback /> }
);

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
      <div style={{ textAlign: 'center', color: '#A5B4FC' }}>
        <div style={{
          width: '32px', height: '32px',
          border: '4px solid #6366F1', borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 12px',
        }} />
        <p>Loading simulation...</p>
      </div>
    </div>
  );
}

type SimulationType = 'water-cycle' | 'circuit' | 'fraction' | 'force' | 'gravity' | 'number-line';

const SIMULATION_TITLES: Record<SimulationType, string> = {
  'water-cycle': 'Water Cycle Simulation',
  'circuit': 'Circuit Builder',
  'fraction': 'Fraction Visualizer',
  'force': 'Force & Motion Lab',
  'gravity': 'Gravity Simulation',
  'number-line': 'Number Line',
};

const SIMULATION_EMOJIS: Record<SimulationType, string> = {
  'water-cycle': '💧',
  'circuit': '⚡',
  'fraction': '🔢',
  'force': '🚀',
  'gravity': '🍎',
  'number-line': '📏',
};

const SIMULATION_NARRATION: Record<SimulationType, string> = {
  'water-cycle': 'Explore the water cycle! Click on different stages to learn about evaporation, condensation, precipitation, and collection.',
  'circuit': 'Build a circuit! Click the switch to complete the circuit and light up the bulb.',
  'fraction': 'Visualize fractions! See how parts make up a whole. Click blocks to change the numerator.',
  'force': 'Experiment with force and motion! Adjust the force, mass, and friction sliders to see how they affect movement.',
  'gravity': 'Watch gravity in action! Drop objects and see how they accelerate at 9.8 meters per second squared.',
  'number-line': 'Use the number line to visualize addition and subtraction. Move left or right to see the result.',
};

export default function ScienceSimulationScene() {
  const currentQuestion = useScienceStore(s => s.currentQuestion);
  const questions = useScienceStore(s => s.questions);
  const setScene = useScienceStore(s => s.setScene);
  const currentQuestId = useScienceStore(s => s.currentQuestId);
  const currentGrade = useScienceStore(s => s.currentGrade);

  const [ttsOn, setTtsOn] = useState(gameTTS.enabled);
  const [simComplete, setSimComplete] = useState(false);
  const [waterStage, setWaterStage] = useState<'evaporation' | 'condensation' | 'precipitation' | 'collection' | 'all'>('all');

  useTTSCleanup();

  const question = questions[currentQuestion];
  const simulationType: SimulationType = question?.clue?.simulationType || 'water-cycle';

  const questTitle = useMemo(() => {
    return currentQuestId?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Science Quest';
  }, [currentQuestId]);

  // Narrate simulation instructions when it loads
  useEffect(() => {
    if (ttsOn && question) {
      const narration = SIMULATION_NARRATION[simulationType];
      gameTTS.speak(`${question.clue?.title || 'Simulation'}. ${narration}`);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleTTS() {
    setTtsOn(gameTTS.toggle());
  }

  function handleBack() {
    gameAudio.playClick();
    gameTTS.stop();
    setScene('CLOUD_TEACHING');
  }

  function handleContinue() {
    gameAudio.playTransition();
    gameTTS.stop();
    const isLastQuestion = currentQuestion >= questions.length - 1;
    if (isLastQuestion) {
      setScene('VICTORY');
    } else {
      setScene('QUIZ');
    }
  }

  function handleSimulationComplete(result?: unknown) {
    setSimComplete(true);
    if (ttsOn) {
      gameTTS.speak('Great job! You completed the simulation. Ready for the quiz?');
    }
  }

  function handleWaterStageClick(stage: string) {
    setWaterStage(stage as typeof waterStage);
    if (ttsOn) {
      gameTTS.speak(`You selected ${stage}. Watch how ${stage} works in the water cycle.`);
    }
  }

  const renderSimulation = () => {
    switch (simulationType) {
      case 'water-cycle':
        return (
          <WaterCycle3D
            activeStage={waterStage}
            onStageClick={handleWaterStageClick}
            autoPlay={true}
            showLabels={true}
          />
        );

      case 'circuit':
        return (
          <CircuitBuilder
            onComplete={(success: boolean) => {
              if (success) handleSimulationComplete({ circuitComplete: true });
            }}
            showHints={true}
          />
        );

      case 'fraction':
        return (
          <FractionVisualizer
            numerator={1}
            denominator={4}
            showLabels={true}
            interactive={true}
            onSelectFraction={(n: number, d: number) => {
              if (ttsOn) {
                gameTTS.speak(`${n} out of ${d} parts selected. That is ${Math.round((n / d) * 100)} percent.`);
              }
            }}
          />
        );

      case 'force':
        return (
          <PhysicsLab
            simulationType="force"
            showControls={true}
            initialForce={10}
            initialMass={2}
            onForceChange={(force: number) => {
              if (ttsOn) {
                gameTTS.speak(`Force set to ${force} Newtons. Watch how the object moves.`);
              }
            }}
          />
        );

      case 'gravity':
        return (
          <PhysicsLab
            simulationType="gravity"
            showControls={true}
            initialMass={2}
          />
        );

      case 'number-line':
        return <NumberLineVisualization startValue={0} moveValue={3} showControls={true} />;

      default:
        return <ErrorFallback error={`Unknown simulation type: ${simulationType}`} />;
    }
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'auto',
    }}>
      {/* Animated background particles */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
      }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${15 + i * 15}%`,
            left: `${10 + i * 16}%`,
            fontSize: '24px',
            opacity: 0.08,
            animation: `float${i % 3} ${6 + i}s ease-in-out infinite`,
          }}>
            {SIMULATION_EMOJIS[simulationType]}
          </div>
        ))}
      </div>

      {/* Audio controls */}
      <div style={{
        position: 'absolute', top: '16px', right: '16px',
        display: 'flex', gap: '8px', zIndex: 20,
      }}>
        <button
          onClick={toggleTTS}
          style={{
            width: '40px', height: '40px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', cursor: 'pointer',
            background: 'rgba(0,0,0,0.5)',
            border: `1px solid ${ttsOn ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.15)'}`,
            color: ttsOn ? '#38BDF8' : 'rgba(255,255,255,0.3)',
          }}
        >
          {ttsOn ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Header */}
      <div style={{
        textAlign: 'center', marginBottom: '20px', zIndex: 10, position: 'relative',
      }}>
        <div style={{ fontSize: '36px', marginBottom: '8px' }}>
          {SIMULATION_EMOJIS[simulationType]}
        </div>
        <h1 style={{
          color: '#A5B4FC',
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '4px',
        }}>
          {SIMULATION_TITLES[simulationType]}
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '14px' }}>
          {question?.clue?.title || 'Explore the concept visually'}
        </p>
        <p style={{ color: '#64748B', fontSize: '12px', marginTop: '4px' }}>
          {questTitle} • Grade {currentGrade}
        </p>
      </div>

      {/* Simulation container */}
      <div style={{
        width: '100%',
        maxWidth: '800px',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(165, 180, 252, 0.2)',
        boxShadow: '0 0 40px rgba(99, 102, 241, 0.15)',
        zIndex: 10,
        position: 'relative',
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
      }}>
        <Suspense fallback={<LoadingFallback />}>
          {renderSimulation()}
        </Suspense>
      </div>

      {/* Description / Instructions */}
      <div style={{
        marginTop: '16px',
        padding: '16px',
        background: 'rgba(30, 27, 75, 0.8)',
        borderRadius: '12px',
        maxWidth: '800px',
        width: '100%',
        zIndex: 10,
        border: '1px solid rgba(165, 180, 252, 0.1)',
      }}>
        <p style={{ color: '#A5B4FC', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
          {SIMULATION_NARRATION[simulationType]}
        </p>
        {question?.clue?.explanation && (
          <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: '1.5', marginTop: '12px', marginBottom: 0 }}>
            💡 {question.clue.explanation}
          </p>
        )}
      </div>

      {/* Navigation buttons */}
      <div style={{
        display: 'flex', gap: '16px', marginTop: '24px', zIndex: 10,
      }}>
        <button
          onClick={handleBack}
          style={{
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            color: '#94A3B8',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
            e.currentTarget.style.color = '#E2E8F0';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = '#94A3B8';
          }}
        >
          ← Back to Teaching
        </button>

        <button
          onClick={handleContinue}
          style={{
            padding: '12px 32px',
            background: simComplete
              ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
              : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: simComplete
              ? '0 4px 12px rgba(34, 197, 94, 0.3)'
              : '0 4px 12px rgba(99, 102, 241, 0.3)',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {simComplete ? 'Continue to Quiz ✓' : 'Continue to Quiz →'}
        </button>
      </div>

      {/* Progress indicator */}
      <div style={{
        marginTop: '24px',
        display: 'flex',
        gap: '8px',
        zIndex: 10,
      }}>
        {questions.map((_, i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: i < currentQuestion
                ? '#22C55E'
                : i === currentQuestion
                  ? '#6366F1'
                  : 'rgba(165, 180, 252, 0.3)',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes float0 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes float1 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-8deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(12deg); }
        }
      `}</style>
    </div>
  );
}

// Number line visualization (2D, no 3D needed)
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
    setPosition(prev => prev + step);
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
            boxShadow: isAnimating
              ? '0 0 20px #22C55E'
              : '0 0 10px rgba(34, 197, 94, 0.5)',
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
