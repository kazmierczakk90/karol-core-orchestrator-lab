
import { useState } from 'react';
import { useBrowser } from '@/hooks/useBrowser';
import BrowserNavigation from './browser/BrowserNavigation';
import EnhancedBrowserSidebar from './browser/EnhancedBrowserSidebar';
import BrowserContent from './browser/BrowserContent';
import VisualScraperPopup from './scraper/VisualScraperPopup';
import EnhancedVisualElementInspector from './browser/EnhancedVisualElementInspector';
import { useGlobalStore } from '@/stores/globalStore';
import { useProcessStore } from '@/stores/processStore';
import { ExtractionTemplate } from '@/types/common';

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

  const { addProcess, updateProcess, completeProcess } = useProcessStore();

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
    
    const processId = addProcess({
      type: 'navigation',
      status: 'running',
      title: 'Nawigacja do strony',
      description: `Ładowanie: ${searchQuery}`,
      progress: 0
    });

    setMobileMenuOpen(false);
    navigate(searchQuery);
    
    addToHistory({
      url: searchQuery,
      title: `Loading: ${searchQuery}`,
    });
    
    setTimeout(() => {
      updateProcess(processId, { progress: 50 });
      extractLinksFromCurrentPage(searchQuery);
      completeProcess(processId, true);
    }, 2000);
  };

  const extractLinksFromCurrentPage = async (url: string) => {
    const processId = addProcess({
      type: 'extraction',
      status: 'running',
      title: 'Ekstrakcja linków',
      description: `Wydobywanie linków z: ${url}`,
      progress: 0
    });

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
        completeProcess(processId, false, 'Invalid URL format');
        return;
      }
    }
    
    updateProcess(processId, { progress: 80 });
    
    if (mockLinks.length > 0) {
      addExtractedLinks(mockLinks);
      if (onLinksExtracted) {
        onLinksExtracted(mockLinks);
      }
      updateProcess(processId, { 
        progress: 100,
        metadata: { linksCount: mockLinks.length }
      });
      completeProcess(processId, true);
    } else {
      completeProcess(processId, false, 'No links found');
    }
  };

  const handleNavigation = (url: string) => {
    setSearchQuery(url);
    navigate(url);
    
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
    const processId = addProcess({
      type: 'template',
      status: 'running',
      title: 'Tworzenie szablonu',
      description: `Zapisywanie szablonu: ${template.name}`,
      progress: 0
    });

    // Ensure required fields are present
    const completeTemplate: ExtractionTemplate = {
      ...template,
      preprocessing: template.preprocessing || [],
      postprocessing: template.postprocessing || []
    };

    addTemplate(completeTemplate);
    onTemplateCreated?.(completeTemplate);
    setShowVisualScraperPopup(false);
    clearSelectedElements();
    setVisualInspectMode(false);

    updateProcess(processId, { progress: 100 });
    completeProcess(processId, true);
  };

  const handleVisualScraperExecute = (template: ExtractionTemplate) => {
    const processId = addProcess({
      type: 'template',
      status: 'running',
      title: 'Wykonywanie szablonu',
      description: `Uruchamianie: ${template.name}`,
      progress: 0
    });

    onTemplateExecuted?.(template);
    
    setTimeout(() => {
      updateProcess(processId, { progress: 100 });
      completeProcess(processId, true);
    }, 1000);
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

        {visualInspectMode && (
          <EnhancedVisualElementInspector iframeRef={iframeRef} />
        )}
      </div>

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
