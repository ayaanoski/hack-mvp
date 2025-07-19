import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, History, CheckSquare, LogOut, User, LogIn, ChevronDown, Code, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false); // Close dropdown on logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // All navigation links are now included.
  const navLinks = [
    { to: '/dashboard', icon: Zap, label: 'Dashboard' },
    { to: '/generators', icon: Code, label: 'Generators' },
    { to: '/checklist', icon: CheckSquare, label: 'Checklist' },
    { to: '/history', icon: History, label: 'History' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/logo.png"
              alt="HackMVP Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:rotate-12"
            />
            <span className="text-xl md:text-2xl font-bold text-white tracking-wide">
              HackMVP
            </span>
          </Link>

          {/* Navigation & User Actions */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {currentUser ? (
              <>
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center space-x-2 text-gray-300 transition-colors duration-300 hover:text-white ${
                        location.pathname === link.to ? 'text-white font-semibold' : ''
                      }`}
                    >
                      <link.icon className={`h-5 w-5 ${location.pathname === link.to ? 'text-purple-400' : ''}`} />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </nav>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
                  >
                    <User className="h-6 w-6 text-white" />
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-3 w-52 bg-gray-900/90 backdrop-blur-2xl border border-white/10 rounded-lg shadow-xl py-2 animate-fade-in-down">
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-sm text-white font-semibold truncate">
                          {currentUser.displayName || 'User'}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {currentUser.email}
                        </p>
                      </div>
                      <div className="mt-2 space-y-1">
                          {/* Mobile Navigation Links in Dropdown */}
                          <div className="md:hidden">
                            {navLinks.map((link) => (
                                <Link key={link.to} to={link.to} className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setIsDropdownOpen(false)}>
                                    <link.icon className="h-4 w-4 mr-3" />
                                    {link.label}
                                </Link>
                            ))}
                             <div className="h-px bg-white/10 my-1"></div>
                          </div>

                        {/* Profile Link */}
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors duration-200"
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          <span>Profile Settings</span>
                        </Link>
                        
                        {/* Logout Button */}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Login Button for logged-out users
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-105"
              >
                <LogIn className="h-5 w-5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};