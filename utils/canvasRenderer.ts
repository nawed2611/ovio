import type { WaveformData } from './audioAnalysis';

export interface RenderStyle {
  backgroundColor: string;
  waveformColor: string;
  progressColor: string;
  barWidth: number;
  barSpacing: number;
  smoothness: number;
}

export interface VisualizationConfig {
  style: RenderStyle;
  width: number;
  height: number;
  showProgress: boolean;
  animated: boolean;
}

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId?: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Unable to get 2D context from canvas');
    }
    this.ctx = context;
  }

  renderWaveform(
    waveformData: WaveformData,
    config: VisualizationConfig,
    progress = 0
  ): void {
    const { ctx, canvas } = this;
    const { peaks } = waveformData;
    const { style, width, height } = config;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas with background
    ctx.fillStyle = style.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Calculate bar dimensions
    const totalBars = peaks.length;
    const availableWidth = width - (totalBars - 1) * style.barSpacing;
    const barWidth = Math.max(style.barWidth, availableWidth / totalBars);
    
    const centerY = height / 2;
    const maxBarHeight = height * 0.8;

    // Draw waveform bars
    peaks.forEach((peak, index) => {
      const x = index * (barWidth + style.barSpacing);
      const barHeight = peak * maxBarHeight;
      const y = centerY - barHeight / 2;

      // Determine color based on progress
      const progressPoint = progress * totalBars;
      const isPlayed = index < progressPoint;
      
      ctx.fillStyle = isPlayed ? style.progressColor : style.waveformColor;
      
      // Add rounded corners for modern look
      this.drawRoundedRect(ctx, x, y, barWidth, barHeight, 2);
    });
  }

  renderSpotifyStyle(
    waveformData: WaveformData,
    config: VisualizationConfig,
    progress = 0
  ): void {
    const { ctx, canvas } = this;
    const { peaks } = waveformData;
    const {  width, height } = config;

    canvas.width = width;
    canvas.height = height;

    // Spotify-inspired gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#2D1B69');
    gradient.addColorStop(1, '#121212');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const centerY = height / 2;
    const maxHeight = height * 0.6;
    const barWidth = 3;
    const spacing = 1;
    const totalWidth = peaks.length * (barWidth + spacing);
    const startX = (width - totalWidth) / 2;

    peaks.forEach((peak, index) => {
      const x = startX + index * (barWidth + spacing);
      const barHeight = Math.max(2, peak * maxHeight);
      const y = centerY - barHeight / 2;

      const progressPoint = progress * peaks.length;
      const isPlayed = index < progressPoint;
      
      // Spotify green for played, grey for unplayed
      ctx.fillStyle = isPlayed ? '#1DB954' : '#535353';
      this.drawRoundedRect(ctx, x, y, barWidth, barHeight, 1.5);
    });
  }

  private drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();
  }

  startRecording(): MediaRecorder | null {
    try {
      const stream = this.canvas.captureStream(60); // 60 FPS
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      return recorder;
    } catch (error) {
      console.error('Error starting recording:', error);
      return null;
    }
  }

  destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}