import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExplorationItem } from './Explorations';

interface LightboxModalProps {
  item: ExplorationItem | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl w-full bg-surface border border-stroke rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
          style={{ backgroundColor: 'hsl(var(--surface))' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-bg/80 backdrop-blur-md border border-stroke text-text-primary flex items-center justify-center hover:bg-bg transition-colors cursor-pointer text-base"
            aria-label="Close Lightbox"
          >
            ✕
          </button>

          {/* Full Preview Image */}
          <div className="w-full md:w-3/5 aspect-square bg-bg relative overflow-hidden flex items-center justify-center">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details column */}
          <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-px bg-stroke block" />
                <span className="text-[11px] text-muted tracking-[0.2em] uppercase font-mono">
                  {item.category}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display italic text-text-primary mb-4">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-text-primary/80 leading-relaxed font-light mb-6">
                {item.caption}
              </p>

              <div className="flex flex-col gap-2 pt-4 border-t border-stroke/40 text-xs font-mono text-muted">
                <div className="flex justify-between">
                  <span>Renderer:</span>
                  <span className="text-text-primary">GLSL / WebGL 2.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Frame Rate:</span>
                  <span className="text-text-primary">120 FPS Native</span>
                </div>
                <div className="flex justify-between">
                  <span>Color Space:</span>
                  <span className="text-text-primary">Display P3 Wide Gamut</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-stroke/40 flex items-center justify-between">
              <a
                href={item.image}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-text-primary font-mono underline hover:text-muted transition-colors"
              >
                Open Full Asset ↗
              </a>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-stroke/30 text-xs font-mono uppercase tracking-wider text-text-primary hover:bg-stroke/60 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LightboxModal;
