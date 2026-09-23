import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AnalysisRecord } from '../types';
import {
  Sparkles,
  ArrowLeft,
  Printer,
  Share2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Target,
  FileSearch,
  Check,
  TrendingUp,
  Cpu,
  Layers,
  Wand2,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AnalysisResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [record, setRecord] = useState<AnalysisRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (id) {
      loadAnalysis(id);
    }
  }, [id]);

  const loadAnalysis = async (analysisId: string) => {
    setIsLoading(true);
    try {
      const res = await api.analysis.getById(analysisId);
      setRecord(res.analysis);
    } catch (err: any) {
      setError(err.message || 'Failed to load analysis record.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async () => {
    if (!record || !window.confirm('Are you sure you want to delete this analysis report?')) return;
    try {
      await api.analysis.delete(record.id);
      navigate('/history');
    } catch {
      alert('Failed to delete analysis');
    }
  };

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  if (isLoading) {
    return <LoadingSpinner fullPage text="Retrieving detailed report..." />;
  }

  if (error || !record) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-xs max-w-lg mx-auto">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Analysis Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">{error || 'This analysis could not be located.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  const { analysisResult } = record;

  return (
    <div className="space-y-8 print:p-0">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 no-print">
            <Link
              to="/dashboard"
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <span className="text-slate-300">•</span>
            <Badge variant="blue">Career Intelligence Report</Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>{record.targetRole}</span>
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <strong>Resume:</strong> {record.resumeFilename}
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <strong>Engine:</strong> {analysisResult.modelUsed || 'AI Specialist'}
            </span>
            <span>
              <strong>Date:</strong>{' '}
              {new Date(record.createdAt).toLocaleDateString(undefined, {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 no-print shrink-0">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Export / Print PDF</span>
          </button>

          <button
            onClick={handleDelete}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
            title="Delete this analysis"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Score Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScoreGauge
          score={record.overallScore}
          label="Overall Resume Score"
          sublabel="Comprehensive evaluation of content, clarity, impact, and qualifications"
          size="md"
        />
        <ScoreGauge
          score={record.atsScore}
          label="Estimated ATS Score"
          sublabel="Simulated machine readability, section headings, and layout compliance"
          size="md"
        />
        <ScoreGauge
          score={record.jobMatchScore || analysisResult.jobMatch.score}
          label="Target Job Match"
          sublabel={record.jobDescription ? 'Keyword & skill alignment with provided JD' : 'Alignment with industry benchmark for target role'}
          size="md"
        />
      </div>

      {/* Executive Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Executive Evaluation Summary</span>
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/60">
          {analysisResult.summary}
        </p>

        {/* Strengths & Weaknesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Top Strengths */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Top Strengths</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {analysisResult.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Areas to Address */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2.5 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Key Areas Needing Improvement</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {analysisResult.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Skill Gap Analysis Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Skill Gap & Competency Matrix</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Distinguishing verified competencies from expected skills not evidenced in your document.
            </p>
          </div>
          <div className="text-[11px] text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
            * "Not Found" does not assume you lack the skill
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Strong Skills */}
          <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Strong Skills Evidenced
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {analysisResult.skills.strong.length}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700">Supported with clear context or project evidence.</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {analysisResult.skills.strong.length > 0 ? (
                analysisResult.skills.strong.map((skill, idx) => (
                  <Badge key={idx} variant="emerald" size="sm">
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">None strongly detected</span>
              )}
            </div>
          </div>

          {/* Developing / Mentioned Skills */}
          <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Developing / Needs Context
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {analysisResult.skills.developing.length}
              </span>
            </div>
            <p className="text-[11px] text-amber-700">Mentioned in skills list but lacking bullet proof.</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {analysisResult.skills.developing.length > 0 ? (
                analysisResult.skills.developing.map((skill, idx) => (
                  <Badge key={idx} variant="amber" size="sm">
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No developing skills flagged</span>
              )}
            </div>
          </div>

          {/* Skills Not Found in Resume */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Not Evidenced in Resume
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {analysisResult.skills.notFound.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Commonly expected for {record.targetRole}. Add if you have experience.</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {analysisResult.skills.notFound.length > 0 ? (
                analysisResult.skills.notFound.map((skill, idx) => (
                  <Badge key={idx} variant="slate" size="sm">
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">All benchmark skills covered!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Target Job Keyword Analysis */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-600" />
          <span>Job Description Matching & Keywords</span>
        </h2>

        {analysisResult.jobMatch.advice && (
          <p className="text-xs text-indigo-900 bg-indigo-50/70 p-3 rounded-xl border border-indigo-100">
            <strong>Recruiter Advice:</strong> {analysisResult.jobMatch.advice}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Matching Keywords ({analysisResult.jobMatch.matchingKeywords.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {analysisResult.jobMatch.matchingKeywords.map((kw, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-red-50/40 border border-red-200/70">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-800 mb-2">
              Missing High-Value Keywords ({analysisResult.jobMatch.missingKeywords.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {analysisResult.jobMatch.missingKeywords.map((kw, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-white border border-red-200 text-red-700 font-medium">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bullet Point Optimizer: Google XYZ Framework */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-indigo-600" />
              <span>Bullet Point Optimizer (Before vs. After)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Refined using the Google XYZ framework (Accomplished [X], measured by [Y], by doing [Z]).
            </p>
          </div>
          <Badge variant="purple" size="sm">No Invented Metrics</Badge>
        </div>

        <div className="space-y-4">
          {analysisResult.bulletSuggestions.length > 0 ? (
            analysisResult.bulletSuggestions.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500 uppercase tracking-wider">
                    Suggestion #{idx + 1}
                  </span>
                  <Badge variant="blue" size="sm">
                    {item.category.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase mb-1">Original Phrasing</p>
                    <p className="text-xs text-slate-600 italic">"{item.original}"</p>
                  </div>

                  <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200/80">
                    <p className="text-[11px] font-semibold text-emerald-800 uppercase mb-1">
                      Recommended Revision
                    </p>
                    <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                      "{item.improved}"
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                  <strong>Why this works better:</strong> {item.reason}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No specific bullet point revisions required.</p>
          )}
        </div>
      </div>

      {/* Section-by-Section Health Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-600" />
          <span>Resume Section Scores & Feedback</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysisResult.sections.map((sec, idx) => {
            let color = 'bg-emerald-500';
            if (sec.score < 60) color = 'bg-red-500';
            else if (sec.score < 75) color = 'bg-amber-500';
            else if (sec.score < 88) color = 'bg-blue-500';

            return (
              <div key={idx} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">{sec.name}</span>
                  <span className="text-xs font-bold text-slate-700">{sec.score}/100</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full`} style={{ width: `${sec.score}%` }} />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {sec.feedback}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Categorized Recommendations */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <span>Categorized Improvement Recommendations</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Critical Issues */}
          {analysisResult.recommendations.critical?.length > 0 && (
            <div className="p-4 rounded-xl bg-red-50/50 border border-red-200 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-800 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Critical Fixes</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-red-900">
                {analysisResult.recommendations.critical.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Content Improvements */}
          {analysisResult.recommendations.content?.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Content & Impact
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {analysisResult.recommendations.content.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ATS Improvements */}
          {analysisResult.recommendations.ats?.length > 0 && (
            <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-200 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800">
                ATS Machine Readability
              </h3>
              <ul className="space-y-1.5 text-xs text-blue-900">
                {analysisResult.recommendations.ats.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Formatting Improvements */}
          {analysisResult.recommendations.formatting?.length > 0 && (
            <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-200 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-800">
                Layout & Formatting
              </h3>
              <ul className="space-y-1.5 text-xs text-purple-900">
                {analysisResult.recommendations.formatting.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Actionable Next Steps Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 no-print">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Priority Action Plan Checklist</span>
        </h2>
        <p className="text-xs text-slate-500">
          Click to mark items as completed as you update your resume draft:
        </p>

        <div className="space-y-2">
          {analysisResult.nextSteps.map((step, idx) => {
            const isDone = completedSteps[idx] || false;
            return (
              <div
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  isDone
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-400 line-through'
                    : 'bg-slate-50 hover:bg-indigo-50/50 border-slate-200/80 text-slate-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className="text-xs font-medium leading-relaxed">{step}</span>
              </div>
            );
          })}
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            <span>Re-analyze Updated Resume</span>
          </Link>

          <Link
            to="/project-docs"
            className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>View Technical Viva Prep</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
