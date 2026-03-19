// Web Speech API text-to-speech engine for NeuroQuest
// Auto-reads game instructions; can be toggled off by the student

// Lazy import to avoid circular-dep issues at module init time
function getAudio() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return (require('./audio') as { gameAudio: { duck: () => void; unduck: () => void } }).gameAudio;
}

const TTS_STORAGE_KEY = 'nq-tts-enabled';

class TTSEngine {
  private _enabled: boolean;
  private _speaking = false;
  private _keepAlive: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Restore persisted preference
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(TTS_STORAGE_KEY);
      this._enabled = stored === null ? true : stored === 'true';
    } else {
      this._enabled = true;
    }
  }

  get enabled() { return this._enabled; }
  get speaking() { return this._speaking; }

  toggle(): boolean {
    this._enabled = !this._enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TTS_STORAGE_KEY, String(this._enabled));
    }
    if (!this._enabled) this.stop();
    return this._enabled;
  }

  speak(text: string, rate = 0.9, pitch = 1.05) {
    if (!this._enabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    this._doSpeak(text, rate, pitch);
  }

  /** Speak text, then call callback when speech ends (or after fallbackDelay if TTS is off). */
  afterSpeak(text: string, callback: () => void, fallbackDelay = 2000) {
    if (!this._enabled || typeof window === 'undefined' || !window.speechSynthesis) {
      setTimeout(callback, fallbackDelay);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate  = 0.9;
    utter.pitch = 1.05;
    utter.volume = 1;
    utter.onstart = () => { this._speaking = true;  this.startKeepAlive(); getAudio().duck(); };
    utter.onend   = () => { this._speaking = false; this.stopKeepAlive(); getAudio().unduck(); setTimeout(callback, 350); };
    utter.onerror = () => { this._speaking = false; this.stopKeepAlive(); getAudio().unduck(); setTimeout(callback, fallbackDelay); };
    this._assignVoiceAndSpeak(utter);
  }

  stop() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this._speaking = false;
    this.stopKeepAlive();
  }

  private _doSpeak(text: string, rate: number, pitch: number) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate  = rate;
    utter.pitch = pitch;
    utter.volume = 1;
    utter.onstart = () => { this._speaking = true;  this.startKeepAlive(); getAudio().duck(); };
    utter.onend   = () => { this._speaking = false; this.stopKeepAlive();  getAudio().unduck(); };
    utter.onerror = () => { this._speaking = false; this.stopKeepAlive();  getAudio().unduck(); };
    this._assignVoiceAndSpeak(utter);
  }

  private _assignVoiceAndSpeak(utter: SpeechSynthesisUtterance) {
    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ??
        voices.find(v => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Daniel'))) ??
        voices.find(v => v.lang.startsWith('en'));
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

  // Chrome stops speech after ~15s — periodically resume() to prevent it
  private startKeepAlive() {
    this.stopKeepAlive();
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    this._keepAlive = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      } else {
        this.stopKeepAlive();
      }
    }, 10000);
  }

  private stopKeepAlive() {
    if (this._keepAlive) { clearInterval(this._keepAlive); this._keepAlive = null; }
  }
}

export const gameTTS = new TTSEngine();
