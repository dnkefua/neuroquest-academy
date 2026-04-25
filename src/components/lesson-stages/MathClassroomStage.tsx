'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

type MathClassroomStageProps = {
  title: string;
  prompt: string;
  equation?: string;
  accent?: string;
  startValue?: number;
  moveValue?: number;
  className?: string;
  overlay?: 'none' | 'minimal' | 'full';
  showEquation?: boolean;
};

function BlenderClassroom() {
  const gltf = useGLTF('/models/neuroquest/grade8-math-classroom.glb');
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  return <primitive object={scene} position={[0, -0.92, 0.28]} scale={0.58} />;
}

function ClassroomScene({
  accent,
  startValue,
  moveValue,
}: {
  accent: string;
  startValue?: number;
  moveValue?: number;
}) {
  const tokenRef = useRef<THREE.Mesh>(null);
  const cubeRefs = useRef<THREE.Mesh[]>([]);
  const markerPositions = useMemo(
    () => Array.from({ length: 9 }, (_, index) => -1.6 + index * 0.4),
    [],
  );

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    cubeRefs.current.forEach((cube, index) => {
      if (!cube) return;
      cube.rotation.x = elapsed * (0.6 + index * 0.12);
      cube.rotation.y = elapsed * (0.8 + index * 0.1);
      cube.position.y = 0.45 + Math.sin(elapsed * 1.4 + index) * 0.08;
    });

    if (!tokenRef.current) return;
    const boardMin = -1.6;
    const boardMax = 1.6;
    const from = startValue ?? 0;
    const to = moveValue !== undefined ? from + moveValue : from;
    const normalize = (value: number) => {
      const clamped = Math.max(-10, Math.min(10, value));
      return boardMin + ((clamped + 10) / 20) * (boardMax - boardMin);
    };

    const sourceX = normalize(from);
    const targetX = normalize(to);
    const travel = moveValue !== undefined ? (Math.sin(elapsed * 1.5) * 0.5 + 0.5) : 0;
    tokenRef.current.position.x = THREE.MathUtils.lerp(sourceX, targetX, travel);
    tokenRef.current.position.y = 1.62 + Math.sin(elapsed * 3) * 0.06;
  });

  return (
    <>
      <color attach="background" args={['#0b1320']} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.9} />
      <pointLight position={[-2, 2, 1]} intensity={2.5} color={accent} />

      <Suspense fallback={null}>
        <BlenderClassroom />
      </Suspense>

      {markerPositions.map((x, index) => (
        <mesh key={index} position={[x, 1.2, -1.99]}>
          <boxGeometry args={[0.03, index % 2 === 0 ? 0.22 : 0.14, 0.05]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      ))}

      <mesh ref={tokenRef} position={[0, 1.62, -1.95]}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} />
      </mesh>

      <Float speed={1.2} floatIntensity={0.18}>
        <mesh position={[-2.35, 1.7, -1.8]}>
          <sphereGeometry args={[0.15, 20, 20]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.35} />
        </mesh>
      </Float>

      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          ref={(node) => {
            if (node) cubeRefs.current[index] = node;
          }}
          position={[-0.6 + index * 0.6, 0.45, 1.1]}
        >
          <boxGeometry args={[0.24, 0.24, 0.24]} />
          <meshStandardMaterial color={index === 1 ? accent : '#7dd3fc'} emissive={accent} emissiveIntensity={0.15} />
        </mesh>
      ))}

      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
    </>
  );
}

useGLTF.preload('/models/neuroquest/grade8-math-classroom.glb');

export default function MathClassroomStage({
  title,
  prompt,
  equation,
  accent = '#14b8a6',
  startValue,
  moveValue,
  className = 'h-[250px]',
  overlay = 'none',
  showEquation = false,
}: MathClassroomStageProps) {
  return (
    <div className={`relative overflow-hidden rounded-[28px] border border-white/10 bg-[#09111d] ${className}`}>
      <Canvas camera={{ position: [0, 1.1, 5.3], fov: 42 }} dpr={[1, 1.5]}>
        <ClassroomScene accent={accent} startValue={startValue} moveValue={moveValue} />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,18,0.12),rgba(6,10,18,0.72))]" />

      {overlay !== 'none' && (
        <div className="pointer-events-none absolute left-3 top-3 max-w-[78%] rounded-2xl border border-white/12 bg-[rgba(8,15,25,0.62)] px-3 py-2 backdrop-blur-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">3D Classroom</p>
          <p className="mt-1 line-clamp-1 text-xs font-semibold text-white sm:text-sm">{title}</p>
          {overlay === 'full' && (
            <p className="mt-1 line-clamp-3 text-[11px] leading-4 text-slate-200 sm:text-xs sm:leading-5">{prompt}</p>
          )}
        </div>
      )}

      {equation && showEquation && (
        <div
          className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-2xl px-3 py-2 text-center font-mono text-xs font-black text-white sm:text-sm"
          style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.2), rgba(15,23,42,0.82))', border: `1px solid ${accent}66` }}
        >
          {equation}
        </div>
      )}
    </div>
  );
}
