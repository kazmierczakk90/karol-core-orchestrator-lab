
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Link, Download, Search, Filter, Globe, ExternalLink, Tag, Plus, Upload } from 'lucide-react';

interface ExtractedLink {
  id: string;
  url: string;
  title: string;
  domain: string;
  category: string;
  isExternal: boolean;
  isNoFollow: boolean;
  extractedAt: Date;
  description?: string;
  source: 'auto' | 'manual' | 'upload';
}

interface LinkCollectorProps {
  extractedLinks?: any[];
}

const LinkCollector = ({ extractedLinks = [] }: LinkCollectorProps) => {
  const [allLinks, setAllLinks] = useState<ExtractedLink[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<ExtractedLink[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isExtracting, setIsExtracting] = useState(false);
  
  // Manual link adding
  const [manualUrl, setManualUrl] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualCategory, setManualCategory] = useState('manual');
  
  // Bulk upload
  const [bulkUrls, setBulkUrls] = useState('');

  // Inicjalizacja z mock data
  useEffect(() => {
    const mockLinks: ExtractedLink[] = [
      {
        id: '1',
        url: 'https://docs.lovable.dev',
        title: 'Lovable Documentation',
        domain: 'docs.lovable.dev',
        category: 'documentation',
        isExternal: true,
        isNoFollow: false,
        extractedAt: new Date(),
        description: 'Official documentation for Lovable platform',
        source: 'auto'
      },
      {
        id: '2',
        url: 'https://github.com/karol-core',
        title: 'Karol Core Repository',
        domain: 'github.com',
        category: 'development',
        isExternal: true,
        isNoFollow: false,
        extractedAt: new Date(),
        description: 'Main repository for Karol Core project',
        source: 'auto'
      }
    ];

    setAllLinks(mockLinks);
    setFilteredLinks(mockLinks);
  }, []);

  // Reaguj na nowe linki z przeglądarki
  useEffect(() => {
    if (extractedLinks.length > 0) {
      const newLinks: ExtractedLink[] = extractedLinks.map(link => ({
        id: `browser_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        url: link.url,
        title: link.title || 'Untitled',
        domain: link.domain || new URL(link.url).hostname,
        category: 'browser-extracted',
        isExternal: !link.url.includes(window.location.hostname),
        isNoFollow: false,
        extractedAt: new Date(),
        description: `Automatycznie wyekstraktowany z przeglądarki`,
        source: 'auto' as const
      }));

      setAllLinks(prev => [...newLinks, ...prev]);
    }
  }, [extractedLinks]);

  useEffect(() => {
    let filtered = allLinks;

    if (searchTerm) {
      filtered = filtered.filter(link =>
        link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.domain.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(link => link.category === selectedCategory);
    }

    setFilteredLinks(filtered);
  }, [searchTerm, selectedCategory, allLinks]);

  const addManualLink = () => {
    if (!manualUrl.trim()) return;

    try {
      const urlObj = new URL(manualUrl);
      const newLink: ExtractedLink = {
        id: `manual_${Date.now()}`,
        url: manualUrl,
        title: manualTitle || urlObj.hostname,
        domain: urlObj.hostname,
        category: manualCategory,
        isExternal: !manualUrl.includes(window.location.hostname),
        isNoFollow: false,
        extractedAt: new Date(),
        description: 'Dodano ręcznie',
        source: 'manual'
      };

      setAllLinks(prev => [newLink, ...prev]);
      setManualUrl('');
      setManualTitle('');
      setManualCategory('manual');

      // Pokaż notyfikację
      showNotification('Link dodany!', 'Ręczny link został pomyślnie dodany do kolekcji');
    } catch (error) {
      showNotification('Błąd!', 'Nieprawidłowy format URL', 'error');
    }
  };

  const uploadBulkLinks = () => {
    if (!bulkUrls.trim()) return;

    const urls = bulkUrls.split('\n').filter(url => url.trim());
    const newLinks: ExtractedLink[] = [];

    urls.forEach(url => {
      try {
        const urlObj = new URL(url.trim());
        newLinks.push({
          id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          url: url.trim(),
          title: urlObj.hostname,
          domain: urlObj.hostname,
          category: 'bulk-upload',
          isExternal: true,
          isNoFollow: false,
          extractedAt: new Date(),
          description: 'Dodano przez bulk upload',
          source: 'upload'
        });
      } catch (error) {
        console.log(`Pominięto nieprawidłowy URL: ${url}`);
      }
    });

    if (newLinks.length > 0) {
      setAllLinks(prev => [...newLinks, ...prev]);
      setBulkUrls('');
      showNotification('Linki dodane!', `Pomyślnie dodano ${newLinks.length} linków`);
    }
  };

  const extractLinksFromPage = async () => {
    setIsExtracting(true);
    
    // Symulacja ekstrakcji linków z bieżącej strony
    setTimeout(() => {
      const newLinks: ExtractedLink[] = [
        {
          id: `extract_${Date.now()}`,
          url: 'https://example.com/new-extracted-link',
          title: 'Nowo wyekstraktowany link',
          domain: 'example.com',
          category: 'page-extraction',
          isExternal: true,
          isNoFollow: false,
          extractedAt: new Date(),
          description: 'Automatycznie wyekstraktowany z aktualnej strony',
          source: 'auto'
        }
      ];
      
      setAllLinks(prev => [...newLinks, ...prev]);
      setIsExtracting(false);
      showNotification('Ekstrakcja zakończona!', `Znaleziono ${newLinks.length} nowych linków`);
    }, 2000);
  };

  const showNotification = (title: string, message: string, type: 'success' | 'error' = 'success') => {
    // SECURITY FIX: Use safe DOM manipulation instead of innerHTML to prevent XSS
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white p-4 rounded-lg shadow-lg z-50`;
    
    const titleElement = document.createElement('div');
    titleElement.className = 'font-bold';
    titleElement.textContent = title; // Safe text assignment
    
    const messageElement = document.createElement('div');
    messageElement.className = 'text-sm';
    messageElement.textContent = message; // Safe text assignment
    
    notification.appendChild(titleElement);
    notification.appendChild(messageElement);
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 4000);
  };

  const exportLinks = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const data = {
        links: filteredLinks,
        exportedAt: new Date().toISOString(),
        totalCount: filteredLinks.length
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'karol-core-links-export.json';
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const csvContent = [
        'URL,Title,Domain,Category,External,NoFollow,ExtractedAt,Source',
        ...filteredLinks.map(link => 
          `"${link.url}","${link.title}","${link.domain}","${link.category}",${link.isExternal},${link.isNoFollow},"${link.extractedAt.toISOString()}","${link.source}"`
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'karol-core-links-export.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const categories = ['all', ...Array.from(new Set(allLinks.map(link => link.category)))];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      documentation: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      development: 'bg-green-500/20 text-green-400 border-green-500/50',
      'browser-extracted': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
      manual: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      'bulk-upload': 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      'page-extraction': 'bg-red-500/20 text-red-400 border-red-500/50'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'auto': return <Globe className="h-3 w-3" />;
      case 'manual': return <Plus className="h-3 w-3" />;
      case 'upload': return <Upload className="h-3 w-3" />;
      default: return <Link className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Link className="h-6 w-6" />
              <span>Link Collector</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                {filteredLinks.length} linków
              </Badge>
              <Button
                onClick={extractLinksFromPage}
                disabled={isExtracting}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Globe className="h-4 w-4 mr-2" />
                {isExtracting ? 'Ekstraktowanie...' : 'Ekstraktuj ze strony'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="links" className="w-full">
        <TabsList className="bg-slate-700">
          <TabsTrigger value="links">Wszystkie Linki</TabsTrigger>
          <TabsTrigger value="add-manual">Dodaj Ręcznie</TabsTrigger>
          <TabsTrigger value="bulk-upload">Bulk Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="add-manual">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-purple-400">Dodaj Link Ręcznie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">URL *</label>
                <Input
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="bg-slate-900 border-slate-600"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Tytuł</label>
                <Input
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="Opcjonalny tytuł"
                  className="bg-slate-900 border-slate-600"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Kategoria</label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
                >
                  <option value="manual">Manual</option>
                  <option value="research">Research</option>
                  <option value="tools">Tools</option>
                  <option value="documentation">Documentation</option>
                  <option value="development">Development</option>
                </select>
              </div>
              <Button onClick={addManualLink} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Dodaj Link
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk-upload">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-orange-400">Bulk Upload Linków</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">URLs (jeden na linię)</label>
                <Textarea
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                  placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com"
                  className="bg-slate-900 border-slate-600 h-32"
                />
              </div>
              <Button onClick={uploadBulkLinks} className="bg-orange-600 hover:bg-orange-700">
                <Upload className="h-4 w-4 mr-2" />
                Upload Linki
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Szukaj linków po tytule, URL lub domenie..."
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'Wszystkie kategorie' : category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => exportLinks('json')}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    JSON
                  </Button>
                  <Button
                    onClick={() => exportLinks('csv')}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLinks.map((link) => (
                  <Card key={link.id} className="bg-slate-900/50 border-slate-600 hover:border-cyan-500/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="text-white text-sm font-medium truncate flex-1">
                            {link.title}
                          </h3>
                          {link.isExternal && (
                            <ExternalLink className="h-3 w-3 text-slate-400 ml-2" />
                          )}
                        </div>
                        
                        <p className="text-xs text-slate-400 truncate">
                          {link.url}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <Badge className={getCategoryColor(link.category)}>
                            {link.category}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            {getSourceIcon(link.source)}
                            <span className="text-xs text-slate-500">
                              {link.domain}
                            </span>
                          </div>
                        </div>
                        
                        {link.description && (
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {link.description}
                          </p>
                        )}
                        
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>{link.extractedAt.toLocaleDateString()}</span>
                          <Button
                            onClick={() => window.open(link.url, '_blank')}
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                          >
                            Otwórz
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredLinks.length === 0 && (
                <div className="text-center text-slate-400 py-12">
                  <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Brak linków do wyświetlenia</p>
                  <p className="text-sm">Wyekstraktuj linki ze strony lub dodaj je ręcznie</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LinkCollector;
