import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText('hello@michaelsmith.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      onClose();
    }, 2200);
  };

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
          className="relative z-10 w-full max-w-xl bg-surface border border-stroke rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-10"
          style={{ backgroundColor: 'hsl(var(--surface))' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stroke/40 mb-6">
            <div>
              <span className="text-xs text-muted uppercase tracking-[0.3em] font-mono block mb-1">
                Say Hello
              </span>
              <h2 className="text-2xl sm:text-3xl font-display italic text-text-primary">
                Let&apos;s start a conversation
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-bg border border-stroke text-muted hover:text-text-primary flex items-center justify-center transition-colors cursor-pointer text-sm"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {formSubmitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full accent-gradient flex items-center justify-center text-white text-2xl mb-4">
                ✓
              </div>
              <h3 className="text-2xl font-display italic text-text-primary mb-2">
                Message Dispatched
              </h3>
              <p className="text-sm text-muted">
                Thank you for reaching out. Michael will reply within 24 hours.
              </p>
            </div>
          ) : (
            <>
              {/* Direct email quick copy */}
              <div className="p-4 rounded-2xl bg-bg border border-stroke flex items-center justify-between mb-6">
                <div>
                  <span className="text-[11px] text-muted font-mono uppercase tracking-wider block">
                    Direct Email
                  </span>
                  <span className="text-sm font-mono text-text-primary">
                    hello@michaelsmith.com
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-full border border-stroke text-xs font-mono text-text-primary hover:bg-stroke/40 transition-colors cursor-pointer"
                >
                  {copied ? 'Copied ✓' : 'Copy'}
                </button>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-muted block mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Elena Rostova"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-bg border border-stroke text-text-primary text-sm focus:outline-none focus:border-muted font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-muted block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="elena@studio.design"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-bg border border-stroke text-text-primary text-sm focus:outline-none focus:border-muted font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-muted block mb-1.5">
                    Project Details or Inquiry
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Brief overview of project scope, timeline, and goals..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-bg border border-stroke text-text-primary text-sm focus:outline-none focus:border-muted font-sans resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="relative p-[1.5px] rounded-full accent-gradient mt-2 w-full group cursor-pointer"
                >
                  <span className="block w-full py-3.5 rounded-full bg-surface text-center text-xs font-mono uppercase tracking-widest text-text-primary group-hover:bg-transparent group-hover:text-white transition-all font-medium">
                    Send Inquiry ↗
                  </span>
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactModal;
