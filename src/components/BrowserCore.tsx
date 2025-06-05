
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Globe, History, Bookmark, ChevronLeft, ChevronRight, RefreshCw, Plus, Star } from 'lucide-react';

const BrowserCore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUrl, setCurrentUrl] = useState('https://example.com');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    setIsLoading(true);
    setCurrentUrl(searchQuery.startsWith('http') ? searchQuery : `https://${searchQuery}`);
    setHistory(prev => [currentUrl, ...prev.slice(0, 9)]);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleNavigation = (url: string) => {
    setCurrentUrl(url);
    setSearchQuery(url);
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
              <Button variant="ghost" size="sm" onClick={() => setIsLoading(true)}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            <div className="flex-1 flex items-center space-x-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Wpisz URL lub wyszukaj..."
                className="bg-slate-900 border-slate-600 text-white"
              />
              <Button onClick={handleSearch} size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark className="h-4 w-4" />
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
                  <span>{currentUrl}</span>
                </CardTitle>
                <Badge variant="outline" className="border-green-500/50 text-green-400">
                  {isLoading ? 'Ładowanie...' : 'Połączony'}
                </Badge>
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
              ) : (
                <div className="h-full bg-slate-900/50 rounded border border-slate-600 p-6">
                  <div className="text-center text-slate-400 space-y-4">
                    <Globe className="h-16 w-16 mx-auto opacity-50" />
                    <h3 className="text-lg font-medium">Browser Core Display</h3>
                    <p>Tutaj będzie wyświetlana zawartość stron internetowych</p>
                    <div className="text-sm text-slate-500 space-y-2">
                      <p>• Rendering stron internetowych</p>
                      <p>• Ekstrakcja treści dla AI</p>
                      <p>• Integracja z Mini AI</p>
                      <p>• Link Collection</p>
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
