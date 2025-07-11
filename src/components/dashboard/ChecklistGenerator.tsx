import React, { useState, useEffect } from 'react';
import { CheckSquare, ArrowLeft, Download, Loader2, Check } from 'lucide-react';
import { apiService } from '../../services/api';
import { checklistStorage } from '../../utils/localStorage';
import { WorkflowData } from './Dashboard';
import { MarkdownRenderer } from '../common/MarkdownRenderer';

interface Props {
  workflowData: WorkflowData;
  updateWorkflowData: (data: Partial<WorkflowData>) => void;
  onPrevious: () => void;
  canGoPrevious: boolean;
  goToStep?: (step: number) => void;
}

export const ChecklistGenerator: React.FC<Props> = ({ 
  workflowData, 
  updateWorkflowData, 
  onPrevious, 
  canGoPrevious,
}) => {
  const [checklist, setChecklist] = useState(workflowData.checklist);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateChecklist = async () => {
    if (!workflowData.refinedDescription) return;

    setIsGenerating(true);
    try {
      const checklistData = await apiService.generateChecklist(workflowData);
      setChecklist(checklistData);
      updateWorkflowData({ checklist: checklistData });
      
      // Save to localStorage
      checklistStorage.add({
        title: workflowData.originalIdea,
        description: workflowData.refinedDescription,
        checklist: checklistData,
        workflowData: workflowData,
      });
    } catch (error) {
      console.error('Error generating checklist:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadChecklist = () => {
    const dataStr = JSON.stringify(checklist, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${workflowData.originalIdea.replace(/\s+/g, '-').toLowerCase()}-checklist.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  useEffect(() => {
    if (workflowData.refinedDescription && workflowData.mvpKit && !checklist && !isGenerating) {
      console.log('Auto-generating checklist...');
      generateChecklist();
    }
  }, [workflowData.refinedDescription, workflowData.mvpKit]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-0">
      <div className="bg-dark-card border border-dark-border rounded-lg p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <CheckSquare className="h-5 w-5 sm:h-6 sm:w-6 text-neon-green mr-2" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">Step 6: Project Checklist</h2>
        </div>
        <p className="text-gray-400 mb-6 text-sm sm:text-base">
          Generate a comprehensive checklist to track your hackathon project progress and ensure nothing is missed.
        </p>

        {isGenerating ? (
          <div className="text-center py-8 sm:py-12">
            <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-neon-green mx-auto mb-4" />
            <p className="text-gray-300 text-sm sm:text-base">Generating your project checklist...</p>
          </div>
        ) : checklist ? (
          <div className="bg-dark-bg border border-dark-border rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
              <h3 className="text-lg sm:text-xl font-bold text-white">Your Project Checklist</h3>
              <button
                onClick={downloadChecklist}
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-neon-green hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Download
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-dark-card border border-dark-border rounded-lg p-4">
                <h4 className="text-base sm:text-lg font-bold text-white mb-3">Project Overview</h4>
                <MarkdownRenderer content={checklist.overview} className="text-sm sm:text-base" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {checklist.categories.map((category: any, index: number) => (
                  <div key={index} className="bg-dark-card border border-dark-border rounded-lg p-4">
                    <h4 className="text-base sm:text-lg font-bold text-white mb-3">{category.name}</h4>
                    <div className="space-y-2">
                      {category.items.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="flex items-start space-x-2">
                          <div className="w-4 h-4 border border-gray-500 rounded mt-1 flex-shrink-0"></div>
                          <div>
                            <p className="text-gray-300 text-sm">{item.task}</p>
                            {item.description && (
                              <p className="text-gray-500 text-xs mt-1">{item.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-dark-card border border-dark-border rounded-lg p-4">
                <h4 className="text-base sm:text-lg font-bold text-white mb-3">Timeline & Milestones</h4>
                <MarkdownRenderer content={checklist.timeline} className="text-sm sm:text-base" />
              </div>

              <div className="bg-neon-green/10 border border-neon-green/30 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Check className="h-5 w-5 text-neon-green mr-2" />
                  <h4 className="text-base sm:text-lg font-bold text-white">Checklist Generated Successfully!</h4>
                </div>
                <p className="text-gray-300 text-sm">
                  Your comprehensive project checklist has been created and saved. You can access it anytime from the Checklist page in the header.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <CheckSquare className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-sm sm:text-base">Complete the previous steps to generate your checklist.</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-start">
          {canGoPrevious && (
            <button
              onClick={onPrevious}
              className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Previous
            </button>
          )}
        </div>
      </div>
    </div>
  );
};