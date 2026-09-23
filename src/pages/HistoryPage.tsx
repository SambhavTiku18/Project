import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { AnalysisSummaryItem } from '../types';
import {
  Clock,
  Search,
  FileText,
  Eye,
  Trash2,
  PlusCircle,
  TrendingUp,
  Award,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const HistoryPage: React.FC = () => {
  const [analyses, setAnalyses] = useState<AnalysisSummaryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const res = await api.analysis.getAll();
      setAnalyses(res.analyses || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await api.analysis.delete(deleteTargetId);
      setAnalyses((prev) => prev.filter((a) => a.id !== deleteTargetId));
      setDeleteTargetId(null);
    } catch (err: any) {
      alert('Failed to delete analysis: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = analyses.filter((a) =>
    a.targetRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.resumeFilename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner fullPage text="Retrieving analysis history..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Analysis History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review past resume evaluations, track score improvements, and export reports.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-200 transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Analysis</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by target role or resume filename..."
          className="w-full text-sm bg-transparent border-none focus:outline-none placeholder:text-slate-400 text-slate-800"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* History Table / Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {searchQuery ? 'No matching records found' : 'No analyses generated yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            {searchQuery ? 'Try adjusting your search query' : 'Upload your resume to receive full ATS analysis and career scoring.'}
          </p>
          {!searchQuery && (
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Start First Analysis</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Target Role & File</th>
                  <th className="px-6 py-4">Overall Score</th>
                  <th className="px-6 py-4">Estimated ATS</th>
                  <th className="px-6 py-4">Job Match</th>
                  <th className="px-6 py-4">Analysis Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate max-w-[240px]">
                            {item.targetRole}
                          </p>
                          <p className="text-xs text-slate-400 truncate max-w-[240px]">
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

                    <td className="px-6 py-4 font-semibold text-slate-700 text-xs">
                      {item.jobMatchScore ? `${item.jobMatchScore}%` : 'Standard'}
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
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Report</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
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
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        title="Delete Analysis Record"
        footer={
          <>
            <button
              onClick={() => setDeleteTargetId(null)}
              className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-60"
            >
              {isDeleting ? 'Deleting...' : 'Delete Record'}
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete this analysis report? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};
