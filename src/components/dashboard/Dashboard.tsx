import React, { useState } from 'react';
import { SEOHead } from '../common/SEOHead';
import { Lightbulb, MessageSquare, Package, ArrowRight, Presentation, Video, CheckSquare } from 'lucide-react';
import { IdeaRefiner } from './IdeaRefiner';
import { PromptBuilder } from './PromptBuilder';
import { MVPKit } from './MVPKit';
import { PitchDeckGenerator } from './PitchDeckGenerator';
import { VideoScriptGenerator } from './VideoScriptGenerator';
import { ChecklistGenerator } from './ChecklistGenerator';

export interface WorkflowData {
  originalIdea: string;
  refinedDescription: string;
  generatedPrompt: string;
  pitchDeck: any;
  videoScript: any;
  mvpKit: any;
  checklist: any;
}

const steps = [
  { id: 'idea-refiner', label: 'Idea Refiner', icon: Lightbulb, component: IdeaRefiner },
  { id: 'prompt-builder', label: 'Prompt Builder', icon: MessageSquare, component: PromptBuilder },
  { id: 'pitch-deck', label: 'Pitch Deck', icon: Presentation, component: PitchDeckGenerator },
  { id: 'video-script', label: 'Video Script', icon: Video, component: VideoScriptGenerator },
  { id: 'mvp-kit', label: 'MVP Kit', icon: Package, component: MVPKit },
  { id: 'checklist', label: 'Checklist', icon: CheckSquare, component: ChecklistGenerator },
];

export const Dashboard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [workflowData, setWorkflowData] = useState<WorkflowData>(() => {
    // Try to restore from localStorage on initial load
    try {
      const saved = localStorage.getItem('hackmvp_current_workflow');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to restore workflow data:', error);
    }
    return {
      originalIdea: '',
      refinedDescription: '',
      generatedPrompt: '',
      pitchDeck: null,
      videoScript: null,
      mvpKit: null,
      checklist: null,
    };
  });

  const ActiveComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateWorkflowData = (data: Partial<WorkflowData>) => {
    setWorkflowData(prev => {
      const newData = { ...prev, ...data };
      // Save to localStorage immediately
      try {
        localStorage.setItem('hackmvp_current_workflow', JSON.stringify(newData));
      } catch (error) {
        console.warn('Failed to save workflow data:', error);
      }
      return newData;
    });
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div className="min-h-screen pt-12 sm:pt-14 md:pt-16">
      <SEOHead 
        title="Dashboard - HackMVP | AI-Powered MVP Generator"
        description="Use HackMVP's AI-powered dashboard to refine ideas, generate prompts, create pitch decks, and build complete MVP kits for your hackathon projects."
        keywords="MVP dashboard, AI tools, hackathon dashboard, idea refinement, prompt generator, pitch deck creator"
      />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="py-3 sm:py-6 md:py-8">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">
              HackMVP Dashboard
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-gray-400">
              Your AI-powered hackathon toolkit
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-4 md:mb-6">
  <div className="flex items-center justify-center space-x-2 md:space-x-3">
    {steps.map((step, index) => (
      <React.Fragment key={step.id}>
        <button
          onClick={() => goToStep(index)}
          className={`flex items-center space-x-1.5 rounded-md px-2 py-1 transition-all duration-300 hover:scale-105 ${
            index === currentStep
              ? 'bg-purple-glow text-white shadow-md shadow-purple-glow/40'
              : index < currentStep
              ? 'bg-neon-green text-white shadow-md shadow-neon-green/40'
              : 'bg-dark-card text-gray-400 hover:bg-dark-border'
          }`}
        >
          <step.icon className="h-4 w-4 flex-shrink-0" />
          <span className="text-xs hidden sm:inline">{step.label}</span>
        </button>
        {index < steps.length - 1 && (
          <ArrowRight className="text-gray-600 h-4 w-4 flex-shrink-0 hidden sm:block" />
        )}
      </React.Fragment>
    ))}
  </div>
</div>

          {/* Step Content */}
          <div className="mb-3 sm:mb-6 md:mb-8">
            <ActiveComponent 
              workflowData={workflowData}
              updateWorkflowData={updateWorkflowData}
              onNext={handleNext}
              onPrevious={handlePrevious}
              canGoNext={currentStep < steps.length - 1}
              canGoPrevious={currentStep > 0}
              goToStep={goToStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
};