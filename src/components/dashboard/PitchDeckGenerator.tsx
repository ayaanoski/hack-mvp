import React, { useState, useEffect } from 'react';
import { Presentation, ArrowRight, ArrowLeft, Download, Loader2 } from 'lucide-react';
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

export const PitchDeckGenerator: React.FC<Props> = ({ 
  workflowData, 
  updateWorkflowData, 
  onNext, 
  onPrevious, 
  canGoNext, 
  canGoPrevious,
  goToStep
}) => {
  const [pitchDeck, setPitchDeck] = useState(workflowData.pitchDeck);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePitchDeck = async () => {
    if (!workflowData.refinedDescription) return;

    setIsGenerating(true);
    try {
      const deck = await apiService.generatePitchDeck(workflowData.originalIdea, workflowData.refinedDescription);
      setPitchDeck(deck);
      updateWorkflowData({ pitchDeck: deck });
    } catch (error) {
      console.error('Error generating pitch deck:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPitchDeck = () => {
    const dataStr = JSON.stringify(pitchDeck, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${workflowData.originalIdea.replace(/\s+/g, '-').toLowerCase()}-pitch-deck.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  useEffect(() => {
    if (workflowData.refinedDescription && !pitchDeck) {
      generatePitchDeck();
    }
  }, [workflowData.refinedDescription]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-0">
      <div className="bg-dark-card border border-dark-border rounded-lg p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <Presentation className="h-5 w-5 sm:h-6 sm:w-6 text-neon-purple mr-2" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">Step 3: Pitch Deck Generator</h2>
        </div>
        <p className="text-gray-400 mb-6 text-sm sm:text-base">
          Generate a compelling pitch deck with slides, content, and presentation flow for your hackathon project.
        </p>

        {isGenerating ? (
          <div className="text-center py-8 sm:py-12">
            <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-neon-purple mx-auto mb-4" />
            <p className="text-gray-300 text-sm sm:text-base">Generating your pitch deck...</p>
          </div>
        ) : pitchDeck ? (
          <div className="bg-dark-bg border border-dark-border rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
              <h3 className="text-lg sm:text-xl font-bold text-white">Your Pitch Deck</h3>
              <button
                onClick={downloadPitchDeck}
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-neon-purple hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Download
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-dark-card border border-dark-border rounded-lg p-4">
                <h4 className="text-base sm:text-lg font-bold text-white mb-3">Presentation Overview</h4>
                <MarkdownRenderer content={pitchDeck.overview} className="text-sm sm:text-base" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-dark-card border border-dark-border rounded-lg p-4">
                  <h4 className="text-base sm:text-lg font-bold text-white mb-3">Key Slides</h4>
                  <div className="space-y-3">
                    {pitchDeck.slides.map((slide: any, index: number) => (
                      <div key={index} className="border-l-4 border-neon-purple pl-3">
                        <h5 className="font-semibold text-white text-sm">{slide.title}</h5>
                        <p className="text-gray-400 text-xs">{slide.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-dark-card border border-dark-border rounded-lg p-4">
                  <h4 className="text-base sm:text-lg font-bold text-white mb-3">Presentation Tips</h4>
                  <MarkdownRenderer content={pitchDeck.tips} className="text-sm" />
                </div>
              </div>

              <div className="bg-dark-card border border-dark-border rounded-lg p-4">
                <h4 className="text-base sm:text-lg font-bold text-white mb-3">Detailed Content</h4>
                <div className="max-h-64 sm:max-h-80 overflow-y-auto">
                  <MarkdownRenderer content={pitchDeck.content} className="text-sm sm:text-base" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <Presentation className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-sm sm:text-base">Complete the previous steps to generate your pitch deck.</p>
          </div>
        )}

        {/* Navigation */}
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
          
          {pitchDeck && canGoNext && (
            <button
              onClick={onNext}
              className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-neon-green hover:bg-green-600 text-white rounded-lg transition-colors ml-auto text-sm sm:text-base"
            >
              Next: Video Script
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};