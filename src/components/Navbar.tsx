import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onOpenCompiler: () => void;
  onOpenAbout?: () => void;
  onOpenArchitecture?: () => void;
  onOpenSayHi?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCompiler,
  onOpenAbout,
  onOpenArchitecture,
  onOpenSayHi,
}) => {
  const [activeTab, setActiveTab] = useState<'Home' | 'Compiler' | 'Features' | 'About'>('Home');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);

      const workEl = document.getElementById('selected-works');
      const heroEl = document.getElementById('hero');

      if (workEl) {
        const workRect = workEl.getBoundingClientRect();
        if (workRect.top <= 200 && workRect.bottom >= 200) {
          setActiveTab('Features');
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

  const handleNavClick = (tab: 'Home' | 'Compiler' | 'Features' | 'About') => {
    setActiveTab(tab);
    if (tab === 'Home') {
      const el = document.getElementById('hero');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'Compiler') {
      onOpenCompiler();
    } else if (tab === 'Features') {
      const el = document.getElementById('selected-works');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'About') {
      if (onOpenAbout) onOpenAbout();
      else {
        const el = document.getElementById('stats');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
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
        {/* 1. Logo: 9x9 circle with accent gradient border (reverses direction on hover). Inner bg-bg circle with "CN" in font-display italic text-[13px]. Scales 110% on hover */}
        <button
          onClick={() => handleNavClick('Home')}
          className="group relative w-9 h-9 rounded-full p-[1.5px] transition-transform duration-300 hover:scale-110 flex items-center justify-center shrink-0 focus:outline-none cursor-pointer"
          title="CodexNova Home"
          aria-label="Home"
        >
          <div className="absolute inset-0 rounded-full accent-gradient group-hover:[background:linear-gradient(270deg,#89AACC_0%,#4E85BF_100%)] transition-all duration-500" />
          <div className="relative z-10 w-full h-full rounded-full bg-bg flex items-center justify-center">
            <span className="font-display italic text-[13px] font-semibold text-text-primary tracking-tighter">
              CN
            </span>
          </div>
        </button>

        {/* 2. Divider: w-px h-5 bg-stroke mx-1 (hidden on mobile) */}
        <div className="w-px h-5 bg-stroke mx-1 hidden sm:block" />

        {/* 3. Nav links */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {([
            { id: 'Home', label: 'Home' },
            { id: 'Compiler', label: 'Compiler (IDE)' },
            { id: 'Features', label: 'Features' },
            { id: 'About', label: 'About' },
          ] as const).map(({ id, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className={`text-xs sm:text-sm font-medium rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'text-text-primary bg-stroke/60 font-semibold'
                    : 'text-muted hover:text-text-primary hover:bg-stroke/40'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* 4. Divider */}
        <div className="w-px h-5 bg-stroke mx-1 hidden sm:block" />

        {/* 5. "Launch IDE" / "Say hi" button */}
        <button
          onClick={onOpenCompiler}
          className="group relative inline-flex items-center rounded-full text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 text-text-primary transition-all duration-300 ml-1 cursor-pointer"
        >
          {/* Hover accent gradient border behind */}
          <span className="absolute -inset-[1.5px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          <span className="absolute inset-0 rounded-full bg-surface/90 backdrop-blur-md border border-white/10 group-hover:border-transparent transition-colors duration-300 -z-[5]" />
          <span className="relative z-10 inline-flex items-center gap-1 font-medium">
            <span>Launch IDE</span>
            <span className="text-[13px] leading-none transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ⚡
            </span>
          </span>
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
