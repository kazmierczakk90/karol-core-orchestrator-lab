
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Trash2, ExternalLink, RefreshCw, Edit, Save, X } from 'lucide-react';

interface ScrapVariable {
  id: string;
  name: string;
  value: string | number | boolean;
  type: 'string' | 'number' | 'boolean' | 'url' | 'date';
  updatedAt: Date;
  autoUpdate: boolean;
}

interface ScrapArgument {
  id: string;
  name: string;
  description: string;
  variables: ScrapVariable[];
  createdAt: Date;
}

interface URLScrapEntry {
  id: string;
  url: string;
  title: string;
  domain: string;
  status: 'pending' | 'scraped' | 'error';
  arguments: ScrapArgument[];
  lastScraped?: Date;
  extractedData?: any;
}

interface URLScrapTableProps {
  extractedLinks: Array<{
    url: string;
    title: string;
    domain: string;
  }>;
}

const URLScrapTable = ({ extractedLinks }: URLScrapTableProps) => {
  const [scrapEntries, setScrapEntries] = useState<URLScrapEntry[]>([]);
  const [editingVariable, setEditingVariable] = useState<string | null>(null);
  const [newVariableValue, setNewVariableValue] = useState<string>('');

  // Initialize with extracted links
  useEffect(() => {
    const newEntries: URLScrapEntry[] = extractedLinks.map((link, index) => ({
      id: `scrap_${Date.now()}_${index}`,
      url: link.url,
      title: link.title,
      domain: link.domain,
      status: 'pending' as const,
      arguments: [
        {
          id: `arg_${Date.now()}_${index}_1`,
          name: 'Basic Info',
          description: 'Basic page information',
          createdAt: new Date(),
          variables: [
            { id: `var_${Date.now()}_${index}_1`, name: 'Page Title', value: link.title, type: 'string' as const, updatedAt: new Date(), autoUpdate: true },
            { id: `var_${Date.now()}_${index}_2`, name: 'Domain', value: link.domain, type: 'string' as const, updatedAt: new Date(), autoUpdate: true },
            { id: `var_${Date.now()}_${index}_3`, name: 'URL Length', value: link.url.length, type: 'number' as const, updatedAt: new Date(), autoUpdate: true },
            { id: `var_${Date.now()}_${index}_4`, name: 'Is HTTPS', value: link.url.startsWith('https'), type: 'boolean' as const, updatedAt: new Date(), autoUpdate: true }
          ]
        },
        {
          id: `arg_${Date.now()}_${index}_2`,
          name: 'SEO Data',
          description: 'SEO and metadata information',
          createdAt: new Date(),
          variables: [
            { id: `var_${Date.now()}_${index}_5`, name: 'Meta Description', value: 'Auto-extracted meta description', type: 'string' as const, updatedAt: new Date(), autoUpdate: true },
            { id: `var_${Date.now()}_${index}_6`, name: 'Meta Keywords', value: 'Auto-extracted keywords', type: 'string' as const, updatedAt: new Date(), autoUpdate: true },
            { id: `var_${Date.now()}_${index}_7`, name: 'Page Score', value: Math.floor(Math.random() * 100), type: 'number' as const, updatedAt: new Date(), autoUpdate: true }
          ]
        }
      ]
    }));
    
    setScrapEntries(prev => [...newEntries, ...prev]);
  }, [extractedLinks]);

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    scraped: 'bg-green-500/20 text-green-400',
    error: 'bg-red-500/20 text-red-400'
  };

  const typeColors = {
    string: 'bg-blue-500/20 text-blue-400',
    number: 'bg-green-500/20 text-green-400',
    boolean: 'bg-purple-500/20 text-purple-400',
    url: 'bg-cyan-500/20 text-cyan-400',
    date: 'bg-orange-500/20 text-orange-400'
  };

  const simulateAutoUpdate = () => {
    setScrapEntries(prev => prev.map(entry => ({
      ...entry,
      arguments: entry.arguments.map(arg => ({
        ...arg,
        variables: arg.variables.map(variable => {
          if (variable.autoUpdate) {
            let newValue = variable.value;
            
            // Simulate auto-update logic based on type
            switch (variable.type) {
              case 'number':
                if (typeof variable.value === 'number') {
                  newValue = Math.max(0, variable.value + Math.floor(Math.random() * 10) - 5);
                }
                break;
              case 'boolean':
                if (Math.random() > 0.8) {
                  newValue = !variable.value;
                }
                break;
              case 'string':
                if (variable.name.includes('Score') || variable.name.includes('Rating')) {
                  newValue = `Updated: ${new Date().toLocaleTimeString()}`;
                }
                break;
            }
            
            return {
              ...variable,
              value: newValue,
              updatedAt: new Date()
            };
          }
          return variable;
        })
      }))
    })));
  };

  const editVariable = (variableId: string, currentValue: string | number | boolean) => {
    setEditingVariable(variableId);
    setNewVariableValue(String(currentValue));
  };

  const saveVariable = (argumentId: string, variableId: string) => {
    setScrapEntries(prev => prev.map(entry => ({
      ...entry,
      arguments: entry.arguments.map(arg => 
        arg.id === argumentId ? {
          ...arg,
          variables: arg.variables.map(variable => 
            variable.id === variableId ? {
              ...variable,
              value: variable.type === 'number' ? Number(newVariableValue) : 
                     variable.type === 'boolean' ? newVariableValue === 'true' : 
                     newVariableValue,
              updatedAt: new Date()
            } : variable
          )
        } : arg
      )
    })));
    
    setEditingVariable(null);
    setNewVariableValue('');
  };

  const addNewVariable = (argumentId: string) => {
    const newVariable: ScrapVariable = {
      id: `var_${Date.now()}`,
      name: 'New Variable',
      value: 'Default Value',
      type: 'string',
      updatedAt: new Date(),
      autoUpdate: false
    };

    setScrapEntries(prev => prev.map(entry => ({
      ...entry,
      arguments: entry.arguments.map(arg => 
        arg.id === argumentId ? {
          ...arg,
          variables: [...arg.variables, newVariable]
        } : arg
      )
    })));
  };

  const removeVariable = (argumentId: string, variableId: string) => {
    setScrapEntries(prev => prev.map(entry => ({
      ...entry,
      arguments: entry.arguments.map(arg => 
        arg.id === argumentId ? {
          ...arg,
          variables: arg.variables.filter(variable => variable.id !== variableId)
        } : arg
      )
    })));
  };

  return (
    <Card className="bg-slate-800/50 border-cyan-800/30 h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Search className="h-6 w-6" />
              <span>URL Scrap Table</span>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Dynamic table z argumentami i zmiennymi (X/Y struktura)
            </CardDescription>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              className="bg-gradient-secondary hover:bg-gradient-primary"
              onClick={simulateAutoUpdate}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Auto Update
            </Button>
            
            <Button className="bg-gradient-primary hover:bg-gradient-secondary">
              <Plus className="h-4 w-4 mr-2" />
              Add URL
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {scrapEntries.map((entry) => (
          <Card key={entry.id} className="bg-slate-700/50 border-slate-600/50">
            <CardContent className="p-4">
              {/* URL Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-white">{entry.title}</h3>
                    <Badge className={statusColors[entry.status]}>
                      {entry.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <span>{entry.domain}</span>
                    <span>•</span>
                    <a 
                      href={entry.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-cyan-400 flex items-center space-x-1"
                    >
                      <span className="truncate max-w-xs">{entry.url}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Arguments & Variables Table */}
              <div className="space-y-4">
                {entry.arguments.map((argument) => (
                  <div key={argument.id} className="border border-slate-600/50 rounded-lg overflow-hidden">
                    <div className="bg-slate-800/50 p-3 border-b border-slate-600/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-cyan-400">{argument.name}</h4>
                          <p className="text-slate-400 text-sm">{argument.description}</p>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-gradient-primary hover:bg-gradient-secondary"
                          onClick={() => addNewVariable(argument.id)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Variable
                        </Button>
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-600/50">
                          <TableHead className="text-slate-300">Variable Name</TableHead>
                          <TableHead className="text-slate-300">Type</TableHead>
                          <TableHead className="text-slate-300">Value</TableHead>
                          <TableHead className="text-slate-300">Auto Update</TableHead>
                          <TableHead className="text-slate-300">Updated</TableHead>
                          <TableHead className="text-slate-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {argument.variables.map((variable) => (
                          <TableRow key={variable.id} className="border-slate-600/50">
                            <TableCell className="font-medium text-white">
                              {variable.name}
                            </TableCell>
                            
                            <TableCell>
                              <Badge className={typeColors[variable.type]}>
                                {variable.type}
                              </Badge>
                            </TableCell>
                            
                            <TableCell>
                              {editingVariable === variable.id ? (
                                <div className="flex space-x-2">
                                  {variable.type === 'boolean' ? (
                                    <Select value={newVariableValue} onValueChange={setNewVariableValue}>
                                      <SelectTrigger className="w-24 bg-slate-900/50 border-slate-700/50 text-white">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="true">true</SelectItem>
                                        <SelectItem value="false">false</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <Input
                                      value={newVariableValue}
                                      onChange={(e) => setNewVariableValue(e.target.value)}
                                      className="w-32 bg-slate-900/50 border-slate-700/50 text-white"
                                      type={variable.type === 'number' ? 'number' : 'text'}
                                    />
                                  )}
                                  <Button 
                                    size="sm" 
                                    className="bg-green-500 hover:bg-green-600"
                                    onClick={() => saveVariable(argument.id, variable.id)}
                                  >
                                    <Save className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="border-slate-600"
                                    onClick={() => setEditingVariable(null)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <span className="text-slate-300">
                                    {variable.type === 'boolean' ? String(variable.value) : variable.value}
                                  </span>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="text-slate-400 hover:text-white"
                                    onClick={() => editVariable(variable.id, variable.value)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                            
                            <TableCell>
                              <Badge className={variable.autoUpdate ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                                {variable.autoUpdate ? 'Auto' : 'Manual'}
                              </Badge>
                            </TableCell>
                            
                            <TableCell className="text-slate-400 text-sm">
                              {variable.updatedAt.toLocaleTimeString()}
                            </TableCell>
                            
                            <TableCell>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-slate-600 hover:border-red-400 text-red-400"
                                onClick={() => removeVariable(argument.id, variable.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {scrapEntries.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No URLs to scrap</p>
            <p>Extract links from Browser Core or add URLs manually</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default URLScrapTable;
