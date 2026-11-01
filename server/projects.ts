import { Response } from 'express';
import { db } from './db.js';
import { AuthenticatedRequest } from './auth.js';

export const ProjectsController = {
  // GET /api/projects — List only projects belonging to the authenticated user
  listMyProjects: (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const projects = db.listProjectsByUser(req.user.id);
    return res.json({ projects });
  },

  // POST /api/projects — Create a new project for authenticated user
  createProject: (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const { name, languageId, files, isPublic = false } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Project name is required.' });
    }

    // Check plan limits (Free tier: max 10 cloud projects, Pro tier: unlimited)
    const existingProjects = db.listProjectsByUser(req.user.id);
    const isPro =
      req.user.plan === 'pro' ||
      req.user.plan === 'student_pro' ||
      req.user.plan === 'campus_license' ||
      req.user.role === 'superadmin';

    if (!isPro && existingProjects.length >= 10) {
      return res.status(403).json({
        error: 'Free tier limit reached (max 10 projects). Upgrade to CodeNova Pro for unlimited cloud projects.',
        code: 'PROJECT_LIMIT_REACHED',
      });
    }

    const project = db.createProject({
      userId: req.user.id,
      name: name.trim().slice(0, 60),
      languageId: languageId || 'python',
      files: Array.isArray(files) ? files : [],
      isPublic: Boolean(isPublic),
    });

    db.recordAudit(
      req.user.id,
      req.user.email,
      'PROJECT_CREATED',
      `Created project: ${project.name} (${project.id})`,
      req.ip
    );

    return res.status(201).json({
      message: 'Project created successfully.',
      project,
    });
  },

  // GET /api/projects/:id — IDOR Protected: Only owner or admin can view private project
  getProject: (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const project = db.getProjectById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Check ownership: Must be owner, or project is public, or user is admin
    const isOwner = req.user && req.user.id === project.userId;
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'superadmin');

    if (!project.isPublic && !isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Access Denied: You do not have permission to view this private project.',
        code: 'ACCESS_DENIED',
      });
    }

    return res.json({ project });
  },

  // PUT /api/projects/:id — IDOR Protected: Only owner can modify
  updateProject: (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const { id } = req.params;
    const project = db.getProjectById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    if (project.userId !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({
        error: 'Access Denied: You cannot edit another developer’s project.',
        code: 'ACCESS_DENIED',
      });
    }

    const { name, languageId, files, isPublic } = req.body;
    const updates: any = {};

    if (name) updates.name = String(name).trim().slice(0, 60);
    if (languageId) updates.languageId = String(languageId);
    if (Array.isArray(files)) updates.files = files;
    if (typeof isPublic === 'boolean') updates.isPublic = isPublic;

    const updated = db.updateProject(id, req.user.id, updates);

    return res.json({
      message: 'Project updated successfully.',
      project: updated,
    });
  },

  // DELETE /api/projects/:id — IDOR Protected: Only owner or superadmin can delete
  deleteProject: (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const { id } = req.params;
    const project = db.getProjectById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    if (project.userId !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({
        error: 'Access Denied: You cannot delete another developer’s project.',
        code: 'ACCESS_DENIED',
      });
    }

    db.deleteProject(id, req.user.id);

    db.recordAudit(
      req.user.id,
      req.user.email,
      'PROJECT_DELETED',
      `Deleted project: ${project.name} (${id})`,
      req.ip
    );

    return res.json({ message: 'Project deleted successfully.' });
  },
};
