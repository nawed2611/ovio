"use client"

interface HeroContentProps {
  onGetStarted: () => void;
}

export default function HeroContent({ onGetStarted }: HeroContentProps) {
  return (
    <main className="absolute inset-0 z-20 flex flex-col items-center justify-center ">
      <div className="text-center max-w-4xl">
        <h1 className="text-4xl md:text-9xl md:leading-32 tracking-tight font-bold text-white mb-4">
          instantly create <span className="font-black italic">beautiful</span>
          <br />
          <span className="tracking-tight text-white font-bold">videos</span>
        </h1>

        <p className="text-lg text-white/80 mb-4 max-w-xl mx-auto font-semibold">
          upload your audio or video, choose a template and transform them into beautiful shareable videos
        </p>
      </div>

      <div id="gooey-btn" className="relative flex items-center group" style={{ filter: "url(#gooey-filter)" }}>
        <button type="button" className="absolute right-0 px-2.5 py-2 rounded-full bg-white text-black font-bold text-xs transition-all duration-300 active:scale-95 cursor-pointer h-8 flex items-center justify-center -translate-x-20 group-hover:-translate-x-28 z-0">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title id="arrow-title">arrow pointing up-right</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </button>
        <button 
          type="button" 
          onClick={onGetStarted}
          className="px-6 py-2 rounded-full bg-white text-black font-bold text-xs transition-all duration-300  hover:scale-105 active:scale-95 cursor-pointer h-8 flex items-center z-10"
        >
          get started
        </button>
      </div>
    </main>
  )
}
