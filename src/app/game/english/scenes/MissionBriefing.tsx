'use client';

import { motion } from 'framer-motion';
import { useEnglishStore, getQuestById } from '../store/gameStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { gameTTS, useTTSCleanup } from '../../shared/tts';
import CountdownBar from '../../shared/CountdownBar';
import { gameAudio } from '../../shared/audio';
import { useEffect, useState } from 'react';

export default function MissionBriefing() {
  const { currentQuestId, setScene } = useEnglishStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const grade = parseInt(searchParams.get('grade') || '6', 10);
  const [ttsOn, setTtsOn] = useState(gameTTS.enabled);
  // Cleanup TTS on unmount
  useTTSCleanup();

  const quest = getQuestById(currentQuestId, grade);

  useEffect(() => {
    if (quest) {
      gameTTS.speak(`${quest.briefingTitle}. ${quest.briefingDescription}`);
      return () => gameTTS.stop(); // Stop TTS on unmount
    }
  }, [quest]);

  if (!quest) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1f1400 0%, #2d1f00 100%)' }}>
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const handleStart = () => {
    gameAudio.playClick();
    gameTTS.stop();
    setScene('QUIZ');
  };

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: `linear-gradient(135deg, ${quest.color}22 0%, #1a0f00 100%)` }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10"
        style={{ background: 'rgba(0,0,0,0.3)' }}>
        <button onClick={() => { gameTTS.stop(); setScene('QUEST_MAP'); }}
          className="text-sm font-bold text-gray-400 hover:text-white transition-all">
          ← Back
        </button>
        <span className="text-xs text-gray-400">Grade {grade} English</span>
        <button onClick={() => setTtsOn(gameTTS.toggle())}
          className="w-9 h-9 rounded-full flex items-center justify-center text-base"
          style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${ttsOn ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.15)'}` }}>
          {ttsOn ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-6">

          {/* Character */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 12 }}
            className="text-8xl mb-4">
            {quest.teacherEmoji}
          </motion.div>

          {/* Title */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: quest.color }}>
              {quest.difficulty} Quest
            </p>
            <h1 className="font-black text-white text-3xl" style={{ fontFamily: 'Georgia, serif' }}>
              {quest.briefingTitle}
            </h1>
            <p className="text-gray-300 text-sm mt-2">{quest.briefingDescription}</p>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3 text-center"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-2xl">📖</span>
              <p className="text-white font-bold text-sm mt-1">{quest.locationName}</p>
              <p className="text-gray-400 text-xs">{quest.questions.length} Questions</p>
            </div>
            <div className="rounded-xl p-3 text-center"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-2xl">{quest.teacherEmoji}</span>
              <p className="text-white font-bold text-sm mt-1">{quest.teacherName}</p>
              <p className="text-gray-400 text-xs">Your Guide</p>
            </div>
          </div>

          <CountdownBar seconds={5} color1={quest.color} color2="#EF4444" />

          {/* Start button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={handleStart}
            className="w-full py-4 rounded-2xl font-bold text-white text-lg relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${quest.color}, #EF4444)` }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}>
            <span className="relative z-10">📖 Start Reading Quest</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}