import React, { useState, useEffect, useCallback } from 'react';
import { Package, ArrowLeft, Download, ExternalLink, Loader2, ArrowRight, Copy, Check, FileText, FileJson } from 'lucide-react';
import { apiService } from '../../services/api';
import { projectStorage } from '../../utils/localStorage';
import { WorkflowData } from './Dashboard';
import { MarkdownRenderer } from '../common/MarkdownRenderer';

// Helper component for copy-to-clipboard functionality
const CopyButton = ({ content }: { content: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
    </button>
  );
};

// Helper component to create consistent info blocks
const InfoBlock = ({ title, copyContent, children }: { title: string; copyContent?: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-base sm:text-lg font-bold text-white">{title}</h4>
      {copyContent && <CopyButton content={copyContent} />}
    </div>
    {children}
  </div>
);


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

  const generateMVPKit = useCallback(async () => {
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
      
      // Save to localStorage immediately. Note: Ensure projectStorage can handle an array for techStack.
      try {
        projectStorage.add({
          title: kit.title,
          description: kit.description,
          techStack: kit.techStack, // Assuming your storage can handle string[]
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
  }, [workflowData.originalIdea, workflowData.refinedDescription, updateWorkflowData]);

  // Auto-generate when component mounts if data is available but MVP kit is not.
  useEffect(() => {
    if (workflowData.refinedDescription && !mvpKit && !isGenerating) {
      console.log('Auto-generating MVP kit...');
      generateMVPKit();
    }
  }, [workflowData.refinedDescription, mvpKit, isGenerating, generateMVPKit]);

  const handleDeploy = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Deployment feature coming soon! Your MVP kit will be deployed to Vercel/Netlify.');
  };
  
  const generateMarkdownReport = (): string => {
    if (!mvpKit) return "";
    return `
# ${mvpKit.title}

## 🚀 Overview
${mvpKit.description}

---

## 🛠️ Tech Stack
${mvpKit.techStack.map(tech => `- ${tech}`).join('\n')}

---

## ✨ Features
${mvpKit.features.map(feature => `- ${feature}`).join('\n')}

---

## 📂 Code Structure
\`\`\`
${mvpKit.codeStructure}
\`\`\`

---

## ⚙️ Deployment Configuration
${mvpKit.deploymentConfig}

---

## 🗓️ Timeline
${mvpKit.timeline}
    `;
  };

  const handleDownload = (format: 'json' | 'md') => {
    if (!mvpKit) return;
    
    try {
      const isJson = format === 'json';
      const content = isJson ? JSON.stringify(mvpKit, null, 2) : generateMarkdownReport();
      const mimeType = isJson ? 'application/json' : 'text/markdown';
      const fileExtension = isJson ? 'json' : 'md';
      
      const dataUri = `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;
      const exportFileDefaultName = `${mvpKit.title.replace(/\s+/g, '-').toLowerCase()}-mvp-kit.${fileExtension}`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.preventDefault();
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
             <details>
                <summary className="flex items-center justify-between cursor-pointer">
                  <p className="text-red-400 font-semibold">An error occurred during generation.</p>
                  <button onClick={handleRetry} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">
                    Retry
                  </button>
                </summary>
                <div className="mt-4 bg-black/30 p-3 rounded">
                  <p className="text-red-300 text-xs font-mono whitespace-pre-wrap">{error}</p>
                </div>
             </details>
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
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
              <h3 className="text-lg sm:text-xl font-bold text-white">{mvpKit.title}</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <button onClick={() => handleDownload('md')} className="flex items-center justify-center px-3 py-2 bg-dark-border hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">
                  <FileText className="h-4 w-4 mr-2" /> Download Report (.md)
                </button>
                 <button onClick={() => handleDownload('json')} className="flex items-center justify-center px-3 py-2 bg-dark-border hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">
                  <FileJson className="h-4 w-4 mr-2" /> Download JSON
                </button>
                <button onClick={handleDeploy} className="flex items-center justify-center px-3 py-2 bg-neon-purple hover:bg-purple-600 text-white rounded-lg transition-colors text-sm">
                  <ExternalLink className="h-4 w-4 mr-2" /> Deploy
                </button>
              </div>
            </div>

            <InfoBlock title="Description">
              <MarkdownRenderer content={mvpKit.description} className="text-sm sm:text-base text-gray-300" />
            </InfoBlock>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <InfoBlock title="Tech Stack">
                <div className="flex flex-wrap gap-2">
                  {mvpKit.techStack.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </InfoBlock>

              <InfoBlock title="Core Features">
                <ul className="space-y-2">
                  {mvpKit.features.map((feature) => (
                    <li key={feature} className="flex items-start text-gray-300 text-sm sm:text-base">
                      <div className="w-2 h-2 bg-neon-green rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </InfoBlock>
            </div>

            <InfoBlock title="Code Structure" copyContent={mvpKit.codeStructure}>
              <div className="bg-black/50 border border-gray-700 rounded-lg p-4 max-h-80 overflow-y-auto">
                <pre><code className="text-xs sm:text-sm text-gray-300">{mvpKit.codeStructure}</code></pre>
              </div>
            </InfoBlock>
            
            <InfoBlock title="Deployment Configuration" copyContent={mvpKit.deploymentConfig}>
              <div className="bg-black/50 border border-gray-700 rounded-lg p-4 text-xs sm:text-sm text-gray-300">
                <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: mvpKit.deploymentConfig.replace(/(REACT_APP_[A-Z_]+|VITE_[A-Z_]+|[A-Z_]+_KEY)/g, '<strong class="text-yellow-400">$&</strong>') }} />
              </div>
            </InfoBlock>

            <div className="p-3 sm:p-4 bg-dark-card border border-dark-border rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center text-gray-300 gap-1 sm:gap-0">
                <span className="font-semibold mr-2 text-sm sm:text-base">🗓️ Timeline:</span>
                <span className="text-sm sm:text-base">{mvpKit.timeline}</span>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <Package className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-sm sm:text-base mb-4">Complete the previous steps to generate your MVP kit.</p>
            {workflowData.refinedDescription && (
              <button onClick={() => generateMVPKit()} className="px-4 py-2 bg-neon-green hover:bg-green-600 text-black rounded-lg transition-colors text-sm font-semibold">
                Generate MVP Kit
              </button>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6">
          {canGoPrevious && (
            <button onClick={onPrevious} className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm sm:text-base">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" /> Previous
            </button>
          )}
          
          {mvpKit && canGoNext && (
            <button onClick={onNext} className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-neon-green hover:bg-green-600 text-black rounded-lg transition-colors ml-auto text-sm sm:text-base font-semibold">
              Next: Generate Checklist <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};