import { UserProfile, RealtimeAdminStats, ActivityEvent } from '../types/user';

// Founder and default Admin account
export const FOUNDER_ADMIN: UserProfile = {
  id: 'usr_pawan_001',
  email: 'pawan9140582015@gmail.com',
  fullName: 'Pawan Singh',
  role: 'superadmin',
  plan: 'campus_license',
  authProvider: 'google',
  country: 'IND',
  totalRuns: 1420,
  languagesUsed: ['Python', 'C++', 'TypeScript', 'Rust', 'Go'],
  status: 'active',
  deviceBrowser: 'Chrome 131 · Linux x86_64',
  signupDate: '2026-01-10T08:30:00Z',
  lastActive: 'Just now',
};

// Initial realistic database of registered developers (India + Global)
export const INITIAL_REGISTERED_USERS: UserProfile[] = [
  FOUNDER_ADMIN,
  {
    id: 'usr_ind_002',
    email: 'priya.sharma@dtc.edu.in',
    fullName: 'Priya Sharma',
    role: 'user',
    plan: 'student_pro',
    authProvider: 'google',
    country: 'IND',
    totalRuns: 428,
    languagesUsed: ['Python', 'Java', 'SQL'],
    status: 'active',
    deviceBrowser: 'Edge 130 · Windows 11',
    signupDate: '2026-02-14T11:20:00Z',
    lastActive: '3 mins ago',
  },
  {
    id: 'usr_ind_003',
    email: 'arjun.verma99@gmail.com',
    fullName: 'Arjun Verma',
    role: 'user',
    plan: 'free',
    authProvider: 'github',
    country: 'IND',
    totalRuns: 189,
    languagesUsed: ['C++', 'Rust'],
    status: 'active',
    deviceBrowser: 'Firefox 133 · Ubuntu Linux',
    signupDate: '2026-02-28T14:15:00Z',
    lastActive: '12 mins ago',
  },
  {
    id: 'usr_us_004',
    email: 'sarah.miller@stanford.edu',
    fullName: 'Sarah Miller',
    role: 'user',
    plan: 'pro',
    authProvider: 'email',
    country: 'USA',
    totalRuns: 672,
    languagesUsed: ['TypeScript', 'Python', 'Go'],
    status: 'active',
    deviceBrowser: 'Safari 18 · macOS Sonoma',
    signupDate: '2026-03-01T09:40:00Z',
    lastActive: '25 mins ago',
  },
  {
    id: 'usr_ind_005',
    email: 'rohan.nair.dev@outlook.com',
    fullName: 'Rohan Nair',
    role: 'moderator',
    plan: 'student_pro',
    authProvider: 'github',
    country: 'IND',
    totalRuns: 512,
    languagesUsed: ['Python', 'Bash', 'JavaScript'],
    status: 'active',
    deviceBrowser: 'Chrome 131 · Android 15',
    signupDate: '2026-03-05T16:00:00Z',
    lastActive: '45 mins ago',
  },
  {
    id: 'usr_de_006',
    email: 'lukas.becker@tum.de',
    fullName: 'Lukas Becker',
    role: 'user',
    plan: 'pro',
    authProvider: 'github',
    country: 'DEU',
    totalRuns: 310,
    languagesUsed: ['Rust', 'C++', 'Bash'],
    status: 'active',
    deviceBrowser: 'Chrome 131 · Linux x86_64',
    signupDate: '2026-03-12T10:15:00Z',
    lastActive: '2 hours ago',
  },
  {
    id: 'usr_ind_007',
    email: 'ananya.iyer.code@gmail.com',
    fullName: 'Ananya Iyer',
    role: 'user',
    plan: 'free',
    authProvider: 'google',
    country: 'IND',
    totalRuns: 94,
    languagesUsed: ['Python', 'SQL'],
    status: 'active',
    deviceBrowser: 'Chrome 131 · Windows 11',
    signupDate: '2026-03-20T18:40:00Z',
    lastActive: '3 hours ago',
  },
  {
    id: 'usr_sg_008',
    email: 'chen.wei@nus.edu.sg',
    fullName: 'Chen Wei',
    role: 'user',
    plan: 'free',
    authProvider: 'email',
    country: 'SGP',
    totalRuns: 145,
    languagesUsed: ['Go', 'TypeScript'],
    status: 'active',
    deviceBrowser: 'Firefox 132 · macOS',
    signupDate: '2026-04-01T04:20:00Z',
    lastActive: '5 hours ago',
  },
  {
    id: 'usr_uk_009',
    email: 'david.smith@ox.ac.uk',
    fullName: 'David Smith',
    role: 'user',
    plan: 'pro',
    authProvider: 'google',
    country: 'GBR',
    totalRuns: 388,
    languagesUsed: ['C', 'C++', 'Python'],
    status: 'active',
    deviceBrowser: 'Safari 18 · iOS 18',
    signupDate: '2026-04-10T12:00:00Z',
    lastActive: '1 day ago',
  },
  {
    id: 'usr_bot_010',
    email: 'crypto.miner.test@tempmail.com',
    fullName: 'Suspicious Probe',
    role: 'user',
    plan: 'free',
    authProvider: 'email',
    country: 'RUS',
    totalRuns: 12,
    languagesUsed: ['Bash', 'C'],
    status: 'banned',
    deviceBrowser: 'HeadlessChrome · Linux',
    signupDate: '2026-04-15T02:10:00Z',
    lastActive: 'Terminated',
  },
];

// Initial Live Events for Admin Feed
export const INITIAL_LIVE_EVENTS: ActivityEvent[] = [
  {
    id: 'evt_1',
    timestamp: '1 min ago',
    type: 'run',
    description: 'Executed Python 3.10 algorithm (Two Sum Hash Map)',
    userEmail: 'priya.sharma@dtc.edu.in',
    country: 'IND',
    language: 'Python',
  },
  {
    id: 'evt_2',
    timestamp: '3 mins ago',
    type: 'ai_fix',
    description: 'AI Fix Applied: SyntaxError resolved with unified diff',
    userEmail: 'arjun.verma99@gmail.com',
    country: 'IND',
    language: 'C++',
  },
  {
    id: 'evt_3',
    timestamp: '6 mins ago',
    type: 'signup',
    description: 'New developer joined via GitHub OAuth',
    userEmail: 'lukas.becker@tum.de',
    country: 'DEU',
  },
  {
    id: 'evt_4',
    timestamp: '11 mins ago',
    type: 'plan_upgrade',
    description: 'Upgraded to Student Pro plan ($0 Verified DTC College)',
    userEmail: 'priya.sharma@dtc.edu.in',
    country: 'IND',
  },
  {
    id: 'evt_5',
    timestamp: '15 mins ago',
    type: 'admin_action',
    description: 'gVisor Watchdog auto-banned container exceeding PID limit (fork bomb defense)',
    userEmail: 'crypto.miner.test@tempmail.com',
    country: 'RUS',
  },
];

export function getRealtimeStats(users: UserProfile[]): RealtimeAdminStats {
  const activeCount = users.filter((u) => u.status === 'active').length;
  const totalRuns = users.reduce((acc, u) => acc + u.totalRuns, 0);

  return {
    onlineUsersCount: Math.floor(activeCount * 0.45) + 3,
    totalRegisteredUsers: users.length + 12530,
    totalCodeRunsToday: totalRuns + 48200,
    activeContainers: 14,
    growthRatePercent: 24.8,
    topLanguages: [
      { language: 'Python 3', count: 18400, percent: 38 },
      { language: 'C++ 20', count: 12200, percent: 25 },
      { language: 'JavaScript / Node', count: 8700, percent: 18 },
      { language: 'Java 15', count: 4800, percent: 10 },
      { language: 'Rust & Go', count: 4100, percent: 9 },
    ],
    countryBreakdown: [
      { country: 'India', code: 'IND', users: 7850 },
      { country: 'United States', code: 'USA', users: 2420 },
      { country: 'Germany', code: 'DEU', users: 890 },
      { country: 'United Kingdom', code: 'GBR', users: 650 },
      { country: 'Singapore', code: 'SGP', users: 430 },
      { country: 'Others', code: 'GLB', users: 300 },
    ],
  };
}

// ================= SESSION TOKEN STORAGE =================
const TOKEN_KEY = 'codenova_auth_token_v1';

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

export function clearAuthToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ================= AUTH API CALLS =================
export async function loginUserApi(email: string, password: string): Promise<{ token: string; user: UserProfile }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to log in.');
  }

  setAuthToken(data.token);
  return data;
}

export async function registerUserApi(
  email: string,
  password: string,
  fullName: string,
  country: string = 'IND'
): Promise<{ token: string; user: UserProfile }> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName, country }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Registration failed.');
  }

  setAuthToken(data.token);
  return data;
}

export async function fetchCurrentUserApi(): Promise<UserProfile | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/auth/me', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      if (res.status === 401) clearAuthToken();
      return null;
    }
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

export async function logoutUserApi(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  } finally {
    clearAuthToken();
  }
}

// ================= ADMIN API CALLS =================
export async function fetchAdminOverviewApi(): Promise<any> {
  const res = await fetch('/api/admin/overview', {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Access denied: Admin credentials required.');
  }
  return res.json();
}

export async function fetchAdminUsersApi(): Promise<UserProfile[]> {
  const res = await fetch('/api/admin/users', {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch users list.');
  }
  const data = await res.json();
  return data.users;
}

export async function updateAdminUserStatusApi(userId: string, status: 'active' | 'banned'): Promise<UserProfile> {
  const res = await fetch(`/api/admin/users/${userId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update user status.');
  return data.user;
}

export async function updateAdminUserRoleApi(userId: string, role: string): Promise<UserProfile> {
  const res = await fetch(`/api/admin/users/${userId}/role`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update user role.');
  return data.user;
}

export async function updateAdminUserPlanApi(userId: string, plan: string): Promise<UserProfile> {
  const res = await fetch(`/api/admin/users/${userId}/plan`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ plan }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update user plan.');
  return data.user;
}

export async function fetchAdminAuditLogsApi(limit: number = 50): Promise<any[]> {
  const res = await fetch(`/api/admin/audit-logs?limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch audit logs.');
  const data = await res.json();
  return data.auditLogs;
}

export async function fetchAdminPaymentsApi(): Promise<any[]> {
  const res = await fetch('/api/admin/payments', {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch payments ledger.');
  const data = await res.json();
  return data.payments;
}

// ================= PAYMENT & SUBSCRIPTION CALLS =================
export async function fetchPaymentConfigApi(): Promise<any> {
  const res = await fetch('/api/payments/config');
  return res.json();
}

export async function createPaymentOrderApi(planId: string, billingCycle: 'monthly' | 'yearly'): Promise<any> {
  const res = await fetch('/api/payments/create-order', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ planId, billingCycle }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Order creation failed.');
  return data;
}

export async function verifyPaymentApi(params: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature?: string;
  planId: string;
  billingCycle: string;
}): Promise<any> {
  const res = await fetch('/api/payments/verify', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Signature verification failed.');
  return data;
}

export async function verifyStudentLicenseApi(email: string, verificationCode: string): Promise<any> {
  const res = await fetch('/api/subscriptions/verify-student', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, verificationCode }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Campus student verification failed.');
  return data;
}

export async function fetchCurrentSubscriptionApi(): Promise<any> {
  const res = await fetch('/api/subscriptions/current', {
    headers: getAuthHeaders(),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function cancelSubscriptionApi(): Promise<any> {
  const res = await fetch('/api/subscriptions/cancel', {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Cancellation failed.');
  return data;
}
