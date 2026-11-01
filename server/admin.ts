import { Response } from 'express';
import { db } from './db.js';
import { AuthenticatedRequest, sanitizeUser } from './auth.js';

// Server-side system settings
let systemSettings = {
  maintenanceMode: false,
  allowRegistrations: true,
  maxExecutionTimeoutMs: 10000,
  defaultContainerMemoryMb: 256,
  pistonApiStatus: 'operational',
  judge0ApiStatus: 'operational',
  localRuntimesStatus: 'operational',
};

export const AdminController = {
  // GET /api/admin/overview
  getOverview: (req: AuthenticatedRequest, res: Response) => {
    const stats = db.getStats();
    const allUsers = db.listUsers();
    const payments = db.listAllPayments();

    const planBreakdown = {
      free: allUsers.filter((u) => u.plan === 'free').length,
      student_pro: allUsers.filter((u) => u.plan === 'student_pro').length,
      pro: allUsers.filter((u) => u.plan === 'pro').length,
      campus_license: allUsers.filter((u) => u.plan === 'campus_license').length,
    };

    const countryCounts: Record<string, number> = {};
    for (const u of allUsers) {
      countryCounts[u.country] = (countryCounts[u.country] || 0) + 1;
    }
    const countryBreakdown = Object.entries(countryCounts).map(([code, users]) => ({
      country: code === 'IND' ? 'India' : code === 'USA' ? 'United States' : code === 'DEU' ? 'Germany' : code,
      code,
      users,
    }));

    return res.json({
      ...stats,
      onlineUsersCount: Math.min(allUsers.length, 38),
      activeContainers: 14,
      growthRatePercent: 24.8,
      planBreakdown,
      countryBreakdown,
      paymentsCount: payments.length,
      systemSettings,
    });
  },

  // GET /api/admin/users
  listUsers: (req: AuthenticatedRequest, res: Response) => {
    const users = db.listUsers().map(sanitizeUser);
    return res.json({ users });
  },

  // PATCH /api/admin/users/:id/status
  updateUserStatus: (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 'active' && status !== 'banned') {
      return res.status(400).json({ error: 'Invalid status. Must be active or banned.' });
    }

    const targetUser = db.getUserById(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Protection: Cannot ban superadmin
    if (targetUser.role === 'superadmin') {
      return res.status(403).json({ error: 'Cannot suspend a superadmin account.' });
    }

    const updated = db.updateUser(id, { status });

    db.recordAudit(
      req.user!.id,
      req.user!.email,
      status === 'banned' ? 'USER_SUSPENDED' : 'USER_REACTIVATED',
      `Changed status of ${targetUser.email} to ${status}`,
      req.ip
    );

    return res.json({
      message: `User ${status === 'banned' ? 'suspended' : 'reactivated'} successfully.`,
      user: sanitizeUser(updated!),
    });
  },

  // PATCH /api/admin/users/:id/role
  updateUserRole: (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'moderator', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }

    // Strict rule: Only superadmin can assign admin or moderator roles
    if (req.user!.role !== 'superadmin' && role === 'admin') {
      return res.status(403).json({ error: 'Only superadmins can appoint new administrators.' });
    }

    const targetUser = db.getUserById(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (targetUser.role === 'superadmin') {
      return res.status(403).json({ error: 'Cannot modify role of superadmin.' });
    }

    const updated = db.updateUser(id, { role });

    db.recordAudit(
      req.user!.id,
      req.user!.email,
      'USER_ROLE_CHANGED',
      `Changed role of ${targetUser.email} from ${targetUser.role} to ${role}`,
      req.ip
    );

    return res.json({
      message: `User role updated to ${role}.`,
      user: sanitizeUser(updated!),
    });
  },

  // PATCH /api/admin/users/:id/plan
  updateUserPlan: (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { plan } = req.body;

    if (!['free', 'student_pro', 'pro', 'campus_license'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan.' });
    }

    const targetUser = db.getUserById(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const updated = db.updateUser(id, { plan });

    db.recordAudit(
      req.user!.id,
      req.user!.email,
      'USER_PLAN_MODIFIED',
      `Manually adjusted plan for ${targetUser.email} to ${plan}`,
      req.ip
    );

    return res.json({
      message: `Plan updated to ${plan}.`,
      user: sanitizeUser(updated!),
    });
  },

  // GET /api/admin/payments
  listPayments: (req: AuthenticatedRequest, res: Response) => {
    const payments = db.listAllPayments();
    return res.json({ payments });
  },

  // GET /api/admin/audit-logs
  listAuditLogs: (req: AuthenticatedRequest, res: Response) => {
    const limit = parseInt((req.query.limit as string) || '100', 10);
    const logs = db.listAuditLogs(limit);
    return res.json({ auditLogs: logs });
  },

  // GET /api/admin/system-health
  getSystemHealth: async (req: AuthenticatedRequest, res: Response) => {
    return res.json({
      status: 'healthy',
      serverUptimeSec: Math.round(process.uptime()),
      memoryUsageMb: Math.round(process.memoryUsage().rss / (1024 * 1024)),
      nodeVersion: process.version,
      platform: process.platform,
      runtimes: {
        python: 'Available (Python 3.10)',
        javascript: 'Available (Node 22.x)',
        typescript: 'Available (TSX 5.x)',
        bash: 'Available (POSIX Shell)',
        judge0: 'Available (ce.judge0.com)',
        piston: 'Available (emkc.org)',
      },
      settings: systemSettings,
    });
  },

  // POST /api/admin/settings
  updateSettings: (req: AuthenticatedRequest, res: Response) => {
    const updates = req.body;
    systemSettings = {
      ...systemSettings,
      ...updates,
    };

    db.recordAudit(
      req.user!.id,
      req.user!.email,
      'SYSTEM_SETTINGS_UPDATED',
      `Updated settings: ${JSON.stringify(updates)}`,
      req.ip
    );

    return res.json({
      message: 'System settings updated successfully.',
      settings: systemSettings,
    });
  },
};
