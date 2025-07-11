import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { ArrowRight} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const CTASection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send this to your backend
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
    <section className="py-12 sm:py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            Ready to Build Your{' '}
            <span className="bg-gradient-to-r from-purple-glow to-neon-blue bg-clip-text text-transparent">
              Next MVP?
            </span>
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-4 sm:mb-6 md:mb-8">
            Join thousands of developers who are already using HackMVP to win hackathons and build amazing products.
          </p>
          
          <button
            onClick={handleStartBuilding}
            className="inline-flex items-center px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-gradient-to-r from-purple-glow to-neon-blue hover:from-purple-600 hover:to-blue-600 text-white text-sm sm:text-base md:text-lg rounded-lg transition-all duration-300 transform hover:scale-105 animate-glow"
          >
            {currentUser ? 'Continue Building' : 'Start Building Now'}
            <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          </button>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-dark-border rounded-lg p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 md:mb-16 max-w-2xl mx-auto">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 text-center">
            Stay Updated
          </h3>
          <p className="text-gray-400 text-center mb-4 sm:mb-6 text-xs sm:text-sm md:text-base">
            Get notified about new features, hackathon templates, and success stories.
          </p>
          
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-glow text-xs sm:text-sm md:text-base"
                required
              />
              <button
                type="submit"
                className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-purple-glow hover:bg-purple-600 text-white rounded-lg transition-colors text-xs sm:text-sm md:text-base"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <div className="text-center text-neon-green text-xs sm:text-sm md:text-base">
              ✅ Thanks for subscribing! We'll keep you updated.
            </div>
          )}
        </div>

      
      </div>
    </section>
  );
};