import React, { useState } from 'react';
import { 
  Terminal as TerminalIcon, 
  Keyboard, 
  Copy, 
  Check, 
  Trash2, 
  Clock, 
  HardDrive, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { ExecutionResult } from '../types/compiler';

interface ConsolePaneProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  stdin: string;
  onChangeStdin: (val: string) => void;
  onClearOutput: () => void;
  onOpenAIFix: () => void;
}

export const ConsolePane: React.FC<ConsolePaneProps> = ({
  result,
  isRunning,
  stdin,
  onChangeStdin,
  onClearOutput,
  onOpenAIFix,
}) => {
  const [activeTab, setActiveTab] = useState<'output' | 'stdin'>('output');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    if (!result) return;
    const text = (result.stdout ? `--- STDOUT ---\n${result.stdout}\n` : '') +
                 (result.stderr ? `--- STDERR ---\n${result.stderr}\n` : '');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasStderr = result && result.stderr && result.stderr.trim().length > 0;

  return (
    <div className={`relative flex flex-col bg-slate-900 border-l border-slate-800/80 transition-all ${isExpanded ? 'w-full' : 'w-full'} h-full overflow-hidden`}>
      {/* Console Tab Bar */}
      <div className="h-9 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between text-xs select-none">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('output')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'output'
                ? 'bg-slate-800 text-slate-100'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Output</span>
            {hasStderr && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
          </button>

          <button
            onClick={() => setActiveTab('stdin')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'stdin'
                ? 'bg-slate-800 text-slate-100'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5 text-indigo-400" />
            <span>Standard Input (Stdin)</span>
            {stdin.trim().length > 0 && <span className="text-[10px] text-slate-400 font-mono">({stdin.trim().length}B)</span>}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {activeTab === 'output' && result && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Copy output to clipboard"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}

          <button
            onClick={onClearOutput}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-auto p-3 font-mono text-xs">
        {activeTab === 'stdin' ? (
          <div className="h-full flex flex-col">
            <div className="text-[11px] text-slate-400 mb-2 font-sans flex items-center justify-between">
              <span>Interactive input fed directly to <code>stdin</code> on run.</span>
              <button 
                onClick={() => onChangeStdin('')}
                className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                Clear Input
              </button>
            </div>
            <textarea
              value={stdin}
              onChange={(e) => onChangeStdin(e.target.value)}
              placeholder="Enter input values here (space, comma, or newline separated)...&#10;Example:&#10;5&#10;10 20 30 40 50"
              className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 font-mono text-xs resize-none focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        ) : (
          <div className="h-full flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto space-y-3">
              {isRunning ? (
                <div className="flex items-center gap-3 py-6 text-slate-400">
                  <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  <span>Dispatching job to gVisor sandbox container...</span>
                </div>
              ) : !result ? (
                <div className="py-12 text-center text-slate-500 font-sans">
                  <TerminalIcon className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
                  <p className="text-xs">No output yet. Click <span className="text-emerald-400 font-semibold">Run</span> or press ⌘+Enter to execute.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Status Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                    <div className="flex items-center gap-2">
                      {result.exitCode === 0 ? (
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Exit Code 0 (Success)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-rose-400">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Exit Code {result.exitCode} (Terminated with Error)</span>
                        </div>
                      )}
                      <span aria-hidden="true" className="text-slate-700">·</span>
                      <span className="text-slate-400">{result.language} {result.version}</span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>{result.executionTimeMs} ms</span>
                      </span>
                      {result.memoryKb > 0 && (
                        <span className="flex items-center gap-1">
                          <HardDrive className="w-3 h-3 text-indigo-400" />
                          <span>{(result.memoryKb / 1024).toFixed(1)} MB</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* AI Fix Suggestion Banner if Error Detected */}
                  {hasStderr && (
                    <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/40 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-rose-300 font-sans text-xs font-semibold mb-1">
                          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                          <span>Execution produced an error. Need an instant fix?</span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-sans">
                          CodexNova AI can analyze your code and traceback to generate a unified diff and 1-click patch.
                        </p>
                      </div>
                      <button
                        onClick={onOpenAIFix}
                        className="shrink-0 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-sans text-xs font-medium rounded-md shadow transition-colors cursor-pointer"
                      >
                        Fix with AI
                      </button>
                    </div>
                  )}

                  {/* Stdout Output */}
                  {result.stdout && (
                    <div>
                      <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1">
                        Standard Output (stdout)
                      </div>
                      <pre className="p-3 rounded-lg bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800/60">
                        {result.stdout}
                      </pre>
                    </div>
                  )}

                  {/* Stderr Output */}
                  {result.stderr && (
                    <div>
                      <div className="text-[10px] uppercase font-mono tracking-wider text-rose-400 mb-1">
                        Standard Error (stderr)
                      </div>
                      <pre className="p-3 rounded-lg bg-slate-950 text-rose-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed border border-rose-900/40">
                        {result.stderr}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
