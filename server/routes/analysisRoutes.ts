import { Router, Response } from 'express';
import multer from 'multer';
import { analysisRepo, resumeRepo } from '../config/db.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { extractResumeText } from '../services/extractorService.js';
import { analyzeResumeWithAI } from '../services/aiService.js';

export const analysisRoutes = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(pdf|docx|doc|txt)$/i;
    if (allowed.test(file.originalname) || file.mimetype.includes('pdf') || file.mimetype.includes('word')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed.'));
    }
  },
});

// POST /api/analysis
// Can analyze an existing resume ID OR an uploaded file directly in one step
analysisRoutes.post(
  '/',
  authenticateToken,
  upload.single('resume'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { resumeId, targetRole, jobDescription } = req.body;

      if (!targetRole || targetRole.trim().length === 0) {
        res.status(400).json({ success: false, message: 'Target job role is required.' });
        return;
      }

      let textToAnalyze = '';
      let resumeFilename = 'Resume Document';
      let activeResumeId = resumeId;
      let detectedSections: string[] = [];

      // Case A: File uploaded directly with request
      if (req.file) {
        const file = req.file;
        const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
        const extracted = await extractResumeText(file.buffer, file.mimetype, file.originalname);

        textToAnalyze = extracted.cleanedText;
        resumeFilename = file.originalname;
        detectedSections = extracted.detectedSections;

        // Auto-save resume for user
        const savedResume = await resumeRepo.create({
          userId: req.user!.id,
          originalFilename: file.originalname,
          fileType: isPdf ? 'pdf' : 'docx',
          fileSize: file.size,
          extractedText: extracted.cleanedText,
          wordCount: extracted.wordCount,
          pageCount: extracted.pageCount,
        });
        activeResumeId = savedResume.id;
      }
      // Case B: Existing resume selected by ID
      else if (resumeId) {
        const existingResume = await resumeRepo.findById(resumeId);
        if (!existingResume) {
          res.status(404).json({ success: false, message: 'Specified resume not found.' });
          return;
        }

        if (existingResume.userId !== req.user!.id) {
          res.status(403).json({ success: false, message: 'Unauthorized access to this resume.' });
          return;
        }

        textToAnalyze = existingResume.extractedText;
        resumeFilename = existingResume.originalFilename;
      } else {
        res.status(400).json({
          success: false,
          message: 'Please upload a resume file or select an existing uploaded resume.',
        });
        return;
      }

      // Execute AI Analysis
      const analysisResult = await analyzeResumeWithAI(
        textToAnalyze,
        targetRole.trim(),
        jobDescription ? jobDescription.trim() : undefined,
        detectedSections
      );

      // Save Analysis in Database
      const savedRecord = await analysisRepo.create({
        userId: req.user!.id,
        resumeId: activeResumeId || 'direct_upload',
        resumeFilename,
        targetRole: targetRole.trim(),
        jobDescription: jobDescription ? jobDescription.trim() : undefined,
        overallScore: analysisResult.overallScore,
        atsScore: analysisResult.atsScore,
        jobMatchScore: analysisResult.jobMatch.score,
        analysisResult,
      });

      res.status(201).json({
        success: true,
        message: 'Resume analysis completed successfully.',
        analysis: savedRecord,
      });
    } catch (err: any) {
      console.error('Analysis execution error:', err);
      res.status(500).json({
        success: false,
        message: err.message || 'Error occurred during AI resume analysis.',
      });
    }
  }
);

// GET /api/analysis
analysisRoutes.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const list = await analysisRepo.findByUserId(req.user!.id);
    const summaryList = list.map((a) => ({
      id: a.id,
      resumeId: a.resumeId,
      resumeFilename: a.resumeFilename,
      targetRole: a.targetRole,
      overallScore: a.overallScore,
      atsScore: a.atsScore,
      jobMatchScore: a.jobMatchScore,
      createdAt: a.createdAt,
    }));

    res.json({ success: true, analyses: summaryList });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve analysis history.' });
  }
});

// GET /api/analysis/:id
analysisRoutes.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const analysis = await analysisRepo.findById(req.params.id);
    if (!analysis) {
      res.status(404).json({ success: false, message: 'Analysis record not found.' });
      return;
    }

    if (analysis.userId !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Unauthorized access to this analysis record.' });
      return;
    }

    res.json({ success: true, analysis });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve analysis.' });
  }
});

// DELETE /api/analysis/:id
analysisRoutes.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const analysis = await analysisRepo.findById(req.params.id);
    if (!analysis) {
      res.status(404).json({ success: false, message: 'Analysis record not found.' });
      return;
    }

    if (analysis.userId !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Unauthorized. You cannot delete this record.' });
      return;
    }

    await analysisRepo.delete(req.params.id, req.user!.id);
    res.json({ success: true, message: 'Analysis record deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete analysis record.' });
  }
});
