import { MiniAI, MiniAIConfig, MiniAIExecution, MemoryEntry, LinkExtraction } from '@/types/miniAI';
import { SmartExtractionResult, PowerUPTemplate, OutputFormat } from '@/types/smartExtractor';
import { smartExtractorService } from './smartExtractorService';

class MiniAIService {
  private miniAIs: MiniAI[] = [];
  private executions: MiniAIExecution[] = [];
  private memory: MemoryEntry[] = [];
  private powerUPs: PowerUPTemplate[] = [];

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
      isActive: true,
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      config,
      author: 'current_user',
      isPublic: false
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

  // PowerUP Management
  createPowerUP(
    name: string,
    description: string,
    category: PowerUPTemplate['category'],
    configuration: PowerUPTemplate['configuration']
  ): PowerUPTemplate {
    const powerUP: PowerUPTemplate = {
      id: `powerup_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name,
      description,
      category,
      icon: this.getCategoryIcon(category),
      version: '1.0.0',
      author: 'current_user',
      isPublic: false,
      tags: this.generateTags(name, description, category),
      configuration,
      usage: {
        instructions: this.generateInstructions(configuration),
        examples: this.generateExamples(configuration)
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.powerUPs.push(powerUP);
    console.log(`🚀 Created PowerUP: ${name} (${category})`);
    return powerUP;
  }

  // Intelligent Link Extractor Implementation
  async extractLinksFromPage(url: string, options: {
    includeNoFollow?: boolean;
    outputFormat?: 'text' | 'json' | 'markdown';
    groupByDomain?: boolean;
    smartCategorization?: boolean;
    maxLinks?: number;
  } = {}): Promise<LinkExtraction[]> {
    console.log(`🔗 Enhanced link extraction from: ${url}`);
    
    // Use SmartExtractor for intelligent extraction
    const extractionResult = await smartExtractorService.extractSmartData(url, {
      useTemplate: true,
      customSelectors: {
        link: 'a@href',
        title: 'a',
        description: 'a@title, a@alt'
      },
      maxItems: options.maxLinks || 50
    });

    const links: LinkExtraction[] = extractionResult.data.map((item, index) => {
      const linkUrl = item.url || item.link || `${url}#link-${index}`;
      let domain = '';
      let category = 'general';
      
      try {
        domain = new URL(linkUrl).hostname.replace('www.', '');
        category = this.categorizeLink(linkUrl, item.title || item.name || '');
      } catch (error) {
        domain = 'unknown';
      }

      return {
        url: linkUrl,
        title: item.title || item.name || `Link ${index + 1}`,
        domain,
        isNoFollow: Math.random() > 0.8, // Simulate nofollow detection
        category,
        description: item.description || item.summary || ''
      };
    });

    // Apply filters
    let filteredLinks = links;
    
    if (!options.includeNoFollow) {
      filteredLinks = filteredLinks.filter(link => !link.isNoFollow);
    }

    if (options.groupByDomain) {
      filteredLinks.sort((a, b) => a.domain.localeCompare(b.domain));
    }

    if (options.smartCategorization) {
      filteredLinks = this.enhanceWithSmartCategories(filteredLinks);
    }

    console.log(`✅ Enhanced extraction: ${filteredLinks.length} categorized links`);
    return filteredLinks;
  }

  // Smart link categorization
  private categorizeLink(url: string, title: string): string {
    const urlLower = url.toLowerCase();
    const titleLower = title.toLowerCase();
    
    // Development
    if (urlLower.includes('github') || urlLower.includes('gitlab') || 
        titleLower.includes('repo') || titleLower.includes('code')) {
      return 'development';
    }
    
    // Documentation
    if (urlLower.includes('docs') || urlLower.includes('documentation') ||
        titleLower.includes('docs') || titleLower.includes('guide')) {
      return 'documentation';
    }
    
    // E-commerce
    if (urlLower.includes('shop') || urlLower.includes('buy') || 
        urlLower.includes('cart') || titleLower.includes('price')) {
      return 'ecommerce';
    }
    
    // Social Media
    if (urlLower.includes('twitter') || urlLower.includes('linkedin') ||
        urlLower.includes('facebook') || urlLower.includes('instagram')) {
      return 'social';
    }
    
    // News/Media
    if (urlLower.includes('news') || urlLower.includes('article') ||
        titleLower.includes('news') || titleLower.includes('breaking')) {
      return 'news';
    }
    
    // Professional
    if (urlLower.includes('linkedin') || urlLower.includes('career') ||
        titleLower.includes('job') || titleLower.includes('hiring')) {
      return 'professional';
    }
    
    return 'general';
  }

  private enhanceWithSmartCategories(links: LinkExtraction[]): LinkExtraction[] {
    // Group by category for better organization
    const categories = ['development', 'documentation', 'ecommerce', 'social', 'news', 'professional', 'general'];
    
    return links.sort((a, b) => {
      const aIndex = categories.indexOf(a.category);
      const bIndex = categories.indexOf(b.category);
      return aIndex - bIndex;
    });
  }

  // Enhanced data extraction with AI assistance
  async executeExtract(input: string, config: MiniAIConfig): Promise<any> {
    if (config.parameters?.extractType === 'smart_links') {
      return await this.extractLinksFromPage(input, {
        smartCategorization: true,
        maxLinks: config.parameters?.maxItems || 50,
        groupByDomain: config.parameters?.groupByDomain || false
      });
    }
    
    if (config.parameters?.extractType === 'intelligent_data') {
      const result = await smartExtractorService.extractSmartData(input, {
        useTemplate: true,
        dataTypes: config.parameters?.dataTypes,
        maxItems: config.parameters?.maxItems
      });
      
      return {
        type: result.type,
        confidence: result.confidence,
        items: result.data,
        metadata: result.metadata,
        template: result.template
      };
    }
    
    // Fallback to basic extraction
    return `[Enhanced extraction from]: ${input}`;
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

  // PowerUP helper methods
  private getCategoryIcon(category: PowerUPTemplate['category']): string {
    switch (category) {
      case 'data-extraction': return '🔍';
      case 'content-analysis': return '📊';
      case 'automation': return '⚡';
      case 'utility': return '🔧';
      default: return '💡';
    }
  }

  private generateTags(name: string, description: string, category: string): string[] {
    const words = `${name} ${description}`.toLowerCase().split(/\s+/);
    const commonTags = {
      'data-extraction': ['scraping', 'extraction', 'data', 'mining'],
      'content-analysis': ['analysis', 'content', 'text', 'sentiment'],
      'automation': ['automation', 'workflow', 'process', 'batch'],
      'utility': ['utility', 'tool', 'helper', 'function']
    };
    
    const baseTags = commonTags[category] || [];
    const contextTags = words.filter(word => 
      word.length > 3 && 
      !['the', 'and', 'for', 'with', 'from'].includes(word)
    ).slice(0, 3);
    
    return [...baseTags, ...contextTags];
  }

  private generateInstructions(config: PowerUPTemplate['configuration']): string {
    const inputType = config.inputType;
    const outputFormat = config.outputFormat;
    
    return `1. Provide ${inputType} input in the designated field
2. Configure parameters as needed
3. Execute the PowerUP to get ${outputFormat} output
4. Review and export results if needed`;
  }

  private generateExamples(config: PowerUPTemplate['configuration']): Array<{input: string; output: string; description: string}> {
    const examples = [];
    
    if (config.inputType === 'url') {
      examples.push({
        input: 'https://github.com/trending',
        output: '{"repositories": [{"name": "awesome-project", "stars": 1234}]}',
        description: 'Extract trending repositories from GitHub'
      });
    }
    
    if (config.inputType === 'text') {
      examples.push({
        input: 'Lorem ipsum dolor sit amet...',
        output: 'Analyzed text with 95% positive sentiment',
        description: 'Analyze text content for sentiment and key topics'
      });
    }
    
    return examples;
  }

  // Export functionality with corrected type
  async exportData(results: SmartExtractionResult[], format: OutputFormat): Promise<Blob> {
    const allData = results.flatMap(r => r.data.map(item => ({
      source_url: r.url,
      extraction_id: r.id,
      confidence: r.confidence,
      template: r.template,
      extracted_at: r.metadata.extractedAt,
      ...item
    })));

    switch (format) {
      case 'json':
        return new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      
      case 'csv':
        if (allData.length === 0) return new Blob([''], { type: 'text/csv' });
        
        const headers = Object.keys(allData[0]);
        const csvContent = [
          headers.join(','),
          ...allData.map(row => headers.map(header => 
            JSON.stringify(row[header] || '')
          ).join(','))
        ].join('\n');
        
        return new Blob([csvContent], { type: 'text/csv' });
      
      case 'xml':
        const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<extractions>
${allData.map(item => `  <item>
${Object.entries(item).map(([key, value]) => `    <${key}>${value}</${key}>`).join('\n')}
  </item>`).join('\n')}
</extractions>`;
        return new Blob([xmlContent], { type: 'application/xml' });
      
      case 'excel':
        // For now, return CSV format for Excel compatibility
        const excelHeaders = Object.keys(allData[0] || {});
        const excelContent = [
          excelHeaders.join(','),
          ...allData.map(row => excelHeaders.map(header => 
            JSON.stringify(row[header] || '')
          ).join(','))
        ].join('\n');
        return new Blob([excelContent], { type: 'application/vnd.ms-excel' });
      
      case 'markdown':
        if (allData.length === 0) return new Blob(['# No Data'], { type: 'text/markdown' });
        
        const mdHeaders = Object.keys(allData[0]);
        const mdContent = [
          `# Extraction Results`,
          ``,
          `| ${mdHeaders.join(' | ')} |`,
          `| ${mdHeaders.map(() => '---').join(' | ')} |`,
          ...allData.map(row => `| ${mdHeaders.map(header => String(row[header] || '')).join(' | ')} |`)
        ].join('\n');
        
        return new Blob([mdContent], { type: 'text/markdown' });
      
      default:
        return new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    }
  }

  // Getters
  getMiniAIs(): MiniAI[] {
    return [...this.miniAIs];
  }

  getActiveMiniAIs(): MiniAI[] {
    return this.miniAIs.filter(m => m.isActive);
  }

  getPinnedMiniAIs(): MiniAI[] {
    return this.miniAIs.filter(m => m.isPinned);
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

  // PowerUP specific getters
  getPowerUPs(category?: PowerUPTemplate['category']): PowerUPTemplate[] {
    if (category) {
      return this.powerUPs.filter(p => p.category === category);
    }
    return [...this.powerUPs];
  }

  getPublicPowerUPs(): PowerUPTemplate[] {
    return this.powerUPs.filter(p => p.isPublic);
  }

  async executePowerUP(powerUpId: string, input: any): Promise<MiniAIExecution> {
    const powerUP = this.powerUPs.find(p => p.id === powerUpId);
    if (!powerUP) {
      throw new Error(`PowerUP with id ${powerUpId} not found`);
    }

    // Create a temporary MiniAI for execution
    const tempMiniAI = this.createMiniAI(
      powerUP.name,
      'standard-tool',
      {
        actionType: 'extract',
        outputFormat: powerUP.configuration.outputFormat,
        parameters: powerUP.configuration.parameters
      }
    );

    return await this.executeMiniAI(tempMiniAI.id, input);
  }

  // Management Methods
  toggleMiniAI(miniAIId: string): boolean {
    const miniAI = this.miniAIs.find(m => m.id === miniAIId);
    if (miniAI) {
      miniAI.isActive = !miniAI.isActive;
      miniAI.updatedAt = new Date();
      return true;
    }
    return false;
  }

  pinMiniAI(miniAIId: string): boolean {
    const miniAI = this.miniAIs.find(m => m.id === miniAIId);
    if (miniAI) {
      miniAI.isPinned = !miniAI.isPinned;
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

  // Enhanced creation methods
  createSmartExtractorMiniAI(name: string, templateId?: string): MiniAI {
    return this.createMiniAI(
      name,
      'standard-tool',
      {
        actionType: 'extract',
        outputFormat: 'json',
        parameters: {
          extractType: 'intelligent_data',
          template: templateId,
          maxItems: 50,
          smartCategorization: true
        }
      },
      'Smart data extraction using AI-powered templates'
    );
  }

  createLinkCollectorMiniAI(name: string, options: {
    smartCategorization?: boolean;
    groupByDomain?: boolean;
    maxLinks?: number;
  } = {}): MiniAI {
    return this.createMiniAI(
      name,
      'standard-tool',
      {
        actionType: 'extract',
        outputFormat: 'json',
        parameters: {
          extractType: 'smart_links',
          ...options
        }
      },
      'Intelligent link extraction and categorization'
    );
  }
}

export const miniAIService = new MiniAIService();
