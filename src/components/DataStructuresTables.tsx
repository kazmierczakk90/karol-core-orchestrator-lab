
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, Search, Filter, Download, Plus, Edit, Trash2 } from 'lucide-react';

interface TableColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'json';
  sortable: boolean;
}

interface TableData {
  id: string;
  name: string;
  description: string;
  columns: TableColumn[];
  rows: Record<string, any>[];
  category: string;
}

const DataStructuresTables = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState<string>('agents');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const tables: TableData[] = [
    {
      id: 'agents',
      name: 'System Agents',
      description: 'Lista wszystkich agentów w systemie Karol Core',
      category: 'Core',
      columns: [
        { key: 'id', label: 'ID', type: 'text', sortable: true },
        { key: 'name', label: 'Nazwa', type: 'text', sortable: true },
        { key: 'type', label: 'Typ', type: 'text', sortable: true },
        { key: 'status', label: 'Status', type: 'text', sortable: true },
        { key: 'lastActive', label: 'Ostatnia aktywność', type: 'date', sortable: true },
        { key: 'priority', label: 'Priorytet', type: 'number', sortable: true }
      ],
      rows: [
        {
          id: '@ceo',
          name: 'CEO Agent',
          type: 'Strategic',
          status: 'Active',
          lastActive: '2024-01-15T10:30:00',
          priority: 10
        },
        {
          id: '@voice-core',
          name: 'Voice Core',
          type: 'Interface',
          status: 'Active',
          lastActive: '2024-01-15T10:25:00',
          priority: 8
        },
        {
          id: '@guardian-core',
          name: 'Guardian Core',
          type: 'Security',
          status: 'Active',
          lastActive: '2024-01-15T10:20:00',
          priority: 9
        },
        {
          id: '@data-processor',
          name: 'Data Processor',
          type: 'Processing',
          status: 'Idle',
          lastActive: '2024-01-15T09:45:00',
          priority: 6
        }
      ]
    },
    {
      id: 'miniAI',
      name: 'Mini AI Instances',
      description: 'Wszystkie instancje Mini AI w systemie',
      category: 'AI',
      columns: [
        { key: 'id', label: 'ID', type: 'text', sortable: true },
        { key: 'name', label: 'Nazwa', type: 'text', sortable: true },
        { key: 'type', label: 'Typ', type: 'text', sortable: true },
        { key: 'isActive', label: 'Aktywny', type: 'boolean', sortable: true },
        { key: 'executions', label: 'Wykonania', type: 'number', sortable: true },
        { key: 'createdAt', label: 'Utworzony', type: 'date', sortable: true }
      ],
      rows: [
        {
          id: 'link-extractor',
          name: 'Inteligentny Ekstraktor Linków',
          type: 'standard-tool',
          isActive: true,
          executions: 23,
          createdAt: '2024-01-10T14:30:00'
        },
        {
          id: 'text-summarizer',
          name: 'Podsumowywacz Tekstu',
          type: 'standard-tool',
          isActive: true,
          executions: 15,
          createdAt: '2024-01-12T09:15:00'
        },
        {
          id: 'task-timer',
          name: 'Task Timer Pro',
          type: 'mini-app',
          isActive: false,
          executions: 8,
          createdAt: '2024-01-14T16:20:00'
        }
      ]
    },
    {
      id: 'memory',
      name: 'Memory Entries',
      description: 'Wpisy pamięci agentów i systemu',
      category: 'Memory',
      columns: [
        { key: 'id', label: 'ID', type: 'text', sortable: true },
        { key: 'agentId', label: 'Agent', type: 'text', sortable: true },
        { key: 'importance', label: 'Ważność', type: 'number', sortable: true },
        { key: 'memoryType', label: 'Typ', type: 'text', sortable: true },
        { key: 'content', label: 'Treść', type: 'text', sortable: false },
        { key: 'timestamp', label: 'Czas', type: 'date', sortable: true }
      ],
      rows: [
        {
          id: 'mem-001',
          agentId: '@ceo',
          importance: 5,
          memoryType: 'permanent',
          content: 'System initialization completed successfully',
          timestamp: '2024-01-15T08:00:00'
        },
        {
          id: 'mem-002',
          agentId: '@voice-core',
          importance: 3,
          memoryType: 'session',
          content: 'Voice recognition calibrated for user',
          timestamp: '2024-01-15T09:30:00'
        },
        {
          id: 'mem-003',
          agentId: '@guardian-core',
          importance: 4,
          memoryType: 'permanent',
          content: 'Security protocols updated',
          timestamp: '2024-01-15T10:00:00'
        }
      ]
    },
    {
      id: 'connections',
      name: 'System Connections',
      description: 'Połączenia i integracje systemowe',
      category: 'Infrastructure',
      columns: [
        { key: 'id', label: 'ID', type: 'text', sortable: true },
        { key: 'source', label: 'Źródło', type: 'text', sortable: true },
        { key: 'target', label: 'Cel', type: 'text', sortable: true },
        { key: 'protocol', label: 'Protokół', type: 'text', sortable: true },
        { key: 'status', label: 'Status', type: 'text', sortable: true },
        { key: 'latency', label: 'Opóźnienie (ms)', type: 'number', sortable: true }
      ],
      rows: [
        {
          id: 'conn-001',
          source: 'AGI-Core',
          target: 'OpenAI-API',
          protocol: 'HTTPS',
          status: 'Connected',
          latency: 150
        },
        {
          id: 'conn-002',
          source: 'Browser-Core',
          target: 'Vector-Store',
          protocol: 'WebSocket',
          status: 'Connected',
          latency: 25
        },
        {
          id: 'conn-003',
          source: 'FUKO-PZK',
          target: 'Memory-System',
          protocol: 'Internal',
          status: 'Connected',
          latency: 5
        }
      ]
    }
  ];

  const currentTable = tables.find(t => t.id === selectedTable) || tables[0];

  const formatCellValue = (value: any, type: string) => {
    switch (type) {
      case 'date':
        return new Date(value).toLocaleString();
      case 'boolean':
        return value ? 'Tak' : 'Nie';
      case 'json':
        return JSON.stringify(value);
      default:
        return String(value);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'Active': 'bg-green-500/20 text-green-400 border-green-500/50',
      'Idle': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      'Connected': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      'Disconnected': 'bg-red-500/20 text-red-400 border-red-500/50'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  };

  const filteredRows = currentTable.rows.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const exportTable = () => {
    const csvContent = [
      currentTable.columns.map(col => col.label).join(','),
      ...sortedRows.map(row => 
        currentTable.columns.map(col => `"${formatCellValue(row[col.key], col.type)}"`).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTable.name}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Database className="h-6 w-6" />
              <span>Data Structures & Tables</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                {tables.length} tabel
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                {sortedRows.length} rekordów
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Table Selector */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Tabele</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {tables.map((table) => (
              <Button
                key={table.id}
                onClick={() => setSelectedTable(table.id)}
                variant={selectedTable === table.id ? "default" : "ghost"}
                className="w-full justify-start text-left"
                size="sm"
              >
                <div>
                  <div className="font-medium">{table.name}</div>
                  <div className="text-xs text-slate-400">{table.category}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Main Table View */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">{currentTable.name}</CardTitle>
                  <p className="text-sm text-slate-400 mt-1">{currentTable.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={exportTable} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Eksport CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1">
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Szukaj w tabeli..."
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <Badge className="bg-slate-700 text-slate-300">
                  {sortedRows.length} z {currentTable.rows.length}
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      {currentTable.columns.map((column) => (
                        <TableHead
                          key={column.key}
                          className={`text-slate-300 ${column.sortable ? 'cursor-pointer hover:text-white' : ''}`}
                          onClick={() => column.sortable && handleSort(column.key)}
                        >
                          <div className="flex items-center space-x-1">
                            <span>{column.label}</span>
                            {column.sortable && sortColumn === column.key && (
                              <span className="text-xs">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="text-slate-300">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedRows.map((row, index) => (
                      <TableRow key={index} className="border-slate-700 hover:bg-slate-700/20">
                        {currentTable.columns.map((column) => (
                          <TableCell key={column.key} className="text-slate-300">
                            {column.key === 'status' && typeof row[column.key] === 'string' ? (
                              <Badge className={getStatusBadge(row[column.key])}>
                                {row[column.key]}
                              </Badge>
                            ) : column.key === 'isActive' ? (
                              <Badge className={row[column.key] ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                {row[column.key] ? 'Aktywny' : 'Nieaktywny'}
                              </Badge>
                            ) : (
                              formatCellValue(row[column.key], column.type)
                            )}
                          </TableCell>
                        ))}
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {sortedRows.length === 0 && (
                <div className="text-center text-slate-400 py-12">
                  <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Brak danych do wyświetlenia</p>
                  <p className="text-sm">Zmień kryteria wyszukiwania lub dodaj nowe rekordy</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataStructuresTables;
