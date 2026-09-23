import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ResumeItem } from '../types';
import {
  Files,
  FileText,
  Trash2,
  Sparkles,
  UploadCloud,
  Eye,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ResumesPage: React.FC = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingResume, setViewingResume] = useState<{ originalFilename: string; extractedText: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    setIsLoading(true);
    try {
      const res = await api.resumes.getAll();
      setResumes(res.resumes || []);
    } catch (err) {
      console.error('Failed to load resumes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewText = async (id: string) => {
    try {
      const res = await api.resumes.getById(id);
      setViewingResume({
        originalFilename: res.resume.originalFilename,
        extractedText: res.resume.extractedText,
      });
    } catch (err: any) {
      alert('Failed to load resume text: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await api.resumes.delete(deleteConfirmId);
      setResumes((prev) => prev.filter((r) => r.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (err: any) {
      alert('Failed to delete resume: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullPage text="Loading your saved documents..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Uploaded Resumes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your parsed resume drafts and start targeted role evaluations.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-200 transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload New Resume</span>
        </Link>
      </div>

      {resumes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Files className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No resumes uploaded yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Upload your first resume in PDF or DOCX format to begin extracting sections, scanning skills, and improving your ATS score.
          </p>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 transition"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <Badge variant={resume.fileType === 'pdf' ? 'blue' : 'purple'}>
                    {resume.fileType.toUpperCase()}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3 truncate" title={resume.originalFilename}>
                  {resume.originalFilename}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                  <p>
                    <strong>Size:</strong> {(resume.fileSize / 1024).toFixed(1)} KB • {resume.wordCount} words
                  </p>
                  {resume.pageCount && <p><strong>Pages:</strong> {resume.pageCount} page(s)</p>}
                  <p>
                    <strong>Uploaded:</strong>{' '}
                    {new Date(resume.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-indigo-600 font-medium">
                    <strong>Analyses Generated:</strong> {resume.analysisCount || 0}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleViewText(resume.id)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer p-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Text</span>
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    to="/analyze"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Analyze</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(resume.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Delete resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Extracted Text Modal */}
      <Modal
        isOpen={Boolean(viewingResume)}
        onClose={() => setViewingResume(null)}
        title={viewingResume?.originalFilename || 'Extracted Text Preview'}
        maxWidth="2xl"
        footer={
          <button
            onClick={() => setViewingResume(null)}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            This is the raw, clean ASCII text extracted by the server parser from your document:
          </p>
          <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono max-h-[50vh] overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {viewingResume?.extractedText}
          </pre>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Resume Deletion"
        footer={
          <>
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-60"
            >
              {isDeleting ? 'Deleting...' : 'Permanently Delete'}
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete this resume? Deleting this resume will also remove its associated analysis records. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};
