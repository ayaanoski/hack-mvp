import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
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
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-glow/5 to-transparent"></div>
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(124, 58, 237, 0.3) 1px, transparent 0)`,
          backgroundSize: '50px 50px',
        }}
      ></div>
    </div>
  );
};