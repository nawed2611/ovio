export interface WaveformData {
  peaks: number[];
  duration: number;
  sampleRate: number;
}

export class AudioAnalyzer {
  private audioContext: AudioContext;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }

  async analyzeAudioFile(file: File): Promise<WaveformData> {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    
    const peaks = this.extractPeaks(audioBuffer, 1000);
    
    return {
      peaks,
      duration: audioBuffer.duration,
      sampleRate: audioBuffer.sampleRate
    };
  }

  private extractPeaks(audioBuffer: AudioBuffer, numPeaks: number): number[] {
    const channelData = audioBuffer.getChannelData(0);
    const blockSize = Math.floor(channelData.length / numPeaks);
    const peaks: number[] = [];

    for (let i = 0; i < numPeaks; i++) {
      let peak = 0;
      const start = i * blockSize;
      const end = Math.min(start + blockSize, channelData.length);
      
      for (let j = start; j < end; j++) {
        peak = Math.max(peak, Math.abs(channelData[j]));
      }
      
      peaks.push(peak);
    }

    return peaks;
  }

  createAudioSource(file: File): HTMLAudioElement {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    return audio;
  }
}