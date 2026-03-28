'use client';

import { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface PhysicsLabProps {
  simulationType?: 'force' | 'motion' | 'gravity';
  showControls?: boolean;
  initialForce?: number;
  initialMass?: number;
  onForceChange?: (force: number) => void;
}

// Force arrow component
function ForceArrow({ force, direction }: { force: number; direction: 'left' | 'right' }) {
  const arrowRef = useRef<THREE.Group>(null);
  const scale = Math.abs(force) / 10;

  useFrame((state) => {
    if (arrowRef.current && force !== 0) {
      arrowRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.02;
    }
  });

  if (force === 0) return null;

  return (
    <group ref={arrowRef} position={[direction === 'right' ? -1.5 : 1.5, 0.5, 0]}>
      {/* Arrow shaft */}
      <mesh rotation={[0, 0, direction === 'right' ? 0 : Math.PI]}>
        <boxGeometry args={[scale, 0.1, 0.1]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.3} />
      </mesh>
      {/* Arrow head */}
      <mesh position={[direction === 'right' ? scale / 2 : -scale / 2, 0, 0]} rotation={[0, 0, direction === 'right' ? -Math.PI / 2 : Math.PI / 2]}>
        <coneGeometry args={[0.15, 0.3, 8]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.3} />
      </mesh>
      {/* Force label */}
      <Text
        position={[direction === 'right' ? scale + 0.5 : -(scale + 0.5), 0, 0]}
        fontSize={0.2}
        color="#EF4444"
        anchorX="center"
      >
        {`${force}N`}
      </Text>
    </group>
  );
}

// Moving object
function PhysicsObject({ position, mass, velocity }: { position: [number, number, number]; mass: number; velocity: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scale = 0.5 + mass * 0.2;

  return (
    <group position={position}>
      {/* Object */}
      <mesh ref={meshRef}>
        <boxGeometry args={[scale, scale, scale]} />
        <meshStandardMaterial color="#3B82F6" />
      </mesh>
      {/* Mass label */}
      <Text
        position={[0, scale / 2 + 0.3, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
      >
        {`${mass}kg`}
      </Text>
    </group>
  );
}

// Motion trail
function MotionTrail({ positions }: { positions: [number, number, number][] }) {
  return (
    <group>
      {positions.slice(-20).map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#3B82F6" transparent opacity={i / 20 * 0.5} />
        </mesh>
      ))}
    </group>
  );
}

// Ground/Friction surface
function Ground({ friction }: { friction: number }) {
  const frictionColor = friction > 0.5 ? '#B45309' : '#065F46';

  return (
    <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 2]} />
      <meshStandardMaterial color={frictionColor} metalness={0.2} roughness={friction} />
    </mesh>
  );
}

// Force simulation
function ForceSimulation({ force, mass, friction }: { force: number; mass: number; friction: number }) {
  const objectRef = useRef<THREE.Group>(null);
  const [position, setPosition] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const velocityRef = useRef(0);
  const posRef = useRef(0);
  const trailRef = useRef<[number, number, number][]>([]);

  useFrame((state, delta) => {
    // F = ma, a = F/m
    const acceleration = force / mass;
    // Friction opposes motion
    const frictionForce = friction * mass * 9.8 * (velocity > 0 ? -1 : velocity < 0 ? 1 : 0);
    const netAcceleration = acceleration - frictionForce / mass;

    velocityRef.current = velocityRef.current + netAcceleration * delta;
    posRef.current = posRef.current + velocityRef.current * delta;

    // Clamp position
    posRef.current = Math.max(-4, Math.min(4, posRef.current));

    // Update trail
    trailRef.current.push([posRef.current, 0, 0]);
    if (trailRef.current.length > 30) {
      trailRef.current.shift();
    }

    setPosition(posRef.current);
    setVelocity(velocityRef.current);

    if (objectRef.current) {
      objectRef.current.position.x = posRef.current;
    }
  });

  return (
    <>
      <Ground friction={friction} />
      <group ref={objectRef}>
        <PhysicsObject position={[0, 0, 0]} mass={mass} velocity={velocity} />
      </group>
      <ForceArrow force={Math.abs(force)} direction={force > 0 ? 'right' : 'left'} />
      <MotionTrail positions={trailRef.current} />

      {/* Velocity display */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
      >
        {`Velocity: ${velocity.toFixed(2)} m/s`}
      </Text>
    </>
  );
}

// Gravity simulation
function GravitySimulation({ mass, height }: { mass: number; height: number }) {
  const objectRef = useRef<THREE.Group>(null);
  const [falling, setFalling] = useState(false);
  const [currentHeight, setCurrentHeight] = useState(height);
  const velocityRef = useRef(0);
  const heightRef = useRef(height);

  const drop = useCallback(() => {
    setFalling(true);
    velocityRef.current = 0;
    heightRef.current = height;
    setCurrentHeight(height);
  }, [height]);

  useFrame((state, delta) => {
    if (falling && objectRef.current) {
      // g = 9.8 m/s^2
      velocityRef.current += 9.8 * delta;
      heightRef.current -= velocityRef.current * delta;

      if (heightRef.current <= 0) {
        heightRef.current = 0;
        setFalling(false);
      }

      setCurrentHeight(heightRef.current);
      objectRef.current.position.y = heightRef.current;
    }
  });

  return (
    <>
      {/* Ground */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1E1B4B" />
      </mesh>

      {/* Height markers */}
      {[0, 1, 2, 3, 4, 5].map((h) => (
        <group key={h} position={[2, h, 0]}>
          <mesh>
            <boxGeometry args={[0.1, 0.02, 0.1]} />
            <meshBasicMaterial color="#94A3B8" />
          </mesh>
          <Text position={[0.3, 0, 0]} fontSize={0.15} color="#94A3B8">
            {`${h}m`}
          </Text>
        </group>
      ))}

      {/* Falling object */}
      <group ref={objectRef} position={[0, height, 0]}>
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#EF4444" />
        </mesh>
        <Text position={[0, 0.5, 0]} fontSize={0.2} color="white">
          {`${mass}kg`}
        </Text>
      </group>

      {/* Drop button */}
      <group position={[0, 3.5, 0]} onClick={drop}>
        <RoundedBox args={[1.5, 0.5, 0.3]} radius={0.1}>
          <meshStandardMaterial color={falling ? '#64748B' : '#22C55E'} />
        </RoundedBox>
        <Text position={[0, 0, 0.2]} fontSize={0.2} color="white">
          {falling ? 'Dropping...' : 'Drop'}
        </Text>
      </group>

      {/* Height display */}
      <Text
        position={[-2, currentHeight, 0]}
        fontSize={0.2}
        color="#22C55E"
      >
        {`${currentHeight.toFixed(1)}m`}
      </Text>
    </>
  );
}

// Main physics lab scene
function PhysicsLabScene({ simulationType, force, mass, friction, height }: {
  simulationType: 'force' | 'motion' | 'gravity';
  force: number;
  mass: number;
  friction: number;
  height: number;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-5, 5, 5]} intensity={0.3} color="#6366F1" />

      {simulationType === 'force' && (
        <ForceSimulation force={force} mass={mass} friction={friction} />
      )}
      {simulationType === 'gravity' && (
        <GravitySimulation mass={mass} height={height} />
      )}

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        minDistance={3}
        maxDistance={15}
      />
    </>
  );
}

export default function PhysicsLab({
  simulationType = 'force',
  showControls = true,
  initialForce = 10,
  initialMass = 2,
  onForceChange,
}: PhysicsLabProps) {
  const [force, setForce] = useState(initialForce);
  const [mass, setMass] = useState(initialMass);
  const [friction, setFriction] = useState(0.3);

  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <Canvas camera={{ position: [0, 3, 8], fov: 50 }}>
        <PhysicsLabScene
          simulationType={simulationType}
          force={force}
          mass={mass}
          friction={friction}
          height={5}
        />
      </Canvas>

      {/* Controls */}
      {showControls && simulationType === 'force' && (
        <div style={{
          position: 'absolute',
          bottom: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 16,
          background: 'rgba(0,0,0,0.7)',
          padding: '8px 16px',
          borderRadius: 8,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ color: '#94A3B8', fontSize: 12 }}>Force (N)</label>
            <input
              type="range"
              min={-20}
              max={20}
              value={force}
              onChange={(e) => {
                const newForce = parseInt(e.target.value);
                setForce(newForce);
                onForceChange?.(newForce);
              }}
              style={{ width: 100 }}
            />
            <span style={{ color: 'white', fontSize: 14 }}>{force}N</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ color: '#94A3B8', fontSize: 12 }}>Mass (kg)</label>
            <input
              type="range"
              min={1}
              max={10}
              value={mass}
              onChange={(e) => setMass(parseInt(e.target.value))}
              style={{ width: 100 }}
            />
            <span style={{ color: 'white', fontSize: 14 }}>{mass}kg</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ color: '#94A3B8', fontSize: 12 }}>Friction</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={friction}
              onChange={(e) => setFriction(parseFloat(e.target.value))}
              style={{ width: 100 }}
            />
            <span style={{ color: 'white', fontSize: 14 }}>{friction.toFixed(1)}</span>
          </div>
        </div>
      )}

      {/* Physics formula */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        background: 'rgba(0,0,0,0.7)',
        padding: '8px 12px',
        borderRadius: 8,
        color: 'white',
        fontSize: 14,
      }}>
        {simulationType === 'force' && 'F = ma'}
        {simulationType === 'gravity' && 'g = 9.8 m/s²'}
      </div>
    </div>
  );
}