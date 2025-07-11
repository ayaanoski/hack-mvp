import React, { useState } from 'react';
import { Send, Lightbulb, Loader2, ArrowRight } from 'lucide-react';
import { apiService } from '../../services/api';
import { chatStorage } from '../../utils/localStorage';
import { WorkflowData } from './Dashboard';
import { MarkdownRenderer } from '../common/MarkdownRenderer';

interface Props {
  workflowData: WorkflowData;
  updateWorkflowData: (data: Partial<WorkflowData>) => void;
  onNext: () => void;
  canGoNext: boolean;
  goToStep?: (step: number) => void;
}

export const IdeaRefiner: React.FC<Props> = ({ workflowData, updateWorkflowData, onNext, canGoNext, goToStep }) => {
  const [idea, setIdea] = useState(workflowData.originalIdea || '');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefined, setIsRefined] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: idea };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIdea('');
    setIsLoading(true);

    try {
      const response = await apiService.sendMessage(newMessages);
      const assistantMessage = { role: 'assistant' as const, content: response.reply.content };
      setMessages([...newMessages, assistantMessage]);
      
      // Save to localStorage
      chatStorage.addMessage(userMessage);
      chatStorage.addMessage(assistantMessage);

      // Update workflow data
      updateWorkflowData({
        originalIdea: userMessage.content,
        refinedDescription: assistantMessage.content,
      });
      
      setIsRefined(true);
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please check your API configuration and try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (isRefined && canGoNext) {
      onNext();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-0">
      <div className="bg-dark-card border border-dark-border rounded-lg p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-neon-purple mr-2" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">Step 1: Idea Refiner</h2>
        </div>
        <p className="text-gray-400 mb-6 text-sm sm:text-base">
          Share your rough idea and let our AI agent help you refine it into a clear, actionable project plan.
        </p>

        {/* Chat Messages */}
        <div className="bg-dark-bg border border-dark-border rounded-lg p-3 sm:p-4 mb-6 h-64 sm:h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-16 sm:mt-20">
              <Lightbulb className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-600" />
              <p className="text-sm sm:text-base">Start by sharing your hackathon idea...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-neon-purple text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <p className="text-xs sm:text-sm whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <div className="text-xs sm:text-sm">
                        <MarkdownRenderer content={message.content} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-100 max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your hackathon idea..."
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-dark-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple text-sm sm:text-base"
          />
          <button
            type="submit"
            disabled={!idea.trim() || isLoading}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-neon-purple hover:bg-purple-600 disabled:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {isLoading ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : <Send className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        </form>

        {/* Next Button */}
        {isRefined && (
          <div className="flex justify-end mb-6">
            <button
              onClick={handleNext}
              className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-neon-green hover:bg-green-600 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              Next: Generate Prompt
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
            </button>
          </div>
        )}

        {/* Quick Start Templates */}
        <div className="bg-dark-bg border border-dark-border rounded-lg p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-bold text-white mb-4">Quick Start Templates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              'A mobile app for finding study partners',
              'A web platform for tracking carbon footprint',
              'An AI tool for generating workout plans',
              'A social network for pet owners',
            ].map((template, index) => (
              <button
                key={index}
                onClick={() => setIdea(template)}
                className="text-left p-3 sm:p-4 bg-dark-card border border-dark-border rounded-lg hover:border-neon-purple/50 transition-colors"
              >
                <p className="text-gray-300 text-sm sm:text-base">{template}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};