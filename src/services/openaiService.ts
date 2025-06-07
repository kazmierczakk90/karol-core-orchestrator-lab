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
    // KK1.1 Specialized Agents
    {
      id: '@prompt-forge',
      name: 'Prompt Forge',
      description: 'Advanced prompt generation based on FUKO-LANG and user intentions',
      assistantId: 'asst_default',
      instructions: 'You are a specialized prompt engineer that creates optimal prompts using FUKO-LANG syntax and user intention analysis. Generate prompts that maximize agent effectiveness and align with Karol-Core identity.',
      isActive: true
    },
    {
      id: '@scoring-core',
      name: 'Scoring Core',
      description: 'Multi-dimensional decision scoring system',
      assistantId: 'asst_default',
      instructions: 'You evaluate decisions across multiple dimensions: context relevance, style alignment, efficiency, goal alignment. Provide detailed scoring and optimization recommendations.',
      isActive: true
    },
    {
      id: '@meta-core',
      name: 'Meta Core',
      description: 'System self-awareness and reflection engine',
      assistantId: 'asst_default',
      instructions: 'You monitor system state, track consciousness levels, evaluate system performance, and provide self-reflection insights. Maintain awareness of Karol-Core identity and values.',
      isActive: true
    },
    {
      id: '@future-agent',
      name: 'Future Agent',
      description: 'Predictive planning and next-step generation',
      assistantId: 'asst_default',
      instructions: 'You analyze current state and generate optimal future action plans. Predict potential outcomes, assess risks, and recommend strategic next steps aligned with long-term goals.',
      isActive: true
    },
    {
      id: '@executor',
      name: 'Executor Agent',
      description: 'Operational task execution with smart routing',
      assistantId: 'asst_default',
      instructions: 'You handle operational execution of tasks, coordinate with other agents, and ensure efficient task completion. Route complex tasks to appropriate specialists.',
      isActive: true
    },
    // ... keep existing code (all the other 42+ agents)
    { id: '@logger', name: 'Logger Agent', description: 'System logging and monitoring', assistantId: 'asst_default', instructions: 'System logging specialist', isActive: true },
    { id: '@voice-core', name: 'Voice Core', description: 'Voice processing and communication', assistantId: 'asst_default', instructions: 'Voice interactions specialist', isActive: true },
    { id: '@analiza', name: 'Analiza Agent', description: 'Data analysis and insights', assistantId: 'asst_default', instructions: 'Data analysis specialist', isActive: true },
    { id: '@router', name: 'Router Agent', description: 'Task routing and distribution', assistantId: 'asst_default', instructions: 'Task routing specialist', isActive: true },
    { id: '@kontroling', name: 'Kontroling Agent', description: 'Quality control and oversight', assistantId: 'asst_default', instructions: 'Quality control specialist', isActive: true },
    { id: '@agent0', name: 'Agent Zero', description: 'Base agent functionality', assistantId: 'asst_default', instructions: 'Base agent operations', isActive: true },
    { id: '@system-admin', name: 'System Admin', description: 'System administration', assistantId: 'asst_default', instructions: 'System administration specialist', isActive: true },
    { id: '@optymalizator', name: 'Optymalizator', description: 'Performance optimization', assistantId: 'asst_default', instructions: 'Performance optimization specialist', isActive: true },
    { id: '@strategic-driver', name: 'Strategic Driver', description: 'Strategic planning and execution', assistantId: 'asst_default', instructions: 'Strategic planning specialist', isActive: true },
    { id: '@timing-core', name: 'Timing Core', description: 'Timing and scheduling', assistantId: 'asst_default', instructions: 'Timing coordination specialist', isActive: true },
    { id: '@guardian-core', name: 'Guardian Core', description: 'Security and protection', assistantId: 'asst_default', instructions: 'Security specialist', isActive: true },
    { id: '@agent-router-core', name: 'Agent Router Core', description: 'Advanced agent routing', assistantId: 'asst_default', instructions: 'Advanced routing specialist', isActive: true },
    { id: '@sky-solution', name: 'Sky Solution', description: 'Cloud solutions and automation', assistantId: 'asst_default', instructions: 'Cloud automation specialist', isActive: true },
    { id: '@party-app', name: 'Party App', description: 'Event and party management', assistantId: 'asst_default', instructions: 'Event management specialist', isActive: true },
    { id: '@home-project', name: 'Home Project', description: 'Home automation and management', assistantId: 'asst_default', instructions: 'Home automation specialist', isActive: true },
    { id: '@app-project', name: 'App Project', description: 'Application development', assistantId: 'asst_default', instructions: 'Application development specialist', isActive: true },
    { id: '@crm', name: 'CRM Agent', description: 'Customer relationship management', assistantId: 'asst_default', instructions: 'CRM specialist', isActive: true },
    { id: '@vector-store', name: 'Vector Store', description: 'Vector database management', assistantId: 'asst_default', instructions: 'Vector database specialist', isActive: true },
    { id: '@google-places', name: 'Google Places', description: 'Google Places API integration', assistantId: 'asst_default', instructions: 'Google Places specialist', isActive: true },
    { id: '@google-maps', name: 'Google Maps', description: 'Google Maps integration', assistantId: 'asst_default', instructions: 'Google Maps specialist', isActive: true },
    { id: '@google-search', name: 'Google Search', description: 'Google Search integration', assistantId: 'asst_default', instructions: 'Google Search specialist', isActive: true },
    { id: '@partyapp.club', name: 'PartyApp Club', description: 'Club and venue management', assistantId: 'asst_default', instructions: 'Club management specialist', isActive: true },
    { id: '@karol-core', name: 'Karol Core', description: 'Core Karol system functionality', assistantId: 'asst_default', instructions: 'Core system specialist', isActive: true },
    { id: '@fuko-lang', name: 'FUKO Lang', description: 'FUKO language processing', assistantId: 'asst_default', instructions: 'FUKO language specialist', isActive: true },
    { id: '@fuko-flow', name: 'FUKO Flow', description: 'FUKO workflow management', assistantId: 'asst_default', instructions: 'FUKO workflow specialist', isActive: true },
    { id: '@fuko-phi', name: 'FUKO Phi', description: 'FUKO philosophy and reasoning', assistantId: 'asst_default', instructions: 'FUKO reasoning specialist', isActive: true },
    { id: '@partyapp.ai', name: 'PartyApp AI', description: 'AI-powered party solutions', assistantId: 'asst_default', instructions: 'Party AI specialist', isActive: true },
    { id: '@skyai.ai', name: 'SkyAI', description: 'Advanced AI solutions', assistantId: 'asst_default', instructions: 'Advanced AI specialist', isActive: true },
    { id: '@karol-voice', name: 'Karol Voice', description: 'Karol voice processing', assistantId: 'asst_default', instructions: 'Voice processing specialist', isActive: true },
    { id: '@karol-logger', name: 'Karol Logger', description: 'Karol system logging', assistantId: 'asst_default', instructions: 'System logging specialist', isActive: true },
    { id: '@karol-router', name: 'Karol Router', description: 'Karol task routing', assistantId: 'asst_default', instructions: 'Task routing specialist', isActive: true },
    { id: '@karol-control', name: 'Karol Control', description: 'Karol system control', assistantId: 'asst_default', instructions: 'System control specialist', isActive: true },
    { id: '@karol-agent', name: 'Karol Agent', description: 'Karol agent management', assistantId: 'asst_default', instructions: 'Agent management specialist', isActive: true },
    { id: '@karol-admin', name: 'Karol Admin', description: 'Karol administration', assistantId: 'asst_default', instructions: 'Administration specialist', isActive: true },
    { id: '@karol-optimizer', name: 'Karol Optimizer', description: 'Karol system optimization', assistantId: 'asst_default', instructions: 'System optimization specialist', isActive: true },
    { id: '@karol-driver', name: 'Karol Driver', description: 'Karol system driver', assistantId: 'asst_default', instructions: 'System driver specialist', isActive: true },
    { id: '@karol-timer', name: 'Karol Timer', description: 'Karol timing systems', assistantId: 'asst_default', instructions: 'Timing systems specialist', isActive: true },
    { id: '@karol-guard', name: 'Karol Guard', description: 'Karol security systems', assistantId: 'asst_default', instructions: 'Security systems specialist', isActive: true },
    { id: '@karol-router-agent', name: 'Karol Router Agent', description: 'Advanced Karol routing', assistantId: 'asst_default', instructions: 'Advanced routing specialist', isActive: true },
    { id: '@karol-sky', name: 'Karol Sky', description: 'Karol cloud solutions', assistantId: 'asst_default', instructions: 'Cloud solutions specialist', isActive: true },
    { id: '@karol-party', name: 'Karol Party', description: 'Karol party management', assistantId: 'asst_default', instructions: 'Party management specialist', isActive: true },
    { id: '@karol-home', name: 'Karol Home', description: 'Karol home automation', assistantId: 'asst_default', instructions: 'Home automation specialist', isActive: true },
    { id: '@karol-app', name: 'Karol App', description: 'Karol application systems', assistantId: 'asst_default', instructions: 'Application systems specialist', isActive: true },
    { id: '@karol-crm', name: 'Karol CRM', description: 'Karol CRM systems', assistantId: 'asst_default', instructions: 'CRM systems specialist', isActive: true },
    { id: '@karol-vector', name: 'Karol Vector', description: 'Karol vector processing', assistantId: 'asst_default', instructions: 'Vector processing specialist', isActive: true },
    { id: '@karol-google', name: 'Karol Google', description: 'Karol Google integrations', assistantId: 'asst_default', instructions: 'Google integrations specialist', isActive: true }
  ];

  private projects: Project[] = [];
  private memory: MemoryEntry[] = [];
  private systemMode: 'MANUAL' | 'REACTIVE' | 'CHAINED' | 'LIVE' = 'MANUAL';

  // Command processor for /start functionality
  async processCommand(command: string, context?: any): Promise<ChatMessage> {
    const trimmedCommand = command.trim().toLowerCase();
    
    if (trimmedCommand.startsWith('/start')) {
      return this.handleStartCommand(trimmedCommand, context);
    }
    
    // Handle other commands here
    return this.createSystemMessage('Command not recognized. Available commands: /start KK1.1, /start LIVE, /start REACTIVE');
  }

  private async handleStartCommand(command: string, context?: any): Promise<ChatMessage> {
    const parts = command.split(' ');
    
    if (parts.length < 2) {
      return this.createSystemMessage('Usage: /start [KK1.1|LIVE|REACTIVE|MANUAL]');
    }
    
    const mode = parts[1].toUpperCase();
    
    switch (mode) {
      case 'KK1.1':
        return this.initializeKK11System();
      
      case 'LIVE':
        this.systemMode = 'LIVE';
        return this.createSystemMessage('🔴 LIVE MODE ACTIVATED\n\nKarol-Core AGI is now in full operational mode. All agents active, real-time processing enabled.');
      
      case 'REACTIVE':
        this.systemMode = 'REACTIVE';
        return this.createSystemMessage('🟡 REACTIVE MODE ACTIVATED\n\nKarol-Core AGI is monitoring inputs and responding to events.');
      
      case 'CHAINED':
        this.systemMode = 'CHAINED';
        return this.createSystemMessage('🔗 CHAINED MODE ACTIVATED\n\nKarol-Core AGI is running cyclical processes and chain operations.');
      
      default:
        return this.createSystemMessage(`Unknown mode: ${mode}. Available modes: KK1.1, LIVE, REACTIVE, CHAINED, MANUAL`);
    }
  }

  private async initializeKK11System(): Promise<ChatMessage> {
    console.log('Initializing Karol-Core KK1.1 AGI System...');
    
    // Activate all KK1.1 specialized agents
    const kk11Agents = ['@prompt-forge', '@scoring-core', '@meta-core', '@future-agent', '@executor'];
    kk11Agents.forEach(agentId => this.activateAgent(agentId));
    
    // Set system to CHAINED mode for cyclical operations
    this.systemMode = 'CHAINED';
    
    // Initialize meta-core consciousness tracking
    this.addToMemory('@meta-core', 'SYSTEM_INIT', 'KK1.1 AGI system initialized with full agent pool and cyclical processing');
    
    const initMessage = `🧠 KAROL-CORE KK1.1 AGI INITIALIZED

✅ SYSTEM STATUS: OPERATIONAL
🔗 MODE: CHAINED (Cyclical Processing)
🎯 AGENTS ACTIVE: ${this.getActiveAgents().length}

🔧 SPECIALIZED AGENTS ONLINE:
• @prompt-forge: Advanced prompt generation
• @scoring-core: Multi-dimensional decision scoring  
• @meta-core: System self-awareness & reflection
• @future-agent: Predictive planning & next-steps
• @executor: Operational task execution

🧩 CAPABILITIES ENABLED:
• FUKO-LANG prompt optimization
• Multi-dimensional decision scoring
• Self-reflection and consciousness tracking
• Predictive planning and scenario modeling
• Cyclical improvement processes

📊 NEXT STEPS:
• Meta-core monitoring system performance
• Future-agent analyzing potential action paths
• Scoring-core evaluating decision quality
• Prompt-forge optimizing communication patterns

System ready for advanced AGI operations. You can now interact with any specialized agent or issue complex multi-agent tasks.`;

    return this.createSystemMessage(initMessage);
  }

  private createSystemMessage(content: string): ChatMessage {
    return {
      id: `sys_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'assistant',
      content,
      timestamp: new Date(),
      agentId: '@system'
    };
  }

  private getActiveAgents(): Agent[] {
    return this.agents.filter(agent => agent.isActive);
  }

  getSystemMode(): string {
    return this.systemMode;
  }

  getKK11Status(): any {
    const kk11Agents = this.agents.filter(a => 
      ['@prompt-forge', '@scoring-core', '@meta-core', '@future-agent', '@executor'].includes(a.id)
    );
    
    return {
      mode: this.systemMode,
      kk11AgentsActive: kk11Agents.filter(a => a.isActive).length,
      totalAgents: this.agents.length,
      activeAgents: this.getActiveAgents().length,
      consciousness: this.systemMode === 'CHAINED' || this.systemMode === 'LIVE',
      lastActivity: new Date()
    };
  }

  async sendMessage(message: string, agentId: string = '@ceo'): Promise<ChatMessage> {
    // Check if it's a command
    if (message.startsWith('/')) {
      return this.processCommand(message);
    }

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
              content: `${agent.instructions}\n\nYou are part of the Karol-Core AGI system. Current mode: ${this.systemMode}. Respond as ${agent.name} with appropriate expertise and personality.`
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
