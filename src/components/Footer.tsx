import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Hls from 'hls.js';

interface FooterProps {
  onContactClick?: () => void;
}

const HLS_STREAM_URL = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';
const MARQUEE_TEXT = 'BUILDING THE FUTURE • '.repeat(10);

export const Footer: React.FC<FooterProps> = ({ onContactClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Background Video HLS setup (scale-y-[-1], heavier overlay bg-black/60)
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
        video.play().catch(() => {});
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = HLS_STREAM_URL;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {});
      });
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, []);

  // GSAP Marquee: xPercent: -50, duration 40, ease "none", repeat -1
  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const anim = gsap.to(marquee, {
      xPercent: -50,
      duration: 40,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      anim.kill();
    };
  }, []);

  return (
    <footer
      id="contact"
      className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden text-text-primary border-t border-stroke/50"
      style={{ backgroundColor: 'hsl(var(--bg))' }}
    >
      {/* Background Video: flipped vertically (scale-y-[-1]), Heavier overlay: bg-black/60 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 scale-y-[-1] opacity-50"
        />
        {/* Heavier overlay: bg-black/60 */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
        {/* Gradient fade from top */}
        <div
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, hsl(var(--bg)) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* GSAP Marquee: "BUILDING THE FUTURE • " repeated 10x */}
      <div className="relative z-10 w-full overflow-hidden select-none py-6 mb-12 md:mb-16 border-y border-stroke/30">
        <div
          ref={marqueeRef}
          className="inline-flex whitespace-nowrap text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display italic tracking-wider text-text-primary/20 hover:text-text-primary/30 transition-colors"
        >
          <span>{MARQUEE_TEXT}</span>
          <span>{MARQUEE_TEXT}</span>
        </div>
      </div>

      {/* Centered CTA Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center mb-16 md:mb-24">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-8 h-px bg-stroke block" />
          <span className="text-xs text-muted uppercase tracking-[0.3em] font-medium">
            Get In Touch
          </span>
          <span className="w-8 h-px bg-stroke block" />
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-text-primary mb-6">
          Have an ambitious project in mind?{' '}
          <span className="font-display italic font-normal text-text-primary">
            Let&apos;s talk.
          </span>
        </h2>

        <p className="text-sm md:text-base text-muted max-w-md mx-auto mb-10 leading-relaxed">
          Currently taking on select commissions, high-impact design systems, and advisory roles for 2026.
        </p>

        {/* CTA Email button: mailto:hello@michaelsmith.com with gradient hover border ring */}
        <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:hello@michaelsmith.com"
            onClick={(e) => {
              if (onContactClick) {
                e.preventDefault();
                onContactClick();
              }
            }}
            className="group relative rounded-full text-base sm:text-lg font-medium p-[2px] transition-all duration-300 hover:scale-105 cursor-pointer shadow-xl inline-block"
          >
            {/* Gradient hover border ring */}
            <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 block rounded-full px-8 sm:px-10 py-4 sm:py-4.5 bg-surface border border-stroke group-hover:border-transparent text-text-primary group-hover:text-white transition-all duration-300">
              <span className="font-mono tracking-tight font-medium">
                hello@michaelsmith.com
              </span>{' '}
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                ↗
              </span>
            </span>
          </a>
        </div>
      </div>

      {/* Footer Bar: Social links [Twitter, LinkedIn, Dribbble, GitHub] + Green pulsing dot + "Available for projects" */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 pt-8 border-t border-stroke/40 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-surface border border-stroke">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-text-primary tracking-wide text-[11px]">
            Available for projects
          </span>
        </div>

        {/* Social Links [Twitter, LinkedIn, Dribbble, GitHub] */}
        <div className="flex items-center gap-6 font-mono text-xs">
          {[
            { name: 'Twitter', url: 'https://twitter.com' },
            { name: 'LinkedIn', url: 'https://linkedin.com' },
            { name: 'Dribbble', url: 'https://dribbble.com' },
            { name: 'GitHub', url: 'https://github.com' },
          ].map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-text-primary transition-colors tracking-wider"
            >
              {social.name}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="font-mono text-[11px] text-muted/70">
          © 2026 Michael Smith. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
