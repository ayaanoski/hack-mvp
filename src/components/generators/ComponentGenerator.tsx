import React, { useState } from 'react';
import { Code, Download, Eye, Copy, Check, Loader2, Play } from 'lucide-react';
import { apiService } from '../../services/api';
import { generatorStorage } from '../../utils/localStorage';
import { MarkdownRenderer } from '../common/MarkdownRenderer';

interface GeneratedComponent {
  id: string;
  description: string;
  framework: string;
  code: string;
  preview?: string;
  createdAt: string;
}

const frameworks = [
  { id: 'react-tailwind', name: 'React + TailwindCSS', icon: '⚛️' },
  { id: 'chakra-ui', name: 'Chakra UI', icon: '🎨' },
  { id: 'flutter', name: 'Flutter Widget', icon: '📱' },
  { id: 'react-native', name: 'React Native', icon: '📲' },
];

export const ComponentGenerator: React.FC = () => {
  const [description, setDescription] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('react-tailwind');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedComponent, setGeneratedComponent] = useState<GeneratedComponent | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateComponent = async () => {
    if (!description.trim()) {
      setError('Please provide a component description');
      return;
    }

    if (description.length > 500) {
      setError('Description is too long. Please keep it under 500 characters.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const framework = frameworks.find(f => f.id === selectedFramework);
      
      const code = await apiService.generateComponent(description, selectedFramework);

      const component: GeneratedComponent = {
        id: Date.now().toString(),
        description,
        framework: framework?.name || selectedFramework,
        code: code,
        createdAt: new Date().toISOString(),
      };

      setGeneratedComponent(component);
      
      // Save to localStorage
      generatorStorage.addComponent(component);

    } catch (error) {
      console.error('Error generating component:', error);
      setError('Failed to generate component. Please try a simpler description or check your API configuration.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedComponent) return;
    
    try {
      await navigator.clipboard.writeText(generatedComponent.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadComponent = () => {
    if (!generatedComponent) return;

    const extension = selectedFramework === 'flutter' ? 'dart' : 
                    selectedFramework === 'react-native' ? 'tsx' : 'tsx';
    const filename = `component-${generatedComponent.id}.${extension}`;
    
    const blob = new Blob([generatedComponent.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const examplePrompts = [
    'A sidebar with filters for size, price, and color using checkboxes',
    'A responsive card component with image, title, description, and action buttons',
    'A navigation bar with logo, menu items, and user profile dropdown',
    'A modal dialog with form inputs for user registration',
    'A data table with sorting, filtering, and pagination',
    'A dashboard widget showing statistics with charts',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Code className="h-6 w-6 text-neon-blue mr-2" />
        <h2 className="text-2xl font-bold text-white">Component Generator</h2>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Input Section */}
      <div className="bg-dark-bg border border-dark-border rounded-lg p-6">
        <div className="space-y-4">
          {/* Framework Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Framework
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {frameworks.map((framework) => (
                <button
                  key={framework.id}
                  onClick={() => setSelectedFramework(framework.id)}
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedFramework === framework.id
                      ? 'border-neon-blue bg-neon-blue/20 text-white'
                      : 'border-dark-border bg-dark-card text-gray-400 hover:border-neon-blue/50'
                  }`}
                >
                  <div className="text-lg mb-1">{framework.icon}</div>
                  <div className="text-xs font-medium">{framework.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Component Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the component you want to generate..."
              className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue resize-none"
              rows={4}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generateComponent}
            disabled={isGenerating || !description.trim()}
            className="w-full px-6 py-3 bg-neon-blue hover:bg-blue-600 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Generating Component...
              </>
            ) : (
              <>
                <Code className="h-5 w-5 mr-2" />
                Generate Component
              </>
            )}
          </button>
        </div>
      </div>

      {/* Example Prompts */}
      <div className="bg-dark-bg border border-dark-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Example Prompts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {examplePrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setDescription(prompt)}
              className="text-left p-3 bg-dark-card border border-dark-border rounded-lg hover:border-neon-blue/50 transition-colors"
            >
              <p className="text-gray-300 text-sm">{prompt}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Generated Component */}
      {generatedComponent && (
        <div className="bg-dark-bg border border-dark-border rounded-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <h3 className="text-lg font-bold text-white">Generated Component</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center px-3 py-2 bg-neon-green hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Preview'}
              </button>
              <button
                onClick={copyToClipboard}
                className="flex items-center px-3 py-2 bg-neon-purple hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={downloadComponent}
                className="flex items-center px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="px-2 py-1 bg-neon-blue/20 text-neon-blue rounded">
                {generatedComponent.framework}
              </span>
              <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded">
                {new Date(generatedComponent.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="bg-black/50 border border-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
              <MarkdownRenderer content={`\`\`\`${selectedFramework === 'flutter' ? 'dart' : 'tsx'}\n${generatedComponent.code}\n\`\`\``} />
            </div>

            {showPreview && selectedFramework === 'react-tailwind' && (
              <div className="bg-white border border-gray-300 rounded-lg p-4">
                <div className="text-gray-800 text-sm mb-2">Live Preview (React + Tailwind)</div>
                <div className="border border-gray-200 rounded p-4 bg-gray-50">
                  <div className="text-gray-600 text-center py-8">
                    Preview functionality would be implemented with a sandboxed iframe or code execution environment
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};