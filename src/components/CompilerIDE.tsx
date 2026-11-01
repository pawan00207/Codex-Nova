import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { EditorPane } from './EditorPane';
import { ConsolePane } from './ConsolePane';
import { AIFixModal } from './AIFixModal';
import { ExplainModal } from './ExplainModal';
import { FlowchartModal } from './FlowchartModal';
import { VisualTracerModal } from './VisualTracerModal';
import { ArchitectureModal } from './ArchitectureModal';
import { QuizModal } from './QuizModal';
import { DownloadModal } from './DownloadModal';
import { AuthModal } from './AuthModal';
import { LANGUAGES } from '../config/languages';
import { LanguageConfig, ExecutionResult, EditorTheme } from '../types/compiler';
import { UserProfile } from '../types/user';
import { FOUNDER_ADMIN } from '../services/userService';
import { executeCode } from '../services/executionService';
import { executeWasmLocally } from '../services/wasmExecutionService';

interface CompilerIDEProps {
  onChangeView: (view: 'ide' | 'landing' | 'about' | 'admin') => void;
  currentView: 'ide' | 'landing' | 'about' | 'admin';
}

export const CompilerIDE: React.FC<CompilerIDEProps> = ({ onChangeView, currentView }) => {
  // Compiler state
  const [currentLanguage, setCurrentLanguage] = useState<LanguageConfig>(LANGUAGES[0]);
  const [codeMap, setCodeMap] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    LANGUAGES.forEach((l) => {
      map[l.id] = l.boilerplate;
    });
    return map;
  });
  const [stdin, setStdin] = useState<string>('');
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [theme, setTheme] = useState<EditorTheme>('cyberpunk');
  const [isWasmMode, setIsWasmMode] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // User auth state
  const [currentUser, setCurrentUser] = useState<UserProfile>(FOUNDER_ADMIN);

  // Modal open states
  const [isExplainOpen, setIsExplainOpen] = useState(false);
  const [isAIFixOpen, setIsAIFixOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isVisualTracerOpen, setIsVisualTracerOpen] = useState(false);
  const [isFlowchartOpen, setIsFlowchartOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // PWA install state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const activeCode = codeMap[currentLanguage.id] || currentLanguage.boilerplate;

  const handleCodeChange = (newCode: string) => {
    setCodeMap((prev) => ({
      ...prev,
      [currentLanguage.id]: newCode,
    }));
  };

  const handleSelectLanguage = (lang: LanguageConfig) => {
    setCurrentLanguage(lang);
    if (!codeMap[lang.id]) {
      setCodeMap((prev) => ({
        ...prev,
        [lang.id]: lang.boilerplate,
      }));
    }
  };

  const handleResetCode = () => {
    handleCodeChange(currentLanguage.boilerplate);
  };

  const handleSelectSnippet = (snippet: any) => {
    handleCodeChange(snippet.code);
    if (snippet.sampleStdin) {
      setStdin(snippet.sampleStdin);
    }
  };

  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);

    try {
      if (isWasmMode || (!isOnline && currentLanguage.offlineCapable)) {
        // Execute in-browser WASM engine
        const res = await executeWasmLocally(currentLanguage.id, activeCode, stdin);
        setExecutionResult(res);
      } else {
        // Execute via cloud backend / Piston sandbox
        const res = await executeCode(currentLanguage.id, activeCode, stdin);
        setExecutionResult(res);
      }

      // Increment runs on user profile
      setCurrentUser((prev) => ({
        ...prev,
        totalRuns: prev.totalRuns + 1,
      }));
    } catch (err: any) {
      setExecutionResult({
        stdout: '',
        stderr: err?.message || 'Execution failed due to network or sandbox timeout.',
        exitCode: 1,
        executionTimeMs: 0,
        memoryKb: 0,
        language: currentLanguage.name,
        version: currentLanguage.version,
        success: false,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleInstallPwa = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
      });
    }
  };

  const hasError = Boolean(
    executionResult &&
      (executionResult.exitCode !== 0 ||
        (executionResult.stderr && executionResult.stderr.trim().length > 0))
  );

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <Header
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
        isRunning={isRunning}
        onRun={handleRun}
        onOpenExplain={() => setIsExplainOpen(true)}
        onOpenAIFix={() => setIsAIFixOpen(true)}
        onOpenDownload={() => setIsDownloadOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onResetCode={handleResetCode}
        hasError={hasError}
        theme={theme}
        onChangeTheme={setTheme}
        onSelectSnippet={handleSelectSnippet}
        currentView={currentView}
        onChangeView={onChangeView}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        isWasmMode={isWasmMode}
        onToggleWasmMode={() => setIsWasmMode(!isWasmMode)}
        onOpenVisualTracer={() => setIsVisualTracerOpen(true)}
        onOpenFlowchart={() => setIsFlowchartOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        isOnline={isOnline}
        canInstallPwa={Boolean(deferredPrompt)}
        onInstallPwa={handleInstallPwa}
      />

      {/* Main Split Layout: Editor (Left) & Terminal Console (Right) */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Editor Pane (Left 60% on desktop) */}
        <div className="w-full md:w-[58%] lg:w-[62%] h-1/2 md:h-full relative min-h-0">
          <EditorPane
            code={activeCode}
            onChangeCode={handleCodeChange}
            language={currentLanguage.monacoLang}
            theme={theme}
            onRun={handleRun}
            fileName={`main${currentLanguage.extension}`}
          />
        </div>

        {/* Console & Terminal Pane (Right 40% on desktop) */}
        <div className="w-full md:w-[42%] lg:w-[38%] h-1/2 md:h-full relative min-h-0 border-t md:border-t-0 md:border-l border-slate-800">
          <ConsolePane
            result={executionResult}
            isRunning={isRunning}
            stdin={stdin}
            onChangeStdin={setStdin}
            onClearOutput={() => setExecutionResult(null)}
            onOpenAIFix={() => setIsAIFixOpen(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <AIFixModal
        isOpen={isAIFixOpen}
        onClose={() => setIsAIFixOpen(false)}
        code={activeCode}
        stderr={executionResult?.stderr || 'Syntax or runtime error'}
        language={currentLanguage.name}
        onApplyFix={(fixedCode) => {
          handleCodeChange(fixedCode);
          setIsAIFixOpen(false);
        }}
      />

      <ExplainModal
        isOpen={isExplainOpen}
        onClose={() => setIsExplainOpen(false)}
        code={activeCode}
        language={currentLanguage.name}
      />

      <FlowchartModal
        isOpen={isFlowchartOpen}
        onClose={() => setIsFlowchartOpen(false)}
        code={activeCode}
        language={currentLanguage.name}
      />

      <VisualTracerModal
        isOpen={isVisualTracerOpen}
        onClose={() => setIsVisualTracerOpen(false)}
        code={activeCode}
        language={currentLanguage.name}
      />

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        code={activeCode}
        language={currentLanguage.name}
      />

      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        code={activeCode}
        language={currentLanguage}
        result={executionResult}
        stdin={stdin}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => {
          setCurrentUser(user);
          setIsAuthOpen(false);
        }}
      />
    </div>
  );
};

export default CompilerIDE;
