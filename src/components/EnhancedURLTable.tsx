
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Database, Search, Edit, Trash2, Eye, Download, 
  Plus, MoreVertical, ChevronUp, ChevronDown, Power
} from 'lucide-react';

interface TableData {
  id: string;
  name: string;
  columns: string[];
  data: any[];
}

interface EnhancedURLTableProps {
  extractedLinks: Array<{
    url: string;
    title: string;
    domain: string;
  }>;
}

const EnhancedURLTable = ({ extractedLinks }: EnhancedURLTableProps) => {
  const [selectedTable, setSelectedTable] = useState('url-scrap');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [editingCell, setEditingCell] = useState<{row: number, col: string} | null>(null);
  const [editValue, setEditValue] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const tables: TableData[] = [
    {
      id: 'url-scrap',
      name: 'URL Scrap Table',
      columns: ['ID', 'URL', 'Title', 'Domain', 'Status', 'Last Scraped', 'Data Count'],
      data: extractedLinks.map((link, index) => ({
        id: `url_${index}`,
        url: link.url,
        title: link.title,
        domain: link.domain,
        status: 'Ready',
        lastScraped: 'Never',
        dataCount: 0
      }))
    },
    {
      id: 'system-agents',
      name: 'System Agents',
      columns: ['ID', 'Name', 'Type', 'Status', 'Priority', 'Last Active'],
      data: [
        { id: '@ceo', name: 'CEO Agent', type: 'Strategic', status: 'Active', priority: 10, lastActive: '2024-01-15T10:30:00' },
        { id: '@voice-core', name: 'Voice Core', type: 'Interface', status: 'Active', priority: 8, lastActive: '2024-01-15T10:25:00' },
        { id: '@guardian-core', name: 'Guardian Core', type: 'Security', status: 'Active', priority: 9, lastActive: '2024-01-15T10:20:00' }
      ]
    },
    {
      id: 'memory-entries',
      name: 'Memory Entries',
      columns: ['ID', 'Agent', 'Type', 'Importance', 'Content', 'Timestamp'],
      data: [
        { id: 'mem-001', agent: '@ceo', type: 'permanent', importance: 5, content: 'System initialization completed', timestamp: '2024-01-15T08:00:00' },
        { id: 'mem-002', agent: '@voice-core', type: 'session', importance: 3, content: 'Voice recognition calibrated', timestamp: '2024-01-15T09:30:00' }
      ]
    },
    {
      id: 'connections',
      name: 'System Connections',
      columns: ['ID', 'Source', 'Target', 'Protocol', 'Status', 'Latency'],
      data: [
        { id: 'conn-001', source: 'AGI-Core', target: 'OpenAI-API', protocol: 'HTTPS', status: 'Connected', latency: 150 },
        { id: 'conn-002', source: 'Browser-Core', target: 'Vector-Store', protocol: 'WebSocket', status: 'Connected', latency: 25 }
      ]
    }
  ];

  const currentTable = tables.find(t => t.id === selectedTable) || tables[0];

  const filteredData = useMemo(() => {
    return currentTable.data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [currentTable.data, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleCellEdit = (rowIndex: number, column: string, value: any) => {
    setEditingCell({ row: rowIndex, col: column });
    setEditValue(String(value));
  };

  const handleCellSave = () => {
    if (!editingCell) return;
    
    // Update the data (in real app, this would sync with backend)
    const updatedData = [...currentTable.data];
    const rowIndex = sortedData.findIndex((_, idx) => idx === editingCell.row);
    if (rowIndex !== -1) {
      updatedData[rowIndex] = {
        ...updatedData[rowIndex],
        [editingCell.col]: editValue
      };
    }
    
    setEditingCell(null);
    setEditValue('');
  };

  const handleSelectAll = () => {
    if (selectedRows.size === sortedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(sortedData.map((_, idx) => String(idx))));
    }
  };

  const handleRowSelect = (rowIndex: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowIndex)) {
      newSelected.delete(rowIndex);
    } else {
      newSelected.add(rowIndex);
    }
    setSelectedRows(newSelected);
  };

  const exportData = (format: 'csv' | 'json') => {
    const dataToExport = selectedRows.size > 0 
      ? sortedData.filter((_, idx) => selectedRows.has(String(idx)))
      : sortedData;

    if (format === 'csv') {
      const csvContent = [
        currentTable.columns.join(','),
        ...dataToExport.map(row => 
          currentTable.columns.map(col => `"${row[col.toLowerCase().replace(' ', '')] || ''}"`).join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentTable.name.replace(/\s+/g, '_')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const jsonContent = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentTable.name.replace(/\s+/g, '_')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'Active': 'bg-green-500/20 text-green-400',
      'Ready': 'bg-blue-500/20 text-blue-400',
      'Connected': 'bg-green-500/20 text-green-400',
      'Idle': 'bg-yellow-500/20 text-yellow-400',
      'Disconnected': 'bg-red-500/20 text-red-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <Card className="bg-slate-800/50 border-cyan-800/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <Database className="h-6 w-6" />
            <span>Enhanced Data Tables</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-cyan-500/20 text-cyan-400">
              {sortedData.length} rows
            </Badge>
            {selectedRows.size > 0 && (
              <Badge className="bg-purple-500/20 text-purple-400">
                {selectedRows.size} selected
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="bg-slate-700 border-slate-600 w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {tables.map(table => (
                  <SelectItem key={table.id} value={table.id}>
                    {table.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search table..."
              className="pl-10 bg-slate-700 border-slate-600"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => exportData('csv')}
              variant="outline"
              size="sm"
              className="border-slate-600"
              disabled={sortedData.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              onClick={() => exportData('json')}
              variant="outline"
              size="sm"
              className="border-slate-600"
              disabled={sortedData.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              JSON
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.size === sortedData.length && sortedData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {currentTable.columns.map((column) => (
                  <TableHead
                    key={column}
                    className="text-slate-300 cursor-pointer hover:text-white"
                    onClick={() => handleSort(column.toLowerCase())}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column}</span>
                      {sortColumn === column.toLowerCase() && (
                        sortDirection === 'asc' ? 
                        <ChevronUp className="h-3 w-3" /> : 
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="text-slate-300 w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row, index) => (
                <TableRow key={index} className="border-slate-700 hover:bg-slate-700/20">
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(String(index))}
                      onCheckedChange={() => handleRowSelect(String(index))}
                    />
                  </TableCell>
                  {currentTable.columns.map((column) => {
                    const cellKey = column.toLowerCase().replace(' ', '');
                    const cellValue = row[cellKey];
                    const isEditing = editingCell?.row === index && editingCell?.col === cellKey;

                    return (
                      <TableCell key={column} className="text-slate-300">
                        {isEditing ? (
                          <div className="flex items-center space-x-1">
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="h-8 bg-slate-600 border-slate-500"
                              onKeyPress={(e) => e.key === 'Enter' && handleCellSave()}
                              autoFocus
                            />
                            <Button onClick={handleCellSave} size="sm" variant="ghost">
                              ✓
                            </Button>
                            <Button onClick={() => setEditingCell(null)} size="sm" variant="ghost">
                              ✕
                            </Button>
                          </div>
                        ) : (
                          <div
                            onClick={() => ['url', 'title', 'name'].includes(cellKey) && handleCellEdit(index, cellKey, cellValue)}
                            className={`${['url', 'title', 'name'].includes(cellKey) ? 'cursor-pointer hover:bg-slate-600/30 p-1 rounded' : ''}`}
                          >
                            {cellKey === 'status' ? (
                              <Badge className={getStatusBadge(cellValue)}>
                                {cellValue}
                              </Badge>
                            ) : cellKey === 'url' ? (
                              <a 
                                href={cellValue} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-cyan-400 hover:text-cyan-300 truncate block max-w-xs"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {cellValue}
                              </a>
                            ) : (
                              <span className="truncate block max-w-xs">
                                {typeof cellValue === 'string' && cellValue.includes('T') ? 
                                  new Date(cellValue).toLocaleString() : 
                                  String(cellValue || '')}
                              </span>
                            )}
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" title="Edit">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" title="View/Export">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Delete">
                        <Trash2 className="h-3 w-3 text-red-400" />
                      </Button>
                      {currentTable.id === 'url-scrap' && (
                        <Button variant="ghost" size="sm" title="Toggle Status">
                          <Power className="h-3 w-3 text-green-400" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {sortedData.length === 0 && (
            <div className="text-center text-slate-400 py-12">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No data found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedURLTable;
