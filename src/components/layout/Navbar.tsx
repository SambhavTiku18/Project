import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  Sparkles,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Clock,
  BookOpen,
  LayoutDashboard,
  Files
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  Resume<span className="text-indigo-600">IQ</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    AI
                  </span>
                </span>
                <span className="text-[10px] text-slate-500 -mt-1 hidden sm:inline">
                  Smart Resume & ATS Analyzer
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/dashboard')
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/analyze"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/analyze')
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Analyze Resume
                  </Link>
                  <Link
                    to="/resumes"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/resumes')
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    My Resumes
                  </Link>
                  <Link
                    to="/history"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/history')
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    History
                  </Link>
                </>
              ) : (
                <>
                  <a
                    href="/#features"
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="/#how-it-works"
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    How It Works
                  </a>
                  <a
                    href="/#ats-guide"
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    ATS Guide
                  </a>
                </>
              )}

              <Link
                to="/project-docs"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  isActive('/project-docs')
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Viva & Project Docs
              </Link>
            </div>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/analyze"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm hover:shadow-md cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>New Analysis</span>
                </Link>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-medium text-slate-800 max-w-[120px] truncate">
                      {user?.name}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-800 truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        Profile Settings
                      </Link>
                      <Link
                        to="/history"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Clock className="w-4 h-4 text-slate-400" />
                        Analysis History
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm hover:shadow"
                >
                  <Sparkles className="w-4 h-4" />
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          {isAuthenticated ? (
            <>
              <div className="pb-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                Dashboard
              </Link>
              <Link
                to="/analyze"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50"
              >
                <PlusCircle className="w-4 h-4 text-indigo-600" />
                Analyze Resume
              </Link>
              <Link
                to="/resumes"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Files className="w-4 h-4 text-slate-400" />
                My Resumes
              </Link>
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Clock className="w-4 h-4 text-slate-400" />
                Analysis History
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                Profile Settings
              </Link>
              <Link
                to="/project-docs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-emerald-700 bg-emerald-50"
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Viva & Project Docs
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <a
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Features
              </a>
              <a
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                How It Works
              </a>
              <Link
                to="/project-docs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-emerald-700 bg-emerald-50"
              >
                Viva & Project Docs
              </Link>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium border border-slate-200 rounded-lg text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg"
                >
                  Get Started Free
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
