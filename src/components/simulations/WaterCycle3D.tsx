'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

interface WaterCycle3DProps {
  activeStage?: 'evaporation' | 'condensation' | 'precipitation' | 'collection' | 'all';
  onStageClick?: (stage: string) => void;
  autoPlay?: boolean;
  showLabels?: boolean;
}

// Sun component for evaporation
function Sun({ active }: { active: boolean }) {
  const sunRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sunRef.current && active) {
      sunRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={[-3, 2, 0]}>
      <mesh ref={sunRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={active ? 2 : 0.5} />
      </mesh>
      {/* Sun rays */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[
          Math.cos((i / 8) * Math.PI * 2) * 0.8,
          Math.sin((i / 8) * Math.PI * 2) * 0.8,
          0
        ]}>
          <coneGeometry args={[0.1, 0.4, 8]} />
          <meshStandardMaterial color="#FCD34D" emissive="#F59E0B" emissiveIntensity={active ? 0.8 : 0.2} />
        </mesh>
      ))}
    </group>
  );
}

// Cloud component for condensation
function Cloud({ position, scale, active }: { position: [number, number, number]; scale: number; active: boolean }) {
  const cloudRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cloudRef.current) {
      cloudRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={cloudRef} position={position} scale={scale}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[
          (i - 2) * 0.3,
          Math.sin(i) * 0.1,
          0
        ]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial
            color={active ? "#E0F2FE" : "#94A3B8"}
            transparent
            opacity={active ? 0.9 : 0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// Rain drops for precipitation
function RainDrops({ active }: { active: boolean }) {
  const dropsRef = useRef<THREE.Group>(null);

  const drops = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      x: (Math.random() - 0.5) * 3,
      startY: 2 + Math.random() * 2,
      speed: 2 + Math.random() * 2,
    }));
  }, []);

  useFrame((state) => {
    if (dropsRef.current && active) {
      dropsRef.current.children.forEach((child, i) => {
        const drop = child as THREE.Mesh;
        const data = drops[i];
        drop.position.y = data.startY - ((state.clock.elapsedTime * data.speed) % 4);
        if (drop.position.y < -1) {
          drop.position.y = data.startY;
        }
      });
    }
  });

  return (
    <group ref={dropsRef}>
      {drops.map((drop, i) => (
        <mesh key={i} position={[drop.x, drop.startY, 0]}>
          <capsuleGeometry args={[0.02, 0.1, 4, 8]} />
          <meshStandardMaterial color="#3B82F6" transparent opacity={active ? 0.8 : 0} />
        </mesh>
      ))}
    </group>
  );
}

// Water body for collection
function WaterBody({ active }: { active: boolean }) {
  const waterRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (waterRef.current && active) {
      waterRef.current.position.y = -1.5 + Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <mesh ref={waterRef} position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[3, 64]} />
      <meshStandardMaterial
        color="#0EA5E9"
        transparent
        opacity={active ? 0.8 : 0.5}
        metalness={0.1}
        roughness={0.1}
      />
    </mesh>
  );
}

// Arrow indicators
function Arrow({ from, to, color, active }: { from: [number, number, number]; to: [number, number, number]; color: string; active: boolean }) {
  const direction = useMemo(() => {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const dz = to[2] - from[2];
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return { length, normalized: [dx / length, dy / length, dz / length] };
  }, [from, to]);

  const midpoint: [number, number, number] = [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2,
    (from[2] + to[2]) / 2,
  ];

  return (
    <group position={midpoint}>
      <mesh rotation={[0, 0, Math.atan2(to[1] - from[1], to[0] - from[0])]}>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 0.5 : 0.1}
          transparent
          opacity={active ? 1 : 0.3}
        />
      </mesh>
    </group>
  );
}

// Stage labels
function StageLabel({ position, label, color }: { position: [number, number, number]; label: string; color: string }) {
  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={[1.2, 0.3]} />
        <meshStandardMaterial color="#1E1B4B" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// Main Water Cycle Scene
function WaterCycleScene({ activeStage, onStageClick, showLabels }: { activeStage: string; onStageClick?: (stage: string) => void; showLabels: boolean }) {
  const stages = {
    evaporation: activeStage === 'all' || activeStage === 'evaporation',
    condensation: activeStage === 'all' || activeStage === 'condensation',
    precipitation: activeStage === 'all' || activeStage === 'precipitation',
    collection: activeStage === 'all' || activeStage === 'collection',
  };

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#6366F1" />

      {/* Background */}
      <mesh position={[0, 0, -5]} rotation={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>

      {/* Sun (Evaporation) */}
      <Sun active={stages.evaporation} />
      <mesh position={[-3, 2, 0]} onClick={() => onStageClick?.('evaporation')}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Clouds (Condensation) */}
      <Cloud position={[0, 2.5, 0]} scale={1} active={stages.condensation} />
      <Cloud position={[1.5, 2.8, 0]} scale={0.7} active={stages.condensation} />
      <mesh position={[0, 2.5, 0]} onClick={() => onStageClick?.('condensation')}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Rain (Precipitation) */}
      <RainDrops active={stages.precipitation} />

      {/* Water (Collection) */}
      <WaterBody active={stages.collection} />

      {/* Arrows showing cycle flow */}
      <Arrow from={[-2.5, 2, 0]} to={[-1, 2.3, 0]} color="#F59E0B" active={stages.evaporation} />
      <Arrow from={[0.5, 2.3, 0]} to={[1.5, 1, 0]} color="#93C5FD" active={stages.condensation} />
      <Arrow from={[1, 0.5, 0]} to={[0.5, -1, 0]} color="#3B82F6" active={stages.precipitation} />
      <Arrow from={[-0.5, -1, 0]} to={[-2, 0, 0]} color="#14B8A6" active={stages.collection} />

      {/* Labels */}
      {showLabels && (
        <>
          <StageLabel position={[-3, 3.2, 0]} label="Evaporation" color="#F59E0B" />
          <StageLabel position={[0, 4, 0]} label="Condensation" color="#93C5FD" />
          <StageLabel position={[2, 1, 0]} label="Precipitation" color="#3B82F6" />
          <StageLabel position={[0, -2.5, 0]} label="Collection" color="#14B8A6" />
        </>
      )}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
    </>
  );
}

export default function WaterCycle3D({
  activeStage = 'all',
  onStageClick,
  autoPlay = true,
  showLabels = true,
}: WaterCycle3DProps) {
  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <WaterCycleScene
          activeStage={activeStage}
          onStageClick={onStageClick}
          showLabels={showLabels}
        />
      </Canvas>

      {/* Legend overlay */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        display: 'flex',
        gap: 12,
        fontSize: 12,
        color: 'white',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 12, height: 12, background: '#F59E0B', borderRadius: '50%' }} />
          Evaporation
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 12, height: 12, background: '#93C5FD', borderRadius: '50%' }} />
          Condensation
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 12, height: 12, background: '#3B82F6', borderRadius: '50%' }} />
          Precipitation
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 12, height: 12, background: '#14B8A6', borderRadius: '50%' }} />
          Collection
        </span>
      </div>
    </div>
  );
}