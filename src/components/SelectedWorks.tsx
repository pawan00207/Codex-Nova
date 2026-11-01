import React from 'react';
import { motion } from 'framer-motion';

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  aspect: string;
  colSpan: string;
  tags: string[];
  client: string;
  deliverables: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'automotive-motion',
    title: 'Automotive Motion',
    category: 'Motion & Spatial Design',
    year: '2025',
    description: 'An immersive cinematic digital experience and 3D configuration platform engineered for next-generation electric hypercars.',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1600&auto=format&fit=crop',
    aspect: 'aspect-[16/10]',
    colSpan: 'md:col-span-7',
    tags: ['WebGL', 'Automotive', 'GSAP', 'Shader Art'],
    client: 'Apex Dynamics',
    deliverables: 'Interactive 3D configurator, Design System, Motion Branding',
  },
  {
    id: 'urban-architecture',
    title: 'Urban Architecture',
    category: 'Spatial & Visual Systems',
    year: '2025',
    description: 'A monolithic digital archive celebrating brutalist form, concrete structures, and architectural shadows across metropolitan Europe.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    aspect: 'aspect-[4/3]',
    colSpan: 'md:col-span-5',
    tags: ['Curation', 'Typography', 'Minimalism'],
    client: 'Bauhaus Zurich',
    deliverables: 'Monograph Design, Editorial Web Experience',
  },
  {
    id: 'human-perspective',
    title: 'Human Perspective',
    category: 'Editorial & Photography',
    year: '2024',
    description: 'A study in human emotion, biometric expressions, and lighting dynamics captured through an intimate photographic series.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
    aspect: 'aspect-[4/3]',
    colSpan: 'md:col-span-5',
    tags: ['Photography', 'Editorial', 'Micro-interactions'],
    client: 'Vogue Lab',
    deliverables: 'Art Direction, Dynamic Grid Engine, Interactive Story',
  },
  {
    id: 'brand-identity',
    title: 'Brand Identity',
    category: 'Design Engineering',
    year: '2024',
    description: 'A comprehensive visual language and digital identity system for a visionary algorithmic research laboratory.',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1600&auto=format&fit=crop',
    aspect: 'aspect-[16/10]',
    colSpan: 'md:col-span-7',
    tags: ['Identity', 'Tokenomics', 'Component Library'],
    client: 'Omni Research Group',
    deliverables: 'Logo Suite, Typography Guidelines, High-Fidelity UI Toolkit',
  },
];

interface SelectedWorksProps {
  onSelectProject: (project: Project) => void;
  onViewAllWork?: () => void;
}

export const SelectedWorks: React.FC<SelectedWorksProps> = ({
  onSelectProject,
  onViewAllWork,
}) => {
  return (
    <section
      id="selected-works"
      className="bg-bg py-16 md:py-24 text-text-primary relative z-10"
      style={{ backgroundColor: 'hsl(var(--bg))' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6"
        >
          <div>
            {/* Eyebrow: w-8 h-px bg-stroke + "Selected Work" text-xs text-muted uppercase tracking-[0.3em] */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-stroke block" />
              <span className="text-xs text-muted uppercase tracking-[0.3em] font-medium">
                Selected Work
              </span>
            </div>

            {/* Heading: "Featured *projects*" — italic word in font-display italic */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-text-primary">
              Featured{' '}
              <span className="font-display italic font-normal text-text-primary">
                projects
              </span>
            </h2>

            {/* Subtext: "A selection of projects I've worked on, from concept to launch." */}
            <p className="text-sm md:text-base text-muted mt-3 max-w-lg">
              A selection of projects I&apos;ve worked on, from concept to launch.
            </p>
          </div>

          {/* "View all work" button (desktop only, hidden md:inline-flex) — rounded-full with gradient hover border ring + right arrow */}
          <button
            onClick={onViewAllWork}
            className="group relative hidden md:inline-flex items-center rounded-full text-xs uppercase tracking-[0.2em] font-medium p-[1.5px] transition-all duration-300 hover:scale-105 shrink-0 cursor-pointer"
          >
            <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-surface border border-stroke group-hover:border-transparent text-text-primary transition-all duration-300">
              <span>View all work</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </button>
        </motion.div>

        {/* Bento Grid: grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6. Column spans alternate: 7/5/5/7 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {PROJECTS.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.8,
                delay: idx * 0.12,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              onClick={() => onSelectProject(project)}
              className={`group relative ${project.colSpan} ${project.aspect} min-h-[320px] sm:min-h-[380px] md:min-h-[420px] bg-surface border border-stroke rounded-3xl overflow-hidden cursor-pointer shadow-lg`}
              style={{
                backgroundColor: 'hsl(var(--surface))',
                borderColor: 'hsl(var(--stroke))',
              }}
            >
              {/* Background image with object-cover group-hover:scale-105 */}
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Halftone overlay: radial-gradient(circle, #000 1px, transparent 1px) at 4x4px, opacity-20 mix-blend-multiply */}
              <div
                className="absolute inset-0 halftone-overlay opacity-20 mix-blend-multiply pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                }}
              />

              {/* Subtle ambient gradient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent pointer-events-none opacity-80 group-hover:opacity-40 transition-opacity duration-300" />

              {/* Default metadata on card bottom */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 transition-transform duration-300 group-hover:translate-y-2 group-hover:opacity-0">
                <div>
                  <span className="text-[11px] text-muted tracking-[0.2em] uppercase font-mono block mb-1">
                    {project.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-display italic text-text-primary">
                    {project.title}
                  </h3>
                </div>
                <span className="text-xs text-muted font-mono">{project.year}</span>
              </div>

              {/* Hover: bg-bg/70 opacity-0->1 + backdrop-blur-lg */}
              <div className="absolute inset-0 bg-bg/75 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center z-20">
                <span className="text-xs text-muted uppercase tracking-[0.25em] mb-2 font-mono">
                  {project.category}
                </span>

                <p className="text-xs sm:text-sm text-text-primary/80 max-w-sm mb-6 line-clamp-2">
                  {project.description}
                </p>

                {/* Hover label: pill with animated gradient border, white bg, "View — *Title*" (title in font-display italic) */}
                <div className="relative p-[1.5px] rounded-full overflow-hidden accent-gradient-hover shadow-xl transform transition-transform duration-300 group-hover:scale-105">
                  <div className="rounded-full bg-white text-black px-6 py-2.5 text-xs sm:text-sm font-medium tracking-wide flex items-center gap-1.5 shadow-sm">
                    <span>View —</span>
                    <span className="font-display italic text-base sm:text-lg font-bold text-black">
                      {project.title}
                    </span>
                    <span className="text-sm font-bold ml-1">↗</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectedWorks;
