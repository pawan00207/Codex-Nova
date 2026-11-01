import React, { useState } from 'react';
import { 
  FileCode2, 
  FolderTree, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Copy, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  Settings2, 
  Keyboard, 
  Zap, 
  Code2, 
  Check, 
  X,
  FileText,
  Sliders,
  FolderPlus
} from 'lucide-react';
import { ProjectFile } from '../types/compiler';
import { UserProfile } from '../types/user';

interface FileExplorerProps {
  files: ProjectFile[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  onCreateFile: (fileName: string) => void;
  onRenameFile: (fileId: string, newName: string) => void;
  onDeleteFile: (fileId: string) => void;
  onDuplicateFile: (fileId: string) => void;
  onOpenProModal: () => void;
  currentUser: UserProfile;
  // Editor Settings controls
  fontSize: number;
  onChangeFontSize: (size: number) => void;
  tabSize: number;
  onChangeTabSize: (size: number) => void;
  wordWrap: boolean;
  onToggleWordWrap: () => void;
  minimap: boolean;
  onToggleMinimap: () => void;
  autoSave: boolean;
  onToggleAutoSave: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onRenameFile,
  onDeleteFile,
  onDuplicateFile,
  onOpenProModal,
  currentUser,
  fontSize,
  onChangeFontSize,
  tabSize,
  onChangeTabSize,
  wordWrap,
  onToggleWordWrap,
  minimap,
  onToggleMinimap,
  autoSave,
  onToggleAutoSave,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editFileName, setEditFileName] = useState('');
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // File type icon resolver
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'py':
        return <span className="text-amber-400 font-mono text-[10px] font-bold">PY</span>;
      case 'cpp':
      case 'c':
        return <span className="text-blue-400 font-mono text-[10px] font-bold">C++</span>;
      case 'js':
        return <span className="text-yellow-400 font-mono text-[10px] font-bold">JS</span>;
      case 'ts':
        return <span className="text-cyan-400 font-mono text-[10px] font-bold">TS</span>;
      case 'java':
        return <span className="text-orange-400 font-mono text-[10px] font-bold">JV</span>;
      case 'rs':
        return <span className="text-red-400 font-mono text-[10px] font-bold">RS</span>;
      case 'go':
        return <span className="text-teal-400 font-mono text-[10px] font-bold">GO</span>;
      case 'sql':
        return <span className="text-purple-400 font-mono text-[10px] font-bold">DB</span>;
      case 'sh':
        return <span className="text-emerald-400 font-mono text-[10px] font-bold">SH</span>;
      default:
        return <FileCode2 className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const handleStartCreate = () => {
    setIsCreatingFile(true);
    setNewFileName('');
  };

  const handleConfirmCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFileName.trim()) {
      onCreateFile(newFileName.trim());
      setIsCreatingFile(false);
      setNewFileName('');
    }
  };

  const handleStartRename = (file: ProjectFile, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFileId(file.id);
    setEditFileName(file.name);
  };

  const handleConfirmRename = (fileId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (editFileName.trim()) {
      onRenameFile(fileId, editFileName.trim());
      setEditingFileId(null);
    }
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isPro = currentUser.plan === 'pro' || currentUser.plan === 'campus_license' || currentUser.role === 'superadmin';

  if (isCollapsed) {
    return (
      <div className="w-12 h-full bg-slate-950 border-r border-slate-800 flex flex-col items-center py-3 select-none shrink-0 z-20">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Expand Project Explorer"
        >
          <FolderTree className="w-4 h-4 text-cyan-400" />
        </button>

        <div className="w-6 h-px bg-slate-800 my-3" />

        <button
          onClick={handleStartCreate}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="New File"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer mt-auto"
          title="Editor Settings"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <aside className="w-64 h-full bg-slate-950/95 border-r border-slate-800/80 flex flex-col select-none shrink-0 z-20 font-sans text-xs text-slate-300">
      
      {/* Sidebar Header */}
      <div className="h-10 px-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-2 font-semibold text-slate-200 tracking-tight">
          <FolderTree className="w-3.5 h-3.5 text-cyan-400" />
          <span className="uppercase tracking-wider font-mono text-[11px]">Explorer</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleStartCreate}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Create New File"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Collapse Sidebar"
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-2 border-b border-slate-800/50 bg-slate-950">
        <div className="relative flex items-center">
          <Search className="w-3 h-3 text-slate-500 absolute left-2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Project Section Title */}
      <div className="px-3.5 py-1.5 flex items-center justify-between text-[10px] font-mono uppercase text-slate-500 tracking-wider">
        <span>Files ({filteredFiles.length})</span>
        <span className="text-slate-600">Local Cache</span>
      </div>

      {/* Files Tree List */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {/* Create new file form */}
        {isCreatingFile && (
          <form onSubmit={handleConfirmCreate} className="flex items-center gap-1 px-2 py-1 bg-slate-900 rounded border border-cyan-500/60 mb-1">
            <span className="text-[10px] font-mono text-cyan-400">+</span>
            <input
              type="text"
              autoFocus
              placeholder="e.g. script.py, test.cpp"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="flex-1 bg-transparent text-xs text-white focus:outline-none font-mono"
            />
            <button type="submit" className="text-emerald-400 hover:text-emerald-300 p-0.5 cursor-pointer">
              <Check className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingFile(false)}
              className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </form>
        )}

        {filteredFiles.map((file) => {
          const isActive = file.id === activeFileId;
          const isEditing = editingFileId === file.id;

          if (isEditing) {
            return (
              <form
                key={file.id}
                onSubmit={(e) => handleConfirmRename(file.id, e)}
                className="flex items-center gap-1 px-2 py-1 bg-slate-900 rounded border border-indigo-500/60"
              >
                <input
                  type="text"
                  autoFocus
                  value={editFileName}
                  onChange={(e) => setEditFileName(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-white focus:outline-none font-mono"
                />
                <button type="submit" className="text-emerald-400 hover:text-emerald-300 p-0.5 cursor-pointer">
                  <Check className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingFileId(null)}
                  className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </form>
            );
          }

          return (
            <div
              key={file.id}
              onClick={() => onSelectFile(file.id)}
              className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${
                isActive
                  ? 'bg-slate-800 text-cyan-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-4 flex items-center justify-center shrink-0">
                  {getFileIcon(file.name)}
                </span>
                <span className="truncate font-mono text-[11.5px]">{file.name}</span>
                {file.isModified && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" title="Unsaved changes" />
                )}
              </div>

              {/* Hover File Actions */}
              <div className="hidden group-hover:flex items-center gap-1">
                <button
                  onClick={(e) => handleStartRename(file, e)}
                  className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Rename"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateFile(file.id);
                  }}
                  className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Duplicate"
                >
                  <Copy className="w-3 h-3" />
                </button>
                {files.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile(file.id);
                    }}
                    className="p-1 rounded hover:bg-slate-700 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Editor Settings Collapsible Drawer */}
      {showSettings && (
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 space-y-2.5 animate-in slide-in-from-bottom-2 text-[11px]">
          <div className="flex items-center justify-between font-semibold text-slate-300">
            <span>Editor Preferences</span>
            <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Font Size */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Font Size</span>
            <div className="flex items-center gap-1.5 font-mono">
              <button
                onClick={() => onChangeFontSize(Math.max(11, fontSize - 1))}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                -
              </button>
              <span className="w-6 text-center text-slate-200">{fontSize}px</span>
              <button
                onClick={() => onChangeFontSize(Math.min(20, fontSize + 1))}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Tab Size */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Tab Size</span>
            <div className="flex items-center gap-1 font-mono">
              {[2, 4].map((sz) => (
                <button
                  key={sz}
                  onClick={() => onChangeTabSize(sz)}
                  className={`px-2 py-0.5 rounded ${
                    tabSize === sz ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Word Wrap */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Word Wrap</span>
            <button
              onClick={onToggleWordWrap}
              className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                wordWrap ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
              }`}
            >
              {wordWrap ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Minimap */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Minimap</span>
            <button
              onClick={onToggleMinimap}
              className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                minimap ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
              }`}
            >
              {minimap ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Auto Save */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Auto Save</span>
            <button
              onClick={onToggleAutoSave}
              className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                autoSave ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
              }`}
            >
              {autoSave ? 'ACTIVE' : 'OFF'}
            </button>
          </div>
        </div>
      )}

      {/* Shortcuts Quick Reference Drawer */}
      {showShortcuts && (
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 space-y-2 text-[11px] animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between font-semibold text-slate-300">
            <span>Keybindings</span>
            <button onClick={() => setShowShortcuts(false)} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1 font-mono text-[10px] text-slate-400">
            <div className="flex justify-between">
              <span>Run Code</span>
              <span className="text-cyan-400">Ctrl/⌘ + Enter</span>
            </div>
            <div className="flex justify-between">
              <span>Save Code</span>
              <span className="text-cyan-400">Ctrl/⌘ + S</span>
            </div>
            <div className="flex justify-between">
              <span>Find &amp; Replace</span>
              <span className="text-cyan-400">Ctrl/⌘ + F</span>
            </div>
            <div className="flex justify-between">
              <span>Undo / Redo</span>
              <span className="text-cyan-400">⌘Z / ⌘Y</span>
            </div>
          </div>
        </div>
      )}

      {/* Pro Upgrade Card (Section 4) */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80">
        <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900 border border-purple-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3 text-purple-400 fill-purple-400" />
              <span>{isPro ? 'Pro Active' : 'CodeNova Pro'}</span>
            </span>
            <span className="text-[9px] font-mono text-purple-400 bg-purple-950 px-1 py-0.2 rounded">
              {currentUser.plan}
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-snug mb-2.5">
            {isPro
              ? 'Campus verified license active. Unlimited cloud storage and memory tracing.'
              : 'Unlock memory tracing, instant AI code patches, and multi-file project sync.'}
          </p>

          <button
            onClick={onOpenProModal}
            className="w-full py-1.5 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-[11px] shadow transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>{isPro ? 'Manage Subscription' : 'Upgrade to Pro ($8/mo)'}</span>
            <Sparkles className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="h-9 px-3 border-t border-slate-800/80 bg-slate-950 flex items-center justify-between text-slate-400 text-[11px]">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-1 hover:text-slate-200 transition-colors cursor-pointer"
          title="Editor Settings"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>

        <button
          onClick={() => setShowShortcuts(!showShortcuts)}
          className="flex items-center gap-1 hover:text-slate-200 transition-colors cursor-pointer"
          title="Keyboard Shortcuts"
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span>Shortcuts</span>
        </button>
      </div>

    </aside>
  );
};

export default FileExplorer;
