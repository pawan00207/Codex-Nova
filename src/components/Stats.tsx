import React from 'react';
import { motion } from 'framer-motion';

export const Stats: React.FC = () => {
  const statsData = [
    {
      value: '20+',
      label: 'Years Experience',
      description: 'Pioneering interactive design, creative engineering, and high-performance frontend architecture.',
      highlight: 'EST. 2006',
    },
    {
      value: '95+',
      label: 'Projects Done',
      description: 'Conceived, architected, and shipped for visionary founders, design studios, and global enterprises.',
      highlight: 'GLOBAL REACH',
    },
    {
      value: '200%',
      label: 'Satisfied Clients',
      description: 'Exceeding creative and technical benchmarks with relentless precision and enduring quality.',
      highlight: 'RETENTION RATE',
    },
  ];

  return (
    <section
      id="stats"
      className="bg-bg py-16 md:py-24 text-text-primary relative z-10 border-t border-stroke/40"
      style={{ backgroundColor: 'hsl(var(--bg))' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center max-w-xl mx-auto mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="w-8 h-px bg-stroke block" />
            <span className="text-xs text-muted uppercase tracking-[0.3em] font-medium">
              By The Numbers
            </span>
            <span className="w-8 h-px bg-stroke block" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-text-primary">
            A legacy of{' '}
            <span className="font-display italic font-normal text-text-primary">
              craftsmanship
            </span>
          </h2>
        </motion.div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {statsData.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.8,
                delay: idx * 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="group relative bg-surface border border-stroke rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-lg hover:border-stroke/80 transition-all duration-500"
              style={{
                backgroundColor: 'hsl(var(--surface))',
                borderColor: 'hsl(var(--stroke))',
              }}
            >
              {/* Top ambient hover glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full accent-gradient opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] text-muted tracking-[0.2em] uppercase font-mono">
                    {stat.highlight}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-stroke group-hover:accent-gradient transition-colors" />
                </div>

                {/* Big Stat Value in font-display italic */}
                <div className="font-display italic text-6xl sm:text-7xl md:text-8xl text-text-primary group-hover:text-white transition-colors leading-none tracking-tight mb-4">
                  {stat.value}
                </div>

                {/* Label */}
                <h3 className="text-lg sm:text-xl font-medium text-text-primary mb-3">
                  {stat.label}
                </h3>
              </div>

              {/* Subtext description */}
              <p className="text-xs sm:text-sm text-muted leading-relaxed mt-4 pt-4 border-t border-stroke/40">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
