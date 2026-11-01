import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Activity, 
  Terminal, 
  Cpu, 
  Search, 
  Filter, 
  Download, 
  Ban, 
  CheckCircle, 
  Trash2, 
  RefreshCw, 
  TrendingUp, 
  Globe2, 
  ArrowUpRight,
  Eye,
  AlertTriangle,
  X
} from 'lucide-react';
import { UserProfile, RealtimeAdminStats, ActivityEvent } from '../types/user';
import { INITIAL_REGISTERED_USERS, INITIAL_LIVE_EVENTS, getRealtimeStats } from '../services/userService';

interface AdminDashboardProps {
  onBackToIDE: () => void;
  currentUser: UserProfile;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToIDE, currentUser }) => {
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_REGISTERED_USERS);
  const [events, setEvents] = useState<ActivityEvent[]>(INITIAL_LIVE_EVENTS);
  const [stats, setStats] = useState<RealtimeAdminStats>(getRealtimeStats(INITIAL_REGISTERED_USERS));
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Realtime Simulation (Periodically triggers live telemetry)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live activity event
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

  // Action Handlers
  const handleToggleBan = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'banned' ? 'active' : 'banned';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleResetPlan = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, plan: 'free' } : u))
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user in compliance with DPDP right to erasure?')) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      if (selectedUser?.id === userId) setSelectedUser(null);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ID', 'Full Name', 'Email', 'Role', 'Plan', 'Country', 'Total Runs', 'Status', 'Signup Date'];
    const rows = filteredUsers.map((u) => [
      u.id,
      `"${u.fullName}"`,
      u.email,
      u.role,
      u.plan,
      u.country,
      u.totalRuns,
      u.status,
      u.signupDate,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `codexnova_users_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Admin Header */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToIDE}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-mono cursor-pointer"
          >
            <span>← Back to IDE</span>
          </button>
          <span className="w-px h-4 bg-slate-800" />
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
              Real-Time Security & User Management Console
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Admin: <strong className="text-white">{currentUser.fullName}</strong></span>
          </span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span className="text-emerald-400 font-mono text-[11px] bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
            DPDP 2023 Compliant
          </span>
        </div>
      </div>

      {/* Main Admin Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6 overflow-y-auto">
        {/* Real-Time Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Live Online Developers</span>
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {stats.onlineUsersCount}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Real-time SSE active sockets</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Total Registered Users</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {stats.totalRegisteredUsers.toLocaleString()}
            </div>
            <div className="text-[11px] text-cyan-400 mt-1">
              +24.8% weekly signups across DTC & campuses
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Code Executions Today</span>
              <Terminal className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {stats.totalCodeRunsToday.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              Avg latency: 68ms (Direct VM)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Active gVisor Pods</span>
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {stats.activeContainers}
            </div>
            <div className="text-[11px] text-purple-300 mt-1 font-mono">
              Zero network egress · RO rootfs
            </div>
          </div>
        </div>

        {/* Live Activity Feed & Language Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Live Activity Feed */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase font-mono tracking-wider">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Real-Time User & Container Activity Feed</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">POLLING INTERVAL: 6S</span>
              </div>

              <div className="space-y-2">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-medium text-slate-200">{evt.description}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>{evt.userEmail}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{evt.country}</span>
                        {evt.language && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-cyan-400 font-mono">{evt.language}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">{evt.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Languages & Geographic Reach */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div>
              <div className="text-xs font-semibold text-white uppercase font-mono tracking-wider mb-2">
                Execution Language Breakdown
              </div>
              <div className="space-y-2 text-xs">
                {stats.topLanguages.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>{item.language}</span>
                      <span className="font-mono text-cyan-400">{item.percent}% ({item.count.toLocaleString()})</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <div className="text-xs font-semibold text-white uppercase font-mono tracking-wider mb-2">
                Primary Developer Regions
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {stats.countryBreakdown.map((c, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-slate-300">{c.country}</span>
                    <span className="font-mono text-cyan-300 font-semibold">{c.users}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Registered Users Table Management */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-white font-['Space_Grotesk']">
                Registered Developer Directory
              </h3>
              <p className="text-xs text-slate-400">
                Audited user records, plans, and authorization states
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, email, country..."
                  className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60 w-56"
                />
              </div>

              {/* Plan Filter */}
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">All Plans</option>
                <option value="free">Free</option>
                <option value="student_pro">Student Pro</option>
                <option value="pro">Pro</option>
                <option value="campus_license">Campus License</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="banned">Banned</option>
              </select>

              {/* Export CSV Button */}
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                title="Export filtered users to CSV"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">User & Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Country</th>
                  <th className="p-3">Auth / Device</th>
                  <th className="p-3">Runs</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-sans">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-500">
                      No matching registered users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-850/60 transition-colors">
                      <td className="p-3">
                        <div className="font-medium text-slate-100">{u.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          u.role === 'superadmin' 
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : u.role === 'moderator'
                            ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-[11px] text-cyan-300 font-medium capitalize">
                          {u.plan.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-300">
                        {u.country}
                      </td>
                      <td className="p-3">
                        <div className="text-[11px] text-slate-300 capitalize">{u.authProvider}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{u.deviceBrowser}</div>
                      </td>
                      <td className="p-3 font-mono font-medium text-slate-200">
                        {u.totalRuns}
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          u.status === 'active'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                            : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          <span className="capitalize">{u.status}</span>
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {u.role !== 'superadmin' && (
                            <>
                              <button
                                onClick={() => handleToggleBan(u.id)}
                                className={`p-1.5 rounded transition-colors cursor-pointer ${
                                  u.status === 'banned'
                                    ? 'text-emerald-400 hover:bg-emerald-950/50'
                                    : 'text-rose-400 hover:bg-rose-950/50'
                                }`}
                                title={u.status === 'banned' ? 'Unban User' : 'Ban User'}
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleResetPlan(u.id)}
                                className="p-1.5 rounded text-amber-400 hover:bg-amber-950/50 transition-colors cursor-pointer"
                                title="Reset plan to Free"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Delete User (Right to Erasure)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
