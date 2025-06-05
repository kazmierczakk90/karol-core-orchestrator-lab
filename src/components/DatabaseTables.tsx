
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, Plus, Edit, Save, X } from 'lucide-react';
import { DatabaseTable, TableVariable } from '@/types/openai';

const DatabaseTables = () => {
  const [tables, setTables] = useState<DatabaseTable[]>([
    {
      id: 'table_system',
      name: 'System Variables',
      description: 'Core system configuration and state variables',
      agentAccess: ['@ceo', '@guardian-core'],
      variables: [
        {
          id: 'var_1',
          name: 'system_status',
          type: 'string',
          value: 'ONLINE',
          description: 'Current system operational status',
          updatedAt: new Date()
        },
        {
          id: 'var_2',
          name: 'agent_count',
          type: 'number',
          value: 10,
          description: 'Number of active agents',
          updatedAt: new Date()
        }
      ]
    },
    {
      id: 'table_metrics',
      name: 'Performance Metrics',
      description: 'KPIs and performance indicators',
      agentAccess: ['@ceo', '@controlling'],
      variables: [
        {
          id: 'var_3',
          name: 'response_time',
          type: 'number',
          value: 1.2,
          description: 'Average response time in seconds',
          updatedAt: new Date()
        },
        {
          id: 'var_4',
          name: 'success_rate',
          type: 'number',
          value: 98.5,
          description: 'Task success rate percentage',
          updatedAt: new Date()
        }
      ]
    }
  ]);

  const [editingVariable, setEditingVariable] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any>('');

  const startEdit = (variable: TableVariable) => {
    setEditingVariable(variable.id);
    setEditValue(variable.value);
  };

  const saveEdit = (tableId: string, variableId: string) => {
    setTables(prev => prev.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          variables: table.variables.map(variable => {
            if (variable.id === variableId) {
              return {
                ...variable,
                value: editValue,
                updatedAt: new Date()
              };
            }
            return variable;
          })
        };
      }
      return table;
    }));

    setEditingVariable(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingVariable(null);
    setEditValue('');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'string': return 'bg-blue-500/20 text-blue-400';
      case 'number': return 'bg-green-500/20 text-green-400';
      case 'boolean': return 'bg-purple-500/20 text-purple-400';
      case 'date': return 'bg-orange-500/20 text-orange-400';
      case 'json': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <ScrollArea className="h-full w-full">
      <div className="space-y-6 p-6">
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database Tables & Variables</span>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Zarządzanie zmiennymi systemowymi dostępnymi dla agentów
            </CardDescription>
          </CardHeader>
        </Card>

        {tables.map((table) => (
          <Card key={table.id} className="bg-slate-800/50 border-blue-800/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-lg">{table.name}</CardTitle>
                  <CardDescription className="text-slate-300">
                    {table.description}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-400">Dostęp:</span>
                  {table.agentAccess.map(agentId => (
                    <Badge key={agentId} variant="outline" className="text-cyan-400 text-xs">
                      {agentId}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Variable</TableHead>
                      <TableHead className="text-slate-300">Type</TableHead>
                      <TableHead className="text-slate-300">Value</TableHead>
                      <TableHead className="text-slate-300">Description</TableHead>
                      <TableHead className="text-slate-300">Updated</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {table.variables.map((variable) => (
                      <TableRow key={variable.id} className="border-slate-700">
                        <TableCell className="text-white font-mono text-sm">
                          {variable.name}
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(variable.type)}>
                            {variable.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          {editingVariable === variable.id ? (
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="bg-slate-900/50 border-slate-700/50 text-white text-sm"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  saveEdit(table.id, variable.id);
                                }
                              }}
                            />
                          ) : (
                            <span className="font-mono text-sm">
                              {typeof variable.value === 'string' 
                                ? `"${variable.value}"` 
                                : String(variable.value)
                              }
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-300 text-sm">
                          {variable.description}
                        </TableCell>
                        <TableCell className="text-slate-400 text-xs">
                          {variable.updatedAt.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {editingVariable === variable.id ? (
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                onClick={() => saveEdit(table.id, variable.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEdit}
                                className="border-red-500/50 text-red-400"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEdit(variable)}
                              className="border-blue-500/50 text-blue-400"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default DatabaseTables;
