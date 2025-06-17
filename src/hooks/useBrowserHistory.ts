
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NavigationHistory } from '@/types/browser';

export const useBrowserHistory = () => {
  const [history, setHistory] = useState<NavigationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('browser_history')
        .select('*')
        .order('visited_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const formattedHistory: NavigationHistory[] = data?.map(item => ({
        url: item.url,
        title: item.title || item.url,
        timestamp: new Date(item.visited_at).getTime(),
        domain: item.domain,
        searchQuery: item.search_query,
        searchEngine: item.search_engine
      })) || [];

      setHistory(formattedHistory);
    } catch (error) {
      console.error('Error loading browser history:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToHistory = useCallback(async (url: string, title: string, searchQuery?: string, searchEngine?: string) => {
    try {
      const domain = new URL(url).hostname;
      const sessionId = `session_${Date.now()}`;

      const { error } = await supabase
        .from('browser_history')
        .insert({
          url,
          title,
          domain,
          search_query: searchQuery || null,
          search_engine: searchEngine || null,
          session_id: sessionId,
          visited_at: new Date().toISOString()
        });

      if (error) throw error;

      // Dodaj do lokalnej historii
      const newEntry: NavigationHistory = {
        url,
        title,
        timestamp: Date.now(),
        domain,
        searchQuery,
        searchEngine
      };

      setHistory(prev => [newEntry, ...prev.slice(0, 99)]);
    } catch (error) {
      console.error('Error adding to browser history:', error);
    }
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('browser_history')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all user's history

      if (error) throw error;
      setHistory([]);
    } catch (error) {
      console.error('Error clearing browser history:', error);
    }
  }, []);

  const deleteHistoryItem = useCallback(async (url: string, timestamp: number) => {
    try {
      const visitedAt = new Date(timestamp).toISOString();
      
      const { error } = await supabase
        .from('browser_history')
        .delete()
        .eq('url', url)
        .eq('visited_at', visitedAt);

      if (error) throw error;

      setHistory(prev => prev.filter(item => 
        !(item.url === url && item.timestamp === timestamp)
      ));
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    isLoading,
    addToHistory,
    clearHistory,
    deleteHistoryItem,
    refreshHistory: loadHistory
  };
};
