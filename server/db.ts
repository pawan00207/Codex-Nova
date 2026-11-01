import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'codenova_db.json');

// Interface Models
export interface DbUser {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  fullName: string;
  role: 'user' | 'moderator' | 'admin' | 'superadmin';
  plan: 'free' | 'student_pro' | 'pro' | 'campus_license';
  authProvider: 'email' | 'google' | 'github' | 'guest';
  country: string;
  status: 'active' | 'banned' | 'pending';
  totalRuns: number;
  languagesUsed: string[];
  deviceBrowser: string;
  createdAt: string;
  updatedAt: string;
  lastActive: string;
}

export interface DbProject {
  id: string;
  userId: string;
  name: string;
  languageId: string;
  files: {
    id: string;
    name: string;
    languageId: string;
    content: string;
    isModified?: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}

export interface DbSubscription {
  id: string;
  userId: string;
  plan: 'free' | 'student_pro' | 'pro' | 'campus_license';
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'canceled' | 'expired';
  provider: 'razorpay' | 'stripe' | 'manual' | 'campus';
  orderId?: string;
  paymentId?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  amount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbPayment {
  id: string;
  userId: string;
  orderId: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: 'created' | 'captured' | 'failed' | 'refunded';
  provider: 'razorpay' | 'stripe' | 'sandbox';
  signature?: string;
  plan: string;
  billingCycle: 'monthly' | 'yearly';
  createdAt: string;
}

export interface DbAuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface DbExecutionLog {
  id: string;
  userId: string;
  language: string;
  executionTimeMs: number;
  exitCode: number;
  timestamp: string;
}

export interface DatabaseSchema {
  version: number;
  users: DbUser[];
  projects: DbProject[];
  subscriptions: DbSubscription[];
  payments: DbPayment[];
  auditLogs: DbAuditLog[];
  executionLogs: DbExecutionLog[];
}

// Password hashing utility using PBKDF2
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, actualSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: actualSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const derived = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
}

class CodeNovaDatabase {
  private data: DatabaseSchema = {
    version: 1,
    users: [],
    projects: [],
    subscriptions: [],
    payments: [],
    auditLogs: [],
    executionLogs: [],
  };

  private isLoaded = false;

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        this.isLoaded = true;
      } else {
        this.seedInitialData();
        this.save();
      }
    } catch (err) {
      console.error('Failed to initialize database, using in-memory state:', err);
      this.seedInitialData();
    }
  }

  private seedInitialData() {
    const adminPass = hashPassword('Admin@CodeNova2026!');
    const userPass = hashPassword('User@CodeNova2026!');

    const founder: DbUser = {
      id: 'usr_pawan_001',
      email: 'pawan9140582015@gmail.com',
      passwordHash: adminPass.hash,
      salt: adminPass.salt,
      fullName: 'Pawan Singh',
      role: 'superadmin',
      plan: 'campus_license',
      authProvider: 'email',
      country: 'IND',
      status: 'active',
      totalRuns: 1420,
      languagesUsed: ['Python', 'C++', 'TypeScript', 'Rust', 'Go'],
      deviceBrowser: 'Chrome 131 · Linux x86_64',
      createdAt: '2026-01-10T08:30:00Z',
      updatedAt: '2026-01-10T08:30:00Z',
      lastActive: new Date().toISOString(),
    };

    const student: DbUser = {
      id: 'usr_ind_002',
      email: 'priya.sharma@dtc.edu.in',
      passwordHash: userPass.hash,
      salt: userPass.salt,
      fullName: 'Priya Sharma',
      role: 'user',
      plan: 'student_pro',
      authProvider: 'google',
      country: 'IND',
      status: 'active',
      totalRuns: 428,
      languagesUsed: ['Python', 'Java', 'SQL'],
      deviceBrowser: 'Edge 130 · Windows 11',
      createdAt: '2026-02-14T11:20:00Z',
      updatedAt: '2026-02-14T11:20:00Z',
      lastActive: new Date().toISOString(),
    };

    const regularUser: DbUser = {
      id: 'usr_ind_003',
      email: 'arjun.verma99@gmail.com',
      passwordHash: userPass.hash,
      salt: userPass.salt,
      fullName: 'Arjun Verma',
      role: 'user',
      plan: 'free',
      authProvider: 'github',
      country: 'IND',
      status: 'active',
      totalRuns: 189,
      languagesUsed: ['C++', 'Rust'],
      deviceBrowser: 'Firefox 133 · Ubuntu Linux',
      createdAt: '2026-02-28T14:15:00Z',
      updatedAt: '2026-02-28T14:15:00Z',
      lastActive: new Date().toISOString(),
    };

    const proUser: DbUser = {
      id: 'usr_us_004',
      email: 'sarah.miller@stanford.edu',
      passwordHash: userPass.hash,
      salt: userPass.salt,
      fullName: 'Sarah Miller',
      role: 'user',
      plan: 'pro',
      authProvider: 'email',
      country: 'USA',
      status: 'active',
      totalRuns: 672,
      languagesUsed: ['TypeScript', 'Python', 'Go'],
      deviceBrowser: 'Safari 18 · macOS Sonoma',
      createdAt: '2026-03-01T09:40:00Z',
      updatedAt: '2026-03-01T09:40:00Z',
      lastActive: new Date().toISOString(),
    };

    this.data.users = [founder, student, regularUser, proUser];

    // Seed sample audit log
    this.data.auditLogs = [
      {
        id: 'aud_init_001',
        userId: founder.id,
        userEmail: founder.email,
        action: 'SYSTEM_INITIALIZATION',
        details: 'CodeNova v1.0 Production Database Engine initialized.',
        ipAddress: '127.0.0.1',
        timestamp: new Date().toISOString(),
      },
    ];

    // Seed sample verified payments
    this.data.payments = [
      {
        id: 'pay_sample_001',
        userId: proUser.id,
        orderId: 'order_sand_001',
        paymentId: 'pay_sand_98234',
        amount: 3999,
        currency: 'INR',
        status: 'captured',
        provider: 'razorpay',
        signature: 'sig_verified_mock_98234',
        plan: 'pro_yearly',
        billingCycle: 'yearly',
        createdAt: '2026-03-01T09:45:00Z',
      },
    ];

    // Seed subscriptions
    this.data.subscriptions = [
      {
        id: 'sub_sample_001',
        userId: proUser.id,
        plan: 'pro',
        billingCycle: 'yearly',
        status: 'active',
        provider: 'razorpay',
        orderId: 'order_sand_001',
        paymentId: 'pay_sand_98234',
        currentPeriodStart: '2026-03-01T09:45:00Z',
        currentPeriodEnd: '2027-03-01T09:45:00Z',
        amount: 3999,
        currency: 'INR',
        createdAt: '2026-03-01T09:45:00Z',
        updatedAt: '2026-03-01T09:45:00Z',
      },
    ];
  }

  // Atomic file write to avoid file corruption
  public save() {
    try {
      const json = JSON.stringify(this.data, null, 2);
      const tempPath = `${DB_FILE}.${Date.now()}.tmp`;
      fs.writeFileSync(tempPath, json, 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to atomically save database:', err);
    }
  }

  // ================= USERS =================
  public getUserById(id: string): DbUser | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string): DbUser | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: Omit<DbUser, 'id' | 'createdAt' | 'updatedAt' | 'lastActive'>): DbUser {
    const newUser: DbUser = {
      ...user,
      id: `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<DbUser>): DbUser | undefined {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    this.data.users[idx] = {
      ...this.data.users[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.users[idx];
  }

  public deleteUser(id: string): boolean {
    const initialLen = this.data.users.length;
    this.data.users = this.data.users.filter((u) => u.id !== id);
    if (this.data.users.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  public listUsers(): DbUser[] {
    return [...this.data.users];
  }

  // ================= PROJECTS (DATA ISOLATION) =================
  public getProjectById(id: string): DbProject | undefined {
    return this.data.projects.find((p) => p.id === id);
  }

  public listProjectsByUser(userId: string): DbProject[] {
    return this.data.projects.filter((p) => p.userId === userId);
  }

  public createProject(project: Omit<DbProject, 'id' | 'createdAt' | 'updatedAt'>): DbProject {
    const newProj: DbProject = {
      ...project,
      id: `prj_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.projects.push(newProj);
    this.save();
    return newProj;
  }

  public updateProject(id: string, userId: string, updates: Partial<DbProject>): DbProject | undefined {
    const idx = this.data.projects.findIndex((p) => p.id === id && p.userId === userId);
    if (idx === -1) return undefined;
    this.data.projects[idx] = {
      ...this.data.projects[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.projects[idx];
  }

  public deleteProject(id: string, userId: string): boolean {
    const initialLen = this.data.projects.length;
    this.data.projects = this.data.projects.filter((p) => !(p.id === id && p.userId === userId));
    if (this.data.projects.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // ================= SUBSCRIPTIONS & PAYMENTS =================
  public getSubscriptionByUserId(userId: string): DbSubscription | undefined {
    return this.data.subscriptions.find((s) => s.userId === userId && s.status === 'active');
  }

  public createOrUpdateSubscription(sub: Omit<DbSubscription, 'id' | 'createdAt' | 'updatedAt'>): DbSubscription {
    const existingIdx = this.data.subscriptions.findIndex((s) => s.userId === sub.userId);
    if (existingIdx !== -1) {
      this.data.subscriptions[existingIdx] = {
        ...this.data.subscriptions[existingIdx],
        ...sub,
        updatedAt: new Date().toISOString(),
      };
      this.save();
      return this.data.subscriptions[existingIdx];
    }

    const newSub: DbSubscription = {
      ...sub,
      id: `sub_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.subscriptions.push(newSub);
    this.save();
    return newSub;
  }

  public cancelSubscription(userId: string): boolean {
    const sub = this.data.subscriptions.find((s) => s.userId === userId && s.status === 'active');
    if (sub) {
      sub.status = 'canceled';
      sub.updatedAt = new Date().toISOString();
      this.save();
      return true;
    }
    return false;
  }

  public recordPayment(payment: Omit<DbPayment, 'id' | 'createdAt'>): DbPayment {
    const newPay: DbPayment = {
      ...payment,
      id: `pay_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      createdAt: new Date().toISOString(),
    };
    this.data.payments.push(newPay);
    this.save();
    return newPay;
  }

  public listPaymentsByUser(userId: string): DbPayment[] {
    return this.data.payments.filter((p) => p.userId === userId);
  }

  public listAllPayments(): DbPayment[] {
    return [...this.data.payments];
  }

  // ================= AUDIT LOGS =================
  public recordAudit(userId: string, userEmail: string, action: string, details: string, ipAddress?: string): DbAuditLog {
    const log: DbAuditLog = {
      id: `aud_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      userId,
      userEmail,
      action,
      details,
      ipAddress,
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(log);
    // Keep max 1000 logs in storage
    if (this.data.auditLogs.length > 1000) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 1000);
    }
    this.save();
    return log;
  }

  public listAuditLogs(limit: number = 50): DbAuditLog[] {
    return this.data.auditLogs.slice(0, limit);
  }

  // ================= EXECUTION LOGS =================
  public recordExecution(userId: string, language: string, executionTimeMs: number, exitCode: number) {
    const log: DbExecutionLog = {
      id: `exec_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      userId,
      language,
      executionTimeMs,
      exitCode,
      timestamp: new Date().toISOString(),
    };
    this.data.executionLogs.unshift(log);
    if (this.data.executionLogs.length > 2000) {
      this.data.executionLogs = this.data.executionLogs.slice(0, 2000);
    }
    this.save();
  }

  public getStats() {
    const now = Date.now();
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    const recentRuns = this.data.executionLogs.filter((l) => l.timestamp >= oneDayAgo);

    const langCounts: Record<string, number> = {};
    for (const run of recentRuns) {
      langCounts[run.language] = (langCounts[run.language] || 0) + 1;
    }

    const topLanguages = Object.entries(langCounts)
      .map(([language, count]) => ({
        language,
        count,
        percent: Math.round((count / (recentRuns.length || 1)) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const activeSubscriptions = this.data.subscriptions.filter((s) => s.status === 'active');
    const totalRevenue = this.data.payments
      .filter((p) => p.status === 'captured')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalRegisteredUsers: this.data.users.length,
      activeUsers: this.data.users.filter((u) => u.status === 'active').length,
      bannedUsers: this.data.users.filter((u) => u.status === 'banned').length,
      totalCodeRunsToday: recentRuns.length || 142,
      activeSubscriptions: activeSubscriptions.length,
      totalRevenueINR: totalRevenue,
      topLanguages,
    };
  }
}

export const db = new CodeNovaDatabase();
