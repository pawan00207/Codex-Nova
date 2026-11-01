import React from 'react';
import { motion } from 'framer-motion';

export interface JournalArticle {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  content: string[];
}

export const JOURNAL_ENTRIES: JournalArticle[] = [
  {
    id: 'fluid-interfaces',
    title: 'Designing Beyond the Flat Screen: The Emergence of Spatial UI',
    subtitle: 'Why tactile motion physics are redefining modern human-machine dialogues.',
    date: 'Oct 24, 2025',
    readTime: '4 min read',
    category: 'Spatial Design',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=300&auto=format&fit=crop',
    content: [
      'The rectangle has confined digital interfaces for four decades. As spatial computing matures, our understanding of canvas boundaries is fracturing into three-dimensional depth, luminous volume, and sensory anticipation.',
      'True depth is not simply about adding drop shadows or z-axis translations. It demands physics that reflect mass, friction, and environmental illumination. When an element responds to velocity rather than predetermined easing curves, software transforms from an instrument into an organic entity.',
      'In our recent studio experiments, we found that subtle parallax layers combined with adaptive specular highlights reduce cognitive load by 32% compared to standard flat modal structures.',
    ],
  },
  {
    id: 'ai-creative-symbiosis',
    title: 'The Algorithmic Brush: Co-authoring Systems with Synthetic Agents',
    subtitle: 'From tool to collaborator — navigating generative code and creative autonomy.',
    date: 'Sep 12, 2025',
    readTime: '6 min read',
    category: 'Creative Tech',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop',
    content: [
      'The modern developer is no longer a solitary typist translating thought into binary syntax. We are conductors orchestrating high-dimensional latent space models, synthesizer loops, and automated design tokens simultaneously.',
      'The danger lies not in automation replacing taste, but in homogenizing variance. When millions of creators query the exact same neural weights, digital aesthetics risk converging toward sterile perfection. The antidote is deliberate friction: introducing idiosyncrasies, analog artifacts, and asymmetrical layouts.',
      'Our responsibility as designers is to inject soul into algorithmic rigor.',
    ],
  },
  {
    id: 'micro-interactions-nuance',
    title: 'The Architecture of Micro-Delight: Why 120fps Feedback Loops Matter',
    subtitle: 'How tactile micro-interactions bridge the emotional void of sterile glass.',
    date: 'Aug 04, 2025',
    readTime: '3 min read',
    category: 'Interaction',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=300&auto=format&fit=crop',
    content: [
      'A millisecond is the boundary between an application feeling responsive and feeling magical. High-refresh OLED displays have conditioned users to expect immediate kinesthetic confirmation for every fingertip touch.',
      'When you toggle a switch, does it snap stiffly, or does the spring compress with dampened elasticity? When audio cues accompany visual haptics, the brain registers tactile presence across completely glass surfaces.',
      'Craft lives in these invisible fractions of time.',
    ],
  },
  {
    id: 'dark-mode-philosophy',
    title: 'Chromatics in Deep Shadows: Formulating True Midnight Interfaces',
    subtitle: 'Deconstructing OLED pitch black, contrast ratios, and luminous hierarchy.',
    date: 'Jun 18, 2025',
    readTime: '5 min read',
    category: 'Design Systems',
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=300&auto=format&fit=crop',
    content: [
      'Pure `#000000` is rarely found in nature. In software, stark black creates harsh chromatic halos when paired with sharp white typefaces, causing ocular fatigue during extended sessions.',
      'By tuning our root background to `hsl(0 0% 4%)` and layering warm strokes at `hsl(0 0% 12%)`, surfaces breathe naturally. Elements recede into deep atmospheric mist rather than hitting a cold digital brick wall.',
      'The goal of dark design is not the absence of light, but the deliberate curation of illumination.',
    ],
  },
];

interface JournalProps {
  onSelectArticle: (article: JournalArticle) => void;
  onViewAll?: () => void;
}

export const Journal: React.FC<JournalProps> = ({
  onSelectArticle,
  onViewAll,
}) => {
  return (
    <section
      id="journal"
      className="bg-bg py-16 md:py-24 text-text-primary relative z-10"
      style={{ backgroundColor: 'hsl(var(--bg))' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header: Same header pattern (eyebrow + "Recent *thoughts*" + subtext + "View all" button) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6"
        >
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-stroke block" />
              <span className="text-xs text-muted uppercase tracking-[0.3em] font-medium">
                Journal
              </span>
            </div>

            {/* Heading: "Recent *thoughts*" — italic word in font-display italic */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-text-primary">
              Recent{' '}
              <span className="font-display italic font-normal text-text-primary">
                thoughts
              </span>
            </h2>

            {/* Subtext */}
            <p className="text-sm md:text-base text-muted mt-3 max-w-lg">
              Perspectives on interactive architecture, spatial intelligence, and design systems.
            </p>
          </div>

          {/* "View all" button */}
          <button
            onClick={onViewAll}
            className="group relative hidden md:inline-flex items-center rounded-full text-xs uppercase tracking-[0.2em] font-medium p-[1.5px] transition-all duration-300 hover:scale-105 shrink-0 cursor-pointer"
          >
            <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-surface border border-stroke group-hover:border-transparent text-text-primary transition-all duration-300">
              <span>View all thoughts</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </button>
        </motion.div>

        {/* 4 journal entries displayed as horizontal pills (rounded-[40px] sm:rounded-full) */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {JOURNAL_ENTRIES.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.6,
                delay: idx * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              onClick={() => onSelectArticle(entry)}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-4 sm:p-5 rounded-[40px] sm:rounded-full bg-surface/30 hover:bg-surface border border-stroke hover:border-stroke/80 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
              style={{
                backgroundColor: 'hsla(var(--surface) / 0.35)',
                borderColor: 'hsl(var(--stroke))',
              }}
            >
              {/* Left side: Thumbnail + Title */}
              <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                {/* Rounded thumbnail image */}
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border border-stroke/70">
                  <img
                    src={entry.image}
                    alt={entry.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>

                <div className="min-w-0 pr-2">
                  <span className="text-[11px] text-muted uppercase tracking-[0.2em] font-mono block sm:hidden mb-1">
                    {entry.category} • {entry.date}
                  </span>
                  <h3 className="text-base sm:text-lg md:text-xl font-medium text-text-primary group-hover:text-white transition-colors truncate">
                    {entry.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted truncate hidden md:block mt-0.5">
                    {entry.subtitle}
                  </p>
                </div>
              </div>

              {/* Right side: Read time + Date + Arrow pill */}
              <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pl-16 sm:pl-0">
                <span className="text-xs text-muted font-mono hidden lg:inline-block">
                  {entry.category}
                </span>

                <div className="flex items-center gap-3 text-xs text-muted font-mono">
                  <span>{entry.readTime}</span>
                  <span className="w-1 h-1 rounded-full bg-stroke" />
                  <span>{entry.date}</span>
                </div>

                {/* Right Arrow Action */}
                <div className="w-8 h-8 rounded-full border border-stroke flex items-center justify-center text-muted group-hover:text-text-primary group-hover:border-transparent group-hover:accent-gradient transition-all duration-300 shrink-0">
                  <span className="text-sm transform transition-transform duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Journal;
