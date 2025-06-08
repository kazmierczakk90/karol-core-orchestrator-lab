import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  SelectedElement, 
  ExtractedLink, 
  BrowserHistoryEntry, 
  ExtractionTemplate 
} from '@/types/common';

interface GlobalState {
  // Visual Inspector
  visualInspectMode: boolean;
  selectedElements: SelectedElement[];
  
  // Browser State
  browserHistory: BrowserHistoryEntry[];
  bookmarks: Array<{ title: string; url: string }>;
  
  // Data & Templates
  extractedLinks: ExtractedLink[];
  templates: ExtractionTemplate[];
  
  // UI State
  menuLevel: 1 | 2;
  activeOpenAITab: string;
  activeDataTab: string;
  mobileMenuOpen: boolean;
  
  // Actions - Visual Inspector
  setVisualInspectMode: (active: boolean) => void;
  addSelectedElement: (element: SelectedElement) => void;
  clearSelectedElements: () => void;
  
  // Actions - Browser
  addToHistory: (entry: Omit<BrowserHistoryEntry, 'id' | 'visitedAt'>) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
  
  // Actions - Data
  setExtractedLinks: (links: ExtractedLink[]) => void;
  addExtractedLinks: (links: ExtractedLink[]) => void;
  addTemplate: (template: ExtractionTemplate) => void;
  updateTemplate: (id: string, updates: Partial<ExtractionTemplate>) => void;
  deleteTemplate: (id: string) => void;
  
  // Actions - UI
  setMenuLevel: (level: 1 | 2) => void;
  setActiveOpenAITab: (tab: string) => void;
  setActiveDataTab: (tab: string) => void;
  setMobileMenuOpen: (open: boolean) => void;
  
  // Context-aware actions
  getContextualActions: () => Array<{
    key: string;
    label: string;
    action: () => void;
    shortcut: string;
  }>;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      // ... keep existing code (initial state)
      visualInspectMode: false,
      selectedElements: [],
      browserHistory: [],
      bookmarks: [
        { title: 'Karol Core Docs', url: 'https://karol-core.docs' },
        { title: 'AGI Research', url: 'https://agi-research.com' },
        { title: 'FUKO System', url: 'https://fuko.system' }
      ],
      extractedLinks: [],
      templates: [],
      menuLevel: 1,
      activeOpenAITab: 'browser',
      activeDataTab: 'url-scrap',
      mobileMenuOpen: false,

      // ... keep existing code (all action implementations remain the same)
      setVisualInspectMode: (active) => set({ visualInspectMode: active }),
      
      addSelectedElement: (element) => set((state) => ({
        selectedElements: [...state.selectedElements, element]
      })),
      
      clearSelectedElements: () => set({ selectedElements: [] }),

      addToHistory: (entry) => set((state) => {
        const newEntry: BrowserHistoryEntry = {
          ...entry,
          id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          visitedAt: new Date()
        };
        
        const updatedHistory = [newEntry, ...state.browserHistory].slice(0, 100);
        return { browserHistory: updatedHistory };
      }),
      
      clearHistory: () => set({ browserHistory: [] }),
      
      removeFromHistory: (id) => set((state) => ({
        browserHistory: state.browserHistory.filter(h => h.id !== id)
      })),

      setExtractedLinks: (links) => set({ extractedLinks: links }),
      
      addExtractedLinks: (links) => set((state) => ({
        extractedLinks: [...links, ...state.extractedLinks]
      })),
      
      addTemplate: (template) => set((state) => ({
        templates: [...state.templates, { ...template, createdAt: new Date() }]
      })),
      
      updateTemplate: (id, updates) => set((state) => ({
        templates: state.templates.map(t => 
          t.id === id ? { ...t, ...updates } : t
        )
      })),
      
      deleteTemplate: (id) => set((state) => ({
        templates: state.templates.filter(t => t.id !== id)
      })),

      setMenuLevel: (level) => set({ menuLevel: level }),
      setActiveOpenAITab: (tab) => set({ activeOpenAITab: tab, menuLevel: 1 }),
      setActiveDataTab: (tab) => set({ activeDataTab: tab, menuLevel: 2 }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

      getContextualActions: () => {
        const state = get();
        const actions = [];

        if (state.menuLevel === 1 && state.activeOpenAITab === 'browser') {
          actions.push({
            key: 'V',
            label: 'Toggle Visual Inspector',
            action: () => state.setVisualInspectMode(!state.visualInspectMode),
            shortcut: 'Alt+V'
          });
        }

        if (state.selectedElements.length > 0) {
          actions.push({
            key: 'T',
            label: 'Create Template',
            action: () => {
              state.setActiveDataTab('template-gallery');
              state.setMenuLevel(2);
            },
            shortcut: 'Alt+T'
          });
        }

        if (state.extractedLinks.length > 0) {
          actions.push({
            key: 'E',
            label: 'Export Data',
            action: () => {
              state.setActiveDataTab('export');
              state.setMenuLevel(2);
            },
            shortcut: 'Ctrl+E'
          });
        }

        return actions;
      }
    }),
    {
      name: 'karol-core-global-state',
      partialize: (state) => ({
        browserHistory: state.browserHistory,
        extractedLinks: state.extractedLinks,
        templates: state.templates,
        bookmarks: state.bookmarks
      })
    }
  )
);
