import React from 'react';
import { 
  Play, 
  Sparkles, 
  BookOpen, 
  Download, 
  Cpu, 
  ChevronDown, 
  RotateCcw,
  Palette,
  Terminal,
  Layers,
  User,
  ShieldCheck,
  Info,
  Activity,
  GitBranch,
  HelpCircle,
  Wifi,
  WifiOff,
  DownloadCloud
} from 'lucide-react';
import { LanguageConfig, EditorTheme } from '../types/compiler';
import { UserProfile } from '../types/user';
import { LANGUAGES } from '../config/languages';

interface HeaderProps {
  currentLanguage: LanguageConfig;
  onSelectLanguage: (lang: LanguageConfig) => void;
  isRunning: boolean;
  onRun: () => void;
  onOpenExplain: () => void;
  onOpenAIFix: () => void;
  onOpenDownload: () => void;
  onOpenArchitecture: () => void;
  onResetCode: () => void;
  hasError: boolean;
  theme: EditorTheme;
  onChangeTheme: (theme: EditorTheme) => void;
  onSelectSnippet: (snippet: any) => void;
  currentView: 'ide' | 'landing' | 'about' | 'admin';
  onChangeView: (view: 'ide' | 'landing' | 'about' | 'admin') => void;
  currentUser: UserProfile;
  onOpenAuth: () => void;
  // Phase 2 additions
  isWasmMode: boolean;
  onToggleWasmMode: () => void;
  onOpenVisualTracer: () => void;
  onOpenFlowchart: () => void;
  onOpenQuiz: () => void;
  isOnline: boolean;
  canInstallPwa?: boolean;
  onInstallPwa?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onSelectLanguage,
  isRunning,
  onRun,
  onOpenExplain,
  onOpenAIFix,
  onOpenDownload,
  onOpenArchitecture,
  onResetCode,
  hasError,
  theme,
  onChangeTheme,
  onSelectSnippet,
  currentView,
  onChangeView,
  currentUser,
  onOpenAuth,
  isWasmMode,
  onToggleWasmMode,
  onOpenVisualTracer,
  onOpenFlowchart,
  onOpenQuiz,
  isOnline,
  canInstallPwa,
  onInstallPwa,
}) => {
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'superadmin';

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between gap-3 select-none z-30 shrink-0">
      {/* Brand & Main Nav Links */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => onChangeView('landing')}
          className="flex items-center gap-2 group cursor-pointer text-left"
          title="Go to 3D Landing Page"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Terminal className="w-4 h-4 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white font-['Space_Grotesk']">
                Codex<span className="text-cyan-400">Nova</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-medium bg-cyan-950/60 border border-cyan-800/40 px-1 py-0.2 rounded">
                v1.0
              </span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <span>Cloud Sandbox</span>
            </div>
          </div>
        </button>

        <span className="hidden sm:block w-px h-6 bg-slate-800" />

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1 text-xs">
          <button
            onClick={() => onChangeView('ide')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              currentView === 'ide'
                ? 'bg-slate-800 text-cyan-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            Compiler
          </button>

          <button
            onClick={() => onChangeView('about')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              currentView === 'about'
                ? 'bg-slate-800 text-cyan-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>About Founder</span>
          </button>

          <button
            onClick={() => onChangeView('admin')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              currentView === 'admin'
                ? 'bg-purple-950/80 text-purple-300 border border-purple-800/60'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
            title="Real-time Admin Dashboard"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin</span>
            {isAdmin && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
          </button>
        </div>

        {/* Language Selector Dropdown (When on Compiler IDE) */}
        {currentView === 'ide' && (
          <>
            <span className="hidden lg:block w-px h-6 bg-slate-800" />
            <div className="relative group">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-600 text-xs text-slate-200 transition-colors cursor-pointer">
                <span className="font-semibold text-cyan-400">{currentLanguage.name}</span>
                <span className="text-[10px] text-slate-400">({currentLanguage.version})</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="absolute left-0 top-full mt-1 w-64 max-h-80 overflow-y-auto bg-slate-900 border border-slate-800 rounded-lg shadow-2xl p-1.5 hidden group-hover:block z-50">
                <div className="px-2 py-1 text-[10px] uppercase font-mono tracking-wider text-slate-500">
                  Select Language (12 available)
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => onSelectLanguage(lang)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                      lang.id === currentLanguage.id
                        ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{lang.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">{lang.extension}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Templates Selector */}
            {currentLanguage.snippets && currentLanguage.snippets.length > 0 && (
              <div className="relative group hidden xl:block">
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors cursor-pointer">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Templates</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>
                <div className="absolute left-0 top-full mt-1 w-72 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl p-1.5 hidden group-hover:block z-50">
                  <div className="px-2 py-1 text-[10px] uppercase font-mono tracking-wider text-slate-500">
                    Algorithms & Stdin Examples
                  </div>
                  {currentLanguage.snippets.map((snip, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectSnippet(snip)}
                      className="w-full text-left px-2.5 py-2 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <div className="text-xs font-medium text-slate-200">{snip.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{snip.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {currentView === 'ide' && (
          <>
            {/* Reset Code */}
            <button
              onClick={onResetCode}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset boilerplate"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Visual Tracer (Phase 2) */}
            <button
              onClick={onOpenVisualTracer}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-medium transition-all cursor-pointer"
              title="Step-by-Step Visual Execution Tracer"
            >
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden xl:inline">Trace</span>
            </button>

            {/* Mermaid Flowchart (Phase 2) */}
            <button
              onClick={onOpenFlowchart}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-medium transition-all cursor-pointer"
              title="Generate Mermaid Flowchart"
            >
              <GitBranch className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden xl:inline">Flowchart</span>
            </button>

            {/* Quiz Me (Phase 2) */}
            <button
              onClick={onOpenQuiz}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium transition-all cursor-pointer"
              title="Quiz Me on Code Concepts"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xl:inline">Quiz</span>
            </button>

            {/* AI Fix Error */}
            <button
              onClick={onOpenAIFix}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                hasError
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 ring-2 ring-rose-500/20'
                  : 'bg-slate-800 hover:bg-slate-700/80 text-slate-300 border border-slate-700'
              }`}
              title="AI Error Fixer (NO GPT)"
            >
              <Sparkles className={`w-3.5 h-3.5 ${hasError ? 'text-rose-400 animate-bounce' : 'text-cyan-400'}`} />
              <span className="hidden sm:inline">AI Fix</span>
            </button>

            {/* Explain Mode */}
            <button
              onClick={onOpenExplain}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition-all cursor-pointer"
              title="Concept Learning & Line-by-Line Guide"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Explain</span>
            </button>

            {/* In-Browser WASM Mode Toggle */}
            <button
              onClick={onToggleWasmMode}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isWasmMode
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-700/80 text-slate-400 border border-slate-700'
              }`}
              title={isWasmMode ? 'In-Browser WASM Mode (Offline Active)' : 'Switch to In-Browser WASM Sandbox'}
            >
              <span className={`w-2 h-2 rounded-full ${isWasmMode ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="hidden sm:inline">{isWasmMode ? 'WASM' : 'Cloud'}</span>
            </button>

            {/* Export */}
            <button
              onClick={onOpenDownload}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              title="Export Code & Output"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Export</span>
            </button>
          </>
        )}

        {/* PWA Install Button if available */}
        {canInstallPwa && onInstallPwa && (
          <button
            onClick={onInstallPwa}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-all cursor-pointer"
            title="Install CodexNova PWA (Offline Desktop App)"
          >
            <DownloadCloud className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Install</span>
          </button>
        )}

        {/* Network status icon */}
        <div 
          className="p-1.5 rounded-lg text-slate-500" 
          title={isOnline ? 'Online (Connected to Cloud Sandboxes)' : 'Offline (In-Browser WASM Sandbox Enabled)'}
        >
          {isOnline ? (
            <Wifi className="w-3.5 h-3.5 text-emerald-500/80" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          )}
        </div>

        {/* Architecture Spec Button */}
        <button
          onClick={onOpenArchitecture}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
          title="Architecture, DB Schema & Sandbox Blueprint"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
        </button>

        {/* Theme Selector */}
        {currentView === 'ide' && (
          <div className="relative group">
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer" title="Editor Theme">
              <Palette className="w-3.5 h-3.5" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-36 bg-slate-900 border border-slate-800 rounded-lg shadow-xl p-1 hidden group-hover:block z-50">
              <div className="px-2 py-1 text-[10px] uppercase font-mono text-slate-500">Theme</div>
              {(['vs-dark', 'cyberpunk', 'amoled', 'light'] as EditorTheme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => onChangeTheme(t)}
                  className={`w-full text-left px-2 py-1 rounded text-xs capitalize transition-colors cursor-pointer ${
                    theme === t ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {t.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* User Auth Profile Trigger */}
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-colors cursor-pointer"
          title={`Logged in as ${currentUser.fullName} (${currentUser.role})`}
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-slate-950">
            {currentUser.fullName.slice(0, 1)}
          </div>
          <span className="hidden sm:inline font-medium max-w-[100px] truncate">{currentUser.fullName}</span>
          <span className="text-[9px] font-mono uppercase bg-slate-950 px-1 py-0.5 rounded text-cyan-400">
            {currentUser.plan.split('_')[0]}
          </span>
        </button>

        {/* Run Button (In IDE mode) */}
        {currentView === 'ide' && (
          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold text-xs rounded-lg shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            title="Run Code (Ctrl + Enter)"
          >
            {isRunning ? (
              <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-slate-950" />
            )}
            <span>{isRunning ? 'Running' : 'Run'}</span>
            <span className="hidden lg:inline text-[10px] text-slate-900/70 font-mono">⌘↵</span>
          </button>
        )}
      </div>
    </header>
  );
};
