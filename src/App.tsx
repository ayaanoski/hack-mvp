import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/common/Header';
import { AnimatedBackground } from './components/common/AnimatedBackground';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { HistoryPage } from './pages/HistoryPage';
import { ChecklistPage } from './pages/ChecklistPage';

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="min-h-screen bg-dark-bg">
        <AnimatedBackground />
        <Header />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            } />
            <Route path="/checklist" element={
              <ProtectedRoute>
                <ChecklistPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;