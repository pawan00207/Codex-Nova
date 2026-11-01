import React, { useEffect, useRef, useState } from 'react';
import { 
  X, 
  GitBranch, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import mermaid from 'mermaid';

interface FlowchartModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  language: string;
}

export const FlowchartModal: React.FC<FlowchartModalProps> = ({
  isOpen,
  onClose,
  code,
  language,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [mermaidSyntax, setMermaidSyntax] = useState<string>('');
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#020617',
        primaryColor: '#0ea5e9',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#38bdf8',
        lineColor: '#64748b',
        secondaryColor: '#4f46e5',
        tertiaryColor: '#10b981',
      },
      flowchart: {
        curve: 'basis',
        htmlLabels: true,
      },
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      const generated = generateMermaidFromCode(code, language);
      setMermaidSyntax(generated);
      renderChart(generated);
    }
  }, [isOpen, code, language]);

  const renderChart = async (chartDef: string) => {
    try {
      const id = `mermaid_${Date.now()}`;
      const { svg } = await mermaid.render(id, chartDef);
      setSvgContent(svg);
    } catch (err) {
      console.warn('Mermaid render error:', err);
      // Fallback clean SVG flowchart
      setSvgContent(generateFallbackSvg());
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(mermaidSyntax);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `codexnova_flowchart_${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Automated Algorithmic Flowchart Generator</h2>
              <p className="text-[11px] text-slate-400">Mermaid.js visual state and branch progression</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-400 font-mono text-[11px]">
            <span>Language: <strong className="text-cyan-400">{language}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Mermaid'}</span>
            </button>

            <button
              onClick={handleDownloadSvg}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs shadow-md transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download SVG</span>
            </button>
          </div>
        </div>

        {/* Body Viewport */}
        <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center bg-slate-950">
          {svgContent ? (
            <div 
              ref={containerRef}
              dangerouslySetInnerHTML={{ __html: svgContent }}
              className="w-full flex items-center justify-center overflow-auto p-4 [&>svg]:max-w-full [&>svg]:h-auto"
            />
          ) : (
            <div className="py-20 text-center text-slate-500 text-xs">
              <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Generating vector flowchart representation...
            </div>
          )}
        </div>

        {/* Mermaid Definition Preview Accordion */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-col">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1">
            Mermaid Source Definition
          </span>
          <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-24">
            {mermaidSyntax}
          </pre>
        </div>
      </div>
    </div>
  );
};

// Generates Mermaid flowchart syntax by parsing control flow branches in the code
function generateMermaidFromCode(code: string, language: string): string {
  const lines = code.split('\n').map(l => l.trim()).filter(Boolean);
  const nodes: string[] = ['graph TD', '  Start([Start Execution]) --> Init[Initialize Dependencies & Scope]'];

  let prevNode = 'Init';
  let nodeCount = 1;

  for (const line of lines) {
    if (line.startsWith('import') || line.startsWith('#include') || line.startsWith('package')) continue;

    if (line.includes('if ') || line.includes('if(')) {
      const condition = line.replace(/\{$/, '').replace(/:$/, '').trim();
      const decNode = `Dec${nodeCount}`;
      const trueNode = `True${nodeCount}`;
      const falseNode = `False${nodeCount}`;

      nodes.push(`  ${prevNode} --> ${decNode}{"${cleanLabel(condition)}"}`);
      nodes.push(`  ${decNode} -->|True| ${trueNode}[Execute Branch Action]`);
      nodes.push(`  ${decNode} -->|False| ${falseNode}[Continue Evaluation]`);
      nodes.push(`  ${trueNode} --> Merge${nodeCount}[Merge Flow]`);
      nodes.push(`  ${falseNode} --> Merge${nodeCount}`);
      prevNode = `Merge${nodeCount}`;
      nodeCount++;
    } else if (line.includes('for ') || line.includes('while ') || line.includes('while(')) {
      const loopCond = line.replace(/\{$/, '').replace(/:$/, '').trim();
      const loopNode = `Loop${nodeCount}`;
      nodes.push(`  ${prevNode} --> ${loopNode}{"${cleanLabel(loopCond)}"}`);
      nodes.push(`  ${loopNode} -->|Next Iteration| Body${nodeCount}[Process Elements in Loop]`);
      nodes.push(`  Body${nodeCount} -.-> ${loopNode}`);
      nodes.push(`  ${loopNode} -->|Exit Loop| Next${nodeCount}[Loop Terminated]`);
      prevNode = `Next${nodeCount}`;
      nodeCount++;
    } else if (line.includes('return ') || line.includes('exit(') || line.includes('print(') || line.includes('cout')) {
      const retNode = `Action${nodeCount}`;
      nodes.push(`  ${prevNode} --> ${retNode}["${cleanLabel(line.slice(0, 35))}"]`);
      prevNode = retNode;
      nodeCount++;
    }
  }

  nodes.push(`  ${prevNode} --> End([Return & Terminate Execution])`);
  return nodes.join('\n');
}

function cleanLabel(str: string): string {
  return str.replace(/"/g, "'").replace(/[\[\]{}()]/g, ' ').trim().slice(0, 36);
}

function generateFallbackSvg(): string {
  return `<svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
    <rect x="130" y="20" width="140" height="40" rx="20" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
    <text x="200" y="45" fill="#ffffff" font-family="sans-serif" font-size="12" text-anchor="middle">Start Execution</text>
    <line x1="200" y1="60" x2="200" y2="90" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)"/>
    <rect x="110" y="90" width="180" height="40" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>
    <text x="200" y="115" fill="#38bdf8" font-family="sans-serif" font-size="12" text-anchor="middle">Process Logic & Scope</text>
    <line x1="200" y1="130" x2="200" y2="160" stroke="#64748b" stroke-width="2"/>
    <rect x="130" y="160" width="140" height="40" rx="20" fill="#059669" stroke="#34d399" stroke-width="2"/>
    <text x="200" y="185" fill="#ffffff" font-family="sans-serif" font-size="12" text-anchor="middle">End / Exit Code 0</text>
  </svg>`;
}
