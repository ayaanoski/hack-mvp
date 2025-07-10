import React from 'react';
import { Lightbulb, MessageSquare, Presentation as PresentationChart, Layers, Palette,  RotateCcw, FileText, BookOpen } from 'lucide-react';

const features = [
  {
    icon: Lightbulb,
    title: 'Idea Refinement',
    description: 'Transform vague concepts into well-defined project requirements with AI guidance.',
    color: 'text-neon-purple',
    bgColor: 'bg-neon-purple/20',
  },
  {
    icon: MessageSquare,
    title: 'Prompt Generator',
    description: 'Generate optimized prompts for website builders and development tools.',
    color: 'text-neon-blue',
    bgColor: 'bg-neon-blue/20',
  },
  {
    icon: PresentationChart,
    title: 'AI-Powered Pitch Copy',
    description: 'Create compelling pitch decks and presentations that win hackathons.',
    color: 'text-neon-green',
    bgColor: 'bg-neon-green/20',
  },
  {
    icon: Layers,
    title: 'Tech Stack Recommender',
    description: 'Get personalized technology recommendations based on your project needs.',
    color: 'text-neon-purple',
    bgColor: 'bg-neon-purple/20',
  },
  {
    icon: Palette,
    title: 'UI Mockup Suggestions',
    description: 'Receive design inspiration and UI mockups tailored to your project.',
    color: 'text-neon-blue',
    bgColor: 'bg-neon-blue/20',
  },
  
  {
    icon: RotateCcw,
    title: 'Iterative Regeneration',
    description: 'Continuously improve your MVP with AI-powered iterations and feedback.',
    color: 'text-neon-blue',
    bgColor: 'bg-neon-blue/20',
  },
  {
    icon: FileText,
    title: 'Hackathon Templates',
    description: 'Access pre-built templates for common hackathon themes and challenges.',
    color: 'text-neon-green',
    bgColor: 'bg-neon-green/20',
  },
  {
    icon: BookOpen,
    title: 'Auto-Generated Docs',
    description: 'Generate comprehensive documentation and README files automatically.',
    color: 'text-neon-purple',
    bgColor: 'bg-neon-purple/20',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-12 sm:py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            Powerful Features for{' '}
            <span className="bg-gradient-to-r from-purple-glow to-neon-blue bg-clip-text text-transparent">
              Hackathon Success
            </span>
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to transform your hackathon idea into a winning MVP, powered by advanced AI agents.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-dark-card/80 backdrop-blur-sm border border-dark-border rounded-lg p-3 sm:p-4 md:p-6 hover:border-purple-glow/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg ${feature.bgColor} mb-3 sm:mb-4`}>
                <feature.icon className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${feature.color}`} />
              </div>
              
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-purple-glow transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed text-xs sm:text-sm md:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};