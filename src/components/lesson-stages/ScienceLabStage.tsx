'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

type ScienceLabMode = 'water-cycle' | 'circuit' | 'force' | 'gravity' | 'atom' | 'waves' | 'lab';

type ScienceLabStageProps = {
  title: string;
  detail: string;
  mode?: ScienceLabMode;
  accent?: string;
  className?: string;
  overlay?: 'none' | 'minimal' | 'full';
};

function BlenderLab() {
  const gltf = useGLTF('/models/neuroquest/grade8-science-lab.glb');
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  return <primitive object={scene} position={[0, -0.92, 0.22]} scale={0.58} />;
}

function LabScene({ mode, accent }: { mode: ScienceLabMode; accent: string }) {
  const coreRef = useRef<THREE.Group>(null);
  const blockRef = useRef<THREE.Mesh>(null);
  const dropletRef = useRef<THREE.Mesh>(null);
  const waveRefs = useRef<THREE.Mesh[]>([]);

  const orbitAngles = useMemo(() => [0, 2.09, 4.18], []);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;

    if (coreRef.current) {
      coreRef.current.rotation.y = elapsed * 0.45;
      coreRef.current.rotation.x = Math.sin(elapsed * 0.35) * 0.08;
    }

    if (blockRef.current && (mode === 'force' || mode === 'gravity')) {
      blockRef.current.position.x = mode === 'force' ? Math.sin(elapsed * 1.2) * 1.25 : 0;
      blockRef.current.position.y = mode === 'gravity' ? 1.4 - (Math.sin(elapsed * 1.1) * 0.5 + 0.5) * 1.6 : 0.15;
    }

    if (dropletRef.current && mode === 'water-cycle') {
      const phase = elapsed * 0.75;
      dropletRef.current.position.set(Math.sin(phase) * 1.3, 0.75 + Math.cos(phase) * 0.75, 0);
    }

    waveRefs.current.forEach((wave, index) => {
      if (!wave) return;
      wave.scale.y = 0.45 + Math.sin(elapsed * 2 + index * 0.35) * 0.22;
      wave.position.y = -0.1 + wave.scale.y * 0.5;
    });
  });

  return (
    <>
      <color attach="background" args={['#08131f']} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={1.7} />
      <pointLight position={[-2, 2.5, 2]} intensity={2.4} color={accent} />

      <Suspense fallback={null}>
        <BlenderLab />
      </Suspense>

      <Float speed={1.7} floatIntensity={0.16}>
        <mesh position={[-1.6, 0.86, 0.08]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#bbf7d0" emissive="#10b981" emissiveIntensity={0.6} />
        </mesh>
      </Float>

      {mode === 'atom' && (
        <group ref={coreRef} position={[0, 0.95, 0]}>
          <mesh>
            <sphereGeometry args={[0.2, 24, 24]} />
            <meshStandardMaterial color="#fb7185" emissive="#e11d48" emissiveIntensity={0.45} />
          </mesh>
          {orbitAngles.map((angle, index) => (
            <group key={angle} rotation={[angle, angle * 0.6, angle * 0.9]}>
              <mesh>
                <torusGeometry args={[0.72, 0.012, 10, 80]} />
                <meshStandardMaterial color={index === 1 ? '#67e8f9' : '#fde68a'} emissive="#0ea5e9" emissiveIntensity={0.22} />
              </mesh>
              <mesh position={[0.72, 0, 0]}>
                <sphereGeometry args={[0.055, 16, 16]} />
                <meshStandardMaterial color="#a7f3d0" emissive="#10b981" emissiveIntensity={0.4} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {mode === 'water-cycle' && (
        <>
          <mesh position={[0, -0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.25, 48]} />
            <meshStandardMaterial color="#0ea5e9" emissive="#0284c7" emissiveIntensity={0.22} transparent opacity={0.75} />
          </mesh>
          <mesh ref={dropletRef} position={[0, 1.4, 0]}>
            <sphereGeometry args={[0.11, 18, 18]} />
            <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={0.45} />
          </mesh>
          <Float speed={1.4} floatIntensity={0.12}>
            <mesh position={[0.95, 1.65, 0]}>
              <sphereGeometry args={[0.24, 18, 18]} />
              <meshStandardMaterial color="#e2e8f0" />
            </mesh>
          </Float>
        </>
      )}

      {(mode === 'force' || mode === 'gravity') && (
        <>
          <mesh position={[0, -0.48, 0]}>
            <boxGeometry args={[3.2, 0.08, 0.4]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh ref={blockRef} position={[0, 0.15, 0]}>
            <boxGeometry args={[0.48, 0.48, 0.48]} />
            <meshStandardMaterial color={mode === 'force' ? '#38bdf8' : '#f97316'} emissive={accent} emissiveIntensity={0.18} />
          </mesh>
        </>
      )}

      {mode === 'circuit' && (
        <>
          <mesh position={[-0.95, 0.12, 0]}>
            <boxGeometry args={[0.38, 0.66, 0.26]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
          <mesh position={[0.95, 0.34, 0]}>
            <sphereGeometry args={[0.24, 20, 20]} />
            <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={0.55} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.62, 0.08, 0.18]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        </>
      )}

      {mode === 'waves' && (
        <>
          {Array.from({ length: 9 }, (_, index) => (
            <mesh
              key={index}
              ref={(node) => {
                if (node) waveRefs.current[index] = node;
              }}
              position={[-1.6 + index * 0.4, 0.2, 0]}
            >
              <boxGeometry args={[0.16, 0.8, 0.16]} />
              <meshStandardMaterial color={index % 2 === 0 ? accent : '#93c5fd'} emissive={accent} emissiveIntensity={0.14} />
            </mesh>
          ))}
        </>
      )}

      {mode === 'lab' && (
        <group ref={coreRef} position={[0, 0.9, 0]}>
          <mesh>
            <octahedronGeometry args={[0.26, 0]} />
            <meshStandardMaterial color="#38bdf8" emissive={accent} emissiveIntensity={0.28} />
          </mesh>
        </group>
      )}

      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
    </>
  );
}

useGLTF.preload('/models/neuroquest/grade8-science-lab.glb');

export default function ScienceLabStage({
  title,
  detail,
  mode = 'lab',
  accent = '#14b8a6',
  className = 'h-[250px]',
  overlay = 'none',
}: ScienceLabStageProps) {
  return (
    <div className={`relative overflow-hidden rounded-[28px] border border-white/10 bg-[#09111d] ${className}`}>
      <Canvas camera={{ position: [0, 1.1, 5.3], fov: 42 }} dpr={[1, 1.5]}>
        <LabScene mode={mode} accent={accent} />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,15,25,0.08),rgba(8,15,25,0.76))]" />

      {overlay !== 'none' && (
        <div className="pointer-events-none absolute left-3 top-3 max-w-[78%] rounded-2xl border border-white/12 bg-[rgba(8,15,25,0.62)] px-3 py-2 backdrop-blur-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">3D Lab</p>
          <p className="mt-1 line-clamp-1 text-xs font-semibold text-white sm:text-sm">{title}</p>
          {overlay === 'full' && (
            <p className="mt-1 line-clamp-3 text-[11px] leading-4 text-slate-200 sm:text-xs sm:leading-5">{detail}</p>
          )}
        </div>
      )}
    </div>
  );
}
