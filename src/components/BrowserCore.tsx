
import { useState } from 'react';
import { useBrowser } from '@/hooks/useBrowser';
import BrowserNavigation from './browser/BrowserNavigation';
import EnhancedBrowserSidebar from './browser/EnhancedBrowserSidebar';
import BrowserContent from './browser/BrowserContent';
import VisualScraperPopup from './scraper/VisualScraperPopup';
import EnhancedVisualElementInspector from './browser/EnhancedVisualElementInspector';
import { useGlobalStore } from '@/stores/globalStore';
import { ExtractionTemplate } from '@/types/smartExtractor';

interface BrowserCoreProps {
  onLinksExtracted?: (links: any[]) => void;
  onTemplateCreated?: (template: ExtractionTemplate) => void;
  onTemplateExecuted?: (template: ExtractionTemplate) => void;
}

const BrowserCore = ({
  onLinksExtracted,
  onTemplateCreated,
  onTemplateExecuted
}: BrowserCoreProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showVisualScraperPopup, setShowVisualScraperPopup] = useState(false);

  const {
    visualInspectMode,
    selectedElements,
    mobileMenuOpen,
    extractedLinks,
    setVisualInspectMode,
    clearSelectedElements,
    setMobileMenuOpen,
    addToHistory,
    addExtractedLinks,
    addTemplate
  } = useGlobalStore();

  const {
    browserState,
    navigate,
    goBack,
    goForward,
    reload,
    setZoom,
    handleIframeError,
    clearError,
    iframeRef
  } = useBrowser();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setMobileMenuOpen(false);
    navigate(searchQuery);
    
    // Add to history
    addToHistory({
      url: searchQuery,
      title: `Loading: ${searchQuery}`,
    });
    
    setTimeout(() => {
      extractLinksFromCurrentPage(searchQuery);
    }, 2000);
  };

  const extractLinksFromCurrentPage = async (url: string) => {
    const mockLinks = [];
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
    
    if (mockLinks.length > 0) {
      addExtractedLinks(mockLinks);
      if (onLinksExtracted) {
        onLinksExtracted(mockLinks);
      }
    }
  };

  const handleNavigation = (url: string) => {
    setSearchQuery(url);
    navigate(url);
    
    // Add to history
    addToHistory({
      url: url,
      title: `Loading: ${url}`,
    });
  };

  const handleExtractLinks = () => {
    if (browserState.currentUrl) {
      extractLinksFromCurrentPage(browserState.currentUrl);
    }
  };

  const handleToggleVisualInspect = () => {
    const newState = !visualInspectMode;
    setVisualInspectMode(newState);
    
    if (newState && browserState.currentUrl) {
      setShowVisualScraperPopup(true);
    } else {
      setShowVisualScraperPopup(false);
      clearSelectedElements();
    }
  };

  const handleVisualScraperSave = (template: ExtractionTemplate) => {
    addTemplate(template);
    onTemplateCreated?.(template);
    setShowVisualScraperPopup(false);
    clearSelectedElements();
    setVisualInspectMode(false);
  };

  const handleVisualScraperExecute = (template: ExtractionTemplate) => {
    onTemplateExecuted?.(template);
  };

  const openInNewTab = () => {
    if (browserState.currentUrl) {
      window.open(browserState.currentUrl, '_blank');
    }
  };

  const handleZoomChange = (delta: number) => {
    setZoom(browserState.zoomLevel + delta);
  };

  return (
    <div className="h-full flex bg-gradient-dark">
      <EnhancedBrowserSidebar 
        collapsed={sidebarCollapsed} 
        mobileMenuOpen={mobileMenuOpen} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
        onCloseMobile={() => setMobileMenuOpen(false)} 
        onNavigate={handleNavigation}
      />

      <div className="flex-1 flex flex-col">
        <BrowserNavigation 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onSearch={handleSearch} 
          onExtractLinks={handleExtractLinks} 
          onMenuToggle={() => setMobileMenuOpen(true)} 
          onGoBack={goBack} 
          onGoForward={goForward} 
          onReload={reload} 
          onZoomChange={handleZoomChange} 
          onOpenInNewTab={openInNewTab} 
          browserState={browserState}
          visualInspectMode={visualInspectMode}
          onToggleVisualInspect={handleToggleVisualInspect}
        />

        <BrowserContent 
          browserState={browserState} 
          extractedLinks={extractedLinks} 
          onIframeError={handleIframeError} 
          onClearError={clearError} 
          onOpenInNewTab={openInNewTab}
          visualInspectMode={visualInspectMode}
          onToggleVisualInspect={handleToggleVisualInspect}
          iframeRef={iframeRef}
        />

        {/* Enhanced Visual Element Inspector */}
        {visualInspectMode && (
          <EnhancedVisualElementInspector iframeRef={iframeRef} />
        )}
      </div>

      {/* Visual Scraper Popup */}
      <VisualScraperPopup
        isOpen={showVisualScraperPopup}
        onClose={() => {
          setShowVisualScraperPopup(false);
          setVisualInspectMode(false);
          clearSelectedElements();
        }}
        onSave={handleVisualScraperSave}
        onExecute={handleVisualScraperExecute}
        currentUrl={browserState.currentUrl}
        selectedElements={selectedElements}
        onRequestVisualSelect={() => {
          setVisualInspectMode(true);
        }}
      />
    </div>
  );
};

export default BrowserCore;
