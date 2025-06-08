import { useState } from 'react';
import { useBrowser } from '@/hooks/useBrowser';
import BrowserNavigation from './browser/BrowserNavigation';
import BrowserSidebar from './browser/BrowserSidebar';
import BrowserContent from './browser/BrowserContent';
interface ExtractedLink {
  url: string;
  title: string;
  domain: string;
}
interface BrowserCoreProps {
  onLinksExtracted?: (links: ExtractedLink[]) => void;
}
const BrowserCore = ({
  onLinksExtracted
}: BrowserCoreProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [extractedLinks, setExtractedLinks] = useState<ExtractedLink[]>([]);
  const {
    browserState,
    history,
    navigate,
    goBack,
    goForward,
    reload,
    setZoom,
    handleIframeError,
    clearError
  } = useBrowser();
  const [bookmarks] = useState([{
    title: 'Karol Core Docs',
    url: 'https://karol-core.docs'
  }, {
    title: 'AGI Research',
    url: 'https://agi-research.com'
  }, {
    title: 'FUKO System',
    url: 'https://fuko.system'
  }]);
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setMobileMenuOpen(false);
    navigate(searchQuery);
    setTimeout(() => {
      extractLinksFromCurrentPage(browserState.currentUrl);
    }, 2000);
  };
  const extractLinksFromCurrentPage = async (url: string) => {
    const mockLinks: ExtractedLink[] = [];
    if (url.includes('google.com/search')) {
      mockLinks.push({
        url: 'https://github.com/karol-core/project',
        title: 'Karol Core Project Repository',
        domain: 'github.com'
      }, {
        url: 'https://docs.openai.com/api',
        title: 'OpenAI API Documentation',
        domain: 'docs.openai.com'
      }, {
        url: 'https://lovable.dev',
        title: 'Lovable Platform',
        domain: 'lovable.dev'
      });
    } else if (url) {
      try {
        const urlObj = new URL(url);
        mockLinks.push({
          url: url,
          title: `Current Page - ${urlObj.hostname}`,
          domain: urlObj.hostname
        });
      } catch (error) {
        console.error('Invalid URL for link extraction:', url);
      }
    }
    setExtractedLinks(mockLinks);
    if (onLinksExtracted && mockLinks.length > 0) {
      onLinksExtracted(mockLinks);
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-gradient-success text-white p-3 rounded-lg shadow-lg z-50 max-w-sm animate-fade-in';
      notification.innerHTML = `
        <div class="font-bold text-sm">Linki wyekstraktowane!</div>
        <div class="text-xs">Znaleziono ${mockLinks.length} linków z bieżącej strony</div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    }
  };
  const handleNavigation = (url: string) => {
    setSearchQuery(url);
    navigate(url);
  };
  const handleExtractLinks = () => {
    if (browserState.currentUrl) {
      extractLinksFromCurrentPage(browserState.currentUrl);
    }
  };
  const openInNewTab = () => {
    if (browserState.currentUrl) {
      window.open(browserState.currentUrl, '_blank');
    }
  };
  const handleZoomChange = (delta: number) => {
    setZoom(browserState.zoomLevel + delta);
  };
  return <div className="h-full flex bg-gradient-dark ">
      {mobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />}

      <BrowserSidebar collapsed={sidebarCollapsed} mobileMenuOpen={mobileMenuOpen} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} onCloseMobile={() => setMobileMenuOpen(false)} onNavigate={handleNavigation} history={history} bookmarks={bookmarks} extractedLinks={extractedLinks} />

      <div className="flex-1 flex flex-col">
        <BrowserNavigation searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} onExtractLinks={handleExtractLinks} onMenuToggle={() => setMobileMenuOpen(true)} onGoBack={goBack} onGoForward={goForward} onReload={reload} onZoomChange={handleZoomChange} onOpenInNewTab={openInNewTab} browserState={browserState} />

        <BrowserContent browserState={browserState} extractedLinks={extractedLinks} onIframeError={handleIframeError} onClearError={clearError} onOpenInNewTab={openInNewTab} />
      </div>
    </div>;
};
export default BrowserCore;