import React, { useState, useEffect } from 'react';
import { Video, ArrowRight, ArrowLeft, Download, Loader2, Play } from 'lucide-react';
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

export const VideoScriptGenerator: React.FC<Props> = ({ 
  workflowData, 
  updateWorkflowData, 
  onNext, 
  onPrevious, 
  canGoNext, 
  canGoPrevious,
  goToStep
}) => {
  const [videoScript, setVideoScript] = useState(workflowData.videoScript);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateVideoScript = async () => {
    if (!workflowData.refinedDescription) return;

    setIsGenerating(true);
    try {
      const script = await apiService.generateVideoScript(workflowData.originalIdea, workflowData.refinedDescription);
      setVideoScript(script);
      updateWorkflowData({ videoScript: script });
    } catch (error) {
      console.error('Error generating video script:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadScript = () => {
    const dataStr = JSON.stringify(videoScript, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${workflowData.originalIdea.replace(/\s+/g, '-').toLowerCase()}-video-script.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  useEffect(() => {
    if (workflowData.refinedDescription && !videoScript) {
      generateVideoScript();
    }
  }, [workflowData.refinedDescription]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-0">
      <div className="bg-dark-card border border-dark-border rounded-lg p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <Video className="h-5 w-5 sm:h-6 sm:w-6 text-neon-blue mr-2" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">Step 4: Video Script Generator</h2>
        </div>
        <p className="text-gray-400 mb-6 text-sm sm:text-base">
          Create a compelling demo video script with scenes, dialogue, and visual cues for your product showcase.
        </p>

        {isGenerating ? (
          <div className="text-center py-8 sm:py-12">
            <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-neon-blue mx-auto mb-4" />
            <p className="text-gray-300 text-sm sm:text-base">Generating your video script...</p>
          </div>
        ) : videoScript ? (
          <div className="bg-dark-bg border border-dark-border rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
              <h3 className="text-lg sm:text-xl font-bold text-white">Your Video Script</h3>
              <button
                onClick={downloadScript}
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-neon-blue hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Download
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-dark-card border border-dark-border rounded-lg p-4">
                  <h4 className="text-base sm:text-lg font-bold text-white mb-3">Video Overview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">{videoScript.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Style:</span>
                      <span className="text-white">{videoScript.style}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Target:</span>
                      <span className="text-white">{videoScript.target}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-card border border-dark-border rounded-lg p-4">
                  <h4 className="text-base sm:text-lg font-bold text-white mb-3">Production Notes</h4>
                  <MarkdownRenderer content={videoScript.productionNotes} className="text-sm" />
                </div>
              </div>

              <div className="bg-dark-card border border-dark-border rounded-lg p-4">
                <h4 className="text-base sm:text-lg font-bold text-white mb-3">Scene Breakdown</h4>
                <div className="space-y-4">
                  {videoScript.scenes.map((scene: any, index: number) => (
                    <div key={index} className="border border-gray-700 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <Play className="h-4 w-4 text-neon-blue mr-2" />
                        <h5 className="font-semibold text-white text-sm">Scene {index + 1}: {scene.title}</h5>
                        <span className="ml-auto text-xs text-gray-400">{scene.duration}</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{scene.description}</p>
                      <div className="text-xs text-gray-400">
                        <strong>Visual:</strong> {scene.visual}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-dark-card border border-dark-border rounded-lg p-4">
                <h4 className="text-base sm:text-lg font-bold text-white mb-3">Full Script</h4>
                <div className="max-h-64 sm:max-h-80 overflow-y-auto">
                  <MarkdownRenderer content={videoScript.fullScript} className="text-sm sm:text-base" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <Video className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-sm sm:text-base">Complete the previous steps to generate your video script.</p>
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
          
          {videoScript && canGoNext && (
            <button
              onClick={onNext}
              className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-neon-green hover:bg-green-600 text-white rounded-lg transition-colors ml-auto text-sm sm:text-base"
            >
              Next: MVP Kit
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};