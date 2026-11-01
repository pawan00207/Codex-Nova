import React, { useEffect, useState } from 'react';
import { 
  X, 
  BookOpen, 
  Clock, 
  HardDrive, 
  Lightbulb, 
  CheckCircle, 
  HelpCircle, 
  Globe2, 
  Sliders, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { ExplainResult } from '../types/compiler';
import { fetchAIExplanation } from '../services/aiService';

interface ExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  language: string;
}

export const ExplainModal: React.FC<ExplainModalProps> = ({
  isOpen,
  onClose,
  code,
  language,
}) => {
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [style, setStyle] = useState<'english' | 'hinglish' | 'hindi'>('english');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExplainResult | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadExplanation();
    }
  }, [isOpen, level, style]);

  const loadExplanation = async () => {
    setLoading(true);
    try {
      const res = await fetchAIExplanation(code, language, level, style);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Concept Learning & Line-by-Line Breakdown</h2>
              <p className="text-xs text-slate-400">Deep architectural pedagogical analysis of active code</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Bar (Level + Language Style) */}
        <div className="px-6 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Level Selector */}
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Depth:</span>
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`px-2.5 py-1 rounded text-xs capitalize transition-colors cursor-pointer ${
                    level === lvl
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Style Selector */}
          <div className="flex items-center gap-2">
            <Globe2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Language:</span>
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              {(['english', 'hinglish', 'hindi'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStyle(st)}
                  className={`px-2.5 py-1 rounded text-xs capitalize transition-colors cursor-pointer ${
                    style === st
                      ? 'bg-cyan-600 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-slate-400">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
              <div className="text-sm font-medium text-slate-200">Deconstructing algorithms & call structures...</div>
              <div className="text-xs text-slate-500 mt-1">Generating custom concept curriculum in {style}</div>
            </div>
          ) : !data ? (
            <div className="py-12 text-center text-slate-500">
              <p>No explanation generated yet.</p>
            </div>
          ) : (
            <>
              {/* Summary Overview */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-semibold text-indigo-400 uppercase font-mono tracking-wider mb-1">
                  Executive Summary
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  {data.summary}
                </p>
              </div>

              {/* Complexity Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Time Complexity</div>
                    <div className="text-base font-bold text-cyan-300 font-mono">{data.timeComplexity}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{data.complexityReasoning}</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <HardDrive className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Space (Auxiliary) Complexity</div>
                    <div className="text-base font-bold text-indigo-300 font-mono">{data.spaceComplexity}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Stack and heap allocation ceiling</div>
                  </div>
                </div>
              </div>

              {/* Concept Cards */}
              {data.concepts && data.concepts.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-300 uppercase font-mono tracking-wider mb-3 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Auto-Detected Concepts ({data.concepts.length})</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data.concepts.map((concept, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
                        <div className="text-sm font-semibold text-white mb-1.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          <span>{concept.name}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                          {concept.description}
                        </p>
                        {concept.commonMistake && (
                          <div className="text-[11px] text-rose-300/90 bg-rose-950/30 border border-rose-900/40 p-2 rounded-lg">
                            <span className="font-semibold text-rose-400">Common Mistake: </span>
                            {concept.commonMistake}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Line-by-Line Breakdown */}
              {data.lineByLine && data.lineByLine.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-300 uppercase font-mono tracking-wider mb-3">
                    Execution Trace & Line-by-Line Logic
                  </div>
                  <div className="space-y-2">
                    {data.lineByLine.map((step, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-3">
                        <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-cyan-400 shrink-0 font-medium">
                          Line {step.lines}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-slate-200 mb-0.5">{step.purpose}</div>
                          <div className="text-xs text-slate-400 leading-relaxed">{step.explanation}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Why it works & Alternative */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.whyItWorks && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-xs font-semibold text-emerald-400 uppercase font-mono tracking-wider mb-1 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Why It Works (Invariant)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {data.whyItWorks}
                    </p>
                  </div>
                )}

                {data.alternativeApproach && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-xs font-semibold text-amber-400 uppercase font-mono tracking-wider mb-1 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Alternative Approach</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {data.alternativeApproach}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            Pedagogical Engine Active · Level: {level.toUpperCase()} · Mode: {style.toUpperCase()}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
