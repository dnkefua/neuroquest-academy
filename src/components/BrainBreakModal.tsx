'use client';

import { useState } from 'react';
import { BRAIN_BREAK_ACTIVITIES } from '@/lib/constants';
import BreathingCircle from './BreathingCircle';

type Tab = 'breathing' | 'activity' | 'grounding';

const GROUNDING_PROMPTS = [
  '👀 Name 5 things you can SEE right now...',
  '✋ Name 4 things you can TOUCH around you...',
  '👂 Name 3 things you can HEAR...',
  '👃 Name 2 things you can SMELL...',
  '👅 Name 1 thing you can TASTE...',
];

interface Props {
  onClose: () => void;
}

export default function BrainBreakModal({ onClose }: Props) {
  const [tab, setTab] = useState<Tab>('breathing');
  const [activity] = useState(
    BRAIN_BREAK_ACTIVITIES[Math.floor(Math.random() * BRAIN_BREAK_ACTIVITIES.length)]
  );
  const [groundingStep, setGroundingStep] = useState(0);
  const [stars, setStars] = useState<boolean[]>(Array(5).fill(false));

  function tapStar(i: number) {
    // Web Audio beep
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 300 + i * 80;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch { /* ignore */ }
    const next = [...stars];
    next[i] = true;
    setStars(next);
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-nunito text-xl font-black text-gray-800">🧘 Brain Break</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {/* Tabs */}
        <div className="flex bg-purple-50 rounded-2xl p-1 mb-5 gap-1">
          {([
            { key: 'breathing', label: '🫧 Breathe' },
            { key: 'activity', label: '🎯 Move' },
            { key: 'grounding', label: '🌟 Ground' },
          ] as { key: Tab; label: string }[]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-xl text-xs font-nunito font-bold transition-all ${
                tab === t.key ? 'bg-white text-brand-purple shadow-sm' : 'text-gray-500'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'breathing' && <BreathingCircle />}

        {tab === 'activity' && (
          <div className="text-center">
            <div className="text-6xl mb-4">{activity.emoji}</div>
            <h3 className="font-nunito text-lg font-black text-gray-800 mb-2">{activity.name}</h3>
            <p className="font-dmsans text-gray-600 leading-relaxed mb-6">{activity.instruction}</p>
            <div className="flex justify-center gap-3 mb-4">
              <span className="text-2xl font-bold text-gray-300">Count with me:</span>
            </div>
            <div className="flex justify-center gap-2 mb-4">
              {stars.map((lit, i) => (
                <button
                  key={i}
                  onClick={() => tapStar(i)}
                  className={`text-3xl transition-transform active:scale-125 ${lit ? '' : 'grayscale opacity-40'}`}
                >
                  ⭐
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 font-dmsans">Tap each star as you count!</p>
          </div>
        )}

        {tab === 'grounding' && (
          <div className="text-center">
            <div className="text-5xl mb-4">🌿</div>
            <p className="font-nunito font-black text-gray-800 text-lg mb-3">
              5-4-3-2-1 Grounding
            </p>
            <div className="bg-brand-teal-light rounded-2xl p-5 mb-4 min-h-[80px] flex items-center justify-center">
              <p className="font-dmsans text-teal-800 text-lg font-medium">
                {GROUNDING_PROMPTS[groundingStep]}
              </p>
            </div>
            <div className="flex justify-center gap-2 mb-5">
              {GROUNDING_PROMPTS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i <= groundingStep ? 'bg-brand-teal' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            {groundingStep < GROUNDING_PROMPTS.length - 1 ? (
              <button
                onClick={() => setGroundingStep((s) => s + 1)}
                className="bg-brand-teal text-white font-nunito font-black px-6 py-2.5 rounded-2xl hover:opacity-90 transition-all"
              >
                Done, next →
              </button>
            ) : (
              <div>
                <p className="font-nunito font-bold text-brand-teal text-lg mb-3">
                  🌟 Great job! You&apos;re grounded and present!
                </p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-5 bg-brand-purple text-white font-nunito font-black py-3 rounded-2xl hover:bg-purple-600 active:scale-95 transition-all"
        >
          I feel better! Let&apos;s go 💪
        </button>
      </div>
    </div>
  );
}
