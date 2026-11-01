import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db, DbUser, hashPassword, verifyPassword } from './db.js';

const SESSION_SECRET = process.env.SESSION_SECRET || 'codenova_auth_secret_vault_key_2026_xyz';
const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Extend Express Request
export interface AuthenticatedRequest extends Request {
  user?: DbUser;
}

// Generate secure signed session token
export function createSessionToken(user: DbUser): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + TOKEN_EXPIRY_MS,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

// Verify and decode token
export function verifySessionToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadB64, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payloadB64)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
    if (Date.now() > payload.exp) {
      return null; // Expired
    }

    return payload;
  } catch (err) {
    return null;
  }
}

// Rate Limiter for Auth endpoints to protect against brute-force attacks
const authRateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimitAuth(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 15;

  const record = authRateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    authRateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (record.count >= maxRequests) {
    return res.status(429).json({
      error: 'Too many authentication attempts. Please try again after 1 minute.',
    });
  }

  record.count += 1;
  next();
}

// Global Auth Middleware: resolves user if token exists
export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.slice(7).trim();
  const decoded = verifySessionToken(token);
  if (!decoded) {
    return next();
  }

  const user = db.getUserById(decoded.userId);
  if (user && user.status === 'active') {
    req.user = user;
    // update lastActive timestamp
    user.lastActive = new Date().toISOString();
  }

  next();
}

// Strict requirement: User must be authenticated
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized: Authentication required to perform this action.',
      code: 'AUTH_REQUIRED',
    });
  }

  if (req.user.status === 'banned') {
    return res.status(403).json({
      error: 'Account suspended. Please contact CodeNova support.',
      code: 'ACCOUNT_BANNED',
    });
  }

  next();
}

// Strict requirement: User must have ADMIN or SUPERADMIN privileges
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized: Authentication required.',
      code: 'AUTH_REQUIRED',
    });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    // Record security violation in audit log
    db.recordAudit(
      req.user.id,
      req.user.email,
      'UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT',
      `Attempted to access administrative resource: ${req.originalUrl}`,
      req.ip || '127.0.0.1'
    );

    return res.status(403).json({
      error: 'Access Denied: Administrative privileges required.',
      code: 'ADMIN_REQUIRED',
    });
  }

  next();
}

// Strict requirement: User must have an active PRO or STUDENT_PRO plan
export function requirePro(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized: Authentication required.',
      code: 'AUTH_REQUIRED',
    });
  }

  const isPro =
    req.user.plan === 'pro' ||
    req.user.plan === 'student_pro' ||
    req.user.plan === 'campus_license' ||
    req.user.role === 'superadmin';

  if (!isPro) {
    return res.status(403).json({
      error: 'Access Restricted: This feature requires a CodeNova Pro subscription.',
      code: 'PRO_SUBSCRIPTION_REQUIRED',
      plan: req.user.plan,
    });
  }

  next();
}

// Sanitize user object for client response (strips passwordHash and salt)
export function sanitizeUser(user: DbUser) {
  const { passwordHash, salt, ...safe } = user;
  return safe;
}

// AUTH CONTROLLERS
export const AuthController = {
  // POST /api/auth/register
  register: (req: Request, res: Response) => {
    const { email, password, fullName, country = 'IND' } = req.body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Valid email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.getUserByEmail(cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const { hash, salt } = hashPassword(password);

    // Enforce role: ALWAYS 'user' for public registration
    const newUser = db.createUser({
      email: cleanEmail,
      passwordHash: hash,
      salt: salt,
      fullName: (fullName || cleanEmail.split('@')[0]).trim(),
      role: 'user', // NEVER allow admin registration from frontend
      plan: 'free',
      authProvider: 'email',
      country: country.toUpperCase(),
      status: 'active',
      totalRuns: 0,
      languagesUsed: [],
      deviceBrowser: req.headers['user-agent']?.slice(0, 80) || 'Unknown Browser',
    });

    db.recordAudit(
      newUser.id,
      newUser.email,
      'USER_REGISTERED',
      'Account created via email registration.',
      req.ip
    );

    const token = createSessionToken(newUser);
    return res.status(201).json({
      token,
      user: sanitizeUser(newUser),
      message: 'Account registered successfully.',
    });
  },

  // POST /api/auth/login
  login: (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.getUserByEmail(cleanEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ error: 'Your account has been suspended by an administrator.' });
    }

    const valid = verifyPassword(password, user.passwordHash, user.salt);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    db.updateUser(user.id, {
      lastActive: new Date().toISOString(),
      deviceBrowser: req.headers['user-agent']?.slice(0, 80) || user.deviceBrowser,
    });

    db.recordAudit(user.id, user.email, 'USER_LOGIN', 'Successful credentials login.', req.ip);

    const token = createSessionToken(user);
    return res.json({
      token,
      user: sanitizeUser(user),
      message: 'Logged in successfully.',
    });
  },

  // GET /api/auth/me
  me: (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }
    return res.json({ user: sanitizeUser(req.user) });
  },

  // POST /api/auth/logout
  logout: (req: AuthenticatedRequest, res: Response) => {
    if (req.user) {
      db.recordAudit(req.user.id, req.user.email, 'USER_LOGOUT', 'User logged out.', req.ip);
    }
    return res.json({ message: 'Logged out successfully.' });
  },

  // POST /api/auth/password-reset
  passwordReset: (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = db.getUserByEmail(email.trim().toLowerCase());
    // Always return success message to avoid email enumeration attacks
    if (user) {
      db.recordAudit(user.id, user.email, 'PASSWORD_RESET_REQUESTED', 'Password reset link dispatched.', req.ip);
    }

    return res.json({
      message: 'If an account exists with this email, instructions have been sent.',
    });
  },
};
