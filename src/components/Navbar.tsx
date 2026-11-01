import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onOpenResume?: () => void;
  onOpenSayHi?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume, onOpenSayHi }) => {
  const [activeTab, setActiveTab] = useState<'Home' | 'Work' | 'Resume'>('Home');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);

      const workEl = document.getElementById('selected-works');
      const heroEl = document.getElementById('hero');

      if (workEl) {
        const workRect = workEl.getBoundingClientRect();
        if (workRect.top <= 200 && workRect.bottom >= 200) {
          setActiveTab('Work');
          return;
        }
      }
      if (heroEl) {
        const heroRect = heroEl.getBoundingClientRect();
        if (heroRect.bottom > 200) {
          setActiveTab('Home');
          return;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tab: 'Home' | 'Work' | 'Resume') => {
    setActiveTab(tab);
    if (tab === 'Home') {
      const el = document.getElementById('hero');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (tab === 'Work') {
      const el = document.getElementById('selected-works');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'Resume') {
      if (onOpenResume) {
        onOpenResume();
      } else {
        const el = document.getElementById('stats');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSayHiClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenSayHi) {
      onOpenSayHi();
    } else {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = 'mailto:hello@michaelsmith.com';
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4 pointer-events-none">
      <nav
        className={`pointer-events-auto inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface/90 px-2 py-2 transition-all duration-300 ${
          isScrolled ? 'shadow-md shadow-black/30 bg-surface/95 border-white/15' : ''
        }`}
        style={{
          backgroundColor: 'hsla(var(--surface) / 0.88)',
          borderColor: 'hsla(var(--stroke) / 0.8)',
        }}
        aria-label="Main Navigation"
      >
        {/* 1. Logo: 9x9 circle with accent gradient border (reverses direction on hover). Inner bg-bg circle with "JA" in font-display italic text-[13px]. Scales 110% on hover */}
        <button
          onClick={() => handleNavClick('Home')}
          className="group relative w-9 h-9 rounded-full p-[1.5px] transition-transform duration-300 hover:scale-110 flex items-center justify-center shrink-0 focus:outline-none"
          title="Portfolio Cosmic Home"
          aria-label="Home"
        >
          {/* Accent gradient border that reverses direction on hover */}
          <div className="absolute inset-0 rounded-full accent-gradient group-hover:[background:linear-gradient(270deg,#89AACC_0%,#4E85BF_100%)] transition-all duration-500" />
          {/* Inner circle */}
          <div className="relative z-10 w-full h-full rounded-full bg-bg flex items-center justify-center">
            <span className="font-display italic text-[13px] font-semibold text-text-primary tracking-tighter">
              JA
            </span>
          </div>
        </button>

        {/* 2. Divider: w-px h-5 bg-stroke mx-1 (hidden on mobile) */}
        <div className="w-px h-5 bg-stroke mx-1 hidden sm:block" />

        {/* 3. Nav links: ["Home", "Work", "Resume"] */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {(['Home', 'Work', 'Resume'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => handleNavClick(tab)}
                className={`text-xs sm:text-sm font-medium rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'text-text-primary bg-stroke/60 font-semibold'
                    : 'text-muted hover:text-text-primary hover:bg-stroke/40'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* 4. Divider */}
        <div className="w-px h-5 bg-stroke mx-1 hidden sm:block" />

        {/* 5. "Say hi" button: Same size as nav links. On hover, shows accent gradient border behind (using absolute span with inset: -2px). Inner content wrapped in bg-surface rounded-full backdrop-blur-md. Includes "↗" arrow */}
        <a
          href="#contact"
          onClick={handleSayHiClick}
          className="group relative inline-flex items-center rounded-full text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 text-text-primary transition-all duration-300 ml-1"
        >
          {/* Hover accent gradient border behind */}
          <span className="absolute -inset-[1.5px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          <span className="absolute inset-0 rounded-full bg-surface/90 backdrop-blur-md border border-white/10 group-hover:border-transparent transition-colors duration-300 -z-[5]" />
          <span className="relative z-10 inline-flex items-center gap-1 font-medium">
            <span>Say hi</span>
            <span className="text-[13px] leading-none transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </span>
        </a>
      </nav>
    </header>
  );
};

export default Navbar;
