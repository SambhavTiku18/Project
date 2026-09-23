import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Sparkles,
  Files,
  Clock,
  User,
  LogOut,
  BookOpen,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, stats, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Analyze Resume', path: '/analyze', icon: Sparkles, highlight: true },
    { label: 'My Resumes', path: '/resumes', icon: Files, badge: stats?.totalResumes },
    { label: 'Analysis History', path: '/history', icon: Clock, badge: stats?.totalAnalyses },
    { label: 'Profile Settings', path: '/profile', icon: User },
    { label: 'Viva & Project Guide', path: '/project-docs', icon: BookOpen },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] hidden md:flex no-print">
      <div className="p-4 space-y-6">
        {/* User Card */}
        <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.targetRole || 'Target role not set'}</p>
          </div>
        </div>

        {/* Navigation links */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : item.highlight
                      ? 'text-indigo-600 bg-indigo-50/70 hover:bg-indigo-100/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/60 text-slate-700">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer info & logout */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
          <div className="flex items-center gap-2 text-indigo-700 font-semibold text-xs mb-1">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>ATS Parser Ready</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Upload PDF or DOCX to verify machine readability and keyword density.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
