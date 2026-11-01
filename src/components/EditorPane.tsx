import React, { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { EditorTheme } from '../types/compiler';

interface EditorPaneProps {
  code: string;
  onChangeCode: (newCode: string) => void;
  language: string;
  theme: EditorTheme;
  onRun: () => void;
  fileName: string;
}

export const EditorPane: React.FC<EditorPaneProps> = ({
  code,
  onChangeCode,
  language,
  theme,
  onRun,
  fileName,
}) => {
  const editorRef = useRef<any>(null);

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
  };

  // Map our theme names to Monaco themes
  const getMonacoTheme = (th: EditorTheme): string => {
    if (th === 'cyberpunk') return 'cyberpunk';
    if (th === 'amoled') return 'amoled';
    if (th === 'light') return 'light';
    return 'vs-dark';
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 overflow-hidden">
      {/* Editor File Tab Bar */}
      <div className="h-9 bg-slate-900/90 border-b border-slate-800/80 px-4 flex items-center justify-between text-xs text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="font-mono text-slate-200 font-medium">{fileName}</span>
          <span className="text-[10px] text-slate-500">· UTF-8</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
          <span>Tab: 4 spaces</span>
          <span>Press ⌘+Enter to Run</span>
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
            fontSize: 13.5,
            fontFamily: "'Fira Code', 'Courier New', monospace",
            fontLigatures: true,
            tabSize: 4,
            minimap: { enabled: true, maxColumn: 40 },
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
