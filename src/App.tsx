import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/common/Header';
import { AnimatedBackground } from './components/common/AnimatedBackground';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { HistoryPage } from './pages/HistoryPage';
import { ChecklistPage } from './pages/ChecklistPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-bg">
        <AnimatedBackground />
        <Header />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/checklist" element={<ChecklistPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;