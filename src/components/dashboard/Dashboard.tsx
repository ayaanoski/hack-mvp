import React, { useState } from 'react';
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
  const [workflowData, setWorkflowData] = useState<WorkflowData>({
    originalIdea: '',
    refinedDescription: '',
    generatedPrompt: '',
    pitchDeck: null,
    videoScript: null,
    mvpKit: null,
    checklist: null,
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
    setWorkflowData(prev => ({ ...prev, ...data }));
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div className="min-h-screen pt-12 sm:pt-14 md:pt-16">
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
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 md:space-x-4 flex-wrap gap-y-2 px-2">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => goToStep(index)}
                    className={`flex items-center space-x-1 sm:space-x-2 px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 rounded-lg whitespace-nowrap transition-all duration-300 hover:scale-105 ${
                    index === currentStep
                      ? 'bg-purple-glow text-white shadow-lg shadow-purple-glow/50'
                      : index < currentStep
                      ? 'bg-neon-green text-white shadow-lg shadow-neon-green/50'
                      : 'bg-dark-card text-gray-400 hover:bg-dark-border'
                  }`}
                  >
                    <step.icon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm hidden sm:inline">{step.label}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <ArrowRight className="text-gray-500 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0 hidden sm:block" />
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