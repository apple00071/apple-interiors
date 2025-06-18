"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import confetti from 'canvas-confetti';

export default function LaunchPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const fireConfetti = () => {
    const end = Date.now() + 3000;
    const colors = ['#F7B614', '#FFD700', '#FFFFFF', '#FFA500'];

    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.6 },
        colors: colors,
        startVelocity: 50,
        gravity: 0.7,
        shapes: ['circle', 'square'],
        scalar: 2,
        ticks: 200
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.6 },
        colors: colors,
        startVelocity: 50,
        gravity: 0.7,
        shapes: ['circle', 'square'],
        scalar: 2,
        ticks: 200
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const handleLaunch = () => {
    setShowOverlay(true);
    fireConfetti();
    setTimeout(() => {
      router.push('/');
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <div className={`relative w-full h-screen ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
        {/* Hero Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/Screenshot 2025-06-18 175309.png"
            alt="Apple Interiors Design"
            fill
            className={`object-cover transition-transform duration-1500 ease-out ${isLoaded ? 'scale-100' : 'scale-110'}`}
            style={{ filter: 'brightness(0.7)' }}
            priority
          />
        </div>

        {/* Logo */}
        <div className={`absolute top-10 left-10 z-10 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
          <Image
            src="/images/New-logo.png"
            alt="Apple Interiors Logo"
            width={280}
            height={80}
            className="drop-shadow-lg"
            priority
          />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60">
          <div className="h-full flex flex-col justify-center items-center gap-12 text-center px-8">
            <div className={`max-w-4xl transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="font-serif text-white text-[clamp(2.5rem,10vw,7rem)] font-bold leading-tight tracking-tight mb-6">
                Interior Design<br />Reimagined
              </h1>
              <p className="text-white/90 text-[clamp(1.1rem,2vw,1.4rem)] font-light max-w-2xl mx-auto mb-8 leading-relaxed">
                Step into a world where innovation meets elegance. Experience our new digital presence, crafted to inspire and transform your space.
              </p>
              <button
                onClick={handleLaunch}
                className="group bg-[#F7B614] text-white px-14 py-6 rounded-full text-[clamp(1.1rem,2.5vw,1.3rem)] font-semibold inline-flex items-center gap-4 shadow-[0_20px_40px_rgba(247,182,20,0.3)] hover:shadow-[0_25px_50px_rgba(247,182,20,0.4)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
              >
                Experience New Website
                <svg className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Launch Overlay */}
        <div className={`fixed inset-0 bg-black transition-all duration-800 ${showOverlay ? 'opacity-95 visible' : 'opacity-0 invisible'} z-20`} />
        <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center transition-all duration-800 ${showOverlay ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-90'} z-21 w-[90%] max-w-[900px]`}>
          <div className="font-serif text-[clamp(2.5rem,6vw,4rem)] font-bold whitespace-nowrap">
            Welcome to the Future of Design
          </div>
          <div className="font-sans text-[clamp(1.1rem,2.5vw,1.5rem)] font-light mt-6 opacity-90 tracking-wide">
            Where imagination meets innovation
          </div>
        </div>
      </div>
    </div>
  );
} 