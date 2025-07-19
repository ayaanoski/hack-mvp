import React from 'react';
import { useParticleAnimation } from './useParticleAnimation'; // Adjust the import path

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useParticleAnimation();

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <canvas ref={canvasRef} className="w-full h-full opacity-80" />
      
      {/* Optional: Add back subtle, slow-moving gradient blobs for more depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-blob"></div>
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
    </div>
  );
};