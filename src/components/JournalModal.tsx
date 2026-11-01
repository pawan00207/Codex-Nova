import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JournalArticle } from './Journal';

interface JournalModalProps {
  article: JournalArticle | null;
  onClose: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-3xl max-h-[85vh] bg-surface border border-stroke rounded-3xl overflow-y-auto shadow-2xl flex flex-col p-6 sm:p-10"
          style={{ backgroundColor: 'hsl(var(--surface))' }}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-stroke/40">
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted font-mono tracking-widest uppercase">
                {article.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-stroke" />
              <span className="text-xs text-muted font-mono">{article.date}</span>
              <span className="w-1 h-1 rounded-full bg-stroke" />
              <span className="text-xs text-muted font-mono">{article.readTime}</span>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-bg border border-stroke text-muted hover:text-text-primary flex items-center justify-center transition-colors cursor-pointer text-sm"
              aria-label="Close article"
            >
              ✕
            </button>
          </div>

          {/* Article Header */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display italic text-text-primary mb-4 leading-tight">
            {article.title}
          </h2>

          <p className="text-sm sm:text-base text-muted italic mb-8 pb-6 border-b border-stroke/40">
            {article.subtitle}
          </p>

          {/* Body Content */}
          <div className="flex flex-col gap-6 text-sm sm:text-base text-text-primary/85 leading-relaxed font-light">
            {article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Footer Info */}
          <div className="mt-10 pt-6 border-t border-stroke/40 flex items-center justify-between">
            <span className="text-xs text-muted font-mono">
              Written by Michael Smith • Chicago, IL
            </span>
            <button
              onClick={onClose}
              className="text-xs font-mono uppercase tracking-wider text-text-primary hover:text-muted transition-colors cursor-pointer"
            >
              ← Back to Journal
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default JournalModal;
