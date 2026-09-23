import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  targetRole?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeRecord {
  id: string;
  userId: string;
  originalFilename: string;
  fileType: 'pdf' | 'docx' | 'unknown';
  fileSize: number;
  extractedText: string;
  wordCount: number;
  pageCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisRecord {
  id: string;
  userId: string;
  resumeId: string;
  resumeFilename: string;
  targetRole: string;
  jobDescription?: string;
  overallScore: number;
  atsScore: number;
  jobMatchScore: number;
  analysisResult: any; // Full structured AI report
  createdAt: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  resumes: ResumeRecord[];
  analyses: AnalysisRecord[];
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure directory and data file exist
function initializeDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const demoUser = {
      id: 'demo-user-id',
      name: 'Alex Carter',
      email: 'demo@resumeiq.ai',
      passwordHash: bcrypt.hashSync('demo123456', 10),
      targetRole: 'Full Stack Software Engineer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const demoResume = {
      id: 'demo-resume-id',
      userId: demoUser.id,
      originalFilename: 'Alex_Carter_Software_Engineer.pdf',
      fileType: 'pdf' as const,
      fileSize: 145200,
      extractedText: `ALEX CARTER
alex.carter@example.com | (555) 234-5678 | San Francisco, CA
linkedin.com/in/alexcarter-demo | github.com/alexcarter-demo

PROFESSIONAL SUMMARY
Results-driven Full Stack Software Engineer with 3+ years of experience engineering scalable web applications and distributed cloud services. Proficient in React, TypeScript, Node.js, and PostgreSQL. Passionate about automated testing, CI/CD, and delivering performant user experiences.

TECHNICAL SKILLS
- Languages: JavaScript (ES6+), TypeScript, Python, SQL, HTML5, CSS3
- Frontend: React.js, Next.js, Redux Toolkit, Tailwind CSS, Vite
- Backend: Node.js, Express.js, RESTful APIs, GraphQL, PostgreSQL, MongoDB
- DevOps & Tools: Docker, Git/GitHub, AWS (S3, EC2), Jest, Vitest, Postman

WORK EXPERIENCE
Software Engineer | CloudScale Systems | June 2023 – Present
- Architected and deployed responsive React 19 web dashboards serving 25,000+ monthly active users, reducing first contentful paint by 34%.
- Engineered high-throughput REST APIs using Express.js and TypeScript, handling over 1.2M weekly requests with 99.9% uptime.
- Streamlined database query execution by indexing PostgreSQL tables, decreasing slow queries by 45%.
- Implemented automated end-to-end integration tests using Vitest and Cypress, improving test coverage from 62% to 88%.

Junior Full Stack Developer | DevForge Labs | Sept 2021 – May 2023
- Built client-facing UI components in React and styled them using Tailwind CSS in an Agile sprint environment.
- Collaborated with UI/UX team to refactor legacy jQuery code into reusable React components.
- Configured GitHub Actions CI/CD workflows to automate staging and production deployments.

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2017 – 2021
GPA: 3.8 / 4.0 | Dean's Honors List

KEY PROJECTS
- ResumeIQ Web Platform: Built AI-powered career assistant with React, Node.js, and Gemini API.
- Distributed Task Scheduler: Open-source Node.js asynchronous job queue with Redis persistence.`,
      wordCount: 285,
      pageCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const demoAnalysis = {
      id: 'demo-analysis-id',
      userId: demoUser.id,
      resumeId: demoResume.id,
      resumeFilename: demoResume.originalFilename,
      targetRole: 'Full Stack Software Engineer',
      jobDescription: 'Seeking a Full Stack Engineer with proficiency in React, TypeScript, Node.js, Docker, and PostgreSQL.',
      overallScore: 86,
      atsScore: 91,
      jobMatchScore: 84,
      analysisResult: {
        overallScore: 86,
        atsScore: 91,
        summary: 'Strong technical resume with clear chronological structure, robust technology stack, and measurable business outcomes.',
        strengths: [
          'Excellent quantifiable achievements with real metrics (34% FCP reduction, 1.2M weekly requests, 45% query speedup).',
          'Standard single-column layout with high ATS readability and cleanly separated headings.',
          'Strong alignment with Full Stack engineering requirements (React, TypeScript, Node.js, PostgreSQL).',
        ],
        weaknesses: [
          'Could highlight Docker containerization experience more directly in work bullets.',
          'Summary could explicitly mention target industry or specific engineering philosophy.',
        ],
        sections: [
          { name: 'Contact Information', score: 95, status: 'strong', feedback: 'All critical identifiers present including LinkedIn and GitHub links.' },
          { name: 'Professional Summary', score: 82, status: 'strong', feedback: 'Concise and highlights core competencies effectively.' },
          { name: 'Work Experience', score: 88, status: 'strong', feedback: 'Outstanding use of action verbs and Google XYZ metric structure.' },
          { name: 'Technical Skills', score: 90, status: 'strong', feedback: 'Categorized logically by Languages, Frontend, Backend, and DevOps.' },
          { name: 'Education', score: 92, status: 'strong', feedback: 'Clear degree, institution, graduation year, and GPA credentials.' },
          { name: 'Projects', score: 84, status: 'strong', feedback: 'Good demonstration of applied skills with relevant technology tags.' },
        ],
        skills: {
          strong: ['React.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'RESTful APIs', 'Jest/Vitest', 'Git'],
          developing: ['Docker', 'AWS (S3, EC2)', 'GraphQL', 'MongoDB'],
          notFound: ['Kubernetes', 'Microservices', 'Redis Caching'],
        },
        jobMatch: {
          score: 84,
          matchingKeywords: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'RESTful APIs', 'Git', 'Agile', 'Testing'],
          missingKeywords: ['Microservices', 'System Architecture', 'CI/CD Pipelines'],
          matchingSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
          missingSkills: ['Kubernetes', 'Redis'],
          advice: 'You have a high 84% keyword match. Add a note on Docker containerization in your latest role experience to boost this even higher.',
        },
        recommendations: {
          critical: [],
          content: [
            'Clarify the scale of the PostgreSQL database (e.g. millions of rows or shard sizes).',
            'Mention team collaboration size (e.g. "Collaborated in an 8-person Agile engineering team").',
          ],
          ats: [
            'Keep single-column layout as it scores 91/100 in parser compatibility.',
            'Ensure all hyperlinked URLs are also displayed in readable plain text.',
          ],
          formatting: [
            'Maintain current font hierarchy (10pt-11pt body text is optimal).',
          ],
          projects: [
            'Add live demo deployment links to the ResumeIQ and Task Scheduler projects.',
          ],
          technical: [
            'Highlight TypeScript strict mode adoption or state management architectures.',
          ],
        },
        bulletSuggestions: [
          {
            original: 'Built client-facing UI components in React and styled them using Tailwind CSS.',
            improved: 'Engineered 20+ responsive UI components in React and Tailwind CSS, increasing cross-device consistency and test coverage by [X%].',
            reason: 'Adds scope, count of deliverables, and outcome rather than stating raw duty.',
            category: 'impact',
          },
        ],
        nextSteps: [
          'Add Docker containerization evidence into CloudScale Systems experience bullet.',
          'Include live GitHub or production links for personal project portfolio.',
          'Customize resume summary for senior engineering opportunities.',
        ],
        analyzedAt: new Date().toISOString(),
        modelUsed: 'Gemini 2.5 Flash',
      },
      createdAt: new Date().toISOString(),
    };

    const initialData: DatabaseSchema = {
      users: [demoUser],
      resumes: [demoResume],
      analyses: [demoAnalysis],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      users: parsed.users || [],
      resumes: parsed.resumes || [],
      analyses: parsed.analyses || [],
    };
  } catch (err) {
    console.error('Error reading db.json, recreating empty db', err);
    const initialData: DatabaseSchema = { users: [], resumes: [], analyses: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function readDb(): DatabaseSchema {
  return initializeDatabase();
}

function writeDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Failed to write to db.json:', err);
    throw err;
  }
}

// User operations
export const userRepo = {
  async findByEmail(email: string): Promise<UserRecord | null> {
    const db = readDb();
    return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findById(id: string): Promise<UserRecord | null> {
    const db = readDb();
    return db.users.find((u) => u.id === id) || null;
  },

  async create(userData: Omit<UserRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserRecord> {
    const db = readDb();
    const now = new Date().toISOString();
    const newUser: UserRecord = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      ...userData,
      email: userData.email.toLowerCase().trim(),
      createdAt: now,
      updatedAt: now,
    };
    db.users.push(newUser);
    writeDb(db);
    return newUser;
  },

  async update(id: string, updates: Partial<Omit<UserRecord, 'id' | 'createdAt'>>): Promise<UserRecord | null> {
    const db = readDb();
    const index = db.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    db.users[index] = {
      ...db.users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    writeDb(db);
    return db.users[index];
  },

  async delete(id: string): Promise<boolean> {
    const db = readDb();
    const initialLen = db.users.length;
    db.users = db.users.filter((u) => u.id !== id);
    // Cascade delete resumes & analyses
    db.resumes = db.resumes.filter((r) => r.userId !== id);
    db.analyses = db.analyses.filter((a) => a.userId !== id);
    writeDb(db);
    return db.users.length < initialLen;
  },
};

// Resume operations
export const resumeRepo = {
  async create(resumeData: Omit<ResumeRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ResumeRecord> {
    const db = readDb();
    const now = new Date().toISOString();
    const newResume: ResumeRecord = {
      id: 'res_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      ...resumeData,
      createdAt: now,
      updatedAt: now,
    };
    db.resumes.push(newResume);
    writeDb(db);
    return newResume;
  },

  async findById(id: string): Promise<ResumeRecord | null> {
    const db = readDb();
    return db.resumes.find((r) => r.id === id) || null;
  },

  async findByUserId(userId: string): Promise<ResumeRecord[]> {
    const db = readDb();
    return db.resumes
      .filter((r) => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async delete(id: string, userId: string): Promise<boolean> {
    const db = readDb();
    const target = db.resumes.find((r) => r.id === id && r.userId === userId);
    if (!target) return false;

    db.resumes = db.resumes.filter((r) => r.id !== id);
    // Cascade delete associated analyses
    db.analyses = db.analyses.filter((a) => a.resumeId !== id);
    writeDb(db);
    return true;
  },
};

// Analysis operations
export const analysisRepo = {
  async create(analysisData: Omit<AnalysisRecord, 'id' | 'createdAt'>): Promise<AnalysisRecord> {
    const db = readDb();
    const now = new Date().toISOString();
    const newAnalysis: AnalysisRecord = {
      id: 'anl_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      ...analysisData,
      createdAt: now,
    };
    db.analyses.push(newAnalysis);
    writeDb(db);
    return newAnalysis;
  },

  async findById(id: string): Promise<AnalysisRecord | null> {
    const db = readDb();
    return db.analyses.find((a) => a.id === id) || null;
  },

  async findByUserId(userId: string): Promise<AnalysisRecord[]> {
    const db = readDb();
    return db.analyses
      .filter((a) => a.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async findByResumeId(resumeId: string): Promise<AnalysisRecord[]> {
    const db = readDb();
    return db.analyses
      .filter((a) => a.resumeId === resumeId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async delete(id: string, userId: string): Promise<boolean> {
    const db = readDb();
    const target = db.analyses.find((a) => a.id === id && a.userId === userId);
    if (!target) return false;

    db.analyses = db.analyses.filter((a) => a.id !== id);
    writeDb(db);
    return true;
  },
};
