import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ResumeItem } from '../types';
import {
  UploadCloud,
  FileText,
  X,
  Sparkles,
  AlertCircle,
  Briefcase,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  RefreshCw,
  Search,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Badge } from '../components/common/Badge';

const POPULAR_ROLES = [
  'Full Stack Software Engineer',
  'Frontend Developer (React/Next.js)',
  'Backend Developer (Node.js/Python)',
  'DevOps & Cloud Engineer',
  'Data Scientist & ML Specialist',
  'Mobile Developer (React Native/iOS)',
  'Product Manager',
  'Cybersecurity Analyst',
];

const SAMPLE_JOB_DESCRIPTION = `Job Title: Full Stack Software Engineer
Responsibilities:
- Build, optimize, and maintain web applications using React, TypeScript, and Node.js.
- Architect scalable RESTful and GraphQL APIs backed by PostgreSQL and MongoDB.
- Implement CI/CD automation pipelines using GitHub Actions and Docker.
- Collaborate with product and design teams in an Agile sprint environment.
- Conduct code reviews, unit testing (Jest/Vitest), and performance tuning.

Requirements:
- 1+ years of experience with JavaScript/TypeScript, React, and Node.js.
- Familiarity with cloud platforms (AWS, GCP) and containerization (Docker).
- Strong understanding of database schema design and asynchronous programming.
- Excellent communication skills and problem-solving mindset.`;

export const AnalyzePage: React.FC = () => {
  const navigate = useNavigate();

  // Mode: 'new_file' or 'existing_resume'
  const [sourceMode, setSourceMode] = useState<'new_file' | 'existing_resume'>('new_file');
  const [savedResumes, setSavedResumes] = useState<ResumeItem[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');

  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Processing state & step tracker
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const processingSteps = [
    { title: 'Reading Document', desc: 'Validating file format, headers, and security checks' },
    { title: 'Extracting Content', desc: 'Parsing ASCII text, structure, and detected sections' },
    { title: 'Scanning Skills & Keywords', desc: 'Detecting competencies against target role' },
    { title: 'Simulating ATS Parser', desc: 'Checking layout, headers, and machine readability' },
    { title: 'AI Recommendation Engine', desc: 'Formulating bullet optimizations and score metrics' },
  ];

  useEffect(() => {
    // Load previously uploaded resumes
    api.resumes.getAll().then((res) => {
      setSavedResumes(res.resumes || []);
      if (res.resumes && res.resumes.length > 0) {
        setSelectedResumeId(res.resumes[0].id);
      }
    }).catch(() => {});
  }, []);

  const handleFileChange = (selectedFile: File | undefined | null) => {
    if (!selectedFile) return;

    setError(null);
    const validExtensions = ['.pdf', '.docx', '.doc'];
    const hasValidExt = validExtensions.some((ext) => selectedFile.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setError('Invalid file type. Please upload a PDF or DOCX file.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit. Please upload a smaller document.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (sourceMode === 'new_file' && !file) {
      setError('Please select or drag a PDF or DOCX resume to analyze.');
      return;
    }

    if (sourceMode === 'existing_resume' && !selectedResumeId) {
      setError('Please select an existing resume from your account.');
      return;
    }

    if (!targetRole.trim()) {
      setError('Please enter or select a target job role.');
      return;
    }

    setIsProcessing(true);
    setCurrentStepIndex(0);

    // Dynamic processing step simulator
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < processingSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const res = await api.analysis.run({
        resumeFile: sourceMode === 'new_file' ? file! : undefined,
        resumeId: sourceMode === 'existing_resume' ? selectedResumeId : undefined,
        targetRole: targetRole.trim(),
        jobDescription: jobDescription.trim() || undefined,
      });

      clearInterval(stepInterval);
      setCurrentStepIndex(processingSteps.length - 1);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Confetti fallback
      }

      // Small delay to let user see final stage completed
      setTimeout(() => {
        navigate(`/analysis/${res.analysis.id}`);
      }, 600);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsProcessing(false);
      setError(err.message || 'Analysis failed. Please ensure the resume has selectable text.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="blue" icon={<Sparkles className="w-3.5 h-3.5" />}>
            Interactive Resume Intelligence
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Analyze Your Resume
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload your resume, select your target role, and let ResumeIQ score your ATS compatibility and content.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-sm text-red-700 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-red-900">Document Processing Notice</h4>
            <p className="mt-0.5 text-xs text-red-700 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Processing Screen State */}
      {isProcessing ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-8 sm:p-12 text-center space-y-8 animate-in fade-in">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-pulse" />
            <div className="w-16 h-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin flex items-center justify-center" />
            <Sparkles className="w-7 h-7 text-indigo-600 absolute" />
          </div>

          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold text-slate-900">
              {processingSteps[currentStepIndex].title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {processingSteps[currentStepIndex].desc}
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="max-w-lg mx-auto space-y-3">
            {processingSteps.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-indigo-50/80 border border-indigo-200/80 shadow-xs'
                      : isCompleted
                      ? 'text-slate-700 bg-slate-50'
                      : 'text-slate-400 opacity-60'
                  }`}
                >
                  <div className="shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300" />
                    )}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className={`text-xs font-semibold ${isCurrent ? 'text-indigo-900' : 'text-slate-800'}`}>
                      {step.title}
                    </p>
                  </div>
                  {isCompleted && <span className="text-[10px] font-semibold text-emerald-600">Done</span>}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Standard Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Resume Source */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span>Select Resume Document</span>
              </h2>

              {savedResumes.length > 0 && (
                <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setSourceMode('new_file')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      sourceMode === 'new_file' ? 'bg-white text-indigo-700 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Upload New File
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceMode('existing_resume')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      sourceMode === 'existing_resume' ? 'bg-white text-indigo-700 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Use Saved Resume ({savedResumes.length})
                  </button>
                </div>
              )}
            </div>

            {sourceMode === 'new_file' ? (
              <div>
                {/* Drag and Drop Box */}
                {!file ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-indigo-600 bg-indigo-50/50 scale-[0.99]'
                        : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.doc"
                      className="hidden"
                      onChange={(e) => handleFileChange(e.target.files?.[0])}
                    />
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      Click to upload or drag & drop your resume
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Supports PDF and DOCX files up to 10 MB
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" /> PDF Selectable
                      </span>
                      <span className="flex items-center gap-1">
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" /> Word DOCX
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Uploaded File Selected Card */
                  <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.name.endsWith('.pdf') ? 'PDF Document' : 'Word Document'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Existing Saved Resumes dropdown */
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Select a previously parsed resume:
                </label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition"
                >
                  {savedResumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.originalFilename} ({r.wordCount} words • {new Date(r.createdAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Step 2: Target Job Role */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Target Job Role</span>
            </h2>

            <div>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full Stack Software Engineer"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition"
                />
              </div>

              {/* Suggestions */}
              <div className="mt-3">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Popular Role Suggestions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_ROLES.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setTargetRole(role)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                        targetRole === role
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 hover:bg-indigo-50 border-slate-200/80 text-slate-600 hover:text-indigo-700'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Optional Job Description */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <span>Job Description (Optional, Recommended)</span>
              </h2>

              <button
                type="button"
                onClick={() => {
                  setJobDescription(SAMPLE_JOB_DESCRIPTION);
                  if (!targetRole) setTargetRole('Full Stack Software Engineer');
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Load Sample JD</span>
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Pasting the actual job description lets ResumeIQ calculate a precise <strong>Job Match Score</strong> and identify high-value keywords missing from your resume.
            </p>

            <textarea
              rows={5}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job posting duties, requirements, and tech stack here..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl text-base shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate Comprehensive AI Analysis</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      )}
    </div>
  );
};
