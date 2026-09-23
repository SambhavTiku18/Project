import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AnalysisSummaryItem, ResumeItem } from '../types';
import {
  Sparkles,
  FileText,
  TrendingUp,
  Clock,
  ArrowRight,
  Eye,
  Trash2,
  PlusCircle,
  Award,
  CheckCircle2,
  Files,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const DashboardPage: React.FC = () => {
  const { user, stats, refreshUser } = useAuth();
  const [analyses, setAnalyses] = useState<AnalysisSummaryItem[]>([]);
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [analysesRes, resumesRes] = await Promise.all([
        api.analysis.getAll(),
        api.resumes.getAll(),
      ]);
      setAnalyses(analysesRes.analyses || []);
      setResumes(resumesRes.resumes || []);
      await refreshUser();
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAnalysis = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis record?')) {
      return;
    }

    setDeletingId(id);
    try {
      await api.analysis.delete(id);
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      await refreshUser();
    } catch (err) {
      alert('Failed to delete analysis');
    } finally {
      setDeletingId(null);
    }
  };

  const avgOverall = stats?.averageScore || (analyses.length > 0
    ? Math.round(analyses.reduce((sum, a) => sum + (a.overallScore || 0), 0) / analyses.length)
    : 0);

  const avgAts = stats?.averageAtsScore || (analyses.length > 0
    ? Math.round(analyses.reduce((sum, a) => sum + (a.atsScore || 0), 0) / analyses.length)
    : 0);

  if (isLoading) {
    return <LoadingSpinner fullPage text="Gathering your analytics..." />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Professional'}!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your resume optimization, ATS match rates, and career readiness.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-200 transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Analyze New Resume</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Analyses */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Analyses</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{analyses.length}</h3>
            <p className="text-xs text-slate-500 mt-1">Across all uploaded drafts</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Avg Overall Score */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Overall Score</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {avgOverall > 0 ? `${avgOverall}/100` : '—'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {avgOverall >= 80 ? 'Competitive tier' : avgOverall > 0 ? 'Good potential' : 'Pending analysis'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Avg ATS Score */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Estimated ATS</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {avgAts > 0 ? `${avgAts}/100` : '—'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Parser compatibility index</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Saved Resumes */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Saved Resumes</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{resumes.length}</h3>
            <p className="text-xs text-slate-500 mt-1">PDF and DOCX files</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Files className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Promo Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-emerald-600 text-white shadow-md relative overflow-hidden">
        <div className="max-w-xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/20 text-xs font-semibold text-white mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Target Role Optimization</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Applying for a specific vacancy?
          </h2>
          <p className="mt-2 text-indigo-100 text-sm leading-relaxed">
            Upload your resume and paste the job description to run an automated keyword coverage check and discover exact missing skill qualifications.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-900 hover:bg-indigo-50 font-semibold text-sm rounded-xl transition shadow-xs cursor-pointer"
            >
              <span>Launch Analyzer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/project-docs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-800/60 hover:bg-indigo-800 text-white text-sm font-medium rounded-xl transition"
            >
              <span>Viva & Architecture Notes</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Analyses Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 sm:px-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Recent Resume Analyses</h2>
            <p className="text-xs text-slate-500">Your latest evaluations and estimated ATS scores</p>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {analyses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No analyses generated yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
              Upload your first resume in PDF or DOCX format to receive an AI-powered score and ATS analysis.
            </p>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium text-xs rounded-xl hover:bg-indigo-700 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Analyze Your Resume</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Resume & Target Role</th>
                  <th className="px-6 py-3.5">Overall Score</th>
                  <th className="px-6 py-3.5">Estimated ATS</th>
                  <th className="px-6 py-3.5">Job Match</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analyses.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate max-w-[220px]">
                            {item.targetRole}
                          </p>
                          <p className="text-xs text-slate-400 truncate max-w-[220px]">
                            {item.resumeFilename}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <Badge
                        variant={item.overallScore >= 80 ? 'emerald' : item.overallScore >= 65 ? 'amber' : 'rose'}
                        size="md"
                      >
                        {item.overallScore}/100
                      </Badge>
                    </td>

                    <td className="px-6 py-4">
                      <Badge
                        variant={item.atsScore >= 80 ? 'emerald' : item.atsScore >= 65 ? 'blue' : 'rose'}
                        size="md"
                      >
                        {item.atsScore}/100
                      </Badge>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-slate-700">
                        {item.jobMatchScore ? `${item.jobMatchScore}%` : 'Standard'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/analysis/${item.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium text-xs transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                        <button
                          onClick={(e) => handleDeleteAnalysis(item.id, e)}
                          disabled={deletingId === item.id}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer disabled:opacity-50"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ATS Tips & Quality Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Key ATS Formatting Best Practices</h3>
          </div>
          <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <li>• Use standard section headings (e.g. "Work Experience", "Education", "Skills").</li>
            <li>• Prefer a single-column or clean two-column layout over embedded nested tables.</li>
            <li>• Stick to standard fonts (Inter, Arial, Helvetica, Calibri) for clean optical extraction.</li>
            <li>• Avoid placing critical contact info inside document headers/footers.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Bullet Point Impact Framework</h3>
          </div>
          <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <li>• <strong>Action Verb:</strong> Lead with strong verbs (Engineered, Architected, Spearheaded).</li>
            <li>• <strong>Context:</strong> Clarify the business domain, architecture, or tools employed.</li>
            <li>• <strong>Quantification:</strong> Add real metrics (e.g., latency, percentage throughput, users).</li>
            <li>• <strong>Outcome:</strong> Demonstrate the final result rather than simply reciting daily tasks.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
