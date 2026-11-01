import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const WORDS = ['Design', 'Create', 'Inspire'];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Word cycler every 900ms
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 900);

    return () => clearInterval(wordInterval);
  }, []);

  useEffect(() => {
    // Counter animation 000 -> 100 over 2700ms using requestAnimationFrame
    const duration = 2700;
    const startTime = performance.now();

    let animationFrameId: number;

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // smooth easeOutQuad progress
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const currentCount = Math.floor(easedProgress * 100);

      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      } else {
        setCount(100);
        // On complete: 400ms delay then call onComplete
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            onComplete();
          }, 400);
        }, 400);
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);

    return () => cancelAnimationFrame(animationFrameId);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isFadingOut ? 0 : 1 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] bg-bg flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none pointer-events-auto"
      style={{ backgroundColor: 'hsl(var(--bg))' }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between w-full">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs text-muted uppercase tracking-[0.3em] font-medium"
        >
          Portfolio
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs text-muted tracking-widest font-mono"
        >
          Michael Smith ©26
        </motion.div>
      </div>

      {/* Center: Rotating words */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div className="h-20 sm:h-24 md:h-28 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={WORDS[wordIndex]}
              initial={{ y: 24, opacity: 0, filter: 'blur(6px)' }}
              animate={{ y: 0, opacity: 0.9, filter: 'blur(0px)' }}
              exit={{ y: -24, opacity: 0, filter: 'blur(6px)' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80 tracking-wide text-center"
            >
              {WORDS[wordIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom area */}
      <div className="w-full flex flex-col gap-6">
        {/* Bottom row with counter */}
        <div className="flex items-end justify-between">
          <div className="text-xs text-muted/60 tracking-[0.2em] uppercase font-mono hidden sm:block">
            Loading Experience
          </div>
          <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums ml-auto leading-none">
            {String(count).padStart(3, '0')}
          </div>
        </div>

        {/* Bottom progress bar */}
        <div className="relative w-full h-[3px] bg-stroke/50 rounded-full overflow-hidden">
          <div
            className="h-full accent-gradient origin-left transition-transform duration-75 ease-out rounded-full"
            style={{
              transform: `scaleX(${count / 100})`,
              boxShadow: '0 0 12px rgba(137, 170, 204, 0.45)',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
