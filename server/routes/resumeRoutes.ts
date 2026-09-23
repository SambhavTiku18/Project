import { Router, Response } from 'express';
import multer from 'multer';
import { resumeRepo, analysisRepo } from '../config/db.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { extractResumeText } from '../services/extractorService.js';

export const resumeRoutes = Router();

// Configure multer for in-memory file storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB maximum
  },
  fileFilter: (req, file, cb) => {
    const allowedMime = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];
    const allowedExt = /\.(pdf|docx|doc|txt)$/i;

    if (allowedMime.includes(file.mimetype) || allowedExt.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX documents up to 10MB are permitted.'));
    }
  },
});

// POST /api/resumes/upload
resumeRoutes.post(
  '/upload',
  authenticateToken,
  upload.single('resume'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'Please select a resume file (PDF or DOCX).' });
        return;
      }

      const file = req.file;
      const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
      const fileType = isPdf ? 'pdf' : 'docx';

      // Real text extraction
      const extracted = await extractResumeText(file.buffer, file.mimetype, file.originalname);

      // Save resume record
      const newResume = await resumeRepo.create({
        userId: req.user!.id,
        originalFilename: file.originalname,
        fileType: fileType as 'pdf' | 'docx',
        fileSize: file.size,
        extractedText: extracted.cleanedText,
        wordCount: extracted.wordCount,
        pageCount: extracted.pageCount,
      });

      res.status(201).json({
        success: true,
        message: 'Resume uploaded and processed successfully.',
        resume: {
          id: newResume.id,
          originalFilename: newResume.originalFilename,
          fileType: newResume.fileType,
          fileSize: newResume.fileSize,
          wordCount: newResume.wordCount,
          pageCount: newResume.pageCount,
          detectedSections: extracted.detectedSections,
          createdAt: newResume.createdAt,
        },
      });
    } catch (err: any) {
      console.error('Resume upload error:', err);
      res.status(400).json({
        success: false,
        message: err.message || 'Failed to process resume file.',
      });
    }
  }
);

// GET /api/resumes
resumeRoutes.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const resumes = await resumeRepo.findByUserId(req.user!.id);
    // Enrich with analysis count
    const enriched = await Promise.all(
      resumes.map(async (r) => {
        const analyses = await analysisRepo.findByResumeId(r.id);
        return {
          id: r.id,
          originalFilename: r.originalFilename,
          fileType: r.fileType,
          fileSize: r.fileSize,
          wordCount: r.wordCount,
          pageCount: r.pageCount,
          analysisCount: analyses.length,
          createdAt: r.createdAt,
        };
      })
    );

    res.json({ success: true, resumes: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve resumes.' });
  }
});

// GET /api/resumes/:id
resumeRoutes.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const resume = await resumeRepo.findById(req.params.id);
    if (!resume) {
      res.status(404).json({ success: false, message: 'Resume not found.' });
      return;
    }

    // Ensure authorization: user can only view their own resume
    if (resume.userId !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Access denied to this resume.' });
      return;
    }

    res.json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch resume details.' });
  }
});

// DELETE /api/resumes/:id
resumeRoutes.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const resume = await resumeRepo.findById(req.params.id);
    if (!resume) {
      res.status(404).json({ success: false, message: 'Resume not found.' });
      return;
    }

    if (resume.userId !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Access denied. You cannot delete another user’s resume.' });
      return;
    }

    await resumeRepo.delete(req.params.id, req.user!.id);

    res.json({ success: true, message: 'Resume and associated analysis records deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete resume.' });
  }
});
