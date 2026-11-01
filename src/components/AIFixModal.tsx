import React, { useEffect, useState } from 'react';
import { X, Sparkles, Check, ArrowRight, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { AIFixResult } from '../types/compiler';
import { fetchAIFix } from '../services/aiService';

interface AIFixModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  stderr: string;
  language: string;
  onApplyFix: (newCode: string) => void;
}

export const AIFixModal: React.FC<AIFixModalProps> = ({
  isOpen,
  onClose,
  code,
  stderr,
  language,
  onApplyFix,
}) => {
  const [loading, setLoading] = useState(false);
  const [fixResult, setFixResult] = useState<AIFixResult | null>(null);
  const [viewMode, setViewMode] = useState<'fixed' | 'diff'>('fixed');

  useEffect(() => {
    if (isOpen) {
      loadFix();
    }
  }, [isOpen, code, stderr]);

  const loadFix = async () => {
    setLoading(true);
    try {
      const res = await fetchAIFix(code, stderr || 'No stderr specified. Optimize and fix edge cases.', language);
      setFixResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">AI Error Fixer & Root Cause Analysis</h2>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>Language: {language}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Private Sandbox (No Training)
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
              <div className="text-sm font-medium text-slate-200">Analyzing syntax tree & traceback...</div>
              <div className="text-xs text-slate-500 mt-1">Generating unified patch with Gemini 3.8 Flash</div>
            </div>
          ) : !fixResult ? (
            <div className="py-12 text-center text-slate-400">
              <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
              <p>Unable to generate fix. Please check your syntax or network.</p>
              <button
                onClick={loadFix}
                className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg inline-flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Analysis
              </button>
            </div>
          ) : (
            <>
              {/* Root Cause Banner */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-semibold text-rose-400 uppercase font-mono tracking-wider mb-1">
                  Root Cause
                </div>
                <p className="text-sm text-slate-200 font-medium leading-relaxed">
                  {fixResult.rootCause}
                </p>
                {fixResult.diffSummary && (
                  <div className="mt-2 text-xs text-cyan-400 font-mono">
                    Patch: {fixResult.diffSummary}
                  </div>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-300">
                  Fixed Implementation
                </div>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setViewMode('fixed')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      viewMode === 'fixed' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Clean Code
                  </button>
                  <button
                    onClick={() => setViewMode('diff')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      viewMode === 'diff' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Compare Original
                  </button>
                </div>
              </div>

              {/* Code Preview */}
              {viewMode === 'fixed' ? (
                <div className="relative">
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto max-h-72 leading-relaxed">
                    {fixResult.fixedCode}
                  </pre>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-[11px] font-mono text-rose-400 mb-1">Original with Bug</div>
                    <pre className="p-3 rounded-lg bg-slate-950 border border-rose-900/50 font-mono text-xs text-rose-300/80 overflow-x-auto max-h-64 leading-relaxed">
                      {code}
                    </pre>
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-emerald-400 mb-1">Fixed Code</div>
                    <pre className="p-3 rounded-lg bg-slate-950 border border-emerald-900/50 font-mono text-xs text-emerald-300 overflow-x-auto max-h-64 leading-relaxed">
                      {fixResult.fixedCode}
                    </pre>
                  </div>
                </div>
              )}

              {/* Explanation Items */}
              {fixResult.explanation && fixResult.explanation.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-xs font-semibold text-slate-300 mb-2">Key Modifications</div>
                  <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                    {fixResult.explanation.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prevention Tip */}
              {fixResult.preventionTip && (
                <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 flex items-start gap-2">
                  <span className="font-semibold text-cyan-400 shrink-0">Pro Tip:</span>
                  <span>{fixResult.preventionTip}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            Powered by Gemini 3.8 Flash Engine (NO GPT)
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {fixResult && (
              <button
                onClick={() => {
                  onApplyFix(fixResult.fixedCode);
                  onClose();
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Apply Fix to Editor</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
