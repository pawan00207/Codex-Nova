import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Globe, 
  Activity, 
  HelpCircle,
  GraduationCap,
  ArrowRight,
  Code2,
  Lock,
  Layers,
  Clock
} from 'lucide-react';
import { UserProfile } from '../types/user';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpgradeSuccess?: (newPlan: 'pro' | 'student_pro') => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpgradeSuccess,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [activeTab, setActiveTab] = useState<'plans' | 'matrix' | 'faq'>('plans');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upgradeComplete, setUpgradeComplete] = useState(false);
  const [studentVerificationCode, setStudentVerificationCode] = useState('');
  const [showStudentVerify, setShowStudentVerify] = useState(false);

  if (!isOpen) return null;

  const isAlreadyPro = currentUser.plan === 'pro' || currentUser.plan === 'campus_license' || currentUser.role === 'superadmin';

  const handleSimulateUpgrade = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setUpgradeComplete(true);
      if (onUpgradeSuccess) {
        onUpgradeSuccess('pro');
      }
    }, 1200);
  };

  const handleVerifyStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentVerificationCode.trim().length >= 3) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setUpgradeComplete(true);
        if (onUpgradeSuccess) {
          onUpgradeSuccess('student_pro');
        }
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">CodeNova Pro</h2>
                <span className="text-[10px] font-mono uppercase bg-purple-950/80 text-purple-300 border border-purple-800/60 px-1.5 py-0.5 rounded font-semibold">
                  Developer Suite
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Unlock high-dimensional AI debugging, limitless cloud project sync, and memory tracing.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1 -mb-px">
            {(['plans', 'matrix', 'faq'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors cursor-pointer capitalize ${
                  activeTab === tab
                    ? 'border-purple-400 text-purple-300 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'plans' ? 'Plans & Pricing' : tab === 'matrix' ? 'Feature Matrix' : 'Frequently Asked Questions'}
              </button>
            ))}
          </div>

          {/* Billing Cycle Toggle */}
          {activeTab === 'plans' && (
            <div className="flex items-center gap-2 py-2">
              <span className="text-xs text-slate-400">Monthly</span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-11 h-6 rounded-full bg-slate-800 border border-slate-700 p-0.5 transition-colors cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-xs text-slate-200 flex items-center gap-1 font-medium">
                <span>Yearly</span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/40 px-1 py-0.2 rounded">
                  Save 33%
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {upgradeComplete ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 mb-4 shadow-xl shadow-emerald-500/20">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Welcome to CodeNova Pro!</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                Your account has been upgraded with unlimited multi-file projects, high-priority AI debugging, and cloud persistence.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Return to Editor
              </button>
            </div>
          ) : activeTab === 'plans' ? (
            <>
              {/* Plans Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Free Plan Card */}
                <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-bold text-white">Starter Free</h3>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                        Forever Free
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-extrabold text-white font-mono">$0</span>
                      <span className="text-xs text-slate-500 font-mono">/ month</span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-6">
                      Everything needed for coding, homework, competitive programming, and instant compilation across 10+ languages.
                    </p>

                    <ul className="space-y-2.5 text-xs text-slate-300">
                      {[
                        'Standard compiler sandboxes for 10+ languages',
                        'In-browser offline WASM execution engine',
                        'Standard input (stdin) & stdout terminal',
                        'Monaco code editor with 4 dark/light themes',
                        'Basic AI Fix and Explain analysis',
                        'Mermaid flowchart visualizer',
                        'Project file download & export',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-800">
                    <button
                      disabled
                      className="w-full py-2.5 rounded-lg bg-slate-800 text-slate-400 text-xs font-semibold text-center cursor-not-allowed"
                    >
                      {currentUser.plan === 'free' ? 'Current Active Plan' : 'Free Included'}
                    </button>
                  </div>
                </div>

                {/* Pro Plan Card */}
                <div className="p-6 rounded-xl bg-gradient-to-b from-purple-950/20 via-slate-900 to-slate-950 border-2 border-purple-500/50 flex flex-col justify-between relative shadow-xl shadow-purple-950/30">
                  <div className="absolute -top-3 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 font-bold text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full shadow">
                    Most Popular
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                        <span>CodeNova Pro</span>
                        <Sparkles className="w-4 h-4 text-purple-400" />
                      </h3>
                      <span className="text-[11px] font-mono text-purple-300 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded">
                        Full Power
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-extrabold text-white font-mono">
                        {billingCycle === 'yearly' ? '$8' : '$12'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        / month {billingCycle === 'yearly' ? '(billed $96 annually)' : ''}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-6">
                      For serious developers, computer science students, and architects requiring deep memory tracing and AI acceleration.
                    </p>

                    <ul className="space-y-2.5 text-xs text-slate-200">
                      {[
                        'Unlimited multi-file projects with cloud storage',
                        'High-priority Gemini AI Fixer with instant 1-click diff patch',
                        'Interactive Step-by-Step Visual Memory & Call Stack Tracer',
                        'Automated unit test case generation & validation',
                        'Big-O complexity formal proofs and optimization guides',
                        'Cross-device project synchronization',
                        'Custom snippet libraries and reusable templates',
                        'Expanded execution runtime timeout limits (up to 30s)',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-800/80">
                    {isAlreadyPro ? (
                      <div className="w-full py-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>Active ({currentUser.plan})</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleSimulateUpgrade}
                        disabled={isProcessing}
                        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-400 hover:to-pink-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Activating Pro Entitlements...</span>
                          </>
                        ) : (
                          <>
                            <span>Upgrade to Pro Now</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Student Free Verification Banner */}
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Student or Campus Developer?</h4>
                    <p className="text-[11px] text-slate-400">
                      College students (DTC, GGSIPU, and accredited universities) get free Pro verification.
                    </p>
                  </div>
                </div>

                {showStudentVerify ? (
                  <form onSubmit={handleVerifyStudent} className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Student ID / Roll No"
                      value={studentVerificationCode}
                      onChange={(e) => setStudentVerificationCode(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shrink-0 cursor-pointer"
                    >
                      Verify
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowStudentVerify(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/40 text-xs font-medium shrink-0 cursor-pointer"
                  >
                    Claim Student Pro ($0)
                  </button>
                )}
              </div>
            </>
          ) : activeTab === 'matrix' ? (
            /* Comprehensive Feature Matrix Table */
            <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-mono">
                    <th className="p-3 font-semibold">Capability</th>
                    <th className="p-3 font-semibold w-28 text-center">Starter Free</th>
                    <th className="p-3 font-semibold w-32 text-center text-purple-300">CodeNova Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {[
                    { cat: '1. Advanced Workspace' },
                    { name: 'Core Languages Supported', free: '10+ Languages', pro: '10+ Languages' },
                    { name: 'Multi-file Project Support', free: 'Single File', pro: 'Unlimited Files' },
                    { name: 'Custom Code Snippets', free: 'Standard', pro: 'Unlimited' },
                    { name: 'Editor Customization', free: '4 Themes', pro: 'All Themes + Fonts' },
                    { cat: '2. AI Coding Assistant' },
                    { name: 'Gemini Code Explainer', free: 'Standard (10/day)', pro: 'Unlimited Real-time' },
                    { name: 'Gemini 1-Click AI Fix', free: 'Standard', pro: 'Unified Diff + Auto-Patch' },
                    { name: 'Code Complexity Big-O Proofs', free: 'Basic O(N)', pro: 'Formal Mathematical Invariant' },
                    { cat: '3. Advanced Debugging' },
                    { name: 'Step-by-Step Memory Tracer', free: 'Basic Flow', pro: 'Call Stack & Heap Inspector' },
                    { name: 'Mermaid Flowchart Generator', free: 'Interactive', pro: 'Export SVG & PNG' },
                    { cat: '4. Cloud & Execution' },
                    { name: 'WASM Offline Mode', free: 'Included', pro: 'Included' },
                    { name: 'Cloud Sandbox Timeout', free: '8 seconds', pro: 'Up to 30 seconds' },
                    { name: 'Cloud Persistence & Sync', free: 'Local storage', pro: 'Cloud DB Sync' },
                  ].map((row, idx) => {
                    if (row.cat) {
                      return (
                        <tr key={idx} className="bg-slate-900/40 text-purple-300 font-mono text-[11px]">
                          <td colSpan={3} className="px-3 py-2 font-bold uppercase tracking-wider">
                            {row.cat}
                          </td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={idx} className="hover:bg-slate-900/30">
                        <td className="p-3 text-slate-300">{row.name}</td>
                        <td className="p-3 text-center text-slate-400 font-mono text-[11px]">{row.free}</td>
                        <td className="p-3 text-center text-purple-300 font-mono font-medium text-[11px] bg-purple-950/10">
                          {row.pro}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Frequently Asked Questions */
            <div className="space-y-4">
              {[
                {
                  q: 'Does CodeNova charge for basic code execution?',
                  a: 'Never. Standard code compilation across all 10+ languages is 100% free forever for all developers, students, and competitive coders.',
                },
                {
                  q: 'How does offline WASM execution work?',
                  a: 'CodeNova bundles WebAssembly and in-browser interpreters (for JavaScript, Python, Bash, etc.) allowing you to compile and test algorithms with 0 internet connection.',
                },
                {
                  q: 'How do college and student licenses work?',
                  a: 'Accredited university students (including DTC College, GGSIPU) get free verified Pro licenses with valid student ID or campus email.',
                },
                {
                  q: 'What is the backend sandbox security architecture?',
                  a: 'CodeNova executes jobs in isolated micro-containers with strict gVisor sandboxing, per-process memory limits (128MB), CPU quotas, and timeout interceptors to prevent fork-bombs and abuse.',
                },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{item.q}</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed pl-5.5">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Enterprise gVisor Isolated Sandbox · SSL 256-bit</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Support: support@codexnova.dev</span>
            <button onClick={onClose} className="hover:text-slate-300 cursor-pointer">
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProUpgradeModal;
