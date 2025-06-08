
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Download, 
  Upload, 
  Heart, 
  Share2, 
  TrendingUp,
  Users,
  Search,
  Filter
} from 'lucide-react';

interface MarketplaceTemplate {
  id: string;
  name: string;
  description: string;
  author: string;
  downloads: number;
  rating: number;
  price: number; // 0 for free
  tags: string[];
  category: string;
  featured: boolean;
  trending: boolean;
}

const TemplateMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates: MarketplaceTemplate[] = [
    {
      id: 'tmp_1',
      name: 'Universal E-commerce Scraper',
      description: 'Works with 50+ major e-commerce platforms',
      author: 'KarolCore Team',
      downloads: 1234,
      rating: 4.9,
      price: 0,
      tags: ['ecommerce', 'universal', 'products'],
      category: 'data-extraction',
      featured: true,
      trending: true
    },
    {
      id: 'tmp_2',
      name: 'Social Media Analytics Suite',
      description: 'Complete social media monitoring and analysis',
      author: 'SocialPro',
      downloads: 856,
      rating: 4.7,
      price: 29.99,
      tags: ['social', 'analytics', 'monitoring'],
      category: 'content-analysis',
      featured: true,
      trending: false
    },
    {
      id: 'tmp_3',
      name: 'News Aggregator Pro',
      description: 'Aggregate news from 200+ sources with sentiment analysis',
      author: 'NewsBot Inc',
      downloads: 543,
      rating: 4.5,
      price: 19.99,
      tags: ['news', 'aggregation', 'sentiment'],
      category: 'content-analysis',
      featured: false,
      trending: true
    }
  ];

  const TemplateCard = ({ template }: { template: MarketplaceTemplate }) => (
    <Card className="bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <CardTitle className="text-white text-lg">{template.name}</CardTitle>
              {template.featured && <Badge className="bg-yellow-500/20 text-yellow-400">Featured</Badge>}
              {template.trending && <Badge className="bg-green-500/20 text-green-400">Trending</Badge>}
            </div>
            <p className="text-slate-400 text-sm">{template.description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300">by {template.author}</span>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-slate-300">{template.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center space-x-1">
            <Download className="h-4 w-4" />
            <span>{template.downloads}</span>
          </div>
          <div className="text-lg font-bold text-cyan-400">
            {template.price === 0 ? 'Free' : `$${template.price}`}
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {template.tags.map(tag => (
            <Badge key={tag} className="bg-slate-600/50 text-slate-300 text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex space-x-2">
          <Button size="sm" className="flex-1 bg-gradient-primary">
            <Download className="h-3 w-3 mr-2" />
            {template.price === 0 ? 'Download' : 'Buy'}
          </Button>
          <Button size="sm" variant="outline" className="border-slate-600">
            <Heart className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" className="border-slate-600">
            <Share2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="bg-slate-800/50 border-cyan-800/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <Users className="h-6 w-6" />
          <span>Template Marketplace</span>
        </CardTitle>

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
          <Button className="bg-gradient-primary">
            <Upload className="h-4 w-4 mr-2" />
            Upload Template
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="free">Free</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featured" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.filter(t => t.featured).map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.filter(t => t.trending).map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="free" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.filter(t => t.price === 0).map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TemplateMarketplace;
