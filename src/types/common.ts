
// Unified types for the entire platform
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
