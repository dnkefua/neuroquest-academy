// Enhanced TTS engine for NeuroQuest
// Supports Google Cloud TTS with grade-appropriate voices
// Falls back to browser TTS when Cloud TTS unavailable
// v2: Fixed race conditions, echo, and added LRU cache

import { useEffect } from 'react';
import { getGradeGroup, getVoiceForGrade, detectGenderFromName } from '@/lib/tts-cache';

// Lazy import to avoid circular-dep issues at module init time
function getAudio() {
  // eslint-disable-next-line
  return (require('./audio') as { gameAudio: { duck: () => void; unduck: () => void } }).gameAudio;
}

const TTS_STORAGE_KEY = 'nq-tts-enabled';
const SESSION_CALLS_KEY = 'nq-tts-calls';
const MAX_CACHE_SIZE = 100; // LRU cache limit

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

  constructor() {
    // Restore persisted preference
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(TTS_STORAGE_KEY);
      this._enabled = stored === null ? true : stored === 'true';

      // Check session call count
      const sessionCalls = sessionStorage.getItem(SESSION_CALLS_KEY);
      this._sessionCalls = sessionCalls ? parseInt(sessionCalls, 10) : 0;

      // Check if Cloud TTS should be enabled (default: true)
      this._cloudEnabled = process.env.NEXT_PUBLIC_GCP_TTS_ENABLED !== 'false';
    } else {
      this._enabled = true;
    }
  }

  get enabled() { return this._enabled; }
  get speaking() { return this._speaking; }

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

  toggle(): boolean {
    this._enabled = !this._enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TTS_STORAGE_KEY, String(this._enabled));
    }
    if (!this._enabled) this.stop();
    return this._enabled;
  }

  /** Main speak method - tries Cloud TTS, falls back to browser TTS */
  speak(text: string, rate?: number, pitch?: number) {
    if (!this._enabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    // Mark previous speech as aborted and stop
    this._aborted = true;
    this.stop();

    // Use async lock to ensure no overlap between speeches
    this._lock = this._lock.then(async () => {
      // Reset aborted flag for new speech
      this._aborted = false;

      // Try Cloud TTS first if enabled and within rate limit
      if (this._cloudEnabled && this._sessionCalls < this._maxSessionCalls) {
        try {
          await this._speakCloud(text);
          return;
        } catch {
          // Only fall back if not aborted and still enabled
          if (!this._aborted && this._enabled) {
            this._speakBrowser(text, rate, pitch);
          }
        }
      } else {
        // Use browser TTS
        this._speakBrowser(text, rate, pitch);
      }
    }).catch(() => {
      // Lock errors should not propagate
    });
  }

  /** Speak text, then call callback when speech ends */
  afterSpeak(text: string, callback: () => void, fallbackDelay = 2000) {
    if (!this._enabled || typeof window === 'undefined' || !window.speechSynthesis) {
      setTimeout(callback, fallbackDelay);
      return;
    }

    // Mark previous speech as aborted and stop
    this._aborted = true;
    this.stop();

    // Use async lock to ensure no overlap
    this._lock = this._lock.then(async () => {
      this._aborted = false;

      if (this._cloudEnabled && this._sessionCalls < this._maxSessionCalls) {
        try {
          await this._speakCloud(text);
          if (!this._aborted) {
            setTimeout(callback, 350);
          }
        } catch {
          if (!this._aborted && this._enabled) {
            this._speakBrowserWithCallback(text, callback, fallbackDelay);
          }
        }
      } else {
        this._speakBrowserWithCallback(text, callback, fallbackDelay);
      }
    }).catch(() => {
      // Lock errors should not propagate
    });
  }

  stop() {
    this._aborted = true; // Mark as aborted so pending fallbacks don't play
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this._speaking = false;
    this.stopKeepAlive();
  }

  // --- Cloud TTS Methods ---

  private async _speakCloud(text: string): Promise<void> {
    try {
      const gender = this._getGender();
      const cacheKey = `${text}_${this._grade}_${gender}`;

      // Check cache (LRU: move to end if found)
      const cached = this._audioCache.get(cacheKey);
      if (cached) {
        // Move to end for LRU (delete and re-add)
        this._audioCache.delete(cacheKey);
        this._audioCache.set(cacheKey, cached);
        await this._playAudio(cached);
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

        await this._playAudio(data.audio);
      }
    } catch (error) {
      console.warn('Cloud TTS failed, falling back to browser:', error);
      throw error;
    }
  }

  private async _speakCloudWithCallback(text: string, callback: () => void, fallbackDelay: number): Promise<void> {
    try {
      await this._speakCloud(text);
      setTimeout(callback, 350);
    } catch {
      // Only fall back if we're still supposed to speak (not stopped)
      if (this._enabled && !this._speaking) {
        this._speakBrowserWithCallback(text, callback, fallbackDelay);
      }
    }
  }

  private _playAudio(dataUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Stop any previous speech/audio before playing new audio
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      const audio = new Audio(dataUrl);
      audio.volume = 1;

      audio.onplay = () => {
        this._speaking = true;
        this.startKeepAlive();
        getAudio().duck();
      };

      audio.onended = () => {
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

  private _speakBrowser(text: string, rate?: number, pitch?: number) {
    window.speechSynthesis.cancel();

    const voiceConfig = getVoiceForGrade(this._grade, this._getGender());
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate ?? voiceConfig.rate;
    utter.pitch = pitch ?? voiceConfig.pitch;
    utter.volume = 1;

    utter.onstart = () => {
      this._speaking = true;
      this.startKeepAlive();
      getAudio().duck();
    };
    utter.onend = () => {
      this._speaking = false;
      this.stopKeepAlive();
      getAudio().unduck();
    };
    utter.onerror = () => {
      this._speaking = false;
      this.stopKeepAlive();
      getAudio().unduck();
    };

    this._assignVoiceAndSpeak(utter);
  }

  private _speakBrowserWithCallback(text: string, callback: () => void, fallbackDelay: number) {
    window.speechSynthesis.cancel();

    const voiceConfig = getVoiceForGrade(this._grade, this._getGender());
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = voiceConfig.rate;
    utter.pitch = voiceConfig.pitch;
    utter.volume = 1;

    utter.onstart = () => {
      this._speaking = true;
      this.startKeepAlive();
      getAudio().duck();
    };
    utter.onend = () => {
      this._speaking = false;
      this.stopKeepAlive();
      getAudio().unduck();
      setTimeout(callback, 350);
    };
    utter.onerror = () => {
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

/** Strip parenthetical text from question strings — prevents TTS reading emoji alt-text like "(pointing finger up)". */
export function stripParens(text: string): string {
  return text.replace(/\s*\([^)]*\)/g, '').trim();
}