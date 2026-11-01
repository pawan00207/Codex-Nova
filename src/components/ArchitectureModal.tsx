import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  FolderTree, 
  Network, 
  CheckCircle2, 
  Terminal, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ARCHITECTURE_SPEC } from '../config/architecture';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'stack' | 'diagram' | 'schema' | 'security' | 'folder'>('stack');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Phase 1 Architecture, Schema & Production Blueprint</h2>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>CodexNova v1.0.0</span>
                <span aria-hidden="true">·</span>
                <span className="text-cyan-400">{ARCHITECTURE_SPEC.noGptGuarantee}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('stack')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'stack' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Final Tech Stack
          </button>
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'diagram' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Execution Pipeline
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'schema' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            DB Schema (PostgreSQL)
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'security' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sandbox Security & Guards
          </button>
          <button
            onClick={() => setActiveTab('folder')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'folder' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Folder Structure
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'stack' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-semibold text-cyan-400 uppercase font-mono tracking-wider mb-1">
                  Product Vision & Target
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  CodexNova delivers high-speed, zero-cold-start code compilation for students, competitive programmers, and engineers across India and globally. Designed to eradicate the slow cold starts, broken stdin, and ads of legacy compilers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ARCHITECTURE_SPEC.techStack.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-xs font-semibold text-white mb-1 flex items-center justify-between">
                      <span>{item.layer}</span>
                      <span className="text-[10px] text-cyan-400 font-mono">0{idx + 1}</span>
                    </div>
                    <div className="text-xs font-mono text-cyan-300 mb-2">{item.technologies}</div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'diagram' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-semibold text-indigo-400 uppercase font-mono tracking-wider mb-2">
                  Multi-Tier Execution Pipeline
                </div>
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-semibold">
                      Client UI (React 19 + Monaco + Three.js)
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <div className="px-3 py-1.5 rounded bg-indigo-950/80 border border-indigo-800 text-indigo-300 font-semibold">
                      Express Gateway /api/execute
                    </div>
                  </div>

                  <div className="pl-6 border-l-2 border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                      <div className="px-3 py-1.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                        Piston Worker & Warm Container Pool
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                      <div className="px-3 py-1.5 rounded bg-purple-950/80 border border-purple-800 text-purple-300">
                        gVisor Kernel Sandbox (RO rootfs, cgroups v2, no network)
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                      <div className="px-3 py-1.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300">
                        Stream stdout / stderr / exit code / ms back to Client
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    On failure: Client invokes <span className="text-rose-400 font-semibold">/api/ai/fix</span> with error output to compute instant unified diff with Gemini 3.8 Flash.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-semibold text-slate-300 mb-2">Mermaid Source Specification</div>
                <pre className="p-3 rounded-lg bg-slate-900 text-[11px] font-mono text-cyan-300/90 overflow-x-auto">
                  {ARCHITECTURE_SPEC.mermaidDiagram}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-semibold text-cyan-400 uppercase font-mono tracking-wider mb-1">
                  Relational PostgreSQL Schema & DPDP Act 2023 Compliance
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Engineered with strict Row-Level Security (RLS), immutable admin audit logs, Argon2 password hashing, and user data soft-deletion supporting right-to-erasure.
                </p>
              </div>

              {/* ER Model Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-mono text-cyan-300 font-semibold mb-1">users</div>
                  <div className="text-[11px] text-slate-400 space-y-0.5 font-mono">
                    <div>id: UUID (PK)</div>
                    <div>email: VARCHAR(255) (UNIQUE)</div>
                    <div>password_hash: VARCHAR</div>
                    <div>role: user_role</div>
                    <div>plan: user_plan</div>
                    <div>country: VARCHAR(3)</div>
                    <div>total_runs: INT</div>
                    <div>last_active_at: TIMESTAMP</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-mono text-indigo-300 font-semibold mb-1">code_runs</div>
                  <div className="text-[11px] text-slate-400 space-y-0.5 font-mono">
                    <div>id: UUID (PK)</div>
                    <div>user_id: UUID (FK)</div>
                    <div>language: VARCHAR(50)</div>
                    <div>status: run_status</div>
                    <div>execution_time_ms: INT</div>
                    <div>memory_kb: INT</div>
                    <div>container_engine: VARCHAR</div>
                    <div>created_at: TIMESTAMP</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-mono text-purple-300 font-semibold mb-1">admin_audit_logs</div>
                  <div className="text-[11px] text-slate-400 space-y-0.5 font-mono">
                    <div>id: UUID (PK)</div>
                    <div>admin_id: UUID (FK)</div>
                    <div>target_user_id: UUID</div>
                    <div>action: VARCHAR(100)</div>
                    <div>details: JSONB</div>
                    <div>ip_address: INET</div>
                    <div>created_at: TIMESTAMP</div>
                  </div>
                </div>
              </div>

              {/* DDL Schema Code Preview */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-semibold text-slate-300 mb-2">Production DDL (src/config/schema.sql)</div>
                <pre className="p-3 rounded-lg bg-slate-900 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-60 leading-relaxed">
{`CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(150) NOT NULL,
    role user_role DEFAULT 'user' NOT NULL,
    plan user_plan DEFAULT 'free' NOT NULL,
    country VARCHAR(3) DEFAULT 'IND',
    total_runs INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE code_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    language VARCHAR(50) NOT NULL,
    status run_status NOT NULL,
    execution_time_ms INTEGER NOT NULL,
    memory_kb INTEGER NOT NULL,
    container_engine VARCHAR(30) DEFAULT 'gVisor-runsc'
);`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-semibold text-emerald-400 uppercase font-mono tracking-wider mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sandbox Hardening & Attack Mitigations</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Public code execution carries critical security risks. The table below details how our architecture prevents container escape, denial-of-service, and malicious activity.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ARCHITECTURE_SPEC.securityGuards.map((guard, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-xs font-semibold text-rose-300 mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>{guard.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{guard.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'folder' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400">
                Production-grade modular codebase layout following clean separation of concerns:
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                {ARCHITECTURE_SPEC.folderStructure}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center text-xs text-slate-500 font-mono">
          <span>Phase 1 Architecture Accepted</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureModal;
