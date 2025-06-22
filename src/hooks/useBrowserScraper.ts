
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/sonner';
import { useAPISearch } from './useAPISearch';

export interface ScrapedData {
  url: string;
  title: string;
  domain: string;
  extractedAt: Date;
  method: 'iframe' | 'manual' | 'api' | 'dom';
  content?: string;
  metadata?: {
    description?: string;
    keywords?: string[];
    images?: string[];
    links?: string[];
  };
}

export const useBrowserScraper = () => {
  const [scrapedData, setScrapedData] = useState<ScrapedData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { searchWithAPI } = useAPISearch();

  const scrapeCurrentPage = useCallback(async (): Promise<ScrapedData[]> => {
    setIsProcessing(true);
    const results: ScrapedData[] = [];
    
    try {
      // Method 1: DOM scraping (current page)
      const domLinks = extractLinksFromDOM();
      results.push(...domLinks);
      
      // Method 2: Meta data extraction
      const metaData = extractMetaData();
      if (metaData) {
        results.push(metaData);
      }
      
      toast.success(`Scraping completed!`, {
        description: `Found ${results.length} items`,
        duration: 3000
      });
      
    } catch (error) {
      console.error('Scraping error:', error);
      toast.error('Scraping failed', {
        description: 'Unable to extract data from current page',
        duration: 3000
      });
    } finally {
      setIsProcessing(false);
    }
    
    setScrapedData(prev => [...results, ...prev]);
    return results;
  }, []);

  const scrapeUrlWithAPI = useCallback(async (url: string): Promise<ScrapedData | null> => {
    setIsProcessing(true);
    
    try {
      const apiResults = await searchWithAPI(`site:${new URL(url).hostname}`);
      
      if (apiResults && apiResults.results.length > 0) {
        const result = apiResults.results[0];
        const scrapedData: ScrapedData = {
          url: result.url,
          title: result.title,
          domain: result.domain || new URL(result.url).hostname,
          extractedAt: new Date(),
          method: 'api',
          content: result.snippet,
          metadata: {
            description: result.snippet,
            keywords: extractKeywords(result.snippet),
            links: [result.url]
          }
        };
        
        setScrapedData(prev => [scrapedData, ...prev]);
        return scrapedData;
      }
    } catch (error) {
      console.error('API scraping error:', error);
      toast.error('API scraping failed', {
        description: 'Unable to extract data via API',
        duration: 3000
      });
    } finally {
      setIsProcessing(false);
    }
    
    return null;
  }, [searchWithAPI]);

  const extractLinksFromDOM = (): ScrapedData[] => {
    const links = document.querySelectorAll('a[href]');
    const extractedLinks: ScrapedData[] = [];
    const seenUrls = new Set<string>();

    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

      try {
        const absoluteUrl = new URL(href, window.location.origin).href;
        if (seenUrls.has(absoluteUrl)) return;
        seenUrls.add(absoluteUrl);

        const title = link.textContent?.trim() || link.getAttribute('title') || absoluteUrl;
        const domain = new URL(absoluteUrl).hostname;

        extractedLinks.push({
          url: absoluteUrl,
          title,
          domain,
          extractedAt: new Date(),
          method: 'dom',
          metadata: {
            links: [absoluteUrl]
          }
        });
      } catch (error) {
        // Invalid URL, skip
      }
    });

    return extractedLinks;
  };

  const extractMetaData = (): ScrapedData | null => {
    try {
      const title = document.title || window.location.href;
      const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content')?.split(',') || [];
      const images = Array.from(document.querySelectorAll('img[src]')).map(img => img.getAttribute('src')).filter(Boolean) as string[];

      return {
        url: window.location.href,
        title,
        domain: window.location.hostname,
        extractedAt: new Date(),
        method: 'dom',
        metadata: {
          description,
          keywords,
          images
        }
      };
    } catch (error) {
      console.error('Meta extraction error:', error);
      return null;
    }
  };

  const extractKeywords = (text: string): string[] => {
    return text.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3)
      .slice(0, 10);
  };

  const clearScrapedData = useCallback(() => {
    setScrapedData([]);
    toast.success('Scraped data cleared', { duration: 2000 });
  }, []);

  const removeScrapedItem = useCallback((url: string) => {
    setScrapedData(prev => prev.filter(item => item.url !== url));
    toast.success('Item removed', { duration: 2000 });
  }, []);

  return {
    scrapedData,
    isProcessing,
    scrapeCurrentPage,
    scrapeUrlWithAPI,
    clearScrapedData,
    removeScrapedItem
  };
};
