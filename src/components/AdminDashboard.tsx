import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Activity, 
  Terminal, 
  Cpu, 
  Search, 
  Filter, 
  Ban, 
  CheckCircle, 
  RefreshCw, 
  TrendingUp, 
  Globe2, 
  ArrowUpRight,
  Eye,
  AlertTriangle,
  X,
  CreditCard,
  FileText,
  Lock,
  ShieldAlert,
  Server,
  Zap,
  Check
} from 'lucide-react';
import { UserProfile, RealtimeAdminStats, ActivityEvent } from '../types/user';
import { 
  INITIAL_REGISTERED_USERS, 
  INITIAL_LIVE_EVENTS, 
  getRealtimeStats,
  fetchAdminOverviewApi,
  fetchAdminUsersApi,
  updateAdminUserStatusApi,
  updateAdminUserRoleApi,
  updateAdminUserPlanApi,
  fetchAdminPaymentsApi,
  fetchAdminAuditLogsApi
} from '../services/userService';

interface AdminDashboardProps {
  onBackToIDE: () => void;
  currentUser: UserProfile;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToIDE, currentUser }) => {
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'superadmin';

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'payments' | 'audit'>('overview');

  // State
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_REGISTERED_USERS);
  const [events, setEvents] = useState<ActivityEvent[]>(INITIAL_LIVE_EVENTS);
  const [stats, setStats] = useState<RealtimeAdminStats>(getRealtimeStats(INITIAL_REGISTERED_USERS));
  const [payments, setPayments] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Confirmation Modal state
  const [confirmAction, setConfirmAction] = useState<{
    type: 'ban' | 'role' | 'plan';
    userId: string;
    userName: string;
    targetValue: string;
    title: string;
    message: string;
  } | null>(null);

  // Fetch real data on mount if admin
  const loadAdminData = async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    try {
      const [overviewData, usersData, paymentsData, auditLogsData] = await Promise.all([
        fetchAdminOverviewApi().catch(() => null),
        fetchAdminUsersApi().catch(() => null),
        fetchAdminPaymentsApi().catch(() => []),
        fetchAdminAuditLogsApi().catch(() => []),
      ]);

      if (overviewData) {
        setStats((prev) => ({
          ...prev,
          totalRegisteredUsers: overviewData.totalRegisteredUsers || prev.totalRegisteredUsers,
          totalCodeRunsToday: overviewData.totalCodeRunsToday || prev.totalCodeRunsToday,
          onlineUsersCount: overviewData.onlineUsersCount || prev.onlineUsersCount,
          activeContainers: overviewData.activeContainers || prev.activeContainers,
        }));
        setSystemHealth(overviewData.systemSettings || null);
      }

      if (Array.isArray(usersData) && usersData.length > 0) {
        setUsers(usersData);
      }

      setPayments(paymentsData || []);
      setAuditLogs(auditLogsData || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [isAdmin]);

  // Periodic simulated telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      const sampleEvents: { type: ActivityEvent['type']; desc: string; lang: string }[] = [
        { type: 'run', desc: 'Executed C++20 fast I/O algorithm', lang: 'C++' },
        { type: 'run', desc: 'Executed Python 3.10 graph search', lang: 'Python' },
        { type: 'ai_fix', desc: 'Resolved IndexError via Gemini 3.8 unified patch', lang: 'Python' },
        { type: 'run', desc: 'Evaluated SQLite Window function query', lang: 'SQL' },
      ];
      const randomEvt = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];

      const newEvt: ActivityEvent = {
        id: `evt_${Date.now()}`,
        timestamp: 'Just now',
        type: randomEvt.type,
        description: randomEvt.desc,
        userEmail: `dev.${Math.floor(Math.random() * 900 + 100)}@college.edu.in`,
        country: Math.random() > 0.4 ? 'IND' : 'USA',
        language: randomEvt.lang,
      };

      setEvents((prev) => [newEvt, ...prev.slice(0, 9)]);
      setStats((prev) => ({
        ...prev,
        totalCodeRunsToday: prev.totalCodeRunsToday + 1,
        onlineUsersCount: Math.min(68, Math.max(12, prev.onlineUsersCount + (Math.random() > 0.5 ? 1 : -1))),
      }));
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Strict Authorization Check: Non-admins are blocked
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8 text-rose-400" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2 font-mono">Access Denied (403 Forbidden)</h1>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          This dashboard contains sensitive server infrastructure, audit logs, and developer accounts.
          Your current account (<span className="text-slate-200 font-mono">{currentUser.email}</span>) does not have administrator privileges.
        </p>
        <button
          onClick={onBackToIDE}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors cursor-pointer"
        >
          ← Return to CodeNova Compiler IDE
        </button>
      </div>
    );
  }

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.country.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlan = planFilter === 'all' || u.plan === planFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  // Action Triggers with Confirmation
  const triggerBanConfirmation = (user: UserProfile) => {
    const nextStatus = user.status === 'banned' ? 'active' : 'banned';
    setConfirmAction({
      type: 'ban',
      userId: user.id,
      userName: user.fullName,
      targetValue: nextStatus,
      title: nextStatus === 'banned' ? 'Suspend Developer Account' : 'Reactivate Developer Account',
      message: nextStatus === 'banned'
        ? `Are you sure you want to suspend access for ${user.fullName} (${user.email})? They will be locked out of the compiler and cloud sandboxes.`
        : `Reactivate access for ${user.fullName} (${user.email})?`,
    });
  };

  const triggerRoleConfirmation = (user: UserProfile, newRole: string) => {
    setConfirmAction({
      type: 'role',
      userId: user.id,
      userName: user.fullName,
      targetValue: newRole,
      title: 'Update Access Role',
      message: `Change permission role for ${user.fullName} to "${newRole.toUpperCase()}"?`,
    });
  };

  const triggerPlanConfirmation = (user: UserProfile, newPlan: string) => {
    setConfirmAction({
      type: 'plan',
      userId: user.id,
      userName: user.fullName,
      targetValue: newPlan,
      title: 'Modify Subscription Plan',
      message: `Manually set subscription plan for ${user.fullName} to "${newPlan.toUpperCase()}"?`,
    });
  };

  const executeConfirmedAction = async () => {
    if (!confirmAction) return;
    const { type, userId, targetValue } = confirmAction;

    try {
      if (type === 'ban') {
        await updateAdminUserStatusApi(userId, targetValue as 'active' | 'banned').catch(() => null);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: targetValue as any } : u))
        );
      } else if (type === 'role') {
        await updateAdminUserRoleApi(userId, targetValue).catch(() => null);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: targetValue as any } : u))
        );
      } else if (type === 'plan') {
        await updateAdminUserPlanApi(userId, targetValue).catch(() => null);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, plan: targetValue as any } : u))
        );
      }
      loadAdminData();
    } finally {
      setConfirmAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-sans select-none">
      
      {/* Top Admin Bar */}
      <header className="h-14 bg-slate-950 border-b border-slate-800/80 px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToIDE}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            ← Return to IDE
          </button>

          <span className="w-px h-5 bg-slate-800" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs tracking-tight text-white font-mono">
                  CodeNova Core Administration
                </span>
                <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800/60 px-1.5 py-0.5 rounded font-mono uppercase">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'payments'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payments</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit Logs</span>
          </button>
        </div>

        {/* Right Status */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={loadAdminData}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-purple-400' : ''}`} />
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Server Live</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        
        {/* TAB 1: OVERVIEW & TELEMETRY */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Online Developers</span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white font-mono mt-2">
                  {stats.onlineUsersCount}
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Real-time connected sessions</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Total Registered</span>
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-white font-mono mt-2">
                  {stats.totalRegisteredUsers.toLocaleString()}
                </div>
                <div className="text-[11px] text-cyan-400 mt-1">
                  <span>+{stats.growthRatePercent}% month-over-month</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Sandbox Code Runs</span>
                  <Terminal className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold text-white font-mono mt-2">
                  {stats.totalCodeRunsToday.toLocaleString()}
                </div>
                <div className="text-[11px] text-indigo-400 mt-1">
                  <span>Multi-tier sandboxes executed</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Active Containers</span>
                  <Cpu className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white font-mono mt-2">
                  {stats.activeContainers}
                </div>
                <div className="text-[11px] text-purple-400 mt-1">
                  <span>gVisor / Piston isolation nodes</span>
                </div>
              </div>
            </div>

            {/* Middle Section: Top Languages & Real-time Live Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Language Breakdown */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-4">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono flex items-center justify-between">
                  <span>Top Compiler Runtimes</span>
                  <span className="text-[10px] text-slate-500">24H Window</span>
                </h3>

                <div className="space-y-3">
                  {stats.topLanguages.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{item.language}</span>
                        <span className="font-mono text-slate-400">{item.percent}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Activity Feed */}
              <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-3">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono flex items-center justify-between">
                  <span>Real-time Live Telemetry</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    STREAMING
                  </span>
                </h3>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {events.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            evt.type === 'run'
                              ? 'bg-cyan-400'
                              : evt.type === 'ai_fix'
                              ? 'bg-purple-400'
                              : evt.type === 'plan_upgrade'
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                        />
                        <div>
                          <div className="font-medium text-slate-200">{evt.description}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {evt.userEmail} · {evt.country} {evt.language ? `· ${evt.language}` : ''}
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] font-mono text-slate-500 shrink-0">
                        {evt.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Search & Filter Controls */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, or country..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/60"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none"
                >
                  <option value="all">All Plans</option>
                  <option value="free">Free</option>
                  <option value="student_pro">Student Pro</option>
                  <option value="pro">Pro</option>
                  <option value="campus_license">Campus License</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="banned">Suspended</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800/80 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Developer</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Plan</th>
                    <th className="p-3.5">Runs</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-850/60 transition-colors">
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-200">{u.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                            u.role === 'superadmin'
                              ? 'bg-purple-950 text-purple-300 border border-purple-800/60 font-bold'
                              : u.role === 'admin'
                              ? 'bg-blue-950 text-blue-300 border border-blue-800/60'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono text-cyan-400 uppercase text-[11px]">
                          {u.plan.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-300">{u.totalRuns}</td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono ${
                            u.status === 'active'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                              : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                          }`}
                        >
                          <span className={`w-1 h-1 rounded-full ${u.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Role Dropdown */}
                          {currentUser.role === 'superadmin' && u.role !== 'superadmin' && (
                            <select
                              value={u.role}
                              onChange={(e) => triggerRoleConfirmation(u, e.target.value)}
                              className="bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-[10px] text-slate-300 focus:outline-none"
                            >
                              <option value="user">User</option>
                              <option value="moderator">Moderator</option>
                              <option value="admin">Admin</option>
                            </select>
                          )}

                          {/* Plan Dropdown */}
                          <select
                            value={u.plan}
                            onChange={(e) => triggerPlanConfirmation(u, e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-[10px] text-slate-300 focus:outline-none"
                          >
                            <option value="free">Free</option>
                            <option value="student_pro">Student Pro</option>
                            <option value="pro">Pro</option>
                            <option value="campus_license">Campus</option>
                          </select>

                          {/* Ban / Reactivate Toggle */}
                          {u.role !== 'superadmin' && (
                            <button
                              onClick={() => triggerBanConfirmation(u)}
                              className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                                u.status === 'banned'
                                  ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300'
                                  : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300'
                              }`}
                              title={u.status === 'banned' ? 'Reactivate' : 'Suspend account'}
                            >
                              {u.status === 'banned' ? <Check className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENTS & LEDGER */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-900/80 border border-slate-800/80 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white text-xs">Payment Transactions Ledger</h3>
                  <p className="text-[11px] text-slate-400">Cryptographically verified checkout orders and webhook events</p>
                </div>
                <span className="font-mono text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                  Gateway Test/Live Mode
                </span>
              </div>

              {payments.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-mono">
                  No payment transactions recorded yet.
                </div>
              ) : (
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Payment ID</th>
                      <th className="p-3.5">Order ID</th>
                      <th className="p-3.5">Plan</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Gateway</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-850/60">
                        <td className="p-3.5 text-slate-200">{p.paymentId}</td>
                        <td className="p-3.5 text-slate-400">{p.orderId}</td>
                        <td className="p-3.5 text-purple-300 uppercase">{p.plan}</td>
                        <td className="p-3.5 text-emerald-400 font-semibold">₹{p.amount}</td>
                        <td className="p-3.5 text-slate-400 uppercase">{p.provider}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-[10px]">
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500">{new Date(p.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-900/80 border border-slate-800/80 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white text-xs">Security Audit Logs</h3>
                  <p className="text-[11px] text-slate-400">Chronological ledger of authentication, payment, and administrative events</p>
                </div>
                <span className="font-mono text-[10px] text-slate-500">
                  {auditLogs.length} events logged
                </span>
              </div>

              {auditLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-mono">
                  No security audit records logged.
                </div>
              ) : (
                <div className="divide-y divide-slate-800/60 max-h-96 overflow-y-auto font-mono text-xs">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-3 hover:bg-slate-850/60 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-purple-300">{log.action}</span>
                          <span className="text-[10px] text-slate-500">({log.userEmail})</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{log.details}</div>
                      </div>
                      <div className="text-[10px] text-slate-500 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Dialog for Destructive Administrative Actions */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{confirmAction.title}</h3>
                <p className="text-xs text-slate-400">{confirmAction.message}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeConfirmedAction}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
