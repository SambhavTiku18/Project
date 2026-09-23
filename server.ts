import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { authRoutes } from './server/routes/authRoutes.js';
import { resumeRoutes } from './server/routes/resumeRoutes.js';
import { analysisRoutes } from './server/routes/analysisRoutes.js';
import { profileRoutes } from './server/routes/profileRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Security & Parsing Middlewares
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    appName: 'ResumeIQ',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY || process.env.AI_API_KEY),
    model: process.env.AI_MODEL || 'gemini-3.8-flash',
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/profile', profileRoutes);

// Global Error Handler for API
app.use('/api', (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('API Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'An unexpected error occurred on the server.',
  });
});

async function startServer() {
  if (!isProd) {
    // Development mode: attach Vite Dev Server middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Production mode: serve static build assets
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      console.warn('Production build dist folder not found. Falling back to index.html');
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ResumeIQ Server running at http://0.0.0.0:${PORT}`);
    console.log(`✨ Environment: ${isProd ? 'Production' : 'Development'}`);
    console.log(`🤖 AI Engine: ${process.env.AI_MODEL || 'gemini-3.8-flash'} (${Boolean(process.env.GEMINI_API_KEY || process.env.AI_API_KEY) ? 'API Key Active' : 'API Key Missing, Fallback Active'})`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
