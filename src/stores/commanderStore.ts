
import { create } from 'zustand';

interface CommanderState {
  selectedAgent: string | null;
  zoomLevel: number;
  formData: {
    industry: string;
    botFunction: string;
    typZadania: string;
    opisZadania: string;
    cel: string;
    agent: string;
    priorytet: string;
    ton: string;
    timeZakres: string;
    format: string;
    trybWykonania: string;
  };
  simulationResults: any[];
  isGenerating: boolean;
  testMode: boolean;
  
  // Actions
  setSelectedAgent: (agentId: string | null) => void;
  setZoomLevel: (level: number) => void;
  setFormData: (data: any) => void;
  addSimulationResult: (result: any) => void;
  clearSimulationResults: () => void;
  setIsGenerating: (generating: boolean) => void;
  setTestMode: (mode: boolean) => void;
}

export const useCommanderStore = create<CommanderState>((set) => ({
  selectedAgent: null,
  zoomLevel: 100,
  formData: {
    industry: '',
    botFunction: '',
    typZadania: '',
    opisZadania: '',
    cel: '',
    agent: '@ceo',
    priorytet: 'normalny',
    ton: 'profesjonalny',
    timeZakres: 'standardowa-praca',
    format: 'raport',
    trybWykonania: 'natychmiastowy'
  },
  simulationResults: [],
  isGenerating: false,
  testMode: true,
  
  setSelectedAgent: (agentId) => set({ selectedAgent: agentId }),
  setZoomLevel: (level) => set({ zoomLevel: level }),
  setFormData: (data) => set((state) => ({ 
    formData: { ...state.formData, ...data } 
  })),
  addSimulationResult: (result) => set((state) => ({ 
    simulationResults: [result, ...state.simulationResults] 
  })),
  clearSimulationResults: () => set({ simulationResults: [] }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setTestMode: (mode) => set({ testMode: mode }),
}));
