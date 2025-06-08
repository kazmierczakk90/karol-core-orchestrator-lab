
// Re-export from common types for backward compatibility
export { BrowserState, SearchEngine } from './common';

export interface SearchEngine {
  id: string;
  name: string;
  url: string;
  icon?: string;
  isDefault?: boolean;
  category?: 'web' | 'academic' | 'shopping' | 'images' | 'video' | 'code';
}

export interface NavigationHistory {
  url: string;
  title: string;
  timestamp: number;
}
