
import { ChatMessage, Agent, Project, MemoryEntry, ProjectFile } from '@/types/openai';

class OpenAIService {
  private baseURL = 'https://api.openai.com/v1';
  private apiKey = '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';
  private vectorStoreId = 'vs_67e0601510188191a419f8ee23dd0110';
  
  private agents: Agent[] = [
    {
      id: '@ceo',
      name: 'CEO Agent (Karol-Core)',
      description: 'Strategic decision making and high-level planning - Karol Core Identity',
      assistantId: 'asst_7foGqdfqZKRBNloPEVXmlrua',
      instructions: 'You are the CEO-level strategic assistant for Karol Core system with full access to project memory and decision-making capabilities.',
      isActive: true
    },
    {
      id: '@voice-core',
      name: 'Voice Core',
      description: 'Voice processing and communication',
      assistantId: 'asst_default',
      instructions: 'You handle voice interactions and audio processing.',
      isActive: true
    },
    {
      id: '@guardian-core',
      name: 'Guardian Core',
      description: 'System monitoring and security',
      assistantId: 'asst_default',
      instructions: 'You monitor system security and handle alerts.',
      isActive: true
    },
    {
      id: '@system-admin',
      name: 'System Admin',
      description: 'System administration and maintenance',
      assistantId: 'asst_default',
      instructions: 'You handle system administration tasks.',
      isActive: true
    }
  ];

  private projects: Project[] = [];
  private memory: MemoryEntry[] = [];

  async sendMessage(message: string, agentId: string = '@ceo'): Promise<ChatMessage> {
    const agent = this.agents.find(a => a.id === agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-1106-preview',
          messages: [
            {
              role: 'system',
              content: `${agent.instructions}\n\nYou are part of the Karol-Core AGI system. Respond as ${agent.name} with appropriate expertise and personality.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 1500,
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const responseText = data.choices[0].message.content;

      // Store in memory
      this.addToMemory(agentId, message, responseText);

      return {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
        agentId
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      // Fallback response
      const fallbackText = `[${agent.name}] Przepraszam, wystąpił błąd podczas komunikacji. Sprawdzam połączenie z systemem Karol-Core...`;
      
      return {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: fallbackText,
        timestamp: new Date(),
        agentId
      };
    }
  }

  async uploadFile(file: File, projectId?: string): Promise<ProjectFile> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', 'assistants');

    try {
      const response = await fetch(`${this.baseURL}/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`File upload error: ${response.statusText}`);
      }

      const data = await response.json();

      const projectFile: ProjectFile = {
        id: `file_${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        openaiFileId: data.id
      };

      // Add to vector store
      await this.addFileToVectorStore(data.id);

      return projectFile;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  private async addFileToVectorStore(fileId: string): Promise<void> {
    try {
      await fetch(`${this.baseURL}/vector_stores/${this.vectorStoreId}/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_id: fileId
        }),
      });
    } catch (error) {
      console.error('Error adding file to vector store:', error);
    }
  }

  createProject(name: string, description: string, agentId: string): Project {
    const project: Project = {
      id: `proj_${Date.now()}`,
      name,
      description,
      agentId,
      files: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.projects.push(project);
    return project;
  }

  private addToMemory(agentId: string, userMessage: string, assistantResponse: string): void {
    const entry: MemoryEntry = {
      id: `mem_${Date.now()}`,
      agentId,
      content: `User: ${userMessage}\nAssistant: ${assistantResponse}`,
      context: 'chat_interaction',
      timestamp: new Date(),
      importance: 5
    };

    this.memory.push(entry);

    // Keep only last 100 entries per agent
    const agentMemory = this.memory.filter(m => m.agentId === agentId);
    if (agentMemory.length > 100) {
      this.memory = this.memory.filter(m => m.agentId !== agentId)
        .concat(agentMemory.slice(-100));
    }
  }

  getAgents(): Agent[] {
    return [...this.agents];
  }

  getProjects(): Project[] {
    return [...this.projects];
  }

  getMemory(agentId?: string): MemoryEntry[] {
    if (agentId) {
      return this.memory.filter(m => m.agentId === agentId);
    }
    return [...this.memory];
  }

  activateAgent(agentId: string): boolean {
    const agent = this.agents.find(a => a.id === agentId);
    if (agent) {
      agent.isActive = true;
      agent.lastUsed = new Date();
      return true;
    }
    return false;
  }

  deactivateAgent(agentId: string): boolean {
    const agent = this.agents.find(a => a.id === agentId);
    if (agent) {
      agent.isActive = false;
      return true;
    }
    return false;
  }
}

export const openaiService = new OpenAIService();
