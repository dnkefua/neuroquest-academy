// Enhanced TTS engine for NeuroQuest
// Supports Google Cloud TTS with grade-appropriate voices
// Falls back to browser TTS when Cloud TTS unavailable
// v2: Fixed race conditions, echo, and added LRU cache

import { useEffect, useState } from 'react';
import { getGradeGroup, getVoiceForGrade, detectGenderFromName } from '@/lib/tts-cache';

// Lazy import to avoid circular-dep issues at module init time
function getAudio() {
  // eslint-disable-next-line
  return (require('./audio') as { gameAudio: { duck: () => void; unduck: () => void } }).gameAudio;
}

const TTS_STORAGE_KEY = 'nq-tts-enabled';
const TTS_VOLUME_STORAGE_KEY = 'nq-tts-volume';
const SESSION_CALLS_KEY = 'nq-tts-calls';
const MAX_CACHE_SIZE = 100; // LRU cache limit
const TTS_CHANGE_EVENT = 'nq-tts-settings';

function isIOSLikeDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const touchPoints = navigator.maxTouchPoints || 0;
  return /iPad|iPhone|iPod/.test(ua) || (platform === 'MacIntel' && touchPoints > 1);
}

class TTSEngine {
  private _enabled: boolean;
  private _speaking = false;
  private _keepAlive: ReturnType<typeof setInterval> | null = null;
  private _grade: number = 6;
  private _userGender: 'male' | 'female' | null = null; // Fixed gender based on user's name
  private _audioCache: Map<string, string> = new Map(); // LRU cache
  private _cloudEnabled: boolean = true;
  private _sessionCalls: number = 0;
  private _maxSessionCalls: number = 50; // Rate limit
  private _lock: Promise<void> = Promise.resolve(); // Async lock to prevent overlap
  private _aborted: boolean = false; // Track if current speech was aborted
  private _requestId: number = 0;
  private _volume: number = 1;
  private _preferBrowser: boolean = false;

  constructor() {
    // Restore persisted preference
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(TTS_STORAGE_KEY);
      this._enabled = stored === null ? true : stored === 'true';
      const storedVolume = localStorage.getItem(TTS_VOLUME_STORAGE_KEY);
      this._volume = storedVolume ? Math.max(0, Math.min(1, Number(storedVolume))) : 1;

      // Check session call count
      const sessionCalls = sessionStorage.getItem(SESSION_CALLS_KEY);
      this._sessionCalls = sessionCalls ? parseInt(sessionCalls, 10) : 0;

      // Check if Cloud TTS should be enabled (default: true)
      this._cloudEnabled = process.env.NEXT_PUBLIC_GCP_TTS_ENABLED !== 'false';
      this._preferBrowser = isIOSLikeDevice();
    } else {
      this._enabled = true;
      this._volume = 1;
    }
  }

  get enabled() { return this._enabled; }
  get speaking() { return this._speaking; }
  get volume() { return this._volume; }

  /** Set current grade for voice selection */
  setGrade(grade: number) {
    this._grade = grade;
  }

  /** Set user's name to determine voice gender (female name = female voice, male name = male voice) */
  setUserName(name: string | null | undefined) {
    this._userGender = detectGenderFromName(name);
  }

  /** Get the gender for TTS voice - uses user's detected gender, defaults to female */
  private _getGender(): 'male' | 'female' {
    return this._userGender || 'female';
  }

  private _emitChange() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(TTS_CHANGE_EVENT));
    }
  }

  setEnabled(enabled: boolean): boolean {
    this._enabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TTS_STORAGE_KEY, String(this._enabled));
    }
    if (!this._enabled) this.stop();
    this._emitChange();
    return this._enabled;
  }

  toggle(): boolean {
    return this.setEnabled(!this._enabled);
  }

  setVolume(value: number): number {
    this._volume = Math.max(0, Math.min(1, value));
    if (typeof window !== 'undefined') {
      localStorage.setItem(TTS_VOLUME_STORAGE_KEY, String(this._volume));
    }
    this._emitChange();
    return this._volume;
  }

  prime() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.resume();
    } catch {
      // Ignore browser-specific preparation failures
    }
  }

  /** Main speak method - tries Cloud TTS, falls back to browser TTS */
  speak(text: string, rate?: number, pitch?: number) {
    if (!this._enabled || typeof window === 'undefined') return;
    const canBrowserSpeak = !!window.speechSynthesis;
    if (!canBrowserSpeak && !this._cloudEnabled) return;
    const cleanText = sanitizeForTTS(text);
    if (!cleanText) return;

    // Mark previous speech as aborted and stop
    this._aborted = true;
    this.stop();
    const requestId = ++this._requestId;

    // Use async lock to ensure no overlap between speeches
    this._lock = this._lock.then(async () => {
      if (requestId !== this._requestId) return;
      // Reset aborted flag for new speech
      this._aborted = false;

      // Try Cloud TTS first if enabled and within rate limit
      if (!this._preferBrowser && this._cloudEnabled && this._sessionCalls < this._maxSessionCalls) {
        try {
          await this._speakCloud(cleanText, requestId);
          return;
        } catch {
          // Only fall back if not aborted and still enabled
          if (!this._aborted && this._enabled && requestId === this._requestId && canBrowserSpeak) {
            this._speakBrowser(cleanText, requestId, rate, pitch);
          }
        }
      } else if (canBrowserSpeak) {
        // Use browser TTS
        this._speakBrowser(cleanText, requestId, rate, pitch);
      }
    }).catch(() => {
      // Lock errors should not propagate
    });
  }

  /** Speak text, then call callback when speech ends */
  afterSpeak(text: string, callback: () => void, fallbackDelay = 2000) {
    if (!this._enabled || typeof window === 'undefined') {
      setTimeout(callback, fallbackDelay);
      return;
    }
    const canBrowserSpeak = !!window.speechSynthesis;
    if (!canBrowserSpeak && !this._cloudEnabled) {
      setTimeout(callback, fallbackDelay);
      return;
    }
    const cleanText = sanitizeForTTS(text);
    if (!cleanText) {
      setTimeout(callback, 50);
      return;
    }

    // Mark previous speech as aborted and stop
    this._aborted = true;
    this.stop();
    const requestId = ++this._requestId;

    // Use async lock to ensure no overlap
    this._lock = this._lock.then(async () => {
      if (requestId !== this._requestId) return;
      this._aborted = false;

      if (!this._preferBrowser && this._cloudEnabled && this._sessionCalls < this._maxSessionCalls) {
        try {
          await this._speakCloud(cleanText, requestId);
          if (!this._aborted && requestId === this._requestId) {
            setTimeout(callback, 350);
          }
        } catch {
          if (!this._aborted && this._enabled && requestId === this._requestId && canBrowserSpeak) {
            this._speakBrowserWithCallback(cleanText, requestId, callback, fallbackDelay);
          }
        }
      } else if (canBrowserSpeak) {
        this._speakBrowserWithCallback(cleanText, requestId, callback, fallbackDelay);
      } else {
        setTimeout(callback, fallbackDelay);
      }
    }).catch(() => {
      // Lock errors should not propagate
    });
  }

  stop() {
    this._aborted = true; // Mark as aborted so pending fallbacks don't play
    this._requestId += 1;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this._speaking = false;
    this.stopKeepAlive();
  }

  // --- Cloud TTS Methods ---

  private async _speakCloud(text: string, requestId: number): Promise<void> {
    try {
      const gender = this._getGender();
      const cacheKey = `${text}_${this._grade}_${gender}`;

      // Check cache (LRU: move to end if found)
      const cached = this._audioCache.get(cacheKey);
      if (cached) {
        // Move to end for LRU (delete and re-add)
        this._audioCache.delete(cacheKey);
        this._audioCache.set(cacheKey, cached);
        await this._playAudio(cached, requestId);
        return;
      }

      // Call TTS API
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, grade: this._grade, gender }),
      });

      if (!response.ok) {
        throw new Error('TTS API failed');
      }

      const data = await response.json();

      if (data.fallback) {
        // API suggests fallback to browser TTS
        throw new Error('Fallback requested');
      }

      if (data.audio) {
        // LRU cache management: remove oldest if at capacity
        if (this._audioCache.size >= MAX_CACHE_SIZE) {
          const oldestKey = this._audioCache.keys().next().value;
          if (oldestKey) this._audioCache.delete(oldestKey);
        }
        this._audioCache.set(cacheKey, data.audio);
        this._sessionCalls++;
        sessionStorage.setItem(SESSION_CALLS_KEY, String(this._sessionCalls));

        await this._playAudio(data.audio, requestId);
      }
    } catch (error) {
      console.warn('Cloud TTS failed, falling back to browser:', error);
      throw error;
    }
  }

  private async _speakCloudWithCallback(text: string, requestId: number, callback: () => void, fallbackDelay: number): Promise<void> {
    try {
      await this._speakCloud(text, requestId);
      if (requestId === this._requestId && !this._aborted) {
        setTimeout(callback, 350);
      }
    } catch {
      // Only fall back if we're still supposed to speak (not stopped)
      if (this._enabled && !this._speaking && requestId === this._requestId) {
        this._speakBrowserWithCallback(text, requestId, callback, fallbackDelay);
      }
    }
  }

  private _playAudio(dataUrl: string, requestId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (requestId !== this._requestId || this._aborted) {
        resolve();
        return;
      }

      // Stop any previous speech/audio before playing new audio
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      const audio = new Audio(dataUrl);
      audio.volume = this._volume;

      audio.onplay = () => {
        if (requestId !== this._requestId || this._aborted) {
          audio.pause();
          resolve();
          return;
        }
        this._speaking = true;
        this.startKeepAlive();
        getAudio().duck();
      };

      audio.onended = () => {
        if (requestId !== this._requestId) {
          resolve();
          return;
        }
        this._speaking = false;
        this.stopKeepAlive();
        getAudio().unduck();
        resolve();
      };

      audio.onerror = () => {
        this._speaking = false;
        this.stopKeepAlive();
        getAudio().unduck();
        reject(new Error('Audio playback failed'));
      };

      audio.play().catch(reject);
    });
  }

  // --- Browser TTS Methods (Fallback) ---

  private _speakBrowser(text: string, requestId: number, rate?: number, pitch?: number) {
    if (requestId !== this._requestId || this._aborted) return;
    window.speechSynthesis.cancel();

    const voiceConfig = getVoiceForGrade(this._grade, this._getGender());
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate ?? voiceConfig.rate;
    utter.pitch = pitch ?? voiceConfig.pitch;
    utter.volume = this._volume;

    utter.onstart = () => {
      if (requestId !== this._requestId || this._aborted) {
        window.speechSynthesis.cancel();
        return;
      }
      this._speaking = true;
      this.startKeepAlive();
      getAudio().duck();
    };
    utter.onend = () => {
      if (requestId !== this._requestId) return;
      this._speaking = false;
      this.stopKeepAlive();
      getAudio().unduck();
    };
    utter.onerror = () => {
      if (requestId !== this._requestId) return;
      this._speaking = false;
      this.stopKeepAlive();
      getAudio().unduck();
    };

    this._assignVoiceAndSpeak(utter);
  }

  private _speakBrowserWithCallback(text: string, requestId: number, callback: () => void, fallbackDelay: number) {
    if (requestId !== this._requestId || this._aborted) return;
    window.speechSynthesis.cancel();

    const voiceConfig = getVoiceForGrade(this._grade, this._getGender());
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = voiceConfig.rate;
    utter.pitch = voiceConfig.pitch;
    utter.volume = this._volume;

    utter.onstart = () => {
      if (requestId !== this._requestId || this._aborted) {
        window.speechSynthesis.cancel();
        return;
      }
      this._speaking = true;
      this.startKeepAlive();
      getAudio().duck();
    };
    utter.onend = () => {
      if (requestId !== this._requestId || this._aborted) return;
      this._speaking = false;
      this.stopKeepAlive();
      getAudio().unduck();
      setTimeout(callback, 350);
    };
    utter.onerror = () => {
      if (requestId !== this._requestId || this._aborted) return;
      this._speaking = false;
      this.stopKeepAlive();
      getAudio().unduck();
      setTimeout(callback, fallbackDelay);
    };

    this._assignVoiceAndSpeak(utter);
  }

  private _assignVoiceAndSpeak(utter: SpeechSynthesisUtterance) {
    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices();

      // Grade-appropriate voice selection
      const gradeGroup = getGradeGroup(this._grade);

      // Try to find a voice that matches the grade group preference
      const preferred =
        // Try Neural2 voices first (if available in browser)
        voices.find(v => v.lang.startsWith('en') && v.name.includes('Neural2')) ??
        // Then Google voices
        voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ??
        // Kids: prefer higher-pitched friendly voices
        (gradeGroup === '1-4' ? voices.find(v => v.lang.startsWith('en') && /Samantha|Karen|Moira/i.test(v.name)) : null) ??
        // Middle: prefer clear voices
        (gradeGroup === '5-9' ? voices.find(v => v.lang.startsWith('en') && /Daniel|Alex|Tom/i.test(v.name)) : null) ??
        // Young adult: any professional voice
        voices.find(v => v.lang.startsWith('en')) ??
        voices[0];

      if (preferred) utter.voice = preferred;
      window.speechSynthesis.speak(utter);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', trySpeak, { once: true });
    } else {
      trySpeak();
    }
  }

  // Chrome stops speech after ~15s — use gentle keepalive to prevent cutoff
  // Instead of pause/resume (which causes artifacts), we use a gentler approach
  private startKeepAlive() {
    this.stopKeepAlive();
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    this._keepAlive = setInterval(() => {
      // Only act if still speaking
      if (window.speechSynthesis.speaking) {
        // Gentle resume without pause - helps prevent Chrome's 15s cutoff
        // without causing audible artifacts
        try {
          window.speechSynthesis.resume();
        } catch {
          // Resume can throw if speech ended, ignore
        }
      } else {
        this.stopKeepAlive();
      }
    }, 14000); // Just before Chrome's ~15s cutoff
  }

  private stopKeepAlive() {
    if (this._keepAlive) {
      clearInterval(this._keepAlive);
      this._keepAlive = null;
    }
  }

  /**
   * Get a cleanup function for useEffect hooks.
   * Call this in useEffect return to ensure TTS stops on unmount.
   *
   * @example
   * useEffect(() => {
   *   gameTTS.speak(text);
   *   return gameTTS.getCleanupFn();
   * }, [text]);
   */
  getCleanupFn(): () => void {
    return () => {
      this._aborted = true;
      this.stop();
    };
  }
}

export const gameTTS = new TTSEngine();

/** Stop TTS on component unmount. Call at the top of any component that uses gameTTS. */
export function useTTSCleanup(): void {
  useEffect(() => () => gameTTS.stop(), []);
}

export function useTTSSettings() {
  const [enabled, setEnabledState] = useState(gameTTS.enabled);
  const [volume, setVolumeState] = useState(gameTTS.volume);

  useEffect(() => {
    const sync = () => {
      setEnabledState(gameTTS.enabled);
      setVolumeState(gameTTS.volume);
    };

    sync();
    if (typeof window !== 'undefined') {
      window.addEventListener(TTS_CHANGE_EVENT, sync);
      return () => window.removeEventListener(TTS_CHANGE_EVENT, sync);
    }
  }, []);

  return {
    enabled,
    volume,
    setEnabled: (value: boolean) => gameTTS.setEnabled(value),
    toggle: () => gameTTS.toggle(),
    setVolume: (value: number) => gameTTS.setVolume(value),
    prime: () => gameTTS.prime(),
  };
}

/**
 * Replace math expressions with TTS-friendly text so "5 - 10" is read as
 * "five minus ten" not "five to ten", and "-6 + 4" reads as
 * "negative six plus four".
 */
function replaceMathForTTS(text: string): string {
  return text
    // Subtraction between digits: "5-10" or "5 - 10" → "5 minus 10"
    .replace(/(\d)\s*-\s*(\d)/g, '$1 minus $2')
    // Negative numbers after word boundary, (, =, +, *, /, etc.
    // eslint-disable-next-line
    .replace(/((?:^|[\s(,;:!?=+\/*×])\s*-)\s*(\d+)/g, '$1negative $2');
}

export function sanitizeForTTS(text: string): string {
  return replaceMathForTTS(text)
    .replace(/\s*\([^)]*\)/g, ' ')
    .replace(/[\uD83C-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .replace(/[☀-➿]/g, ' ')
    .replace(/[<>[\]{}]/g, ' ')
    .replace(/[â€¢Â·]/g, ', ')
    .replace(/[←-⇿]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Strip decorative markup from question strings before sending them to TTS. */
export function stripParens(text: string): string {
  return sanitizeForTTS(text);
}
