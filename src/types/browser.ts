
// Re-export from common types for backward compatibility
export type { BrowserState, SearchEngine } from './common';

export interface NavigationHistory {
  url: string;
  title: string;
  timestamp: number;
}
