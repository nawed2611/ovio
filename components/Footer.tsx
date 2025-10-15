'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="absolute bottom-0 left-0 right-0 z-30 mt-auto py-4 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
            <Link 
              href="/pricing" 
              className="text-white/80 hover:text-white transition-colors font-medium"
            >
              Pricing
            </Link>
            <Link 
              href="/privacy" 
              className="text-white/80 hover:text-white transition-colors font-medium"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-white/80 hover:text-white transition-colors font-medium"
            >
              Terms
            </Link>
            <Link 
              href="/refund" 
              className="text-white/80 hover:text-white transition-colors font-medium"
            >
              Refund Policy
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://x.com/nawed2611" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors font-medium text-sm flex items-center gap-2"
            >
              X
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

