import React, { useState, useEffect } from 'react';
import { MessageSquare, ArrowRight, ArrowLeft, Copy, Check, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api';
import { WorkflowData } from './Dashboard';
import { MarkdownRenderer } from '../common/MarkdownRenderer';

interface Props {
  workflowData: WorkflowData;
  updateWorkflowData: (data: Partial<WorkflowData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  goToStep?: (step: number) => void;
}

export const PromptBuilder: React.FC<Props> = ({ 
  workflowData, 
  updateWorkflowData, 
  onNext, 
  onPrevious, 
  canGoNext, 
  canGoPrevious,
  goToStep
}) => {
  const [projectType, setProjectType] = useState('Website');
  const [generatedPrompt, setGeneratedPrompt] = useState(workflowData.generatedPrompt || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const projectTypes = [
    'Website',
    'Mobile App',
    'API/Backend',
    'Chrome Extension',
    'Desktop App',
    'AI Tool',
  ];

  const generatePrompt = async () => {
    if (!workflowData.refinedDescription) return;

    setIsGenerating(true);
    try {
      const prompt = await apiService.generatePrompt(projectType, workflowData.refinedDescription);
      setGeneratedPrompt(prompt);
      updateWorkflowData({ generatedPrompt: prompt });
    } catch (error) {
      console.error('Error generating prompt:', error);
      setGeneratedPrompt('Error generating prompt. Please check your API configuration.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  useEffect(() => {
    if (workflowData.refinedDescription && !generatedPrompt) {
      generatePrompt();
    }
  }, [workflowData.refinedDescription]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-0">
      <div className="bg-dark-card border border-dark-border rounded-lg p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-neon-blue mr-2" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">Step 2: Prompt Builder</h2>
        </div>
        <p className="text-gray-400 mb-6 text-sm sm:text-base">
          Generate optimized prompts for development tools and AI assistants based on your refined idea.
        </p>

        {/* Project Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Type
          </label>
          <select
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-blue text-sm sm:text-base"
          >
            {projectTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Refined Idea Display */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Refined Idea
          </label>
          <div className="p-3 sm:p-4 bg-dark-bg border border-dark-border rounded-lg max-h-32 sm:max-h-40 overflow-y-auto">
            {workflowData.refinedDescription ? (
              <MarkdownRenderer content={workflowData.refinedDescription} className="text-xs sm:text-sm" />
            ) : (
              <p className="text-gray-400 text-xs sm:text-sm">
                Complete Step 1 first to see your refined idea here.
              </p>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generatePrompt}
          disabled={!workflowData.refinedDescription || isGenerating}
          className="w-full px-4 py-2 sm:py-3 bg-neon-blue hover:bg-blue-600 disabled:bg-gray-600 text-white rounded-lg transition-colors mb-6 text-sm sm:text-base"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
              Generating Prompt...
            </div>
          ) : (
            'Generate Optimized Prompt'
          )}
        </button>

        {/* Generated Prompt */}
        {generatedPrompt && (
          <div className="bg-dark-bg border border-dark-border rounded-lg p-3 sm:p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
              <h4 className="font-bold text-white text-sm sm:text-base">Generated Prompt</h4>
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center px-3 py-1 bg-neon-green hover:bg-green-600 text-white rounded text-xs sm:text-sm transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="max-h-64 sm:max-h-80 overflow-y-auto">
              <MarkdownRenderer content={generatedPrompt} className="text-xs sm:text-sm" />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
          {canGoPrevious && (
            <button
              onClick={onPrevious}
              className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Previous
            </button>
          )}
          
          {generatedPrompt && canGoNext && (
            <button
              onClick={onNext}
              className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-neon-green hover:bg-green-600 text-white rounded-lg transition-colors ml-auto text-sm sm:text-base"
            >
              Next: Generate Pitch Deck
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};