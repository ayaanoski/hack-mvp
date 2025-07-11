import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Moving Lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#6366F1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#6366F1" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="lineGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        
        {/* Diagonal Moving Lines */}
        <g className="animate-move-diagonal-1">
          <line x1="-100" y1="100" x2="200" y2="-200" stroke="url(#lineGradient1)" strokeWidth="2" opacity="0.6" />
          <line x1="-50" y1="150" x2="250" y2="-150" stroke="url(#lineGradient1)" strokeWidth="1" opacity="0.4" />
        </g>
        
        <g className="animate-move-diagonal-2">
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="url(#lineGradient2)" strokeWidth="2" opacity="0.5" />
          <line x1="120%" y1="20%" x2="20%" y2="120%" stroke="url(#lineGradient2)" strokeWidth="1" opacity="0.3" />
        </g>
        
        <g className="animate-move-diagonal-3">
          <line x1="50%" y1="-10%" x2="-10%" y2="50%" stroke="url(#lineGradient3)" strokeWidth="1.5" opacity="0.6" />
          <line x1="70%" y1="10%" x2="10%" y2="70%" stroke="url(#lineGradient3)" strokeWidth="1" opacity="0.4" />
        </g>
        
        {/* Horizontal Moving Lines */}
        <g className="animate-move-horizontal-1">
          <line x1="-100%" y1="20%" x2="200%" y2="20%" stroke="url(#lineGradient1)" strokeWidth="1" opacity="0.3" />
          <line x1="-100%" y1="80%" x2="200%" y2="80%" stroke="url(#lineGradient2)" strokeWidth="1" opacity="0.4" />
        </g>
        
        <g className="animate-move-horizontal-2">
          <line x1="200%" y1="40%" x2="-100%" y2="40%" stroke="url(#lineGradient3)" strokeWidth="1" opacity="0.3" />
          <line x1="200%" y1="60%" x2="-100%" y2="60%" stroke="url(#lineGradient1)" strokeWidth="1" opacity="0.2" />
        </g>
        
        {/* Vertical Moving Lines */}
        <g className="animate-move-vertical-1">
          <line x1="25%" y1="-100%" x2="25%" y2="200%" stroke="url(#lineGradient2)" strokeWidth="1" opacity="0.3" />
          <line x1="75%" y1="200%" x2="75%" y2="-100%" stroke="url(#lineGradient3)" strokeWidth="1" opacity="0.4" />
        </g>
      </svg>

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-purple-glow/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-neon-blue/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-28 h-28 sm:w-42 sm:h-42 md:w-56 md:h-56 bg-neon-green/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 right-1/3 w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-purple-glow/15 rounded-full blur-2xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 left-1/5 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-neon-purple/10 rounded-full blur-2xl animate-bounce-slow"></div>
      
      {/* Floating particles */}
      <div className="absolute top-1/5 left-1/2 w-2 h-2 bg-purple-glow/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-2/3 left-1/6 w-1 h-1 bg-neon-blue/40 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-1/2 right-1/5 w-1.5 h-1.5 bg-neon-green/30 rounded-full animate-ping" style={{ animationDelay: '2.5s' }}></div>
      <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-purple-glow/40 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-1/6 right-1/3 w-2 h-2 bg-neon-blue/30 rounded-full animate-ping" style={{ animationDelay: '4s' }}></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-glow/5 to-transparent"></div>
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(124, 58, 237, 0.3) 1px, transparent 0)`,
          backgroundSize: '50px 50px',
        }}
      ></div>
      
      {/* Animated circuit-like patterns */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-glow/30 to-transparent animate-pulse-slow"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-neon-green/30 to-transparent animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-glow/30 to-transparent animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      </div>
    </div>
  );
};