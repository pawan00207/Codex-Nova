import React, { useRef, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  RotateCw, 
  AlignLeft, 
  WrapText, 
  MapPin, 
  Check, 
  X,
  FileCode2,
  Plus
} from 'lucide-react';
import { EditorTheme, ProjectFile } from '../types/compiler';

interface EditorPaneProps {
  files: ProjectFile[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  onCloseFileTab: (fileId: string) => void;
  onNewFileTab: () => void;
  code: string;
  onChangeCode: (newCode: string) => void;
  language: string;
  theme: EditorTheme;
  onRun: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  onToggleWordWrap: () => void;
  onToggleMinimap: () => void;
  onChangeFontSize: (size: number) => void;
}

export const EditorPane: React.FC<EditorPaneProps> = ({
  files,
  activeFileId,
  onSelectFile,
  onCloseFileTab,
  onNewFileTab,
  code,
  onChangeCode,
  language,
  theme,
  onRun,
  onSave,
  isSaved = true,
  fontSize,
  tabSize,
  wordWrap,
  minimap,
  onToggleWordWrap,
  onToggleMinimap,
  onChangeFontSize,
}) => {
  const editorRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define Cyberpunk Theme
    monaco.editor.defineTheme('cyberpunk', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '00ff9f', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff007f', fontStyle: 'bold' },
        { token: 'string', foreground: '00f0ff' },
        { token: 'number', foreground: 'ffe600' },
        { token: 'identifier', foreground: 'ffffff' },
      ],
      colors: {
        'editor.background': '#090a0f',
        'editor.foreground': '#e0e6ed',
        'editor.lineHighlightBackground': '#141824',
        'editorCursor.foreground': '#ff007f',
        'editorWhitespace.foreground': '#222838',
        'editorLineNumber.foreground': '#4f5b75',
        'editorLineNumber.activeForeground': '#00f0ff',
      },
    });

    // Define AMOLED Theme
    monaco.editor.defineTheme('amoled', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#000000',
        'editor.foreground': '#ffffff',
        'editor.lineHighlightBackground': '#0a0a0a',
        'editorCursor.foreground': '#38bdf8',
        'editorLineNumber.foreground': '#333333',
        'editorLineNumber.activeForeground': '#ffffff',
      },
    });

    // Bind Ctrl+Enter or Cmd+Enter to trigger Run
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });

    // Bind Ctrl+S or Cmd+S to trigger Save
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
      if (onSave) onSave();
    });
  };

  const handleUndo = () => {
    if (editorRef.current) {
      editorRef.current.trigger('toolbar', 'undo', null);
    }
  };

  const handleRedo = () => {
    if (editorRef.current) {
      editorRef.current.trigger('toolbar', 'redo', null);
    }
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  const getMonacoTheme = (th: EditorTheme): string => {
    if (th === 'cyberpunk') return 'cyberpunk';
    if (th === 'amoled') return 'amoled';
    if (th === 'light') return 'light';
    return 'vs-dark';
  };

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  return (
    <div
      className={`relative w-full h-full flex flex-col bg-slate-950 overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* Editor File Tab Bar */}
      <div className="h-9 bg-slate-900 border-b border-slate-800/80 px-2 flex items-center justify-between text-xs text-slate-400 select-none overflow-x-auto shrink-0">
        
        {/* Left: Open File Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
          {files.map((file) => {
            const isActive = file.id === activeFileId;
            return (
              <div
                key={file.id}
                onClick={() => onSelectFile(file.id)}
                className={`group flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer border ${
                  isActive
                    ? 'bg-slate-800 text-slate-100 border-slate-700 shadow-sm'
                    : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-850 hover:text-slate-300'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="max-w-[120px] truncate">{file.name}</span>
                {file.isModified && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Unsaved changes" />
                )}
                {files.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseFileTab(file.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-opacity cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            onClick={onNewFileTab}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            title="Open new file tab"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Quick Controls & Status */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 shrink-0">
          {/* Save Status Indicator */}
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400">
            {isSaved ? (
              <span className="flex items-center gap-1 text-emerald-400/90">
                <Check className="w-3 h-3" />
                <span>Saved</span>
              </span>
            ) : (
              <span className="text-amber-400/90 font-medium">Auto-saving...</span>
            )}
          </div>

          <span className="w-px h-3.5 bg-slate-800 hidden sm:block" />

          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={handleUndo}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Format Document */}
          <button
            onClick={handleFormat}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer hidden md:block"
            title="Format Document (Shift+Alt+F)"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>

          {/* Word Wrap Toggle */}
          <button
            onClick={onToggleWordWrap}
            className={`p-1 rounded transition-colors cursor-pointer ${
              wordWrap ? 'text-cyan-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Toggle Word Wrap (Alt+Z)"
          >
            <WrapText className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Editor'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Monaco Container */}
      <div className="flex-1 w-full h-full relative">
        <Editor
          height="100%"
          language={language}
          value={code}
          theme={getMonacoTheme(theme)}
          onChange={(value) => onChangeCode(value || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: fontSize || 13.5,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            fontLigatures: true,
            tabSize: tabSize || 4,
            wordWrap: wordWrap ? 'on' : 'off',
            minimap: { enabled: minimap, maxColumn: 40 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            automaticLayout: true,
            bracketPairColorization: { enabled: true },
            padding: { top: 12, bottom: 12 },
          }}
          loading={
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400">
              <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3" />
              <div className="text-xs font-mono">Initializing Monaco Editor Engine...</div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default EditorPane;
