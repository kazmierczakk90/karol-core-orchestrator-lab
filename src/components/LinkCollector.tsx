
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, Download, Search, Filter, Globe, ExternalLink, Tag } from 'lucide-react';

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
}

const LinkCollector = () => {
  const [extractedLinks, setExtractedLinks] = useState<ExtractedLink[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<ExtractedLink[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isExtracting, setIsExtracting] = useState(false);

  // Symulacja ekstraktowanych linków
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
        description: 'Official documentation for Lovable platform'
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
        description: 'Main repository for Karol Core project'
      },
      {
        id: '3',
        url: 'https://openai.com/api',
        title: 'OpenAI API',
        domain: 'openai.com',
        category: 'api',
        isExternal: true,
        isNoFollow: false,
        extractedAt: new Date(),
        description: 'OpenAI API documentation and examples'
      },
      {
        id: '4',
        url: '/dashboard',
        title: 'AGI Dashboard',
        domain: 'localhost',
        category: 'internal',
        isExternal: false,
        isNoFollow: false,
        extractedAt: new Date(),
        description: 'Internal AGI control dashboard'
      },
      {
        id: '5',
        url: 'https://fuko.system',
        title: 'FUKO System Documentation',
        domain: 'fuko.system',
        category: 'documentation',
        isExternal: true,
        isNoFollow: false,
        extractedAt: new Date(),
        description: 'FUKO-PZK system documentation'
      }
    ];

    setExtractedLinks(mockLinks);
    setFilteredLinks(mockLinks);
  }, []);

  useEffect(() => {
    let filtered = extractedLinks;

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
  }, [searchTerm, selectedCategory, extractedLinks]);

  const extractLinksFromPage = async () => {
    setIsExtracting(true);
    
    // Symulacja ekstrakcji linków
    setTimeout(() => {
      const newLinks: ExtractedLink[] = [
        {
          id: `new-${Date.now()}`,
          url: 'https://example.com/new-link',
          title: 'Nowo znaleziony link',
          domain: 'example.com',
          category: 'research',
          isExternal: true,
          isNoFollow: false,
          extractedAt: new Date(),
          description: 'Automatycznie wyekstraktowany link'
        }
      ];
      
      setExtractedLinks(prev => [...newLinks, ...prev]);
      setIsExtracting(false);
    }, 2000);
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
      a.download = 'links-export.json';
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const csvContent = [
        'URL,Title,Domain,Category,External,NoFollow,ExtractedAt',
        ...filteredLinks.map(link => 
          `"${link.url}","${link.title}","${link.domain}","${link.category}",${link.isExternal},${link.isNoFollow},"${link.extractedAt.toISOString()}"`
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'links-export.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const categories = ['all', ...Array.from(new Set(extractedLinks.map(link => link.category)))];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      documentation: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      development: 'bg-green-500/20 text-green-400 border-green-500/50',
      api: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      internal: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      research: 'bg-red-500/20 text-red-400 border-red-500/50'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/50';
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
          </div>

          <Tabs defaultValue="grid" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-slate-700">
                <TabsTrigger value="grid">Siatka</TabsTrigger>
                <TabsTrigger value="list">Lista</TabsTrigger>
              </TabsList>
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

            <TabsContent value="grid">
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
                          <span className="text-xs text-slate-500">
                            {link.domain}
                          </span>
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
            </TabsContent>

            <TabsContent value="list">
              <div className="space-y-2">
                {filteredLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-600 hover:border-cyan-500/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-white text-sm font-medium truncate">
                          {link.title}
                        </h3>
                        <Badge className={getCategoryColor(link.category)}>
                          {link.category}
                        </Badge>
                        {link.isExternal && (
                          <ExternalLink className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-1">
                        {link.url}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500">
                        {link.domain}
                      </span>
                      <Button
                        onClick={() => window.open(link.url, '_blank')}
                        variant="ghost"
                        size="sm"
                      >
                        Otwórz
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {filteredLinks.length === 0 && (
            <div className="text-center text-slate-400 py-12">
              <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Brak linków do wyświetlenia</p>
              <p className="text-sm">Wyekstraktuj linki ze strony lub zmień kryteria filtrowania</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkCollector;
