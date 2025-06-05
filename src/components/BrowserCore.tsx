
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, History, Bookmark, ChevronLeft, ChevronRight, RefreshCw, Plus, Star, Link } from 'lucide-react';

interface ExtractedLink {
  url: string;
  title: string;
  domain: string;
}

interface BrowserCoreProps {
  onLinksExtracted?: (links: ExtractedLink[]) => void;
}

const BrowserCore = ({ onLinksExtracted }: BrowserCoreProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pageContent, setPageContent] = useState('');
  const [extractedLinks, setExtractedLinks] = useState<ExtractedLink[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const [history, setHistory] = useState([
    'https://docs.lovable.dev',
    'https://karol-core.system',
    'https://github.com/karol-core'
  ]);
  
  const [bookmarks, setBookmarks] = useState([
    { title: 'Karol Core Docs', url: 'https://karol-core.docs' },
    { title: 'AGI Research', url: 'https://agi-research.com' },
    { title: 'FUKO System', url: 'https://fuko.system' }
  ]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    let targetUrl = searchQuery;
    
    // Jeśli nie jest to URL, używamy Google Search
    if (!searchQuery.startsWith('http')) {
      targetUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    }
    
    setCurrentUrl(targetUrl);
    setHistory(prev => [targetUrl, ...prev.slice(0, 9)]);
    
    // Symulacja ładowania strony
    setTimeout(() => {
      setIsLoading(false);
      extractLinksFromCurrentPage(targetUrl);
    }, 2000);
  };

  const extractLinksFromCurrentPage = async (url: string) => {
    // Symulacja ekstrakcji linków z aktualnej strony
    const mockLinks: ExtractedLink[] = [
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
        url: url,
        title: 'Current Page',
        domain: new URL(url).hostname
      }
    ];

    setExtractedLinks(mockLinks);
    
    // Przekaż linki do Link Collector jeśli callback został podany
    if (onLinksExtracted) {
      onLinksExtracted(mockLinks);
    }
  };

  const handleNavigation = (url: string) => {
    setCurrentUrl(url);
    setSearchQuery(url);
    handleSearch();
  };

  const handleExtractLinks = () => {
    if (currentUrl) {
      extractLinksFromCurrentPage(currentUrl);
      // Pokaż notyfikację
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50';
      notification.innerHTML = `
        <div class="font-bold">Linki wyekstraktowane!</div>
        <div class="text-sm">Znaleziono ${extractedLinks.length} linków z bieżącej strony</div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    }
  };

  return (
    <div className="h-full flex bg-slate-900">
      {/* Opera-style Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-slate-800 border-r border-slate-700 flex flex-col`}>
        <div className="p-4">
          <Button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            variant="ghost"
            size="sm"
            className="w-full justify-start"
          >
            <Globe className="h-4 w-4" />
            {!sidebarCollapsed && <span className="ml-2">Browser Core</span>}
          </Button>
        </div>

        {!sidebarCollapsed && (
          <>
            <div className="px-4 pb-4">
              <h3 className="text-sm font-medium text-slate-300 mb-2">Historia</h3>
              <div className="space-y-1">
                {history.slice(0, 5).map((url, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavigation(url)}
                    className="w-full text-left p-2 text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded truncate"
                  >
                    {url}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 pb-4">
              <h3 className="text-sm font-medium text-slate-300 mb-2">Zakładki</h3>
              <div className="space-y-1">
                {bookmarks.map((bookmark, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavigation(bookmark.url)}
                    className="w-full text-left p-2 text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded"
                  >
                    <Star className="h-3 w-3 inline mr-1" />
                    {bookmark.title}
                  </button>
                ))}
              </div>
            </div>

            {extractedLinks.length > 0 && (
              <div className="px-4 pb-4">
                <h3 className="text-sm font-medium text-slate-300 mb-2">Wyekstraktowane Linki</h3>
                <div className="space-y-1">
                  {extractedLinks.slice(0, 5).map((link, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigation(link.url)}
                      className="w-full text-left p-2 text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded"
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
        <div className="bg-slate-800 border-b border-slate-700 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSearch}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            <div className="flex-1 flex items-center space-x-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Wpisz URL lub wyszukaj w Google..."
                className="bg-slate-900 border-slate-600 text-white"
              />
              <Button onClick={handleSearch} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4" />
              </Button>
              <Button onClick={handleExtractLinks} variant="outline" size="sm" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                <Link className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Display Area */}
        <div className="flex-1 bg-slate-900 p-6">
          <Card className="h-full bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-cyan-400 flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>{currentUrl || 'Browser Core'}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-green-500/50 text-green-400">
                    {isLoading ? 'Ładowanie...' : 'Gotowy'}
                  </Badge>
                  {extractedLinks.length > 0 && (
                    <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                      {extractedLinks.length} linków
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-cyan-400" />
                    <p className="text-slate-400">Ładowanie zawartości...</p>
                  </div>
                </div>
              ) : currentUrl ? (
                <div className="h-full bg-white rounded border border-slate-600 overflow-hidden">
                  <iframe
                    ref={iframeRef}
                    src={currentUrl}
                    className="w-full h-full"
                    title="Browser Content"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  />
                </div>
              ) : (
                <div className="h-full bg-slate-900/50 rounded border border-slate-600 p-6">
                  <div className="text-center text-slate-400 space-y-4">
                    <Globe className="h-16 w-16 mx-auto opacity-50" />
                    <h3 className="text-lg font-medium">Browser Core Ready</h3>
                    <p>Wpisz URL lub hasło wyszukiwania, aby rozpocząć przeglądanie</p>
                    <div className="text-sm text-slate-500 space-y-2">
                      <p>• Rendering stron internetowych</p>
                      <p>• Ekstrakcja treści dla AI</p>
                      <p>• Integracja z Mini AI</p>
                      <p>• Automatyczna ekstrakcja linków</p>
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
