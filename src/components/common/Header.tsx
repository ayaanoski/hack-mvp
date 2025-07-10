import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, History, CheckSquare } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="bg-dark-bg/90 border-b border-dark-border fixed w-full z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-12 sm:h-14 md:h-16">
          <Link to="/" className="flex items-center space-x-2">
  <img
    src="/public/logo.png"
    alt="HackMVP Logo"
    className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 animate-pulse"
  />
  <span className="text-sm sm:text-lg md:text-xl font-bold text-white">
    HackMVP
  </span>
</Link>

          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            <Link
              to="/checklist"
              className="flex items-center space-x-1 text-gray-300 hover:text-neon-green transition-colors"
            >
              <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              <span className="text-xs sm:text-sm md:text-base hidden sm:inline">Checklist</span>
            </Link>
            <Link
              to="/history"
              className="flex items-center space-x-1 text-gray-300 hover:text-neon-blue transition-colors"
            >
              <History className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              <span className="text-xs sm:text-sm md:text-base hidden sm:inline">History</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};