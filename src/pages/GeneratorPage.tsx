import React, { useState } from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { ComponentGenerator } from '../components/generators/ComponentGenerator';
import { TestCaseGenerator } from '../components/generators/TestCaseGenerator';
import { Code, TestTube } from 'lucide-react';

export const GeneratorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'component' | 'test'>('component');

  const tabs = [
    {
      id: 'component' as const,
      label: 'Component Generator',
      icon: Code,
      description: 'Generate UI components from natural language descriptions',
    },
    {
      id: 'test' as const,
      label: 'Test Case Generator',
      icon: TestTube,
      description: 'Auto-generate comprehensive test cases for your code',
    },
  ];

  return (
    <div className="min-h-screen bg-transparent pt-16 sm:pt-20">
      <SEOHead 
        title="AI Generators - HackMVP | Component & Test Case Generator"
        description="Generate UI components and test cases with AI. Transform natural language descriptions into production-ready code and comprehensive test suites."
        keywords="AI component generator, test case generator, UI components, automated testing, code generation"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">
              AI Code Generators
            </h1>
            <p className="text-lg sm:text-xl text-gray-400">
              Generate components and tests with natural language descriptions
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row justify-center mb-6 sm:mb-8 gap-2 sm:gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-purple-glow text-white shadow-lg shadow-purple-glow/50'
                    : 'bg-dark-card text-gray-400 hover:bg-dark-border hover:text-white'
                }`}
              >
                <tab.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <div className="text-left">
                  <div className="text-sm sm:text-base font-semibold">{tab.label}</div>
                  <div className="text-xs text-gray-400 hidden sm:block">{tab.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-dark-card border border-dark-border rounded-lg p-4 sm:p-6">
            {activeTab === 'component' && <ComponentGenerator />}
            {activeTab === 'test' && <TestCaseGenerator />}
          </div>
        </div>
      </div>
    </div>
  );
};