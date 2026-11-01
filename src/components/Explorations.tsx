import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ExplorationItem {
  id: string;
  title: string;
  category: string;
  rotation: number;
  image: string;
  aspect: string;
  caption: string;
}

export const EXPLORATIONS: ExplorationItem[] = [
  {
    id: 'exp-1',
    title: 'Kinetic Chromatics',
    category: 'Procedural Shader',
    rotation: -3,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    aspect: 'aspect-square',
    caption: 'Real-time raymarching through refractive glass and chromatic dispersion tensors.',
  },
  {
    id: 'exp-2',
    title: 'Synthetic Flora',
    category: 'Computational Biology',
    rotation: 2.5,
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop',
    aspect: 'aspect-square',
    caption: 'L-system branch algorithms simulating vascular moisture flow in zero gravity.',
  },
  {
    id: 'exp-3',
    title: 'Monolith Void',
    category: 'Spatial Geometry',
    rotation: -2,
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop',
    aspect: 'aspect-square',
    caption: 'Brutalist concrete block physics simulating tectonic settling and atmospheric haze.',
  },
  {
    id: 'exp-4',
    title: 'Bioluminescent Bloom',
    category: 'Sub-surface Scattering',
    rotation: 3.5,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
    aspect: 'aspect-square',
    caption: 'Deep-ocean cellular luminescence using dynamic vertex displacement shaders.',
  },
  {
    id: 'exp-5',
    title: 'Crystalline Lattice',
    category: 'Generative Topology',
    rotation: -1.5,
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
    aspect: 'aspect-square',
    caption: 'Quartz fractal subdivision mapping with ambient occlusion baking in Blender Cycles.',
  },
  {
    id: 'exp-6',
    title: 'Atmospheric Aerodynamics',
    category: 'Fluid Particle System',
    rotation: 2,
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop',
    aspect: 'aspect-square',
    caption: '100,000 GPU curl-noise particles tracking airflow velocity across an airfoil curve.',
  },
];

interface ExplorationsProps {
  onOpenLightbox: (item: ExplorationItem) => void;
}

export const Explorations: React.FC<ExplorationsProps> = ({ onOpenLightbox }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pinned = pinnedRef.current;
    const col1 = col1Ref.current;
    const col2 = col2Ref.current;

    if (!section || !pinned || !col1 || !col2) return;

    const ctx = gsap.context(() => {
      // Pin Layer 1 Center with ScrollTrigger
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinned,
        pinSpacing: false,
      });

      // Parallax for Column 1
      gsap.fromTo(
        col1,
        { y: 150 },
        {
          y: -250,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );

      // Parallax for Column 2 (offset timing and speed)
      gsap.fromTo(
        col2,
        { y: 350 },
        {
          y: -400,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.6,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const col1Items = EXPLORATIONS.slice(0, 3);
  const col2Items = EXPLORATIONS.slice(3, 6);

  return (
    <section
      id="explorations"
      ref={sectionRef}
      className="relative min-h-[300vh] bg-bg overflow-hidden text-text-primary"
      style={{ backgroundColor: 'hsl(var(--bg))' }}
    >
      {/* Layer 1: Pinned Center (z-10) */}
      <div
        ref={pinnedRef}
        className="h-screen w-full flex flex-col items-center justify-center text-center px-6 pointer-events-none z-10 sticky top-0"
      >
        <div className="max-w-xl mx-auto flex flex-col items-center">
          {/* Eyebrow: "Explorations" */}
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-stroke block" />
            <span className="text-xs text-muted uppercase tracking-[0.3em] font-medium">
              Explorations
            </span>
            <span className="w-8 h-px bg-stroke block" />
          </div>

          {/* Heading: "Visual *playground*" */}
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-normal tracking-tight text-text-primary mb-4">
            Visual{' '}
            <span className="font-display italic font-normal text-text-primary">
              playground
            </span>
          </h2>

          {/* Subtext + Dribbble button */}
          <p className="text-sm md:text-base text-muted max-w-md mx-auto mb-8 leading-relaxed">
            A continuous repository of procedural sketches, volumetric lighting, and generative form studies.
          </p>

          <a
            href="https://dribbble.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group pointer-events-auto relative inline-flex items-center rounded-full text-xs uppercase tracking-[0.2em] font-medium p-[1.5px] transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg"
          >
            <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 inline-flex items-center gap-2 rounded-full px-6 py-3 bg-surface border border-stroke group-hover:border-transparent text-text-primary transition-all duration-300">
              <span>View Dribbble</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </span>
          </a>
        </div>
      </div>

      {/* Layer 2: Parallax Columns (z-20, absolute/overlaid) */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-6 md:px-12 pointer-events-none -mt-[90vh]">
        <div className="grid grid-cols-2 gap-8 sm:gap-14 md:gap-36 lg:gap-48 items-start">
          {/* Column 1 */}
          <div ref={col1Ref} className="flex flex-col gap-24 sm:gap-36 md:gap-48">
            {col1Items.map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenLightbox(item)}
                style={{ transform: `rotate(${item.rotation}deg)` }}
                className="group pointer-events-auto relative w-full aspect-square max-w-[320px] mx-auto bg-surface border border-stroke rounded-3xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:scale-105 hover:rotate-0 hover:border-stroke/80 hover:shadow-cyan-950/40"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <span className="text-[10px] text-muted uppercase tracking-[0.2em] font-mono block mb-0.5">
                    {item.category}
                  </span>
                  <h4 className="text-sm sm:text-base font-display italic text-text-primary">
                    {item.title}
                  </h4>
                </div>

                {/* Hover zoom indicator */}
                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-surface/80 backdrop-blur-md border border-stroke flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-text-primary">
                  🔍
                </div>
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div ref={col2Ref} className="flex flex-col gap-24 sm:gap-36 md:gap-48 pt-32 sm:pt-48">
            {col2Items.map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenLightbox(item)}
                style={{ transform: `rotate(${item.rotation}deg)` }}
                className="group pointer-events-auto relative w-full aspect-square max-w-[320px] mx-auto bg-surface border border-stroke rounded-3xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:scale-105 hover:rotate-0 hover:border-stroke/80 hover:shadow-sky-950/40"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <span className="text-[10px] text-muted uppercase tracking-[0.2em] font-mono block mb-0.5">
                    {item.category}
                  </span>
                  <h4 className="text-sm sm:text-base font-display italic text-text-primary">
                    {item.title}
                  </h4>
                </div>

                {/* Hover zoom indicator */}
                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-surface/80 backdrop-blur-md border border-stroke flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-text-primary">
                  🔍
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Explorations;
