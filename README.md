# Portfolio Cosmic — Michael Smith

A single-page dark portfolio landing page built with React, Vite, Tailwind CSS, TypeScript, GSAP, Framer Motion, and hls.js.

## ✨ Features

- **Interactive Loading Screen**: Custom `requestAnimationFrame` counter from 000→100 over 2700ms with rotating word states (`Design`, `Create`, `Inspire`) and glowing accent progress bar.
- **Cinematic Hero**:
  - HLS streaming background video via `hls.js` with fallback.
  - Floating pill navigation bar with active section indicator, logo scaling, and hover borders.
  - Cycling roles (`Creative`, `Fullstack`, `Founder`, `Scholar`) with role fade-in animation.
  - GSAP entrance sequence with `.name-reveal` and `.blur-in`.
  - Animated scroll indicator.
- **Selected Works Bento Grid**:
  - 12-column responsive Bento grid (7/5/5/7 column spans).
  - Halftone dot matrix pattern overlay.
  - Interactive hover backdrop-blur reveal and modal dialogs.
- **Journal**:
  - Horizontal pill-style article cards with read times, categories, and dates.
  - Full article reading modal view.
- **Explorations (Parallax Gallery)**:
  - Scroll-driven parallax with GSAP `ScrollTrigger`.
  - Pinned center headline layer (`Visual playground`) and floating dual-column offset cards with rotation.
  - Full-resolution interactive Lightbox view.
- **Stats by the Numbers**:
  - 3-column metric display (`20+ Years Experience`, `95+ Projects Done`, `200% Satisfied Clients`).
- **Contact & Footer**:
  - Vertically flipped HLS ambient video.
  - Infinite GSAP marquee: `BUILDING THE FUTURE • `.
  - Direct CTA button and interactive contact modal.
  - Live availability indicator and social profiles.

## 🚀 Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Custom HSL design tokens & animations
- **Animation**: GSAP + ScrollTrigger + Framer Motion
- **Media**: hls.js (Mux HLS video streaming)
- **Icons**: Lucide React

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/pawan00207/Codex-Nova.git
cd Codex-Nova

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
