"use client";

import { useRouter } from 'next/navigation';
import { useAudio } from "@/components/AudioContext";
import WaveformCanvas from "@/components/WaveformCanvas";
import ShaderBackground from "@/components/ShaderBackground";

export default function Waveform() {
const { audioFile, isPlaying, setIsPlaying, setAudioFile } = useAudio();
const router = useRouter();

const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
};

const handleBackToUploader = () => {
        router.push('/upload');
        setAudioFile(null);
        setIsPlaying(false);
};

return (
  <ShaderBackground>
        <main className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
              {audioFile?.name}
            </h2>
            <p className="text-white/80 font-semibold">
              real-time audio visualization
            </p>
          </div>
          
          <WaveformCanvas
            waveformData={null}
            audioFile={audioFile}
            audioName={audioFile?.name.replace(/\.[^/.]+$/, '') || ''} // Remove file extension
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
          />
          
          <button
            type="button"
            onClick={handleBackToUploader}
            className="mt-8 text-white/80 hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 font-semibold"
          >
            ← upload different audio
          </button>
        </main>
        </ShaderBackground>
)
}