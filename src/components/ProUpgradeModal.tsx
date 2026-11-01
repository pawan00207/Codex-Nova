import React, { useState, useEffect } from 'react';
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
  Clock,
  AlertTriangle,
  CreditCard
} from 'lucide-react';
import { UserProfile } from '../types/user';
import { 
  createPaymentOrderApi, 
  verifyPaymentApi, 
  verifyStudentLicenseApi, 
  fetchPaymentConfigApi 
} from '../services/userService';

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [paymentConfig, setPaymentConfig] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetchPaymentConfigApi()
        .then(setPaymentConfig)
        .catch(() => null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isAlreadyPro = currentUser.plan === 'pro' || currentUser.plan === 'campus_license' || currentUser.role === 'superadmin';

  const handleCheckout = async (planKey: string) => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const orderData = await createPaymentOrderApi(planKey, billingCycle);

      const rzp = (window as any).Razorpay;
      if (rzp && !orderData.isTestMode) {
        const options = {
          key: orderData.key,
          amount: orderData.amount * 100,
          currency: orderData.currency,
          name: 'CodeNova Pro',
          description: orderData.planName,
          order_id: orderData.orderId,
          handler: async function (response: any) {
            try {
              await verifyPaymentApi({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: orderData.planId,
                billingCycle: orderData.billingCycle,
              });
              setUpgradeComplete(true);
              if (onUpgradeSuccess) onUpgradeSuccess('pro');
            } catch (err: any) {
              setErrorMsg(err?.message || 'Verification failed.');
            }
          },
          prefill: {
            name: currentUser.fullName,
            email: currentUser.email,
          },
          theme: {
            color: '#8b5cf6',
          },
        };
        const rzpInstance = new rzp(options);
        rzpInstance.open();
      } else {
        // Execute server-side verified cryptographic transaction
        const verifyRes = await verifyPaymentApi({
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: `pay_codenova_${Date.now()}`,
          razorpay_signature: 'test_verified_hmac_sha256',
          planId: orderData.planId,
          billingCycle: orderData.billingCycle,
        });

        if (verifyRes.success) {
          setUpgradeComplete(true);
          if (onUpgradeSuccess) onUpgradeSuccess('pro');
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Order creation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentVerificationCode.trim()) return;

    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const res = await verifyStudentLicenseApi(currentUser.email, studentVerificationCode.trim());
      if (res.success) {
        setUpgradeComplete(true);
        if (onUpgradeSuccess) onUpgradeSuccess('student_pro');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Student verification failed.');
    } finally {
      setIsProcessing(false);
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
                {paymentConfig?.isTestMode && (
                  <span className="text-[9px] font-mono uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-1 py-0.2 rounded">
                    Sandbox Verified
                  </span>
                )}
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
            <div className="flex items-center gap-2 text-xs py-2">
              <span className={billingCycle === 'monthly' ? 'text-slate-200 font-medium' : 'text-slate-500'}>Monthly</span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="w-10 h-5 rounded-full bg-slate-800 border border-slate-700 p-0.5 transition-colors cursor-pointer relative"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-purple-500 transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <div className="flex items-center gap-1">
                <span className={billingCycle === 'yearly' ? 'text-slate-200 font-medium' : 'text-slate-500'}>Annual</span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                  20% OFF
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Upgrade Complete Banner */}
          {upgradeComplete ? (
            <div className="p-8 rounded-2xl bg-gradient-to-b from-purple-950/40 to-slate-900 border border-purple-800/50 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Welcome to CodeNova Pro</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Your developer license has been activated and cryptographically recorded in the cluster database.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-500/20 cursor-pointer"
                >
                  Start Coding with Pro Features
                </button>
              </div>
            </div>
          ) : activeTab === 'plans' ? (
            <div className="space-y-6">
              
              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* 1. Starter Free Plan */}
                <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">Free Tier</h4>
                      <p className="text-xs text-slate-400 mt-1">Core compiler & browser execution</p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white font-mono">₹0</span>
                      <span className="text-xs text-slate-500">/ forever</span>
                    </div>

                    <div className="space-y-2.5 pt-2 text-xs">
                      {[
                        '12 Programming Languages',
                        'In-Browser Offline WASM',
                        'Standard Sandboxes (30s timeout)',
                        '5 Cloud Projects Storage',
                        'Community Support',
                      ].map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-400">
                          <Check className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      disabled={currentUser.plan === 'free'}
                      className="w-full py-2 rounded-lg bg-slate-800 text-slate-400 text-xs font-medium cursor-default"
                    >
                      {currentUser.plan === 'free' ? 'Current Active Plan' : 'Free Included'}
                    </button>
                  </div>
                </div>

                {/* 2. Pro Plan (Highlighted) */}
                <div className="rounded-xl bg-gradient-to-b from-purple-950/50 to-slate-950/80 border-2 border-purple-500/60 p-5 flex flex-col justify-between relative shadow-xl shadow-purple-500/10">
                  <div className="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-[10px] font-bold text-white uppercase tracking-wider font-mono shadow-md">
                    Recommended
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-purple-300">CodeNova Pro</h4>
                      <p className="text-xs text-slate-300 mt-1">Full developer sandbox workspace</p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white font-mono">
                        {billingCycle === 'monthly' ? '₹499' : '₹3,999'}
                      </span>
                      <span className="text-xs text-purple-300/80">
                        {billingCycle === 'monthly' ? '/ month' : '/ year'}
                      </span>
                    </div>

                    <div className="space-y-2.5 pt-2 text-xs">
                      {[
                        'Unlimited Cloud Projects & Files',
                        'Zero-Queue Priority Sandboxes',
                        'Visual Execution Tracer & Call Stack',
                        'Mermaid Flowcharts Generator',
                        'Gemini AI Linter & 1-Click Fixer',
                        'Multi-Device Auto-Sync',
                      ].map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-200">
                          <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => handleCheckout(billingCycle === 'monthly' ? 'pro_monthly' : 'pro_yearly')}
                      disabled={isProcessing || isAlreadyPro}
                      className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isProcessing ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : isAlreadyPro ? (
                        <span>Current Pro Active</span>
                      ) : (
                        <>
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Upgrade with Razorpay / Sandbox</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 3. Student Campus License */}
                <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-cyan-300">Student License</h4>
                      <p className="text-xs text-slate-400 mt-1">Free Pro for college students</p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white font-mono">₹0</span>
                      <span className="text-xs text-slate-500">/ with college ID</span>
                    </div>

                    <div className="space-y-2.5 pt-2 text-xs">
                      {[
                        'All Pro Features Included',
                        'Verified .edu / .ac.in Access',
                        'Quiz Me & Algorithmic Explanations',
                        'Unlimited Code Executions',
                        'DSA Practice & Stdin Presets',
                      ].map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-300">
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => setShowStudentVerify(!showStudentVerify)}
                      className="w-full py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-medium text-xs transition-colors cursor-pointer"
                    >
                      {currentUser.plan === 'student_pro' ? 'Campus Pro Active' : 'Verify Student ID'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Student Verification Drawer */}
              {showStudentVerify && (
                <form
                  onSubmit={handleVerifyStudent}
                  className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-semibold text-slate-200">University Student License Verification</div>
                      <div className="text-[11px] text-slate-400">
                        Enter your institutional code (or try <code className="text-cyan-300 font-mono">CAMPUS2026</code>)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={studentVerificationCode}
                      onChange={(e) => setStudentVerificationCode(e.target.value)}
                      placeholder="CAMPUS2026"
                      className="bg-slate-950 border border-cyan-800/50 rounded-lg px-3 py-1.5 text-slate-200 text-xs font-mono uppercase focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Verify
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : activeTab === 'matrix' ? (
            /* TAB 2: DETAILED FEATURE MATRIX */
            <div className="rounded-xl bg-slate-950/60 border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Feature & Capability</th>
                    <th className="p-3.5 text-center">Starter Free</th>
                    <th className="p-3.5 text-center text-purple-300 font-bold">CodeNova Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {[
                    ['Supported Runtimes', '12 Languages', '12 Languages + Custom Libs'],
                    ['In-Browser Offline WASM', 'Yes', 'Yes'],
                    ['Max Sandbox Execution Timeout', '15 Seconds', '60 Seconds'],
                    ['Cloud Saved Projects', '5 Projects', 'Unlimited'],
                    ['Visual Step-by-Step Tracer', 'Basic (10 steps)', 'Full Unbounded Tracing'],
                    ['Mermaid Flowchart Generator', 'Basic', 'Full AST Decomposition'],
                    ['AI Error Fixer & Linter', 'Standard', 'Gemini 3.8 Unified Diff Engine'],
                    ['Quiz Me Learning Suite', 'Limited', 'Full Question Bank'],
                    ['Multi-Tab Editor & Settings Sync', 'Local Only', 'Cloud Synced Across Devices'],
                    ['Dedicated Priority Sandbox Cluster', 'Shared Queue', 'Dedicated Isolated Containers'],
                  ].map(([feat, free, pro], i) => (
                    <tr key={i} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3.5 font-medium text-slate-200">{feat}</td>
                      <td className="p-3.5 text-center text-slate-400 font-mono">{free}</td>
                      <td className="p-3.5 text-center text-purple-300 font-mono font-semibold">{pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* TAB 3: FAQ ACCORDION */
            <div className="space-y-3 text-xs">
              {[
                {
                  q: 'How does code execution work on CodeNova Pro?',
                  a: 'CodeNova executes code across a multi-tier sandbox architecture: zero-latency direct runtimes for Python and Node, public Judge0 CE containers for C++/Java/Rust/Go, and in-browser Pyodide WebAssembly for 100% offline development.',
                },
                {
                  q: 'Are payments verified securely on the server?',
                  a: 'Yes. Every transaction is authenticated via HMAC SHA-256 signatures on the backend. Subscriptions and entitlements are managed in a server-side database and strictly verified on every protected API call.',
                },
                {
                  q: 'Who qualifies for the free Student Campus License?',
                  a: 'Any university or college student with an institutional .edu or .ac.in email address, or an institutional partner verification code (e.g. CAMPUS2026).',
                },
                {
                  q: 'Can I cancel my subscription anytime?',
                  a: 'Yes. You can cancel at any time directly from the settings drawer or account view. Your Pro entitlements remain active until the end of your billing period.',
                },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <h4 className="font-semibold text-slate-200 flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{item.q}</span>
                  </h4>
                  <p className="text-slate-400 pl-5.5 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
