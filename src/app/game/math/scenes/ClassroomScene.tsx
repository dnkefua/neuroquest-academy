'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '../store/gameStore';
import { gameAudio } from '../../shared/audio';
import { gameTTS } from '../../shared/tts';

const SUBJECTS = [
  { id: 'math',    emoji: '🔢', label: 'Mathematics',   sub: 'Positive & Negative Numbers', color: '#8B5CF6', glow: '#8B5CF680', active: true  },
  { id: 'science', emoji: '🔬', label: 'Science',        sub: 'The Water Cycle',             color: '#14B8A6', glow: '#14B8A640', active: true  },
  { id: 'english', emoji: '📖', label: 'English',        sub: 'Coming soon…',                color: '#3B82F6', glow: '#3B82F640', active: false },
  { id: 'social',  emoji: '🤝', label: 'Social Skills',  sub: 'Coming soon…',                color: '#F97316', glow: '#F9731640', active: false },
  { id: 'calm',    emoji: '💜', label: 'Calm Corner',    sub: 'Coming soon…',                color: '#EC4899', glow: '#EC489940', active: false },
];

const BOB_DELAYS = ['0s', '0.6s', '1.2s', '1.8s', '2.4s'];

export default function ClassroomScene() {
  const setScene = useGameStore(s => s.setScene);
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const [ttsOn, setTtsOn] = useState(gameTTS.enabled);

  function toggleMusic() {
    const on = gameAudio.toggle();
    setMusicOn(on);
  }

  function toggleTTS() {
    setTtsOn(gameTTS.toggle());
  }

  // Unlock audio context on first interaction
  useEffect(() => {
    const unlock = () => {
      setAudioReady(true);
      gameAudio.startBackground('adventure');
      gameTTS.speak('Welcome to NeuroQuest Academy! Choose your quest, Explorer!');
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    return () => window.removeEventListener('pointerdown', unlock);
  }, []);

  function handleSubjectClick(id: string, active: boolean) {
    if (!active) return;
    gameAudio.stopSignIn();   // stop Eko's music the moment a subject is chosen
    gameAudio.playClick();
    gameAudio.playTransition();
    if (id === 'math')    setScene('QUEST_MAP');
    else if (id === 'science') router.push('/game/science');
  }

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0d1b2a 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 16px', position: 'relative', overflow: 'hidden',
    }}>

      {/* Starfield */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%', background: 'white',
            width: 1 + (i % 2), height: 1 + (i % 2),
            left: `${(i * 17.3 + 7) % 100}%`, top: `${(i * 13.7 + 11) % 100}%`,
            opacity: 0.15 + (i % 5) * 0.1,
            animation: `twinkle-star ${2 + (i % 4)}s ease-in-out ${(i % 8) * 0.5}s infinite`,
          }} />
        ))}
      </div>

      {/* Zara character — waves when Math is hovered */}
      <div style={{
        position: 'absolute', bottom: 24, left: 24, display: 'flex',
        flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 2,
      }}>
        <div style={{
          fontSize: 44,
          animation: hoveredId === 'math'
            ? 'zara-wave 0.4s ease-in-out 4'
            : hoveredId === 'science'
            ? 'zara-jump 0.5s ease-in-out 3'
            : 'zara-idle 3s ease-in-out infinite',
          transformOrigin: 'bottom center',
          filter: hoveredId ? 'drop-shadow(0 0 12px #3ECFB2)' : 'none',
          transition: 'filter 0.3s',
        }}>
          {hoveredId === 'science' ? '🧪' : '🧙‍♀️'}
        </div>
        {hoveredId === 'math' && (
          <div style={{
            background: 'rgba(139,92,246,0.9)', color: 'white', fontSize: 11,
            padding: '3px 8px', borderRadius: 12, fontWeight: 700, whiteSpace: 'nowrap',
            animation: 'fade-in-up 0.2s ease-out',
          }}>
            Let&apos;s battle! ⚔️
          </div>
        )}
        {hoveredId === 'science' && (
          <div style={{
            background: 'rgba(20,184,166,0.9)', color: 'white', fontSize: 11,
            padding: '3px 8px', borderRadius: 12, fontWeight: 700, whiteSpace: 'nowrap',
            animation: 'fade-in-up 0.2s ease-out',
          }}>
            Water quest! 💧
          </div>
        )}
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Zara</span>
      </div>

      {/* Audio controls */}
      <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8, zIndex: 3 }}>
        <button onClick={toggleMusic} style={{
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 12, color: musicOn ? '#FFD700' : 'rgba(255,255,255,0.3)',
          fontSize: 18, padding: '6px 10px', cursor: 'pointer',
        }} title={musicOn ? 'Mute music' : 'Unmute music'}>
          {musicOn ? '🎵' : '🎵'}
        </button>
        <button onClick={toggleTTS} style={{
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 12, color: ttsOn ? '#C4B5FD' : 'rgba(255,255,255,0.3)',
          fontSize: 18, padding: '6px 10px', cursor: 'pointer',
        }} title={ttsOn ? 'Turn off read-aloud' : 'Turn on read-aloud'}>
          {ttsOn ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏰</div>
        <h1 style={{
          fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: 32, color: 'white',
          margin: '0 0 8px', textShadow: '0 0 30px rgba(139,92,246,0.6)',
        }}>
          NeuroQuest Academy
        </h1>
        <p style={{ color: '#C4B5FD', fontSize: 14, margin: 0 }}>Choose your quest, Explorer</p>
      </div>

      {/* Subject cards with bob animation */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16, width: '100%', maxWidth: 680, position: 'relative', zIndex: 1,
      }}>
        {SUBJECTS.map((s, i) => (
          <div key={s.id} style={{ animation: `card-bob 3s ease-in-out ${BOB_DELAYS[i]} infinite` }}>
            <button
              onClick={() => handleSubjectClick(s.id, s.active)}
              onMouseEnter={() => { setHoveredId(s.id); if (s.active) gameAudio.playClick(); }}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                width: '100%', textAlign: 'left', padding: 20, borderRadius: 24,
                overflow: 'hidden', position: 'relative',
                background: s.active
                  ? `linear-gradient(135deg, ${s.color}22 0%, rgba(15,12,41,0.9) 100%)`
                  : 'rgba(255,255,255,0.03)',
                border: `1.5px solid ${s.active ? s.color + '66' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: hoveredId === s.id && s.active
                  ? `0 0 40px ${s.glow}, 0 8px 32px rgba(0,0,0,0.4)`
                  : s.active ? `0 0 20px ${s.glow}` : 'none',
                cursor: s.active ? 'pointer' : 'not-allowed',
                opacity: s.active ? 1 : 0.45,
                transform: hoveredId === s.id && s.active ? 'scale(1.05) translateY(-4px)' : 'scale(1)',
                transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s, opacity 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 16, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 24, flexShrink: 0,
                  background: `${s.color}22`, border: `1px solid ${s.color}44`,
                  animation: hoveredId === s.id && s.active ? 'icon-spin 0.6s ease-out' : 'none',
                }}>
                  {s.emoji}
                </div>
                <div>
                  <p style={{ fontWeight: 900, color: 'white', fontSize: 15, margin: 0 }}>{s.label}</p>
                  <p style={{ fontSize: 12, margin: '2px 0 0', color: s.active ? s.color : 'rgba(255,255,255,0.3)' }}>
                    {s.sub}
                  </p>
                </div>
              </div>
              {s.active && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                    background: `${s.color}22`, color: s.color, border: `1px solid ${s.color}44`,
                  }}>
                    {s.id === 'math' ? 'Grade 6 · IB' : 'Grade 4 · IB'}
                  </span>
                  <span style={{
                    fontSize: 18, color: s.color,
                    animation: hoveredId === s.id ? 'arrow-bounce 0.5s ease-in-out infinite' : 'arrow-bounce 1.5s ease-in-out infinite',
                  }}>→</span>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 40, fontSize: 12, color: 'rgba(255,255,255,0.2)', position: 'relative', zIndex: 1 }}>
        ✨ More subjects coming soon
      </p>

      <style jsx>{`
        @keyframes twinkle-star  { 0%,100%{opacity:0.1} 50%{opacity:0.8} }
        @keyframes card-bob      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes arrow-bounce  { 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }
        @keyframes zara-idle     { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-6px) rotate(3deg)} }
        @keyframes zara-wave     { 0%{transform:rotate(0deg)} 25%{transform:rotate(-20deg)} 75%{transform:rotate(20deg)} 100%{transform:rotate(0deg)} }
        @keyframes zara-jump     { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-16px) scale(1.1)} }
        @keyframes icon-spin     { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes fade-in-up    { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
