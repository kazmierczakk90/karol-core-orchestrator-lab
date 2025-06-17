
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
      const API_KEY = '1e626888-ad21-47ad-be71-7c869f139a57';
      const startTime = Date.now();
      
      // Prawdziwe wywołanie API Linkup.so
      const response = await fetch('https://api.linkup.so/v1/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: query,
          depth: 'standard',
          outputFormat: 'structured'
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const searchTime = Date.now() - startTime;

      // Przetwórz wyniki z API Linkup.so na nasz format
      const processedResults: SearchResult[] = data.results?.map((result: any) => ({
        title: result.name || result.title || 'No title',
        url: result.url,
        snippet: result.content || result.snippet || 'No description available',
        domain: new URL(result.url).hostname
      })) || [];

      const apiResponse: APISearchResponse = {
        results: processedResults,
        totalResults: processedResults.length,
        searchTime
      };

      // Zapisz wyniki w bazie danych
      await supabase
        .from('api_search_results')
        .insert({
          query,
          results: processedResults as any,
          api_key_ref: API_KEY,
          result_count: processedResults.length
        });

      setSearchResults(processedResults);
      return apiResponse;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('API Search error:', err);
      
      // Fallback do mockowanych danych jeśli API nie działa
      const mockResults: SearchResult[] = [
        {
          title: `Results for "${query}" (Offline Mode)`,
          url: `https://example.com/search?q=${encodeURIComponent(query)}`,
          snippet: `This is a fallback result for "${query}" - API connection failed.`,
          domain: 'example.com'
        }
      ];
      
      setSearchResults(mockResults);
      return {
        results: mockResults,
        totalResults: mockResults.length,
        searchTime: Date.now() - Date.now()
      };
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
