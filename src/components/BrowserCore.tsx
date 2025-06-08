
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBrowser } from '@/hooks/useBrowser';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Search, Globe, History, Bookmark, ChevronLeft, ChevronRight, 
  RefreshCw, Plus, Star, Link, Menu, X, ZoomIn, ZoomOut, 
  ExternalLink, AlertTriangle 
} from 'lucide-react';

interface ExtractedLink {
  url: string;
  title: string;
  domain: string;
}

interface BrowserCoreProps {
  onLinksExtracted?: (links: ExtractedLink[]) => void;
}

const BrowserCore = ({ onLinksExtracted }: BrowserCoreProps) => {
  const { t, tArray } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [extractedLinks, setExtractedLinks] = useState<ExtractedLink[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const {
    browserState,
    history,
    navigate,
    goBack,
    goForward,
    reload,
    setZoom,
    handleIframeError,
    clearError,
    validateAndFormatUrl
  } = useBrowser();

  const [bookmarks, setBookmarks] = useState([
    { title: 'Karol Core Docs', url: 'https://karol-core.docs' },
    { title: 'AGI Research', url: 'https://agi-research.com' },
    { title: 'FUKO System', url: 'https://fuko.system' }
  ]);

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
      mockLinks.push(
        {
          url: 'https://github.com/karol-core/project',
          title: 'Karol Core Project Repository',
          domain: 'github.com'
        },
        {
          url: 'https://docs.openai.com/api',
          title: 'OpenAI API Documentation',
          domain: 'docs.openai.com'
        },
        {
          url: 'https://lovable.dev',
          title: 'Lovable Platform',
          domain: 'lovable.dev'
        }
      );
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

  const browserFeatures = tArray('browser.features');

  return (
    <div className="h-full flex bg-gradient-dark">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-all duration-300 bg-gradient-dark border-r border-slate-700 flex flex-col fixed md:relative z-50 h-full`}>
        
        <div className="p-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              variant="ghost"
              size="sm"
              className="flex items-center hover:bg-gradient-secondary/20"
            >
              <Globe className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-2">{t('browser.title')}</span>}
            </Button>
            <Button
              onClick={() => setMobileMenuOpen(false)}
              variant="ghost"
              size="sm"
              className="md:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!sidebarCollapsed && (
          <>
            <div className="px-4 pb-4">
              <h3 className="text-sm font-medium text-slate-300 mb-2">{t('browser.history')}</h3>
              <div className="space-y-1">
                {history.slice(-5).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavigation(item.url)}
                    className="w-full text-left p-2 text-xs text-slate-400 hover:text-white hover:bg-gradient-secondary/20 rounded truncate transition-all duration-200"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 pb-4">
              <h3 className="text-sm font-medium text-slate-300 mb-2">{t('browser.bookmarks')}</h3>
              <div className="space-y-1">
                {bookmarks.map((bookmark, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavigation(bookmark.url)}
                    className="w-full text-left p-2 text-xs text-slate-400 hover:text-white hover:bg-gradient-secondary/20 rounded transition-all duration-200"
                  >
                    <Star className="h-3 w-3 inline mr-1" />
                    {bookmark.title}
                  </button>
                ))}
              </div>
            </div>

            {extractedLinks.length > 0 && (
              <div className="px-4 pb-4">
                <h3 className="text-sm font-medium text-slate-300 mb-2">{t('browser.extractedLinks')}</h3>
                <div className="space-y-1">
                  {extractedLinks.slice(0, 5).map((link, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigation(link.url)}
                      className="w-full text-left p-2 text-xs text-slate-400 hover:text-white hover:bg-gradient-secondary/20 rounded transition-all duration-200"
                    >
                      <Link className="h-3 w-3 inline mr-1" />
                      {link.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Main Browser Area */}
      <div className="flex-1 flex flex-col">
        {/* Navigation Bar */}
        <div className="bg-gradient-dark border-b border-slate-700 p-3 md:p-4">
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button
              onClick={() => setMobileMenuOpen(true)}
              variant="ghost"
              size="sm"
              className="md:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>

            <div className="hidden md:flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={goBack}
                disabled={!browserState.canGoBack}
                className="hover:bg-gradient-secondary/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={goForward}
                disabled={!browserState.canGoForward}
                className="hover:bg-gradient-secondary/20"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={reload}
                className="hover:bg-gradient-secondary/20"
              >
                <RefreshCw className={`h-4 w-4 ${browserState.isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            <div className="flex-1 flex items-center space-x-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t('browser.urlPlaceholder')}
                className="bg-slate-900 border-slate-600 text-white text-sm focus:border-cyan-400 transition-colors"
              />
              <Button 
                onClick={handleSearch} 
                size="sm" 
                className="bg-gradient-primary hover:bg-gradient-secondary px-2 md:px-3 hover-gradient-scale"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleExtractLinks} 
                variant="outline" 
                size="sm" 
                className="border-green-500/50 text-green-400 hover:bg-gradient-success/20 px-2 md:px-3 hover-gradient-scale"
              >
                <Link className="h-4 w-4" />
              </Button>
            </div>

            {/* Zoom Controls */}
            {browserState.currentUrl && (
              <div className="hidden md:flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(browserState.zoomLevel - 10)}
                  disabled={browserState.zoomLevel <= 50}
                  className="hover:bg-gradient-secondary/20"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs text-slate-400 w-12 text-center">
                  {browserState.zoomLevel}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(browserState.zoomLevel + 10)}
                  disabled={browserState.zoomLevel >= 200}
                  className="hover:bg-gradient-secondary/20"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openInNewTab}
                  title={t('browser.openInNewTab')}
                  className="hover:bg-gradient-secondary/20"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Loading Progress */}
          {browserState.isLoading && (
            <div className="mt-2">
              <Progress value={browserState.loadingProgress} className="h-1" />
            </div>
          )}
        </div>

        {/* Content Display Area */}
        <div className="flex-1 bg-gradient-dark p-3 md:p-6">
          <Card className="h-full bg-gradient-dark border-slate-700 hover-gradient-scale">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gradient-primary flex items-center space-x-2 text-sm md:text-base">
                  <Globe className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="truncate">{browserState.currentUrl || t('browser.title')}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={`border-green-500/50 text-green-400 text-xs ${browserState.isLoading ? 'animate-pulse' : ''}`}>
                    {browserState.isLoading ? t('common.loading') : t('status.ready')}
                  </Badge>
                  {extractedLinks.length > 0 && (
                    <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-xs">
                      {extractedLinks.length} linków
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-full pb-6">
              {browserState.error && (
                <Alert className="mb-4 border-red-500/50 bg-gradient-error/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-400">
                    {t('browser.errorLoading')}
                    <Button
                      onClick={openInNewTab}
                      variant="link"
                      size="sm"
                      className="ml-2 text-red-300 hover:text-red-100"
                    >
                      {t('browser.openInNewTab')}
                    </Button>
                    <Button
                      onClick={clearError}
                      variant="link"
                      size="sm"
                      className="ml-2 text-red-300 hover:text-red-100"
                    >
                      {t('common.close')}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {browserState.isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <RefreshCw className="h-6 w-6 md:h-8 md:w-8 animate-spin mx-auto mb-4 text-cyan-400" />
                    <p className="text-slate-400 text-sm">{t('browser.loadingContent')}</p>
                    <p className="text-slate-500 text-xs mt-2">{browserState.loadingProgress}%</p>
                  </div>
                </div>
              ) : browserState.currentUrl ? (
                <div className="h-full bg-white rounded border border-slate-600 overflow-hidden">
                  <iframe
                    ref={iframeRef}
                    src={browserState.currentUrl}
                    className="w-full h-full"
                    title="Browser Content"
                    style={{ 
                      transform: `scale(${browserState.zoomLevel / 100})`,
                      transformOrigin: 'top left',
                      width: `${10000 / browserState.zoomLevel}%`,
                      height: `${10000 / browserState.zoomLevel}%`
                    }}
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation-by-user-activation"
                    onError={handleIframeError}
                    onLoad={() => {
                      console.log('Iframe loaded successfully');
                    }}
                  />
                </div>
              ) : (
                <div className="h-full bg-gradient-dark rounded border border-slate-600 p-4 md:p-6">
                  <div className="text-center text-slate-400 space-y-4">
                    <Globe className="h-12 w-12 md:h-16 md:w-16 mx-auto opacity-50 animate-pulse-glow" />
                    <h3 className="text-base md:text-lg font-medium text-gradient-primary">Browser Core Ready</h3>
                    <p className="text-sm">Wpisz URL lub hasło wyszukiwania, aby rozpocząć przeglądanie</p>
                    <div className="text-xs md:text-sm text-slate-500 space-y-2">
                      {browserFeatures.map((feature, index) => (
                        <p key={index}>• {feature}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BrowserCore;
