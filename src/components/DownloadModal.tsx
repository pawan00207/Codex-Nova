import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileCode, 
  FileText, 
  FileArchive, 
  Copy, 
  Check, 
  Printer, 
  Share2
} from 'lucide-react';
import { LanguageConfig, ExecutionResult } from '../types/compiler';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  language: LanguageConfig;
  result: ExecutionResult | null;
  stdin: string;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  code,
  language,
  result,
  stdin,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  if (!isOpen) return null;

  const fileName = `codexnova_solution${language.extension}`;
  const outputFileName = `codexnova_output.txt`;

  // Download Source File
  const handleDownloadSource = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Download Output as TXT
  const handleDownloadOutput = () => {
    const content = `CodexNova Execution Output
Language: ${language.name} (${language.version})
Date: ${new Date().toISOString()}
Exit Code: ${result?.exitCode ?? 'N/A'}
Execution Time: ${result?.executionTimeMs ?? 0} ms

--- STDIN ---
${stdin || '[No stdin provided]'}

--- STDOUT ---
${result?.stdout || '[No stdout]'}

--- STDERR ---
${result?.stderr || '[No stderr]'}
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = outputFileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Download HTML Report Snapshot
  const handleDownloadReport = () => {
    const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CodexNova Code Report - ${language.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; margin: 40px; background: #0f172a; color: #f8fafc; }
    h1 { color: #38bdf8; border-bottom: 2px solid #1e293b; padding-bottom: 12px; }
    .meta { font-size: 13px; color: #94a3b8; margin-bottom: 24px; }
    pre { background: #020617; border: 1px solid #1e293b; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 13px; line-height: 1.5; }
    .section-title { font-size: 14px; font-weight: bold; margin-top: 24px; margin-bottom: 8px; color: #38bdf8; text-transform: uppercase; }
    .stdout { color: #86efac; }
    .stderr { color: #fca5a5; }
  </style>
</head>
<body>
  <h1>CodexNova Execution Snapshot</h1>
  <div class="meta">
    Language: <strong>${language.name}</strong> (${language.version}) | 
    Date: ${new Date().toLocaleString()} | 
    Exit Code: ${result?.exitCode ?? 0} | 
    Time: ${result?.executionTimeMs ?? 0}ms
  </div>

  <div class="section-title">Source Code (${fileName})</div>
  <pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>

  ${stdin ? `<div class="section-title">Standard Input (Stdin)</div><pre><code>${stdin}</code></pre>` : ''}

  <div class="section-title">Standard Output</div>
  <pre class="stdout"><code>${(result?.stdout || 'No stdout output').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>

  ${result?.stderr ? `<div class="section-title">Standard Error</div><pre class="stderr"><code>${result.stderr.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>` : ''}
</body>
</html>`;

    const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `codexnova_report_${Date.now()}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyOutput = () => {
    const text = (result?.stdout || '') + (result?.stderr ? `\n${result.stderr}` : '');
    navigator.clipboard.writeText(text);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Download className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Export & Download Workspace</h2>
              <p className="text-xs text-slate-400">Offline source bundles, clean text outputs, and HTML reports</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Grid */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Download Source */}
            <button
              onClick={handleDownloadSource}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-950/80 transition-all text-left flex items-start gap-3 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileCode className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  Source File ({language.extension})
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Download raw {language.name} file ready to compile locally.
                </div>
                <div className="text-[11px] font-mono text-emerald-400/80 mt-2">
                  {fileName} · {(code.length / 1024).toFixed(1)} KB
                </div>
              </div>
            </button>

            {/* Download Output */}
            <button
              onClick={handleDownloadOutput}
              disabled={!result}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-950/80 transition-all text-left flex items-start gap-3 group disabled:opacity-40 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  Console Output (.txt)
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Save stdout, stderr, exit codes, and timestamps.
                </div>
                <div className="text-[11px] font-mono text-cyan-400/80 mt-2">
                  {outputFileName}
                </div>
              </div>
            </button>
          </div>

          {/* HTML / Printable Report */}
          <button
            onClick={handleDownloadReport}
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all text-left flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Printer className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                Complete HTML Snapshot & Printable Report
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Self-contained, styled HTML file containing source code, syntax highlighting, stdin, execution stats, and stdout/stderr.
              </div>
            </div>
          </button>

          {/* Quick Copy Section */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Quick Copy:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Code Copied' : 'Copy Code'}</span>
              </button>

              <button
                onClick={handleCopyOutput}
                disabled={!result}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors disabled:opacity-40 cursor-pointer"
              >
                {copiedOutput ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedOutput ? 'Output Copied' : 'Copy Output'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
