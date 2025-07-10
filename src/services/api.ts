export interface ApiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ApiResponse {
  reply: ApiMessage;
}

export interface MVPKit {
  title: string;
  description: string;
  techStack: string[];
  features: string[];
  timeline: string;
  codeStructure: string;
  deploymentConfig: string;
}

export interface PitchDeck {
  overview: string;
  slides: Array<{ title: string; description: string }>;
  content: string;
  tips: string;
}

export interface VideoScript {
  duration: string;
  style: string;
  target: string;
  productionNotes: string;
  scenes: Array<{ title: string; description: string; duration: string; visual: string }>;
  fullScript: string;
}

export interface ProjectChecklist {
  overview: string;
  categories: Array<{ name: string; items: Array<{ task: string; description?: string; completed?: boolean }> }>;
  timeline: string;
}

class ApiService {
  private apiKey: string;
  private modelName: string;
  private baseURL: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_IO_API_KEY || '';
    this.modelName = import.meta.env.VITE_IO_MODEL_NAME || 'meta-llama/Llama-3.3-70B-Instruct';
    this.baseURL = 'https://api.intelligence.io.solutions/api/v1/';
  }

  async sendMessage(messages: ApiMessage[]): Promise<ApiResponse> {
    if (!this.apiKey) {
      throw new Error('API key not configured. Please set VITE_IO_API_KEY in your environment variables.');
    }

    const finalMessages = messages.length > 0 && messages[0].role === 'system'
      ? messages
      : [
          { role: 'system', content: 'You are an AI hackathon co-pilot that helps developers refine ideas, generate tech stacks, create prompts, build MVPs, create pitch decks, video scripts, and project checklists. Provide detailed, comprehensive, and actionable responses with proper formatting and structure.' },
          ...messages,
        ];

    try {
      const response = await fetch(`${this.baseURL}chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: finalMessages,
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        reply: data.choices[0].message,
      };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async generateMVPKit(idea: string, refinedDescription: string): Promise<MVPKit> {
    const messages: ApiMessage[] = [
      {
        role: 'system',
        content: 'You are an expert MVP generator. Generate a comprehensive MVP kit with detailed title, description, tech stack, features, timeline, code structure, and deployment configuration. Provide extensive details and practical implementation guidance.'
      },
      {
        role: 'user',
        content: `Generate a complete and detailed MVP kit for this idea: "${idea}"\n\nRefined description: "${refinedDescription}"\n\nPlease provide a comprehensive MVP kit with extensive details, implementation guidance, code structure, deployment steps, and all necessary technical specifications.`
      }
    ];

    const response = await this.sendMessage(messages);
    
    // Parse the response to extract structured data
    // In a real implementation, you might want to use a more sophisticated parsing method
    return {
      title: `${idea} - MVP Kit`,
      description: refinedDescription,
      techStack: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Vercel'],
      features: [
        'User authentication and authorization',
        'Core feature implementation',
        'Responsive design',
        'API integration',
        'Database setup',
        'Deployment configuration',
      ],
      timeline: '2-3 days for full implementation',
      codeStructure: response.reply.content,
      deploymentConfig: 'Vercel deployment with environment variables configured',
    };
  }

  async generatePitchDeck(idea: string, refinedDescription: string): Promise<PitchDeck> {
    const messages: ApiMessage[] = [
      {
        role: 'system',
        content: 'You are an expert pitch deck creator for hackathons. Generate comprehensive pitch deck content with slide structure, compelling narrative, and presentation tips. Focus on winning hackathon presentations.'
      },
      {
        role: 'user',
        content: `Create a detailed pitch deck for this hackathon project: "${idea}"\n\nProject details: "${refinedDescription}"\n\nGenerate a complete pitch deck with slide breakdown, content for each slide, presentation flow, and tips for delivery. Make it compelling and hackathon-focused.`
      }
    ];

    const response = await this.sendMessage(messages);
    
    return {
      overview: `Comprehensive pitch deck for ${idea} - designed to win hackathons with compelling storytelling and clear value proposition.`,
      slides: [
        { title: 'Problem Statement', description: 'Define the core problem you\'re solving' },
        { title: 'Solution Overview', description: 'Present your innovative solution' },
        { title: 'Demo', description: 'Show your working prototype' },
        { title: 'Market Opportunity', description: 'Highlight the market potential' },
        { title: 'Technology Stack', description: 'Showcase your technical implementation' },
        { title: 'Business Model', description: 'Explain monetization strategy' },
        { title: 'Next Steps', description: 'Outline future development plans' },
      ],
      content: response.reply.content,
      tips: '**Presentation Tips:**\n\n- Keep slides visual and minimal\n- Practice your demo thoroughly\n- Tell a compelling story\n- Engage with the audience\n- Stay within time limits\n- Prepare for Q&A\n- Show passion and enthusiasm',
    };
  }

  async generateVideoScript(idea: string, refinedDescription: string): Promise<VideoScript> {
    const messages: ApiMessage[] = [
      {
        role: 'system',
        content: 'You are an expert video script writer for product demos and hackathon presentations. Create engaging, concise scripts with clear scene directions and compelling narrative flow.'
      },
      {
        role: 'user',
        content: `Create a detailed video script for this project: "${idea}"\n\nProject details: "${refinedDescription}"\n\nGenerate a complete video script with scene breakdown, dialogue, visual cues, and production notes. Make it engaging and suitable for a hackathon demo video.`
      }
    ];

    const response = await this.sendMessage(messages);
    
    return {
      duration: '2-3 minutes',
      style: 'Professional demo with engaging narrative',
      target: 'Hackathon judges and potential users',
      productionNotes: '**Production Guidelines:**\n\n- Use screen recording for app demos\n- Include talking head segments\n- Add background music\n- Keep transitions smooth\n- Ensure good audio quality\n- Use consistent branding',
      scenes: [
        { title: 'Hook', description: 'Grab attention with the problem', duration: '15 seconds', visual: 'Problem illustration or statistics' },
        { title: 'Solution Intro', description: 'Introduce your solution', duration: '20 seconds', visual: 'Product logo and tagline' },
        { title: 'Demo', description: 'Show the product in action', duration: '60-90 seconds', visual: 'Screen recording of key features' },
        { title: 'Benefits', description: 'Highlight key benefits', duration: '20 seconds', visual: 'Benefit icons and text' },
        { title: 'Call to Action', description: 'Next steps and contact', duration: '15 seconds', visual: 'Contact information and links' },
      ],
      fullScript: response.reply.content,
    };
  }

  async generateChecklist(workflowData: any): Promise<ProjectChecklist> {
    const messages: ApiMessage[] = [
      {
        role: 'system',
        content: 'You are an expert project manager for hackathons. Generate comprehensive project checklists with categorized tasks, timelines, and milestones to ensure successful project completion.'
      },
      {
        role: 'user',
        content: `Create a detailed project checklist for this hackathon project: "${workflowData.originalIdea}"\n\nProject details: "${workflowData.refinedDescription}"\n\nGenerate a comprehensive checklist with categories like Development, Design, Testing, Deployment, Presentation, etc. Include specific tasks, timelines, and milestones.`
      }
    ];

    const response = await this.sendMessage(messages);
    
    return {
      overview: `Comprehensive project checklist for ${workflowData.originalIdea} - organized by categories with specific tasks and timelines to ensure successful hackathon completion.`,
      categories: [
        {
          name: 'Planning & Setup',
          items: [
            { task: 'Define project scope and requirements', description: 'Clear definition of what will be built', completed: false },
            { task: 'Set up development environment', description: 'Install tools and dependencies', completed: false },
            { task: 'Create project repository', description: 'Initialize Git repo with proper structure', completed: false },
            { task: 'Plan project timeline', description: 'Break down tasks with time estimates', completed: false },
          ]
        },
        {
          name: 'Development',
          items: [
            { task: 'Implement core features', description: 'Build the main functionality', completed: false },
            { task: 'Create user interface', description: 'Design and implement UI components', completed: false },
            { task: 'Set up database', description: 'Configure data storage and models', completed: false },
            { task: 'Implement API endpoints', description: 'Create backend services', completed: false },
          ]
        },
        {
          name: 'Testing & Quality',
          items: [
            { task: 'Test core functionality', description: 'Verify all features work correctly', completed: false },
            { task: 'Cross-browser testing', description: 'Ensure compatibility across browsers', completed: false },
            { task: 'Mobile responsiveness', description: 'Test on different screen sizes', completed: false },
            { task: 'Performance optimization', description: 'Optimize loading times and responsiveness', completed: false },
          ]
        },
        {
          name: 'Deployment',
          items: [
            { task: 'Deploy to hosting platform', description: 'Make the app publicly accessible', completed: false },
            { task: 'Configure domain/URL', description: 'Set up custom domain if needed', completed: false },
            { task: 'Set up monitoring', description: 'Add error tracking and analytics', completed: false },
            { task: 'Create backup plan', description: 'Ensure data and code are backed up', completed: false },
          ]
        },
        {
          name: 'Presentation',
          items: [
            { task: 'Create pitch deck', description: 'Prepare presentation slides', completed: false },
            { task: 'Record demo video', description: 'Create product demonstration', completed: false },
            { task: 'Practice presentation', description: 'Rehearse pitch and demo', completed: false },
            { task: 'Prepare for Q&A', description: 'Anticipate and prepare for questions', completed: false },
          ]
        },
      ],
      timeline: response.reply.content,
    };
  }
  async generatePrompt(projectType: string, requirements: string): Promise<string> {
    const messages: ApiMessage[] = [
      {
        role: 'system',
        content: 'You are an expert prompt engineer. Generate detailed, optimized prompts for development tools and AI assistants based on project requirements. Include specific technical details, constraints, and desired outcomes.'
      },
      {
        role: 'user',
        content: `Generate a detailed and optimized prompt for a ${projectType} project with these requirements: ${requirements}\n\nCreate a comprehensive prompt that includes technical specifications, design requirements, functionality details, and any specific constraints or preferences.`
      }
    ];

    const response = await this.sendMessage(messages);
    return response.reply.content;
  }
}

export const apiService = new ApiService();