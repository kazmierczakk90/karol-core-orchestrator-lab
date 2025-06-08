
// Re-export from common types for backward compatibility
export { ExtractionTemplate } from './common';

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

// Unified output format type
export type OutputFormat = 'text' | 'json' | 'html' | 'markdown' | 'csv' | 'excel' | 'xml';

export interface PowerUPTemplate {
  id: string;
  name: string;
  description: string;
  category: 'data-extraction' | 'content-analysis' | 'automation' | 'utility';
  icon: string;
  version: string;
  author: string;
  isPublic: boolean;
  tags: string[];
  configuration: {
    inputType: 'url' | 'text' | 'file' | 'mixed';
    outputFormat: OutputFormat;
    parameters: Record<string, any>;
    selectors?: {
      container: string;
      item: string;
      fields: Record<string, string>;
    };
  };
  usage: {
    instructions: string;
    examples: Array<{
      input: string;
      output: string;
      description: string;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ScraperSchedule {
  id: string;
  name: string;
  description?: string;
  urls: string[];
  templateId?: string;
  schedule: {
    type: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
    interval?: number;
    cronExpression?: string;
    timezone: string;
  };
  settings: {
    parallel: boolean;
    maxConcurrent: number;
    retryOnError: boolean;
    maxRetries: number;
    exportFormat: OutputFormat;
    notificationEmail?: string;
  };
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
  results: SmartExtractionResult[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ExtractionAnalytics {
  totalExtractions: number;
  totalItems: number;
  avgProcessingTime: number;
  successRate: number;
  topDomains: Array<{
    domain: string;
    count: number;
    avgItems: number;
  }>;
  topTemplates: Array<{
    templateId: string;
    templateName: string;
    usageCount: number;
    successRate: number;
  }>;
  timeSeriesData: Array<{
    date: string;
    extractions: number;
    items: number;
    avgTime: number;
  }>;
  errorAnalysis: Array<{
    error: string;
    count: number;
    percentage: number;
  }>;
}
