export type UserRole = 'user' | 'moderator' | 'admin' | 'superadmin';
export type UserPlan = 'free' | 'student_pro' | 'pro' | 'campus_license';
export type AuthProvider = 'email' | 'google' | 'github' | 'guest';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  plan: UserPlan;
  authProvider: AuthProvider;
  country: string;
  avatarUrl?: string;
  totalRuns: number;
  languagesUsed: string[];
  status: 'active' | 'banned' | 'pending';
  deviceBrowser: string;
  signupDate: string;
  lastActive: string;
}

export interface RealtimeAdminStats {
  onlineUsersCount: number;
  totalRegisteredUsers: number;
  totalCodeRunsToday: number;
  activeContainers: number;
  topLanguages: { language: string; count: number; percent: number }[];
  countryBreakdown: { country: string; code: string; users: number }[];
  growthRatePercent: number;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'signup' | 'run' | 'ai_fix' | 'plan_upgrade' | 'admin_action';
  description: string;
  userEmail: string;
  country: string;
  language?: string;
}
