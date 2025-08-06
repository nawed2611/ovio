
'use client';

import { useState } from 'react';
import AudioUploader from '@/components/AudioUploader';
import WaveformCanvas from '@/components/WaveformCanvas';

export default function Home() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    try {
      setAudioFile(file);
    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Error processing audio file. Please try a different file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };


  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Ovio
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Transform your audio into stunning waveform videos. Upload any audio file and create beautiful visualizations inspired by Spotify and ElevenLabs.
          </p>
        </div>

        {/* Upload Section */}
        {!audioFile && (
          <div className="mb-12">
            <AudioUploader onFileSelect={handleFileSelect} isLoading={isLoading} />
          </div>
        )}


        {/* Waveform Visualization */}
        {audioFile && (
          <div className="mb-8">
            <WaveformCanvas
              waveformData={null}
              audioFile={audioFile}
              audioName={audioFile.name}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
            />
          </div>
        )}

        {/* Reset Button */}
        {audioFile && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setAudioFile(null);
                setIsPlaying(false);
              }}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Upload New Audio
            </button>
          </div>
        )}
        </div>
    </div>
  );
}
