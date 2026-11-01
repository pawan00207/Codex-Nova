import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  language: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  code,
  language,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  if (!isOpen) return null;

  const questions = generateQuizQuestions(code, language);

  const handleSelect = (questionId: number, optionIdx: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const score = Object.entries(selectedAnswers).reduce((acc, [qId, ansIdx]) => {
    const q = questions.find((item) => item.id === Number(qId));
    return q && q.correctIndex === ansIdx ? acc + 1 : acc;
  }, 0);

  const allAnswered = questions.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Concept Mastery Quiz ({language})</h2>
              <p className="text-[11px] text-slate-400">Test your comprehension of algorithmic invariants and patterns</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Questions */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {questions.map((q, idx) => {
            const chosen = selectedAnswers[q.id];
            const isAnswered = chosen !== undefined;
            const isCorrect = isAnswered && chosen === q.correctIndex;

            return (
              <div key={q.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xs font-semibold text-white flex items-start gap-2">
                    <span className="font-mono text-cyan-400 shrink-0">Q{idx + 1}.</span>
                    <span>{q.question}</span>
                  </div>
                  {showResults && (
                    <div>
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    let optionStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                    if (showResults) {
                      if (optIdx === q.correctIndex) {
                        optionStyle = 'bg-emerald-950/60 border-emerald-600/80 text-emerald-200 font-semibold';
                      } else if (chosen === optIdx) {
                        optionStyle = 'bg-rose-950/60 border-rose-600/80 text-rose-200 line-through';
                      }
                    } else if (chosen === optIdx) {
                      optionStyle = 'bg-cyan-950/60 border-cyan-500 text-cyan-200 font-medium';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={showResults}
                        onClick={() => handleSelect(q.id, optIdx)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${optionStyle}`}
                      >
                        <span className="font-mono mr-2 text-[11px] text-slate-500">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Explanation */}
                {showResults && (
                  <div className={`p-2.5 rounded-lg text-[11px] leading-relaxed ${isCorrect ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-900/40' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}>
                    <span className="font-semibold">{isCorrect ? 'Correct! ' : 'Explanation: '}</span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Score & Evaluation */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 text-xs">
          {showResults ? (
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="font-semibold text-white">
                Score: <span className="font-mono text-cyan-400 text-sm">{score} / {questions.length}</span> ({Math.round((score / questions.length) * 100)}%)
              </span>
            </div>
          ) : (
            <div className="text-slate-400 font-mono text-[11px]">
              {Object.keys(selectedAnswers).length} of {questions.length} answered
            </div>
          )}

          <div className="flex items-center gap-2">
            {showResults ? (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>
            ) : (
              <button
                onClick={() => setShowResults(true)}
                disabled={Object.keys(selectedAnswers).length === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-semibold shadow-md transition-all disabled:opacity-40 cursor-pointer"
              >
                <span>Submit & Reveal Answers ({Object.keys(selectedAnswers).length}/{questions.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Generates concept-focused MCQs tailored to the code
function generateQuizQuestions(code: string, language: string): Question[] {
  const hasLoop = code.includes('for ') || code.includes('while ');
  const hasFunction = code.includes('def ') || code.includes('function ') || code.includes('int main');

  return [
    {
      id: 1,
      question: `What is the primary computational time complexity of this ${language} algorithm?`,
      options: [
        'O(1) Constant time',
        'O(N) Linear time proportional to input cardinality',
        'O(N^2) Quadratic time due to nested loops',
        'O(2^N) Exponential time'
      ],
      correctIndex: hasLoop ? 1 : 0,
      explanation: hasLoop 
        ? 'The algorithm traverses the input elements linearly, scaling proportionally with O(N) operations.'
        : 'The algorithm evaluates direct operations in constant time O(1) without unbounded recursion.',
    },
    {
      id: 2,
      question: `How does memory allocation behave during the execution of this solution?`,
      options: [
        'Heap memory is leaked because memory is never reclaimed',
        'Stack frames allocate local primitive identifiers with O(1) auxiliary overhead',
        'Memory usage grows exponentially with each tick',
        'Garbage collection freezes the OS thread'
      ],
      correctIndex: 1,
      explanation: 'Function scope variables sit in contiguous stack frames with zero garbage collection overhead.',
    },
    {
      id: 3,
      question: `What critical edge case must be validated to avoid runtime crashes?`,
      options: [
        'Empty input streams triggering Unexpected EOF or index errors',
        'Integer overflow exceeding 64-bit limits',
        'Concurrent thread race condition',
        'All of the above depending on input constraints'
      ],
      correctIndex: 3,
      explanation: 'Robust production code handles empty streams, unbounded integers, and resource boundaries gracefully.',
    },
  ];
}
