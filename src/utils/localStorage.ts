export const LOCAL_STORAGE_KEYS = {
  PROJECTS: 'hackmvp_projects',
  USER_PREFERENCES: 'hackmvp_preferences',
  CHAT_HISTORY: 'hackmvp_chat_history',
  CHECKLISTS: 'hackmvp_checklists',
} as const;

export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'generated' | 'deployed';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  checklist: any;
  workflowData: any;
  createdAt: string;
  updatedAt: string;
}

export const projectStorage = {
  getAll: (): Project[] => storage.get<Project[]>(LOCAL_STORAGE_KEYS.PROJECTS) || [],
  
  add: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project => {
    const projects = projectStorage.getAll();
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects.push(newProject);
    storage.set(LOCAL_STORAGE_KEYS.PROJECTS, projects);
    return newProject;
  },

  update: (id: string, updates: Partial<Project>): Project | null => {
    const projects = projectStorage.getAll();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates, updatedAt: new Date().toISOString() };
      storage.set(LOCAL_STORAGE_KEYS.PROJECTS, projects);
      return projects[index];
    }
    return null;
  },

  delete: (id: string): boolean => {
    const projects = projectStorage.getAll();
    const filtered = projects.filter(p => p.id !== id);
    if (filtered.length !== projects.length) {
      storage.set(LOCAL_STORAGE_KEYS.PROJECTS, filtered);
      return true;
    }
    return false;
  },
};

export const chatStorage = {
  getHistory: (): ChatMessage[] => storage.get<ChatMessage[]>(LOCAL_STORAGE_KEYS.CHAT_HISTORY) || [],
  
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>): void => {
    const history = chatStorage.getHistory();
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    history.push(newMessage);
    storage.set(LOCAL_STORAGE_KEYS.CHAT_HISTORY, history);
  },

  clearHistory: (): void => {
    storage.remove(LOCAL_STORAGE_KEYS.CHAT_HISTORY);
  },
};

export interface GeneratedComponent {
  id: string;
  description: string;
  framework: string;
  code: string;
  preview?: string;
  createdAt: string;
}

export interface GeneratedTests {
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

export const generatorStorage = {
  addComponent: (component: GeneratedComponent): void => {
    const components = storage.get<GeneratedComponent[]>('hackmvp_generated_components') || [];
    components.push(component);
    storage.set('hackmvp_generated_components', components);
  },

  getComponents: (): GeneratedComponent[] => {
    return storage.get<GeneratedComponent[]>('hackmvp_generated_components') || [];
  },

  addTest: (test: GeneratedTests): void => {
    const tests = storage.get<GeneratedTests[]>('hackmvp_generated_tests') || [];
    tests.push(test);
    storage.set('hackmvp_generated_tests', tests);
  },

  getTests: (): GeneratedTests[] => {
    return storage.get<GeneratedTests[]>('hackmvp_generated_tests') || [];
  },

  deleteComponent: (id: string): boolean => {
    const components = generatorStorage.getComponents();
    const filtered = components.filter(c => c.id !== id);
    if (filtered.length !== components.length) {
      storage.set('hackmvp_generated_components', filtered);
      return true;
    }
    return false;
  },

  deleteTest: (id: string): boolean => {
    const tests = generatorStorage.getTests();
    const filtered = tests.filter(t => t.id !== id);
    if (filtered.length !== tests.length) {
      storage.set('hackmvp_generated_tests', filtered);
      return true;
    }
    return false;
  },
};

export const checklistStorage = {
  getAll: (): ChecklistItem[] => storage.get<ChecklistItem[]>(LOCAL_STORAGE_KEYS.CHECKLISTS) || [],
  
  add: (checklist: Omit<ChecklistItem, 'id' | 'createdAt' | 'updatedAt'>): ChecklistItem => {
    const checklists = checklistStorage.getAll();
    const newChecklist: ChecklistItem = {
      ...checklist,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    checklists.push(newChecklist);
    storage.set(LOCAL_STORAGE_KEYS.CHECKLISTS, checklists);
    return newChecklist;
  },

  update: (id: string, updates: Partial<ChecklistItem>): ChecklistItem | null => {
    const checklists = checklistStorage.getAll();
    const index = checklists.findIndex(c => c.id === id);
    if (index !== -1) {
      checklists[index] = { ...checklists[index], ...updates, updatedAt: new Date().toISOString() };
      storage.set(LOCAL_STORAGE_KEYS.CHECKLISTS, checklists);
      return checklists[index];
    }
    return null;
  },

  delete: (id: string): boolean => {
    const checklists = checklistStorage.getAll();
    const filtered = checklists.filter(c => c.id !== id);
    if (filtered.length !== checklists.length) {
      storage.set(LOCAL_STORAGE_KEYS.CHECKLISTS, filtered);
      return true;
    }
    return false;
  },
};