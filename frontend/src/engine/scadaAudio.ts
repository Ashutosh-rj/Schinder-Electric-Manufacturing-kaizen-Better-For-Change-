/**
 * SCADA Industrial Audio Engine (Procedural Web Audio API Synthesizer)
 * Conforms to IEC 60073 / ISA-18.2 DCS audible annunciation standards.
 * Provides realistic acoustic feedback:
 *  - Control Room Ambient Hum & Machine Resonance
 *  - Ball Mill & VRM Heavy Grinding Rumble
 *  - Baghouse Reverse Pulse-Jet Air Blasts
 *  - Equipment Start/Stop Motor Contactors & Variable Frequency Drive Ramping
 *  - Authentic DCS Alarm Beeps & Warning Chimes
 *  - Tactile Click & Toggle Feedback for DCS Pushbuttons
 */

class ScadaAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private millGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private millFilter: BiquadFilterNode | null = null;
  private isInitialized: boolean = false;

  public init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Ambient Background Bus
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      // Mill Grinding Resonance Bus
      this.millGain = this.ctx.createGain();
      this.millGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      this.millGain.connect(this.masterGain);

      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
    }
  }

  private resumeCtx() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.35, this.ctx.currentTime, 0.05);
    }
    if (!muted) {
      this.resumeCtx();
      this.startAmbient();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx && !this.isMuted) {
      const clamped = Math.max(0, Math.min(1, vol));
      this.masterGain.gain.setTargetAtTime(clamped * 0.5, this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Continuous Low Frequency Plant Rumble (Rotary Kiln & Turbines)
   */
  public startAmbient() {
    if (!this.ctx || this.isMuted || this.ambientOsc) return;
    this.resumeCtx();

    try {
      // 55 Hz deep hum
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientOsc.type = 'sawtooth';
      this.ambientOsc.frequency.setValueAtTime(58, this.ctx.currentTime);

      this.ambientFilter = this.ctx.createBiquadFilter();
      this.ambientFilter.type = 'lowpass';
      this.ambientFilter.frequency.setValueAtTime(110, this.ctx.currentTime);
      this.ambientFilter.Q.setValueAtTime(3.5, this.ctx.currentTime);

      this.ambientOsc.connect(this.ambientFilter);
      if (this.ambientGain) {
        this.ambientFilter.connect(this.ambientGain);
      }
      this.ambientOsc.start();
    } catch (e) {
      // ignore
    }
  }

  public stopAmbient() {
    if (this.ambientOsc) {
      try {
        this.ambientOsc.stop();
        this.ambientOsc.disconnect();
      } catch (e) {}
      this.ambientOsc = null;
    }
  }

  /**
   * Tactile Click Sound for SCADA buttons & switches
   */
  public playClick() {
    if (!this.ctx || this.isMuted) return;
    this.resumeCtx();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch (e) {}
  }

  /**
   * Motor Start & VFD Inverter Ramping Sound
   */
  public playStartMotor() {
    if (!this.ctx || this.isMuted) return;
    this.resumeCtx();

    try {
      // Contactor "CLACK"
      this.playContactorClack();

      // VFD High-pitch Inverter Whine ramping up from 80Hz to 480Hz
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(90, this.ctx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.3);

      osc.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);

      osc.start(this.ctx.currentTime + 0.08);
      osc.stop(this.ctx.currentTime + 1.35);
    } catch (e) {}
  }

  /**
   * Motor Stop Contactor
   */
  public playStopMotor() {
    if (!this.ctx || this.isMuted) return;
    this.resumeCtx();

    try {
      this.playContactorClack();

      // Spin down
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime + 0.05);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.85);

      osc.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);

      osc.start(this.ctx.currentTime + 0.05);
      osc.stop(this.ctx.currentTime + 0.9);
    } catch (e) {}
  }

  private playContactorClack() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.setValueAtTime(80, this.ctx.currentTime + 0.02);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    if (this.masterGain) gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.07);
  }

  /**
   * Reverse Pulse-Jet Air Blast (Baghouse cleaning cycle)
   */
  public playPulseJet() {
    if (!this.ctx || this.isMuted) return;
    this.resumeCtx();

    try {
      // Noise burst for pressurized air release
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);

      noise.connect(filter);
      filter.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);

      noise.start();
      noise.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }

  /**
   * Authentic ISA-18.2 DCS Alarm Beep
   */
  public playAlarm(priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH') {
    if (!this.ctx || this.isMuted) return;
    this.resumeCtx();

    try {
      const now = this.ctx.currentTime;
      const freq = priority === 'CRITICAL' ? 880 : priority === 'HIGH' ? 740 : 587;
      const beeps = priority === 'CRITICAL' ? 3 : 2;

      for (let i = 0; i < beeps; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + i * 0.18;
        const endTime = startTime + 0.11;

        osc.type = priority === 'CRITICAL' ? 'square' : 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        if (priority === 'CRITICAL') {
          osc.frequency.setValueAtTime(freq * 1.25, startTime + 0.05);
        }

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.35, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, endTime);

        osc.connect(gain);
        if (this.masterGain) gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(endTime + 0.01);
      }
    } catch (e) {}
  }

  /**
   * Alarm Acknowledged Chime
   */
  public playAlarmAck() {
    if (!this.ctx || this.isMuted) return;
    this.resumeCtx();

    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.08;
        const endTime = startTime + 0.14;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, endTime);

        osc.connect(gain);
        if (this.masterGain) gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(endTime);
      });
    } catch (e) {}
  }
}

export const scadaAudio = new ScadaAudioEngine();
