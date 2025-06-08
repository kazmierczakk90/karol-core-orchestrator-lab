
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { smartExtractorService, ExtractionTemplate } from '@/services/smartExtractorService';
import { toast } from '@/components/ui/sonner';
import { 
  Search, Star, Copy, Download, Eye, Code, Sparkles,
  Github, Linkedin, ShoppingCart, FileText, Globe, 
  TrendingUp, Users, Briefcase, BookOpen
} from 'lucide-react';

interface TemplateGalleryProps {
  onTemplateSelected?: (template: ExtractionTemplate) => void;
}

const TemplateGallery = ({ onTemplateSelected }: TemplateGalleryProps) => {
  const [templates, setTemplates] = useState<ExtractionTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [featuredTemplates, setFeaturedTemplates] = useState<ExtractionTemplate[]>([]);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const allTemplates = smartExtractorService.getTemplates();
    setTemplates(allTemplates);
    
    // Set featured templates (most useful ones)
    const featured = allTemplates.filter(t => 
      ['github_repos', 'linkedin_profiles', 'amazon_products'].includes(t.id)
    );
    setFeaturedTemplates(featured);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(templates.map(t => t.category)));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Development': return <Github className="h-4 w-4" />;
      case 'Professional': return <Briefcase className="h-4 w-4" />;
      case 'E-commerce': return <ShoppingCart className="h-4 w-4" />;
      case 'Media': return <FileText className="h-4 w-4" />;
      case 'Social': return <Users className="h-4 w-4" />;
      case 'Education': return <BookOpen className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getTemplateIcon = (templateId: string) => {
    switch (templateId) {
      case 'github_repos': return <Github className="h-5 w-5 text-slate-300" />;
      case 'linkedin_profiles': return <Linkedin className="h-5 w-5 text-blue-400" />;
      case 'amazon_products': return <ShoppingCart className="h-5 w-5 text-orange-400" />;
      default: return <Globe className="h-5 w-5 text-slate-300" />;
    }
  };

  const handleUseTemplate = (template: ExtractionTemplate) => {
    onTemplateSelected?.(template);
    toast.success(`Template "${template.name}" selected`);
  };

  const handleCloneTemplate = (template: ExtractionTemplate) => {
    const clonedTemplate = smartExtractorService.createTemplate({
      name: `${template.name} (Copy)`,
      description: template.description,
      category: template.category,
      domains: [...template.domains],
      selectors: { ...template.selectors },
      isActive: true
    });
    
    setTemplates(smartExtractorService.getTemplates());
    toast.success('Template cloned successfully');
  };

  const popularTemplates = [
    {
      id: 'ecommerce_scraper',
      name: 'E-commerce Product Scraper',
      description: 'Extract products, prices, ratings from online stores',
      category: 'E-commerce',
      uses: 1250,
      rating: 4.8,
      domains: ['amazon.com', 'ebay.com', 'shopify.com']
    },
    {
      id: 'job_listings',
      name: 'Job Listings Extractor',
      description: 'Scrape job postings, salaries, requirements',
      category: 'Professional',
      uses: 890,
      rating: 4.6,
      domains: ['indeed.com', 'glassdoor.com', 'monster.com']
    },
    {
      id: 'news_articles',
      name: 'News Article Scraper',
      description: 'Extract headlines, content, authors from news sites',
      category: 'Media',
      uses: 650,
      rating: 4.5,
      domains: ['cnn.com', 'bbc.com', 'reuters.com']
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-dark border-cyan-800/30">
        <CardHeader>
          <CardTitle className="text-gradient-primary flex items-center space-x-2">
            <Sparkles className="h-6 w-6" />
            <span>Template Gallery</span>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Browse and use pre-built extraction templates for popular websites
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="pl-10 bg-slate-900/50 border-slate-700/50 text-white"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 bg-slate-900/50 border-slate-700/50 text-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(category)}
                      <span>{category}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Featured Templates */}
      {searchQuery === '' && selectedCategory === 'all' && (
        <Card className="bg-gradient-dark border-green-800/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span>Featured Templates</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredTemplates.map((template) => (
                <Card key={template.id} className="bg-slate-800/50 border-slate-700/50 hover:border-green-500/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getTemplateIcon(template.id)}
                          <Badge className="bg-yellow-500/20 text-yellow-400">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-white">{template.name}</h3>
                        <p className="text-slate-400 text-sm mt-1">{template.description}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <Badge variant="outline" className="border-slate-600 text-slate-400">
                          {template.category}
                        </Badge>
                        <span>•</span>
                        <span>{template.domains.slice(0, 2).join(', ')}</span>
                        {template.domains.length > 2 && <span>+{template.domains.length - 2}</span>}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleUseTemplate(template)}
                          className="bg-gradient-primary hover:bg-gradient-secondary flex-1"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Use
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCloneTemplate(template)}
                          className="border-slate-600"
                        >
                          <Copy className="h-3 w-3" />
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

      {/* Popular Community Templates */}
      {searchQuery === '' && selectedCategory === 'all' && (
        <Card className="bg-gradient-dark border-purple-800/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <span>Popular Community Templates</span>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Most used templates by the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularTemplates.map((template) => (
                <Card key={template.id} className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-purple-500/20 text-purple-400">
                          Community
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-slate-400">
                          <Star className="h-3 w-3 text-yellow-400" />
                          <span>{template.rating}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-white">{template.name}</h3>
                        <p className="text-slate-400 text-sm mt-1">{template.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <Badge variant="outline" className="border-slate-600 text-slate-400">
                          {template.category}
                        </Badge>
                        <span>{template.uses} uses</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300 flex-1"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Install
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600"
                        >
                          <Eye className="h-3 w-3" />
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

      {/* All Templates */}
      <Card className="bg-gradient-dark border-cyan-800/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>All Templates ({filteredTemplates.length})</span>
            <Badge variant="outline" className="border-slate-600 text-slate-400">
              {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(template.category)}
                          <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                            {template.category}
                          </Badge>
                        </div>
                        {template.isActive && (
                          <Badge className="bg-green-500/20 text-green-400 text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-white">{template.name}</h3>
                        <p className="text-slate-400 text-sm mt-1 line-clamp-2">{template.description}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-xs text-slate-500">
                          <span className="font-medium">Domains:</span> {template.domains.slice(0, 2).join(', ')}
                          {template.domains.length > 2 && ` +${template.domains.length - 2} more`}
                        </div>
                        
                        <div className="text-xs text-slate-500">
                          <span className="font-medium">Fields:</span> {Object.keys(template.selectors.fields).slice(0, 3).join(', ')}
                          {Object.keys(template.selectors.fields).length > 3 && ` +${Object.keys(template.selectors.fields).length - 3} more`}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleUseTemplate(template)}
                          className="bg-gradient-secondary hover:bg-gradient-primary flex-1"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Use Template
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCloneTemplate(template)}
                          className="border-slate-600"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600"
                        >
                          <Code className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-slate-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">No templates found</h3>
              <p className="text-slate-500">
                {searchQuery ? `No templates match "${searchQuery}"` : `No templates in ${selectedCategory} category`}
              </p>
              <Button
                variant="outline"
                className="mt-4 border-slate-600 text-slate-300"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateGallery;
