
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Trash2, ExternalLink, RefreshCw, Database, CheckCircle, Zap } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useBrowserScraper } from '@/hooks/useBrowserScraper';

interface URLScrapEntry {
  id: string;
  url: string;
  title: string;
  domain: string;
  status: 'pending' | 'scraped' | 'error';
  method: 'iframe' | 'manual' | 'api' | 'dom';
  lastScraped?: Date;
  metadata?: {
    description?: string;
    keywords?: string[];
    images?: string[];
    links?: string[];
  };
}

interface URLScrapTableProps {
  extractedLinks: Array<{
    url: string;
    title: string;
    domain: string;
  }>;
}

const URLScrapTable = ({ extractedLinks }: URLScrapTableProps) => {
  const [scrapEntries, setScrapEntries] = useState<URLScrapEntry[]>([]);
  const [manualUrl, setManualUrl] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  
  const {
    scrapedData,
    isProcessing,
    scrapeUrlWithAPI,
    clearScrapedData,
    removeScrapedItem
  } = useBrowserScraper();

  // Inicjalizacja z extracted links
  useEffect(() => {
    const newEntries: URLScrapEntry[] = extractedLinks.map((link, index) => ({
      id: `entry_${Date.now()}_${index}`,
      url: link.url,
      title: link.title,
      domain: link.domain,
      status: 'pending' as const,
      method: 'iframe' as const
    }));
    
    if (newEntries.length > 0) {
      setScrapEntries(prev => {
        // Avoid duplicates
        const existingUrls = new Set(prev.map(entry => entry.url));
        const filteredNew = newEntries.filter(entry => !existingUrls.has(entry.url));
        return [...filteredNew, ...prev];
      });
    }
  }, [extractedLinks]);

  // Sync with scraped data
  useEffect(() => {
    scrapedData.forEach(data => {
      setScrapEntries(prev => prev.map(entry => 
        entry.url === data.url ? {
          ...entry,
          status: 'scraped' as const,
          method: data.method,
          lastScraped: data.extractedAt,
          metadata: data.metadata
        } : entry
      ));
    });
  }, [scrapedData]);

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    scraped: 'bg-green-500/20 text-green-400',
    error: 'bg-red-500/20 text-red-400'
  };

  const methodColors = {
    iframe: 'bg-blue-500/20 text-blue-400',
    manual: 'bg-purple-500/20 text-purple-400',
    api: 'bg-cyan-500/20 text-cyan-400',
    dom: 'bg-green-500/20 text-green-400'
  };

  const addManualUrl = () => {
    if (!manualUrl.trim()) {
      toast.error('URL jest wymagany');
      return;
    }

    try {
      const url = new URL(manualUrl);
      const domain = url.hostname;
      const title = manualTitle.trim() || `Manual entry - ${domain}`;

      const newEntry: URLScrapEntry = {
        id: `manual_${Date.now()}`,
        url: url.href,
        title,
        domain,
        status: 'pending',
        method: 'manual'
      };

      setScrapEntries(prev => [newEntry, ...prev]);
      setManualUrl('');
      setManualTitle('');
      
      toast.success('URL dodany pomyślnie!', {
        description: `Dodano: ${title}`,
        duration: 3000
      });
    } catch (error) {
      toast.error('Nieprawidłowy URL', {
        description: 'Proszę wprowadzić prawidłowy adres URL',
        duration: 3000
      });
    }
  };

  const handleScrapeUrl = async (entry: URLScrapEntry) => {
    setScrapEntries(prev => prev.map(e => 
      e.id === entry.id ? { ...e, status: 'pending' as const } : e
    ));

    try {
      const result = await scrapeUrlWithAPI(entry.url);
      if (result) {
        toast.success('Scraping completed!', {
          description: `Successfully scraped: ${entry.title}`,
          duration: 3000
        });
      } else {
        setScrapEntries(prev => prev.map(e => 
          e.id === entry.id ? { ...e, status: 'error' as const } : e
        ));
        toast.error('Scraping failed', {
          description: `Failed to scrape: ${entry.title}`,
          duration: 3000
        });
      }
    } catch (error) {
      setScrapEntries(prev => prev.map(e => 
        e.id === entry.id ? { ...e, status: 'error' as const } : e
      ));
      toast.error('Scraping error', {
        description: `Error scraping: ${entry.title}`,
        duration: 3000
      });
    }
  };

  const removeEntry = (entryId: string) => {
    setScrapEntries(prev => prev.filter(entry => entry.id !== entryId));
    toast.success('Entry removed', { duration: 2000 });
  };

  const clearAllEntries = () => {
    setScrapEntries([]);
    clearScrapedData();
    toast.success('All entries cleared', { duration: 2000 });
  };

  return (
    <Card className="bg-slate-800/50 border-cyan-800/30 h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Search className="h-6 w-6" />
              <span>Enhanced URL Scraper</span>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Advanced URL scraping with Linkup API integration and browser extraction
            </CardDescription>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
              onClick={clearAllEntries}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Manual URL Addition */}
        <Card className="bg-slate-700/30 border-slate-600/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Plus className="h-5 w-5 text-cyan-400" />
              <h3 className="text-cyan-400 font-semibold">Add Manual URL</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="Enter URL..."
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white"
              />
              <Input
                placeholder="Optional title..."
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white"
              />
              <Button 
                onClick={addManualUrl}
                className="bg-gradient-primary hover:bg-gradient-secondary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add URL
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-700/30 border-slate-600/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{scrapEntries.length}</div>
              <div className="text-slate-400 text-sm">Total URLs</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-700/30 border-slate-600/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {scrapEntries.filter(e => e.status === 'scraped').length}
              </div>
              <div className="text-slate-400 text-sm">Scraped</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-700/30 border-slate-600/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {scrapEntries.filter(e => e.status === 'pending').length}
              </div>
              <div className="text-slate-400 text-sm">Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-700/30 border-slate-600/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">
                {scrapEntries.filter(e => e.status === 'error').length}
              </div>
              <div className="text-slate-400 text-sm">Errors</div>
            </CardContent>
          </Card>
        </div>

        {/* URL Entries Table */}
        <Card className="bg-slate-700/50 border-slate-600/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-600/50">
                  <TableHead className="text-slate-300">URL</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Method</TableHead>
                  <TableHead className="text-slate-300">Last Scraped</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scrapEntries.map((entry) => (
                  <TableRow key={entry.id} className="border-slate-600/50">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-white truncate max-w-xs">
                          {entry.title}
                        </span>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 text-xs">
                            {entry.domain}
                          </Badge>
                          <a 
                            href={entry.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-cyan-400 text-xs flex items-center space-x-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={statusColors[entry.status]}>
                        {entry.status}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={methodColors[entry.method]}>
                        {entry.method}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-slate-400 text-sm">
                      {entry.lastScraped ? entry.lastScraped.toLocaleTimeString() : '-'}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleScrapeUrl(entry)}
                          disabled={isProcessing}
                          className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                        >
                          {isProcessing ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-400"></div>
                          ) : (
                            <Zap className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeEntry(entry.id)}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {scrapEntries.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No URLs to scrape</p>
                <p>Extract links from Browser Core or add URLs manually above</p>
              </div>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default URLScrapTable;
