
import { MiniAI, MiniAIConfig, CreateMiniAIData, MiniAIExecution, MemoryEntry, LinkExtraction } from '@/types/miniAI';

class MiniAIService {
  private miniAIs: MiniAI[] = [];
  private executions: MiniAIExecution[] = [];
  private memory: MemoryEntry[] = [];

  // Core Mini AI Management
  createMiniAI(
    name: string, 
    type: 'standard-tool' | 'mini-app', 
    config: MiniAIConfig,
    description: string = ''
  ): MiniAI {
    const miniAI: MiniAI = {
      id: `mini_ai_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name,
      type,
      description,
      category: this.getCategoryFromType(type),
      is_active: true,
      is_pinned: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      config,
      author: 'current_user',
      is_public: false
    };

    this.miniAIs.push(miniAI);
    console.log(`✅ Created Mini AI: ${name} (${type})`);
    return miniAI;
  }

  async executeMiniAI(miniAIId: string, input: any): Promise<MiniAIExecution> {
    const miniAI = this.miniAIs.find(m => m.id === miniAIId);
    if (!miniAI) {
      throw new Error(`Mini AI with id ${miniAIId} not found`);
    }

    const execution: MiniAIExecution = {
      id: `exec_${Date.now()}`,
      miniAIId,
      input,
      output: null,
      status: 'running',
      executedAt: new Date(),
      executionTime: 0
    };

    const startTime = Date.now();

    try {
      let result;
      
      switch (miniAI.config.actionType) {
        case 'summarize':
          result = await this.executeSummarize(input, miniAI.config);
          break;
        case 'translate':
          result = await this.executeTranslate(input, miniAI.config);
          break;
        case 'extract':
          result = await this.executeExtract(input, miniAI.config);
          break;
        case 'analyze':
          result = await this.executeAnalyze(input, miniAI.config);
          break;
        default:
          result = await this.executeCustom(input, miniAI.config);
      }

      execution.output = result;
      execution.status = 'completed';
      execution.executionTime = Date.now() - startTime;

      this.addToMemory(miniAI.id, input, result);
      
    } catch (error) {
      execution.status = 'error';
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      execution.executionTime = Date.now() - startTime;
    }

    this.executions.push(execution);
    return execution;
  }

  // Intelligent Link Extractor Implementation
  async extractLinksFromPage(url: string, options: {
    includeNoFollow?: boolean;
    outputFormat?: 'text' | 'json' | 'markdown';
    groupByDomain?: boolean;
  } = {}): Promise<LinkExtraction[]> {
    console.log(`🔗 Extracting links from: ${url}`);
    
    // Simulate DOM parsing (in real implementation would use puppeteer/cheerio)
    const mockLinks: LinkExtraction[] = [
      {
        url: 'https://github.com/karol-org/project',
        title: 'Karol Project Repository',
        domain: 'github.com',
        isNoFollow: false,
        category: 'development'
      },
      {
        url: 'https://docs.openai.com/api',
        title: 'OpenAI API Documentation',
        domain: 'docs.openai.com',
        isNoFollow: false,
        category: 'documentation'
      },
      {
        url: 'https://example.com/ad',
        title: 'Advertisement Link',
        domain: 'example.com',
        isNoFollow: true,
        category: 'advertisement'
      }
    ];

    let filteredLinks = mockLinks;
    
    if (!options.includeNoFollow) {
      filteredLinks = filteredLinks.filter(link => !link.isNoFollow);
    }

    if (options.groupByDomain) {
      filteredLinks.sort((a, b) => a.domain.localeCompare(b.domain));
    }

    console.log(`✅ Extracted ${filteredLinks.length} links`);
    return filteredLinks;
  }

  // Memory Management
  addToMemory(agentId: string, input: any, output: any, importance: 1 | 2 | 3 | 4 | 5 = 3): void {
    const memoryEntry: MemoryEntry = {
      id: `mem_${Date.now()}`,
      agentId,
      content: `Input: ${JSON.stringify(input)}\nOutput: ${JSON.stringify(output)}`,
      context: 'mini_ai_execution',
      importance,
      memoryType: importance >= 4 ? 'permanent' : 'session',
      triggerRules: ['mini_ai_usage'],
      timestamp: new Date()
    };

    this.memory.push(memoryEntry);
    
    // Keep memory size manageable
    if (this.memory.length > 1000) {
      this.memory = this.memory.sort((a, b) => b.importance - a.importance).slice(0, 800);
    }
  }

  // Execution Methods
  private async executeSummarize(input: string, config: MiniAIConfig): Promise<string> {
    const prompt = config.prompt || `Podsumuj następujący tekst w ${config.outputFormat}:`;
    return `${prompt}\n\nTekst: ${input}\n\nPodsumowanie: [Symulowane podsumowanie tekstu...]`;
  }

  private async executeTranslate(input: string, config: MiniAIConfig): Promise<string> {
    return `[Symulowane tłumaczenie]: ${input} → [Translated text]`;
  }

  private async executeExtract(input: string, config: MiniAIConfig): Promise<any> {
    if (config.parameters?.extractType === 'links') {
      return await this.extractLinksFromPage(input, config.parameters);
    }
    return `[Symulowana ekstrakcja danych z]: ${input}`;
  }

  private async executeAnalyze(input: string, config: MiniAIConfig): Promise<string> {
    return `[Symulowana analiza]: ${input} → [Analysis results]`;
  }

  private async executeCustom(input: string, config: MiniAIConfig): Promise<any> {
    const prompt = config.prompt || 'Przetworz następujący tekst:';
    return `${prompt}\n\nInput: ${input}\nOutput: [Custom processing result]`;
  }

  private getCategoryFromType(type: 'standard-tool' | 'mini-app'): string {
    return type === 'standard-tool' ? 'Narzędzia' : 'Mini Aplikacje';
  }

  // Getters
  getMiniAIs(): MiniAI[] {
    return [...this.miniAIs];
  }

  getActiveMiniAIs(): MiniAI[] {
    return this.miniAIs.filter(m => m.is_active);
  }

  getPinnedMiniAIs(): MiniAI[] {
    return this.miniAIs.filter(m => m.is_pinned);
  }

  getExecutions(miniAIId?: string): MiniAIExecution[] {
    if (miniAIId) {
      return this.executions.filter(e => e.miniAIId === miniAIId);
    }
    return [...this.executions];
  }

  getMemory(agentId?: string): MemoryEntry[] {
    if (agentId) {
      return this.memory.filter(m => m.agentId === agentId);
    }
    return [...this.memory];
  }

  // Management Methods
  toggleMiniAI(miniAIId: string): boolean {
    const miniAI = this.miniAIs.find(m => m.id === miniAIId);
    if (miniAI) {
      miniAI.is_active = !miniAI.is_active;
      miniAI.updated_at = new Date().toISOString();
      return true;
    }
    return false;
  }

  pinMiniAI(miniAIId: string): boolean {
    const miniAI = this.miniAIs.find(m => m.id === miniAIId);
    if (miniAI) {
      miniAI.is_pinned = !miniAI.is_pinned;
      return true;
    }
    return false;
  }

  deleteMiniAI(miniAIId: string): boolean {
    const index = this.miniAIs.findIndex(m => m.id === miniAIId);
    if (index !== -1) {
      this.miniAIs.splice(index, 1);
      // Clean up related executions
      this.executions = this.executions.filter(e => e.miniAIId !== miniAIId);
      return true;
    }
    return false;
  }
}

export const miniAIService = new MiniAIService();
