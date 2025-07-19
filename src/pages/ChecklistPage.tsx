import React, { useState } from 'react';
import { CheckSquare, Trash2, Calendar, Check, X, Download } from 'lucide-react';
import { checklistStorage } from '../utils/localStorage';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';

export const ChecklistPage: React.FC = () => {
  const [checklists, setChecklists] = useState(checklistStorage.getAll());
  const [selectedChecklist, setSelectedChecklist] = useState<string | null>(null);

  const deleteChecklist = (id: string) => {
    if (confirm('Are you sure you want to delete this checklist?')) {
      checklistStorage.delete(id);
      setChecklists(checklistStorage.getAll());
      if (selectedChecklist === id) {
        setSelectedChecklist(null);
      }
    }
  };

  const toggleChecklistItem = (checklistId: string, categoryIndex: number, itemIndex: number) => {
    const updatedChecklists = checklists.map(checklist => {
      if (checklist.id === checklistId) {
        const updatedChecklist = { ...checklist };
        updatedChecklist.checklist.categories[categoryIndex].items[itemIndex].completed = 
          !updatedChecklist.checklist.categories[categoryIndex].items[itemIndex].completed;
        checklistStorage.update(checklistId, updatedChecklist);
        return updatedChecklist;
      }
      return checklist;
    });
    setChecklists(updatedChecklists);
  };

  const downloadChecklist = (checklist: any) => {
    const dataStr = JSON.stringify(checklist, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${checklist.title.replace(/\s+/g, '-').toLowerCase()}-checklist.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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

  const selectedChecklistData = checklists.find(c => c.id === selectedChecklist);

  return (
    <div className="min-h-screen bg-transparent pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">
              Project Checklists
            </h1>
            <p className="text-lg sm:text-xl text-gray-400">
              Track your hackathon project progress
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            {/* Checklist List */}
            <div className="xl:col-span-1">
              <div className="bg-dark-card border border-dark-border rounded-lg p-4 sm:p-6">
                <div className="flex items-center mb-4 sm:mb-6">
                  <CheckSquare className="h-5 w-5 sm:h-6 sm:w-6 text-neon-green mr-2" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Your Checklists</h2>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {checklists.length === 0 ? (
                    <p className="text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">
                      No checklists generated yet.
                    </p>
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
                          className={`bg-dark-bg border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
                            selectedChecklist === checklist.id 
                              ? 'border-neon-green' 
                              : 'border-dark-border hover:border-neon-green/50'
                          }`}
                          onClick={() => setSelectedChecklist(checklist.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                              {checklist.title}
                            </h3>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteChecklist(checklist.id);
                              }}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                          
                          <p className="text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">
                            {checklist.description}
                          </p>
                          
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

            {/* Checklist Details */}
            <div className="xl:col-span-2">
              {selectedChecklistData ? (
                <div className="bg-dark-card border border-dark-border rounded-lg p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {selectedChecklistData.title}
                    </h2>
                    <button
                      onClick={() => downloadChecklist(selectedChecklistData)}
                      className="flex items-center justify-center px-3 sm:px-4 py-2 bg-neon-green hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                    >
                      <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Download
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
                      <h4 className="text-base sm:text-lg font-bold text-white mb-3">Project Overview</h4>
                      <MarkdownRenderer content={selectedChecklistData.checklist.overview} className="text-sm sm:text-base" />
                    </div>

                    <div className="space-y-4">
                      {selectedChecklistData.checklist.categories.map((category: any, categoryIndex: number) => (
                        <div key={categoryIndex} className="bg-dark-bg border border-dark-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-base sm:text-lg font-bold text-white">{category.name}</h4>
                            <div className="text-sm text-gray-400">
                              {category.items.filter((item: any) => item.completed).length}/{category.items.length} completed
                            </div>
                          </div>
                          <div className="space-y-3">
                            {category.items.map((item: any, itemIndex: number) => (
                              <div key={itemIndex} className="flex items-start space-x-3">
                                <button
                                  onClick={() => toggleChecklistItem(selectedChecklistData.id, categoryIndex, itemIndex)}
                                  className={`w-5 h-5 border-2 rounded flex items-center justify-center mt-0.5 flex-shrink-0 transition-all duration-200 hover:scale-110 ${
                                    item.completed 
                                      ? 'bg-neon-green border-neon-green shadow-lg shadow-neon-green/50' 
                                      : 'border-gray-500 hover:border-neon-green hover:bg-neon-green/10'
                                  }`}
                                >
                                  {item.completed && <Check className="h-3 w-3 text-white animate-pulse" />}
                                </button>
                                <div className="flex-1">
                                  <p className={`text-sm transition-all duration-200 ${
                                    item.completed 
                                      ? 'text-gray-500 line-through opacity-75' 
                                      : 'text-gray-300 hover:text-white'
                                  }`}>
                                    {item.task}
                                  </p>
                                  {item.description && (
                                    <p className={`text-xs mt-1 transition-all duration-200 ${
                                      item.completed ? 'text-gray-600' : 'text-gray-500'
                                    }`}>
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
                      <h4 className="text-base sm:text-lg font-bold text-white mb-3">Timeline & Milestones</h4>
                      <MarkdownRenderer content={selectedChecklistData.checklist.timeline} className="text-sm sm:text-base" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-dark-card border border-dark-border rounded-lg p-4 sm:p-6">
                  <div className="text-center py-12">
                    <div className="relative">
                      <CheckSquare className="h-16 w-16 text-gray-600 mx-auto mb-4 animate-pulse" />
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-neon-green/20 rounded-full animate-ping"></div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Select a Checklist</h3>
                    <p className="text-gray-400 mb-4">Choose a checklist from the left to view and manage its items.</p>
                    {checklists.length === 0 && (
                      <div className="mt-6 p-4 bg-dark-bg border border-dark-border rounded-lg">
                        <p className="text-gray-500 text-sm">
                          No checklists available. Generate one from the Dashboard workflow to get started.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};