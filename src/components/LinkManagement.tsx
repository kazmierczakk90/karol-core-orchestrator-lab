
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, Plus, Trash2, Edit, Save, X, Globe, Calendar, 
  Link, Tag, Filter, Download, Upload, RefreshCw, Settings,
  Database, Eye, EyeOff, ChevronDown, ChevronUp
} from 'lucide-react';

interface LinkRule {
  id: string;
  columnName: string;
  columnType: 'string' | 'number' | 'boolean' | 'url' | 'date' | 'tags';
  nullable: boolean;
  defaultValue?: any;
  validation?: string;
  isVisible: boolean;
}

interface LinkEntry {
  id: string;
  url: string;
  title: string;
  domain: string;
  category: string;
  tags: string[];
  dateAdded: Date;
  lastVisited?: Date;
  description?: string;
  priority: number;
  isActive: boolean;
  metadata: Record<string, any>;
}

const LinkManagement = () => {
  const [linkEntries, setLinkEntries] = useState<LinkEntry[]>([]);
  const [linkRules, setLinkRules] = useState<LinkRule[]>([]);
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showRulesPanel, setShowRulesPanel] = useState(false);
  const [editingRule, setEditingRule] = useState<string | null>(null);

  // Initialize with default rules similar to the database interface
  useEffect(() => {
    const defaultRules: LinkRule[] = [
      { id: '1', columnName: 'ca_address_id', columnType: 'string', nullable: false, isVisible: true },
      { id: '2', columnName: 'ca_address', columnType: 'url', nullable: false, isVisible: true },
      { id: '3', columnName: 'ca_street_number', columnType: 'string', nullable: false, isVisible: true },
      { id: '4', columnName: 'ca_street_name', columnType: 'string', nullable: false, isVisible: true },
      { id: '5', columnName: 'ca_street_type', columnType: 'string', nullable: false, isVisible: true },
      { id: '6', columnName: 'ca_suite_number', columnType: 'string', nullable: false, isVisible: true },
      { id: '7', columnName: 'ca_city', columnType: 'string', nullable: false, isVisible: true },
      { id: '8', columnName: 'ca_county', columnType: 'string', nullable: false, isVisible: true },
      { id: '9', columnName: 'ca_state', columnType: 'string', nullable: false, isVisible: true },
      { id: '10', columnName: 'ca_zip', columnType: 'string', nullable: false, isVisible: true },
    ];
    setLinkRules(defaultRules);

    // Sample link entries
    const sampleLinks: LinkEntry[] = [
      {
        id: '1',
        url: 'https://github.com/karol-core',
        title: 'Karol Core Repository',
        domain: 'github.com',
        category: 'development',
        tags: ['ai', 'agi', 'typescript'],
        dateAdded: new Date(),
        priority: 5,
        isActive: true,
        metadata: {}
      },
      {
        id: '2',
        url: 'https://docs.openai.com',
        title: 'OpenAI Documentation',
        domain: 'docs.openai.com',
        category: 'documentation',
        tags: ['ai', 'api', 'gpt'],
        dateAdded: new Date(),
        priority: 4,
        isActive: true,
        metadata: {}
      }
    ];
    setLinkEntries(sampleLinks);
  }, []);

  const categories = ['all', 'development', 'documentation', 'research', 'tools', 'social'];

  const addNewRule = () => {
    const newRule: LinkRule = {
      id: Date.now().toString(),
      columnName: 'new_column',
      columnType: 'string',
      nullable: true,
      isVisible: true
    };
    setLinkRules([...linkRules, newRule]);
    setEditingRule(newRule.id);
  };

  const updateRule = (ruleId: string, updates: Partial<LinkRule>) => {
    setLinkRules(linkRules.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ));
  };

  const deleteRule = (ruleId: string) => {
    setLinkRules(linkRules.filter(rule => rule.id !== ruleId));
  };

  const addNewLink = () => {
    const newLink: LinkEntry = {
      id: Date.now().toString(),
      url: '',
      title: 'New Link',
      domain: '',
      category: 'development',
      tags: [],
      dateAdded: new Date(),
      priority: 3,
      isActive: true,
      metadata: {}
    };
    setLinkEntries([newLink, ...linkEntries]);
  };

  const filteredLinks = linkEntries.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         link.domain.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || link.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLinks(filteredLinks.map(link => link.id));
    } else {
      setSelectedLinks([]);
    }
  };

  const handleSelectLink = (linkId: string, checked: boolean) => {
    if (checked) {
      setSelectedLinks([...selectedLinks, linkId]);
    } else {
      setSelectedLinks(selectedLinks.filter(id => id !== linkId));
    }
  };

  const deleteSelectedLinks = () => {
    setLinkEntries(linkEntries.filter(link => !selectedLinks.includes(link.id)));
    setSelectedLinks([]);
  };

  return (
    <div className="h-full flex bg-gradient-dark">
      {/* Left Sidebar - Similar to Catalog in the image */}
      <div className="w-64 bg-slate-800/50 border-r border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-cyan-400 font-semibold flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Link Catalog</span>
          </h2>
        </div>
        
        <div className="flex-1 p-4 space-y-3">
          <div>
            <h3 className="text-sm text-slate-300 mb-2 flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Categories</span>
            </h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`w-full text-left p-2 text-sm rounded transition-colors ${
                    filterCategory === category
                      ? 'bg-gradient-primary text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm text-slate-300 mb-2 flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Actions</span>
            </h3>
            <div className="space-y-2">
              <Button 
                onClick={addNewLink} 
                size="sm" 
                className="w-full bg-gradient-primary hover:bg-gradient-secondary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
              <Button 
                onClick={() => setShowRulesPanel(!showRulesPanel)} 
                variant="outline" 
                size="sm" 
                className="w-full border-slate-600"
              >
                <Tag className="h-4 w-4 mr-2" />
                Column Rules
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with search and controls */}
        <div className="p-4 border-b border-slate-700 bg-slate-800/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-white">Link Management</h1>
              <p className="text-slate-400 text-sm">Manage your web links and scraping rules</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                {filteredLinks.length} links
              </Badge>
              {selectedLinks.length > 0 && (
                <Button 
                  onClick={deleteSelectedLinks}
                  variant="outline" 
                  size="sm" 
                  className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedLinks.length})
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search links..."
                className="pl-10 bg-slate-900/50 border-slate-600 text-white"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48 bg-slate-900/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-white hover:bg-slate-700">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto p-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedLinks.length === filteredLinks.length && filteredLinks.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="text-slate-300">COLUMN NAME</TableHead>
                    <TableHead className="text-slate-300">COLUMN TYPE</TableHead>
                    <TableHead className="text-slate-300">NULLABLE</TableHead>
                    <TableHead className="text-slate-300 text-center">COLUMN RULES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {linkRules.filter(rule => rule.isVisible).map((rule) => (
                    <TableRow key={rule.id} className="border-slate-700">
                      <TableCell>
                        <Switch 
                          checked={rule.isVisible}
                          onCheckedChange={(checked) => updateRule(rule.id, { isVisible: checked })}
                        />
                      </TableCell>
                      <TableCell className="text-white font-medium">
                        {editingRule === rule.id ? (
                          <Input
                            value={rule.columnName}
                            onChange={(e) => updateRule(rule.id, { columnName: e.target.value })}
                            className="bg-slate-900/50 border-slate-600 text-white"
                          />
                        ) : (
                          rule.columnName
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRule === rule.id ? (
                          <Select 
                            value={rule.columnType} 
                            onValueChange={(value) => updateRule(rule.id, { columnType: value as any })}
                          >
                            <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              <SelectItem value="string">string</SelectItem>
                              <SelectItem value="number">number</SelectItem>
                              <SelectItem value="boolean">boolean</SelectItem>
                              <SelectItem value="url">url</SelectItem>
                              <SelectItem value="date">date</SelectItem>
                              <SelectItem value="tags">tags</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                            {rule.columnType}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={rule.nullable ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400'}>
                          {rule.nullable ? 'true' : 'false'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {editingRule === rule.id ? (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => setEditingRule(null)}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setEditingRule(null)}
                                className="border-slate-600"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setEditingRule(rule.id)}
                                className="border-slate-600"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => deleteRule(rule.id)}
                                className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Rules Panel */}
        {showRulesPanel && (
          <div className="border-t border-slate-700 bg-slate-800/30 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Column Rules</h3>
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={addNewRule} 
                  size="sm" 
                  className="bg-gradient-primary hover:bg-gradient-secondary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
                <Button 
                  onClick={() => setShowRulesPanel(false)} 
                  variant="ghost" 
                  size="sm"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-slate-400">
              Configure column types, validation rules, and display settings for your link database.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkManagement;
