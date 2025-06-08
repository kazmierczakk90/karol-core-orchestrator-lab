
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useGlobalStore } from '@/stores/globalStore';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Clock, Bookmark, Link, ChevronRight, ChevronDown, 
  Trash2, ExternalLink, Search, X, Globe
} from 'lucide-react';

interface EnhancedBrowserSidebarProps {
  collapsed: boolean;
  mobileMenuOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onNavigate: (url: string) => void;
}

const EnhancedBrowserSidebar = ({
  collapsed,
  mobileMenuOpen,
  onToggleCollapse,
  onCloseMobile,
  onNavigate,
}: EnhancedBrowserSidebarProps) => {
  const { t } = useTranslation();
  const {
    browserHistory,
    bookmarks,
    extractedLinks,
    removeFromHistory,
    clearHistory
  } = useGlobalStore();

  const [historySearch, setHistorySearch] = useState('');
  const [linksSearch, setLinksSearch] = useState('');
  const [historyExpanded, setHistoryExpanded] = useState(true);
  const [bookmarksExpanded, setBookmarksExpanded] = useState(true);
  const [linksExpanded, setLinksExpanded] = useState(true);

  const filteredHistory = browserHistory.filter(entry =>
    entry.title.toLowerCase().includes(historySearch.toLowerCase()) ||
    entry.url.toLowerCase().includes(historySearch.toLowerCase())
  );

  const filteredLinks = extractedLinks.filter(link =>
    link.title.toLowerCase().includes(linksSearch.toLowerCase()) ||
    link.url.toLowerCase().includes(linksSearch.toLowerCase()) ||
    link.domain.toLowerCase().includes(linksSearch.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <>
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onCloseMobile} 
        />
      )}
      
      <div className={`
        ${collapsed ? 'w-16' : 'w-80'} 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        fixed md:relative h-full bg-gradient-dark border-r border-slate-700 
        transition-all duration-300 z-50 flex flex-col
      `}>
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <h2 className="text-gradient-primary font-bold">Browser Core</h2>
            )}
            <div className="flex items-center space-x-2">
              <Button 
                onClick={onToggleCollapse} 
                variant="ghost" 
                size="sm"
                className="hidden md:block"
              >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <Button 
                onClick={onCloseMobile} 
                variant="ghost" 
                size="sm"
                className="md:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {!collapsed && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Browser History */}
            <Card className="bg-slate-800/50 border-slate-700">
              <Collapsible open={historyExpanded} onOpenChange={setHistoryExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-700/30 transition-colors">
                    <CardTitle className="text-slate-300 flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>History</span>
                        <Badge variant="outline" className="text-xs">
                          {browserHistory.length}
                        </Badge>
                      </div>
                      {historyExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" />
                        <Input
                          value={historySearch}
                          onChange={(e) => setHistorySearch(e.target.value)}
                          placeholder="Search history..."
                          className="pl-9 h-8 bg-slate-700 border-slate-600 text-xs"
                        />
                      </div>

                      {browserHistory.length > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">{filteredHistory.length} entries</span>
                          <Button
                            onClick={clearHistory}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 h-6 text-xs"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Clear All
                          </Button>
                        </div>
                      )}

                      <div className="space-y-1 max-h-60 overflow-y-auto">
                        {filteredHistory.length === 0 ? (
                          <div className="text-center text-slate-400 py-4 text-xs">
                            {browserHistory.length === 0 ? 'No browsing history' : 'No matching results'}
                          </div>
                        ) : (
                          filteredHistory.slice(0, 20).map((entry) => (
                            <div key={entry.id} className="group flex items-center space-x-2 p-2 rounded hover:bg-slate-700/50 transition-colors">
                              <Globe className="h-3 w-3 text-slate-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div 
                                  className="text-xs text-slate-300 truncate cursor-pointer hover:text-cyan-400"
                                  onClick={() => onNavigate(entry.url)}
                                  title={entry.title}
                                >
                                  {entry.title}
                                </div>
                                <div className="text-xs text-slate-500 truncate">{entry.url}</div>
                                <div className="text-xs text-slate-500">{formatDate(entry.visitedAt)}</div>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity">
                                <Button
                                  onClick={() => openInNewTab(entry.url)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  title="Open in new tab"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                                <Button
                                  onClick={() => removeFromHistory(entry.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                                  title="Remove from history"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Bookmarks */}
            <Card className="bg-slate-800/50 border-slate-700">
              <Collapsible open={bookmarksExpanded} onOpenChange={setBookmarksExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-700/30 transition-colors">
                    <CardTitle className="text-slate-300 flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Bookmark className="h-4 w-4" />
                        <span>Bookmarks</span>
                        <Badge variant="outline" className="text-xs">
                          {bookmarks.length}
                        </Badge>
                      </div>
                      {bookmarksExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-1">
                      {bookmarks.map((bookmark, index) => (
                        <div key={index} className="group flex items-center space-x-2 p-2 rounded hover:bg-slate-700/50 transition-colors">
                          <Bookmark className="h-3 w-3 text-yellow-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div 
                              className="text-xs text-slate-300 truncate cursor-pointer hover:text-cyan-400"
                              onClick={() => onNavigate(bookmark.url)}
                              title={bookmark.title}
                            >
                              {bookmark.title}
                            </div>
                            <div className="text-xs text-slate-500 truncate">{bookmark.url}</div>
                          </div>
                          <Button
                            onClick={() => openInNewTab(bookmark.url)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Open in new tab"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Extracted Links */}
            <Card className="bg-slate-800/50 border-slate-700">
              <Collapsible open={linksExpanded} onOpenChange={setLinksExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-700/30 transition-colors">
                    <CardTitle className="text-slate-300 flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Link className="h-4 w-4" />
                        <span>Extracted Links</span>
                        <Badge variant="outline" className="text-xs">
                          {extractedLinks.length}
                        </Badge>
                      </div>
                      {linksExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" />
                        <Input
                          value={linksSearch}
                          onChange={(e) => setLinksSearch(e.target.value)}
                          placeholder="Search links..."
                          className="pl-9 h-8 bg-slate-700 border-slate-600 text-xs"
                        />
                      </div>

                      <div className="space-y-1 max-h-60 overflow-y-auto">
                        {filteredLinks.length === 0 ? (
                          <div className="text-center text-slate-400 py-4 text-xs">
                            {extractedLinks.length === 0 ? 'No extracted links yet' : 'No matching results'}
                          </div>
                        ) : (
                          filteredLinks.map((link, index) => (
                            <div key={index} className="group flex items-center space-x-2 p-2 rounded hover:bg-slate-700/50 transition-colors">
                              <Link className="h-3 w-3 text-green-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div 
                                  className="text-xs text-slate-300 truncate cursor-pointer hover:text-cyan-400"
                                  onClick={() => onNavigate(link.url)}
                                  title={link.title}
                                >
                                  {link.title}
                                </div>
                                <div className="text-xs text-slate-500 truncate">{link.domain}</div>
                              </div>
                              <Button
                                onClick={() => openInNewTab(link.url)}
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Open in new tab"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default EnhancedBrowserSidebar;
