import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { userRepo, analysisRepo, resumeRepo } from '../config/db.js';
import { generateToken, authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

export const authRoutes = Router();

// POST /api/auth/register
authRoutes.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ success: false, message: 'Passwords do not match.' });
      return;
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    // Check existing
    const existing = await userRepo.findByEmail(email);
    if (existing) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await userRepo.create({
      name: name.trim(),
      email: email.trim(),
      passwordHash,
    });

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
});

// POST /api/auth/login
authRoutes.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const user = await userRepo.findByEmail(email);
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
});

// GET /api/auth/me
authRoutes.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await userRepo.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const resumes = await resumeRepo.findByUserId(user.id);
    const analyses = await analysisRepo.findByUserId(user.id);

    let avgScore = 0;
    let avgAts = 0;
    if (analyses.length > 0) {
      avgScore = Math.round(analyses.reduce((acc, cur) => acc + (cur.overallScore || 0), 0) / analyses.length);
      avgAts = Math.round(analyses.reduce((acc, cur) => acc + (cur.atsScore || 0), 0) / analyses.length);
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole || '',
        createdAt: user.createdAt,
      },
      stats: {
        totalResumes: resumes.length,
        totalAnalyses: analyses.length,
        averageScore: avgScore,
        averageAtsScore: avgAts,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve user profile.' });
  }
});

// POST /api/auth/logout
authRoutes.post('/logout', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});
