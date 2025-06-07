
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  Grid, 
  BarChart3, 
  Table, 
  Card as CardIcon,
  Layout,
  Image,
  Type,
  Calendar,
  Settings
} from 'lucide-react';
import { useLayoutStore } from '@/stores/layoutStore';

interface ComponentDefinition {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  defaultProps: Record<string, any>;
  defaultStyle: Record<string, any>;
  template: {
    type: 'component' | 'container' | 'widget';
    component: string;
    position: {
      width: number;
      height: number;
    };
  };
}

const componentLibrary: ComponentDefinition[] = [
  {
    id: 'analytics-card',
    name: 'Analytics Card',
    category: 'Analytics',
    icon: <BarChart3 className="h-4 w-4" />,
    description: 'Card with chart display',
    defaultProps: { title: 'Analytics', value: '1,234' },
    defaultStyle: { backgroundColor: 'slate-800', borderRadius: '8px' },
    template: {
      type: 'component',
      component: 'AnalyticsCard',
      position: { width: 300, height: 200 }
    }
  },
  {
    id: 'data-table',
    name: 'Data Table',
    category: 'Data',
    icon: <Table className="h-4 w-4" />,
    description: 'Interactive data table',
    defaultProps: { columns: [], data: [] },
    defaultStyle: { backgroundColor: 'white', borderRadius: '8px' },
    template: {
      type: 'component',
      component: 'DataTable',
      position: { width: 600, height: 400 }
    }
  },
  {
    id: 'stat-widget',
    name: 'Stat Widget',
    category: 'Widgets',
    icon: <Grid className="h-4 w-4" />,
    description: 'Statistics display widget',
    defaultProps: { metric: 'Users', value: '2,547', change: '+12%' },
    defaultStyle: { backgroundColor: 'blue-50', borderRadius: '12px' },
    template: {
      type: 'widget',
      component: 'StatWidget',
      position: { width: 250, height: 120 }
    }
  },
  {
    id: 'navigation-tree',
    name: 'Navigation Tree',
    category: 'Navigation',
    icon: <Layout className="h-4 w-4" />,
    description: 'Tree navigation component',
    defaultProps: { expandable: true, searchable: true },
    defaultStyle: { backgroundColor: 'slate-800', borderRadius: '8px' },
    template: {
      type: 'component',
      component: 'NavigationTree',
      position: { width: 300, height: 500 }
    }
  },
  {
    id: 'chart-container',
    name: 'Chart Container',
    category: 'Analytics',
    icon: <BarChart3 className="h-4 w-4" />,
    description: 'Container for various chart types',
    defaultProps: { chartType: 'line', data: [] },
    defaultStyle: { backgroundColor: 'white', borderRadius: '8px' },
    template: {
      type: 'container',
      component: 'ChartContainer',
      position: { width: 500, height: 300 }
    }
  },
  {
    id: 'image-widget',
    name: 'Image Widget',
    category: 'Media',
    icon: <Image className="h-4 w-4" />,
    description: 'Image display with controls',
    defaultProps: { src: '', alt: 'Image', fit: 'cover' },
    defaultStyle: { borderRadius: '8px' },
    template: {
      type: 'widget',
      component: 'ImageWidget',
      position: { width: 200, height: 200 }
    }
  },
  {
    id: 'text-block',
    name: 'Text Block',
    category: 'Content',
    icon: <Type className="h-4 w-4" />,
    description: 'Rich text content block',
    defaultProps: { content: 'Enter your text here...', size: 'medium' },
    defaultStyle: { padding: '16px' },
    template: {
      type: 'component',
      component: 'TextBlock',
      position: { width: 400, height: 150 }
    }
  }
];

const categories = [...new Set(componentLibrary.map(comp => comp.category))];

interface ComponentLibraryProps {
  className?: string;
}

const ComponentLibrary = ({ className }: ComponentLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { addElement } = useLayoutStore();

  const filteredComponents = componentLibrary.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddComponent = (component: ComponentDefinition) => {
    const element = {
      type: component.template.type,
      name: component.name,
      component: component.template.component,
      props: component.defaultProps,
      style: component.defaultStyle,
      position: {
        x: Math.random() * 300,
        y: Math.random() * 200,
        width: component.template.position.width,
        height: component.template.position.height
      },
      constraints: {
        resizable: true,
        draggable: true,
        locked: false
      }
    };

    addElement(element);
  };

  return (
    <Card className={`bg-slate-800/50 border-slate-700/50 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg flex items-center space-x-2">
          <Grid className="h-5 w-5 text-cyan-400" />
          <span>Component Library</span>
        </CardTitle>
        
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="p-4 space-y-3">
            {filteredComponents.map(component => (
              <div
                key={component.id}
                className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-600/50 rounded-lg">
                      {component.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{component.name}</h3>
                      <p className="text-slate-400 text-sm">{component.description}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddComponent(component)}
                    className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/30"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                    {component.category}
                  </Badge>
                  <div className="text-xs text-slate-500">
                    {component.template.position.width} × {component.template.position.height}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredComponents.length === 0 && (
              <div className="text-center py-8">
                <Grid className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No components found</p>
                <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ComponentLibrary;
