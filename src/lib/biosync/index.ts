export type BiosyncSource = 'heart-rate' | 'focus-glasses' | 'webcam' | 'manual' | 'none';

export interface HeartRateData {
  bpm: number;
  hrv: number;
  timestamp: number;
}

export interface FocusData {
  focusScore: number;
  blinkRate: number;
  gazeDrift: number;
  timestamp: number;
}

export interface CognitiveLoadReading {
  level: 'low' | 'moderate' | 'high' | 'overwhelmed';
  score: number;
  source: BiosyncSource;
  timestamp: number;
  confidence: number;
}

export interface BiosyncConfig {
  enabled: boolean;
  source: BiosyncSource;
  heartRateThreshold: number;
  focusThreshold: number;
  checkIntervalMs: number;
  autoBreakEnabled: boolean;
  autoDifficultyEnabled: boolean;
}

const DEFAULT_CONFIG: BiosyncConfig = {
  enabled: false,
  source: 'none',
  heartRateThreshold: 100,
  focusThreshold: 0.4,
  checkIntervalMs: 30000,
  autoBreakEnabled: true,
  autoDifficultyEnabled: true,
};

export function calculateCognitiveLoad(
  heartRate: HeartRateData | null,
  focus: FocusData | null,
  config: BiosyncConfig
): CognitiveLoadReading {
  if (!config.enabled || config.source === 'none') {
    return { level: 'low', score: 0, source: 'none', timestamp: Date.now(), confidence: 0 };
  }

  let score = 50;
  let confidence = 0.5;

  if (heartRate) {
    const hrStress = Math.max(0, Math.min(1, (heartRate.bpm - 60) / (config.heartRateThreshold - 60)));
    score += hrStress * 30;
    confidence += 0.2;
  }

  if (focus) {
    const focusStress = 1 - focus.focusScore;
    score += focusStress * 20;
    confidence += 0.2;
  }

  score = Math.max(0, Math.min(100, score));

  let level: CognitiveLoadReading['level'];
  if (score < 25) level = 'low';
  else if (score < 50) level = 'moderate';
  else if (score < 75) level = 'high';
  else level = 'overwhelmed';

  return {
    level,
    score: Math.round(score),
    source: config.source,
    timestamp: Date.now(),
    confidence: Math.min(1, confidence),
  };
}

export function shouldSuggestNeuroBreak(reading: CognitiveLoadReading, config: BiosyncConfig): boolean {
  if (!config.autoBreakEnabled) return false;
  return reading.level === 'high' || reading.level === 'overwhelmed';
}

export function getDifficultyAdjustment(reading: CognitiveLoadReading, config: BiosyncConfig): number {
  if (!config.autoDifficultyEnabled) return 0;
  switch (reading.level) {
    case 'overwhelmed': return -0.3;
    case 'high': return -0.15;
    case 'moderate': return 0;
    case 'low': return 0.1;
    default: return 0;
  }
}

export { DEFAULT_CONFIG };
