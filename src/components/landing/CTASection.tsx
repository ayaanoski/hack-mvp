import React, { useState,  useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const CTASection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { current: container } = containerRef;
    if (container) {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      container.style.setProperty('--mouse-x', `${x}px`);
      container.style.setProperty('--mouse-y', `${y}px`);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribed:', email);
    setIsSubscribed(true);
    setEmail('');
  };

  const handleStartBuilding = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative py-16 sm:py-20 md:py-28 overflow-hidden group"
    >
      <div
        className="pointer-events-none absolute -inset-px transition-all duration-300"
        style={{
          background: `radial-gradient(400px at var(--mouse-x, 100px) var(--mouse-y, 100px), rgba(147, 51, 234, 0.1), transparent 80%)`,
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-14 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6">
            Ready to Build Your{' '}
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Next MVP?
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mb-6 sm:mb-8 md:mb-10">
            Join thousands of developers who are already using HackMVP to win hackathons and build amazing products.
          </p>
          
          <button
            onClick={handleStartBuilding}
            className="inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-base sm:text-lg md:text-xl font-semibold rounded-full shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 ease-in-out ring-2 ring-purple-500/50 ring-offset-4 ring-offset-gray-900"
          >
            {currentUser ? 'Continue Building' : 'Start Building Now'}
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
          </button>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 sm:p-8 md:p-10 max-w-2xl mx-auto shadow-2xl">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 text-center">
            Stay Updated
          </h3>
          <p className="text-gray-400 text-center mb-6 sm:mb-8 text-sm sm:text-base">
            Get notified about new features, hackathon templates, and success stories.
          </p>
          
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="flex-grow px-4 py-3 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-sm sm:text-base"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition-colors duration-300 text-sm sm:text-base"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <div className="text-center text-green-400 flex items-center justify-center animate-fade-in-up">
              <CheckCircle className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-sm sm:text-base">Thanks for subscribing! We'll keep you updated.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};