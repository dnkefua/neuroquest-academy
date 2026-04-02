'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEnglishStore } from '../store/gameStore';
import { useProgressStore } from '@/store/progressStore';
import { gameAudio } from '../../shared/audio';
import { gameTTS } from '../../shared/tts';

const GRADE_INFO: Record<number, { programme: string; topic: string; teacher: string; emoji: string }> = {
  1:  { programme: 'PYP', topic: 'Letters & Sounds',       teacher: 'Owl Professor Hoot',  emoji: '🦉' },
  2:  { programme: 'PYP', topic: 'Sentence Builders',       teacher: 'Mayor Grammar',       emoji: '👨\u200d💼' },
  3:  { programme: 'PYP', topic: 'Descriptive Detectives',  teacher: 'Artist Adjective',    emoji: '🎨' },
  4:  { programme: 'PYP', topic: 'Story Architects',        teacher: 'Storyteller Sage',    emoji: '📖' },
  5:  { programme: 'PYP', topic: 'Narrative Masters',       teacher: 'Chief Storyweaver',   emoji: '🪶' },
  6:  { programme: 'MYP', topic: 'Persuasion Power',        teacher: 'Judge Argument',      emoji: '⚖️' },
  7:  { programme: 'MYP', topic: 'Text Detective',          teacher: 'Detective Analogy',   emoji: '🔍' },
  8:  { programme: 'MYP', topic: 'Poetry Quest',            teacher: 'Bard Rhyme',          emoji: '🎭' },
  9:  { programme: 'MYP', topic: 'Media Masters',           teacher: 'Editor Truth',        emoji: '📰' },
  10: { programme: 'MYP', topic: 'Shakespeare Quest',       teacher: 'The Bard',            emoji: '🎭' },
  11: { programme: 'DP',  topic: 'Literary Analysis',       teacher: 'Professor Thesis',    emoji: '🎓' },
  12: { programme: 'DP',  topic: 'Advanced Analysis',       teacher: 'Master Expositor',    emoji: '📚' },
};

const FLOATING_ITEMS = ['📖', '📚', '✒️', '📜', '🪶', '🔤', '📝', '🎭'];
const FLOAT_POSITIONS = [
  { x: '5%',  y: '10%', delay: 0,    dur: 4 },
  { x: '85%', y: '15%', delay: 0.8,  dur: 5 },
  { x: '15%', y: '55%', delay: 1.5,  dur: 3.5 },
  { x: '78%', y: '50%', delay: 0.3,  dur: 4.5 },
  { x: '45%', y: '75%', delay: 1.2,  dur: 3 },
  { x: '92%', y: '70%', delay: 2,    dur: 5.5 },
  { x: '10%', y: '85%', delay: 0.6,  dur: 4 },
  { x: '60%', y: '5%',  delay: 1.8,  dur: 3.8 },
];

export default function ClassroomScene() {
  const router = useRouter();
  const setScene = useEnglishStore(s => s.setScene);
  const currentGrade = useEnglishStore(s => s.currentGrade);
  const userGrade = useProgressStore(s => s.currentGrade);
  const [mounted, setMounted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const [ttsOn, setTtsOn] = useState(gameTTS.enabled);
  const [hovered, setHovered] = useState(false);

  const grade = currentGrade || userGrade || 6;
  const info = GRADE_INFO[grade] || GRADE_INFO[6];

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const unlock = () => {
      setAudioReady(true);
      gameAudio.startBackground('adventure');
      gameTTS.speak(`Welcome to the Library of Words! I am ${info.teacher}. Let us begin our English quest!`);
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    return () => window.removeEventListener('pointerdown', unlock);
  }, [info.teacher]);

  function toggleMusic() {
    const on = gameAudio.toggle();
    setMusicOn(on);
  }

  function toggleTTS() {
    setTtsOn(gameTTS.toggle());
  }

  function handleEnter() {
    gameAudio.playClick();
    gameAudio.playTransition();
    gameTTS.stop();
    setScene('QUEST_MAP');
  }

  if (!mounted) {
    return (
      <div style={{
        minHeight: '100vh', width: '100%',
        background: 'linear-gradient(135deg, #1f1400 0%, #2d1f00 50%, #1a0f00 100%)',
      }} />
    );
  }

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      background: 'linear-gradient(135deg, #1f1400 0%, #2d1f00 50%, #1a0f00 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 16px', position: 'relative', overflow: 'hidden',
    }}>

      {/* Warm particle glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%',
            background: i % 3 === 0 ? '#F59E0B' : i % 3 === 1 ? '#EF4444' : '#FFD700',
            width: 2 + (i % 3), height: 2 + (i % 3),
            left: `${(i * 17.3 + 7) % 100}%`, top: `${(i * 13.7 + 11) % 100}%`,
            opacity: 0.1 + (i % 4) * 0.08,
            animation: `twinkle ${2 + (i % 4)}s ease-in-out ${(i % 6) * 0.5}s infinite`,
          }} />
        ))}
      </div>

      {/* Floating books & scrolls */}
      {FLOATING_ITEMS.map((item, i) => (
        <motion.div
          key={i}
          className="pointer-events-none select-none"
          style={{
            position: 'absolute', fontSize: 20 + (i % 3) * 6,
            left: FLOAT_POSITIONS[i].x, top: FLOAT_POSITIONS[i].y,
            opacity: 0.15, zIndex: 0,
            animation: `float-item ${FLOAT_POSITIONS[i].dur}s ease-in-out ${FLOAT_POSITIONS[i].delay}s infinite`,
          }}
        >
          {item}
        </motion.div>
      ))}

      {/* Audio controls */}
      <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8, zIndex: 10 }}>
        <button onClick={toggleMusic} style={{
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 12, color: musicOn ? '#FFD700' : 'rgba(255,255,255,0.3)',
          fontSize: 18, padding: '6px 10px', cursor: 'pointer',
        }} title={musicOn ? 'Mute music' : 'Unmute music'}>
          {musicOn ? '🎵' : '🔇'}
        </button>
        <button onClick={toggleTTS} style={{
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 12, color: ttsOn ? '#F59E0B' : 'rgba(255,255,255,0.3)',
          fontSize: 18, padding: '6px 10px', cursor: 'pointer',
        }} title={ttsOn ? 'Turn off read-aloud' : 'Turn on read-aloud'}>
          {ttsOn ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Back button */}
      <button onClick={() => router.push('/world-map')}
        style={{
          position: 'absolute', top: 16, left: 16, zIndex: 10,
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 12, color: 'rgba(255,255,255,0.7)', fontSize: 13,
          padding: '6px 14px', cursor: 'pointer', fontWeight: 700,
        }}>
        ← World Map
      </button>

      {/* Main content */}
      <div style={{ textAlign: 'center', marginBottom: 32, position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          style={{ fontSize: 64, marginBottom: 12, filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.5))' }}
        >
          🏰
        </motion.div>

        <h1 style={{
          fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: 36, color: 'white',
          margin: '0 0 8px', textShadow: '0 0 30px rgba(245,158,11,0.6)',
        }}>
          Library of Words
        </h1>
        <p style={{ color: '#FCD34D', fontSize: 14, margin: 0, fontWeight: 600 }}>
          Grade {grade} · {info.programme} · {info.topic}
        </p>
      </div>

      {/* NPC Teacher */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', damping: 15 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative', zIndex: 1, display: 'flex',
          flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 32,
        }}
      >
        <div style={{
          fontSize: 56,
          animation: hovered ? 'teacher-wave 0.4s ease-in-out 3' : 'teacher-idle 3s ease-in-out infinite',
          transformOrigin: 'bottom center',
          filter: 'drop-shadow(0 0 16px rgba(245,158,11,0.6))',
        }}>
          {info.emoji}
        </div>
        <div style={{
          background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 16, padding: '8px 20px', maxWidth: 280,
        }}>
          <p style={{ color: '#FCD34D', fontSize: 13, fontWeight: 700, margin: 0 }}>
            {info.teacher}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, margin: '4px 0 0' }}>
            {hovered
              ? '"Every word is a key to a new world!"'
              : '"Welcome, young reader!"'}
          </p>
        </div>
      </motion.div>

      {/* Enter button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 320 }}
      >
        <button
          onClick={handleEnter}
          onMouseEnter={(e) => {
            gameAudio.playClick();
            (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
            (e.target as HTMLButtonElement).style.boxShadow = '0 0 50px rgba(245,158,11,0.6)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.transform = 'scale(1)';
            (e.target as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(245,158,11,0.4)';
          }}
        >
          📖 Enter the Library
        </button>
      </motion.div>

      <p style={{
        marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.3)',
        position: 'relative', zIndex: 1, textAlign: 'center',
      }}>
        ✨ Choose your quest and master the art of words
      </p>

      <style jsx>{`
        @keyframes twinkle { 0%,100%{opacity:0.1} 50%{opacity:0.7} }
        @keyframes float-item {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes teacher-idle {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes teacher-wave {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
