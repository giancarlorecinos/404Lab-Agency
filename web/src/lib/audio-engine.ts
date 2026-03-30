// Pure Web Audio API — no files downloaded, no build weight.

function createAudioContext(): AudioContext {
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  return new AC();
}

export class AudioEngine {
  analyser: AnalyserNode | null = null;

  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private oscillators: OscillatorNode[] = [];

  async start(): Promise<void> {
    this.ctx = createAudioContext();
    const ctx = this.ctx;
    if (ctx.state === "suspended") await ctx.resume();

    // ── Master chain ──────────────────────────────────────────────────────────
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = 0;

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 32;
    this.analyser.smoothingTimeConstant = 0.8;

    this.masterGain.connect(this.analyser);
    this.analyser.connect(ctx.destination);

    // ── Digital rain noise ────────────────────────────────────────────────────
    // 6-second white noise buffer → band-pass filtered to rain texture
    const SR = ctx.sampleRate;
    const buf = ctx.createBuffer(1, SR * 6, SR);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

    this.noiseSource = ctx.createBufferSource();
    this.noiseSource.buffer = buf;
    this.noiseSource.loop = true;

    // band-pass sculpts white noise into rain body
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 950;
    bp.Q.value = 0.5;

    // high-shelf adds "digital sheen" above 3 kHz
    const shelf = ctx.createBiquadFilter();
    shelf.type = "highshelf";
    shelf.frequency.value = 3000;
    shelf.gain.value = 5;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.3;

    this.noiseSource.connect(bp);
    bp.connect(shelf);
    shelf.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    this.noiseSource.start();

    // ── Sub drone — 45 Hz server hum ─────────────────────────────────────────
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.value = 45;
    const subGain = ctx.createGain();
    subGain.gain.value = 0.18;
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
    humLp.frequency.value = 130;
    const humGain = ctx.createGain();
    humGain.gain.value = 0.055;
    hum.connect(humLp);
    humLp.connect(humGain);
    humGain.connect(this.masterGain);
    hum.start();
    this.oscillators.push(hum);

    // ── Slow LFO — volume breathing (0.07 Hz) ────────────────────────────────
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.04;
    lfo.connect(lfoGain);
    lfoGain.connect(noiseGain.gain);
    lfo.start();
    this.oscillators.push(lfo);

    // ── Fade in over 3 s ──────────────────────────────────────────────────────
    this.masterGain.gain.setValueAtTime(0, ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.72, ctx.currentTime + 3);
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
      this.ctx = null;
      this.masterGain = null;
      this.noiseSource = null;
      this.oscillators = [];
      this.analyser = null;
    }, 1300);
  }

  // High-pitched glitch ping — direct to destination, independent of master vol
  ping(): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(2700, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(820, ctx.currentTime + 0.09);
    env.gain.setValueAtTime(0.06, ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);
    osc.connect(env);
    env.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.17);
  }
}
