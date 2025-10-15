"use client";

import { useRouter } from 'next/navigation';
import { useAudio } from "@/components/AudioContext";
import AudioUploader from "@/components/AudioUploader"
import ShaderBackground from "@/components/ShaderBackground";

export default function Upload() {
const { setAudioFile } = useAudio();
const router = useRouter();
      
const handleFileSelect = (file: File) => {
        setAudioFile(file);
        router.push("/waveform");
};

return (
      <ShaderBackground>
        <main className="absolute inset-0 z-20 flex items-center justify-center p-8 font-medium">
          <section className="bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-12 gap-8 w-full max-w-lg shadow-lg">
            <header className="w-full text-center mb-2">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-2">
                upload your media
              </h2>
              <p className="text-lg text-white/80 max-w-md mx-auto font-semibold">
                choose an audio or video file
              </p>
            </header>
            <div className="w-full flex items-center justify-center">
              <AudioUploader onFileSelect={handleFileSelect} />
            </div>
          </section>
        </main>
      </ShaderBackground>
)
}