
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Eye, 
  Globe, 
  Search, 
  Star, 
  Tag, 
  TrendingUp,
  Filter,
  Grid,
  List,
  Play,
  BookOpen
} from 'lucide-react';
import { PowerUPTemplate } from '@/types/smartExtractor';

interface TemplateGalleryProps {
  onTemplateSelect?: (template: PowerUPTemplate) => void;
  onTemplateExecute?: (template: PowerUPTemplate) => void;
}

const TemplateGallery = ({ onTemplateSelect, onTemplateExecute }: TemplateGalleryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock templates data
  const templates: PowerUPTemplate[] = [
    {
      id: 'template_1',
      name: 'E-commerce Product Scraper',
      description: 'Extract product information from major e-commerce platforms',
      category: 'data-extraction',
      icon: 'ShoppingCart',
      version: '2.1.0',
      author: 'KarolCore Team',
      isPublic: true,
      tags: ['ecommerce', 'products', 'pricing'],
      configuration: {
        inputType: 'url',
        outputFormat: 'json',
        parameters: {
          includeImages: true,
          includeReviews: false,
          maxItems: 50
        },
        selectors: {
          container: '.products-grid',
          item: '.product-item',
          fields: {
            title: 'h3.product-title',
            price: '.price',
            image: 'img.product-image',
            rating: '.rating-stars'
          }
        }
      },
      usage: {
        instructions: 'Enter the URL of any supported e-commerce page',
        examples: [
          {
            input: 'https://shop.example.com/category/electronics',
            output: 'JSON array with product details',
            description: 'Extracts all products from category page'
          }
        ]
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'template_2',
      name: 'News Article Analyzer',
      description: 'Analyze news articles for sentiment and key topics',
      category: 'content-analysis',
      icon: 'Newspaper',
      version: '1.5.0',
      author: 'Community',
      isPublic: true,
      tags: ['news', 'sentiment', 'analysis'],
      configuration: {
        inputType: 'url',
        outputFormat: 'json',
        parameters: {
          analyzeSentiment: true,
          extractKeywords: true,
          summarize: false
        }
      },
      usage: {
        instructions: 'Provide URL of news article for analysis',
        examples: [
          {
            input: 'https://news.example.com/article/123',
            output: 'Analysis report with sentiment score',
            description: 'Analyzes article sentiment and extracts topics'
          }
        ]
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'template_3',
      name: 'Social Media Monitor',
      description: 'Monitor social media platforms for mentions and trends',
      category: 'automation',
      icon: 'MessageCircle',
      version: '3.0.1',
      author: 'KarolCore Team',
      isPublic: true,
      tags: ['social', 'monitoring', 'trends'],
      configuration: {
        inputType: 'text',
        outputFormat: 'json',
        parameters: {
          platforms: ['twitter', 'facebook', 'instagram'],
          sentiment: true,
          realtime: false
        }
      },
      usage: {
        instructions: 'Enter keywords or hashtags to monitor',
        examples: [
          {
            input: '#AI #MachineLearning',
            output: 'Real-time mentions and sentiment analysis',
            description: 'Monitors social platforms for keyword mentions'
          }
        ]
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'template_4',
      name: 'PDF Document Processor',
      description: 'Extract and process text from PDF documents',
      category: 'utility',
      icon: 'FileText',
      version: '1.8.0',
      author: 'Community',
      isPublic: true,
      tags: ['pdf', 'document', 'text-extraction'],
      configuration: {
        inputType: 'file',
        outputFormat: 'text',
        parameters: {
          extractImages: false,
          preserveFormatting: true,
          language: 'auto'
        }
      },
      usage: {
        instructions: 'Upload PDF file for text extraction',
        examples: [
          {
            input: 'document.pdf',
            output: 'Extracted text content',
            description: 'Converts PDF to readable text format'
          }
        ]
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'data-extraction', name: 'Data Extraction', count: templates.filter(t => t.category === 'data-extraction').length },
    { id: 'content-analysis', name: 'Content Analysis', count: templates.filter(t => t.category === 'content-analysis').length },
    { id: 'automation', name: 'Automation', count: templates.filter(t => t.category === 'automation').length },
    { id: 'utility', name: 'Utility', count: templates.filter(t => t.category === 'utility').length }
  ];

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchTerm, selectedCategory]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'data-extraction': return 'bg-blue-500/20 text-blue-400';
      case 'content-analysis': return 'bg-purple-500/20 text-purple-400';
      case 'automation': return 'bg-green-500/20 text-green-400';
      case 'utility': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const TemplateCard = ({ template }: { template: PowerUPTemplate }) => (
    <Card className="bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-white text-lg">{template.name}</CardTitle>
            <p className="text-slate-400 text-sm mt-1">{template.description}</p>
          </div>
          <Badge className={getCategoryColor(template.category)}>
            {template.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-slate-300">
          <span>v{template.version}</span>
          <span>•</span>
          <span>by {template.author}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {template.tags.map(tag => (
            <Badge key={tag} className="bg-slate-600/50 text-slate-300 text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex space-x-2">
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-primary"
            onClick={() => onTemplateExecute?.(template)}
          >
            <Play className="h-3 w-3 mr-2" />
            Execute
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-slate-600"
            onClick={() => onTemplateSelect?.(template)}
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" className="border-slate-600">
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const TemplateListItem = ({ template }: { template: PowerUPTemplate }) => (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="text-white font-semibold">{template.name}</h3>
              <Badge className={getCategoryColor(template.category)}>
                {template.category}
              </Badge>
              <span className="text-slate-400 text-sm">v{template.version}</span>
            </div>
            <p className="text-slate-400 text-sm mt-1">{template.description}</p>
            <div className="flex items-center space-x-2 mt-2">
              {template.tags.slice(0, 3).map(tag => (
                <Badge key={tag} className="bg-slate-600/50 text-slate-300 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              className="bg-gradient-primary"
              onClick={() => onTemplateExecute?.(template)}
            >
              <Play className="h-3 w-3 mr-2" />
              Execute
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-slate-600"
              onClick={() => onTemplateSelect?.(template)}
            >
              <Eye className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="bg-slate-800/50 border-cyan-800/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span>Template Gallery</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.name}
                <Badge className="ml-1 bg-slate-600/50 text-slate-300 text-xs">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map(template => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTemplates.map(template => (
                    <TemplateListItem key={template.id} template={template} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 text-lg">No templates found</p>
            <p className="text-slate-500">Try adjusting your search criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TemplateGallery;
