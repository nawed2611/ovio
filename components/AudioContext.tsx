"use client";

import { createContext, useContext, useState, type ReactNode } from 'react';

interface AudioContextType {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <AudioContext.Provider value={{
      audioFile,
      setAudioFile,
      isPlaying,
      setIsPlaying
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
