import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipBack, 
  SkipForward, 
  Sliders, 
  Layers, 
  Activity, 
  HardDrive, 
  Database,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface VisualTracerModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  language: string;
}

interface TraceStep {
  stepIndex: number;
  lineNumber: number;
  codeLine: string;
  explanation: string;
  callStack: { frame: string; func: string; line: number }[];
  variables: { name: string; value: string; type: string; mutated?: boolean }[];
  memory: {
    stackItems: { label: string; address: string }[];
    heapItems: { label: string; address: string; content: string }[];
  };
}

export const VisualTracerModal: React.FC<VisualTracerModalProps> = ({
  isOpen,
  onClose,
  code,
  language,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1000); // 1s per step

  // Generate trace steps dynamically from the active source code
  const lines = code.trim().split('\n').filter(l => l.trim().length > 0);
  const traceSteps: TraceStep[] = generateDynamicTrace(lines, language);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= traceSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playSpeed, traceSteps.length]);

  if (!isOpen) return null;

  const active = traceSteps[currentStep] || traceSteps[0];

  const handleStepForward = () => {
    if (currentStep < traceSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Visual Execution Tracer & Memory Inspector</h2>
              <p className="text-[11px] text-slate-400">Step-by-step state visualization, call stack, and heap mapping</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Debug Controls Bar */}
        <div className="px-6 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Playback Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
              title="Reset Execution (Step 0)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleStepBack}
              disabled={currentStep === 0}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-30 transition-colors cursor-pointer"
              title="Step Backward"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs shadow-md transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-slate-950" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
              <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
            </button>

            <button
              onClick={handleStepForward}
              disabled={currentStep >= traceSteps.length - 1}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-30 transition-colors cursor-pointer"
              title="Step Forward"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step Progress Info */}
          <div className="flex items-center gap-3 text-slate-400 font-mono">
            <span>Step {currentStep + 1} of {traceSteps.length}</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="text-cyan-400">Line {active.lineNumber}</span>
          </div>

          {/* Speed Toggle */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Speed:</span>
            {[1500, 1000, 500].map((spd, i) => (
              <button
                key={spd}
                onClick={() => setPlaySpeed(spd)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                  playSpeed === spd ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'hover:bg-slate-900 text-slate-400'
                }`}
              >
                {i === 0 ? '0.5x' : i === 1 ? '1x' : '2x'}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Code with Active Step Highlight */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="text-xs font-semibold text-slate-300 uppercase font-mono tracking-wider flex items-center justify-between">
              <span>Instruction Pointer</span>
              <span className="text-cyan-400 font-mono text-[11px]">{language}</span>
            </div>

            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs overflow-y-auto max-h-[380px]">
              {lines.map((line, idx) => {
                const lineNum = idx + 1;
                const isCurrent = lineNum === active.lineNumber;
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 py-1 px-2 rounded transition-colors ${
                      isCurrent
                        ? 'bg-cyan-500/20 text-cyan-200 border-l-2 border-cyan-400 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-slate-600 select-none w-6 text-right shrink-0">{lineNum}</span>
                    <span className="whitespace-pre overflow-x-auto">{line}</span>
                  </div>
                );
              })}
            </div>

            {/* Step Explanation Banner */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider mb-1">
                Active Step Analysis
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {active.explanation}
              </p>
            </div>
          </div>

          {/* Right: State, Call Stack & Memory Diagram */}
          <div className="lg:col-span-7 space-y-4">
            {/* Variable State Table */}
            <div>
              <div className="text-xs font-semibold text-slate-300 uppercase font-mono tracking-wider mb-2 flex items-center justify-between">
                <span>Scope Variables ({active.variables.length})</span>
                <span className="text-[10px] text-slate-500 font-mono">FRAME: LOCAL</span>
              </div>
              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900/80 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Variable</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {active.variables.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-3 text-center text-slate-500">
                          Scope initialization in progress...
                        </td>
                      </tr>
                    ) : (
                      active.variables.map((v, i) => (
                        <tr key={i} className={v.mutated ? 'bg-cyan-950/30' : ''}>
                          <td className="p-2.5 text-cyan-300 font-semibold">{v.name}</td>
                          <td className="p-2.5 text-slate-400">{v.type}</td>
                          <td className="p-2.5 text-emerald-300">{v.value}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Call Stack & Memory Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Call Stack */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-semibold text-indigo-400 uppercase font-mono tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Call Stack</span>
                </div>
                <div className="space-y-1.5 font-mono text-xs">
                  {active.callStack.map((frame, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-300"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <span>{frame.func}()</span>
                      </div>
                      <span className="text-[10px] text-slate-500">line {frame.line}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Memory Diagram (Stack & Heap) */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-semibold text-emerald-400 uppercase font-mono tracking-wider mb-2 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>Memory Layout</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Stack Pointers</span>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-cyan-300">
                      SP: {active.memory.stackItems[0]?.address || '0x7ffd9a'} ({active.memory.stackItems[0]?.label || 'Frame Root'})
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Heap Segment</span>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-emerald-300">
                      HP: {active.memory.heapItems[0]?.address || '0x55a2f0'} → {active.memory.heapItems[0]?.content || 'Dynamic Allocation'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">Dynamic AST Tracer Active</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Close Tracer
          </button>
        </div>
      </div>
    </div>
  );
};

// Dynamic trace generator interpreting standard code logic into step states
function generateDynamicTrace(lines: string[], language: string): TraceStep[] {
  if (lines.length === 0) {
    return [
      {
        stepIndex: 0,
        lineNumber: 1,
        codeLine: '// Ready',
        explanation: 'Initialize program entry point.',
        callStack: [{ frame: 'main', func: 'main', line: 1 }],
        variables: [],
        memory: {
          stackItems: [{ label: 'main', address: '0x7ffd10' }],
          heapItems: [{ label: 'heap_init', address: '0x55a000', content: 'Allocated' }],
        },
      },
    ];
  }

  const steps: TraceStep[] = [];
  const trackedVars: { name: string; value: string; type: string }[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const lineNum = index + 1;

    // Detect variable assignments
    const assignMatch = trimmed.match(/([a-zA-Z_]\w*)\s*=\s*(.+)/);
    if (assignMatch && !trimmed.startsWith('def ') && !trimmed.startsWith('function ') && !trimmed.startsWith('if ')) {
      const varName = assignMatch[1];
      const valStr = assignMatch[2].replace(/;$/, '').trim();
      const existing = trackedVars.find(v => v.name === varName);
      if (existing) {
        existing.value = valStr;
      } else {
        trackedVars.push({
          name: varName,
          value: valStr.length > 25 ? valStr.slice(0, 22) + '...' : valStr,
          type: valStr.startsWith('[') ? 'Array' : valStr.startsWith('{') ? 'Map/Dict' : isNaN(Number(valStr)) ? 'String' : 'Integer',
        });
      }
    }

    steps.push({
      stepIndex: index,
      lineNumber: lineNum,
      codeLine: line,
      explanation: trimmed.startsWith('def ') || trimmed.startsWith('function ')
        ? `Defines function signature and pushes entry frame to call stack.`
        : trimmed.startsWith('for ') || trimmed.startsWith('while ')
        ? `Evaluates loop boundary condition and advances iteration index.`
        : trimmed.startsWith('return ')
        ? `Returns evaluation payload and prepares to pop frame from stack.`
        : assignMatch
        ? `Evaluates right-hand expression and updates variable '${assignMatch[1]}' in scope.`
        : `Executes instruction: ${trimmed.slice(0, 35)}...`,
      callStack: [
        { frame: 'main_frame', func: trimmed.includes('def ') || trimmed.includes('function') ? trimmed.split(/\s+/)[1].split('(')[0] : 'main', line: lineNum },
      ],
      variables: JSON.parse(JSON.stringify(trackedVars)),
      memory: {
        stackItems: [
          { label: `StackFrame_${lineNum}`, address: `0x7ffd${(10 + index * 4).toString(16)}` },
        ],
        heapItems: [
          { label: `HeapAlloc_${lineNum}`, address: `0x55a${(100 + index * 8).toString(16)}`, content: trackedVars[0]?.value || 'Primitive' },
        ],
      },
    });
  });

  return steps;
}
