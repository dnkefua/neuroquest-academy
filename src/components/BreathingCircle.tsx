'use client';

import { useState, useEffect } from 'react';

const PHASES = [
  { label: 'Breathe In 🌬️', duration: 4000, scale: 1.4 },
  { label: 'Hold ✨', duration: 2000, scale: 1.4 },
  { label: 'Breathe Out 🍃', duration: 4000, scale: 1 },
  { label: 'Hold 🌿', duration: 2000, scale: 1 },
];

export default function BreathingCircle() {
  const [phase, setPhase] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => {
      setPhase((p) => (p + 1) % PHASES.length);
    }, PHASES[phase].duration);
    return () => clearTimeout(timer);
  }, [phase, running]);

  const current = PHASES[phase];
  const transitionDuration = current.duration / 1000;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="relative flex items-center justify-center w-48 h-48">
        {/* Outer glow */}
        <div
          className="absolute rounded-full bg-brand-teal/20 transition-transform"
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${current.scale * 1.15})`,
            transitionDuration: `${transitionDuration}s`,
            transitionTimingFunction: 'ease-in-out',
          }}
        />
        {/* Main circle */}
        <div
          className="absolute rounded-full bg-gradient-to-br from-brand-teal to-brand-purple transition-transform"
          style={{
            width: '70%',
            height: '70%',
            transform: `scale(${current.scale})`,
            transitionDuration: `${transitionDuration}s`,
            transitionTimingFunction: 'ease-in-out',
          }}
        />
        {/* Center text */}
        <div className="relative z-10 text-white font-nunito font-black text-lg text-center">
          {current.duration / 1000}s
        </div>
      </div>

      <p className="font-nunito font-black text-xl text-gray-800">{current.label}</p>

      <div className="flex gap-2">
        {PHASES.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-6 rounded-full transition-all ${i === phase ? 'bg-brand-teal' : 'bg-purple-100'}`}
          />
        ))}
      </div>

      <button
        onClick={() => setRunning((r) => !r)}
        className="text-sm text-gray-500 font-dmsans hover:text-gray-700"
      >
        {running ? '⏸ Pause' : '▶ Resume'}
      </button>
    </div>
  );
}
