'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface FractionVisualizerProps {
  numerator: number;
  denominator: number;
  showLabels?: boolean;
  interactive?: boolean;
  onSelectFraction?: (numerator: number, denominator: number) => void;
}

// Individual block for fraction visualization
function FractionBlock({
  position,
  isHighlighted,
  color,
  onClick,
  index,
}: {
  position: [number, number, number];
  isHighlighted: boolean;
  color: string;
  onClick?: () => void;
  index: number;
}) {
  const blockRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (blockRef.current && isHighlighted) {
      blockRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <RoundedBox
        ref={blockRef}
        args={[0.8, 0.8, 0.8]}
        radius={0.05}
        smoothness={4}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHighlighted ? 0.3 : hovered ? 0.15 : 0}
          metalness={0.1}
          roughness={0.4}
        />
      </RoundedBox>

      {/* Index label */}
      <Text
        position={[0, 0, 0.45]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {index + 1}
      </Text>

      {/* Highlight glow */}
      {isHighlighted && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </mesh>
      )}
    </group>
  );
}

// Main fraction visualization
function FractionScene({
  numerator,
  denominator,
  showLabels,
  interactive,
  onSelectFraction,
}: {
  numerator: number;
  denominator: number;
  showLabels: boolean;
  interactive: boolean;
  onSelectFraction?: (n: number, d: number) => void;
}) {
  const blocksPerRow = Math.ceil(Math.sqrt(denominator));
  const spacing = 1.2;

  const blocks = useMemo(() => {
    const result = [];
    for (let i = 0; i < denominator; i++) {
      const row = Math.floor(i / blocksPerRow);
      const col = i % blocksPerRow;
      result.push({
        position: [
          (col - (Math.min(blocksPerRow, denominator - row * blocksPerRow) - 1) / 2) * spacing,
          0,
          row * spacing * 0.8
        ] as [number, number, number],
        isHighlighted: i < numerator,
      });
    }
    return result;
  }, [denominator, numerator, blocksPerRow]);

  // Color gradient from highlighted to dimmed
  const highlightedColor = '#22C55E';
  const dimmedColor = '#64748B';

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-5, 5, 5]} intensity={0.4} color="#6366F1" />

      {/* Fraction blocks */}
      <group position={[0, 0, -blocks.length * 0.2]}>
        {blocks.map((block, i) => (
          <FractionBlock
            key={i}
            position={block.position}
            isHighlighted={block.isHighlighted}
            color={block.isHighlighted ? highlightedColor : dimmedColor}
            index={i}
            onClick={interactive ? () => {
              const newNumerator = block.isHighlighted
                ? numerator - 1
                : numerator + 1;
              onSelectFraction?.(Math.max(0, newNumerator), denominator);
            } : undefined}
          />
        ))}
      </group>

      {/* Labels */}
      {showLabels && (
        <group position={[0, 2, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.6}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {`${numerator}/${denominator}`}
          </Text>
          <Text
            position={[0, -0.6, 0]}
            fontSize={0.3}
            color="#94A3B8"
            anchorX="center"
            anchorY="middle"
          >
            {numerator > 0
              ? `${Math.round((numerator / denominator) * 100)}%`
              : '0%'
            }
          </Text>
        </group>
      )}

      {/* Base platform */}
      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1E1B4B" transparent opacity={0.5} />
      </mesh>

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={10}
      />
    </>
  );
}

export default function FractionVisualizer({
  numerator,
  denominator,
  showLabels = true,
  interactive = false,
  onSelectFraction,
}: FractionVisualizerProps) {
  const [num, setNum] = useState(numerator);

  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <FractionScene
          numerator={num}
          denominator={denominator}
          showLabels={showLabels}
          interactive={interactive}
          onSelectFraction={interactive ? (n) => setNum(n) : onSelectFraction}
        />
      </Canvas>

      {/* Controls */}
      {interactive && (
        <div style={{
          position: 'absolute',
          bottom: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
        }}>
          <button
            onClick={() => setNum(Math.max(0, num - 1))}
            style={{
              padding: '8px 16px',
              background: '#374151',
              border: 'none',
              borderRadius: 8,
              color: 'white',
              cursor: 'pointer',
            }}
          >
            −
          </button>
          <button
            onClick={() => setNum(Math.min(denominator, num + 1))}
            style={{
              padding: '8px 16px',
              background: '#22C55E',
              border: 'none',
              borderRadius: 8,
              color: 'white',
              cursor: 'pointer',
            }}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}