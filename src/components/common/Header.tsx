import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, History, CheckSquare, LogOut, User, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-dark-bg/90 border-b border-dark-border fixed w-full z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-12 sm:h-14 md:h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img
                src="/logo.png"
                alt=" Logo"
                className="w-9 h-9 sm:w-12 sm:h-12"
              />
            <span className="text-sm sm:text-lg md:text-xl font-bold text-white">HackMVP</span>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            {currentUser ? (
              <>
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
                
                {/* User Menu */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="flex items-center space-x-1 text-gray-300">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    <span className="text-xs sm:text-sm hidden md:inline">
                      {currentUser.displayName || currentUser.email}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    <span className="text-xs sm:text-sm hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 text-gray-300 hover:text-neon-green transition-colors bg-transparent border border-gray-600 hover:border-neon-green px-2 py-1 sm:px-3 sm:py-2 rounded-md"
              >
                <LogIn className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                <span className="text-xs sm:text-sm md:text-base">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
