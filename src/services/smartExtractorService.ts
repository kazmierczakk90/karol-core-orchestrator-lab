
import { LinkExtraction } from '@/types/miniAI';

export interface SmartExtractionResult {
  id: string;
  url: string;
  type: 'list' | 'table' | 'cards' | 'text' | 'mixed';
  confidence: number;
  data: any[];
  metadata: {
    title: string;
    description?: string;
    itemCount: number;
    extractedAt: Date;
    processingTime: number;
  };
  template?: string;
}

export interface ExtractionTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  domains: string[];
  selectors: {
    container: string;
    item: string;
    fields: Record<string, string>;
  };
  preprocessing?: string[];
  postprocessing?: string[];
  isActive: boolean;
}

class SmartExtractorService {
  private templates: ExtractionTemplate[] = [
    {
      id: 'github_repos',
      name: 'GitHub Repositories',
      description: 'Extract repository information from GitHub',
      category: 'Development',
      domains: ['github.com'],
      selectors: {
        container: '[data-testid="results-list"]',
        item: 'li[data-testid="repo-item"]',
        fields: {
          name: 'h3 a',
          description: 'p.color-fg-muted',
          stars: '[href$="/stargazers"]',
          language: '[itemprop="programmingLanguage"]',
          updated: 'relative-time'
        }
      },
      isActive: true
    },
    {
      id: 'linkedin_profiles',
      name: 'LinkedIn Profiles',
      description: 'Extract profile data from LinkedIn search results',
      category: 'Professional',
      domains: ['linkedin.com'],
      selectors: {
        container: '.search-results-container',
        item: '.search-result__wrapper',
        fields: {
          name: '.search-result__result-link',
          title: '.subline-level-1',
          company: '.subline-level-2',
          location: '.search-result__snippets'
        }
      },
      isActive: true
    },
    {
      id: 'amazon_products',
      name: 'Amazon Products',
      description: 'Extract product information from Amazon',
      category: 'E-commerce',
      domains: ['amazon.com', 'amazon.pl'],
      selectors: {
        container: '[data-component-type="s-search-result"]',
        item: '[data-component-type="s-search-result"]',
        fields: {
          title: 'h2 a span',
          price: '.a-price-whole',
          rating: '.a-icon-alt',
          image: '.s-image',
          link: 'h2 a'
        }
      },
      isActive: true
    },
    {
      id: 'generic_list',
      name: 'Generic List Extractor',
      description: 'Universal list extraction for any website',
      category: 'Universal',
      domains: ['*'],
      selectors: {
        container: 'ul, ol, .list, .items, [class*="list"]',
        item: 'li, .item, [class*="item"]',
        fields: {
          text: 'text()',
          link: 'a@href',
          image: 'img@src'
        }
      },
      isActive: true
    }
  ];

  // Intelligent content type detection
  async detectContentType(url: string, htmlContent?: string): Promise<'list' | 'table' | 'cards' | 'text' | 'mixed'> {
    // In real implementation, would analyze HTML structure
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('search') || urlLower.includes('results')) {
      return Math.random() > 0.5 ? 'cards' : 'list';
    }
    if (urlLower.includes('table') || urlLower.includes('data')) {
      return 'table';
    }
    if (urlLower.includes('list') || urlLower.includes('items')) {
      return 'list';
    }
    
    return 'mixed';
  }

  // Smart template matching
  findBestTemplate(url: string): ExtractionTemplate | null {
    const domain = new URL(url).hostname.replace('www.', '');
    
    // Find exact domain match first
    let template = this.templates.find(t => 
      t.domains.some(d => d === domain) && t.isActive
    );
    
    // Fallback to wildcard templates
    if (!template) {
      template = this.templates.find(t => 
        t.domains.includes('*') && t.isActive
      );
    }
    
    return template || null;
  }

  // Advanced extraction with AI assistance
  async extractSmartData(url: string, options: {
    useTemplate?: boolean;
    customSelectors?: Record<string, string>;
    dataTypes?: string[];
    maxItems?: number;
  } = {}): Promise<SmartExtractionResult> {
    const startTime = Date.now();
    const template = options.useTemplate ? this.findBestTemplate(url) : null;
    
    // Simulate intelligent extraction
    const mockData = await this.simulateExtraction(url, template, options);
    
    const result: SmartExtractionResult = {
      id: `extract_${Date.now()}`,
      url,
      type: await this.detectContentType(url),
      confidence: template ? 0.9 : 0.7,
      data: mockData,
      metadata: {
        title: `Extracted data from ${new URL(url).hostname}`,
        description: template?.description,
        itemCount: mockData.length,
        extractedAt: new Date(),
        processingTime: Date.now() - startTime
      },
      template: template?.id
    };

    console.log(`🔍 Smart extraction completed: ${result.metadata.itemCount} items in ${result.metadata.processingTime}ms`);
    return result;
  }

  // Simulate data extraction (in real app would parse actual HTML)
  private async simulateExtraction(url: string, template: ExtractionTemplate | null, options: any): Promise<any[]> {
    const domain = new URL(url).hostname;
    const maxItems = options.maxItems || 10;
    
    if (domain.includes('github.com')) {
      return Array.from({ length: Math.min(maxItems, 8) }, (_, i) => ({
        name: `awesome-project-${i + 1}`,
        description: `Amazing project for developers ${i + 1}`,
        stars: Math.floor(Math.random() * 1000) + 100,
        language: ['JavaScript', 'TypeScript', 'Python', 'Go'][Math.floor(Math.random() * 4)],
        updated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        url: `https://github.com/user/awesome-project-${i + 1}`
      }));
    }
    
    if (domain.includes('linkedin.com')) {
      return Array.from({ length: Math.min(maxItems, 6) }, (_, i) => ({
        name: `John Developer ${i + 1}`,
        title: ['Senior Developer', 'Tech Lead', 'Software Engineer', 'CTO'][Math.floor(Math.random() * 4)],
        company: ['Google', 'Microsoft', 'Apple', 'Meta'][Math.floor(Math.random() * 4)],
        location: ['San Francisco', 'New York', 'London', 'Berlin'][Math.floor(Math.random() * 4)],
        connections: Math.floor(Math.random() * 500) + 50
      }));
    }
    
    if (domain.includes('amazon.')) {
      return Array.from({ length: Math.min(maxItems, 12) }, (_, i) => ({
        title: `Amazing Product ${i + 1}`,
        price: (Math.random() * 100 + 10).toFixed(2),
        currency: 'USD',
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 1000) + 10,
        image: `https://via.placeholder.com/200x200?text=Product${i + 1}`,
        availability: Math.random() > 0.3 ? 'In Stock' : 'Limited'
      }));
    }
    
    // Generic extraction
    return Array.from({ length: Math.min(maxItems, 15) }, (_, i) => ({
      id: i + 1,
      title: `Item ${i + 1}`,
      description: `Description for item ${i + 1}`,
      url: `${url}#item-${i + 1}`,
      extractedAt: new Date().toISOString()
    }));
  }

  // Bulk processing
  async processBulkUrls(urls: string[], options: {
    parallel?: boolean;
    maxConcurrent?: number;
    template?: string;
  } = {}): Promise<SmartExtractionResult[]> {
    const maxConcurrent = options.maxConcurrent || 3;
    const results: SmartExtractionResult[] = [];
    
    if (options.parallel) {
      // Process in batches
      for (let i = 0; i < urls.length; i += maxConcurrent) {
        const batch = urls.slice(i, i + maxConcurrent);
        const batchResults = await Promise.all(
          batch.map(url => this.extractSmartData(url, { useTemplate: true }))
        );
        results.push(...batchResults);
        
        // Small delay between batches
        if (i + maxConcurrent < urls.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } else {
      // Sequential processing
      for (const url of urls) {
        const result = await this.extractSmartData(url, { useTemplate: true });
        results.push(result);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return results;
  }

  // Template management
  getTemplates(category?: string): ExtractionTemplate[] {
    if (category) {
      return this.templates.filter(t => t.category === category && t.isActive);
    }
    return this.templates.filter(t => t.isActive);
  }

  createTemplate(template: Omit<ExtractionTemplate, 'id'>): ExtractionTemplate {
    const newTemplate: ExtractionTemplate = {
      ...template,
      id: `template_${Date.now()}`
    };
    this.templates.push(newTemplate);
    return newTemplate;
  }

  updateTemplate(id: string, updates: Partial<ExtractionTemplate>): boolean {
    const index = this.templates.findIndex(t => t.id === id);
    if (index !== -1) {
      this.templates[index] = { ...this.templates[index], ...updates };
      return true;
    }
    return false;
  }

  deleteTemplate(id: string): boolean {
    const index = this.templates.findIndex(t => t.id === id);
    if (index !== -1) {
      this.templates.splice(index, 1);
      return true;
    }
    return false;
  }

  // Export functionality
  async exportData(results: SmartExtractionResult[], format: 'json' | 'csv' | 'excel' | 'xml'): Promise<Blob> {
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
      
      default:
        return new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    }
  }
}

export const smartExtractorService = new SmartExtractorService();
