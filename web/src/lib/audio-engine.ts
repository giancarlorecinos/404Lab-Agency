// Pure Web Audio API — no files downloaded, no build weight.
//
// IMPORTANT: AudioEngine must be instantiated synchronously inside a user
// gesture handler (onClick). The constructor calls new AudioContext() which
// browsers block if called outside a gesture or inside an async/await chain.

export class AudioEngine {
  analyser: AnalyserNode | null = null;

  // ctx is created synchronously in the constructor — must be called from a
  // direct user-gesture handler, not from inside an async function.
  readonly ctx: AudioContext;

  private masterGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private oscillators: OscillatorNode[] = [];

  constructor() {
    const AC =
      window.AudioContext ??
      (
        window as unknown as {
          webkitAudioContext: typeof AudioContext;
        }
      ).webkitAudioContext;
    this.ctx = new AC();
  }

  async start(): Promise<void> {
    const ctx = this.ctx;

    // Resume unconditionally — some browsers start suspended even on click.
    await ctx.resume();

    // Play a 1-frame silent buffer to fully "unlock" the audio subsystem.
    const unlock = ctx.createBufferSource();
    unlock.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    unlock.connect(ctx.destination);
    unlock.start(0);

    // ── Master chain ──────────────────────────────────────────────────────────
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = 0;

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 32;
    this.analyser.smoothingTimeConstant = 0.8;

    this.masterGain.connect(this.analyser);
    this.analyser.connect(ctx.destination);

    // ── Connection confirmation tone (bypasses master gain — heard instantly) ─
    // A short descending sweep confirms audio works before the 3 s fade-in.
    const confirmOsc = ctx.createOscillator();
    const confirmEnv = ctx.createGain();
    confirmOsc.type = "sine";
    confirmOsc.frequency.setValueAtTime(880, ctx.currentTime);
    confirmOsc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.35);
    confirmEnv.gain.setValueAtTime(0.18, ctx.currentTime);
    confirmEnv.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    confirmOsc.connect(confirmEnv);
    confirmEnv.connect(ctx.destination);
    confirmOsc.start();
    confirmOsc.stop(ctx.currentTime + 0.4);

    // ── Digital rain noise ────────────────────────────────────────────────────
    // 6-second white noise buffer → high-pass + low-pass = broadband rain body
    const SR = ctx.sampleRate;
    const buf = ctx.createBuffer(1, SR * 6, SR);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

    this.noiseSource = ctx.createBufferSource();
    this.noiseSource.buffer = buf;
    this.noiseSource.loop = true;

    // High-pass at 200 Hz removes rumble; low-pass at 5 kHz keeps rain texture
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 200;

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 5000;

    // Slight presence boost around 2 kHz for the "digital sheen"
    const peak = ctx.createBiquadFilter();
    peak.type = "peaking";
    peak.frequency.value = 2000;
    peak.gain.value = 5;
    peak.Q.value = 1;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.55;

    this.noiseSource.connect(hp);
    hp.connect(lp);
    lp.connect(peak);
    peak.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    this.noiseSource.start();

    // ── Sub drone — 45 Hz server-room hum ────────────────────────────────────
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.value = 45;
    const subGain = ctx.createGain();
    subGain.gain.value = 0.22;
    sub.connect(subGain);
    subGain.connect(this.masterGain);
    sub.start();
    this.oscillators.push(sub);

    // ── Data hum — 88 Hz sawtooth (lowpass filtered) ─────────────────────────
    const hum = ctx.createOscillator();
    hum.type = "sawtooth";
    hum.frequency.value = 88;
    const humLp = ctx.createBiquadFilter();
    humLp.type = "lowpass";
    humLp.frequency.value = 140;
    const humGain = ctx.createGain();
    humGain.gain.value = 0.08;
    hum.connect(humLp);
    humLp.connect(humGain);
    humGain.connect(this.masterGain);
    hum.start();
    this.oscillators.push(hum);

    // ── Slow LFO — natural volume breathing ──────────────────────────────────
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.06;
    lfo.connect(lfoGain);
    lfoGain.connect(noiseGain.gain);
    lfo.start();
    this.oscillators.push(lfo);

    // ── Fade in ambient over 3 s ──────────────────────────────────────────────
    this.masterGain.gain.setValueAtTime(0, ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 3);
  }

  stop(): void {
    const { ctx, masterGain } = this;
    if (!ctx || !masterGain) return;

    masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);

    setTimeout(() => {
      try {
        this.noiseSource?.stop();
        this.oscillators.forEach((o) => o.stop());
        ctx.close();
      } catch (_) { /* already cleaned up */ }
      this.masterGain = null;
      this.noiseSource = null;
      this.oscillators = [];
      this.analyser = null;
    }, 1300);
  }

  // High-pitched glitch ping — bypasses master gain for instant response
  ping(): void {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(2700, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(820, ctx.currentTime + 0.09);
    env.gain.setValueAtTime(0.07, ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
    osc.connect(env);
    env.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  }
}
