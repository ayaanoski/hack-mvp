import React from 'react';
import { 
  Lightbulb, 
  MessageSquare, 
  Presentation, 
  Video, 
  Package, 
  CheckSquare, 
  LayoutTemplate, // For Component Generator
  FlaskConical   // For Test Case Generator
} from 'lucide-react';

const features = [
  {
    icon: Lightbulb,
    title: 'Idea Refiner',
    description: 'Transform your raw idea into a structured and viable project concept with AI-driven feedback and validation.',
    color: 'text-neon-purple',
    bgColor: 'bg-neon-purple/20',
  },
  {
    icon: MessageSquare,
    title: 'Prompt Builder',
    description: 'Intuitively construct powerful and effective prompts to guide the AI in generating your desired outputs.',
    color: 'text-neon-blue',
    bgColor: 'bg-neon-blue/20',
  },
  {
    icon: Presentation,
    title: 'Pitch Deck Generator',
    description: 'Automatically create a compelling and professional pitch deck from your project details in just a few clicks.',
    color: 'text-neon-green',
    bgColor: 'bg-neon-green/20',
  },
  {
    icon: Video,
    title: 'Video Script Generator',
    description: 'Instantly generate engaging video scripts to create a memorable demo or promotional video for your project.',
    color: 'text-neon-purple',
    bgColor: 'bg-neon-purple/20',
  },
  {
    icon: Package,
    title: 'MVP Kit',
    description: 'Bundle all your generated assets—from code to documentation—into a single, ready-to-deploy MVP package.',
    color: 'text-neon-blue',
    bgColor: 'bg-neon-blue/20',
  },
  {
    icon: CheckSquare,
    title: 'Smart Checklist',
    description: 'Stay organized and on track with an intelligent, auto-generated checklist tailored to your project’s specific needs.',
    color: 'text-neon-green',
    bgColor: 'bg-neon-green/20',
  },
  {
    icon: LayoutTemplate,
    title: 'AI Component Generator',
    description: 'Describe any UI element in natural language and receive production-ready code for React, Flutter, and more.',
    color: 'text-neon-purple',
    bgColor: 'bg-neon-purple/20',
  },
  {
    icon: FlaskConical,
    title: 'Automated Test Generator',
    description: 'Generate unit, integration, and API tests from your codebase to ensure a robust and reliable application.',
    color: 'text-neon-blue',
    bgColor: 'bg-neon-blue/20',
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
              Rapid MVP Development
            </span>
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to transform your idea into a winning MVP, powered by a suite of intelligent AI agents.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
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