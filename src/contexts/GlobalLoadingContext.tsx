import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

interface GlobalLoadingContextType {
  loadingStates: LoadingState;
  setLoading: (key: string, isLoading: boolean) => void;
  isAnyLoading: boolean;
  isLoading: (key: string) => boolean;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

export const useGlobalLoading = () => {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within a GlobalLoadingProvider');
  }
  return context;
};

interface GlobalLoadingProviderProps {
  children: ReactNode;
}

export const GlobalLoadingProvider: React.FC<GlobalLoadingProviderProps> = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

  const setLoading = (key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  };

  const isAnyLoading = Object.values(loadingStates).some(Boolean);
  const isLoading = (key: string) => Boolean(loadingStates[key]);

  return (
    <GlobalLoadingContext.Provider value={{
      loadingStates,
      setLoading,
      isAnyLoading,
      isLoading
    }}>
      {children}
    </GlobalLoadingContext.Provider>
  );
};