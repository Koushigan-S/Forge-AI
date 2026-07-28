'use client';

import React, { useState, useEffect } from 'react';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const duration = 3000; // 3 seconds
    const intervalTime = 30; // Update every 30ms
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsFading(true), 100);
          setTimeout(() => {
            setIsHidden(true);
            if (onComplete) onComplete();
          }, 500);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (isHidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#09090b] flex flex-col items-center justify-center p-6 transition-opacity duration-500 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-lg w-full">
        {/* Big, Centerized Web Name with Fade-In Pop Effect */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-widest uppercase font-sans animate-fade-in-pop">
          <span className="text-blue-500">FORGE</span>
          <span className="text-white">AI</span>
        </h1>

        {/* 1-100 Loading Bar */}
        <div className="w-full max-w-xs sm:max-w-sm space-y-2">
          {/* Percentage Counter */}
          <div className="text-center font-mono text-base sm:text-lg font-bold text-neutral-300">
            {Math.min(100, Math.floor(progress))}%
          </div>

          {/* Loader Bar */}
          <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-75 ease-linear"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
