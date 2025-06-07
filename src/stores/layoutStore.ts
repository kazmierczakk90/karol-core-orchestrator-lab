
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LayoutElement {
  id: string;
  type: 'component' | 'container' | 'widget';
  name: string;
  component?: string;
  props?: Record<string, any>;
  style?: Record<string, any>;
  children?: string[];
  parentId?: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  constraints?: {
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    resizable?: boolean;
    draggable?: boolean;
    locked?: boolean;
  };
  responsive?: {
    breakpoint: 'mobile' | 'tablet' | 'desktop';
    position: { x: number; y: number; width: number; height: number };
  }[];
}

export interface Layout {
  id: string;
  name: string;
  elements: Record<string, LayoutElement>;
  rootElements: string[];
  activeBreakpoint: 'mobile' | 'tablet' | 'desktop';
  history: {
    past: Layout[];
    future: Layout[];
  };
}

interface LayoutStore {
  layouts: Record<string, Layout>;
  activeLayoutId: string | null;
  selectedElementIds: string[];
  isDragging: boolean;
  isResizing: boolean;
  
  // Layout operations
  createLayout: (name: string) => string;
  deleteLayout: (layoutId: string) => void;
  setActiveLayout: (layoutId: string) => void;
  cloneLayout: (layoutId: string, newName: string) => string;
  
  // Element operations
  addElement: (element: Omit<LayoutElement, 'id'>) => string;
  updateElement: (elementId: string, updates: Partial<LayoutElement>) => void;
  deleteElement: (elementId: string) => void;
  cloneElement: (elementId: string) => string;
  
  // Selection
  selectElements: (elementIds: string[]) => void;
  clearSelection: () => void;
  
  // History
  undo: () => void;
  redo: () => void;
  saveState: () => void;
  
  // Breakpoints
  setBreakpoint: (breakpoint: 'mobile' | 'tablet' | 'desktop') => void;
}

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set, get) => ({
      layouts: {},
      activeLayoutId: null,
      selectedElementIds: [],
      isDragging: false,
      isResizing: false,

      createLayout: (name: string) => {
        const id = `layout-${Date.now()}`;
        const newLayout: Layout = {
          id,
          name,
          elements: {},
          rootElements: [],
          activeBreakpoint: 'desktop',
          history: { past: [], future: [] }
        };
        
        set(state => ({
          layouts: { ...state.layouts, [id]: newLayout },
          activeLayoutId: id
        }));
        
        return id;
      },

      deleteLayout: (layoutId: string) => {
        set(state => {
          const { [layoutId]: deleted, ...rest } = state.layouts;
          return {
            layouts: rest,
            activeLayoutId: state.activeLayoutId === layoutId ? null : state.activeLayoutId
          };
        });
      },

      setActiveLayout: (layoutId: string) => {
        set({ activeLayoutId: layoutId });
      },

      cloneLayout: (layoutId: string, newName: string) => {
        const state = get();
        const originalLayout = state.layouts[layoutId];
        if (!originalLayout) return '';

        const newId = `layout-${Date.now()}`;
        const clonedLayout: Layout = {
          ...originalLayout,
          id: newId,
          name: newName,
          history: { past: [], future: [] }
        };

        set(state => ({
          layouts: { ...state.layouts, [newId]: clonedLayout }
        }));

        return newId;
      },

      addElement: (element: Omit<LayoutElement, 'id'>) => {
        const id = `element-${Date.now()}`;
        const newElement: LayoutElement = { ...element, id };
        
        set(state => {
          if (!state.activeLayoutId) return state;
          
          const layout = state.layouts[state.activeLayoutId];
          const updatedLayout = {
            ...layout,
            elements: { ...layout.elements, [id]: newElement },
            rootElements: element.parentId ? layout.rootElements : [...layout.rootElements, id]
          };
          
          return {
            layouts: { ...state.layouts, [state.activeLayoutId]: updatedLayout }
          };
        });
        
        return id;
      },

      updateElement: (elementId: string, updates: Partial<LayoutElement>) => {
        set(state => {
          if (!state.activeLayoutId) return state;
          
          const layout = state.layouts[state.activeLayoutId];
          const element = layout.elements[elementId];
          if (!element) return state;
          
          const updatedLayout = {
            ...layout,
            elements: {
              ...layout.elements,
              [elementId]: { ...element, ...updates }
            }
          };
          
          return {
            layouts: { ...state.layouts, [state.activeLayoutId]: updatedLayout }
          };
        });
      },

      deleteElement: (elementId: string) => {
        set(state => {
          if (!state.activeLayoutId) return state;
          
          const layout = state.layouts[state.activeLayoutId];
          const { [elementId]: deleted, ...restElements } = layout.elements;
          
          const updatedLayout = {
            ...layout,
            elements: restElements,
            rootElements: layout.rootElements.filter(id => id !== elementId)
          };
          
          return {
            layouts: { ...state.layouts, [state.activeLayoutId]: updatedLayout },
            selectedElementIds: state.selectedElementIds.filter(id => id !== elementId)
          };
        });
      },

      cloneElement: (elementId: string) => {
        const state = get();
        if (!state.activeLayoutId) return '';
        
        const layout = state.layouts[state.activeLayoutId];
        const element = layout.elements[elementId];
        if (!element) return '';
        
        const clonedElement = {
          ...element,
          position: {
            ...element.position,
            x: element.position.x + 20,
            y: element.position.y + 20
          }
        };
        
        return get().addElement(clonedElement);
      },

      selectElements: (elementIds: string[]) => {
        set({ selectedElementIds: elementIds });
      },

      clearSelection: () => {
        set({ selectedElementIds: [] });
      },

      undo: () => {
        set(state => {
          if (!state.activeLayoutId) return state;
          
          const layout = state.layouts[state.activeLayoutId];
          if (layout.history.past.length === 0) return state;
          
          const previous = layout.history.past[layout.history.past.length - 1];
          const updatedLayout = {
            ...previous,
            history: {
              past: layout.history.past.slice(0, -1),
              future: [layout, ...layout.history.future]
            }
          };
          
          return {
            layouts: { ...state.layouts, [state.activeLayoutId]: updatedLayout }
          };
        });
      },

      redo: () => {
        set(state => {
          if (!state.activeLayoutId) return state;
          
          const layout = state.layouts[state.activeLayoutId];
          if (layout.history.future.length === 0) return state;
          
          const next = layout.history.future[0];
          const updatedLayout = {
            ...next,
            history: {
              past: [...layout.history.past, layout],
              future: layout.history.future.slice(1)
            }
          };
          
          return {
            layouts: { ...state.layouts, [state.activeLayoutId]: updatedLayout }
          };
        });
      },

      saveState: () => {
        set(state => {
          if (!state.activeLayoutId) return state;
          
          const layout = state.layouts[state.activeLayoutId];
          const updatedLayout = {
            ...layout,
            history: {
              past: [...layout.history.past, layout].slice(-50), // Keep last 50 states
              future: []
            }
          };
          
          return {
            layouts: { ...state.layouts, [state.activeLayoutId]: updatedLayout }
          };
        });
      },

      setBreakpoint: (breakpoint: 'mobile' | 'tablet' | 'desktop') => {
        set(state => {
          if (!state.activeLayoutId) return state;
          
          const layout = state.layouts[state.activeLayoutId];
          const updatedLayout = {
            ...layout,
            activeBreakpoint: breakpoint
          };
          
          return {
            layouts: { ...state.layouts, [state.activeLayoutId]: updatedLayout }
          };
        });
      }
    }),
    {
      name: 'layout-store',
      partialize: (state) => ({
        layouts: state.layouts,
        activeLayoutId: state.activeLayoutId
      })
    }
  )
);
