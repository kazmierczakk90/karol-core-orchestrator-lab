
// Unified types for the entire platform

export interface SearchEngine {
  id: string;
  name: string;
  url: string;
  icon?: string;
  isDefault?: boolean;
  category?: 'web' | 'academic' | 'shopping' | 'images' | 'video' | 'code';
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
  preprocessing: any[];
  postprocessing: any[];
  isActive: boolean;
  createdAt?: Date;
}

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
    outputFormat: 'text' | 'json' | 'html' | 'markdown' | 'csv' | 'excel' | 'xml';
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

// Template Converter utilities
export const templateConverter = {
  extractionToPowerUP: (template: ExtractionTemplate): PowerUPTemplate => ({
    id: template.id,
    name: template.name,
    description: template.description,
    category: 'data-extraction',
    icon: 'Database',
    version: '1.0.0',
    author: 'Karol-Core',
    isPublic: false,
    tags: [template.category.toLowerCase()],
    configuration: {
      inputType: 'url',
      outputFormat: 'json',
      parameters: {},
      selectors: template.selectors
    },
    usage: {
      instructions: template.description,
      examples: []
    },
    createdAt: template.createdAt || new Date(),
    updatedAt: new Date()
  }),

  powerUPToExtraction: (template: PowerUPTemplate): ExtractionTemplate => ({
    id: template.id,
    name: template.name,
    description: template.description,
    category: template.category,
    domains: [],
    selectors: template.configuration.selectors || {
      container: '',
      item: '',
      fields: {}
    },
    preprocessing: [],
    postprocessing: [],
    isActive: true,
    createdAt: template.createdAt
  })
};

// Type guards
export const isExtractionTemplate = (template: any): template is ExtractionTemplate => {
  return template && 
         typeof template.domains !== 'undefined' && 
         typeof template.selectors !== 'undefined' &&
         typeof template.isActive !== 'undefined';
};

export const isPowerUPTemplate = (template: any): template is PowerUPTemplate => {
  return template && 
         typeof template.configuration !== 'undefined' && 
         typeof template.usage !== 'undefined';
};

export interface SelectedElement {
  selector: string;
  tag: string;
  text: string;
  attributes: Record<string, string>;
}

export interface ExtractedLink {
  url: string;
  title: string;
  domain: string;
}

export interface BrowserHistoryEntry {
  id: string;
  url: string;
  title: string;
  visitedAt: Date;
  favicon?: string;
}

export interface BrowserState {
  currentUrl: string;
  isLoading: boolean;
  loadingProgress: number;
  error: string | null;
  zoomLevel: number;
  canGoBack: boolean;
  canGoForward: boolean;
}

export interface ProcessEntry {
  id: string;
  type: 'extraction' | 'navigation' | 'template' | 'export' | 'error';
  status: 'idle' | 'running' | 'completed' | 'failed';
  title: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  progress: number;
  metadata?: Record<string, any>;
  error?: string;
}

export interface ErrorEntry {
  id: string;
  type: 'compilation' | 'runtime' | 'network' | 'validation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details?: string;
  stackTrace?: string;
  timestamp: Date;
  context?: string;
  resolved: boolean;
}

export interface DraftEntry {
  id: string;
  tabKey: string;
  componentName: string;
  data: any;
  lastSaved: Date;
  autoSaved: boolean;
}

// Window interface extension for Visual Inspector
declare global {
  interface Window {
    karolCoreInspectorActive?: boolean;
    karolCoreInspector?: {
      hoveredElement: any;
      highlightOverlay: any;
      init: () => void;
      createHighlightOverlay: () => void;
      highlightElement: (element: Element) => void;
      hideHighlight: () => void;
      bindEvents: () => void;
      generateSelector: (element: Element) => string;
    };
  }
}
