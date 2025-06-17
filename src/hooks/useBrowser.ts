
import { useState, useCallback } from 'react';
import { BrowserState, NavigationHistory, SearchEngine } from '@/types/browser';
import { useBrowserHistory } from './useBrowserHistory';
import { useAPISearch } from './useAPISearch';

export const useBrowser = () => {
  const [browserState, setBrowserState] = useState<BrowserState>({
    currentUrl: '',
    isLoading: false,
    loadingProgress: 0,
    error: null,
    zoomLevel: 100,
    canGoBack: false,
    canGoForward: false
  });

  const [localHistory, setLocalHistory] = useState<NavigationHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedSearchEngine, setSelectedSearchEngine] = useState<SearchEngine>({
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com/search?q={query}&igu=1',
    category: 'web',
    isDefault: true
  });

  const { history: dbHistory, addToHistory, clearHistory, deleteHistoryItem } = useBrowserHistory();
  const { searchWithAPI, isSearching, searchResults } = useAPISearch();

  const validateAndFormatUrl = useCallback((input: string): string => {
    if (!input.trim()) return '';
    
    if (!input.includes('.') && !input.startsWith('http')) {
      return input;
    }

    if (!input.startsWith('http://') && !input.startsWith('https://')) {
      return `https://${input}`;
    }

    return input;
  }, []);

  const isValidUrl = useCallback((url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }, []);

  const navigate = useCallback(async (input: string) => {
    const formattedInput = validateAndFormatUrl(input);
    
    setBrowserState(prev => ({
      ...prev,
      isLoading: true,
      loadingProgress: 0,
      error: null
    }));

    let finalUrl = '';
    let title = '';

    if (!isValidUrl(formattedInput)) {
      // To jest query wyszukiwania
      if (selectedSearchEngine.id === 'api') {
        // Użyj API wyszukiwania
        const results = await searchWithAPI(formattedInput);
        if (results && results.results.length > 0) {
          finalUrl = results.results[0].url;
          title = `API Search: ${formattedInput}`;
        } else {
          finalUrl = `https://www.google.com/search?q=${encodeURIComponent(formattedInput)}&igu=1`;
          title = `Search: ${formattedInput}`;
        }
      } else {
        // Użyj wybranego search engine
        finalUrl = selectedSearchEngine.url.replace('{query}', encodeURIComponent(formattedInput));
        title = `Search: ${formattedInput}`;
      }
      
      // Dodaj do historii jako wyszukiwanie
      await addToHistory(finalUrl, title, formattedInput, selectedSearchEngine.name);
    } else {
      finalUrl = formattedInput;
      title = formattedInput;
      
      // Dodaj do historii jako normalna nawigacja
      await addToHistory(finalUrl, title);
    }

    setBrowserState(prev => ({ ...prev, currentUrl: finalUrl }));
    addToLocalHistory(finalUrl, title);

    // Symulacja ładowania
    const progressInterval = setInterval(() => {
      setBrowserState(prev => {
        const newProgress = prev.loadingProgress + 10;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return {
            ...prev,
            loadingProgress: 100,
            isLoading: false
          };
        }
        return { ...prev, loadingProgress: newProgress };
      });
    }, 150);

  }, [validateAndFormatUrl, isValidUrl, selectedSearchEngine, addToHistory, searchWithAPI]);

  const addToLocalHistory = useCallback((url: string, title: string) => {
    const newEntry: NavigationHistory = {
      url,
      title,
      timestamp: Date.now()
    };

    setLocalHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newEntry);
      return newHistory.slice(-20);
    });

    setHistoryIndex(prev => prev + 1);
    updateNavigationState();
  }, [historyIndex]);

  const updateNavigationState = useCallback(() => {
    setBrowserState(prev => ({
      ...prev,
      canGoBack: historyIndex > 0,
      canGoForward: historyIndex < localHistory.length - 1
    }));
  }, [historyIndex, localHistory.length]);

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setBrowserState(prev => ({ 
        ...prev, 
        currentUrl: localHistory[newIndex].url,
        canGoBack: newIndex > 0,
        canGoForward: true
      }));
    }
  }, [historyIndex, localHistory]);

  const goForward = useCallback(() => {
    if (historyIndex < localHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setBrowserState(prev => ({ 
        ...prev, 
        currentUrl: localHistory[newIndex].url,
        canGoBack: true,
        canGoForward: newIndex < localHistory.length - 1
      }));
    }
  }, [historyIndex, localHistory]);

  const reload = useCallback(() => {
    if (browserState.currentUrl) {
      setBrowserState(prev => ({
        ...prev,
        isLoading: true,
        loadingProgress: 0,
        error: null
      }));
      
      setTimeout(() => {
        setBrowserState(prev => ({
          ...prev,
          isLoading: false,
          loadingProgress: 100
        }));
      }, 1000);
    }
  }, [browserState.currentUrl]);

  const setZoom = useCallback((level: number) => {
    setBrowserState(prev => ({
      ...prev,
      zoomLevel: Math.max(50, Math.min(200, level))
    }));
  }, []);

  const handleIframeError = useCallback(() => {
    setBrowserState(prev => ({
      ...prev,
      isLoading: false,
      error: 'Nie można załadować strony. Strona może blokować wyświetlanie w iframe.'
    }));
  }, []);

  const clearError = useCallback(() => {
    setBrowserState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    browserState,
    history: dbHistory,
    localHistory: localHistory.slice(0, historyIndex + 1),
    navigate,
    goBack,
    goForward,
    reload,
    setZoom,
    handleIframeError,
    clearError,
    validateAndFormatUrl,
    isValidUrl,
    selectedSearchEngine,
    setSelectedSearchEngine,
    clearHistory,
    deleteHistoryItem,
    searchResults,
    isSearching
  };
};
