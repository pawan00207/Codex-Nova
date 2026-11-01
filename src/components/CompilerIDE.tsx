import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './Header';
import { FileExplorer } from './FileExplorer';
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
import { ProUpgradeModal } from './ProUpgradeModal';
import { useToast } from './Toast';
import { LANGUAGES } from '../config/languages';
import { 
  LanguageConfig, 
  ExecutionResult, 
  EditorTheme, 
  ProjectFile, 
  TestCase, 
  ExecutionHistoryItem 
} from '../types/compiler';
import { UserProfile } from '../types/user';
import { FOUNDER_ADMIN } from '../services/userService';
import { executeCode } from '../services/executionService';
import { executeWasmLocally } from '../services/wasmExecutionService';

interface CompilerIDEProps {
  onChangeView: (view: 'ide' | 'landing' | 'about' | 'admin') => void;
  currentView: 'ide' | 'landing' | 'about' | 'admin';
}

// Initial starter project files
const INITIAL_PROJECT_FILES: ProjectFile[] = [
  {
    id: 'file-py',
    name: 'main.py',
    languageId: 'python',
    content: `# CodeNova v1.0 — Python Cloud Sandbox
# Press Run (Ctrl + Enter) to execute

def fibonacci(n):
    a, b = 0, 1
    series = []
    for _ in range(n):
        series.append(a)
        a, b = b, a + b
    return series

print("🚀 Running CodeNova Cloud Python Environment")
print("Fibonacci Sequence (first 10 numbers):")
print(fibonacci(10))
`,
    isModified: false,
  },
  {
    id: 'file-ts',
    name: 'index.ts',
    languageId: 'typescript',
    content: `// CodeNova v1.0 — TypeScript Runtime
interface AlgorithmResult<T> {
  data: T[];
  executionTimeMs: number;
}

function processData(items: number[]): AlgorithmResult<number> {
  const start = performance.now();
  const squared = items.map(x => x * x);
  return {
    data: squared,
    executionTimeMs: performance.now() - start
  };
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
console.log("TypeScript Process Result:", processData(numbers));
`,
    isModified: false,
  },
  {
    id: 'file-cpp',
    name: 'solution.cpp',
    languageId: 'cpp',
    content: `// CodeNova v1.0 — C++20 Sandbox (GCC / Clang)
#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::vector<int> numbers = {10, 25, 42, 58, 99};
    long long sum = std::accumulate(numbers.begin(), numbers.end(), 0LL);
    
    std::cout << "⚡ CodeNova High-Performance C++ Sandbox" << std::endl;
    std::cout << "Sum of elements: " << sum << std::endl;
    std::cout << "Vector size: " << numbers.size() << std::endl;
    
    return 0;
}
`,
    isModified: false,
  },
  {
    id: 'file-java',
    name: 'Main.java',
    languageId: 'java',
    content: `// CodeNova v1.0 — Java 17 Runtime
import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        System.out.println("☕ CodeNova Cloud Java Environment");
        List<String> frameworks = Arrays.asList("Spring Boot", "Quarkus", "Micronaut", "CodeNova");
        
        frameworks.stream()
            .map(String::toUpperCase)
            .forEach(item -> System.out.println("-> " + item));
    }
}
`,
    isModified: false,
  },
  {
    id: 'file-go',
    name: 'app.go',
    languageId: 'go',
    content: `// CodeNova v1.0 — Golang 1.22
package main

import (
	"fmt"
	"time"
)

func worker(id int, ch chan string) {
	time.Sleep(10 * time.Millisecond)
	ch <- fmt.Sprintf("Goroutine worker #%d finished", id)
}

func main() {
	fmt.Println("🐹 CodeNova Go Concurrency Sandbox")
	ch := make(chan string, 3)

	for i := 1; i <= 3; i++ {
		go worker(i, ch)
	}

	for i := 1; i <= 3; i++ {
		fmt.Println(<-ch)
	}
}
`,
    isModified: false,
  },
  {
    id: 'file-rs',
    name: 'main.rs',
    languageId: 'rust',
    content: `// CodeNova v1.0 — Rust 1.75
fn main() {
    println!("🦀 CodeNova Memory-Safe Rust Sandbox");
    let items = vec![1, 2, 3, 4, 5];
    let doubled: Vec<i32> = items.iter().map(|&x| x * 2).collect();
    
    println!("Original: {:?}", items);
    println!("Doubled:  {:?}", doubled);
}
`,
    isModified: false,
  },
];

// Default Test Cases
const INITIAL_TEST_CASES: TestCase[] = [
  {
    id: 'tc-1',
    name: 'Test Case 1',
    input: '5',
    expectedOutput: '',
    status: 'idle',
  },
  {
    id: 'tc-2',
    name: 'Test Case 2',
    input: '10',
    expectedOutput: '',
    status: 'idle',
  },
];

export const CompilerIDE: React.FC<CompilerIDEProps> = ({ onChangeView, currentView }) => {
  const { showToast } = useToast();

  // Project Files State
  const [files, setFiles] = useState<ProjectFile[]>(() => {
    try {
      const saved = localStorage.getItem('codenova_project_files_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_PROJECT_FILES;
  });

  const [activeFileId, setActiveFileId] = useState<string>(() => {
    return files[0]?.id || 'file-py';
  });

  // Current active file
  const activeFile = files.find((f) => f.id === activeFileId) || files[0] || INITIAL_PROJECT_FILES[0];

  // Helper to determine language config from file extension
  const getLanguageForFile = useCallback((fileName: string): LanguageConfig => {
    const ext = '.' + (fileName.split('.').pop() || '').toLowerCase();
    const matched = LANGUAGES.find((l) => l.extension.toLowerCase() === ext);
    return matched || LANGUAGES[0];
  }, []);

  // Language state synchronized with active file
  const [currentLanguage, setCurrentLanguage] = useState<LanguageConfig>(() => {
    return getLanguageForFile(activeFile.name);
  });

  // Console / Execution state
  const [stdin, setStdin] = useState<string>('');
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [theme, setTheme] = useState<EditorTheme>(() => {
    return (localStorage.getItem('codenova_theme') as EditorTheme) || 'cyberpunk';
  });
  const [isWasmMode, setIsWasmMode] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Editor Settings
  const [fontSize, setFontSize] = useState<number>(() => {
    const val = localStorage.getItem('codenova_font_size');
    return val ? parseInt(val, 10) : 14;
  });
  const [tabSize, setTabSize] = useState<number>(() => {
    const val = localStorage.getItem('codenova_tab_size');
    return val ? parseInt(val, 10) : 2;
  });
  const [wordWrap, setWordWrap] = useState<boolean>(() => {
    return localStorage.getItem('codenova_word_wrap') === 'true';
  });
  const [minimap, setMinimap] = useState<boolean>(() => {
    const val = localStorage.getItem('codenova_minimap');
    return val !== null ? val === 'true' : true;
  });
  const [autoSave, setAutoSave] = useState<boolean>(() => {
    const val = localStorage.getItem('codenova_auto_save');
    return val !== null ? val === 'true' : true;
  });
  const [isExplorerCollapsed, setIsExplorerCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('codenova_explorer_collapsed') === 'true';
  });
  const [isSaved, setIsSaved] = useState<boolean>(true);

  // Test cases & Execution history
  const [testCases, setTestCases] = useState<TestCase[]>(() => {
    try {
      const saved = localStorage.getItem('codenova_test_cases_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TEST_CASES;
  });
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [history, setHistory] = useState<ExecutionHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('codenova_history_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

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
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  // PWA install state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Persist files whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('codenova_project_files_v1', JSON.stringify(files));
    } catch {}
  }, [files]);

  // Persist test cases
  useEffect(() => {
    try {
      localStorage.setItem('codenova_test_cases_v1', JSON.stringify(testCases));
    } catch {}
  }, [testCases]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem('codenova_history_v1', JSON.stringify(history));
    } catch {}
  }, [history]);

  // Online / offline & PWA listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Connected to cloud sandbox cluster', 'info');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('Offline mode active — using in-browser WASM engines', 'info');
    };

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
  }, [showToast]);

  // Sync language when active file changes
  const handleSelectFile = (fileId: string) => {
    const target = files.find((f) => f.id === fileId);
    if (target) {
      setActiveFileId(fileId);
      const detectedLang = getLanguageForFile(target.name);
      setCurrentLanguage(detectedLang);
    }
  };

  // Code editor change
  const handleCodeChange = (newCode: string) => {
    setIsSaved(false);
    setFiles((prev) =>
      prev.map((f) =>
        f.id === activeFileId
          ? { ...f, content: newCode, isModified: true }
          : f
      )
    );
  };

  // Debounced auto-save
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!autoSave) return;
    if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);

    autoSaveTimeoutRef.current = setTimeout(() => {
      setIsSaved(true);
      setFiles((prev) =>
        prev.map((f) => (f.id === activeFileId ? { ...f, isModified: false } : f))
      );
    }, 1200);

    return () => {
      if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    };
  }, [activeFile.content, autoSave, activeFileId]);

  // Explicit Save
  const handleSave = () => {
    setIsSaved(true);
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, isModified: false } : f))
    );
    showToast(`Saved ${activeFile.name}`, 'success');
  };

  // When language is selected from Header dropdown
  const handleSelectLanguage = (lang: LanguageConfig) => {
    setCurrentLanguage(lang);
    // Find if a file already exists for this language
    const existingFile = files.find((f) => {
      const ext = '.' + f.name.split('.').pop()?.toLowerCase();
      return ext === lang.extension.toLowerCase();
    });

    if (existingFile) {
      setActiveFileId(existingFile.id);
    } else {
      // Create new starter file for this language
      const newFileId = `file-${lang.id}-${Date.now()}`;
      const newFileName = `main${lang.extension}`;
      const newFile: ProjectFile = {
        id: newFileId,
        name: newFileName,
        languageId: lang.id,
        content: lang.boilerplate,
        isModified: false,
      };
      setFiles((prev) => [...prev, newFile]);
      setActiveFileId(newFileId);
      showToast(`Created ${newFileName} for ${lang.name}`, 'info');
    }
  };

  // Reset boilerplate for active file
  const handleResetCode = () => {
    handleCodeChange(currentLanguage.boilerplate);
    showToast(`Reset ${activeFile.name} to boilerplate`, 'info');
  };

  // Snippet / Template selection
  const handleSelectSnippet = (snippet: any) => {
    handleCodeChange(snippet.code);
    if (snippet.sampleStdin) {
      setStdin(snippet.sampleStdin);
    }
    showToast(`Loaded template: ${snippet.title}`, 'info');
  };

  // File Explorer Operations
  const handleCreateFile = (fileName: string) => {
    const ext = '.' + (fileName.split('.').pop() || '').toLowerCase();
    const matchedLang = LANGUAGES.find((l) => l.extension.toLowerCase() === ext) || currentLanguage;
    const newFile: ProjectFile = {
      id: 'file-' + Date.now(),
      name: fileName,
      languageId: matchedLang.id,
      content: matchedLang.boilerplate,
      isModified: false,
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
    setCurrentLanguage(matchedLang);
    showToast(`Created file: ${fileName}`, 'success');
  };

  const handleRenameFile = (fileId: string, newName: string) => {
    const matchedLang = getLanguageForFile(newName);
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, name: newName, languageId: matchedLang.id } : f
      )
    );
    if (fileId === activeFileId) {
      setCurrentLanguage(matchedLang);
    }
    showToast(`Renamed file to ${newName}`, 'success');
  };

  const handleDeleteFile = (fileId: string) => {
    if (files.length <= 1) {
      showToast('Cannot delete the last remaining file in the project', 'error');
      return;
    }
    const toDelete = files.find((f) => f.id === fileId);
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (fileId === activeFileId) {
      const remaining = files.filter((f) => f.id !== fileId);
      if (remaining.length > 0) {
        setActiveFileId(remaining[0].id);
        setCurrentLanguage(getLanguageForFile(remaining[0].name));
      }
    }
    showToast(`Deleted ${toDelete?.name || 'file'}`, 'info');
  };

  const handleDuplicateFile = (fileId: string) => {
    const target = files.find((f) => f.id === fileId);
    if (!target) return;
    const parts = target.name.split('.');
    const ext = parts.length > 1 ? '.' + parts.pop() : '';
    const base = parts.join('.');
    const newName = `${base}_copy${ext}`;

    const newFile: ProjectFile = {
      id: 'file-' + Date.now(),
      name: newName,
      languageId: target.languageId,
      content: target.content,
      isModified: true,
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
    showToast(`Duplicated ${target.name} -> ${newName}`, 'success');
  };

  const handleCloseFileTab = (fileId: string) => {
    handleDeleteFile(fileId);
  };

  const handleNewFileTab = () => {
    const ext = currentLanguage.extension;
    const newName = `untitled_${files.length + 1}${ext}`;
    handleCreateFile(newName);
  };

  // Run Code
  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);

    try {
      let res: ExecutionResult;
      if (isWasmMode || (!isOnline && currentLanguage.offlineCapable)) {
        res = await executeWasmLocally(currentLanguage.id, activeFile.content, stdin);
      } else {
        res = await executeCode(currentLanguage.id, activeFile.content, stdin);
      }
      setExecutionResult(res);

      // Record to Execution History
      const historyItem: ExecutionHistoryItem = {
        id: 'run-' + Date.now(),
        timestamp: Date.now(),
        language: currentLanguage.name,
        code: activeFile.content,
        stdin: stdin,
        result: res,
      };
      setHistory((prev) => [historyItem, ...prev.slice(0, 19)]);

      // Update user stats
      setCurrentUser((prev) => ({
        ...prev,
        totalRuns: prev.totalRuns + 1,
      }));

      if (res.exitCode === 0 && (!res.stderr || res.stderr.trim().length === 0)) {
        showToast(`Compiled successfully in ${res.executionTimeMs}ms`, 'success');
      } else {
        showToast('Compilation completed with diagnostics or errors', 'error');
      }
    } catch (err: any) {
      const errRes: ExecutionResult = {
        stdout: '',
        stderr: err?.message || 'Execution failed due to network or sandbox timeout.',
        exitCode: 1,
        executionTimeMs: 0,
        memoryKb: 0,
        language: currentLanguage.name,
        version: currentLanguage.version,
        success: false,
      };
      setExecutionResult(errRes);
      showToast('Sandbox runtime error', 'error');
    } finally {
      setIsRunning(false);
    }
  };

  // Run Test Cases Suite
  const handleRunTestCases = async () => {
    if (isRunningTests || testCases.length === 0) return;
    setIsRunningTests(true);
    showToast(`Running test suite (${testCases.length} test cases)...`, 'info');

    let passedCount = 0;
    const updatedCases: TestCase[] = [];

    for (const tc of testCases) {
      try {
        let res: ExecutionResult;
        if (isWasmMode || (!isOnline && currentLanguage.offlineCapable)) {
          res = await executeWasmLocally(currentLanguage.id, activeFile.content, tc.input);
        } else {
          res = await executeCode(currentLanguage.id, activeFile.content, tc.input);
        }

        const actual = res.stdout.trim();
        const expected = (tc.expectedOutput || '').trim();
        const isPass = expected ? actual === expected : res.exitCode === 0;

        if (isPass) passedCount++;

        updatedCases.push({
          ...tc,
          actualOutput: actual || res.stderr,
          status: isPass ? 'passed' : 'failed',
        });
      } catch (err: any) {
        updatedCases.push({
          ...tc,
          actualOutput: err?.message || 'Test runner error',
          status: 'failed',
        });
      }
    }

    setTestCases(updatedCases);
    setIsRunningTests(false);

    if (passedCount === testCases.length) {
      showToast(`All ${testCases.length} test cases passed!`, 'success');
    } else {
      showToast(`${passedCount}/${testCases.length} test cases passed`, 'error');
    }
  };

  // Restore Code from History
  const handleRestoreHistory = (item: ExecutionHistoryItem) => {
    handleCodeChange(item.code);
    if (item.stdin) setStdin(item.stdin);
    setExecutionResult(item.result);
    showToast(`Restored code from ${item.language} run (${new Date(item.timestamp).toLocaleTimeString()})`, 'info');
  };

  // Install PWA
  const handleInstallPwa = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
      });
    }
  };

  // Pro Upgrade Success
  const handleProUpgradeSuccess = (plan: 'pro' | 'student_pro') => {
    setCurrentUser((prev) => ({
      ...prev,
      plan: plan === 'student_pro' ? 'campus_license' : 'pro',
    }));
    showToast(`🎉 Upgraded to CodeNova Pro (${plan === 'student_pro' ? 'Campus Edition' : 'Professional'})`, 'success');
  };

  const hasError = Boolean(
    executionResult &&
      (executionResult.exitCode !== 0 ||
        (executionResult.stderr && executionResult.stderr.trim().length > 0))
  );

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0a0d14] text-slate-100 overflow-hidden font-sans select-none">
      
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
        onChangeTheme={(th) => {
          setTheme(th);
          localStorage.setItem('codenova_theme', th);
        }}
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
        onOpenProModal={() => setIsProModalOpen(true)}
      />

      {/* Main Multi-Pane IDE Workspace */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden relative">
        
        {/* Left Pane: Collapsible File Explorer */}
        <FileExplorer
          files={files}
          activeFileId={activeFileId}
          onSelectFile={handleSelectFile}
          onCreateFile={handleCreateFile}
          onRenameFile={handleRenameFile}
          onDeleteFile={handleDeleteFile}
          onDuplicateFile={handleDuplicateFile}
          onOpenProModal={() => setIsProModalOpen(true)}
          currentUser={currentUser}
          fontSize={fontSize}
          onChangeFontSize={(sz) => {
            setFontSize(sz);
            localStorage.setItem('codenova_font_size', sz.toString());
          }}
          tabSize={tabSize}
          onChangeTabSize={(sz) => {
            setTabSize(sz);
            localStorage.setItem('codenova_tab_size', sz.toString());
          }}
          wordWrap={wordWrap}
          onToggleWordWrap={() => {
            setWordWrap((prev) => {
              const next = !prev;
              localStorage.setItem('codenova_word_wrap', String(next));
              return next;
            });
          }}
          minimap={minimap}
          onToggleMinimap={() => {
            setMinimap((prev) => {
              const next = !prev;
              localStorage.setItem('codenova_minimap', String(next));
              return next;
            });
          }}
          autoSave={autoSave}
          onToggleAutoSave={() => {
            setAutoSave((prev) => {
              const next = !prev;
              localStorage.setItem('codenova_auto_save', String(next));
              return next;
            });
          }}
          isCollapsed={isExplorerCollapsed}
          onToggleCollapse={() => {
            setIsExplorerCollapsed((prev) => {
              const next = !prev;
              localStorage.setItem('codenova_explorer_collapsed', String(next));
              return next;
            });
          }}
        />

        {/* Center Pane: Multi-Tab Code Editor (Monaco) */}
        <div className="flex-1 flex flex-col h-1/2 md:h-full relative min-h-0 min-w-0 bg-[#0d111a]">
          <EditorPane
            files={files}
            activeFileId={activeFileId}
            onSelectFile={handleSelectFile}
            onCloseFileTab={handleCloseFileTab}
            onNewFileTab={handleNewFileTab}
            code={activeFile.content}
            onChangeCode={handleCodeChange}
            language={currentLanguage.monacoLang}
            theme={theme}
            onRun={handleRun}
            onSave={handleSave}
            isSaved={isSaved}
            fontSize={fontSize}
            tabSize={tabSize}
            wordWrap={wordWrap}
            minimap={minimap}
            onToggleWordWrap={() => setWordWrap(!wordWrap)}
            onToggleMinimap={() => setMinimap(!minimap)}
            onChangeFontSize={(sz) => setFontSize(sz)}
          />
        </div>

        {/* Right Pane: 5-Tab Console & Terminal Workspace */}
        <div className="w-full md:w-[420px] lg:w-[480px] xl:w-[540px] h-1/2 md:h-full relative min-h-0 border-t md:border-t-0 md:border-l border-slate-800/80 bg-[#0a0d14] flex flex-col shrink-0">
          <ConsolePane
            result={executionResult}
            isRunning={isRunning}
            stdin={stdin}
            onChangeStdin={setStdin}
            onClearOutput={() => setExecutionResult(null)}
            onOpenAIFix={() => setIsAIFixOpen(true)}
            testCases={testCases}
            onAddTestCase={() => {
              const newTc: TestCase = {
                id: 'tc-' + Date.now(),
                name: `Test Case ${testCases.length + 1}`,
                input: '',
                expectedOutput: '',
                status: 'idle',
              };
              setTestCases((prev) => [...prev, newTc]);
            }}
            onRemoveTestCase={(id) => {
              setTestCases((prev) => prev.filter((tc) => tc.id !== id));
            }}
            onUpdateTestCase={(id, updates) => {
              setTestCases((prev) =>
                prev.map((tc) => (tc.id === id ? { ...tc, ...updates } : tc))
              );
            }}
            onRunTestCases={handleRunTestCases}
            isRunningTests={isRunningTests}
            history={history}
            onRestoreHistory={handleRestoreHistory}
          />
        </div>
      </div>

      {/* Modals & Dialogs */}
      <AIFixModal
        isOpen={isAIFixOpen}
        onClose={() => setIsAIFixOpen(false)}
        code={activeFile.content}
        stderr={executionResult?.stderr || 'Syntax or runtime error'}
        language={currentLanguage.name}
        onApplyFix={(fixedCode) => {
          handleCodeChange(fixedCode);
          setIsAIFixOpen(false);
          showToast('AI Code Fix applied to current file', 'success');
        }}
      />

      <ExplainModal
        isOpen={isExplainOpen}
        onClose={() => setIsExplainOpen(false)}
        code={activeFile.content}
        language={currentLanguage.name}
      />

      <FlowchartModal
        isOpen={isFlowchartOpen}
        onClose={() => setIsFlowchartOpen(false)}
        code={activeFile.content}
        language={currentLanguage.name}
      />

      <VisualTracerModal
        isOpen={isVisualTracerOpen}
        onClose={() => setIsVisualTracerOpen(false)}
        code={activeFile.content}
        language={currentLanguage.name}
      />

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        code={activeFile.content}
        language={currentLanguage.name}
      />

      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        code={activeFile.content}
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
          showToast(`Welcome back, ${user.fullName}`, 'success');
        }}
      />

      <ProUpgradeModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        currentUser={currentUser}
        onUpgradeSuccess={handleProUpgradeSuccess}
      />
    </div>
  );
};

export default CompilerIDE;
