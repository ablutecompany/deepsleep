import type { SleepObservationSession, ContaminationReason, SignalQuality } from './types';

export class AcousticSensingEngine {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private intervalId: number | null = null;
  private wakeLock: any = null; // WakeLockSentinel
  
  private startTime: number = 0;
  private volumeHistory: number[] = [];
  private spikesCount: number = 0;

  // Configuration
  private readonly SAMPLE_INTERVAL_MS = 2000; // Analisar volume real a cada 2s
  private readonly FRAGMENTATION_SPIKE_THRESHOLD = 35; // Nível RMS indicativo de perturbação forte na divisão

  public async startSession(): Promise<void> {
    try {
      this.volumeHistory = [];
      this.spikesCount = 0;
      this.startTime = Date.now();

      // 1. Request Microphone
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

      // 2. Setup Audio Engine
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      
      source.connect(this.analyser);
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      // 3. Request Screen Wake Lock (Keep mobile screen on)
      if ('wakeLock' in navigator) {
        try {
          this.wakeLock = await (navigator as any).wakeLock.request('screen');
        } catch (err) {
          console.warn('Wake Lock failed:', err);
        }
      }

      // 4. Start Sampling Loop
      this.intervalId = window.setInterval(() => {
        this.sampleAcousticEnvironment();
      }, this.SAMPLE_INTERVAL_MS);

    } catch (err: any) {
      this.cleanup();
      throw new Error(err.name === 'NotAllowedError' ? 'permission_denied' : 'hardware_failure');
    }
  }

  private sampleAcousticEnvironment() {
    if (!this.analyser || !this.dataArray) return;
    this.analyser.getByteFrequencyData(this.dataArray as any);
    
    // Calcula Root Mean Square (RMS) para volume
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i] * this.dataArray[i];
    }
    const rms = Math.sqrt(sum / this.dataArray.length);
    
    this.volumeHistory.push(rms);

    if (rms > this.FRAGMENTATION_SPIKE_THRESHOLD) {
      this.spikesCount++;
    }
  }

  public stopSession(stopReason: 'user_stopped' | 'os_killed' | 'battery_low' = 'user_stopped'): SleepObservationSession {
    const endTime = Date.now();
    const durationMin = (endTime - this.startTime) / 60000;
    
    this.cleanup();

    let averageRMS = 0;
    if (this.volumeHistory.length > 0) {
      averageRMS = this.volumeHistory.reduce((a, b) => a + b, 0) / this.volumeHistory.length;
    }

    // Determine Quality
    let quality: SignalQuality = 'pristine';
    const contaminations: ContaminationReason[] = [];

    if (durationMin < 30) {
      quality = 'unusable';
      contaminations.push('phone_moved_away'); // Too short to matter
    } else if (averageRMS > 40) {
      // Barulho de fundo permanente altíssimo (ventoinha encostada, ronco constante severo, vizinhos)
      quality = 'degraded';
      contaminations.push('heavy_background_noise');
    }

    if (stopReason === 'os_killed' || stopReason === 'battery_low') {
      quality = 'degraded';
      contaminations.push(stopReason === 'os_killed' ? 'os_kill' : 'low_battery_cutoff');
    }

    // Determine Verdict
    let verdict: 'clean_night' | 'contaminated_night' | 'insufficient_data' = 'clean_night';
    if (quality === 'unusable') verdict = 'insufficient_data';
    else if (contaminations.length > 0) verdict = 'contaminated_night';

    // Prudent Fragmentation Indication
    // We only state fragmentation if session was decently long and we saw many isolated spikes
    // Normalized to 8 hours expected (e.g. 5 spikes in 30 mins -> High, 5 spikes in 8h -> Low)
    const spikesPerHour = durationMin > 0 ? (this.spikesCount / (durationMin / 60)) : 0;

    let dominantDisturbance = null;
    if (quality !== 'unusable') {
      if (contaminations.includes('heavy_background_noise')) {
        dominantDisturbance = 'Rumor basal permanente elevado na divisão.';
      } else if (spikesPerHour > 4) {
        dominantDisturbance = 'Indícios de sucessivos picos/perturbações isoladas.';
      } else {
        dominantDisturbance = 'Divisão acusticamente estável. Sem distúrbios críticos no canal.';
      }
    }

    const session: SleepObservationSession = {
      id: 'sns_' + endTime,
      source: 'phone',
      startedAt: new Date(this.startTime).toISOString(),
      endedAt: new Date(endTime).toISOString(),
      endedReason: stopReason,
      mode: 'acoustic_only',
      permissionState: 'granted',
      capabilityState: 'available',
      qualityState: quality,
      confidence: quality === 'pristine' ? 75 : (quality === 'degraded' ? 40 : 0),
      contaminationReasons: contaminations,
      derivedFeatures: {
        suspectedFragmentationEvents: this.spikesCount,
        environmentalDisturbanceScore: averageRMS, // 0 to 255 theoretical, usually 0-50
        acousticContinuityPercentage: quality === 'unusable' ? 0 : Math.max(0, 100 - (spikesPerHour * 5))
      },
      summary: {
        verdict,
        dominantDisturbance
      },
      linkedNightId: null,
      createdAt: new Date().toISOString()
    };

    return session;
  }

  private cleanup() {
    if (this.intervalId) window.clearInterval(this.intervalId);
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    if (this.wakeLock) {
      this.wakeLock.release().catch(() => {});
    }

    this.intervalId = null;
    this.mediaStream = null;
    this.audioContext = null;
    this.wakeLock = null;
  }
}
