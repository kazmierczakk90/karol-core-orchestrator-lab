
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';

export interface ExtractedLink {
  url: string;
  title: string;
  domain: string;
}

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
          domain
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
  
  const handleExtractLinks = () => {
    console.log('Rozpoczynam ekstrakcję linków z aktualnej strony...');
    
    const currentPageLinks = extractCurrentPageLinks();
    
    if (currentPageLinks.length > 0) {
      setExtractedLinks(prev => [...currentPageLinks, ...prev]);
      setActiveDataTab('url-scrap');
      
      toast.success(`Ekstrakcja zakończona!`, {
        description: `Znaleziono ${currentPageLinks.length} linków na tej stronie`,
        duration: 3000
      });
    } else {
      toast.info('Brak linków', {
        description: 'Nie znaleziono żadnych linków na tej stronie',
        duration: 3000
      });
    }
  };

  return {
    extractedLinks,
    handleExtractLinks,
  };
};
