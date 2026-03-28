import { NextRequest, NextResponse } from 'next/server';

// Voice configuration — Google Cloud Studio voices
// Studio voices are the highest quality tier: natural prosody, human-like warmth
// They do NOT support pitch modification (ignored by API)
const VOICE_CONFIG: Record<string, { male: string; female: string; rate: number }> = {
  // Grades 1-4: slower pace for comprehension
  '1-4': {
    male: 'en-US-Studio-Q',
    female: 'en-US-Studio-O',
    rate: 0.87,
  },
  // Grades 5-9: natural, engaging pace
  '5-9': {
    male: 'en-US-Studio-Q',
    female: 'en-US-Studio-O',
    rate: 0.95,
  },
  // Grades 10-12: full natural speed
  '10-12': {
    male: 'en-US-Studio-Q',
    female: 'en-US-Studio-O',
    rate: 1.0,
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
        voiceConfig: { rate: config.rate }
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
        // Studio voices don't support pitch — omitted intentionally
        effectsProfileId: ['headphone-class-device'],
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
      voiceConfig: { rate: config.rate }
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