import { Router, Response } from 'express';
import { userRepo, analysisRepo, resumeRepo } from '../config/db.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

export const profileRoutes = Router();

// GET /api/profile
profileRoutes.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await userRepo.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const resumes = await resumeRepo.findByUserId(user.id);
    const analyses = await analysisRepo.findByUserId(user.id);

    let averageOverallScore = 0;
    let averageAtsScore = 0;
    if (analyses.length > 0) {
      averageOverallScore = Math.round(analyses.reduce((sum, a) => sum + (a.overallScore || 0), 0) / analyses.length);
      averageAtsScore = Math.round(analyses.reduce((sum, a) => sum + (a.atsScore || 0), 0) / analyses.length);
    }

    res.json({
      success: true,
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole || '',
        createdAt: user.createdAt,
      },
      stats: {
        totalResumes: resumes.length,
        totalAnalyses: analyses.length,
        averageOverallScore,
        averageAtsScore,
        latestAnalysis: analyses[0] || null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile.' });
  }
});

// PUT /api/profile
profileRoutes.put('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, targetRole } = req.body;

    const updates: any = {};
    if (name && typeof name === 'string') updates.name = name.trim();
    if (targetRole !== undefined) updates.targetRole = typeof targetRole === 'string' ? targetRole.trim() : '';

    const updated = await userRepo.update(req.user!.id, updates);
    if (!updated) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      profile: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        targetRole: updated.targetRole,
        createdAt: updated.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

// DELETE /api/profile
profileRoutes.delete('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const success = await userRepo.delete(req.user!.id);
    if (!success) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.json({ success: true, message: 'Account and all associated resumes/analyses permanently deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete account.' });
  }
});
