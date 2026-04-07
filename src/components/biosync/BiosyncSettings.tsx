'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBiosyncStore } from '@/store/biosyncStore';
import type { BiosyncConfig, BiosyncSource } from '@/lib/biosync';

const SOURCE_OPTIONS: { value: BiosyncSource; label: string; emoji: string; desc: string }[] = [
  { value: 'heart-rate', label: 'Heart Rate Monitor', emoji: '❤️', desc: 'Connect a Bluetooth heart rate monitor' },
  { value: 'focus-glasses', label: 'Focus Glasses', emoji: '👓', desc: 'Eye-tracking enabled glasses' },
  { value: 'webcam', label: 'Webcam Detection', emoji: '📷', desc: 'Estimate focus via webcam (experimental)' },
  { value: 'manual', label: 'Manual Input', emoji: '✋', desc: 'Manually report your stress level' },
  { value: 'none', label: 'Disabled', emoji: '⏸️', desc: 'No bio-sync data source' },
];

export default function BiosyncSettings() {
  const { config, currentReading, updateConfig, enableBiosync, disableBiosync, getAverageLoad, getStressTrend } = useBiosyncStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSourceChange = (source: BiosyncSource) => {
    if (source === 'none') {
      disableBiosync();
    } else {
      enableBiosync(source);
    }
  };

  const handleToggleSetting = (key: keyof BiosyncConfig) => {
    updateConfig({ [key]: !config[key] });
  };

  const avgLoad = getAverageLoad(30);
  const trend = getStressTrend();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">🔗 Bio-Sync Integration</h2>
        <p className="text-sm text-gray-400">
          Connect wearable tech to detect cognitive load and auto-adjust your learning experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SOURCE_OPTIONS.map((option) => {
          const isActive = config.source === option.value && config.enabled;
          return (
            <button
              key={option.value}
              onClick={() => handleSourceChange(option.value)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isActive
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 bg-gray-800/30 hover:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{option.emoji}</span>
                <div>
                  <p className="font-semibold text-white text-sm">{option.label}</p>
                  <p className="text-xs text-gray-400">{option.desc}</p>
                </div>
              </div>
              {isActive && (
                <div className="mt-2 text-xs text-purple-300 font-medium">
                  ✓ Active
                </div>
              )}
            </button>
          );
        })}
      </div>

      {config.enabled && config.source !== 'none' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gray-800/50 border border-gray-700"
        >
          <h3 className="font-semibold text-white mb-3">Live Monitoring</h3>

          {currentReading ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Cognitive Load</span>
                <span className={`text-sm font-bold ${
                  currentReading.level === 'low' ? 'text-green-400' :
                  currentReading.level === 'moderate' ? 'text-yellow-400' :
                  currentReading.level === 'high' ? 'text-orange-400' :
                  'text-red-400'
                }`}>
                  {currentReading.level.toUpperCase()} ({currentReading.score}%)
                </span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: currentReading.score < 25 ? '#22C55E' :
                      currentReading.score < 50 ? '#F59E0B' :
                      currentReading.score < 75 ? '#F97316' : '#EF4444',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${currentReading.score}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Confidence: {Math.round(currentReading.confidence * 100)}%</span>
                <span>30min avg: {avgLoad}%</span>
                <span>Trend: {trend}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Waiting for data...</p>
          )}
        </motion.div>
      )}

      <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="font-semibold text-white">⚙️ Advanced Settings</h3>
          <span className="text-gray-400">{showAdvanced ? '▲' : '▼'}</span>
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Auto Brain Break</p>
                  <p className="text-xs text-gray-400">Suggest breaks when cognitive load is high</p>
                </div>
                <button
                  onClick={() => handleToggleSetting('autoBreakEnabled')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    config.autoBreakEnabled ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      config.autoBreakEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Auto Difficulty</p>
                  <p className="text-xs text-gray-400">Adjust difficulty based on stress levels</p>
                </div>
                <button
                  onClick={() => handleToggleSetting('autoDifficultyEnabled')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    config.autoDifficultyEnabled ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      config.autoDifficultyEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="text-sm text-white block mb-1">Heart Rate Threshold (BPM)</label>
                <input
                  type="range"
                  min={60}
                  max={140}
                  value={config.heartRateThreshold}
                  onChange={(e) => updateConfig({ heartRateThreshold: parseInt(e.target.value) })}
                  className="w-full accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>60</span>
                  <span>{config.heartRateThreshold} BPM</span>
                  <span>140</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-white block mb-1">Check Interval</label>
                <select
                  value={config.checkIntervalMs}
                  onChange={(e) => updateConfig({ checkIntervalMs: parseInt(e.target.value) })}
                  className="w-full p-2 rounded-lg bg-gray-700 text-white text-sm border border-gray-600"
                >
                  <option value={15000}>Every 15 seconds</option>
                  <option value={30000}>Every 30 seconds</option>
                  <option value={60000}>Every minute</option>
                  <option value={120000}>Every 2 minutes</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
        <p className="text-xs text-yellow-300">
          🔒 <strong>Privacy:</strong> Bio-sync data is stored locally on your device only. No biometric data is sent to our servers.
          You can disable bio-sync at any time.
        </p>
      </div>
    </div>
  );
}
