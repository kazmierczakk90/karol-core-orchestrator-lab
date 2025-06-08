
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Bot, 
  Code, 
  Download, 
  Globe, 
  Play, 
  Save, 
  Settings, 
  Target, 
  Zap,
  Plus,
  X
} from 'lucide-react';
import { OutputFormat, ExtractionTemplate } from '@/types/smartExtractor';

interface SmartScraperBuilderProps {
  onTemplateCreate?: (template: ExtractionTemplate) => void;
  onExecute?: (url: string, template: ExtractionTemplate) => void;
}

const SmartScraperBuilder = ({ onTemplateCreate, onExecute }: SmartScraperBuilderProps) => {
  const [template, setTemplate] = useState<Partial<ExtractionTemplate>>({
    name: '',
    description: '',
    category: 'data-extraction',
    domains: [],
    selectors: {
      container: '',
      item: '',
      fields: {}
    },
    preprocessing: [],
    postprocessing: [],
    isActive: true
  });

  const [testUrl, setTestUrl] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [newField, setNewField] = useState({ name: '', selector: '' });

  const outputFormats: OutputFormat[] = ['json', 'csv', 'excel', 'xml', 'html', 'markdown'];

  const addDomain = () => {
    if (newDomain && !template.domains?.includes(newDomain)) {
      setTemplate(prev => ({
        ...prev,
        domains: [...(prev.domains || []), newDomain]
      }));
      setNewDomain('');
    }
  };

  const removeDomain = (domain: string) => {
    setTemplate(prev => ({
      ...prev,
      domains: prev.domains?.filter(d => d !== domain) || []
    }));
  };

  const addField = () => {
    if (newField.name && newField.selector) {
      setTemplate(prev => ({
        ...prev,
        selectors: {
          ...prev.selectors!,
          fields: {
            ...prev.selectors?.fields,
            [newField.name]: newField.selector
          }
        }
      }));
      setNewField({ name: '', selector: '' });
    }
  };

  const removeField = (fieldName: string) => {
    setTemplate(prev => {
      const { [fieldName]: removed, ...remainingFields } = prev.selectors?.fields || {};
      return {
        ...prev,
        selectors: {
          ...prev.selectors!,
          fields: remainingFields
        }
      };
    });
  };

  const handleExecute = async () => {
    if (!testUrl || !template.selectors?.container) return;
    
    setIsExecuting(true);
    try {
      const fullTemplate: ExtractionTemplate = {
        id: `template_${Date.now()}`,
        name: template.name || 'Unnamed Template',
        description: template.description || '',
        category: template.category || 'data-extraction',
        domains: template.domains || [],
        selectors: template.selectors,
        preprocessing: template.preprocessing || [],
        postprocessing: template.postprocessing || [],
        isActive: template.isActive ?? true
      };
      
      onExecute?.(testUrl, fullTemplate);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSave = () => {
    if (!template.name || !template.selectors?.container) return;
    
    const fullTemplate: ExtractionTemplate = {
      id: `template_${Date.now()}`,
      name: template.name,
      description: template.description || '',
      category: template.category || 'data-extraction',
      domains: template.domains || [],
      selectors: template.selectors,
      preprocessing: template.preprocessing || [],
      postprocessing: template.postprocessing || [],
      isActive: template.isActive ?? true
    };
    
    onTemplateCreate?.(fullTemplate);
  };

  return (
    <Card className="bg-slate-800/50 border-cyan-800/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <Bot className="h-6 w-6" />
          <span>Smart Scraper Builder</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="selectors">Selectors</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="test">Test & Save</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={template.name || ''}
                  onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="E.g., Product Listings"
                  className="bg-slate-700/50 border-slate-600"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={template.category} onValueChange={(value) => setTemplate(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="data-extraction">Data Extraction</SelectItem>
                    <SelectItem value="content-analysis">Content Analysis</SelectItem>
                    <SelectItem value="automation">Automation</SelectItem>
                    <SelectItem value="utility">Utility</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={template.description || ''}
                onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this template extracts..."
                className="bg-slate-700/50 border-slate-600"
              />
            </div>

            <div>
              <Label>Target Domains</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="e.g., amazon.com"
                  className="bg-slate-700/50 border-slate-600"
                />
                <Button onClick={addDomain} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {template.domains?.map((domain) => (
                  <Badge key={domain} className="bg-cyan-500/20 text-cyan-400">
                    {domain}
                    <button onClick={() => removeDomain(domain)} className="ml-2">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="selectors" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="container-selector">Container Selector</Label>
                <Input
                  id="container-selector"
                  value={template.selectors?.container || ''}
                  onChange={(e) => setTemplate(prev => ({
                    ...prev,
                    selectors: { ...prev.selectors!, container: e.target.value }
                  }))}
                  placeholder="e.g., .product-list, #results"
                  className="bg-slate-700/50 border-slate-600"
                />
              </div>
              
              <div>
                <Label htmlFor="item-selector">Item Selector</Label>
                <Input
                  id="item-selector"
                  value={template.selectors?.item || ''}
                  onChange={(e) => setTemplate(prev => ({
                    ...prev,
                    selectors: { ...prev.selectors!, item: e.target.value }
                  }))}
                  placeholder="e.g., .product-item, .result"
                  className="bg-slate-700/50 border-slate-600"
                />
              </div>
            </div>

            <div>
              <Label>Field Selectors</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={newField.name}
                  onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Field name (e.g., title)"
                  className="bg-slate-700/50 border-slate-600"
                />
                <Input
                  value={newField.selector}
                  onChange={(e) => setNewField(prev => ({ ...prev, selector: e.target.value }))}
                  placeholder="CSS selector (e.g., h3.title)"
                  className="bg-slate-700/50 border-slate-600"
                />
                <Button onClick={addField} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {Object.entries(template.selectors?.fields || {}).map(([field, selector]) => (
                  <div key={field} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                    <div>
                      <span className="font-semibold text-cyan-400">{field}</span>
                      <code className="ml-2 text-slate-300 text-sm">{selector}</code>
                    </div>
                    <button onClick={() => removeField(field)}>
                      <X className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={template.isActive}
                onCheckedChange={(checked) => setTemplate(prev => ({ ...prev, isActive: checked }))}
              />
              <Label>Template Active</Label>
            </div>

            <div>
              <Label>Pre-processing Rules</Label>
              <Textarea
                value={template.preprocessing?.join('\n') || ''}
                onChange={(e) => setTemplate(prev => ({ 
                  ...prev, 
                  preprocessing: e.target.value.split('\n').filter(Boolean) 
                }))}
                placeholder="Enter pre-processing rules (one per line)"
                className="bg-slate-700/50 border-slate-600"
              />
            </div>

            <div>
              <Label>Post-processing Rules</Label>
              <Textarea
                value={template.postprocessing?.join('\n') || ''}
                onChange={(e) => setTemplate(prev => ({ 
                  ...prev, 
                  postprocessing: e.target.value.split('\n').filter(Boolean) 
                }))}
                placeholder="Enter post-processing rules (one per line)"
                className="bg-slate-700/50 border-slate-600"
              />
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <div>
              <Label htmlFor="test-url">Test URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="test-url"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder="Enter URL to test scraping..."
                  className="bg-slate-700/50 border-slate-600"
                />
                <Button 
                  onClick={handleExecute} 
                  disabled={isExecuting || !testUrl || !template.selectors?.container}
                  className="bg-gradient-primary"
                >
                  {isExecuting ? (
                    <Zap className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  Test
                </Button>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={handleSave}
                disabled={!template.name || !template.selectors?.container}
                className="bg-gradient-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </Button>
              
              <Button variant="outline" className="border-slate-600">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SmartScraperBuilder;
