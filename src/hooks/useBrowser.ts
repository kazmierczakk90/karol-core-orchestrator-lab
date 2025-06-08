
import { useState, useRef } from 'react';
import { useGlobalStore } from '@/stores/globalStore';
import { BrowserState } from '@/types/common';

export const useBrowser = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { addToHistory } = useGlobalStore();
  
  const [browserState, setBrowserState] = useState<BrowserState>({
    currentUrl: '',
    isLoading: false,
    loadingProgress: 0,
    canGoBack: false,
    canGoForward: false,
    zoomLevel: 100,
    error: null
  });

  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const navigate = (url: string) => {
    let formattedUrl = url;
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.') && !url.includes(' ')) {
        formattedUrl = `https://${url}`;
      } else {
        formattedUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }

    setBrowserState(prev => ({
      ...prev,
      currentUrl: formattedUrl,
      isLoading: true,
      loadingProgress: 0,
      error: null
    }));

    // Simulate loading
    let progress = 0;
    const loadingInterval = setInterval(() => {
      progress += 10;
      setBrowserState(prev => ({
        ...prev,
        loadingProgress: progress
      }));
      
      if (progress >= 100) {
        clearInterval(loadingInterval);
        setBrowserState(prev => ({
          ...prev,
          isLoading: false,
          loadingProgress: 100
        }));
        
        // Add to history
        setHistory(prev => {
          const newHistory = [...prev.slice(0, currentIndex + 1), formattedUrl];
          setCurrentIndex(newHistory.length - 1);
          return newHistory;
        });
        
        // Add to global store history
        try {
          const urlObj = new URL(formattedUrl);
          addToHistory({
            url: formattedUrl,
            title: urlObj.hostname,
          });
        } catch (error) {
          console.error('Invalid URL for history:', formattedUrl);
        }
        
        // Update navigation state
        setBrowserState(prev => ({
          ...prev,
          canGoBack: currentIndex >= 0,
          canGoForward: currentIndex < history.length - 1
        }));
      }
    }, 100);
  };

  const goBack = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      const url = history[newIndex];
      setBrowserState(prev => ({
        ...prev,
        currentUrl: url,
        canGoBack: newIndex > 0,
        canGoForward: true
      }));
    }
  };

  const goForward = () => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      const url = history[newIndex];
      setBrowserState(prev => ({
        ...prev,
        currentUrl: url,
        canGoBack: true,
        canGoForward: newIndex < history.length - 1
      }));
    }
  };

  const reload = () => {
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
  };

  const setZoom = (level: number) => {
    const clampedLevel = Math.max(50, Math.min(200, level));
    setBrowserState(prev => ({
      ...prev,
      zoomLevel: clampedLevel
    }));
  };

  const handleIframeError = () => {
    setBrowserState(prev => ({
      ...prev,
      error: 'Nie można załadować strony. Strona może blokować wyświetlanie w iframe.',
      isLoading: false
    }));
  };

  const clearError = () => {
    setBrowserState(prev => ({
      ...prev,
      error: null
    }));
  };

  return {
    browserState,
    history,
    navigate,
    goBack,
    goForward,
    reload,
    setZoom,
    handleIframeError,
    clearError,
    iframeRef
  };
};
