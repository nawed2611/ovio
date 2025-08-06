'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface WaveformCanvasProps {
  waveformData: unknown | null;
  audioFile: File | null;
  audioName: string;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export default function WaveformCanvas({ 
  audioFile,
  audioName,
  isPlaying, 
  onPlayPause 
}: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationRef = useRef<number | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (audioFile && audioRef.current) {
      const setupAudio = async () => {
        setIsLoading(true);
        try {
          // Set audio source first
          const url = URL.createObjectURL(audioFile);
          if (!audioRef.current) return;
          audioRef.current.src = url;
          
          // Wait for audio to load metadata
          await new Promise<void>((resolve, reject) => {
            const audio = audioRef.current;
            if (!audio) {
              reject(new Error('Audio element not available'));
              return;
            }
            
            const onLoadedMetadata = () => {
              setDuration(audio.duration || 0);
              audio.removeEventListener('loadedmetadata', onLoadedMetadata);
              audio.removeEventListener('error', onError);
              resolve();
            };
            
            const onError = () => {
              audio.removeEventListener('loadedmetadata', onLoadedMetadata);
              audio.removeEventListener('error', onError);
              reject(new Error('Failed to load audio'));
            };
            
            audio.addEventListener('loadedmetadata', onLoadedMetadata);
            audio.addEventListener('error', onError);
            
            // Load the audio
            audio.load();
          });
          
          // Set up time update listener
          if (audioRef.current) {
            audioRef.current.addEventListener('timeupdate', () => {
              if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime || 0);
              }
            });
          }
          
          setIsLoading(false);
        } catch (error) {
          console.error('Error setting up audio:', error);
          setIsLoading(false);
        }
      };
      
      setupAudio();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
      }
    };
  }, [audioFile]);

  // Setup audio context and analyzer when needed
  const setupAudioContext = useCallback(async () => {
    if (!audioRef.current || audioContextRef.current) return;
    
    try {
      // Create audio context (must be done after user interaction)
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      
      // Resume context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      // Create analyzer with higher resolution
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 1024;
      analyserRef.current.smoothingTimeConstant = 0.8;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      // Create audio source only once
      if (!sourceNodeRef.current) {
        sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
    } catch (error) {
      console.error('Error setting up audio context:', error);
    }
  }, []);

  // Enhanced animation function for sharper, full-width waveforms
  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    
    if (!canvas || !analyser || !dataArray) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      analyser.getByteFrequencyData(dataArray);
      
      // Clear canvas with deep black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add audio name at top left with Geist Mono font
      ctx.font = '32px "Geist Mono", "Monaco", "Consolas", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(audioName, 40, 40);
      
      // Add "made by ovio" brand at bottom right
      ctx.font = '24px "Geist Mono", "Monaco", "Consolas", monospace';
      ctx.fillStyle = '#888888';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText('made by ovio', canvas.width - 40, canvas.height - 40);
      
      // Calculate dimensions for full-width coverage
      const centerY = canvas.height / 2;
      const maxBarHeight = canvas.height * 0.5; // Use 80% of canvas height
      
      // Use only a portion of frequency data for better visual range
      const usefulDataLength = Math.min(dataArray.length * 0.6, 128); // Focus on lower frequencies
      const actualBarWidth = canvas.width / usefulDataLength;
      
      for (let i = 0; i < usefulDataLength; i++) {
        const barHeight = (dataArray[i] / 255) * maxBarHeight;
        const x = i * actualBarWidth;
        
        // Skip very low values for cleaner look
        if (barHeight < 2) continue;
        
        // Create enhanced gradient for sharper, more vibrant bars
        const gradient = ctx.createLinearGradient(0, centerY - barHeight/2, 0, centerY + barHeight/2);
        gradient.addColorStop(0, '#00ff87'); // Bright green top
        gradient.addColorStop(0.3, '#1DB954'); // Spotify green
        gradient.addColorStop(0.7, '#1ed760'); // Brighter middle
        gradient.addColorStop(1, '#00ff87'); // Bright green bottom
        
        ctx.fillStyle = gradient;
        
        // Draw sharp bars extending from center, with full width coverage
        const barX = Math.floor(x); // Pixel-perfect positioning
        const barWidthRounded = Math.ceil(actualBarWidth); // Ensure no gaps
        const barTop = centerY - barHeight / 2;
        const barHeightRounded = Math.max(1, Math.floor(barHeight));
        
        ctx.fillRect(barX, barTop, barWidthRounded, barHeightRounded);
        
        // Add subtle glow effect for sharper appearance
        if (barHeight > 10) {
          ctx.shadowColor = '#1DB954';
          ctx.shadowBlur = 2;
          ctx.fillRect(barX, barTop, barWidthRounded, barHeightRounded);
          ctx.shadowBlur = 0; // Reset shadow
        }
      }
    };
    
    animate();
  }, [audioName]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // Setup audio context first (required for user interaction)
        setupAudioContext().then(() => {
          // Play audio with proper error handling
          audioRef.current?.play().catch((error) => {
            console.error('Error playing audio:', error);
            // Reset playing state if playback fails
            onPlayPause();
          });
          
          // Start animation if audio context is ready
          if (analyserRef.current) {
            startAnimation();
          }
        });
      } else {
        audioRef.current.pause();
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      }
    }
  }, [isPlaying, startAnimation, setupAudioContext,onPlayPause]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!audioFile) {
    return (
      <div className="w-full h-[400px] bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Upload an audio file to see the waveform</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Square Canvas Container */}
      <div className="relative bg-black rounded-2xl overflow-hidden aspect-square">
        
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="text-white font-medium">Loading audio...</div>
          </div>
        )}
        
        {/* Canvas for Waveform Animation */}
        <canvas 
          ref={canvasRef}
          width={1200}
          height={1200}
          className="w-full h-full"
          style={{ imageRendering: 'crisp-edges' }}
        />
        
        {/* Hidden Audio Element */}
        <audio ref={audioRef} style={{ display: 'none' }}>
          <track kind="captions" label="Audio visualization" />
        </audio>
        
        {/* Play/Pause Overlay */}
        <button
          type="button"
          onClick={onPlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <div className="bg-white/90 rounded-full p-4">
            {isPlaying ? (
              <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </div>
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={onPlayPause}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Real-time Audio Visualization
        </div>
      </div>
    </div>
  );
}