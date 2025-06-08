
export interface SearchEngine {
  id: string;
  name: string;
  url: string;
  icon?: string;
  isDefault?: boolean;
  category?: 'web' | 'academic' | 'shopping' | 'images' | 'video' | 'code';
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
}
