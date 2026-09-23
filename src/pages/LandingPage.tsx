import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileSearch,
  ShieldCheck,
  Target,
  FileCode2,
  Award,
  Zap,
  BookOpen,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { Badge } from '../components/common/Badge';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemo = async () => {
    try {
      // Log in with sample demo account or navigate to register
      await login('demo@resumeiq.ai', 'demo123456');
      navigate('/dashboard');
    } catch {
      // If demo user not yet created, go to register
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-gradient-to-b from-white via-indigo-50/20 to-slate-50 border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-6 shadow-xs animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Next-Gen AI Resume & ATS Intelligence</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Turn Your Resume Into Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-emerald-600">
              Career Advantage
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Analyze your resume with AI, estimate ATS compatibility, discover missing skills, and tailor your bullet points specifically for your target role.
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            {isAuthenticated ? (
              <Link
                to="/analyze"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-base shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg transition cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-base shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze My Resume Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleQuickDemo}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white text-slate-700 font-semibold text-base border border-slate-200 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Try Quick Demo</span>
                </button>
              </>
            )}

            <Link
              to="/project-docs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-50 text-emerald-800 font-semibold text-base border border-emerald-200 hover:bg-emerald-100 transition"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Viva & Project Architecture</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>PDF & DOCX Support</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Real Text Extraction</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Estimated ATS Simulation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero Fabrication of Metrics</span>
            </div>
          </div>
        </div>

        {/* Live UI Mockup Preview */}
        <div className="max-w-5xl mx-auto mt-14 px-4 sm:px-6 relative">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="blue">Sample Evaluation</Badge>
                  <span className="text-xs text-slate-400">Alex_Carter_Software_Engineer.pdf</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Full Stack Engineer</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="emerald" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                  Ready for Review
                </Badge>
              </div>
            </div>

            {/* Score Showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6">
              <ScoreGauge score={84} label="Overall Score" sublabel="Strong technical baseline" size="sm" />
              <ScoreGauge score={88} label="Estimated ATS Score" sublabel="Clean single-column parsing" size="sm" />
              <ScoreGauge score={79} label="Job Match Score" sublabel="Good skill alignment" size="sm" />
            </div>

            {/* Snippet breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Top Strengths Identified
                </h4>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li>• High proficiency in TypeScript, React, and Node.js microservices.</li>
                  <li>• Clear chronological experience layout with readable contact info.</li>
                  <li>• Well-defined project repository links and architecture notes.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  Actionable Bullet Improvement
                </h4>
                <div className="text-xs space-y-2">
                  <p className="text-slate-500 line-through">"Worked on website using React and Node.js."</p>
                  <p className="text-slate-800 font-medium bg-white p-2 rounded-lg border border-amber-200">
                    "Architected and deployed a responsive React web application with Node.js APIs, improving latency by [X%]."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Features</h2>
            <p className="text-3xl font-extrabold tracking-tight text-slate-900">
              Built for Modern Technical Recruitment
            </p>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Engineered to help students, developers, and professionals craft verifiable, impact-focused resumes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-300 hover:shadow-md transition">
              <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Resume Analysis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Evaluates summary, technical skills, experience depth, projects, and educational hierarchy for your target role.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-300 hover:shadow-md transition">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <FileSearch className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Estimated ATS Score</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Simulates machine parsers to detect table risks, missing headers, irregular bullets, and non-standard fonts.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-300 hover:shadow-md transition">
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Job Description Matcher</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Paste any job description to instantly uncover matching keywords and discover important missing terms.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-300 hover:shadow-md transition">
              <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Skill Gap Detection</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Categorizes skills into Strong, Developing, and Not Found in Resume, avoiding misleading assumptions.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-300 hover:shadow-md transition">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <FileCode2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Bullet Point Rewriter</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Suggests Google XYZ formula upgrades (Action + Context + Impact) without inventing fabricated numbers.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-300 hover:shadow-md transition">
              <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Privacy & Full Control</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your data belongs to you. Easily view, download, or permanently delete uploaded resumes and analysis records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Workflow</h2>
            <p className="text-3xl font-extrabold tracking-tight text-slate-900">
              Simple 4-Step Analysis Flow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Upload Resume',
                desc: 'Upload your resume in PDF or DOCX format (up to 10MB). Text is parsed safely in-memory.',
              },
              {
                step: '02',
                title: 'Choose Target Role',
                desc: 'Specify your target role (e.g. Full Stack Engineer, Data Scientist, DevOps) to guide context.',
              },
              {
                step: '03',
                title: 'Add Job Description',
                desc: 'Optionally paste a real job posting description to compare keyword coverage and requirements.',
              },
              {
                step: '04',
                title: 'Get AI Analysis',
                desc: 'Receive comprehensive scores, ATS parsing risks, bullet optimizations, and action checklists.',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="text-2xl font-extrabold text-indigo-600/30 mb-3">{item.step}</div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATS Transparency & Viva Guide Banner */}
      <section id="ats-guide" className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Badge variant="purple" size="md" icon={<BookOpen className="w-4 h-4" />}>
            Academic & Industry Standard Notice
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-4 mb-4">
            Understanding the Estimated ATS Compatibility Score
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            ATS software varies across vendors (Workday, Taleo, Greenhouse, Lever). ResumeIQ's score is an <strong>Estimated ATS Compatibility Score</strong> based on universal algorithmic heuristics: clear ASCII section headings, standard bullet structures, linear text extraction, and job keyword frequency.
          </p>
          <Link
            to="/project-docs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <span>Read full project architecture and viva preparation notes</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">ResumeIQ</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <Link to="/project-docs" className="hover:text-white transition">Project Architecture</Link>
              <Link to="/project-docs" className="hover:text-white transition">Viva Prep (30+ Q&A)</Link>
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} ResumeIQ. AI-Powered Resume Analyzer & Career Assistant.</p>
            <p>Designed for academic project defense & production deployment.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
