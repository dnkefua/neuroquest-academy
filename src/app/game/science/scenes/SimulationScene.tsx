'use client';

import { useScienceStore } from '../store/gameStore';

export default function ScienceSimulationScene() {
  const currentQuestion = useScienceStore((s) => s.currentQuestion);
  const questions = useScienceStore((s) => s.questions);
  const nextQuestion = useScienceStore((s) => s.nextQuestion);
  const setScene = useScienceStore((s) => s.setScene);

  const question = questions[currentQuestion];
  const simulationType = question?.clue?.simulationType || 'water-cycle';

  // For now, show a placeholder simulation scene
  // In the future, this would use the SimulationScene component with proper params
  const handleComplete = () => {
    const isLastQuestion = currentQuestion >= questions.length - 1;
    if (isLastQuestion) {
      setScene('VICTORY');
    } else {
      nextQuestion();
      setScene('QUIZ');
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '20px',
      }}>
        <h1 style={{
          color: '#A5B4FC',
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '8px',
        }}>
          🔬 Interactive Simulation
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '14px' }}>
          {question?.clue?.title || 'Explore the concept visually'}
        </p>
      </div>

      {/* Simulation placeholder */}
      <div style={{
        width: '100%',
        maxWidth: '800px',
        height: '400px',
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(165, 180, 252, 0.2)',
      }}>
        <div style={{ textAlign: 'center', color: '#A5B4FC' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {simulationType === 'water-cycle' && 'Water Cycle Simulation'}
            {simulationType === 'circuit' && 'Circuit Builder'}
            {simulationType === 'fraction' && 'Fraction Visualizer'}
            {simulationType === 'force' && 'Force & Motion Lab'}
            {simulationType === 'gravity' && 'Gravity Simulation'}
            {simulationType === 'number-line' && 'Number Line'}
          </p>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '8px' }}>
            3D simulation will render here
          </p>
        </div>
      </div>

      {/* Description */}
      {question?.clue?.explanation && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: 'rgba(30, 27, 75, 0.8)',
          borderRadius: '8px',
          maxWidth: '800px',
          width: '100%',
        }}>
          <p style={{ color: '#A5B4FC', fontSize: '14px', lineHeight: '1.6' }}>
            {question.clue.explanation}
          </p>
        </div>
      )}

      {/* Continue button */}
      <button
        onClick={handleComplete}
        style={{
          marginTop: '24px',
          padding: '12px 32px',
          background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(34, 197, 94, 0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)';
        }}
      >
        Continue to Quiz →
      </button>

      {/* Progress indicator */}
      <div style={{
        marginTop: '20px',
        display: 'flex',
        gap: '8px',
      }}>
        {questions.map((_, i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: i === currentQuestion ? '#22C55E' : 'rgba(165, 180, 252, 0.3)',
            }}
          />
        ))}
      </div>
    </div>
  );
}