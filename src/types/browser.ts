
export interface SearchEngine {
  id: string;
  name: string;
  url: string;
  icon?: string;
  isDefault?: boolean;
  category?: 'web' | 'academic' | 'shopping' | 'images' | 'video' | 'code' | 'api';
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

export interface NavigationHistory {
  url: string;
  title: string;
  timestamp: number;
  domain?: string;
  searchQuery?: string;
  searchEngine?: string;
}

export interface LinkRule {
  id: string;
  columnName: string;
  columnType: 'string' | 'number' | 'boolean' | 'url' | 'date' | 'tags';
  nullable: boolean;
  defaultValue?: any;
  validation?: string;
  isVisible: boolean;
}

export interface LinkEntry {
  id: string;
  url: string;
  title: string;
  domain: string;
  category: string;
  tags: string[];
  dateAdded: Date;
  lastVisited?: Date;
  description?: string;
  priority: number;
  isActive: boolean;
  metadata: Record<string, any>;
}

export interface BrowserHistoryEntry {
  id: string;
  url: string;
  title: string;
  domain: string;
  visitedAt: Date;
  searchQuery?: string;
  searchEngine?: string;
  sessionId?: string;
}
