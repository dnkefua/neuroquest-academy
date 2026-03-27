import { NextRequest, NextResponse } from 'next/server';

// Voice configuration based on grade level
// Optimized for natural speech with appropriate pacing
const VOICE_CONFIG: Record<string, { male: string; female: string; rate: number; pitch: number }> = {
  // Grades 1-4: Kids-friendly (slower, warm, slightly higher pitch)
  '1-4': {
    male: 'en-US-Neural2-D',
    female: 'en-US-Neural2-F',
    rate: 0.82,  // Slower for comprehension
    pitch: 2.0,  // Slightly higher pitch (Google uses -20.0 to 20.0)
  },
  // Grades 5-9: Middle-grade (clear, engaging, normal pace)
  '5-9': {
    male: 'en-US-Neural2-J',
    female: 'en-US-Neural2-C',
    rate: 0.88,  // Slightly slower than natural for clarity
    pitch: 0,    // Normal pitch
  },
  // Grades 10-12: Young adult (mature, professional, natural pace)
  '10-12': {
    male: 'en-US-Neural2-A',
    female: 'en-US-Neural2-E',
    rate: 0.92,  // Nearly natural pace
    pitch: 0,    // Normal pitch
  },
};

function getVoiceConfig(grade: number) {
  if (grade <= 4) return VOICE_CONFIG['1-4'];
  if (grade <= 9) return VOICE_CONFIG['5-9'];
  return VOICE_CONFIG['10-12'];
}

// LRU Cache implementation for TTS audio
class LRUCache<K, V> {
  private cache: Map<K, V>;
  private maxSize: number;

  constructor(maxSize: number) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    // Remove if exists (to move to end)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // Remove oldest if at capacity
    else if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }

  get size(): number {
    return this.cache.size;
  }
}

const audioCache = new LRUCache<string, string>(100);

function hashKey(text: string, voice: string): string {
  // Simple hash for cache key
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `${voice}_${Math.abs(hash)}_${text.length}`;
}

export async function POST(req: NextRequest) {
  let grade = 6; // Default grade

  try {
    const body = await req.json();
    const { text, grade: bodyGrade = 6, gender } = body;
    grade = bodyGrade;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Validate text length (GCP has limits)
    if (text.length > 5000) {
      return NextResponse.json({ error: 'Text too long (max 5000 chars)' }, { status: 400 });
    }

    const config = getVoiceConfig(grade);
    const selectedGender = gender || (Math.random() > 0.5 ? 'male' : 'female');
    const voiceName = selectedGender === 'male' ? config.male : config.female;

    // Check cache first (LRU handles move-to-end internally)
    const cacheKey = hashKey(text, voiceName);
    const cached = audioCache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ audio: cached, cached: true });
    }

    // Check if GCP TTS is enabled
    const ttsEnabled = process.env.GCP_TTS_ENABLED !== 'false';

    if (!ttsEnabled) {
      // Return fallback flag - client will use browser TTS
      return NextResponse.json({
        error: 'Cloud TTS disabled',
        fallback: true,
        voiceConfig: { rate: config.rate, pitch: config.pitch }
      }, { status: 200 });
    }

    // Check for credentials
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!credentialsPath) {
      console.warn('GCP credentials not set, falling back to browser TTS');
      return NextResponse.json({
        error: 'GCP credentials not configured',
        fallback: true,
        voiceConfig: { rate: config.rate, pitch: config.pitch }
      }, { status: 200 });
    }

    // Dynamic import to avoid build errors if package isn't installed
    const { TextToSpeechClient } = await import('@google-cloud/text-to-speech');

    const client = new TextToSpeechClient();

    const request = {
      input: { text },
      voice: {
        languageCode: 'en-US',
        name: voiceName,
      },
      audioConfig: {
        audioEncoding: 'MP3' as const,
        speakingRate: config.rate,
        pitch: config.pitch,
        // Improve audio quality
        effectsProfileId: ['small-bluetooth-speaker-class-device'],
      },
    };

    const [response] = await client.synthesizeSpeech(request);

    if (!response.audioContent) {
      return NextResponse.json({ error: 'No audio generated' }, { status: 500 });
    }

    // Convert to base64 data URL
    const audioBase64 = Buffer.from(response.audioContent as Uint8Array).toString('base64');
    const audioUrl = `data:audio/mp3;base64,${audioBase64}`;

    // Cache management (LRU handles eviction)
    audioCache.set(cacheKey, audioUrl);

    return NextResponse.json({
      audio: audioUrl,
      cached: false,
      voice: voiceName,
      rate: config.rate
    });

  } catch (error) {
    console.error('TTS API error:', error);

    // Return fallback config on error
    const config = getVoiceConfig(grade);

    return NextResponse.json({
      error: 'TTS generation failed',
      fallback: true,
      voiceConfig: { rate: config.rate, pitch: config.pitch }
    }, { status: 200 });
  }
}

// Pre-warm cache with common phrases (called on server start)
export async function GET() {
  return NextResponse.json({
    status: 'ready',
    cacheSize: audioCache.size,
    voices: VOICE_CONFIG,
  });
}