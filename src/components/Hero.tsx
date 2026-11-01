import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Hls from 'hls.js';

interface HeroProps {
  onSeeWorks?: () => void;
  onReachOut?: () => void;
  isLoading?: boolean;
}

const ROLES = ['Creative', 'Fullstack', 'Founder', 'Scholar'];
const HLS_STREAM_URL = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';

export const Hero: React.FC<HeroProps> = ({ onSeeWorks, onReachOut, isLoading = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  // Background Video HLS setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
      });
      hls.loadSource(HLS_STREAM_URL);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => {
          console.log('[Hero Video] Auto-play was prevented:', err);
        });
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = HLS_STREAM_URL;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch((err) => {
          console.log('[Hero Video] Auto-play was prevented:', err);
        });
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  // Role cycler every 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // GSAP Entrance
  useEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.name-reveal',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1 }
      );

      tl.fromTo(
        '.blur-in',
        { opacity: 0, filter: 'blur(10px)', y: 20 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.1 },
        '-=0.8'
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading]);

  const handleScrollClick = () => {
    const worksEl = document.getElementById('selected-works');
    if (worksEl) {
      worksEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-bg px-6"
    >
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 opacity-75"
        />
        {/* Dark overlay: bg-black/20 */}
        <div className="absolute inset-0 bg-black/25 backdrop-brightness-95" />
        {/* Bottom fade: h-48 bg-gradient-to-t from-bg to-transparent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, hsl(var(--bg)) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Hero Content (centered, z-10) */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center mt-12 md:mt-6">
        {/* Eyebrow: text-xs text-muted uppercase tracking-[0.3em] mb-8 — "COLLECTION '26". Class blur-in */}
        <div className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-6 md:mb-8 font-medium">
          COLLECTION &apos;26
        </div>

        {/* Name: text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6 — "Michael Smith". Class name-reveal */}
        <h1 className="name-reveal text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6 font-normal">
          Michael Smith
        </h1>

        {/* Role line: "A {role} lives in Chicago." — roles cycle every 2s through ["Creative", "Fullstack", "Founder", "Scholar"]. Role word uses font-display italic text-text-primary animate-role-fade-in inline-block with key={roleIndex} */}
        <div className="blur-in text-base sm:text-lg md:text-xl text-text-primary/90 mb-4 font-light">
          A{' '}
          <span
            key={roleIndex}
            className="font-display italic text-text-primary font-normal text-xl sm:text-2xl md:text-3xl animate-role-fade-in inline-block px-1 underline decoration-stroke/60 decoration-1 underline-offset-4"
          >
            {ROLES[roleIndex]}
          </span>{' '}
          lives in Chicago.
        </div>

        {/* Description: text-sm md:text-base text-muted max-w-md mb-12 */}
        <p className="blur-in text-sm md:text-base text-muted max-w-md mx-auto mb-10 md:mb-12 leading-relaxed">
          Designing seamless digital interactions by focusing on the unique nuances which bring systems to life.
        </p>

        {/* CTA Buttons (inline-flex gap-4) */}
        <div className="blur-in inline-flex flex-wrap items-center justify-center gap-4">
          {/* "See Works": Solid button. Default: bg-text-primary text-bg. Hover: bg-bg text-text-primary with accent gradient border ring */}
          <button
            onClick={() => {
              if (onSeeWorks) onSeeWorks();
              else {
                document.getElementById('selected-works')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="group relative rounded-full text-sm font-medium px-7 py-3.5 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden p-[2px]"
          >
            {/* Accent gradient ring on hover */}
            <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative block rounded-full px-7 py-3.5 bg-text-primary text-bg group-hover:bg-bg group-hover:text-text-primary transition-colors duration-300 font-medium">
              See Works
            </span>
          </button>

          {/* "Reach out...": Outlined button. Default: border-2 border-stroke bg-bg text-text-primary. Hover: border-transparent with accent gradient border ring */}
          <button
            onClick={() => {
              if (onReachOut) onReachOut();
              else {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="group relative rounded-full text-sm font-medium p-[2px] transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            {/* Accent gradient ring on hover */}
            <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative block rounded-full px-7 py-3.5 bg-bg text-text-primary border-2 border-stroke group-hover:border-transparent transition-all duration-300 font-medium">
              Reach out...
            </span>
          </button>
        </div>
      </div>

      {/* Scroll Indicator: Bottom-center, text-xs text-muted uppercase tracking-[0.2em] "SCROLL" label above a w-px h-10 bg-stroke line with animated highlight using .animate-scroll-down */}
      <button
        onClick={handleScrollClick}
        aria-label="Scroll down to Selected Works"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10 group opacity-80 hover:opacity-100 transition-opacity"
      >
        <span className="text-xs text-muted uppercase tracking-[0.2em] font-mono group-hover:text-text-primary transition-colors">
          SCROLL
        </span>
        <div className="relative w-px h-10 bg-stroke overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 accent-gradient animate-scroll-down" />
        </div>
      </button>
    </section>
  );
};

export default Hero;
