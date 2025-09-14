'use client';

import { useRouter } from 'next/navigation';
import HeroContent from '@/components/HeroContent';
import ShaderBackground from '@/components/ShaderBackground';

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
  router.push('/upload');
  };

  return (
    <ShaderBackground>
        <HeroContent onGetStarted={handleGetStarted} />
    </ShaderBackground>
  );
}
