import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-3xl max-h-[88vh] bg-surface border border-stroke rounded-3xl overflow-y-auto shadow-2xl flex flex-col p-6 sm:p-10"
          style={{ backgroundColor: 'hsl(var(--surface))' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-stroke/40 mb-8">
            <div>
              <span className="text-xs text-muted uppercase tracking-[0.3em] font-mono block mb-1">
                Curriculum Vitae
              </span>
              <h2 className="text-3xl sm:text-4xl font-display italic text-text-primary">
                Michael Smith
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-1 font-mono">
                Principal Creative Technologist & Design Engineer • Chicago, IL
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-bg border border-stroke text-muted hover:text-text-primary flex items-center justify-center transition-colors cursor-pointer text-base"
              aria-label="Close Resume"
            >
              ✕
            </button>
          </div>

          {/* Experience Timeline */}
          <div className="flex flex-col gap-8 mb-10">
            <h3 className="text-xs uppercase tracking-[0.25em] font-mono text-muted">
              Select Experience
            </h3>

            <div className="flex flex-col gap-6">
              {[
                {
                  role: 'Founding Design Engineer',
                  company: 'Aether Kinetics Studio',
                  period: '2022 — Present',
                  desc: 'Leading visual engineering and WebGL development for luxury brands and advanced spatial hardware interfaces.',
                },
                {
                  role: 'Staff Interaction Designer',
                  company: 'Form & Function Labs',
                  period: '2018 — 2022',
                  desc: 'Architected design systems used by over 40M end users; pioneered micro-interaction physics pipelines in React and WebGL.',
                },
                {
                  role: 'Senior Frontend Architect',
                  company: 'Metropolis Interactive',
                  period: '2014 — 2018',
                  desc: 'Spearheaded performance optimization for generative web experiences and large-scale editorial publications.',
                },
              ].map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-4 border-b border-stroke/20">
                  <div>
                    <h4 className="text-base sm:text-lg font-medium text-text-primary">
                      {item.role}{' '}
                      <span className="text-muted font-normal text-sm">
                        @ {item.company}
                      </span>
                    </h4>
                    <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <span className="text-xs text-muted font-mono shrink-0 sm:text-right mt-1 sm:mt-0">
                    {item.period}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Competencies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pt-4 border-t border-stroke/40">
            <div>
              <h4 className="text-xs uppercase tracking-[0.25em] font-mono text-muted mb-3">
                Technologies
              </h4>
              <p className="text-xs sm:text-sm text-text-primary/80 font-mono leading-relaxed">
                React, TypeScript, Three.js, WebGL/GLSL, GSAP, Tailwind CSS, Framer Motion, Node.js, WebAudio API, HLS Streaming
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.25em] font-mono text-muted mb-3">
                Disciplines
              </h4>
              <p className="text-xs sm:text-sm text-text-primary/80 font-mono leading-relaxed">
                Creative Direction, Motion Design, Spatial UI, Design Tokens, Performance Auditing, Generative Systems
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-stroke/40 flex items-center justify-between">
            <span className="text-xs text-muted font-mono">
              Available for Q1/Q2 2026 engagements
            </span>
            <div className="flex items-center gap-3">
              <a
                href="mailto:hello@michaelsmith.com?subject=Inquiry%20regarding%20Michael%20Smith%20CV"
                className="relative p-[1.5px] rounded-full accent-gradient inline-block"
              >
                <span className="block px-5 py-2 rounded-full bg-surface text-text-primary text-xs font-mono uppercase tracking-wider hover:bg-transparent hover:text-white transition-all font-medium">
                  Request Full PDF CV ↗
                </span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ResumeModal;
