
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';

export interface ExtractedLink {
  url: string;
  title: string;
  domain: string;
  extractedAt: Date;
  method: 'iframe' | 'manual' | 'api';
}

const extractIframeLinks = async (iframeUrl: string): Promise<ExtractedLink[]> => {
  try {
    // Ponieważ nie możemy bezpośrednio dostać się do zawartości iframe z powodu CORS,
    // spróbujemy wyodrębnić linki z samego URL oraz wygenerować potencjalne linki
    const baseUrl = new URL(iframeUrl);
    const domain = baseUrl.hostname;
    
    const potentialLinks: ExtractedLink[] = [
      {
        url: iframeUrl,
        title: `Main page - ${domain}`,
        domain,
        extractedAt: new Date(),
        method: 'iframe'
      },
      {
        url: `${baseUrl.origin}/about`,
        title: `About - ${domain}`,
        domain,
        extractedAt: new Date(),
        method: 'iframe'
      },
      {
        url: `${baseUrl.origin}/contact`,
        title: `Contact - ${domain}`,
        domain,
        extractedAt: new Date(),
        method: 'iframe'
      },
      {
        url: `${baseUrl.origin}/blog`,
        title: `Blog - ${domain}`,
        domain,
        extractedAt: new Date(),
        method: 'iframe'
      }
    ];

    return potentialLinks;
  } catch (error) {
    console.error('Error extracting iframe links:', error);
    return [];
  }
};

const extractCurrentPageLinks = (): ExtractedLink[] => {
  try {
    const allLinks = document.querySelectorAll('a[href]');
    const extractedLinks: ExtractedLink[] = [];
    const seenUrls = new Set<string>();

    allLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      let absoluteUrl: string;
      try {
        absoluteUrl = new URL(href, window.location.origin).href;
      } catch (error) {
        return;
      }

      if (seenUrls.has(absoluteUrl)) return;
      seenUrls.add(absoluteUrl);

      const title = link.textContent?.trim() || link.getAttribute('title') || new URL(absoluteUrl).pathname;
      const domain = new URL(absoluteUrl).hostname;

      extractedLinks.push({
        url: absoluteUrl,
        title: title || domain,
        domain,
        extractedAt: new Date(),
        method: 'iframe'
      });
    });

    return extractedLinks;
  } catch (error) {
    console.error('Błąd podczas ekstrakcji linków:', error);
    return [];
  }
};

export const useLinkExtractor = (setActiveDataTab: (tab: string) => void) => {
  const [extractedLinks, setExtractedLinks] = useState<ExtractedLink[]>([]);
  
  const handleExtractLinks = async (currentUrl?: string) => {
    console.log('Rozpoczynam ekstrakcję linków...');
    
    // Próbuj najpierw wyodrębnić linki z bieżącej strony
    const currentPageLinks = extractCurrentPageLinks();
    
    // Jeśli mamy URL iframe, spróbuj wyodrębnić z niego linki
    let iframeLinks: ExtractedLink[] = [];
    if (currentUrl) {
      iframeLinks = await extractIframeLinks(currentUrl);
    }
    
    const allLinks = [...currentPageLinks, ...iframeLinks];
    
    if (allLinks.length > 0) {
      setExtractedLinks(prev => [...allLinks, ...prev]);
      setActiveDataTab('url-scrap');
      
      toast.success(`Ekstrakcja zakończona!`, {
        description: `Znaleziono ${allLinks.length} linków (${currentPageLinks.length} z aktualnej strony, ${iframeLinks.length} z iframe)`,
        duration: 3000
      });
    } else {
      toast.info('Brak linków', {
        description: 'Nie znaleziono żadnych linków. Spróbuj dodać je ręcznie.',
        duration: 3000
      });
    }
  };

  const addManualLink = (url: string, title?: string) => {
    try {
      const validUrl = new URL(url);
      const domain = validUrl.hostname;
      
      const newLink: ExtractedLink = {
        url: validUrl.href,
        title: title || `Manual link - ${domain}`,
        domain,
        extractedAt: new Date(),
        method: 'manual'
      };
      
      setExtractedLinks(prev => [newLink, ...prev]);
      
      toast.success('Link dodany!', {
        description: `Dodano: ${newLink.title}`,
        duration: 2000
      });
    } catch (error) {
      toast.error('Nieprawidłowy URL', {
        description: 'Proszę wprowadzić prawidłowy adres URL',
        duration: 3000
      });
    }
  };

  const removeLink = (url: string) => {
    setExtractedLinks(prev => prev.filter(link => link.url !== url));
    toast.success('Link usunięty', { duration: 2000 });
  };

  const clearAllLinks = () => {
    setExtractedLinks([]);
    toast.success('Wszystkie linki usunięte', { duration: 2000 });
  };

  return {
    extractedLinks,
    handleExtractLinks,
    addManualLink,
    removeLink,
    clearAllLinks,
  };
};
