import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  Cpu,
  Layers,
  ShieldCheck,
  FileCode2,
  Sparkles,
  Server,
  Search,
  ChevronDown,
  ChevronUp,
  Terminal,
  Database,
  Lock,
  FileText,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

interface VivaQuestion {
  id: number;
  category: string;
  question: string;
  answer: string;
  keyTakeaways: string[];
}

const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 1,
    category: 'Architecture & Overview',
    question: 'What is ResumeIQ and what problem does it solve?',
    answer: 'ResumeIQ is an AI-powered full-stack career platform designed to bridge the gap between job seekers and automated applicant tracking systems (ATS). It solves the problem of high resume rejection rates by extracting text from PDF/DOCX files, scoring them against industry ATS criteria, measuring job description alignment, and providing contextual, non-fabricated bullet point enhancements using the Google XYZ framework.',
    keyTakeaways: ['Full-stack MERN/Node architecture', 'Real file text parsing', 'Estimated ATS scoring', 'Non-hallucinatory AI recommendations'],
  },
  {
    id: 2,
    category: 'Architecture & Overview',
    question: 'Explain the high-level architecture of this application.',
    answer: 'The system uses a client-server architecture. The frontend is a Single Page Application (SPA) built with React 19, TypeScript, Vite, and Tailwind CSS. The backend is an Express.js HTTP REST API in Node.js. File parsing occurs in-memory via multer, pdf-parse, and mammoth. AI intelligence is orchestrated through the official Google Gen AI SDK (@google/genai) calling Gemini 2.5 Flash server-side. Data is managed through a repository abstraction layer supporting both local JSON file persistence and MongoDB.',
    keyTakeaways: ['Decoupled frontend & backend', 'In-memory parsing without filesystem leaks', 'Server-side AI orchestration', 'Repository-pattern database layer'],
  },
  {
    id: 3,
    category: 'Architecture & Overview',
    question: 'Walk through the end-to-end flow when a user uploads and analyzes a resume.',
    answer: '1. User selects a PDF/DOCX file and target job role on the React frontend.\n2. The file is sent via multipart/form-data to Express POST /api/analysis.\n3. Multer inspects the buffer, enforcing a 10MB limit and MIME type validation.\n4. extractorService extracts plain text (using pdf-parse for PDF or mammoth for DOCX) and normalizes whitespace and section headers.\n5. aiService passes the cleaned text, target role, and optional job description into Gemini 2.5 Flash using a strict JSON schema prompt.\n6. Gemini returns a structured evaluation containing scores, section ratings, skill matrix, and bullet improvements.\n7. The record is persisted into the database with a unique ID and returned to the client.\n8. React renders interactive circular gauges, keyword matrices, and a printable PDF summary.',
    keyTakeaways: ['Step-by-step pipeline from multipart request to structured response', 'Zero client-side API key exposure', 'Fail-safe fallback heuristics'],
  },
  {
    id: 4,
    category: 'Frontend & UI',
    question: 'Why did you choose React with Vite instead of traditional Create React App (CRA)?',
    answer: 'Vite uses native ES modules during development, resulting in near-instant hot module replacement (HMR) and lightning-fast build times powered by Rollup and esbuild. Create React App is officially deprecated and relies on slower Webpack configurations. Vite provides better tree-shaking, lightweight asset bundling, and first-class TypeScript support.',
    keyTakeaways: ['Native ES Modules in dev', 'Rollup for optimized production chunks', 'CRA is deprecated', 'Sub-second compile times'],
  },
  {
    id: 5,
    category: 'Frontend & UI',
    question: 'How is state managed across the frontend application?',
    answer: 'State is managed hierarchically. Application-wide session state (user profile, token, authentication status, global statistics) is centralized in an AuthContext created using React Context API and custom useAuth hook. View-specific states (form inputs, file uploads, step animations, filter queries) are kept localized using standard useState and useEffect hooks to avoid unnecessary re-renders.',
    keyTakeaways: ['React Context API for auth and session', 'Localized useState for forms and modals', 'Optimized re-render control'],
  },
  {
    id: 6,
    category: 'Frontend & UI',
    question: 'How do you prevent UI freezing when a user uploads a large resume?',
    answer: 'File uploads are handled asynchronously via standard fetch calls with FormData. In the frontend, the UI immediately switches to an active multi-stage stepper that displays real progress without blocking the main browser execution thread. The SVG ScoreGauge components compute SVG arc lengths using pure CSS transition properties.',
    keyTakeaways: ['Asynchronous event loop execution', 'CSS hardware-accelerated animations', 'Zero main-thread blocking'],
  },
  {
    id: 7,
    category: 'Backend & APIs',
    question: 'Why should AI API calls always be made server-side rather than directly from React?',
    answer: 'Calling AI APIs (like Gemini) directly from frontend browser code exposes secret API keys in JavaScript bundles and network inspection tabs, allowing anyone to steal the credentials. Furthermore, server-side orchestration enables rate limiting, request validation, payload sanitation, user authentication, and persistent database recording before returning results.',
    keyTakeaways: ['API Key secrecy', 'Server-side rate limiting and CORS protection', 'Guaranteed database persistence'],
  },
  {
    id: 8,
    category: 'Backend & APIs',
    question: 'Explain Express middleware and list the middlewares used in this project.',
    answer: 'Express middleware functions are handlers with access to the request (req), response (res), and next() function in the application’s request-response cycle. In ResumeIQ, we use: 1) express.json() & express.urlencoded() for JSON parsing, 2) multer for multipart file upload stream processing, 3) authenticateToken for verifying JWT headers, 4) request timing and logging middleware, and 5) global error handling middleware.',
    keyTakeaways: ['Interception in request-response cycle', 'Authentication guards', 'Safe error propagation'],
  },
  {
    id: 9,
    category: 'Backend & APIs',
    question: 'What HTTP status codes are used across your REST API endpoints?',
    answer: '200 OK (successful query/retrieval), 201 Created (successful registration, upload, or analysis generation), 400 Bad Request (missing target role or invalid file format), 401 Unauthorized (invalid login credentials or missing/expired JWT), 403 Forbidden (attempting to access another user’s resume), 404 Not Found (resource does not exist), 409 Conflict (registering with an email already in use), and 500 Internal Server Error.',
    keyTakeaways: ['Strict REST semantics', 'Client vs Server error differentiation', 'Security authorization boundaries (401 vs 403)'],
  },
  {
    id: 10,
    category: 'Authentication & Security',
    question: 'How is user authentication implemented in ResumeIQ?',
    answer: 'Authentication uses stateless JSON Web Tokens (JWT). When a user registers or logs in, their password is verified against an encrypted bcrypt hash. Upon success, the server signs a JWT containing the user’s ID and email using a secret key and sets an expiration of 7 days. The client stores this token in localStorage and includes it as a Bearer token in the Authorization header on subsequent requests. The authenticateToken middleware verifies the token signature on protected routes.',
    keyTakeaways: ['Stateless JWT verification', 'Bearer token Authorization header', 'Cryptographic signature validation'],
  },
  {
    id: 11,
    category: 'Authentication & Security',
    question: 'Why do you use bcrypt instead of SHA-256 or MD5 for password storage?',
    answer: 'SHA-256 and MD5 are general cryptographic hash functions designed to be fast, which makes them vulnerable to brute-force attacks and rainbow tables using modern GPUs. Bcrypt is an adaptive key derivation function with an adjustable work factor (salt rounds) that deliberately introduces computational cost and automatically salts the password, rendering rainbow tables useless.',
    keyTakeaways: ['Salting prevents rainbow table attacks', 'Adaptive work factor prevents brute-force GPU cracking', 'Never store plaintext passwords'],
  },
  {
    id: 12,
    category: 'Authentication & Security',
    question: 'How does the application prevent horizontal privilege escalation?',
    answer: 'Horizontal privilege escalation occurs when User A accesses or manipulates User B’s private data. In our resume and analysis endpoints, every database retrieval and deletion verifies that the requested record’s userId matches the authenticated req.user.id extracted from the cryptographically verified JWT. If they do not match, the server returns 403 Forbidden.',
    keyTakeaways: ['Ownership check on every database mutation', 'Prevents IDOR (Insecure Direct Object Reference) vulnerabilities'],
  },
  {
    id: 13,
    category: 'File Processing',
    question: 'How do you extract text from PDF files in Node.js?',
    answer: 'PDF files are not plain text; they store data in encoded postscript streams, compressed object streams, and font glyph mappings. We use pdf-parse with an in-memory buffer supplied by Multer. The parser traverses the document catalog, decompresses text chunks via FlateDecode, resolves character encodings, and concatenates the text flow into an ASCII string while preserving basic page breaks.',
    keyTakeaways: ['Stream decompression via pdf-parse', 'Memory buffers prevent disk pollution', 'Handles multi-page document pagination'],
  },
  {
    id: 14,
    category: 'File Processing',
    question: 'How do you extract text from Word .docx files?',
    answer: 'A .docx file is actually a zipped archive containing XML files, primarily word/document.xml. We use the mammoth library, which unpacks the OpenXML archive in-memory, parses the paragraph (<w:p>) and run (<w:r>) tags, and converts the document into raw text while ignoring presentation styles like fonts and colors.',
    keyTakeaways: ['DOCX is a zipped XML package', 'Mammoth parses semantic paragraph structures', 'Ignores proprietary styling to extract pure text'],
  },
  {
    id: 15,
    category: 'File Processing',
    question: 'How does the system detect whether a PDF is an unreadable scanned image?',
    answer: 'extractorService calculates the word count and non-whitespace character density of the extracted string. If a PDF has multiple pages but yields fewer than 30 readable words, the system identifies that the PDF likely consists of flattened images or raster scans without an OCR text layer and surfaces a clear warning to the user.',
    keyTakeaways: ['Character density thresholds', 'Graceful handling of scanned images', 'Guidance to upload text-selectable PDFs'],
  },
  {
    id: 16,
    category: 'Artificial Intelligence',
    question: 'Which AI model is used, and why did you choose it?',
    answer: 'The system uses Google Gemini 2.5 Flash via the modern @google/genai TypeScript SDK. Gemini 2.5 Flash offers the ideal balance of sub-second inference latency, low token cost, a 1-million-token context window, and exceptional instruction-following capability for structured JSON schemas, which is critical for generating reliable scoring metrics.',
    keyTakeaways: ['Gemini 2.5 Flash via @google/genai', 'Sub-second response time', 'Large context window', 'Structured JSON enforcement'],
  },
  {
    id: 17,
    category: 'Artificial Intelligence',
    question: 'How do you prevent the AI from hallucinating or generating invalid response formats?',
    answer: 'We employ three defense layers: 1) System Instructions that enforce a strict JSON output schema using responseMimeType: "application/json", 2) Explicit prompt constraints forbidding fabricated work experience or metrics (requiring the model to use [X%] placeholders when metrics are absent), and 3) An algorithmic fallback parser that safely computes scores and recommendations if the AI service encounters rate limits or network issues.',
    keyTakeaways: ['responseMimeType: application/json', 'Structured schema injection', 'Strict anti-hallucination prompt boundaries', 'Zero-downtime heuristic fallback'],
  },
  {
    id: 18,
    category: 'Artificial Intelligence',
    question: 'What is the Google XYZ Formula and how is it used in ResumeIQ?',
    answer: 'The Google XYZ formula was popularized by Google’s Former SVP of People Operations, Laszlo Bock: "Accomplished [X], as measured by [Y], by doing [Z]". ResumeIQ identifies weak passive bullets (e.g. "Worked on React UI") and rewrites them into strong action-oriented statements ("Architected responsive React frontends, reducing page load latency by [X%], using Vite and Tailwind CSS").',
    keyTakeaways: ['Accomplished [X], measured by [Y], by doing [Z]', 'Replaces passive voice with active impact verbs', 'Guides users to measure business outcomes'],
  },
  {
    id: 19,
    category: 'ATS Scoring & Algorithms',
    question: 'Why do you label the ATS score as an "Estimated ATS Compatibility Score"?',
    answer: 'There is no single universal ATS software; companies use Workday, Taleo, Greenhouse, iCIMS, Lever, and others, each with proprietary parsing algorithms. Calling a score an "official ATS score" would be deceptive. ResumeIQ’s score is an estimated compatibility index based on universal ATS parsing heuristics: clear single/dual-column layout, standard ASCII headings, contact info placement, bullet readability, and keyword frequency.',
    keyTakeaways: ['ATS software is fragmented across vendors', 'Scores represent algorithmic compatibility heuristics', 'Honest and academically transparent branding'],
  },
  {
    id: 20,
    category: 'ATS Scoring & Algorithms',
    question: 'What common resume formatting mistakes lower an ATS score?',
    answer: '1. Placing critical contact information inside Word or PDF headers/footers (many parsers skip headers entirely).\n2. Using multi-nested tables, text boxes, or graphics which scramble the linear reading order.\n3. Using non-standard section headings like "My Journey" or "What I Do" instead of "Experience" or "Work History".\n4. Submitting image scans without an optical character layer.',
    keyTakeaways: ['Headers/footers often ignored by parsers', 'Tables scramble text flow', 'Stick to standard heading nomenclature'],
  },
  {
    id: 21,
    category: 'ATS Scoring & Algorithms',
    question: 'How does the Job Match algorithm work?',
    answer: 'When a user inputs a job description, the system normalizes both the resume text and the job description into tokenized lower-case terms. It extracts technical stacks, tools, and domain keywords, filters out stop words, and computes both keyword intersection (matching terms) and set difference (missing terms). The final score reflects the proportion of critical job requirements evidenced in the resume.',
    keyTakeaways: ['Tokenization and stop-word filtering', 'Keyword intersection and difference set analysis', 'Direct comparison between resume text and job description'],
  },
  {
    id: 22,
    category: 'Database & Persistence',
    question: 'Explain your database strategy in this project.',
    answer: 'The application uses the Repository Pattern (IUserRepository, IResumeRepository, IAnalysisRepository). By default in this environment, it implements a robust file-backed JSON database in .data/db.json with atomic writes, ensuring zero configuration and full persistence across restarts. The repository interface is identical to a MongoDB Mongoose/Prisma schema, allowing switching to MongoDB Atlas simply by adjusting the database driver without changing any route logic.',
    keyTakeaways: ['Repository Design Pattern', 'Zero-config file persistence fallback', 'Seamless transition to MongoDB or PostgreSQL'],
  },
  {
    id: 23,
    category: 'Database & Persistence',
    question: 'What database collections / schemas are defined?',
    answer: 'Three core schemas: 1) Users (id, name, email, passwordHash, targetRole, createdAt), 2) Resumes (id, userId, originalFilename, fileType, fileSize, extractedText, wordCount, pageCount, createdAt), and 3) Analyses (id, userId, resumeId, resumeFilename, targetRole, jobDescription, overallScore, atsScore, jobMatchScore, analysisResult, createdAt).',
    keyTakeaways: ['User, Resume, and Analysis relational mapping', 'Cascade deletion of analyses when resume is deleted'],
  },
  {
    id: 24,
    category: 'Database & Persistence',
    question: 'What happens to analysis records when a user deletes a resume?',
    answer: 'The system implements cascade deletion. In IResumeRepository.delete, the method first deletes the resume record and then queries analysisRepo to remove all analysis records where resumeId matches the deleted resume, preventing orphan records in storage.',
    keyTakeaways: ['Referential integrity', 'Cascade deletion prevents orphaned records', 'Cleaner storage and privacy compliance'],
  },
  {
    id: 25,
    category: 'Performance & Optimization',
    question: 'How is file upload size managed to prevent server denial of service?',
    answer: 'Multer is configured with a strict limit: { fileSize: 10 * 1024 * 1024 } (10 MB). If a client attempts to upload a file larger than 10MB, the Multer stream immediately terminates and returns an HTTP 400 error before consuming unnecessary server RAM.',
    keyTakeaways: ['Early stream termination', '10MB memory protection limit', 'Shields against memory exhaustion'],
  },
  {
    id: 26,
    category: 'Performance & Optimization',
    question: 'How do you handle PDF export without heavy third-party canvas libraries?',
    answer: 'We leverage browser-native window.print() combined with custom CSS print stylesheets (@media print). The stylesheet suppresses navigation bars, sidebars, and action buttons (no-print utility class), resets background colors for crisp printing, and enforces page-break-inside: avoid on score cards and section feedback.',
    keyTakeaways: ['Native window.print()', 'Zero client bundle bloat', 'Clean CSS media print rules'],
  },
  {
    id: 27,
    category: 'Testing & Error Handling',
    question: 'How does the application behave if the Gemini AI API is unavailable or rate-limited?',
    answer: 'ResumeIQ implements a dual-layer fault tolerance architecture. The primary layer calls Gemini 2.5 Flash. If the call times out, encounters an invalid key, or exceeds quota limits, the system catches the error and seamlessly falls back to analyzeResumeWithHeuristics. This fallback uses algorithmic regex scoring, section header detection, and keyword frequency matching to return a complete, valid analysis report with zero downtime.',
    keyTakeaways: ['Graceful degradation', 'Heuristic fallback engine', '100% uptime guarantee for users'],
  },
  {
    id: 28,
    category: 'Testing & Error Handling',
    question: 'How do you validate inputs on both the frontend and backend?',
    answer: 'Defense in depth: On the frontend, forms check for email regex, minimum password lengths (6+ chars), matching confirmation passwords, and file extensions before submitting. On the backend, routes re-validate all parameters independently, ensuring that malicious API requests (e.g. via Postman or curl) cannot bypass frontend checks.',
    keyTakeaways: ['Defense in depth', 'Never trust client-side validation alone', 'Sanitized inputs protect backend logic'],
  },
  {
    id: 29,
    category: 'Deployment & DevOps',
    question: 'How is this full-stack application bundled and deployed?',
    answer: 'The project is configured for unified full-stack serving. In development, tsx server.ts mounts the Vite development server via middlewares for instant HMR. In production, npm run build compiles the React application into optimized static assets in the dist/ folder. server.ts then serves these static assets and handles all /api routes under a single Node.js port (3000), allowing seamless deployment to platforms like Render, Railway, Vercel, or Docker containers.',
    keyTakeaways: ['Unified single-port full-stack architecture', 'Vite middlewares in dev, static dist in prod', 'Deployable to any Node.js cloud host'],
  },
  {
    id: 30,
    category: 'Deployment & DevOps',
    question: 'What environment variables are required to run this project?',
    answer: '1. GEMINI_API_KEY: The Google Gemini API key for AI generation.\n2. JWT_SECRET: The cryptographic secret for signing and verifying JWT tokens.\n3. PORT: The server port (defaults to 3000).\n4. NODE_ENV: Set to "development" or "production".\n5. Optional: MONGODB_URI if connecting to an external MongoDB database.',
    keyTakeaways: ['Configured in .env and documented in .env.example', 'Never commit .env to version control'],
  },
  {
    id: 31,
    category: 'Ethics & Future Scope',
    question: 'What are the ethical considerations of using AI for resume evaluation?',
    answer: 'AI resume evaluation must remain an advisory tool, not an exclusionary gatekeeper. It is critical not to claim that missing keywords indicate an incompetent candidate; our system explicitly clarifies that "Skills Not Found" simply means they were not explicitly evidenced in the text. Furthermore, bullet suggestions use placeholders ([X%]) rather than fabricating false achievements, preserving the candidate’s honesty.',
    keyTakeaways: ['Advisory career tool, not an exclusion engine', 'Transparent heuristics without bias', 'Never fabricate false metrics or roles'],
  },
  {
    id: 32,
    category: 'Ethics & Future Scope',
    question: 'What future features could be added to ResumeIQ in version 2.0?',
    answer: 'Potential enhancements include: 1) Automated LinkedIn profile optimization, 2) Tailored cover letter generation matching the resume’s tone, 3) Interactive AI mock technical interview simulations based on the candidate’s resume projects, and 4) Multi-language resume parsing for global candidates.',
    keyTakeaways: ['LinkedIn sync', 'Cover letter generator', 'AI Mock interview assistant', 'Multi-language support'],
  },
];

export const ProjectDocsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'viva'>('architecture');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const categories = ['All', ...Array.from(new Set(VIVA_QUESTIONS.map((q) => q.category)))];

  const filteredQuestions = VIVA_QUESTIONS.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keyTakeaways.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="emerald" icon={<BookOpen className="w-3.5 h-3.5" />}>
            College Project & Viva Presentation Guide
          </Badge>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          How ResumeIQ Works & Viva Preparation Hub
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Comprehensive technical documentation, architecture pipeline diagrams, and 30+ detailed viva questions with answers designed for college project presentations and technical defenses.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
            activeTab === 'architecture'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          1. System Architecture & Pipeline
        </button>
        <button
          onClick={() => setActiveTab('viva')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
            activeTab === 'viva'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          2. Viva Preparation (30+ Q&A)
        </button>
      </div>

      {/* TAB 1: ARCHITECTURE */}
      {activeTab === 'architecture' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Architecture Pipeline Visual Flow */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-600" />
                <span>End-to-End Execution Pipeline</span>
              </h2>
              <Badge variant="blue">Full-Stack Flow</Badge>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              ResumeIQ is structured around a sequential, non-blocking pipeline where every stage has isolated responsibilities and error boundaries:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-indigo-600 mb-1">STAGE 1</div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Ingestion & Validation</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Multer checks multipart stream, verifies MIME type, and enforces a strict 10MB memory safety ceiling.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-indigo-600 mb-1">STAGE 2</div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Text & Section Extraction</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  pdf-parse / mammoth unpacks buffers in-memory. Regex patterns identify Contact, Experience, Skills, and Education sections.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-indigo-600 mb-1">STAGE 3</div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">AI Intelligence Layer</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Gemini 2.5 Flash scores content, detects ATS risks, computes skill matrices, and generates Google XYZ bullet revisions.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-indigo-600 mb-1">STAGE 4</div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Persistence & Reporting</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Result is saved via the Repository pattern to database. Client renders gauges, checklists, and printable reports.
                </p>
              </div>
            </div>
          </div>

          {/* Module Deep Dives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Backend Design & Middleware</h3>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li>• <strong>Express Server:</strong> Routes divided cleanly into /api/auth, /api/resumes, /api/analysis, /api/profile.</li>
                <li>• <strong>Authentication:</strong> JWT stateless Bearer token validation with Bcrypt salted password hashing.</li>
                <li>• <strong>Multer Memory Storage:</strong> Eliminates temporary file cleanup issues and prevents file system disk clutter.</li>
                <li>• <strong>Error Isolation:</strong> Global API error middleware catches unhandled rejections and outputs clean JSON error messages.</li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">AI Prompt & Fallback Engine</h3>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li>• <strong>SDK:</strong> Official @google/genai TypeScript client running on Google’s modern API endpoints.</li>
                <li>• <strong>JSON Schema Enforcement:</strong> Response format strictly governed by responseMimeType: "application/json".</li>
                <li>• <strong>Zero Hallucination Policy:</strong> Prompt prohibits inventing work experiences; requires [X%] impact placeholders.</li>
                <li>• <strong>Heuristic Fallback:</strong> If Gemini is unreachable, an algorithmic fallback computes scores so the app never crashes.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VIVA PREP QUESTIONS & ANSWERS */}
      {activeTab === 'viva' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Controls */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions by topic (e.g. JWT, ATS, Gemini, Multer, Bcrypt)..."
                  className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600/20 text-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-500 shrink-0">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Showing {filteredQuestions.length} of {VIVA_QUESTIONS.length} curated questions. Click any card to view the comprehensive viva defense answer.
            </p>
          </div>

          {/* Questions Accordion List */}
          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const isOpen = expandedId === q.id;

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(isOpen ? null : q.id)}
                    className="w-full p-4 sm:px-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {q.id}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <Badge variant="purple" size="sm">
                            {q.category}
                          </Badge>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">{q.question}</h3>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/40 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Comprehensive Viva Answer:
                        </h4>
                        <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-slate-200">
                          {q.answer}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 mb-1.5 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Key Points to Mention in Viva:</span>
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {q.keyTakeaways.map((takeaway, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-900 border border-indigo-200/60 font-medium"
                            >
                              • {takeaway}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
