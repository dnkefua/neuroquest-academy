'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

type ComponentType = 'battery' | 'bulb' | 'switch' | 'wire';

interface CircuitComponent {
  id: string;
  type: ComponentType;
  position: [number, number, number];
  rotation: number;
  isActive: boolean;
}

interface CircuitBuilderProps {
  onComplete?: (success: boolean) => void;
  showHints?: boolean;
}

// Battery component
function Battery({ position, rotation, isActive }: { position: [number, number, number]; rotation: number; isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.children[0].position.y = 0.3 + Math.sin(state.clock.elapsedTime * 5) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      {/* Battery body */}
      <RoundedBox args={[0.6, 0.8, 0.4]} radius={0.05} position={[0, 0, 0]}>
        <meshStandardMaterial color={isActive ? '#22C55E' : '#64748B'} />
      </RoundedBox>
      {/* Positive terminal */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
        <meshStandardMaterial color="#F59E0B" />
      </mesh>
      {/* Negative terminal */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 16]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      {/* Voltage indicator */}
      {isActive && (
        <mesh position={[0.35, 0, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#22C55E" />
        </mesh>
      )}
    </group>
  );
}

// Light bulb component
function Bulb({ position, rotation, isActive }: { position: [number, number, number]; rotation: number; isActive: boolean }) {
  const bulbRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (bulbRef.current && isActive) {
      const intensity = 0.5 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
      (bulbRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
  });

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Bulb glass */}
      <mesh ref={bulbRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={isActive ? '#FEF3C7' : '#E5E7EB'}
          emissive={isActive ? '#FBBF24' : '#000000'}
          emissiveIntensity={isActive ? 0.5 : 0}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Base */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.15, 0.1, 0.15, 16]} />
        <meshStandardMaterial color="#6B7280" />
      </mesh>
      {/* Filament */}
      {isActive && (
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[0.1, 0.02, 8, 32]} />
          <meshBasicMaterial color="#FBBF24" />
        </mesh>
      )}
    </group>
  );
}

// Switch component
function Switch({ position, rotation, isOn, onClick }: {
  position: [number, number, number];
  rotation: number;
  isOn: boolean;
  onClick?: () => void;
}) {
  const switchRef = useRef<THREE.Group>(null);

  return (
    <group ref={switchRef} position={position} rotation={[0, rotation, 0]} onClick={onClick}>
      {/* Base */}
      <RoundedBox args={[0.5, 0.15, 0.3]} radius={0.02}>
        <meshStandardMaterial color="#374151" />
      </RoundedBox>
      {/* Lever */}
      <group position={[0, 0, 0]} rotation={[isOn ? 0 : -Math.PI / 4, 0, 0]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.05, 0.3, 0.05]} />
          <meshStandardMaterial color={isOn ? '#22C55E' : '#64748B'} />
        </mesh>
      </group>
    </group>
  );
}

// Wire path between components
function Wire({ points, isActive }: { points: [number, number, number][]; isActive: boolean }) {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      points.map(p => new THREE.Vector3(...p))
    );
  }, [points]);

  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, 0.03, 8, false);
  }, [curve]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={isActive ? '#FBBF24' : '#64748B'}
        emissive={isActive ? '#FBBF24' : '#000000'}
        emissiveIntensity={isActive ? 0.3 : 0}
        metalness={0.5}
        roughness={0.3}
      />
    </mesh>
  );
}

// Main circuit scene
function CircuitScene({ components, switchOn, onSwitchToggle, showHints }: {
  components: CircuitComponent[];
  switchOn: boolean;
  onSwitchToggle: () => void;
  showHints: boolean;
}) {
  const circuitComplete = switchOn && components.length >= 3;

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      {circuitComplete && (
        <pointLight position={[2, 2, 0]} intensity={1} color="#FBBF24" />
      )}

      {/* Background */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1E1B4B" />
      </mesh>

      {/* Grid */}
      {showHints && (
        <gridHelper args={[10, 10, '#374151', '#1F2937']} position={[0, -0.99, 0]} />
      )}

      {/* Components */}
      {components.map((comp) => {
        switch (comp.type) {
          case 'battery':
            return (
              <Battery
                key={comp.id}
                position={comp.position}
                rotation={comp.rotation}
                isActive={circuitComplete}
              />
            );
          case 'bulb':
            return (
              <Bulb
                key={comp.id}
                position={comp.position}
                rotation={comp.rotation}
                isActive={circuitComplete}
              />
            );
          case 'switch':
            return (
              <Switch
                key={comp.id}
                position={comp.position}
                rotation={comp.rotation}
                isOn={switchOn}
                onClick={onSwitchToggle}
              />
            );
          default:
            return null;
        }
      })}

      {/* Wires */}
      {components.length >= 3 && (
        <>
          <Wire
            points={[
              [components[0].position[0], components[0].position[1] + 0.4, components[0].position[2]],
              [components[1].position[0], components[1].position[1], components[1].position[2]],
            ]}
            isActive={circuitComplete}
          />
          <Wire
            points={[
              [components[1].position[0], components[1].position[1], components[1].position[2]],
              [components[2].position[0], components[2].position[1], components[2].position[2]],
            ]}
            isActive={circuitComplete}
          />
          <Wire
            points={[
              [components[2].position[0], components[2].position[1], components[2].position[2]],
              [components[0].position[0] - 0.3, components[0].position[1], components[0].position[2]],
              [components[0].position[0], components[0].position[1] - 0.4, components[0].position[2]],
            ]}
            isActive={circuitComplete}
          />
        </>
      )}

      {/* Instructions */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {circuitComplete ? 'Circuit Complete! The bulb is lit!' : 'Click the switch to complete the circuit'}
      </Text>

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        minDistance={2}
        maxDistance={10}
      />
    </>
  );
}

export default function CircuitBuilder({ onComplete, showHints = true }: CircuitBuilderProps) {
  const [switchOn, setSwitchOn] = useState(false);

  // Default circuit: battery, bulb, switch
  const defaultComponents: CircuitComponent[] = useMemo(() => [
    { id: 'battery-1', type: 'battery', position: [-2, 0, 0], rotation: 0, isActive: true },
    { id: 'bulb-1', type: 'bulb', position: [0, 1, 0], rotation: 0, isActive: false },
    { id: 'switch-1', type: 'switch', position: [2, 0, 0], rotation: Math.PI / 2, isActive: false },
  ], []);

  const handleSwitchToggle = useCallback(() => {
    const newState = !switchOn;
    setSwitchOn(newState);
    onComplete?.(newState);
  }, [switchOn, onComplete]);

  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <Canvas camera={{ position: [0, 3, 6], fov: 50 }}>
        <CircuitScene
          components={defaultComponents}
          switchOn={switchOn}
          onSwitchToggle={handleSwitchToggle}
          showHints={showHints}
        />
      </Canvas>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        display: 'flex',
        gap: 16,
        fontSize: 12,
        color: 'white',
      }}>
        <span>🔋 Battery</span>
        <span>💡 Bulb</span>
        <span>⚡ Switch</span>
      </div>
    </div>
  );
}