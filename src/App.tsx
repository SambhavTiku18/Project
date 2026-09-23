import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { AnalysisResultPage } from './pages/AnalysisResultPage';
import { ResumesPage } from './pages/ResumesPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProjectDocsPage } from './pages/ProjectDocsPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route
            path="/"
            element={
              <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <LandingPage />
              </div>
            }
          />

          {/* Public Authentication Pages */}
          <Route
            path="/login"
            element={
              <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <LoginPage />
              </div>
            }
          />
          <Route
            path="/register"
            element={
              <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <RegisterPage />
              </div>
            }
          />

          {/* Project Documentation & Viva Hub (Publicly Accessible) */}
          <Route
            path="/project-docs"
            element={
              <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                  <ProjectDocsPage />
                </main>
              </div>
            }
          />

          {/* Protected Application Workspace */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/analysis/:id" element={<AnalysisResultPage />} />
            <Route path="/resumes" element={<ResumesPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
