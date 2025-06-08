import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { smartExtractorService, ExtractionTemplate, SmartExtractionResult } from '@/services/smartExtractorService';
import { toast } from '@/components/ui/sonner';
import { 
  Wand2, Code, Eye, Play, Save, Trash2, Copy, Download, 
  Settings, Zap, Target, Layers, ArrowRight 
} from 'lucide-react';

interface SmartScraperBuilderProps {
  onScraperCreated?: (scraper: ExtractionTemplate) => void;
  onExtractionComplete?: (result: SmartExtractionResult) => void;
}

const SmartScraperBuilder = ({ onScraperCreated, onExtractionComplete }: SmartScraperBuilderProps) => {
  const [mode, setMode] = useState<'ai-assisted' | 'manual'>('ai-assisted');
  const [aiDescription, setAiDescription] = useState('');
  const [testUrl, setTestUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Partial<ExtractionTemplate>>({
    name: '',
    description: '',
    category: 'General',
    domains: [],
    selectors: {
      container: '',
      item: '',
      fields: {}
    },
    isActive: true
  });
  const [testResult, setTestResult] = useState<SmartExtractionResult | null>(null);
  const [templates, setTemplates] = useState<ExtractionTemplate[]>([]);

  useEffect(() => {
    setTemplates(smartExtractorService.getTemplates());
  }, []);

  const handleAIAssistedCreation = async () => {
    if (!aiDescription.trim()) {
      toast.error('Opisz co chcesz wydobyć ze stron internetowych');
      return;
    }

    setIsCreating(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate template based on description
      const aiTemplate = generateTemplateFromDescription(aiDescription);
      setCurrentTemplate(aiTemplate);
      
      toast.success('Scraper został wygenerowany przez AI!', {
        description: 'Sprawdź ustawienia i przetestuj na przykładowym URL'
      });
    } catch (error) {
      toast.error('Błąd podczas tworzenia scrapera');
    } finally {
      setIsCreating(false);
    }
  };

  const generateTemplateFromDescription = (description: string): Partial<ExtractionTemplate> => {
    const lowerDesc = description.toLowerCase();
    
    // Smart categorization based on keywords
    let category = 'General';
    let domains: string[] = [];
    let name = 'Custom Scraper';
    
    if (lowerDesc.includes('github') || lowerDesc.includes('repository')) {
      category = 'Development';
      domains = ['github.com'];
      name = 'GitHub Data Extractor';
    } else if (lowerDesc.includes('linkedin') || lowerDesc.includes('profile')) {
      category = 'Professional';
      domains = ['linkedin.com'];
      name = 'LinkedIn Profile Extractor';
    } else if (lowerDesc.includes('product') || lowerDesc.includes('shop') || lowerDesc.includes('price')) {
      category = 'E-commerce';
      name = 'Product Data Extractor';
    } else if (lowerDesc.includes('news') || lowerDesc.includes('article')) {
      category = 'Media';
      name = 'News Article Extractor';
    }

    return {
      name,
      description,
      category,
      domains,
      selectors: {
        container: '.results, .items, .list',
        item: '.item, .result, li',
        fields: {
          title: 'h1, h2, h3, .title',
          description: 'p, .description, .summary',
          link: 'a@href',
          image: 'img@src'
        }
      },
      isActive: true
    };
  };

  const handleTestScraper = async () => {
    if (!testUrl.trim()) {
      toast.error('Podaj URL do testowania');
      return;
    }

    setIsTesting(true);
    try {
      const result = await smartExtractorService.extractSmartData(testUrl, {
        useTemplate: false,
        customSelectors: currentTemplate.selectors?.fields
      });
      
      setTestResult(result);
      onExtractionComplete?.(result);
      
      toast.success(`Wydobyto ${result.metadata.itemCount} elementów!`, {
        description: `Czas przetwarzania: ${result.metadata.processingTime}ms`
      });
    } catch (error) {
      toast.error('Błąd podczas testowania scrapera');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveScraper = () => {
    if (!currentTemplate.name || !currentTemplate.description) {
      toast.error('Wypełnij nazwę i opis scrapera');
      return;
    }

    const template = smartExtractorService.createTemplate(currentTemplate as Omit<ExtractionTemplate, 'id'>);
    setTemplates(smartExtractorService.getTemplates());
    onScraperCreated?.(template);
    
    toast.success('Scraper został zapisany!', {
      description: 'Możesz go teraz używać do automatycznej ekstrakcji'
    });
  };

  const handleExportResults = async (format: 'json' | 'csv' | 'excel' | 'xml') => {
    if (!testResult) return;
    
    const blob = await smartExtractorService.exportData([testResult], format);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extraction_${testResult.id}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Dane wyeksportowane do formatu ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-dark border-cyan-800/30">
        <CardHeader>
          <CardTitle className="text-gradient-primary flex items-center space-x-2">
            <Wand2 className="h-6 w-6" />
            <span>Smart Scraper Builder</span>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Utwórz inteligentny scraper do wydobywania danych ze stron internetowych
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={mode} onValueChange={(value: any) => setMode(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
              <TabsTrigger value="ai-assisted" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>AI-Assisted</span>
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center space-x-2">
                <Code className="h-4 w-4" />
                <span>Manual</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai-assisted" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ai-description" className="text-slate-300">
                    Opisz co chcesz wydobyć ze stron
                  </Label>
                  <Textarea
                    id="ai-description"
                    value={aiDescription}
                    onChange={(e) => setAiDescription(e.target.value)}
                    placeholder="Np. 'Chcę wydobyć listę repozytoriów z GitHub wraz z nazwami, opisami, liczbą gwiazdek i językiem programowania'"
                    className="mt-2 bg-slate-900/50 border-slate-700/50 text-white min-h-[100px]"
                  />
                </div>

                <Button
                  onClick={handleAIAssistedCreation}
                  disabled={isCreating || !aiDescription.trim()}
                  className="bg-gradient-primary hover:bg-gradient-secondary w-full"
                >
                  {isCreating ? (
                    <>
                      <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                      AI tworzy scraper...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Utwórz scraper przez AI
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scraper-name" className="text-slate-300">Nazwa Scrapera</Label>
                  <Input
                    id="scraper-name"
                    value={currentTemplate.name}
                    onChange={(e) => setCurrentTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Np. GitHub Repository Extractor"
                    className="mt-1 bg-slate-900/50 border-slate-700/50 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="scraper-category" className="text-slate-300">Kategoria</Label>
                  <Select 
                    value={currentTemplate.category} 
                    onValueChange={(value) => setCurrentTemplate(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="mt-1 bg-slate-900/50 border-slate-700/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Development">Development</SelectItem>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Social">Social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="scraper-description" className="text-slate-300">Opis</Label>
                <Textarea
                  id="scraper-description"
                  value={currentTemplate.description}
                  onChange={(e) => setCurrentTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Opisz co robi ten scraper"
                  className="mt-1 bg-slate-900/50 border-slate-700/50 text-white"
                />
              </div>

              <div>
                <Label htmlFor="domains" className="text-slate-300">Domeny (oddzielone przecinkami)</Label>
                <Input
                  id="domains"
                  value={currentTemplate.domains?.join(', ')}
                  onChange={(e) => setCurrentTemplate(prev => ({ 
                    ...prev, 
                    domains: e.target.value.split(',').map(d => d.trim()).filter(Boolean)
                  }))}
                  placeholder="github.com, linkedin.com"
                  className="mt-1 bg-slate-900/50 border-slate-700/50 text-white"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Selector Configuration */}
          {(currentTemplate.name || mode === 'manual') && (
            <Card className="mt-6 bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Selectors Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Container Selector</Label>
                    <Input
                      value={currentTemplate.selectors?.container}
                      onChange={(e) => setCurrentTemplate(prev => ({
                        ...prev,
                        selectors: { ...prev.selectors!, container: e.target.value }
                      }))}
                      placeholder=".results, .items"
                      className="mt-1 bg-slate-900/50 border-slate-700/50 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Item Selector</Label>
                    <Input
                      value={currentTemplate.selectors?.item}
                      onChange={(e) => setCurrentTemplate(prev => ({
                        ...prev,
                        selectors: { ...prev.selectors!, item: e.target.value }
                      }))}
                      placeholder=".item, .result"
                      className="mt-1 bg-slate-900/50 border-slate-700/50 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300">Field Selectors (JSON format)</Label>
                  <Textarea
                    value={JSON.stringify(currentTemplate.selectors?.fields || {}, null, 2)}
                    onChange={(e) => {
                      try {
                        const fields = JSON.parse(e.target.value);
                        setCurrentTemplate(prev => ({
                          ...prev,
                          selectors: { ...prev.selectors!, fields }
                        }));
                      } catch (error) {
                        // Invalid JSON, ignore
                      }
                    }}
                    placeholder='{"title": "h2", "description": "p", "link": "a@href"}'
                    className="mt-1 bg-slate-900/50 border-slate-700/50 text-white font-mono text-sm"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Test Section */}
          <Card className="mt-6 bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Test Scraper</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder="Podaj URL do testowania"
                  className="bg-slate-900/50 border-slate-700/50 text-white"
                />
                <Button
                  onClick={handleTestScraper}
                  disabled={isTesting || !testUrl.trim()}
                  className="bg-gradient-secondary hover:bg-gradient-primary"
                >
                  {isTesting ? (
                    <Play className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {testResult && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge className="bg-green-500/20 text-green-400">
                        {testResult.metadata.itemCount} items
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-400">
                        {testResult.metadata.processingTime}ms
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-400">
                        {Math.round(testResult.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    
                    <div className="flex space-x-2">
                      {['json', 'csv', 'xml'].map((format) => (
                        <Button
                          key={format}
                          size="sm"
                          variant="outline"
                          onClick={() => handleExportResults(format as any)}
                          className="border-slate-600 text-slate-300"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {format.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <pre className="text-slate-300 text-xs">
                      {JSON.stringify(testResult.data.slice(0, 3), null, 2)}
                      {testResult.data.length > 3 && `\n... and ${testResult.data.length - 3} more items`}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between mt-6">
            <div className="flex items-center space-x-2">
              <Switch
                checked={currentTemplate.isActive}
                onCheckedChange={(checked) => setCurrentTemplate(prev => ({ ...prev, isActive: checked }))}
              />
              <Label className="text-slate-300">Active</Label>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentTemplate({
                  name: '',
                  description: '',
                  category: 'General',
                  domains: [],
                  selectors: { container: '', item: '', fields: {} },
                  isActive: true
                })}
                className="border-slate-600 text-slate-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Reset
              </Button>
              
              <Button
                onClick={handleSaveScraper}
                disabled={!currentTemplate.name || !currentTemplate.description}
                className="bg-gradient-success hover:bg-gradient-secondary"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Scraper
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Templates */}
      {templates.length > 0 && (
        <Card className="bg-gradient-dark border-cyan-800/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Layers className="h-5 w-5" />
              <span>Saved Templates ({templates.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white">{template.name}</h4>
                        <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-sm">{template.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <span>{template.domains.join(', ')}</span>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setCurrentTemplate(template)}
                          className="border-slate-600 text-slate-300 flex-1"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Use
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            smartExtractorService.deleteTemplate(template.id);
                            setTemplates(smartExtractorService.getTemplates());
                            toast.success('Template deleted');
                          }}
                          className="border-red-600 text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartScraperBuilder;
