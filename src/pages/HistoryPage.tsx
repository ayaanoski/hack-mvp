import React from 'react';
import { History, MessageSquare, Trash2, Calendar, Package, Code, TestTube, Eye, Download } from 'lucide-react';
import { chatStorage, projectStorage, checklistStorage, generatorStorage } from '../utils/localStorage';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';

export const HistoryPage: React.FC = () => {
  const chatHistory = chatStorage.getHistory();
  const projects = projectStorage.getAll();
  const checklists = checklistStorage.getAll();
  const components = generatorStorage.getComponents();
  const tests = generatorStorage.getTests();

  const clearChatHistory = () => {
    if (confirm('Are you sure you want to clear all chat history?')) {
      chatStorage.clearHistory();
      window.location.reload();
    }
  };

  const deleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      projectStorage.delete(id);
      window.location.reload();
    }
  };

  const deleteChecklist = (id: string) => {
    if (confirm('Are you sure you want to delete this checklist?')) {
      checklistStorage.delete(id);
      window.location.reload();
    }
  };

  const deleteComponent = (id: string) => {
    if (confirm('Are you sure you want to delete this component?')) {
      generatorStorage.deleteComponent(id);
      window.location.reload();
    }
  };

  const deleteTest = (id: string) => {
    if (confirm('Are you sure you want to delete this test?')) {
      generatorStorage.deleteTest(id);
      window.location.reload();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-transparent pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">
              History
            </h1>
            <p className="text-lg sm:text-xl text-gray-400">
              Your chat history and generated projects
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            {/* Chat History */}
            <div className="bg-dark-card border border-dark-border rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-neon-blue mr-2" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Chat History</h2>
                </div>
                {chatHistory.length > 0 && (
                  <button
                    onClick={clearChatHistory}
                    className="flex items-center justify-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs sm:text-sm transition-colors"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-4 max-h-64 sm:max-h-96 overflow-y-auto">
                {chatHistory.length === 0 ? (
                  <p className="text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">No chat history yet.</p>
                ) : (
                  chatHistory.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 sm:p-4 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-neon-purple/20 border-l-4 border-neon-purple'
                          : 'bg-neon-blue/10 border-l-4 border-neon-blue'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                        <span className={`text-xs sm:text-sm font-semibold ${
                          message.role === 'user' ? 'text-neon-purple' : 'text-neon-blue'
                        }`}>
                          {message.role === 'user' ? 'You' : 'AI Assistant'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(message.timestamp)}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm max-h-32 overflow-y-auto">
                        {message.role === 'user' ? (
                          <p className="text-gray-300 whitespace-pre-wrap">{message.content}</p>
                        ) : (
                          <div className="prose prose-sm max-w-none">
                            <MarkdownRenderer 
                              content={message.content.length > 500 ? message.content.substring(0, 500) + '...' : message.content} 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Projects History */}
            <div className="bg-dark-card border border-dark-border rounded-lg p-4 sm:p-6">
              <div className="flex items-center mb-4 sm:mb-6">
                <History className="h-5 w-5 sm:h-6 sm:w-6 text-neon-green mr-2" />
                <h2 className="text-xl sm:text-2xl font-bold text-white">Generated Projects</h2>
              </div>

              <div className="space-y-4 max-h-64 sm:max-h-96 overflow-y-auto">
                {projects.length === 0 ? (
                  <p className="text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">No projects generated yet.</p>
                ) : (
                  projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-dark-bg border border-dark-border rounded-lg p-3 sm:p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                        <h3 className="font-semibold text-white text-sm sm:text-base">{project.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            project.status === 'deployed' ? 'bg-green-500/20 text-green-500' :
                            project.status === 'generated' ? 'bg-blue-500/20 text-blue-500' :
                            'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {project.status}
                          </span>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {project.techStack.slice(0, 3).map((tech, techIndex) => (
                          <span key={techIndex} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                            +{project.techStack.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        Created: {formatDate(project.createdAt)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Checklists History */}
            <div className="bg-dark-card border border-dark-border rounded-lg p-4 sm:p-6">
              <div className="flex items-center mb-4 sm:mb-6">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-neon-purple mr-2" />
                <h2 className="text-xl sm:text-2xl font-bold text-white">Project Checklists</h2>
              </div>

              <div className="space-y-4 max-h-64 sm:max-h-96 overflow-y-auto">
                {checklists.length === 0 ? (
                  <p className="text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">No checklists generated yet.</p>
                ) : (
                  checklists.map((checklist) => {
                    const totalItems = checklist.checklist.categories.reduce(
                      (acc: number, cat: any) => acc + cat.items.length, 0
                    );
                    const completedItems = checklist.checklist.categories.reduce(
                      (acc: number, cat: any) => acc + cat.items.filter((item: any) => item.completed).length, 0
                    );
                    const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

                    return (
                      <div
                        key={checklist.id}
                        className="bg-dark-bg border border-dark-border rounded-lg p-3 sm:p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                          <h3 className="font-semibold text-white text-sm sm:text-base">{checklist.title}</h3>
                          <button
                            onClick={() => deleteChecklist(checklist.id)}
                            className="text-red-400 hover:text-red-300 transition-colors self-end sm:self-auto"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                        
                        <p className="text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">{checklist.description}</p>
                        
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{completedItems}/{totalItems}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-neon-green h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          Created: {formatDate(checklist.createdAt)}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Generated Components & Tests */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mt-6 sm:mt-8">
            {/* Generated Components */}
            <div className="bg-dark-card border border-dark-border rounded-lg p-4 sm:p-6">
              <div className="flex items-center mb-4 sm:mb-6">
                <Code className="h-5 w-5 sm:h-6 sm:w-6 text-neon-blue mr-2" />
                <h2 className="text-xl sm:text-2xl font-bold text-white">Generated Components</h2>
              </div>

              <div className="space-y-4 max-h-64 sm:max-h-96 overflow-y-auto">
                {components.length === 0 ? (
                  <p className="text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">No components generated yet.</p>
                ) : (
                  components.map((component) => (
                    <div
                      key={component.id}
                      className="bg-dark-bg border border-dark-border rounded-lg p-3 sm:p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                        <h3 className="font-semibold text-white text-sm sm:text-base line-clamp-1">
                          {component.description}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigator.clipboard.writeText(component.code)}
                            className="text-neon-blue hover:text-blue-400 transition-colors"
                            title="Copy code"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                          <button
                            onClick={() => deleteComponent(component.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-1 bg-neon-blue/20 text-neon-blue rounded text-xs">
                          {component.framework}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(component.createdAt)}
                        </span>
                      </div>
                      
                      <div className="bg-black/30 rounded p-2 max-h-20 overflow-hidden">
                        <code className="text-xs text-gray-400 line-clamp-3">
                          {component.code.substring(0, 150)}...
                        </code>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Generated Tests */}
            <div className="bg-dark-card border border-dark-border rounded-lg p-4 sm:p-6">
              <div className="flex items-center mb-4 sm:mb-6">
                <TestTube className="h-5 w-5 sm:h-6 sm:w-6 text-neon-green mr-2" />
                <h2 className="text-xl sm:text-2xl font-bold text-white">Generated Tests</h2>
              </div>

              <div className="space-y-4 max-h-64 sm:max-h-96 overflow-y-auto">
                {tests.length === 0 ? (
                  <p className="text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">No tests generated yet.</p>
                ) : (
                  tests.map((test) => (
                    <div
                      key={test.id}
                      className="bg-dark-bg border border-dark-border rounded-lg p-3 sm:p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                        <h3 className="font-semibold text-white text-sm sm:text-base">
                          Test Suite #{test.id.slice(-4)}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              const allTests = Object.values(test.tests).join('\n\n');
                              navigator.clipboard.writeText(allTests);
                            }}
                            className="text-neon-green hover:text-green-400 transition-colors"
                            title="Copy all tests"
                          >
                            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                          <button
                            onClick={() => deleteTest(test.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {test.testTypes.map((type) => (
                          <span key={type} className="px-2 py-1 bg-neon-green/20 text-neon-green rounded text-xs">
                            {type}
                          </span>
                        ))}
                      </div>
                      
                      <div className="bg-black/30 rounded p-2 max-h-20 overflow-hidden mb-2">
                        <code className="text-xs text-gray-400 line-clamp-3">
                          {test.codeInput.substring(0, 100)}...
                        </code>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        Created: {formatDate(test.createdAt)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};