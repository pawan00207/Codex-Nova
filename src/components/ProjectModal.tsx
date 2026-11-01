import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from './SelectedWorks';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-surface border border-stroke rounded-3xl overflow-y-auto shadow-2xl flex flex-col"
          style={{ backgroundColor: 'hsl(var(--surface))' }}
        >
          {/* Header Image Cover */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden shrink-0">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-bg/80 backdrop-blur-md border border-stroke text-text-primary flex items-center justify-center hover:bg-bg transition-colors cursor-pointer text-lg"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Title Over Header */}
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-xs text-muted tracking-[0.25em] uppercase font-mono mb-2 block">
                {project.category} • {project.year}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display italic text-text-primary">
                {project.title}
              </h2>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 md:p-10 flex flex-col gap-8">
            {/* Description */}
            <div>
              <h3 className="text-xs text-muted uppercase tracking-[0.2em] font-mono mb-2">
                Executive Overview
              </h3>
              <p className="text-base sm:text-lg text-text-primary/90 leading-relaxed font-light">
                {project.description}
              </p>
            </div>

            {/* Grid of details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-stroke/40">
              <div>
                <span className="text-xs text-muted uppercase tracking-[0.2em] font-mono block mb-1">
                  Client
                </span>
                <span className="text-sm font-medium text-text-primary">
                  {project.client}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted uppercase tracking-[0.2em] font-mono block mb-1">
                  Timeline
                </span>
                <span className="text-sm font-medium text-text-primary">
                  {project.year} (4 Months)
                </span>
              </div>
              <div>
                <span className="text-xs text-muted uppercase tracking-[0.2em] font-mono block mb-1">
                  Deliverables
                </span>
                <span className="text-sm font-medium text-text-primary">
                  {project.deliverables}
                </span>
              </div>
            </div>

            {/* Tags */}
            <div>
              <span className="text-xs text-muted uppercase tracking-[0.2em] font-mono block mb-3">
                Technologies & Specialties
              </span>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1.5 rounded-full bg-stroke/40 border border-stroke text-text-primary font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer action */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                Close
              </button>
              <a
                href="#contact"
                onClick={() => {
                  onClose();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="relative p-[1.5px] rounded-full accent-gradient inline-block"
              >
                <span className="block px-6 py-2.5 rounded-full bg-surface text-text-primary text-xs font-mono uppercase tracking-wider hover:bg-transparent hover:text-white transition-all font-medium">
                  Inquire About Similar Work ↗
                </span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;
