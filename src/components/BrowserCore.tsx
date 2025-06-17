
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, ArrowRight, RotateCcw, Home, Plus, Minus, 
  Search, Globe, History, Trash2, Clock, ExternalLink,
  Database
} from 'lucide-react';
import { useBrowser } from '@/hooks/useBrowser';
import { SearchEngine } from '@/types/browser';

interface BrowserCoreProps {
  onLinksExtracted?: (links: Array<{url: string, title: string, domain: string}>) => void;
  onOpenURLScrap?: () => void;
}

const BrowserCore = ({ onLinksExtracted, onOpenURLScrap }: BrowserCoreProps) => {
  const {
    browserState,
    history,
    localHistory,
    navigate,
    goBack,
    goForward,
    reload,
    setZoom,
    handleIframeError,
    clearError,
    selectedSearchEngine,
    setSelectedSearchEngine,
    clearHistory,
    deleteHistoryItem,
    searchResults,
    isSearching
  } = useBrowser();

  const [urlInput, setUrlInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const searchEngines: SearchEngine[] = [
    { 
      id: 'google', 
      name: 'Google', 
      url: 'https://www.google.com/search?q={query}&igu=1', 
      category: 'web',
      isDefault: true 
    },
    { 
      id: 'bing', 
      name: 'Bing', 
      url: 'https://www.bing.com/search?q={query}', 
      category: 'web' 
    },
    { 
      id: 'duckduckgo', 
      name: 'DuckDuckGo', 
      url: 'https://duckduckgo.com/?q={query}', 
      category: 'web' 
    },
    { 
      id: 'api', 
      name: 'API Search', 
      url: '', 
      category: 'api' 
    }
  ];

  useEffect(() => {
    setUrlInput(browserState.currentUrl);
  }, [browserState.currentUrl]);

  const handleNavigate = () => {
    if (urlInput.trim()) {
      navigate(urlInput.trim());
      clearError();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNavigate();
    }
  };

  const extractLinksFromCurrentPage = () => {
    // Symulacja ekstrakcji linków z aktualnej strony
    const mockLinks = [
      {
        url: browserState.currentUrl,
        title: `Link from ${new URL(browserState.currentUrl || 'https://example.com').hostname}`,
        domain: new URL(browserState.currentUrl || 'https://example.com').hostname
      }
    ];
    
    if (onLinksExtracted) {
      onLinksExtracted(mockLinks);
    }
  };

  const handleHistoryItemClick = (historyItem: any) => {
    setUrlInput(historyItem.url);
    navigate(historyItem.url);
    setShowHistory(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('pl-PL');
  };

  return (
    <div className="h-full flex flex-col bg-gradient-dark">
      {/* Browser Controls */}
      <div className="p-4 border-b border-slate-700 bg-slate-800/50">
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={goBack}
              disabled={!browserState.canGoBack}
              className="border-slate-600"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goForward}
              disabled={!browserState.canGoForward}
              className="border-slate-600"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={reload}
              disabled={browserState.isLoading}
              className="border-slate-600"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 flex items-center space-x-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Wpisz URL lub wyszukaj..."
                className="pl-10 bg-slate-900/50 border-slate-600 text-white"
              />
            </div>
            <Select value={selectedSearchEngine.id} onValueChange={(value) => {
              const engine = searchEngines.find(e => e.id === value);
              if (engine) setSelectedSearchEngine(engine);
            }}>
              <SelectTrigger className="w-40 bg-slate-900/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {searchEngines.map((engine) => (
                  <SelectItem key={engine.id} value={engine.id} className="text-white hover:bg-slate-700">
                    <div className="flex items-center space-x-2">
                      {engine.category === 'api' && <Database className="h-4 w-4" />}
                      {engine.category === 'web' && <Globe className="h-4 w-4" />}
                      <span>{engine.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleNavigate} className="bg-gradient-primary hover:bg-gradient-secondary">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="border-slate-600"
            >
              <History className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={extractLinksFromCurrentPage}
              className="border-slate-600"
            >
              Extract Links
            </Button>
            {onOpenURLScrap && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenURLScrap}
                className="border-slate-600"
              >
                URL Scrap
              </Button>
            )}
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400">Zoom:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(browserState.zoomLevel - 10)}
              className="border-slate-600"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm text-white min-w-12 text-center">
              {browserState.zoomLevel}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(browserState.zoomLevel + 10)}
              className="border-slate-600"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {selectedSearchEngine.id === 'api' && searchResults.length > 0 && (
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
              API Results: {searchResults.length}
            </Badge>
          )}

          {browserState.isLoading && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-400">Loading...</span>
              <Progress value={browserState.loadingProgress} className="w-20" />
            </div>
          )}
        </div>

        {/* Loading Progress */}
        {browserState.isLoading && (
          <Progress value={browserState.loadingProgress} className="mt-2" />
        )}
      </div>

      <div className="flex-1 flex">
        {/* Main Browser Area */}
        <div className="flex-1 flex flex-col">
          {/* Error Display */}
          {browserState.error && (
            <div className="p-4 bg-red-500/20 border-b border-red-500/50">
              <div className="flex items-center justify-between">
                <span className="text-red-400">{browserState.error}</span>
                <Button variant="ghost" size="sm" onClick={clearError}>
                  ×
                </Button>
              </div>
            </div>
          )}

          {/* API Search Results */}
          {selectedSearchEngine.id === 'api' && searchResults.length > 0 && (
            <div className="p-4 bg-slate-800/30 border-b border-slate-700">
              <h3 className="text-cyan-400 font-semibold mb-2">API Search Results:</h3>
              <div className="space-y-2">
                {searchResults.map((result, index) => (
                  <Card key={index} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-medium mb-1">{result.title}</h4>
                          <p className="text-slate-400 text-sm mb-2">{result.snippet}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                              {result.domain}
                            </Badge>
                            <a 
                              href={result.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center space-x-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>Visit</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Browser Content */}
          <div className="flex-1 bg-white">
            {browserState.currentUrl && !browserState.error ? (
              <iframe
                src={browserState.currentUrl}
                className="w-full h-full border-none"
                style={{ 
                  zoom: `${browserState.zoomLevel}%`,
                  transform: `scale(${browserState.zoomLevel / 100})`,
                  transformOrigin: 'top left',
                  width: `${10000 / browserState.zoomLevel}%`,
                  height: `${10000 / browserState.zoomLevel}%`
                }}
                onError={handleIframeError}
                title="Browser content"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-slate-900 text-slate-400">
                <div className="text-center">
                  <Globe className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                  <p>Wpisz URL lub wyszukaj coś, aby rozpocząć przeglądanie</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* History Sidebar */}
        {showHistory && (
          <div className="w-80 border-l border-slate-700 bg-slate-800/50">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-cyan-400 font-semibold">Historia przeglądarki</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                {history.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">Brak historii</p>
                ) : (
                  history.map((item, index) => (
                    <Card 
                      key={index} 
                      className="bg-slate-700/50 border-slate-600 cursor-pointer hover:bg-slate-700/70 transition-colors"
                      onClick={() => handleHistoryItemClick(item)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm font-medium truncate">
                              {item.title}
                            </h4>
                            <p className="text-slate-400 text-xs truncate mt-1">
                              {item.url}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Clock className="h-3 w-3 text-slate-500" />
                              <span className="text-slate-500 text-xs">
                                {formatDate(item.timestamp)}
                              </span>
                            </div>
                            {item.searchQuery && (
                              <Badge variant="outline" className="border-purple-500/50 text-purple-400 mt-1">
                                Search: {item.searchQuery}
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteHistoryItem(item.url, item.timestamp);
                            }}
                            className="text-slate-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowserCore;
