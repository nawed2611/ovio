'use client';

import { useRef, useState } from 'react';

interface AudioUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export default function AudioUploader({ onFileSelect, isLoading }: AudioUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      const file = files[0];
      if (file.type.startsWith('audio/')) {
        onFileSelect(file);
      } else {
        alert('Please select an audio file');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files?.[0]) {
      onFileSelect(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openFileDialog();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto ">
      <button
        type="button"
        disabled={isLoading}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-[0.98]
          ${dragActive 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20 scale-[1.02]' 
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/20'
          }
          ${isLoading ? 'pointer-events-none opacity-50' : ''}
        `}
        onClick={openFileDialog}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleChange}
          className="hidden"
          disabled={isLoading}
        />
        
        <div className="space-y-4">
          {isLoading ? (
            <>
              <div className="w-16 h-16 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                processing audio...
              </p>
            </>
          ) : (
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                  upload your audio
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 font-semibold">
                  drag and drop an audio file here, or click to browse
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  supports mp3, wav, m4a, flac and more
                </p>
              </div>
          )}
        </div>
      </button>
    </div>
  );
}