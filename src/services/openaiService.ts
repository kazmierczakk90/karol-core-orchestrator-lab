import { ChatMessage, Agent, Project, MemoryEntry, ProjectFile } from '@/types/openai';

class OpenAIService {
  private apiKey = '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';
  private vectorStoreId = 'vs_67e03445b63c819183a0c37c390f5904';
  private defaultAssistantId = 'asst_7foGqdfqZKRBNloPEVXmlrua';
  private baseURL = 'https://api.openai.com/v1';

  private agents: Agent[] = [
    {
      id: '@ceo',
      name: 'CEO Agent',
      description: 'Strategic decision making and high-level planning',
      assistantId: this.defaultAssistantId,
      instructions: 'You are a CEO-level strategic assistant for Karol Core system.',
      isActive: true
    },
    {
      id: '@voice-core',
      name: 'Voice Core',
      description: 'Voice processing and communication',
      assistantId: this.defaultAssistantId,
      instructions: 'You handle voice interactions and audio processing.',
      isActive: true
    },
    {
      id: '@guardian-core',
      name: 'Guardian Core',
      description: 'System monitoring and security',
      assistantId: this.defaultAssistantId,
      instructions: 'You monitor system security and handle alerts.',
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
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: agent.instructions
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const assistantResponse = data.choices[0].message.content;

      // Store in memory
      this.addToMemory(agentId, message, assistantResponse);

      return {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
        agentId
      };
    } catch (error) {
      console.error('Error sending message to OpenAI:', error);
      throw error;
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
