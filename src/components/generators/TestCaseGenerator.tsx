import React, { useState } from 'react';
import { TestTube, Download, Copy, Check, Loader2, FileCode, Play } from 'lucide-react';
import { apiService } from '../../services/api';
import { generatorStorage } from '../../utils/localStorage';
import { MarkdownRenderer } from '../common/MarkdownRenderer';

interface GeneratedTests {
  id: string;
  codeInput: string;
  testTypes: string[];
  tests: {
    unit?: string;
    integration?: string;
    api?: string;
  };
  createdAt: string;
}

const testTypes = [
  { id: 'unit', name: 'Unit Tests', description: 'Jest/Mocha test cases', icon: '🧪' },
  { id: 'integration', name: 'Integration Tests', description: 'Cypress/Playwright tests', icon: '🔗' },
  { id: 'api', name: 'API Tests', description: 'Postman/Supertest collections', icon: '🌐' },
];

export const TestCaseGenerator: React.FC = () => {
  const [codeInput, setCodeInput] = useState('');
  const [selectedTestTypes, setSelectedTestTypes] = useState<string[]>(['unit']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTests, setGeneratedTests] = useState<GeneratedTests | null>(null);
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  const toggleTestType = (typeId: string) => {
    setSelectedTestTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const generateTests = async () => {
    if (!codeInput.trim()) {
      setError('Please provide code to generate tests for');
      return;
    }

    if (selectedTestTypes.length === 0) {
      setError('Please select at least one test type');
      return;
    }

    if (codeInput.length > 2000) {
      setError('Code input is too long. Please keep it under 2000 characters.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const tests = await apiService.generateTests(codeInput, selectedTestTypes);

      const generatedTestSuite: GeneratedTests = {
        id: Date.now().toString(),
        codeInput,
        testTypes: selectedTestTypes,
        tests,
        createdAt: new Date().toISOString(),
      };

      setGeneratedTests(generatedTestSuite);
      
      // Save to localStorage
      generatorStorage.addTest(generatedTestSuite);

    } catch (error) {
      console.error('Error generating tests:', error);
      setError('Failed to generate tests. Please try with shorter code or check your API configuration.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (testType: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied({ ...copied, [testType]: true });
      setTimeout(() => setCopied({ ...copied, [testType]: false }), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadTests = (testType: string, content: string) => {
    const extensions: { [key: string]: string } = {
      unit: 'test.js',
      integration: 'spec.js',
      api: 'json'
    };
    
    const filename = `${testType}-tests-${generatedTests?.id}.${extensions[testType]}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exampleCode = `// Example React Component
import React, { useState } from 'react';

export const Counter = ({ initialValue = 0 }) => {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};`;

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <TestTube className="h-6 w-6 text-neon-green mr-2" />
        <h2 className="text-2xl font-bold text-white">Test Case Generator</h2>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Input Section */}
      <div className="bg-dark-bg border border-dark-border rounded-lg p-6">
        <div className="space-y-4">
          {/* Test Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Test Types
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {testTypes.map((testType) => (
                <button
                  key={testType.id}
                  onClick={() => toggleTestType(testType.id)}
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedTestTypes.includes(testType.id)
                      ? 'border-neon-green bg-neon-green/20 text-white'
                      : 'border-dark-border bg-dark-card text-gray-400 hover:border-neon-green/50'
                  }`}
                >
                  <div className="text-lg mb-1">{testType.icon}</div>
                  <div className="text-sm font-medium">{testType.name}</div>
                  <div className="text-xs text-gray-400">{testType.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Code Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Code to Test
            </label>
            <textarea
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Paste your code here..."
              className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-green resize-none font-mono text-sm"
              rows={12}
            />
          </div>

          {/* Example Code Button */}
          <button
            onClick={() => setCodeInput(exampleCode)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
          >
            <FileCode className="h-4 w-4 mr-2 inline" />
            Use Example Code
          </button>

          {/* Generate Button */}
          <button
            onClick={generateTests}
            disabled={isGenerating || !codeInput.trim() || selectedTestTypes.length === 0}
            className="w-full px-6 py-3 bg-neon-green hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Generating Tests...
              </>
            ) : (
              <>
                <TestTube className="h-5 w-5 mr-2" />
                Generate Test Cases
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Tests */}
      {generatedTests && (
        <div className="space-y-4">
          {Object.entries(generatedTests.tests).map(([testType, content]) => {
            const typeInfo = testTypes.find(t => t.id === testType);
            return (
              <div key={testType} className="bg-dark-bg border border-dark-border rounded-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{typeInfo?.icon}</span>
                    <h3 className="text-lg font-bold text-white">{typeInfo?.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(testType, content)}
                      className="flex items-center px-3 py-2 bg-neon-purple hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
                    >
                      {copied[testType] ? (
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
                      onClick={() => downloadTests(testType, content)}
                      className="flex items-center px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>

                <div className="bg-black/50 border border-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <MarkdownRenderer content={`\`\`\`javascript\n${content}\n\`\`\``} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};