// NeuroQuest Audio Engine
// Background music: real MP3 via HTML Audio
// Sound effects: Web Audio API oscillators

const MUSIC_STORAGE_KEY = 'nq-music-enabled';
const SIGNIN_VOLUME  = 0.28;  // gentle background level
const BG_VOLUME      = 0.55;  // in-game background level

class GameAudioEngine {
  // ── Background MP3 players ──────────────────────────────────────────────
  private bgAudio: HTMLAudioElement | null = null;
  private signinAudio: HTMLAudioElement | null = null;
  private _muted: boolean;
  private _fadeTimer: ReturnType<typeof setInterval> | null = null;

  // ── Web Audio context for SFX ───────────────────────────────────────────
  private ctx: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(MUSIC_STORAGE_KEY);
      this._muted = stored === 'false';
    } else {
      this._muted = false;
    }
  }

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  get muted() { return this._muted; }

  toggle(): boolean {
    this._muted = !this._muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem(MUSIC_STORAGE_KEY, String(!this._muted));
    }
    const active = this._activeAudio();
    if (active) {
      const target = active === this.signinAudio ? SIGNIN_VOLUME : BG_VOLUME;
      active.volume = this._muted ? 0 : target;
    }
    return !this._muted;
  }

  // ── Duck/unduck: fade music out when TTS speaks, back in when done ──────
  duck() {
    const audio = this._activeAudio();
    if (!audio) return;
    this._fadeTo(audio, 0, 350);
  }

  unduck() {
    const audio = this._activeAudio();
    if (!audio || this._muted) return;
    const target = audio === this.signinAudio ? SIGNIN_VOLUME : BG_VOLUME;
    this._fadeTo(audio, target, 600);
  }

  private _activeAudio(): HTMLAudioElement | null {
    if (this.signinAudio && !this.signinAudio.paused) return this.signinAudio;
    if (this.bgAudio     && !this.bgAudio.paused)     return this.bgAudio;
    return null;
  }

  private _fadeTo(audio: HTMLAudioElement, target: number, ms: number) {
    if (this._fadeTimer) { clearInterval(this._fadeTimer); this._fadeTimer = null; }
    const start = audio.volume;
    const diff  = target - start;
    const STEPS = 20;
    const stepMs = ms / STEPS;
    let step = 0;
    this._fadeTimer = setInterval(() => {
      step++;
      audio.volume = Math.max(0, Math.min(1, start + diff * (step / STEPS)));
      if (step >= STEPS) { clearInterval(this._fadeTimer!); this._fadeTimer = null; }
    }, stepMs);
  }

  // ── Sign-in music: Eko_s_World_of_Wonder.mp3 (soft background) ─────────
  playSignIn() {
    if (typeof window === 'undefined') return;
    this.stopBackground();

    if (!this.signinAudio) {
      this.signinAudio = new Audio('/audio/signin.mp3');
      this.signinAudio.loop = true;
    }
    this.signinAudio.currentTime = 0;
    this.signinAudio.volume = this._muted ? 0 : SIGNIN_VOLUME;
    this.signinAudio.play().catch(() => {});
  }

  stopSignIn() {
    if (this.signinAudio && !this.signinAudio.paused) {
      this.signinAudio.pause();
      this.signinAudio.currentTime = 0;
    }
  }

  // ── Background music (in-game): Whispers_of_the_Verdant_Path.mp3 ───────
  startBackground(_theme: 'adventure' | 'desert' = 'adventure') {
    if (typeof window === 'undefined') return;
    this.stopSignIn();
    if (this.bgAudio && !this.bgAudio.paused) return;

    if (!this.bgAudio) {
      this.bgAudio = new Audio('/audio/background.mp3');
      this.bgAudio.loop = true;
    }
    this.bgAudio.volume = this._muted ? 0 : BG_VOLUME;
    this.bgAudio.play().catch(() => {});
  }

  stopBackground() {
    if (this.bgAudio) {
      this.bgAudio.pause();
      this.bgAudio.currentTime = 0;
    }
  }

  // ── SFX ─────────────────────────────────────────────────────────────────

  private playNote(freq: number, vel: number, dur: number, dest: AudioNode, at?: number) {
    const ctx = this.getCtx();
    const t = at ?? ctx.currentTime;
    [1, 2, 3, 4, 5].forEach((h, i) => {
      const gains = [1, 0.4, 0.2, 0.1, 0.05];
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.connect(g); g.connect(dest);
      osc.type = 'sine';
      osc.frequency.value = freq * h;
      const peak = gains[i] * vel;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(peak, t + 0.008);
      g.gain.exponentialRampToValueAtTime(peak * 0.3, t + 0.2);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.start(t); osc.stop(t + dur + 0.05);
    });
  }

  playClick() {
    if (this._muted) return;
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.04);
    g.gain.setValueAtTime(0.12, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.start(); osc.stop(ctx.currentTime + 0.04);
  }

  playCorrect() {
    if (this._muted) return;
    const ctx = this.getCtx();
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.type = 'triangle';
      const t = ctx.currentTime + i * 0.11;
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.28, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.start(t); osc.stop(t + 0.3);
    });
  }

  playWrong() {
    if (this._muted) return;
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4);
    g.gain.setValueAtTime(0.25, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(); osc.stop(ctx.currentTime + 0.4);
  }

  playCollect() {
    if (this._muted) return;
    const ctx = this.getCtx();
    [1046.5, 1318.5, 1568].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.type = 'sine';
      const t = ctx.currentTime + i * 0.07;
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.22, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.start(t); osc.stop(t + 0.2);
    });
  }

  playTransition() {
    if (this._muted) return;
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.35);
    g.gain.setValueAtTime(0.18, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.start(); osc.stop(ctx.currentTime + 0.35);
  }

  playVictory() {
    if (this._muted) return;
    const ctx = this.getCtx();
    const melody = [523.25, 659.25, 783.99, 659.25, 1046.5, 1046.5];
    const durs   = [0.14,   0.14,   0.14,   0.14,   0.35,   0.5];
    let t = ctx.currentTime + 0.05;
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.35, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + durs[i]);
      osc.start(t); osc.stop(t + durs[i] + 0.02);
      t += durs[i];
    });
  }
}

export const gameAudio = new GameAudioEngine();
