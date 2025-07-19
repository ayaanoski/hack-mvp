import { PitchDeck, VideoScript, ProjectChecklist, GeneratedComponent, GeneratedTests, MVPKit, ApiResponse, ApiMessage } from "./types";

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

/**
 * ApiService manages all interactions with the backend AI service.
 * It is designed to be a singleton, exported as `apiService`.
 */
class ApiService {
  private apiKey: string;
  private modelName: string;
  private baseURL: string;

  constructor() {
    // It's recommended to use a more secure way to handle API keys in a real-world application.
    this.apiKey = typeof import.meta.env.VITE_IO_API_KEY === 'string' ? import.meta.env.VITE_IO_API_KEY : '';
    this.modelName = typeof import.meta.env.VITE_IO_MODEL_NAME === 'string' ? import.meta.env.VITE_IO_MODEL_NAME : 'meta-llama/Llama-3.3-70B-Instruct';
    this.baseURL = 'https://api.intelligence.io.solutions/api/v1/';
  }

  /**
   * Extracts and parses a JSON object from a string.
   * Handles cases where the JSON is embedded in a markdown code block.
   * @param text The string containing the JSON.
   * @returns A parsed object of type T or null if parsing fails.
   */
  private extractAndParseJson<T>(text: string): T | null {
    // Find a JSON code block, or assume the whole string is JSON.
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
    const potentialJson = jsonMatch ? jsonMatch[1] : text;

    try {
      return JSON.parse(potentialJson) as T;
    } catch (error) {
      console.error("Failed to parse JSON from AI response:", error);
      console.error("Raw response content:", text);
      return null;
    }
  }

  /**
   * Sends a message array to the chat completion API.
   * @param messages The array of messages to send.
   * @returns A promise that resolves to the API response.
   */
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
          temperature: 0.5,
          max_tokens: 4096, // Increased token limit for larger JSON objects
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorBody}`);
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

  /**
   * Generates a comprehensive MVP Kit by asking the AI for a structured JSON response.
   * @param idea The initial project idea.
   * @param refinedDescription The more detailed project description.
   * @returns A promise that resolves to a complete MVPKit object.
   */
  async generateMVPKit(idea: string, refinedDescription: string): Promise<MVPKit> {
    const messages: ApiMessage[] = [
      {
        role: 'system',
        content: `You are an expert MVP generator. Your task is to generate a comprehensive MVP kit. Respond with a single, valid JSON object that conforms to the MVPKit interface. Do not include any text, markdown, or explanation outside of the JSON object.
        
        The JSON structure should be:
        {
          "title": "Project Title - MVP Kit",
          "description": "A detailed description of the project, its purpose, and target audience.",
          "techStack": ["Technology1", "Technology2", "Framework3", "Database4"],
          "features": ["Detailed feature 1 description.", "Detailed feature 2 description.", "User authentication (JWT)."],
          "timeline": "A realistic timeline for the MVP, e.g., '48-hour hackathon: Day 1 - Backend & Core Logic, Day 2 - Frontend & Deployment'.",
          "codeStructure": "A detailed ASCII representation of the project's directory structure (e.g., /src, /components, /api).",
          "deploymentConfig": "Detailed steps for deployment on a platform like Vercel, Netlify, or AWS Amplify, including environment variables."
        }`
      },
      {
        role: 'user',
        content: `Generate a complete MVP kit in the specified JSON format for this idea: "${idea}"\n\nRefined description: "${refinedDescription}"`
      }
    ];

    try {
      const response = await this.sendMessage(messages);
      const mvpKit = this.extractAndParseJson<MVPKit>(response.reply.content);

      if (mvpKit) {
        return mvpKit;
      } else {
        // Fallback if JSON parsing fails
        throw new Error("Failed to parse MVP Kit from AI response. The response was not valid JSON.");
      }
    } catch (error) {
      console.error('Error in generateMVPKit:', error);
      throw new Error(`Failed to generate MVP kit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generates a complete Pitch Deck by asking the AI for a structured JSON response.
   * @param idea The project idea.
   * @param refinedDescription The detailed project description.
   * @returns A promise that resolves to a complete PitchDeck object.
   */
  async generatePitchDeck(idea: string, refinedDescription: string): Promise<PitchDeck> {
    const messages: ApiMessage[] = [
      {
        role: 'system',
        content: `You are an expert pitch deck creator for hackathons. Generate comprehensive pitch deck content as a single, valid JSON object that conforms to the PitchDeck interface. Do not include any explanatory text outside the JSON object.

        JSON structure:
        {
          "overview": "A compelling overview of the pitch deck's narrative.",
          "slides": [
            { "title": "Problem", "description": "Clearly define the core problem you're solving with compelling data or a relatable story." },
            { "title": "Solution", "description": "Present your innovative solution and how it directly addresses the problem." },
            { "title": "Live Demo", "description": "Outline the key features to be shown in the live demo." },
            { "title": "Tech Stack", "description": "Briefly showcase the technical implementation and why the chosen stack is effective." },
            { "title": "Market & Business Model", "description": "Highlight the market potential and a plausible monetization strategy." },
            { "title": "Team & Next Steps", "description": "Introduce the team and outline future development plans post-hackathon." }
          ],
          "content": "A concise, full-text version of the presentation script.",
          "tips": "Actionable tips for delivering this specific presentation with impact."
        }`
      },
      {
        role: 'user',
        content: `Create a detailed pitch deck in the specified JSON format for this hackathon project: "${idea}"\n\nProject details: "${refinedDescription}"`
      }
    ];

    try {
        const response = await this.sendMessage(messages);
        const pitchDeck = this.extractAndParseJson<PitchDeck>(response.reply.content);
        if (pitchDeck) {
            return pitchDeck;
        } else {
            throw new Error("Failed to parse Pitch Deck from AI response. The response was not valid JSON.");
        }
    } catch (error) {
        console.error('Error in generatePitchDeck:', error);
        throw new Error(`Failed to generate pitch deck: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generates a video script by asking the AI for a structured JSON response.
   * @param idea The project idea.
   * @param refinedDescription The detailed project description.
   * @returns A promise that resolves to a complete VideoScript object.
   */
  async generateVideoScript(idea: string, refinedDescription: string): Promise<VideoScript> {
    const messages: ApiMessage[] = [
      {
        role: 'system',
        content: `You are an expert video script writer for product demos. Create an engaging script as a single, valid JSON object that conforms to the VideoScript interface. No text outside the JSON.

        JSON structure:
        {
          "duration": "Total estimated duration (e.g., '90 seconds').",
          "style": "Visual and narrative style (e.g., 'Fast-paced tech demo with animated overlays').",
          "target": "Target audience (e.g., 'Hackathon judges and potential users').",
          "productionNotes": "Key production notes (e.g., 'Use screen recordings with high-energy background music.').",
          "scenes": [
            { "title": "Hook", "description": "Voice-over to grab attention.", "duration": "15s", "visual": "Description of on-screen visuals." }
          ],
          "fullScript": "A concatenation of all scene descriptions for a readable script."
        }`
      },
      {
        role: 'user',
        content: `Create a detailed video script in the specified JSON format for this project: "${idea}"\n\nProject details: "${refinedDescription}"`
      }
    ];

    try {
        const response = await this.sendMessage(messages);
        const videoScript = this.extractAndParseJson<VideoScript>(response.reply.content);
        if(videoScript) {
            return videoScript;
        } else {
            throw new Error("Failed to parse Video Script from AI response. The response was not valid JSON.");
        }
    } catch (error) {
        console.error('Error in generateVideoScript:', error);
        throw new Error(`Failed to generate video script: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generates a project checklist by asking the AI for a structured JSON response.
   * @param workflowData An object containing the project idea and description.
   * @returns A promise that resolves to a complete ProjectChecklist object.
   */
  async generateChecklist(workflowData: { originalIdea: string, refinedDescription: string }): Promise<ProjectChecklist> {
    const messages: ApiMessage[] = [
      {
        role: 'system',
        content: `You are an expert project manager for hackathons. Generate a comprehensive project checklist as a single, valid JSON object conforming to the ProjectChecklist interface. No text outside the JSON.

        JSON structure:
        {
          "overview": "A brief overview of the project plan.",
          "categories": [
            {
              "name": "Category (e.g., Planning, Backend, Frontend, Deployment)",
              "items": [
                { "task": "Specific task.", "description": "Brief description of the task.", "completed": false }
              ]
            }
          ],
          "timeline": "Summary of the project timeline and key milestones."
        }`
      },
      {
        role: 'user',
        content: `Create a detailed project checklist in the specified JSON format for this hackathon project: "${workflowData.originalIdea}"\n\nProject details: "${workflowData.refinedDescription}"`
      }
    ];

    try {
        const response = await this.sendMessage(messages);
        const projectChecklist = this.extractAndParseJson<ProjectChecklist>(response.reply.content);
        if (projectChecklist) {
            return projectChecklist;
        } else {
            throw new Error("Failed to parse Project Checklist from AI response. The response was not valid JSON.");
        }
    } catch (error) {
        console.error('Error in generateChecklist:', error);
        throw new Error(`Failed to generate project checklist: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generates a detailed prompt for another AI or tool.
   * @param projectType The type of project (e.g., 'Landing Page', 'API').
   * @param requirements The specific requirements.
   * @returns A promise that resolves to the generated prompt string.
   */
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

  /**
   * Generates a UI component based on a description and framework.
   * @param description The description of the component.
   * @param framework The target framework.
   * @returns A promise that resolves to the component code as a string.
   */
  async generateComponent(description: string, framework: string): Promise<string> {
    const frameworkPrompts = {
      'react-tailwind': 'React with TailwindCSS',
      'chakra-ui': 'React with Chakra UI',
      'flutter': 'Flutter Widget',
      'react-native': 'React Native Component'
    };

    const frameworkName = frameworkPrompts[framework as keyof typeof frameworkPrompts] || frameworkPrompts['react-tailwind'];

    const messages: ApiMessage[] = [
      {
        role: 'system',
        content: `You are an expert frontend developer specializing in ${frameworkName}. Your task is to generate a single file component. The code should be clean, production-ready, responsive, and accessible. Provide only the raw code, including all necessary imports and exports. Do not wrap it in markdown blocks or add any explanations.`
      },
      {
        role: 'user',
        content: `Create a ${frameworkName} component for: "${description}". Ensure it is a complete, self-contained, and functional piece of code.`
      }
    ];

    try {
      const response = await this.sendMessage(messages);
      // Clean up potential markdown fences if the AI includes them despite instructions
      return response.reply.content.replace(/```[\w-]*\n/g, '').replace(/```\n/g, '').replace(/```/g, '').trim();
    } catch (error) {
      console.error('Error in generateComponent:', error);
      throw new Error(`Failed to generate component: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generates various types of tests for a given code input.
   * @param codeInput The code to generate tests for.
   * @param testTypes An array of test types to generate (e.g., ['unit', 'integration']).
   * @returns A promise that resolves to an object containing the generated test code.
   */
  async generateTests(codeInput: string, testTypes: string[]): Promise<{ [key: string]: string }> {
    const tests: { [key: string]: string } = {};

    for (const testType of testTypes) {
      const messages: ApiMessage[] = [];
      
      const systemPrompts = {
        unit: 'You are an expert test engineer. Generate Jest unit tests with comprehensive coverage, edge cases, and proper mocking. Return only the raw test code, without explanations or markdown.',
        integration: 'You are an expert in integration testing. Generate Cypress tests for end-to-end workflows and UI interactions. Return only the raw test code, without explanations or markdown.',
        api: 'You are an expert in API testing. Generate Supertest API tests for HTTP methods, status codes, and response validation. Return only the raw test code, without explanations or markdown.'
      };

      const userPrompts = {
        unit: `Generate Jest unit tests for this code:\n\`\`\`\n${codeInput.substring(0, 2000)}\n\`\`\``,
        integration: `Generate Cypress integration tests for this component/workflow:\n\`\`\`\n${codeInput.substring(0, 2000)}\n\`\`\``,
        api: `Generate Supertest API tests for this Express.js route/controller code:\n\`\`\`\n${codeInput.substring(0, 2000)}\n\`\`\``
      };

      if (!systemPrompts[testType as keyof typeof systemPrompts]) continue;

      messages.push(
        { role: 'system', content: systemPrompts[testType as keyof typeof systemPrompts] },
        { role: 'user', content: userPrompts[testType as keyof typeof userPrompts] }
      );

      try {
        const response = await this.sendMessage(messages);
        // Clean up potential markdown fences
        tests[testType] = response.reply.content.replace(/```[\w-]*\n/g, '').replace(/```\n/g, '').replace(/```/g, '').trim();
      } catch (error) {
        console.error(`Error generating ${testType} tests:`, error);
        tests[testType] = `// Error generating ${testType} tests: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    }

    return tests;
  }
}

// Export a singleton instance of the ApiService
export const apiService = new ApiService();