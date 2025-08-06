# Ovio - Audio Waveform Video Generator

Transform your audio files into stunning waveform videos with beautiful visualizations inspired by Spotify and ElevenLabs.

## Features

- 🎵 **Audio Upload**: Supports MP3, WAV, M4A, FLAC and more audio formats
- 🎨 **Multiple Styles**: Choose from Spotify, ElevenLabs, or custom visualization styles
- 🎬 **Video Export**: Record and download your waveform animations as high-quality video files
- ⚡ **Real-time Rendering**: Canvas-based rendering with smooth 60fps animations
- 🌙 **Dark Mode**: Beautiful dark/light theme support
- 📱 **Responsive**: Works perfectly on desktop and mobile devices

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ovio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. **Upload Audio**: Drag and drop an audio file or click to browse
2. **Choose Style**: Select from three beautiful visualization styles:
   - **Spotify**: Clean bars with signature green progress
   - **ElevenLabs**: Flowing waves with glow effects
   - **Custom**: Modern gradient design
3. **Play & Preview**: Click play to see your waveform animate in real-time
4. **Record Video**: Click "Record Video" to capture the animation
5. **Download**: Save your generated video file

## Architecture

### Components
- **AudioUploader**: Handles file upload with drag & drop
- **WaveformCanvas**: Canvas-based rendering engine with multiple visualization styles
- **Main Page**: Orchestrates the entire user experience

### Utilities
- **AudioAnalyzer**: Web Audio API integration for audio processing and waveform data extraction
- **CanvasRenderer**: High-performance canvas rendering with different visualization modes

### Visualization Styles

#### Spotify Style
- Clean vertical bars
- Signature green progress indicator
- Dark theme background
- Minimalist design

#### ElevenLabs Style
- Flowing wave pattern
- Golden glow effects
- Smooth amplitude transitions
- Professional audio tool aesthetic

#### Custom Style
- Modern gradient colors
- Rounded bars
- Contemporary design
- Customizable parameters

## Technical Details

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom animations
- **Audio Processing**: Web Audio API for real-time analysis
- **Canvas Rendering**: Hardware-accelerated 2D canvas
- **Video Recording**: MediaRecorder API with WebM output
- **TypeScript**: Fully typed for better development experience

## Browser Support

- Chrome 66+ (recommended)
- Firefox 60+
- Safari 14+
- Edge 79+

*Note: Video recording requires modern browser support for MediaRecorder API*

## Performance Features

- Optimized audio analysis with configurable data points
- Hardware-accelerated canvas rendering
- Efficient memory management for large audio files
- 60fps smooth animations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Spotify's audio visualization design
- ElevenLabs' beautiful waveform aesthetics
- Web Audio API documentation and community
