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
  Minimize2,
  ListChecks,
  History,
  Play,
  Plus,
  Bug,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { ExecutionResult, TestCase, ExecutionHistoryItem } from '../types/compiler';

interface ConsolePaneProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  stdin: string;
  onChangeStdin: (val: string) => void;
  onClearOutput: () => void;
  onOpenAIFix: () => void;
  testCases: TestCase[];
  onAddTestCase: () => void;
  onRemoveTestCase: (id: string) => void;
  onUpdateTestCase: (id: string, updates: Partial<TestCase>) => void;
  onRunTestCases: () => void;
  isRunningTests?: boolean;
  history: ExecutionHistoryItem[];
  onRestoreHistory: (item: ExecutionHistoryItem) => void;
}

export const ConsolePane: React.FC<ConsolePaneProps> = ({
  result,
  isRunning,
  stdin,
  onChangeStdin,
  onClearOutput,
  onOpenAIFix,
  testCases,
  onAddTestCase,
  onRemoveTestCase,
  onUpdateTestCase,
  onRunTestCases,
  isRunningTests = false,
  history,
  onRestoreHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'output' | 'stdin' | 'tests' | 'problems' | 'history'>('output');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    if (!result) return;
    const text =
      (result.stdout ? `--- STDOUT ---\n${result.stdout}\n` : '') +
      (result.stderr ? `--- STDERR ---\n${result.stderr}\n` : '');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasStderr = Boolean(result && result.stderr && result.stderr.trim().length > 0);

  return (
    <div
      className={`relative flex flex-col bg-slate-900 border-l border-slate-800/80 transition-all ${
        isExpanded ? 'h-full md:w-full' : 'h-full w-full'
      } overflow-hidden font-sans`}
    >
      {/* Console Tab Bar */}
      <div className="h-9 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between text-xs select-none shrink-0 overflow-x-auto">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1">
          {/* Output Tab */}
          <button
            onClick={() => setActiveTab('output')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'output'
                ? 'bg-slate-800 text-slate-100 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Output</span>
            {hasStderr && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
          </button>

          {/* Stdin Tab */}
          <button
            onClick={() => setActiveTab('stdin')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'stdin'
                ? 'bg-slate-800 text-slate-100 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5 text-indigo-400" />
            <span>Stdin</span>
            {stdin.trim().length > 0 && (
              <span className="text-[10px] text-cyan-400 font-mono">({stdin.trim().length}B)</span>
            )}
          </button>

          {/* Test Cases Tab */}
          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'tests'
                ? 'bg-slate-800 text-slate-100 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ListChecks className="w-3.5 h-3.5 text-teal-400" />
            <span>Test Cases</span>
            {testCases.length > 0 && (
              <span className="text-[10px] text-slate-500 font-mono">({testCases.length})</span>
            )}
          </button>

          {/* Problems Tab */}
          <button
            onClick={() => setActiveTab('problems')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'problems'
                ? 'bg-slate-800 text-slate-100 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Bug className="w-3.5 h-3.5 text-amber-400" />
            <span>Problems</span>
            {hasStderr && (
              <span className="px-1 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[9px]">
                1
              </span>
            )}
          </button>

          {/* Execution History Tab */}
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer hidden sm:flex ${
              activeTab === 'history'
                ? 'bg-slate-800 text-slate-100 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <History className="w-3.5 h-3.5 text-purple-400" />
            <span>History</span>
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
            title="Clear Console Output"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title={isExpanded ? 'Restore Panel' : 'Maximize Panel'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-auto p-3 font-mono text-xs">
        
        {/* 1. STDIN TAB */}
        {activeTab === 'stdin' && (
          <div className="h-full flex flex-col">
            <div className="text-[11px] text-slate-400 mb-2 font-sans flex items-center justify-between">
              <span>Interactive input buffer fed to <code>stdin</code> during compilation.</span>
              <button
                onClick={() => onChangeStdin('')}
                className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer text-xs"
              >
                Clear Input
              </button>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 mb-2 font-sans text-[11px]">
              <span className="text-slate-500">Presets:</span>
              {[
                { label: 'Numbers (5 \\n 1 2 3 4 5)', val: '5\n1 2 3 4 5' },
                { label: 'Two Strings', val: 'Hello\nWorld' },
                { label: 'Matrix 2x2', val: '2 2\n1 0\n0 1' },
              ].map((p, i) => (
                <button
                  key={i}
                  onClick={() => onChangeStdin(p.val)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <textarea
              value={stdin}
              onChange={(e) => onChangeStdin(e.target.value)}
              placeholder="Enter input values here (space, comma, or newline separated)...&#10;Example:&#10;5&#10;10 20 30 40 50"
              className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 font-mono text-xs resize-none focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        )}

        {/* 2. OUTPUT TAB */}
        {activeTab === 'output' && (
          <div className="h-full flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto space-y-3">
              {isRunning ? (
                <div className="flex items-center gap-3 py-8 text-slate-400">
                  <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  <span>Dispatching job to gVisor sandbox container...</span>
                </div>
              ) : !result ? (
                <div className="py-16 text-center text-slate-500 font-sans">
                  <TerminalIcon className="w-9 h-9 mx-auto mb-2.5 text-slate-700" />
                  <p className="text-xs text-slate-400 font-medium">Console Output is Empty</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Press <span className="text-emerald-400 font-semibold font-mono">Run</span> or ⌘+Enter to execute your program.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Status Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                    <div className="flex items-center gap-2">
                      {result.exitCode === 0 ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Exit Code 0 (Success)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Exit Code {result.exitCode} (Terminated with Error)</span>
                        </div>
                      )}
                      <span aria-hidden="true" className="text-slate-700">·</span>
                      <span className="text-slate-400 font-mono">{result.language} {result.version}</span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 font-mono">
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
                          <span>Runtime or Syntax Error Detected</span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-sans">
                          CodexNova AI can parse this stack trace, pinpoint the root cause, and auto-patch the bug with a unified diff.
                        </p>
                      </div>
                      <button
                        onClick={onOpenAIFix}
                        className="shrink-0 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-sans text-xs font-semibold rounded-md shadow transition-colors cursor-pointer"
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
                      <pre className="p-3 rounded-lg bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800/60 selection:bg-emerald-900/50">
                        {result.stdout}
                      </pre>
                    </div>
                  )}

                  {/* Stderr Output */}
                  {result.stderr && (
                    <div>
                      <div className="text-[10px] uppercase font-mono tracking-wider text-rose-400 mb-1">
                        Standard Error / Stack Trace (stderr)
                      </div>
                      <pre className="p-3 rounded-lg bg-slate-950 text-rose-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed border border-rose-900/40 selection:bg-rose-900/50">
                        {result.stderr}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. TEST CASES TAB */}
        {activeTab === 'tests' && (
          <div className="h-full flex flex-col space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-white">Algorithm Test Runner</h4>
                <p className="text-[11px] text-slate-400">Validate code against multiple custom test vectors.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onAddTestCase}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Case</span>
                </button>
                <button
                  onClick={onRunTestCases}
                  disabled={isRunningTests || testCases.length === 0}
                  className="flex items-center gap-1.5 px-3 py-1 rounded bg-teal-600 hover:bg-teal-500 text-slate-950 text-xs font-bold shadow cursor-pointer disabled:opacity-50"
                >
                  {isRunningTests ? (
                    <div className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Play className="w-3 h-3 fill-slate-950" />
                  )}
                  <span>Run All Cases</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {testCases.map((tc, idx) => (
                <div key={tc.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-slate-300">
                      Case #{idx + 1}: {tc.name}
                    </span>
                    <div className="flex items-center gap-2">
                      {tc.status === 'passed' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                          PASSED
                        </span>
                      )}
                      {tc.status === 'failed' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-400 border border-rose-800/40">
                          FAILED
                        </span>
                      )}
                      {testCases.length > 1 && (
                        <button
                          onClick={() => onRemoveTestCase(tc.id)}
                          className="text-slate-500 hover:text-rose-400 p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 block mb-0.5">Input (stdin)</span>
                      <textarea
                        rows={2}
                        value={tc.input}
                        onChange={(e) => onUpdateTestCase(tc.id, { input: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 resize-none focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 block mb-0.5">Expected Output</span>
                      <textarea
                        rows={2}
                        value={tc.expectedOutput || ''}
                        onChange={(e) => onUpdateTestCase(tc.id, { expectedOutput: e.target.value })}
                        placeholder="Optional assertion..."
                        className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 resize-none focus:outline-none"
                      />
                    </div>
                  </div>

                  {tc.actualOutput && (
                    <div className="text-xs font-mono pt-1 border-t border-slate-800/50">
                      <span className="text-[10px] uppercase text-slate-500 block mb-0.5">Actual Output</span>
                      <pre className="p-1.5 rounded bg-slate-900 text-slate-300 text-[11px] overflow-x-auto whitespace-pre-wrap">
                        {tc.actualOutput}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. PROBLEMS TAB */}
        {activeTab === 'problems' && (
          <div className="h-full space-y-3 font-sans">
            <h4 className="text-xs font-semibold text-white">Diagnostic Problems &amp; Linters</h4>
            {hasStderr ? (
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-rose-300 font-semibold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Compiler Traceback Error</span>
                  </div>
                  <button
                    onClick={onOpenAIFix}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-medium cursor-pointer"
                  >
                    1-Click AI Fix
                  </button>
                </div>
                <pre className="font-mono text-xs text-rose-300 bg-slate-950 p-2.5 rounded border border-rose-900/30 overflow-x-auto whitespace-pre-wrap">
                  {result?.stderr}
                </pre>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500/80" />
                <p className="text-xs text-slate-300 font-medium">No Problems Detected</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Your source code compiles cleanly without errors.</p>
              </div>
            )}
          </div>
        )}

        {/* 5. EXECUTION HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="h-full space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-white">Execution Timeline</h4>
              <span className="text-[11px] text-slate-400 font-mono">{history.length} records</span>
            </div>

            {history.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <History className="w-8 h-8 mx-auto mb-2 text-slate-700" />
                <p className="text-xs">No execution history recorded in this session yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.result.exitCode === 0 ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      <span className="font-mono text-slate-200">{item.language}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-400 font-mono">{item.result.executionTimeMs}ms</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-mono text-[10px]">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      <button
                        onClick={() => onRestoreHistory(item)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] cursor-pointer"
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Console Bottom Info Bar */}
      <div className="h-6 px-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[10px] text-slate-500 font-mono select-none shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3 h-3 text-cyan-500" />
          <span>gVisor Sandboxed Container</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Mem Limit: 128MB</span>
          <span>Timeout: 8s</span>
        </div>
      </div>
    </div>
  );
};

export default ConsolePane;
