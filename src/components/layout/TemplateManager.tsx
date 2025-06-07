
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Layout as LayoutIcon, 
  Plus, 
  Download, 
  Upload, 
  Trash2, 
  Copy,
  Star,
  Grid,
  BarChart3,
  Table,
  Settings
} from 'lucide-react';
import { useLayoutStore } from '@/stores/layoutStore';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  tags: string[];
  isOfficial: boolean;
  isFavorite: boolean;
  layout: {
    elements: Record<string, any>;
    rootElements: string[];
  };
  metadata: {
    author: string;
    version: string;
    lastModified: Date;
    downloads: number;
  };
}

const predefinedTemplates: Template[] = [
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'Complete analytics dashboard with charts and KPIs',
    category: 'Analytics',
    thumbnail: '/templates/analytics-dashboard.png',
    tags: ['analytics', 'charts', 'kpi', 'dashboard'],
    isOfficial: true,
    isFavorite: false,
    layout: {
      elements: {
        'header-1': {
          id: 'header-1',
          type: 'component',
          name: 'Dashboard Header',
          component: 'DashboardHeader',
          position: { x: 0, y: 0, width: 1200, height: 80 },
          props: { title: 'Analytics Dashboard' }
        },
        'stats-1': {
          id: 'stats-1',
          type: 'widget',
          name: 'Stats Widget',
          component: 'StatWidget',
          position: { x: 20, y: 100, width: 280, height: 120 },
          props: { metric: 'Total Users', value: '12,459', change: '+12%' }
        },
        'chart-1': {
          id: 'chart-1',
          type: 'component',
          name: 'Revenue Chart',
          component: 'LineChart',
          position: { x: 320, y: 100, width: 560, height: 300 },
          props: { title: 'Revenue Trend', data: [] }
        },
        'table-1': {
          id: 'table-1',
          type: 'component',
          name: 'Data Table',
          component: 'DataTable',
          position: { x: 20, y: 420, width: 860, height: 300 },
          props: { title: 'Recent Transactions', columns: [], data: [] }
        }
      },
      rootElements: ['header-1', 'stats-1', 'chart-1', 'table-1']
    },
    metadata: {
      author: 'Karol-Core Team',
      version: '1.0.0',
      lastModified: new Date(),
      downloads: 1247
    }
  },
  {
    id: 'admin-panel',
    name: 'Admin Panel',
    description: 'Complete admin interface with navigation and content areas',
    category: 'Admin',
    thumbnail: '/templates/admin-panel.png',
    tags: ['admin', 'panel', 'navigation', 'management'],
    isOfficial: true,
    isFavorite: false,
    layout: {
      elements: {
        'sidebar-1': {
          id: 'sidebar-1',
          type: 'component',
          name: 'Admin Sidebar',
          component: 'AdminSidebar',
          position: { x: 0, y: 0, width: 250, height: 800 },
          props: { expanded: true }
        },
        'topbar-1': {
          id: 'topbar-1',
          type: 'component',
          name: 'Top Navigation',
          component: 'TopNavigation',
          position: { x: 250, y: 0, width: 950, height: 60 },
          props: { showProfile: true }
        },
        'content-1': {
          id: 'content-1',
          type: 'container',
          name: 'Main Content',
          component: 'ContentArea',
          position: { x: 250, y: 60, width: 950, height: 740 },
          props: { padding: '24px' }
        }
      },
      rootElements: ['sidebar-1', 'topbar-1', 'content-1']
    },
    metadata: {
      author: 'Karol-Core Team',
      version: '1.2.0',
      lastModified: new Date(),
      downloads: 856
    }
  },
  {
    id: 'monitoring-center',
    name: 'Monitoring Center',
    description: 'System monitoring dashboard with real-time metrics',
    category: 'Monitoring',
    thumbnail: '/templates/monitoring-center.png',
    tags: ['monitoring', 'metrics', 'real-time', 'system'],
    isOfficial: true,
    isFavorite: false,
    layout: {
      elements: {
        'status-grid': {
          id: 'status-grid',
          type: 'container',
          name: 'Status Grid',
          component: 'StatusGrid',
          position: { x: 20, y: 20, width: 1160, height: 200 },
          props: { columns: 4 }
        },
        'chart-real-time': {
          id: 'chart-real-time',
          type: 'component',
          name: 'Real-time Chart',
          component: 'RealTimeChart',
          position: { x: 20, y: 240, width: 760, height: 400 },
          props: { interval: 1000, maxDataPoints: 50 }
        },
        'alerts-panel': {
          id: 'alerts-panel',
          type: 'component',
          name: 'Alerts Panel',
          component: 'AlertsPanel',
          position: { x: 800, y: 240, width: 380, height: 400 },
          props: { maxAlerts: 10 }
        }
      },
      rootElements: ['status-grid', 'chart-real-time', 'alerts-panel']
    },
    metadata: {
      author: 'Karol-Core Team',
      version: '1.1.0',
      lastModified: new Date(),
      downloads: 623
    }
  }
];

interface TemplateManagerProps {
  className?: string;
}

const TemplateManager = ({ className }: TemplateManagerProps) => {
  const [templates, setTemplates] = useState<Template[]>(predefinedTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { createLayout, setActiveLayout } = useLayoutStore();

  const categories = ['all', ...new Set(templates.map(t => t.category))];
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApplyTemplate = (template: Template) => {
    const layoutId = createLayout(`${template.name} - ${new Date().toLocaleDateString()}`);
    setActiveLayout(layoutId);
    
    // Apply template layout to the new layout
    // This would be implemented with the layout store
    console.log('Applying template:', template.name, 'to layout:', layoutId);
  };

  const handleToggleFavorite = (templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, isFavorite: !template.isFavorite }
        : template
    ));
  };

  const handleExportTemplate = (template: Template) => {
    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported: Template = JSON.parse(e.target?.result as string);
        imported.id = `imported-${Date.now()}`;
        imported.isOfficial = false;
        imported.metadata.author = 'Imported';
        imported.metadata.lastModified = new Date();
        
        setTemplates(prev => [...prev, imported]);
      } catch (error) {
        console.error('Failed to import template:', error);
      }
    };
    reader.readAsText(file);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Analytics': return <BarChart3 className="h-4 w-4" />;
      case 'Admin': return <Settings className="h-4 w-4" />;
      case 'Monitoring': return <Grid className="h-4 w-4" />;
      default: return <LayoutIcon className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`bg-slate-800/50 border-slate-700/50 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg flex items-center space-x-2">
            <LayoutIcon className="h-5 w-5 text-cyan-400" />
            <span>Template Manager</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="relative">
              <Upload className="h-4 w-4 mr-2" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImportTemplate}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </Button>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="space-y-3">
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-700/50 border-slate-600 text-white"
          />
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category !== 'all' && getCategoryIcon(category)}
                <span className="ml-1">{category}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="p-4 space-y-4">
            {filteredTemplates.map(template => (
              <Card key={template.id} className="bg-slate-700/50 border-slate-600/50 hover:border-cyan-500/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-white font-medium">{template.name}</h3>
                        {template.isOfficial && (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 text-xs">
                            Official
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleFavorite(template.id)}
                          className="p-1 h-6 w-6"
                        >
                          <Star className={`h-4 w-4 ${template.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}`} />
                        </Button>
                      </div>
                      <p className="text-slate-400 text-sm mb-2">{template.description}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {template.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span>By {template.metadata.author}</span>
                        <span>{template.metadata.downloads} downloads</span>
                        <span>v{template.metadata.version}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={`${getCategoryIcon(template.category)} bg-purple-500/20 text-purple-400 border-purple-500/50`}>
                      {getCategoryIcon(template.category)}
                      <span className="ml-1">{template.category}</span>
                    </Badge>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExportTemplate(template)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApplyTemplate(template)}
                        className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/30"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Apply
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredTemplates.length === 0 && (
              <div className="text-center py-8">
                <LayoutIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No templates found</p>
                <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TemplateManager;
