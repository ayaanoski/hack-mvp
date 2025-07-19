import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const HeroSection: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleTryHackMVP = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pt-12 sm:pt-14 md:pt-16">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-purple-glow/20 border border-purple-glow/30 text-purple-glow mb-4 sm:mb-6 md:mb-8">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            <span className="text-xs sm:text-sm">AI-Powered Hackathon Tool</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-purple-glow via-neon-blue to-neon-green bg-clip-text text-transparent">
              HackMVP
            </span>
            <br />
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-gray-300">
              Your AI Hackathon Co-Pilot
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-400 mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2 sm:px-4">
            Transform rough ideas into{' '}
            <span className="text-neon-blue font-semibold">fully functional MVPs</span> in minutes with the power of{' '}
            <span className="text-neon-green font-semibold">autonomous AI agents</span>.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleTryHackMVP}
            className="inline-flex items-center px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-gradient-to-r from-purple-glow to-neon-blue hover:from-purple-600 hover:to-blue-600 text-white text-sm sm:text-base md:text-lg rounded-lg transition-all duration-300 transform hover:scale-105 animate-glow"
          >
            {currentUser ? 'Go to Dashboard' : 'Try HackMVP'}
            <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          </button>

          {/* Stats */}
          <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
            {[
              { icon: Zap, value: '10x', label: 'Faster Creation' },
              { icon: Sparkles, value: '#1', label: 'One Stop Solution' },
              { icon: ArrowRight, value: '95%', label: 'Success Rate' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-dark-card border border-dark-border rounded-lg mb-2 sm:mb-3 md:mb-4">
                  <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 text-purple-glow" />
                </div>
                <div className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm md:text-base text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};