
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  domain?: string;
}

interface APISearchResponse {
  results: SearchResult[];
  totalResults: number;
  searchTime: number;
}

export const useAPISearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const searchWithAPI = useCallback(async (query: string): Promise<APISearchResponse | null> => {
    setIsSearching(true);
    setError(null);
    
    try {
      // Tutaj używamy stałego klucza API jak podałeś
      const API_KEY = '1e626888-ad21-47ad-be71-7c869f139a57';
      const startTime = Date.now();
      
      // Symulacja API wyszukiwania - w rzeczywistości połączyłbyś się z prawdziwym API
      // Dla demo wykorzystuję mockowane dane
      const mockResults: SearchResult[] = [
        {
          title: `Results for "${query}"`,
          url: `https://example.com/search?q=${encodeURIComponent(query)}`,
          snippet: `This is a search result for "${query}" from API search engine.`,
          domain: 'example.com'
        },
        {
          title: `Advanced ${query} Information`,
          url: `https://docs.example.com/${query.toLowerCase()}`,
          snippet: `Detailed documentation and information about ${query}.`,
          domain: 'docs.example.com'
        },
        {
          title: `${query} - Wikipedia`,
          url: `https://en.wikipedia.org/wiki/${query.replace(/\s+/g, '_')}`,
          snippet: `Wikipedia article about ${query} with comprehensive information.`,
          domain: 'en.wikipedia.org'
        }
      ];

      const searchTime = Date.now() - startTime;
      const result: APISearchResponse = {
        results: mockResults,
        totalResults: mockResults.length,
        searchTime
      };

      // Zapisz wyniki w bazie danych
      await supabase
        .from('api_search_results')
        .insert({
          query,
          results: mockResults,
          api_key_ref: API_KEY,
          result_count: mockResults.length
        });

      setSearchResults(mockResults);
      return result;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('API Search error:', err);
      return null;
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchWithAPI,
    isSearching,
    searchResults,
    error,
    clearResults
  };
};
