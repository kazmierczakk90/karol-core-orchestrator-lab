
import { useState, useCallback, useEffect } from 'react';
import { BrowserState, NavigationHistory } from '@/types/browser';

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

  const [history, setHistory] = useState<NavigationHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const validateAndFormatUrl = useCallback((input: string): string => {
    if (!input.trim()) return '';
    
    // Jeśli to jest search query (nie URL), zwróć query
    if (!input.includes('.') && !input.startsWith('http')) {
      return input;
    }

    // Dodaj protokół jeśli brakuje
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

  const navigate = useCallback((input: string) => {
    const formattedInput = validateAndFormatUrl(input);
    
    setBrowserState(prev => ({
      ...prev,
      isLoading: true,
      loadingProgress: 0,
      error: null
    }));

    // Jeśli to nie jest valid URL, traktuj jako search query
    if (!isValidUrl(formattedInput)) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(formattedInput)}&igu=1`;
      setBrowserState(prev => ({ ...prev, currentUrl: searchUrl }));
      addToHistory(searchUrl, `Search: ${formattedInput}`);
    } else {
      setBrowserState(prev => ({ ...prev, currentUrl: formattedInput }));
      addToHistory(formattedInput, formattedInput);
    }

    // Symulacja progress loading
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

  }, [validateAndFormatUrl, isValidUrl]);

  const addToHistory = useCallback((url: string, title: string) => {
    const newEntry: NavigationHistory = {
      url,
      title,
      timestamp: Date.now()
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newEntry);
      return newHistory.slice(-20);
    });

    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Update navigation state whenever history or index changes
  useEffect(() => {
    setBrowserState(prev => ({
      ...prev,
      canGoBack: historyIndex > 0,
      canGoForward: historyIndex < history.length - 1
    }));
  }, [historyIndex, history.length]);

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setBrowserState(prev => ({ 
        ...prev, 
        currentUrl: history[newIndex].url,
        canGoBack: newIndex > 0,
        canGoForward: true
      }));
    }
  }, [historyIndex, history]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setBrowserState(prev => ({ 
        ...prev, 
        currentUrl: history[newIndex].url,
        canGoBack: true,
        canGoForward: newIndex < history.length - 1
      }));
    }
  }, [historyIndex, history]);

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
    history: history.slice(0, historyIndex + 1),
    navigate,
    goBack,
    goForward,
    reload,
    setZoom,
    handleIframeError,
    clearError,
    validateAndFormatUrl,
    isValidUrl
  };
};
