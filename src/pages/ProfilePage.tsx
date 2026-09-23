import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User as UserIcon,
  Mail,
  Briefcase,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingUp,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const ProfilePage: React.FC = () => {
  const { user, stats, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || '');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await updateProfile({
        name: name.trim(),
        targetRole: targetRole.trim(),
      });
      setSuccessMessage('Profile settings saved successfully!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await api.profile.deleteAccount();
      await logout();
      navigate('/');
    } catch (err: any) {
      alert('Failed to delete account: ' + err.message);
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Account & Profile Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal information, career target role, and data preferences.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-800">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* User Stats Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          Activity & Performance Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-xs text-slate-500">Total Analyses</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalAnalyses || 0}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-xs text-slate-500">Saved Resumes</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalResumes || 0}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-xs text-slate-500">Average Score</p>
            <p className="text-2xl font-extrabold text-indigo-600 mt-1">
              {stats?.averageScore ? `${stats.averageScore}/100` : '—'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-xs text-slate-500">Average ATS</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">
              {stats?.averageAtsScore ? `${stats.averageAtsScore}/100` : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleUpdate} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <h2 className="text-base font-bold text-slate-900">Personal & Career Information</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Primary email address is used for authentication and cannot be changed.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Career Role
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              This role will automatically prefill as your default target when analyzing new resumes.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-xs transition cursor-pointer disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="bg-red-50/50 rounded-2xl border border-red-200 p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-red-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>Danger Zone & Privacy Compliance</span>
          </h3>
          <p className="text-xs text-red-700 mt-1 leading-relaxed">
            ResumeIQ allows users to exercise full privacy rights. You can permanently erase your account, all uploaded documents, and every analysis record from our database.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDeleteAccountModal(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs transition cursor-pointer"
        >
          Delete Account and Wipe All Data
        </button>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={deleteAccountModal}
        onClose={() => setDeleteAccountModal(false)}
        title="Permanently Delete Account"
        footer={
          <>
            <button
              onClick={() => setDeleteAccountModal(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-60"
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          This will permanently remove your account profile, all stored resumes, and your complete analysis history. <strong>This action cannot be undone.</strong>
        </p>
      </Modal>
    </div>
  );
};
