'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { gameTTS, useTTSSettings } from './tts';

type ReaderControlsProps = {
  accent?: string;
};

export default function ReaderControls({ accent = '#14b8a6' }: ReaderControlsProps) {
  const { enabled, volume, setEnabled, setVolume, prime } = useTTSSettings();
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="pointer-events-auto absolute left-2 top-2 z-40 w-[min(190px,calc(100vw-16px))] rounded-2xl border border-white/10 bg-[rgba(7,12,20,0.88)] p-2 shadow-[0_18px_60px_rgba(0,0,0,0.32)] backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setExpanded((value) => !value)}
          className="rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 text-left"
          title={expanded ? 'Hide reader settings' : 'Show reader settings'}
        >
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">Reader</p>
          <p className="text-xs font-semibold text-white">{enabled ? 'On' : 'Off'}</p>
        </button>

        <button
          onClick={() => {
            prime();
            setEnabled(!enabled);
          }}
          className="relative h-7 w-12 rounded-full transition-colors"
          style={{ background: enabled ? accent : 'rgba(255,255,255,0.14)' }}
          aria-label={enabled ? 'Turn reading AI off' : 'Turn reading AI on'}
          title={enabled ? 'Turn reading AI off' : 'Turn reading AI on'}
        >
          <span
            className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all"
            style={{ left: enabled ? 25 : 4 }}
          />
        </button>
      </div>

      {expanded && (
        <>
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-white/70">
              <span>Reader volume</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={Math.round(volume * 100)}
              onChange={(event) => {
                prime();
                setVolume(Number(event.target.value) / 100);
              }}
              className="w-full accent-[var(--reader-accent)]"
              style={{ ['--reader-accent' as string]: accent }}
              aria-label="Reader volume"
            />
          </div>

          <button
            onClick={() => {
              prime();
              if (!enabled) {
                setEnabled(true);
              }
              gameTTS.speak('Read aloud is ready.');
            }}
            className="mt-3 w-full rounded-2xl px-3 py-2 text-xs font-black text-slate-950 transition-all hover:scale-[1.01]"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
          >
            Test Voice
          </button>
        </>
      )}
    </motion.div>
  );
}
