'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScienceExplainerProps {
  concept: 'water-cycle' | 'circuit' | 'force' | 'gravity' | 'states-of-matter';
  currentStage?: number;
  onStageChange?: (stage: number) => void;
  autoPlay?: boolean;
  showLabels?: boolean;
}

// Water cycle animation
function WaterCycleAnimation({ currentStage, showLabels }: { currentStage: number; showLabels: boolean }) {
  const stages = ['evaporation', 'condensation', 'precipitation', 'collection'];

  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%' }}>
        {/* Background sky */}
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E3A5F" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#skyGradient)" />

        {/* Sun */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: currentStage >= 0 ? 1 : 0,
            scale: currentStage >= 0 ? 1 : 0
          }}
          transition={{ duration: 0.5 }}
        >
          <circle cx="80" cy="60" r="30" fill="#F59E0B" />
          {[...Array(8)].map((_, i) => (
            <motion.line
              key={i}
              x1="80"
              y1={60 - 40}
              x2="80"
              y2={60 - 50}
              stroke="#FCD34D"
              strokeWidth="3"
              transform={`rotate(${i * 45}, 80, 60)`}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentStage === 0 ? [0.5, 1, 0.5] : 0.3 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          ))}
        </motion.g>

        {/* Cloud */}
        <motion.g
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: currentStage >= 1 ? 1 : currentStage >= 0 ? 0.5 : 0,
            y: currentStage >= 1 ? 0 : -20
          }}
          transition={{ duration: 0.5 }}
        >
          <ellipse cx="200" cy="80" rx="60" ry="30" fill="#E5E7EB" />
          <ellipse cx="240" cy="70" rx="40" ry="25" fill="#E5E7EB" />
          <ellipse cx="160" cy="70" rx="40" ry="25" fill="#E5E7EB" />

          {/* Rain drops */}
          {currentStage === 2 && (
            <>
              {[...Array(10)].map((_, i) => (
                <motion.line
                  key={i}
                  x1={160 + i * 20}
                  y1={100}
                  x2={160 + i * 20}
                  y2={140}
                  stroke="#3B82F6"
                  strokeWidth="2"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 0], y: [0, 40, 40] }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                />
              ))}
            </>
          )}
        </motion.g>

        {/* Water body */}
        <motion.ellipse
          cx="200"
          cy="250"
          rx="180"
          ry="40"
          fill="url(#waterGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: currentStage >= 3 ? 1 : 0.7 }}
        />

        {/* Evaporation arrows */}
        {currentStage === 0 && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.path
                key={i}
                d={`M ${120 + i * 30} 220 Q ${120 + i * 30} 180 ${100 + i * 40} 100`}
                fill="none"
                stroke="#60A5FA"
                strokeWidth="2"
                strokeDasharray="5 5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: i * 0.2 }}
              />
            ))}
          </>
        )}

        {/* Labels */}
        {showLabels && (
          <>
            <motion.text
              x="80"
              y="110"
              textAnchor="middle"
              fill="#FCD34D"
              fontSize="12"
              initial={{ opacity: 0 }}
              animate={{ opacity: currentStage === 0 ? 1 : 0.3 }}
            >
              Evaporation
            </motion.text>
            <motion.text
              x="200"
              y="130"
              textAnchor="middle"
              fill="#E5E7EB"
              fontSize="12"
              initial={{ opacity: 0 }}
              animate={{ opacity: currentStage === 1 ? 1 : 0.3 }}
            >
              Condensation
            </motion.text>
            <motion.text
              x="300"
              y="160"
              textAnchor="middle"
              fill="#3B82F6"
              fontSize="12"
              initial={{ opacity: 0 }}
              animate={{ opacity: currentStage === 2 ? 1 : 0.3 }}
            >
              Precipitation
            </motion.text>
            <motion.text
              x="200"
              y="280"
              textAnchor="middle"
              fill="#0EA5E9"
              fontSize="12"
              initial={{ opacity: 0 }}
              animate={{ opacity: currentStage === 3 ? 1 : 0.3 }}
            >
              Collection
            </motion.text>
          </>
        )}
      </svg>
    </div>
  );
}

// Circuit animation
function CircuitAnimation({ currentStage, showLabels }: { currentStage: number; showLabels: boolean }) {
  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%' }}>
        {/* Background */}
        <rect width="400" height="300" fill="#1E1B4B" />

        {/* Circuit path */}
        <motion.path
          d="M 80 150 L 120 150 L 120 80 L 280 80 L 280 150 L 320 150"
          fill="none"
          stroke="#6366F1"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: currentStage >= 1 ? 1 : 0.3 }}
          transition={{ duration: 1 }}
        />
        <motion.path
          d="M 80 150 L 80 220 L 320 220 L 320 150"
          fill="none"
          stroke="#6366F1"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: currentStage >= 2 ? 1 : 0.3 }}
          transition={{ duration: 1 }}
        />

        {/* Battery */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: currentStage >= 0 ? 1 : 0 }}
        >
          <rect x="60" y="130" width="40" height="40" rx="4" fill="#374151" />
          <rect x="76" y="125" width="8" height="5" fill="#22C55E" />
          <text x="80" y="155" textAnchor="middle" fill="white" fontSize="10">+−</text>
          {showLabels && (
            <text x="80" y="185" textAnchor="middle" fill="#A5B4FC" fontSize="12">Battery</text>
          )}
        </motion.g>

        {/* Bulb */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: currentStage >= 1 ? 1 : 0.5 }}
        >
          <circle cx="280" cy="150" r="20" fill={currentStage >= 2 ? "#FEF3C7" : "#64748B"} />
          {currentStage >= 2 && (
            <motion.circle
              cx="280"
              cy="150"
              r="30"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="2"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          {showLabels && (
            <text x="280" y="185" textAnchor="middle" fill="#A5B4FC" fontSize="12">Bulb</text>
          )}
        </motion.g>

        {/* Switch */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: currentStage >= 1 ? 1 : 0 }}
        >
          <rect x="180" y="70" width="40" height="20" rx="2" fill="#374151" />
          <motion.rect
            x="200"
            y="75"
            width="20"
            height="4"
            fill={currentStage >= 2 ? "#22C55E" : "#64748B"}
            initial={{ rotate: currentStage >= 2 ? 0 : -30, originX: 'left' }}
            animate={{ rotate: currentStage >= 2 ? 0 : -30 }}
          />
          {showLabels && (
            <text x="200" y="105" textAnchor="middle" fill="#A5B4FC" fontSize="12">Switch</text>
          )}
        </motion.g>

        {/* Current flow animation */}
        {currentStage >= 2 && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.circle
                key={i}
                cx="80"
                cy="150"
                r="4"
                fill="#22C55E"
                initial={{ offset: i * 0.2 }}
                animate={{
                  offset: [i * 0.2, i * 0.2 + 1],
                }}
                style={{
                  offsetPath: 'path("M 80 150 L 120 150 L 120 80 L 280 80 L 280 150 L 320 150 L 320 220 L 80 220 L 80 150")',
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            ))}
          </>
        )}

        {/* Stage label */}
        <text x="200" y="270" textAnchor="middle" fill="white" fontSize="14">
          {currentStage === 0 && '🔋 Battery provides energy'}
          {currentStage === 1 && '🔌 Circuit path connects components'}
          {currentStage === 2 && '💡 Switch closed - current flows!'}
          {currentStage === 3 && '✨ Circuit complete!'}
        </text>
      </svg>
    </div>
  );
}

// Force/motion animation
function ForceAnimation({ currentStage, showLabels }: { currentStage: number; showLabels: boolean }) {
  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%' }}>
        <rect width="400" height="300" fill="#1E1B4B" />

        {/* Ground */}
        <rect x="0" y="250" width="400" height="50" fill="#374151" />

        {/* Object */}
        <motion.rect
          x="50"
          y="200"
          width="50"
          height="50"
          fill="#3B82F6"
          initial={{ x: 0 }}
          animate={{ x: currentStage >= 2 ? 200 : 0 }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
        <text x="75" y="230" textAnchor="middle" fill="white" fontSize="12">Box</text>

        {/* Force arrow */}
        {currentStage >= 1 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <line x1="30" y1="225" x2="10" y2="225" stroke="#EF4444" strokeWidth="3" />
            <polygon points="30,225 20,220 20,230" fill="#EF4444" />
            <text x="20" y="215" textAnchor="middle" fill="#EF4444" fontSize="14">F = 10N</text>
          </motion.g>
        )}

        {/* Velocity arrow */}
        {currentStage >= 2 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <line x1="110" y1="225" x2="180" y2="225" stroke="#22C55E" strokeWidth="3" />
            <polygon points="180,225 170,220 170,230" fill="#22C55E" />
            <text x="145" y="215" textAnchor="middle" fill="#22C55E" fontSize="12">v</text>
          </motion.g>
        )}

        {/* Formula */}
        {currentStage >= 3 && (
          <motion.text
            x="200"
            y="50"
            textAnchor="middle"
            fill="white"
            fontSize="20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            F = ma → a = F/m
          </motion.text>
        )}
      </svg>
    </div>
  );
}

// Gravity animation
function GravityAnimation({ currentStage, showLabels }: { currentStage: number; showLabels: boolean }) {
  const objectY = currentStage >= 1 ? 200 : 50;

  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%' }}>
        <rect width="400" height="300" fill="#1E1B4B" />

        {/* Height markers */}
        {[...Array(5)].map((_, i) => (
          <g key={i}>
            <line x1="350" y1={50 + i * 50} x2="360" y2={50 + i * 50} stroke="#6366F1" strokeWidth="2" />
            <text x="370" y={55 + i * 50} fill="#A5B4FC" fontSize="12">{5 - i}m</text>
          </g>
        ))}

        {/* Falling object */}
        <motion.circle
          cx="200"
          cy={objectY}
          r="20"
          fill="#EF4444"
          initial={{ y: 0 }}
          animate={{ y: currentStage >= 1 ? 150 : 0 }}
          transition={{ duration: 1, ease: 'easeIn' }}
        />

        {/* Gravity arrow */}
        {currentStage >= 1 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <line x1="200" y1={objectY + 30} x2="200" y2={objectY + 60} stroke="#22C55E" strokeWidth="3" />
            <polygon points="200,70 195,60 205,60" fill="#22C55E" />
            <text x="210" y={objectY + 50} fill="#22C55E" fontSize="12">g = 9.8 m/s²</text>
          </motion.g>
        )}

        {/* Ground */}
        <rect x="0" y="250" width="340" height="50" fill="#374151" />

        {/* Formula */}
        {currentStage >= 2 && (
          <motion.text
            x="100"
            y="30"
            textAnchor="middle"
            fill="white"
            fontSize="16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            v = gt = 9.8t m/s
          </motion.text>
        )}
      </svg>
    </div>
  );
}

export default function ScienceExplainer({
  concept,
  currentStage = 0,
  onStageChange,
  autoPlay = true,
  showLabels = true,
}: ScienceExplainerProps) {
  const [stage, setStage] = useState(currentStage);

  // Get total stages for this concept
  const totalStages = useMemo(() => {
    switch (concept) {
      case 'water-cycle': return 4;
      case 'circuit': return 3;
      case 'force': return 4;
      case 'gravity': return 3;
      case 'states-of-matter': return 3;
      default: return 4;
    }
  }, [concept]);

  // Get narration for each stage
  const narrations = useMemo(() => {
    switch (concept) {
      case 'water-cycle':
        return [
          'The sun heats water, causing it to evaporate into vapor',
          'Water vapor cools and forms clouds',
          'Clouds become heavy and release rain or snow',
          'Water collects in rivers, lakes, and oceans',
        ];
      case 'circuit':
        return [
          'A battery provides electrical energy',
          'The circuit path connects all components',
          'When the switch is closed, current flows and the bulb lights up',
        ];
      case 'force':
        return [
          'A force is applied to the object',
          'The object starts to accelerate',
          'It moves according to F = ma',
          'The relationship between force, mass, and acceleration',
        ];
      case 'gravity':
        return [
          'Objects fall due to gravity',
          'Acceleration due to gravity is 9.8 m/s² on Earth',
          'Velocity increases as the object falls',
        ];
      default:
        return [];
    }
  }, [concept]);

  // Auto-advance through stages
  useEffect(() => {
    if (autoPlay && stage < totalStages - 1) {
      const timer = setTimeout(() => {
        setStage((prev) => {
          const next = prev + 1;
          onStageChange?.(next);
          return next;
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [autoPlay, stage, totalStages, onStageChange]);

  // Sync with external currentStage
  useEffect(() => {
    setStage(currentStage);
  }, [currentStage]);

  // Render the appropriate visualization
  const renderVisualization = () => {
    switch (concept) {
      case 'water-cycle':
        return <WaterCycleAnimation currentStage={stage} showLabels={showLabels} />;
      case 'circuit':
        return <CircuitAnimation currentStage={stage} showLabels={showLabels} />;
      case 'force':
        return <ForceAnimation currentStage={stage} showLabels={showLabels} />;
      case 'gravity':
        return <GravityAnimation currentStage={stage} showLabels={showLabels} />;
      default:
        return <div>Unknown concept</div>;
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {renderVisualization()}

      {/* Narration */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '12px 16px',
          borderRadius: 8,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={stage}
      >
        <p style={{ color: 'white', margin: 0, fontSize: 14 }}>
          {narrations[stage]}
        </p>
      </motion.div>

      {/* Stage indicator */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        display: 'flex',
        gap: 4,
      }}>
        {Array.from({ length: totalStages }).map((_, i) => (
          <motion.div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: i <= stage ? '#22C55E' : 'rgba(255, 255, 255, 0.2)',
            }}
            animate={{ scale: i === stage ? 1.3 : 1 }}
          />
        ))}
      </div>
    </div>
  );
}