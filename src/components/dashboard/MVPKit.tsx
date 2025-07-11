import React, { useState, useEffect } from 'react';
import { Package, ArrowLeft, Download, ExternalLink, Loader2, ArrowRight } from 'lucide-react';
import { apiService } from '../../services/api';
import { projectStorage } from '../../utils/localStorage';
import { WorkflowData } from './Dashboard';
import { MarkdownRenderer } from '../common/MarkdownRenderer';

interface Props {
  workflowData: WorkflowData;
  updateWorkflowData: (data: Partial<WorkflowData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const MVPKit: React.FC<Props> = ({ 
  workflowData, 
  updateWorkflowData, 
  onNext,
  onPrevious, 
  canGoNext,
  canGoPrevious 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [mvpKit, setMvpKit] = useState(workflowData.mvpKit);
  const [error, setError] = useState<string | null>(null);

  const generateMVPKit = async () => {
    if (!workflowData.originalIdea || !workflowData.refinedDescription) {
      setError('Please complete the previous steps first.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('Starting MVP Kit generation...');
      const kit = await apiService.generateMVPKit(workflowData.originalIdea, workflowData.refinedDescription);
      console.log('MVP Kit generated successfully:', kit);
      
      setMvpKit(kit);
      updateWorkflowData({ mvpKit: kit });
      
      // Save to localStorage immediately
      try {
        projectStorage.add({
          title: kit.title,
          description: kit.description,
          techStack: kit.techStack,
          status: 'generated',
        });
        console.log('Project saved to localStorage');
      } catch (storageError) {
        console.warn('Failed to save to localStorage:', storageError);
      }
      
    } catch (error) {
      console.error('Error generating MVP kit:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate MVP kit. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate when component mounts if data is available but MVP kit is not generated
  useEffect(() => {
    if (workflowData.refinedDescription && !mvpKit && !isGenerating) {
      console.log('Auto-generating MVP kit...');
      generateMVPKit();
    }
  }, [workflowData.refinedDescription]);

  const handleDeploy = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Deployment feature coming soon! Your MVP kit will be deployed to Vercel/Netlify.');
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!mvpKit) return;
    
    try {
      const dataStr = JSON.stringify(mvpKit, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${mvpKit.title.replace(/\s+/g, '-').toLowerCase()}-mvp-kit.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (mvpKit && canGoNext) {
      console.log('Moving to next step with MVP kit:', mvpKit);
      onNext();
    }
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canGoPrevious) {
      onPrevious();
    }
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.preventDefault();
    setError(null);
    generateMVPKit();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-0">
      <div className="bg-dark-card border border-dark-border rounded-lg p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <Package className="h-5 w-5 sm:h-6 sm:w-6 text-neon-green mr-2" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">Step 5: MVP Kit Generator</h2>
        </div>
        <p className="text-gray-400 mb-6 text-sm sm:text-base">
          Generate a complete MVP starter kit with code structure, documentation, and deployment configuration.
        </p>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={handleRetry}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {isGenerating ? (
          <div className="text-center py-8 sm:py-12">
            <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-neon-green mx-auto mb-4" />
            <p className="text-gray-300 text-sm sm:text-base mb-2">Generating your MVP kit...</p>
            <p className="text-gray-500 text-xs sm:text-sm">This may take a few moments. Please don't refresh the page.</p>
          </div>
        ) : mvpKit ? (
          <div className="bg-dark-bg border border-dark-border rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <h3 className="text-lg sm:text-xl font-bold text-white">{mvpKit.title}</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleDeploy}
                  className="flex items-center justify-center px-3 sm:px-4 py-2 bg-neon-purple hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
                >
                  <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Deploy
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center px-3 sm:px-4 py-2 bg-dark-border hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Download
                </button>
              </div>
            </div>

            <div className="mb-6">
              <MarkdownRenderer content={mvpKit.description} className="text-sm sm:text-base" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
              {/* Tech Stack */}
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-3">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {mvpKit.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-full text-xs sm:text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-3">Features</h4>
                <ul className="space-y-2">
                  {mvpKit.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-gray-300 text-sm sm:text-base">
                      <div className="w-2 h-2 bg-neon-green rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Code Structure */}
            <div className="mb-6">
              <h4 className="text-base sm:text-lg font-bold text-white mb-3">Code Structure & Implementation</h4>
              <div className="bg-black/50 border border-gray-700 rounded-lg p-3 sm:p-4 max-h-64 sm:max-h-80 overflow-y-auto">
                <MarkdownRenderer content={mvpKit.codeStructure} className="text-xs sm:text-sm" />
              </div>
            </div>

            <div className="p-3 sm:p-4 bg-dark-card border border-dark-border rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center text-gray-300 gap-1 sm:gap-0">
                <span className="font-semibold mr-2 text-sm sm:text-base">Timeline:</span>
                <span className="text-sm sm:text-base">{mvpKit.timeline}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <Package className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-sm sm:text-base mb-4">Complete the previous steps to generate your MVP kit.</p>
            {workflowData.refinedDescription && (
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-neon-green hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
              >
                Generate MVP Kit
              </button>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
          {canGoPrevious && (
            <button
              onClick={handlePrevious}
              className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Previous
            </button>
          )}
          
          {mvpKit && canGoNext && (
            <button
              onClick={handleNext}
              className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-neon-green hover:bg-green-600 text-white rounded-lg transition-colors ml-auto text-sm sm:text-base"
            >
              Next: Generate Checklist
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};