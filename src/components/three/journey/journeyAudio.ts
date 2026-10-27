// High-fidelity procedural Web Audio synth: studio-grade sound without external asset downloads.
// Clean, warm, organic harmonics with tire noise and feedback delay space.

class JourneyAudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private enabled = false;

  // Dual-oscillator engine synthesis
  private engineSubOsc: OscillatorNode | null = null;
  private engineMidOsc: OscillatorNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private engineGain: GainNode | null = null;

  // Procedural drift & tire friction noise
  private noiseBuffer: AudioBuffer | null = null;
  private skidSource: AudioBufferSourceNode | null = null;
  private skidFilter: BiquadFilterNode | null = null;
  private skidGain: GainNode | null = null;

  // Feedback delay line for lush space/reverb
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;

  private lastHit = 0;
  private lastDriftTime = 0;

  private context(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();

      this.master = this.ctx.createGain();
      this.master.gain.value = 0.85;
      this.master.connect(this.ctx.destination);

      // Create 1-second white noise buffer for tire skids & wind rush
      const bufferSize = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      // Create warm feedback delay for celesta bells
      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.value = 0.22;
      this.delayFeedback = this.ctx.createGain();
      this.delayFeedback.gain.value = 0.35;
      this.delayNode.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode);
      this.delayNode.connect(this.master);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  isEnabled() {
    return this.enabled;
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (on) {
      this.context();
      this.startEngine();
      this.initSkidLoop();
    } else {
      this.stopEngine();
      this.stopSkidLoop();
    }
  }

  private startEngine() {
    const ctx = this.context();
    if (!ctx || !this.master || this.engineSubOsc) return;

    // Sub-bass oscillator (thump / engine displacement)
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.value = 42;

    // Mid oscillator (mechanical cylinder cadence)
    const mid = ctx.createOscillator();
    mid.type = "triangle";
    mid.frequency.value = 84;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 240;
    filter.Q.value = 3.0;

    const gain = ctx.createGain();
    gain.gain.value = 0.02;

    sub.connect(filter);
    mid.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);

    sub.start();
    mid.start();

    this.engineSubOsc = sub;
    this.engineMidOsc = mid;
    this.engineFilter = filter;
    this.engineGain = gain;
  }

  private stopEngine() {
    try {
      this.engineSubOsc?.stop();
      this.engineSubOsc?.disconnect();
      this.engineMidOsc?.stop();
      this.engineMidOsc?.disconnect();
    } catch {
      // already stopped
    }
    this.engineSubOsc = null;
    this.engineMidOsc = null;
    this.engineFilter = null;
    this.engineGain = null;
  }

  private initSkidLoop() {
    const ctx = this.context();
    if (!ctx || !this.master || !this.noiseBuffer || this.skidSource) return;

    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 950;
    filter.Q.value = 2.2;

    const gain = ctx.createGain();
    gain.gain.value = 0.0;

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);

    src.start();

    this.skidSource = src;
    this.skidFilter = filter;
    this.skidGain = gain;
  }

  private stopSkidLoop() {
    try {
      this.skidSource?.stop();
      this.skidSource?.disconnect();
    } catch {
      // already stopped
    }
    this.skidSource = null;
    this.skidFilter = null;
    this.skidGain = null;
  }

  /**
   * Modulates engine acoustics in real time based on speed ratio (0..1.5) and throttle.
   */
  updateEngine(speedRatio: number, throttle: boolean) {
    if (!this.enabled || !this.ctx || !this.engineSubOsc || !this.engineMidOsc || !this.engineFilter || !this.engineGain) {
      return;
    }
    const t = this.ctx.currentTime;
    const s = Math.min(1.5, Math.max(0, Math.abs(speedRatio)));

    // Harmonic pitch progression
    const baseFreq = 42 + s * 65 + (throttle ? 12 : 0);
    this.engineSubOsc.frequency.setTargetAtTime(baseFreq, t, 0.08);
    this.engineMidOsc.frequency.setTargetAtTime(baseFreq * 2.0, t, 0.08);

    // Warm resonant filter opening with acceleration
    const cutoff = 200 + s * 700 + (throttle ? 180 : 0);
    this.engineFilter.frequency.setTargetAtTime(cutoff, t, 0.1);

    // Volume curves: quiet idle -> robust roar
    const targetGain = 0.02 + s * 0.045 + (throttle ? 0.015 : 0);
    this.engineGain.gain.setTargetAtTime(targetGain, t, 0.12);
  }

  /**
   * Modulates tire skid / asphalt friction noise during drifts and hard turns.
   */
  updateSkid(intensity: number) {
    if (!this.enabled || !this.ctx || !this.skidGain || !this.skidFilter) return;
    const t = this.ctx.currentTime;
    const clamped = Math.min(1.0, Math.max(0, intensity));

    // When skidding, bandpass filter shifts up with speed and gain rises
    this.skidGain.gain.setTargetAtTime(clamped * 0.075, t, 0.06);
    this.skidFilter.frequency.setTargetAtTime(800 + clamped * 600, t, 0.06);
  }

  /**
   * Rich resonant tone with optional spatial feedback delay.
   */
  private tone(
    freq: number,
    duration: number,
    opts: {
      type?: OscillatorType;
      gain?: number;
      endFreq?: number;
      delay?: number;
      useDelayLine?: boolean;
    } = {}
  ) {
    if (!this.enabled) return;
    const ctx = this.context();
    if (!ctx || !this.master) return;

    const t = ctx.currentTime + (opts.delay ?? 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = opts.type ?? "sine";
    osc.frequency.setValueAtTime(freq, t);
    if (opts.endFreq) {
      osc.frequency.exponentialRampToValueAtTime(opts.endFreq, t + duration);
    }

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(opts.gain ?? 0.08, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(gain);
    gain.connect(this.master);

    // Send to spatial delay line for acoustic depth
    if (opts.useDelayLine && this.delayNode) {
      gain.connect(this.delayNode);
    }

    osc.start(t);
    osc.stop(t + duration + 0.03);
  }

  /**
   * Warm, celebratory celesta chime with subtle spatial reflection.
   */
  playUnlock() {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((f, i) =>
      this.tone(f, 0.42, {
        type: "sine",
        gain: 0.065,
        delay: i * 0.08,
        useDelayLine: true,
      })
    );
  }

  /**
   * Grand victory fanfare chord progression for completing the circuit.
   */
  playVictory() {
    const chords = [
      { f: 523.25, d: 0, dur: 0.3 }, // C5
      { f: 659.25, d: 0.12, dur: 0.3 }, // E5
      { f: 783.99, d: 0.24, dur: 0.35 }, // G5
      { f: 1046.5, d: 0.38, dur: 0.7 }, // C6
      { f: 1318.5, d: 0.52, dur: 0.9 }, // E6
      { f: 1567.98, d: 0.68, dur: 1.2 }, // G6
    ];
    chords.forEach((n) =>
      this.tone(n.f, n.dur, {
        type: "sine",
        gain: 0.075,
        delay: n.d,
        useDelayLine: true,
      })
    );
  }

  /**
   * CARS24 Turbo boost whoosh.
   */
  playBoost() {
    this.tone(140, 0.6, { type: "sawtooth", gain: 0.045, endFreq: 920 });
    this.tone(280, 0.6, { type: "sine", gain: 0.035, endFreq: 1100 });
  }

  /**
   * Physics block impact (resonant clack). Throttled to avoid distortion during pile-ups.
   */
  playHit(strength = 1) {
    const now = performance.now();
    if (now - this.lastHit < 50) return;
    this.lastHit = now;

    this.tone(140 + Math.random() * 80, 0.14, {
      type: "triangle",
      gain: Math.min(0.08, 0.025 + strength * 0.005),
      endFreq: 50,
    });
  }

  /**
   * Grounded suspension / chassis thud.
   */
  playThud() {
    this.tone(85, 0.22, { type: "sine", gain: 0.13, endFreq: 35 });
  }

  /**
   * Studio dual-tone automotive horn blast (F4 + A4 with warm body).
   */
  playHorn() {
    if (!this.enabled) return;
    this.tone(349.23, 0.28, { type: "triangle", gain: 0.065 });
    this.tone(440.0, 0.28, { type: "sawtooth", gain: 0.04 });
    this.tone(523.25, 0.26, { type: "sine", gain: 0.035 });
    this.tone(174.61, 0.22, { type: "sine", gain: 0.045 });
  }

  /**
   * Time-trial sector split confirmation chime.
   */
  playSectorSplit() {
    if (!this.enabled) return;
    this.tone(880, 0.12, { type: "sine", gain: 0.045, useDelayLine: true });
    this.tone(1320, 0.18, { type: "sine", gain: 0.04, delay: 0.07, useDelayLine: true });
  }

  /**
   * Lap finished fanfare.
   */
  playLapComplete() {
    if (!this.enabled) return;
    const notes = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((f, i) =>
      this.tone(f, 0.35, {
        type: "sine",
        gain: 0.055,
        delay: i * 0.09,
        useDelayLine: true,
      })
    );
  }

  /**
   * High-energy record fanfare for new personal best lap time.
   */
  playRecordFanfare() {
    if (!this.enabled) return;
    const chords = [
      { f: 523.25, d: 0, dur: 0.25 },
      { f: 659.25, d: 0.09, dur: 0.25 },
      { f: 783.99, d: 0.18, dur: 0.3 },
      { f: 1046.5, d: 0.28, dur: 0.6 },
      { f: 1318.5, d: 0.42, dur: 0.8 },
    ];
    chords.forEach((c) =>
      this.tone(c.f, c.dur, {
        type: "triangle",
        gain: 0.06,
        delay: c.d,
        useDelayLine: true,
      })
    );
  }

  /**
   * Subtle UI micro-tick for button hovers (Apple Watch digital crown / Leica dial feel).
   */
  playHoverTick() {
    if (!this.enabled) return;
    this.tone(1850, 0.018, { type: "sine", gain: 0.012, endFreq: 1200 });
  }

  /**
   * Crisp tactile mechanical click for buttons and toggles.
   */
  playMechanicalClick() {
    if (!this.enabled) return;
    this.tone(1100, 0.035, { type: "triangle", gain: 0.035, endFreq: 450 });
  }

  /**
   * Soft pneumatic whoosh for sliding panels & drawers.
   */
  playPneumaticWhoosh() {
    if (!this.enabled) return;
    this.tone(180, 0.28, { type: "sine", gain: 0.03, endFreq: 60 });
  }

  /**
   * Cinematic opening chord sweep as the camera crane touches down on the starting grid.
   */
  playIntroFanfare() {
    if (!this.enabled) return;
    const chords = [
      { f: 261.63, d: 0, dur: 0.8 },     // C4 base
      { f: 392.0, d: 0.08, dur: 0.8 },   // G4
      { f: 523.25, d: 0.16, dur: 0.9 },  // C5
      { f: 659.25, d: 0.24, dur: 1.1 },  // E5
      { f: 1046.5, d: 0.35, dur: 1.4 },  // C6
    ];
    chords.forEach((n) =>
      this.tone(n.f, n.dur, {
        type: "sine",
        gain: 0.05,
        delay: n.d,
        useDelayLine: true,
      })
    );
  }

  /**
   * Subtle UI click.
   */
  playClick() {
    this.playMechanicalClick();
  }
}

export const journeyAudio = new JourneyAudioEngine();
