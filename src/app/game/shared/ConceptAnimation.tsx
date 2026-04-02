'use client';
/**
 * ConceptAnimation — interactive animated educational illustrations for quiz cards.
 * Enhanced with grade 8 appropriate visualizations for neurodiverse learners.
 * Each science/math/english/social/socialSkills topic has interactive SVG animations.
 * Designed for neurodiverse visual learners.
 */
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export type Subject = 'science' | 'math' | 'english' | 'social' | 'socialSkills';

const TOPIC_MAP: [string[], string][] = [
  // Science
  [['water cycle', 'evaporation', 'condensation'],      'water-cycle'],
  [['photosynthesis', 'respiration', 'leaf', 'plant'],  'photosynthesis'],
  [['atom', 'element', 'periodic', 'chemical bond'],    'atom'],
  [['molecule', 'compound', 'H2O', 'oxygen', 'hydrogen'], 'molecule'],
  [['electric', 'circuit', 'current', 'voltage'],       'circuit'],
  [['wave', 'wavelength', 'frequency', 'amplitude'],    'wave'],
  [['sound', 'vibration', 'decibel', 'pitch'],          'sound-wave'],
  [['light', 'refraction', 'reflection', 'spectrum'],   'light-wave'],
  [['force', 'motion', 'newton', 'speed', 'velocity'],  'forces'],
  [['gravity', 'mass', 'weight', 'acceleration'],       'gravity'],
  [['ecosystem', 'food chain', 'ecology'],              'ecosystem'],
  [['energy', 'pyramid', 'trophic', 'producer'],        'energy-pyramid'],
  [['cell', 'dna', 'genetic', 'reproduction'],          'cell'],
  [['mitosis', 'division', 'chromosome'],               'cell-division'],
  [['chemical reaction', 'organic', 'thermodynamic'],   'reaction'],
  // Math
  [['fraction', 'decimal', 'ratio', 'percent'],         'fraction'],
  [['linear', 'equation', 'slope', 'intercept', 'y='],  'linear-graph'],
  [['coordinate', 'plot', 'x-axis', 'y-axis'],          'coordinate-plane'],
  [['exponent', 'power', 'squared', 'cubed'],           'exponents'],
  [['area', 'perimeter', 'volume', 'surface'],          'area-calc'],
  [['graph', 'function', 'slope'],                      'graph'],
  [['pythagorean', 'geometry', 'triangle'],             'geometry'],
  [['statistic', 'probability', 'distribution'],        'statistics'],
  [['integer', 'negative', 'number line'],              'number-line'],
  // English
  [['argument', 'rebuttal', 'claim', 'persuasive'],     'argument'],
  [['narrative', 'story', 'character', 'voice'],        'narrative'],
  [['essay', 'analysis', 'comparative', 'literature'],  'essay'],
  // Social Studies
  [['history', 'ancient', 'civilization', 'timeline'],  'timeline'],
  [['culture', 'tradition', 'society', 'exchange'],     'culture'],
  [['geography', 'map', 'region', 'migration'],         'geography'],
  // Social Skills
  [['emotion', 'feeling', 'happy', 'sad', 'angry'],     'emotions'],
  [['social', 'scenario', 'choice', 'consequence'],     'social-choice'],
  [['empathy', 'understand', 'perspective'],            'empathy'],
  [['communication', 'speak', 'listen', 'dialogue'],    'communication'],
  [['leadership', 'team', 'cooperation', 'group'],      'leadership'],
];

function getAnimId(questTitle: string): string {
  const lower = questTitle.toLowerCase();
  for (const [keys, id] of TOPIC_MAP) {
    if (keys.some(k => lower.includes(k))) return id;
  }
  return 'default';
}

// -----------------------------------------------------------------------------
// Science Animations
// -----------------------------------------------------------------------------

function WaterCycleAnim({ c }: { c: string }) {
  const [step, setStep] = useState(0);
  const steps = ['evaporation', 'condensation', 'precipitation', 'collection'];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-900/30 to-blue-950/30 rounded-lg p-3">
      <svg viewBox="0 0 300 88" className="w-full h-full">
        <rect width="300" height="88" fill="transparent" rx="10"/>
        {/* Ocean */}
        <rect x="0" y="70" width="160" height="18" fill="#1e88e5" opacity="0.6" rx="4"/>
        <text x="18" y="83" fontSize="7" fill="white" fontWeight="700">?? Ocean</text>

        {/* Mountain */}
        <polygon points="220,70 258,22 296,70" fill="#7B6B52" opacity="0.65"/>
        <polygon points="258,22 270,38 246,38" fill="white" opacity="0.85"/>

        {/* Cloud */}
        <motion.g animate={{ x: [-4, 4, -4] }} transition={{ duration: 4, repeat: Infinity }}>
          <ellipse cx="152" cy="16" rx="28" ry="13" fill="white" opacity="0.95"/>
          <ellipse cx="170" cy="20" rx="20" ry="11" fill="white" opacity="0.95"/>
          <ellipse cx="136" cy="21" rx="17" ry="10" fill="white" opacity="0.95"/>
        </motion.g>

        {/* Evaporation droplets */}
        {step === 0 && [22, 50, 78, 110, 138].map((x, i) => (
          <motion.circle key={`ev${i}`} cx={x} cy={0} r={3} fill="#38BDF8"
            animate={{ cy: [66, 24], opacity: [0.9, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.38 }}/>
        ))}

        {/* Rain */}
        {step === 2 && [140, 150, 162, 173, 182].map((x, i) => (
          <motion.line key={`r${i}`} stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round"
            x1={x} y1={0} x2={x - 2} y2={0}
            animate={{ y1: [33, 68], y2: [42, 77], opacity: [1, 0.2] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}/>
        ))}

        {/* Labels */}
        <text x="70" y="52" fontSize="7" fill="#38BDF8" fontWeight="700">Evaporation ?</text>
        <text x="162" y="56" fontSize="7" fill="#38BDF8" fontWeight="700">Precipitation ?</text>
      </svg>
      <div className="flex gap-1 mt-1">
        {steps.map((s, i) => (
          <button key={s} onClick={() => setStep(i)}
            className={`w-2 h-2 rounded-full transition-all ${step >= i ? 'bg-blue-400 scale-125' : 'bg-gray-600'}`} />
        ))}
      </div>
    </div>
  );
}

// Photosynthesis animation with molecular interactions
function PhotosynthesisAnim({ c }: { c: string }) {
  const [stage, setStage] = useState(0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-green-900/30 to-green-950/30 rounded-lg p-2">
      <svg viewBox="0 0 280 80" className="w-full h-full">
        {/* Sun */}
        <motion.circle cx="30" cy="15" r="12" fill="#FCD34D"
          animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }} />
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line key={i} x1="30" y1="0" x2="30" y2="-20" stroke="#FCD34D" strokeWidth="2"
              transform={`rotate(${angle}, 30, 15)`} opacity="0.6" />
          ))}
        </motion.g>

        {/* Leaf */}
        <motion.path d="M 140 40 Q 180 20 240 40 Q 180 60 140 40" fill="#22C55E" opacity="0.8"
          animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 3, repeat: Infinity }} />
        <path d="M 140 40 L 230 40" stroke="#166534" strokeWidth="2" />
        {[160, 180, 200, 220].map((x, i) => (
          <path key={i} d={`M ${x} 32 Q ${x + 8} 40 ${x} 48`} stroke="#166534" strokeWidth="1.5" fill="none" />
        ))}

        {/* CO2 molecules */}
        {stage >= 0 && [50, 65, 80].map((y, i) => (
          <motion.g key={`co2-${i}`} initial={{ x: 60, y }} animate={{ x: 130, y: y + 5 }}
            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity, repeatDelay: 1 }}>
            <circle cx="0" cy="0" r="5" fill="#6B7280" opacity="0.7" />
            <text x="0" y="4" fontSize="6" textAnchor="middle" fill="white" fontWeight="bold">C</text>
            <circle cx="-4" cy="4" r="3" fill="#EF4444" />
            <circle cx="4" cy="4" r="3" fill="#EF4444" />
          </motion.g>
        ))}

        {/* Water droplets */}
        {stage >= 1 && [150, 160, 170].map((x, i) => (
          <motion.circle key={`h2o-${i}`} cx={x} cy="75" r="3" fill="#3B82F6"
            animate={{ cy: [75, 50, 45] }} transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }} />
        ))}

        {/* O2 molecules released */}
        {stage >= 2 && [145, 155, 165, 175].map((x, i) => (
          <motion.g key={`o2-${i}`} initial={{ x, y: 40 }} animate={{ x: x - 20, y: 15 }}
            transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity, repeatDelay: 0.5 }}>
            <circle cx="0" cy="0" r="4" fill="#EF4444" opacity="0.8" />
            <circle cx="6" cy="0" r="4" fill="#EF4444" opacity="0.8" />
            <text x="3" y="4" fontSize="5" textAnchor="middle" fill="white" fontWeight="bold">O2</text>
          </motion.g>
        ))}

        {/* Glucose */}
        {stage >= 3 && (
          <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
            <rect x="200" y="55" width="35" height="18" fill="#F59E0B" rx="3" />
            <text x="218" y="68" fontSize="7" textAnchor="middle" fill="white" fontWeight="bold">C6H12O6</text>
          </motion.g>
        )}

        {/* Labels */}
        <text x="15" y="78" fontSize="6" fill="#FCD34D" fontWeight="bold">?? Light</text>
        <text x="55" y="78" fontSize="6" fill="#6B7280" fontWeight="bold">CO2</text>
        <text x="100" y="78" fontSize="6" fill="#3B82F6" fontWeight="bold">H2O</text>
        <text x="155" y="78" fontSize="6" fill="#EF4444" fontWeight="bold">O2</text>
        <text x="210" y="78" fontSize="6" fill="#F59E0B" fontWeight="bold">?? Sugar</text>
      </svg>
      <div className="flex gap-1 mt-1">
        {[0, 1, 2, 3].map((s) => (
          <button key={s} onClick={() => setStage(s)}
            className={`w-2 h-2 rounded-full transition-all ${stage >= s ? 'bg-green-400 scale-125' : 'bg-gray-600'}`} />
        ))}
      </div>
    </div>
  );
}

// Atom structure with clickable electron shells
function AtomAnim({ c }: { c: string }) {
  const [selectedShell, setSelectedShell] = useState<number | null>(null);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900/30 to-indigo-950/30 rounded-lg p-2">
      <svg viewBox="0 0 200 80" className="w-full h-full">
        {/* Nucleus */}
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
          <circle cx="100" cy="40" r="10" fill="#EF4444" opacity="0.8" />
          <circle cx="96" cy="38" r="4" fill="#FCD34D" />
          <circle cx="104" cy="42" r="4" fill="#EF4444" />
          <text x="100" y="43" fontSize="6" textAnchor="middle" fill="white" fontWeight="bold">Nucleus</text>
        </motion.g>

        {/* Electron shells */}
        {[15, 25, 35].map((radius, shellIndex) => (
          <motion.ellipse key={shellIndex} cx="100" cy="40" rx={radius} ry={radius * 0.4}
            fill="none" stroke={selectedShell === shellIndex ? c : '#6366F1'} strokeWidth="1.5" opacity="0.5"
            animate={{ rotate: shellIndex % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 8 + shellIndex * 4, repeat: Infinity, ease: "linear" }}
            onClick={() => setSelectedShell(shellIndex)} style={{ cursor: 'pointer' }} />
        ))}

        {/* Electrons */}
        {[
          { shell: 0, count: 2, radius: 15, speed: 4 },
          { shell: 1, count: 4, radius: 25, speed: 6 },
          { shell: 2, count: 4, radius: 35, speed: 8 },
        ].map((shell) =>
          Array.from({ length: shell.count }).map((_, i) => (
            <motion.circle key={`e-${shell.shell}-${i}`} r="3" fill="#3B82F6"
              animate={{
                x: [0, shell.radius, 0, -shell.radius, 0],
                y: [shell.radius * 0.4, 0, -shell.radius * 0.4, 0, shell.radius * 0.4],
              }}
              transition={{ duration: shell.speed, repeat: Infinity, delay: i * 0.5, ease: "linear" }} />
          ))
        )}

        {/* Label */}
        <text x="100" y="75" fontSize="6" textAnchor="middle" fill="#A5B4FC" fontWeight="bold">
          ?? Click shells to highlight
        </text>
      </svg>
    </div>
  );
}

// Molecule visualization (H2O example)
function MoleculeAnim({ c }: { c: string }) {
  const atoms = [
    { label: 'H', x: 60, y: 50, color: '#FFFFFF' },
    { label: 'O', x: 100, y: 50, color: '#EF4444', size: 18 },
    { label: 'H', x: 140, y: 50, color: '#FFFFFF' },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-cyan-900/30 to-cyan-950/30 rounded-lg p-2">
      <svg viewBox="0 0 200 80" className="w-full h-full">
        {/* Bonds */}
        <motion.line x1="70" y1="50" x2="90" y2="50" stroke="#94A3B8" strokeWidth="4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
        <motion.line x1="110" y1="50" x2="130" y2="50" stroke="#94A3B8" strokeWidth="4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />

        {/* Atoms */}
        {atoms.map((atom, i) => (
          <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.2 }}>
            <circle cx={atom.x} cy={atom.y} r={atom.size || 14} fill={atom.color} opacity="0.9" />
            <text x={atom.x} y={atom.y + 5} fontSize="10" textAnchor="middle" fill="#1E293B" fontWeight="bold">{atom.label}</text>
          </motion.g>
        ))}

        {/* Vibration */}
        <motion.g animate={{ x: [-2, 2, -2], y: [-1, 1, -1] }} transition={{ duration: 0.3, repeat: Infinity }}>
          <text x="100" y="25" fontSize="8" textAnchor="middle" fill="#67E8F9" fontWeight="bold">H2O</text>
        </motion.g>
      </svg>
    </div>
  );
}

// Circuit with interactive switch
function CircuitAnim({ c }: { c: string }) {
  const [isClosed, setIsClosed] = useState(false);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900/30 to-gray-950/30 rounded-lg p-2 cursor-pointer"
      onClick={() => setIsClosed(!isClosed)}>
      <svg viewBox="0 0 200 80" className="w-full h-full">
        {/* Battery */}
        <motion.rect x="20" y="25" width="25" height="30" fill="#6B7280" stroke="#9CA3AF" strokeWidth="2" rx="2"
          animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
        <text x="32" y="45" fontSize="10" textAnchor="middle" fill="white" fontWeight="bold">?</text>

        {/* Wires */}
        <polyline points="45,40 45,20 100,20 100,40" fill="none" stroke="#9CA3AF" strokeWidth="2.5" />
        <polyline points="100,50 100,60 160,60 160,40" fill="none" stroke="#9CA3AF" strokeWidth="2.5" />

        {/* Switch */}
        <motion.line x1="70" y1="20" x2="90" y2="20" stroke="#22C55E" strokeWidth="3"
          animate={{ rotate: isClosed ? 0 : -30, originX: 0.9, originY: 0.5 }} />
        <circle cx="70" cy="20" r="3" fill="#9CA3AF" />
        <circle cx="90" cy="20" r="3" fill="#9CA3AF" />

        {/* Light bulb */}
        <motion.g x="140" y="25">
          <circle cx="160" cy="40" r="18" fill={isClosed ? '#FCD34D' : '#4B5563'} stroke="#9CA3AF" strokeWidth="2"
            animate={{ opacity: isClosed ? [0.6, 1, 0.6] : 0.5 }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }} />
          {isClosed && (
            <>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <motion.line key={angle} x1="160" y1="40" x2="160" y2="22" stroke="#FCD34D" strokeWidth="2"
                  transform={`rotate(${angle}, 160, 40)`} opacity="0.6"
                  animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 0.6, repeat: Infinity }} />
              ))}
            </>
          )}
        </motion.g>

        {/* Label */}
        <text x="100" y="75" fontSize="7" textAnchor="middle" fill="#9CA3AF" fontWeight="bold">
          {isClosed ? '?? Circuit CLOSED' : '?? Click to close'}
        </text>
      </svg>
    </div>
  );
}

// Wave animation (sine, square, saw)
function WaveAnim({ c }: { c: string }) {
  const [waveType, setWaveType] = useState<'sine' | 'square' | 'saw'>('sine');

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-900/30 to-purple-950/30 rounded-lg p-2">
      <svg viewBox="0 0 200 60" className="w-full h-full">
        {/* Grid */}
        {[20, 60, 100, 140, 180].map((x) => (
          <line key={`v${x}`} x1={x} y1="10" x2={x} y2="50" stroke="#4C1D95" strokeWidth="0.5" />
        ))}
        {[20, 30, 40, 50].map((y) => (
          <line key={`h${y}`} x1="10" y1={y} x2="190" y2={y} stroke="#4C1D95" strokeWidth="0.5" />
        ))}

        {/* Wave */}
        <motion.path
          d={waveType === 'sine' ? "M 10 30 Q 30 10, 50 30 T 90 30 T 130 30 T 170 30 T 190 30" :
             waveType === 'square' ? "M 10 20 L 50 20 L 50 40 L 90 40 L 90 20 L 130 20 L 130 40 L 170 40 L 170 20 L 190 20" :
             "M 10 50 L 30 10 L 50 50 L 70 10 L 90 50 L 110 10 L 130 50 L 150 10 L 170 50 L 190 10"}
          fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"
          animate={waveType === 'sine' ? { d: [
            "M 10 30 Q 30 10, 50 30 T 90 30 T 130 30 T 170 30 T 190 30",
            "M 10 30 Q 30 50, 50 30 T 90 30 T 130 30 T 170 30 T 190 30",
            "M 10 30 Q 30 10, 50 30 T 90 30 T 130 30 T 170 30 T 190 30",
          ]} : undefined}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Labels */}
        <text x="100" y="58" fontSize="7" textAnchor="middle" fill="#C4B5FD" fontWeight="bold">
          ?? {waveType === 'sine' ? 'Sine' : waveType === 'square' ? 'Square' : 'Saw'} Wave
        </text>
      </svg>
      <div className="flex gap-1 mt-1">
        {['sine', 'square', 'saw'].map((type) => (
          <button key={type} onClick={() => setWaveType(type as any)}
            className={`px-2 py-0.5 text-[8px] rounded transition-all ${waveType === type ? 'bg-purple-400 text-white' : 'bg-gray-700 text-gray-300'}`}>
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}

// Forces/motion with interactive push
function ForcesAnim({ c }: { c: string }) {
  const [forceApplied, setForceApplied] = useState(false);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-orange-900/30 to-orange-950/30 rounded-lg p-2 cursor-pointer"
      onClick={() => setForceApplied(!forceApplied)}>
      <svg viewBox="0 0 200 60" className="w-full h-full">
        {/* Ground */}
        <rect x="0" y="50" width="200" height="10" fill="#4B5563" opacity="0.5" />

        {/* Box */}
        <motion.rect x="40" y="30" width="30" height="20" fill={c} rx="3" opacity="0.8"
          animate={{ x: forceApplied ? [40, 40, 80, 120, 120] : 40 }}
          transition={{ duration: 2, times: [0, 0.3, 0.7, 1, 1] }} />

        {/* Force arrow */}
        {forceApplied && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <line x1="75" y1="40" x2="130" y2="40" stroke="#22C55E" strokeWidth="3" />
            <polygon points="130,40 120,35 120,45" fill="#22C55E" />
            <text x="100" y="35" fontSize="8" fill="#22C55E" fontWeight="bold">F = ma</text>
          </motion.g>
        )}

        {/* Friction */}
        {forceApplied && (
          <motion.line x1="70" y1="50" x2="45" y2="50" stroke="#EF4444" strokeWidth="2"
            initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} />
        )}

        {/* Label */}
        <text x="100" y="58" fontSize="7" textAnchor="middle" fill="#FED7AA" fontWeight="bold">
          {forceApplied ? '? Force Applied!' : '?? Click to push'}
        </text>
      </svg>
    </div>
  );
}

// Ecosystem/food chain pyramid
function EcosystemAnim({ c }: { c: string }) {
  const trophicLevels = [
    { emoji: '??', label: 'Producer', color: '#22C55E' },
    { emoji: '??', label: 'Primary', color: '#84CC16' },
    { emoji: '??', label: 'Secondary', color: '#F59E0B' },
    { emoji: '??', label: 'Tertiary', color: '#EF4444' },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-green-900/30 to-green-950/30 rounded-lg p-2">
      <svg viewBox="0 0 200 60" className="w-full h-full">
        {/* Energy pyramid */}
        <polygon points="100,10 160,50 40,50" fill={c} fillOpacity="0.15" stroke={c} strokeWidth="1.5" />

        {/* Trophic levels */}
        {trophicLevels.map((level, i) => {
          const y = 45 - i * 10;
          const width = 100 - i * 20;
          return (
            <motion.g key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}>
              <rect x={100 - width/2} y={y - 8} width={width} height="10" fill={level.color} opacity="0.3" rx="2" />
              <text x="100" y={y} fontSize="9" textAnchor="middle" fill={level.color} fontWeight="bold">
                {level.emoji} {level.label}
              </text>
            </motion.g>
          );
        })}
      </svg>
      <p className="text-[8px] text-green-200 mt-0.5">?? Energy flows upward</p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Math Animations
// -----------------------------------------------------------------------------

// Fraction pie with interactive shading
function FractionAnim({ c }: { c: string }) {
  const [parts, setParts] = useState(4);
  const [shaded, setShaded] = useState(1);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-amber-900/30 to-amber-950/30 rounded-lg p-2">
      <svg viewBox="0 0 80 80" className="w-full h-full" style={{ maxWidth: '80px' }}>
        <circle cx="40" cy="40" r="35" fill="none" stroke={c} strokeWidth="2" />
        {Array.from({ length: parts }).map((_, i) => {
          const angle = (i + 1) * (360 / parts);
          const rad = (angle - 90) * Math.PI / 180;
          return (
            <motion.path key={i}
              d={`M 40 40 L ${40 + 35 * Math.cos(rad)} ${40 + 35 * Math.sin(rad)} A 35 35 0 0 1 ${40 + 35 * Math.cos((angle - 360 / parts - 90) * Math.PI / 180)} ${40 + 35 * Math.sin((angle - 360 / parts - 90) * Math.PI / 180)} Z`}
              fill={i < shaded ? c : 'rgba(120, 53, 15, 0.2)'} stroke={c} strokeWidth="1"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
              onClick={() => setShaded(i + 1)} style={{ cursor: 'pointer' }} />
          );
        })}
      </svg>
      <p className="text-[9px] text-amber-200 mt-1 font-bold">{shaded}/{parts} = {(shaded/parts*100).toFixed(0)}%</p>
    </div>
  );
}

// Linear graph with adjustable slope
function LinearGraphAnim({ c }: { c: string }) {
  const [slope, setSlope] = useState(1);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-emerald-900/30 to-emerald-950/30 rounded-lg p-2">
      <svg viewBox="0 0 200 70" className="w-full h-full">
        {/* Grid */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={20 + i * 20} y1="10" x2={20 + i * 20} y2="50" stroke="#064E3B" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`h${i}`} x1="10" y1={10 + i * 10} x2="190" y2={10 + i * 10} stroke="#064E3B" strokeWidth="0.5" />
        ))}

        {/* Axes */}
        <line x1="20" y1="30" x2="180" y2="30" stroke="#10B981" strokeWidth="2" />
        <line x1="100" y1="10" x2="100" y2="50" stroke="#10B981" strokeWidth="2" />
        <text x="185" y="33" fontSize="8" fill="#10B981" fontWeight="bold">x</text>
        <text x="105" y="14" fontSize="8" fill="#10B981" fontWeight="bold">y</text>

        {/* Line */}
        <motion.line x1="20" y1={30 - slope * 40} x2="180" y2={30 + slope * 40}
          stroke={c} strokeWidth="3" strokeLinecap="round"
          animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />

        {/* Equation */}
        <text x="100" y="65" fontSize="8" textAnchor="middle" fill="#6EE7B7" fontWeight="bold">
          y = {slope}x
        </text>
      </svg>
      <div className="flex gap-1 mt-1">
        {[0.5, 1, 2, -1].map((s) => (
          <button key={s} onClick={() => setSlope(s)}
            className={`px-2 py-0.5 text-[8px] rounded transition-all ${slope === s ? 'bg-emerald-400 text-white' : 'bg-gray-700 text-gray-300'}`}>
            m={s}
          </button>
        ))}
      </div>
    </div>
  );
}

// Geometry with Pythagorean theorem
function GeometryAnim({ c }: { c: string }) {
  const [highlight, setHighlight] = useState<'a' | 'b' | 'c' | null>(null);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-900/30 to-blue-950/30 rounded-lg p-2">
      <svg viewBox="0 0 200 60" className="w-full h-full">
        {/* Right triangle */}
        <motion.polygon points="40,15 40,50 120,50" fill={c} fillOpacity="0.2" stroke={c} strokeWidth="2.5"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} />

        {/* Right angle marker */}
        <rect x="40" y="42" width="8" height="8" fill="none" stroke={c} strokeWidth="1.5" />

        {/* Side labels */}
        <text x="30" y="35" fontSize="9" fill={highlight === 'a' ? '#FCD34D' : '#93C5FD'} fontWeight="bold"
          onClick={() => setHighlight('a')} style={{ cursor: 'pointer' }}>a</text>
        <text x="80" y="58" fontSize="9" fill={highlight === 'b' ? '#FCD34D' : '#93C5FD'} fontWeight="bold"
          onClick={() => setHighlight('b')} style={{ cursor: 'pointer' }}>b</text>
        <text x="90" y="30" fontSize="9" fill={highlight === 'c' ? '#FCD34D' : '#93C5FD'} fontWeight="bold"
          onClick={() => setHighlight('c')} style={{ cursor: 'pointer' }}>c</text>

        {/* Formula */}
        <motion.text x="160" y="35" fontSize="8" textAnchor="middle" fill="#FDE68A" fontWeight="bold"
          animate={{ opacity: highlight ? 1 : 0.5 }}>a² + b² = c²</text>
      </svg>
      <p className="text-[8px] text-blue-200 mt-0.5">?? Click sides to highlight</p>
    </div>
  );
}

// Statistics bar chart with auto-updating data
function StatisticsAnim({ c }: { c: string }) {
  const [data, setData] = useState([30, 50, 70, 40, 60]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(data.map(() => Math.floor(Math.random() * 60) + 20));
    }, 2000);
    return () => clearInterval(interval);
  }, [data]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900/30 to-slate-950/30 rounded-lg p-2">
      <svg viewBox="0 0 200 60" className="w-full h-full">
        {/* Y-axis */}
        <line x1="20" y1="10" x2="20" y2="50" stroke="#64748B" strokeWidth="1.5" />
        <text x="12" y="15" fontSize="7" fill="#94A3B8">100</text>
        <text x="12" y="50" fontSize="7" fill="#94A3B8">0</text>

        {/* Bars */}
        {data.map((value, i) => (
          <motion.rect key={i} x={35 + i * 30} y={50 - value * 0.4} width="22" height={value * 0.4}
            fill={c} opacity="0.8" rx="2"
            initial={{ height: 0, y: 50 }} animate={{ height: value * 0.4, y: 50 - value * 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.1 }} />
        ))}

        {/* Mean line */}
        <motion.line x1="25" y1={50 - (data.reduce((a, b) => a + b, 0) / data.length) * 0.4} x2="185" y2={50 - (data.reduce((a, b) => a + b, 0) / data.length) * 0.4}
          stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />

        <text x="100" y="58" fontSize="7" textAnchor="middle" fill="#CBD5E1" fontWeight="bold">
          ?? Mean: {(data.reduce((a, b) => a + b, 0) / data.length).toFixed(0)}
        </text>
      </svg>
    </div>
  );
}

// -----------------------------------------------------------------------------
// English, Social Studies, Social Skills Animations
// -----------------------------------------------------------------------------

// Timeline with animated events
function TimelineAnim({ c }: { c: string }) {
  const events = [
    { emoji: '??', year: '3000 BCE', label: 'Ancient' },
    { emoji: '???', year: '500 BCE', label: 'Classical' },
    { emoji: '??', year: '1200', label: 'Medieval' },
    { emoji: '??', year: '1500', label: 'Explore' },
    { emoji: '??', year: '1800', label: 'Industrial' },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-amber-900/30 to-amber-950/30 rounded-lg p-2">
      <svg viewBox="0 0 200 60" className="w-full h-full">
        {/* Timeline */}
        <motion.line x1="10" y1="30" x2="190" y2="30" stroke={c} strokeWidth="3" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} />

        {/* Events */}
        {events.map((evt, i) => (
          <motion.g key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}>
            <circle cx={20 + i * 42} cy="30" r="8" fill={c} opacity="0.3" stroke={c} strokeWidth="2" />
            <text x={20 + i * 42} y="20" fontSize="10" textAnchor="middle" fill="#FCD34D">{evt.emoji}</text>
            <text x={20 + i * 42} y="50" fontSize="6" textAnchor="middle" fill="#FDE68A" fontWeight="bold">{evt.year}</text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

// Social choice scenario selector
function SocialChoiceAnim({ c }: { c: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const options = [
    { emoji: '??', text: 'Talk it out', color: '#3B82F6' },
    { emoji: '??', text: 'Compromise', color: '#22C55E' },
    { emoji: '??', text: 'Walk away', color: '#F59E0B' },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900/30 to-indigo-950/30 rounded-lg p-2">
      <div className="flex flex-col gap-1 w-full h-full justify-center">
        {options.map((opt, i) => (
          <motion.button key={i} onClick={() => setSelected(i)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all"
            style={{
              background: selected === i ? opt.color + '30' : 'rgba(255,255,255,0.05)',
              border: `2px solid ${selected === i ? opt.color : 'transparent'}`,
            }}
            animate={{ scale: selected === i ? 1.05 : 1, x: selected === i ? 4 : 0 }}
            whileHover={{ scale: 1.02 }}>
            <span className="text-lg">{opt.emoji}</span>
            <span className="text-white font-medium">{opt.text}</span>
          </motion.button>
        ))}
      </div>
      {selected !== null && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-[9px] text-indigo-200 mt-1 font-bold text-center">
          ? Good choice!
        </motion.p>
      )}
    </div>
  );
}

// Empathy perspective switcher
function EmpathyAnim({ c }: { c: string }) {
  const [perspective, setPerspective] = useState<'self' | 'other'>('self');

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-violet-900/30 to-violet-950/30 rounded-lg p-2">
      <div className="flex gap-3 items-center">
        <motion.div onClick={() => setPerspective('self')}
          className={`text-3xl cursor-pointer p-2 rounded-lg ${perspective === 'self' ? 'bg-blue-500/30 border-2 border-blue-400' : 'opacity-50'}`}
          animate={{ scale: perspective === 'self' ? 1.15 : 1 }}>??</motion.div>
        <motion.div onClick={() => setPerspective('other')}
          className={`text-3xl cursor-pointer p-2 rounded-lg ${perspective === 'other' ? 'bg-green-500/30 border-2 border-green-400' : 'opacity-50'}`}
          animate={{ scale: perspective === 'other' ? 1.15 : 1 }}>??</motion.div>
      </div>
      <p className="text-[8px] text-violet-200 mt-1 font-bold text-center">
        {perspective === 'self' ? '?? How do YOU feel?' : '?? How do THEY feel?'}
      </p>
    </div>
  );
}

// Emotions selector (expanded)
function EmotionsAnim({ c }: { c: string }) {
  const [selected, setSelected] = useState(0);
  const emotions = ['??', '??', '??', '??'];
  const labels = ['Happy', 'Sad', 'Angry', 'Calm'];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-pink-900/30 to-pink-950/30 rounded-lg">
      <div className="text-4xl mb-2">{emotions[selected]}</div>
      <div className="flex gap-2 mb-2">
        {emotions.map((emoji, i) => (
          <motion.button key={i}
            onClick={() => setSelected(i)}
            className="p-2 rounded text-2xl transition-all"
            animate={{ scale: selected === i ? 1.2 : 1 }}
            style={{
              background: selected === i ? c + '40' : 'rgba(255,255,255,0.1)',
              border: `2px solid ${selected === i ? c : 'transparent'}`,
            }}>
            {emoji}
          </motion.button>
        ))}
      </div>
      <p className="text-xs font-bold" style={{ color: c }}>{labels[selected]}</p>
    </div>
  );
}

// Communication dialogue
function CommunicationAnim({ c }: { c: string }) {
  const [showResponse, setShowResponse] = useState(false);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-900/30 to-purple-950/30 rounded-lg cursor-pointer"
      onClick={() => setShowResponse(!showResponse)}>
      <div className="flex flex-col gap-2 w-full h-full p-2 items-center justify-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-blue-500/20 rounded px-2 py-1 text-xs text-blue-200 max-w-xs text-center border border-blue-500/40">
          "Listen to me..."
        </motion.div>

        {showResponse && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-green-500/20 rounded px-2 py-1 text-xs text-green-200 max-w-xs text-center border border-green-500/40">
            "I hear you. Tell me more."
          </motion.div>
        )}

        {!showResponse && (
          <p className="text-[10px] text-gray-400 mt-1">Click to listen & respond</p>
        )}
      </div>
    </div>
  );
}

// Default animation with subject-specific emojis
function DefaultAnim({ subject, color }: { subject: Subject; color: string }) {
  const emojis: Record<Subject, string[]> = {
    science: ['??', '??', '??', '???'],
    math: ['??', '?', '?', '??'],
    english: ['??', '??', '???', '??'],
    social: ['??', '???', '??', '??'],
    socialSkills: ['??', '??', '??', '??'],
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-900/30 to-slate-950/30 rounded-lg">
      <div className="flex flex-wrap gap-2 justify-center">
        {emojis[subject].map((emoji, i) => (
          <motion.div key={i} className="text-2xl"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}>
            {emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

interface ConceptAnimationProps {
  subject: Subject;
  questTitle?: string;
  color1: string;
  color2?: string;
}

/** Main component that selects and renders the appropriate animation based on quest topic */
export default function ConceptAnimation({ subject, questTitle = '', color1, color2 }: ConceptAnimationProps) {
  const animId = getAnimId(questTitle);

  const renderAnimation = () => {
    switch (animId) {
      // Science
      case 'water-cycle': return <WaterCycleAnim c={color1} />;
      case 'atom': return <AtomAnim c={color1} />;
      case 'molecule': return <MoleculeAnim c={color1} />;
      case 'photosynthesis': return <PhotosynthesisAnim c={color1} />;
      case 'circuit': return <CircuitAnim c={color1} />;
      case 'wave': return <WaveAnim c={color1} />;
      case 'sound-wave': return <WaveAnim c={color1} />;
      case 'light-wave': return <WaveAnim c={color1} />;
      case 'forces': return <ForcesAnim c={color1} />;
      case 'gravity': return <ForcesAnim c={color1} />;
      case 'ecosystem': return <EcosystemAnim c={color1} />;
      case 'energy-pyramid': return <EcosystemAnim c={color1} />;
      case 'cell': return <AtomAnim c={color1} />;
      case 'cell-division': return <AtomAnim c={color1} />;
      case 'reaction': return <MoleculeAnim c={color1} />;
      // Math
      case 'fraction': return <FractionAnim c={color1} />;
      case 'graph': return <LinearGraphAnim c={color1} />;
      case 'linear-graph': return <LinearGraphAnim c={color1} />;
      case 'coordinate-plane': return <LinearGraphAnim c={color1} />;
      case 'geometry': return <GeometryAnim c={color1} />;
      case 'statistics': return <StatisticsAnim c={color1} />;
      case 'exponents': return <GeometryAnim c={color1} />;
      case 'area-calc': return <GeometryAnim c={color1} />;
      // English
      case 'argument': return <TimelineAnim c={color1} />;
      case 'narrative': return <TimelineAnim c={color1} />;
      case 'essay': return <TimelineAnim c={color1} />;
      // Social
      case 'timeline': return <TimelineAnim c={color1} />;
      case 'culture': return <TimelineAnim c={color1} />;
      case 'geography': return <TimelineAnim c={color1} />;
      // Social Skills
      case 'social-choice': return <SocialChoiceAnim c={color1} />;
      case 'empathy': return <EmpathyAnim c={color1} />;
      case 'emotions': return <EmotionsAnim c={color1} />;
      case 'communication': return <CommunicationAnim c={color1} />;
      case 'leadership': return <SocialChoiceAnim c={color1} />;
      default: return <DefaultAnim subject={subject} color={color1} />;
    }
  };

  return (
    <div className="w-full h-20 rounded-2xl overflow-hidden shadow-lg">
      {renderAnimation()}
    </div>
  );
}
