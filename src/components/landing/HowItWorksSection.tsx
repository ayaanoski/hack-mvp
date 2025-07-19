import React from 'react';
import { 
  ArrowRight, 
  Lightbulb, 
  Sparkles, // For Generate
  FlaskConical,  // For Validate
  Package         // For Package
} from 'lucide-react';

const steps = [
  {
    icon: Lightbulb,
    title: '1. Define & Refine',
    description: 'Use the Idea Refiner and Prompt Builder to transform your concept into a detailed, AI-ready project plan.',
    color: 'text-neon-purple',
    bgColor: 'bg-neon-purple/20',
    borderColor: 'border-neon-purple/30',
  },
  {
    icon: Sparkles,
    title: '2. Generate Assets',
    description: 'Describe what you need and let AI generate UI components, pitch decks, video scripts, and more.',
    color: 'text-neon-blue',
    bgColor: 'bg-neon-blue/20',
    borderColor: 'border-neon-blue/30',
  },
  {
    icon: FlaskConical,
    title: '3. Validate & Test',
    description: 'Automatically generate unit, integration, and API tests to ensure your generated code is robust and reliable.',
    color: 'text-neon-green',
    bgColor: 'bg-neon-green/20',
    borderColor: 'border-neon-green/30',
  },
  {
    icon: Package,
    title: '4. Package & Go',
    description: 'Bundle all your assets into a complete MVP Kit and use the smart checklist to finalize your project for submission.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/20',
    borderColor: 'border-yellow-400/30',
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-12 sm:py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            From concept to completion in four simple stages. Our AI agents handle the complex work while you focus on innovation.
          </p>
        </div>

        <div className="relative">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between mb-8 md:mb-12">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center text-center max-w-xs">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-2 ${step.borderColor} ${step.bgColor} flex items-center justify-center mb-3 md:mb-4`}>
                    <step.icon className={`h-6 w-6 md:h-8 md:w-8 ${step.color}`} />
                  </div>
                  <div className="text-base md:text-lg font-bold text-white mb-2">
                    {step.title}
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="text-gray-500 h-4 w-4 md:h-6 md:w-6 flex-shrink-0 mx-4" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden space-y-4 sm:space-y-6 md:space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3 sm:space-x-4">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 ${step.borderColor} ${step.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <step.icon className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${step.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-1 sm:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-xs sm:text-sm md:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Section */}
        <div className="mt-8 sm:mt-12 md:mt-16 bg-dark-card/80 backdrop-blur-sm border border-dark-border rounded-lg p-4 sm:p-6 md:p-8">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">
              See It In Action
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm md:text-base">
              Watch how HackMVP transforms a simple prompt into a complete, tested MVP.
            </p>
          </div>
          
          <div className="bg-black/70 rounded-lg p-3 sm:p-4 md:p-8 border border-gray-700">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-3 sm:mb-4">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
            </div>
            
            <div className="font-mono text-gray-300 text-xs sm:text-sm md:text-base overflow-x-auto">
              <div className="mb-1 sm:mb-2"><span className="text-green-400">$ hackmvp build</span> "A social app for finding study partners"</div>
              <div className="text-gray-500 mb-1 sm:mb-2">▶ Refining idea...</div>
              <div className="text-gray-500 mb-1 sm:mb-2">▶ Generating UI components (React + Tailwind)...</div>
              <div className="text-gray-500 mb-1 sm:mb-2">▶ Crafting pitch deck...</div>
              <div className="text-gray-500 mb-1 sm:mb-2">▶ Writing video script...</div>
              <div className="text-gray-500 mb-1 sm:mb-2">▶ Creating test cases (Jest + Cypress)...</div>
              <div className="text-gray-500 mb-1 sm:mb-2">▶ Building final checklist...</div>
              <div className="text-gray-500 mb-1 sm:mb-2">▶ Assembling your MVP Kit...</div>
              <div className="text-neon-green mt-2">✅ MVP build complete!</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};