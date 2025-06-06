
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Play, 
  Pause, 
  RefreshCw,
  Plus,
  Filter,
  Search,
  Download
} from 'lucide-react';

interface TableRow {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'pending' | 'error';
  lastModified: Date;
  agent?: string;
  description?: string;
  metadata?: any;
}

interface SmartTableProps {
  className?: string;
  onRowAction?: (action: string, row: TableRow) => void;
}

const SmartTable = ({ className, onRowAction }: SmartTableProps) => {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [filteredData, setFilteredData] = useState<TableRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadTableData();
  }, []);

  useEffect(() => {
    filterData();
  }, [tableData, searchTerm, statusFilter, typeFilter]);

  const loadTableData = () => {
    // Mock data representing various system entities
    const mockData: TableRow[] = [
      {
        id: '1',
        name: '@ceo',
        type: 'Agent',
        status: 'active',
        lastModified: new Date(Date.now() - 2 * 60 * 1000),
        agent: '@ceo',
        description: 'Strategic decision maker and approval authority'
      },
      {
        id: '2',
        name: 'OpenAI Chat',
        type: 'Function',
        status: 'active',
        lastModified: new Date(Date.now() - 5 * 60 * 1000),
        description: 'Main chat interface for user interactions'
      },
      {
        id: '3',
        name: 'Auto-Improvement Service',
        type: 'Service',
        status: 'active',
        lastModified: new Date(Date.now() - 10 * 60 * 1000),
        description: 'System self-improvement and optimization'
      },
      {
        id: '4',
        name: '@optymalizator',
        type: 'Agent',
        status: 'active',
        lastModified: new Date(Date.now() - 15 * 60 * 1000),
        agent: '@optymalizator',
        description: 'Performance analysis and improvement suggestions'
      },
      {
        id: '5',
        name: 'Mini AI Dashboard',
        type: 'Function',
        status: 'active',
        lastModified: new Date(Date.now() - 20 * 60 * 1000),
        description: 'Mini AI instances management and execution'
      },
      {
        id: '6',
        name: '@memory-core',
        type: 'Agent',
        status: 'pending',
        lastModified: new Date(Date.now() - 30 * 60 * 1000),
        agent: '@memory-core',
        description: 'Knowledge management and memory consolidation'
      },
      {
        id: '7',
        name: 'Browser Core',
        type: 'Function',
        status: 'active',
        lastModified: new Date(Date.now() - 45 * 60 * 1000),
        description: 'Web browsing and link extraction functionality'
      },
      {
        id: '8',
        name: '@guardian-core',
        type: 'Agent',
        status: 'active',
        lastModified: new Date(Date.now() - 60 * 60 * 1000),
        agent: '@guardian-core',
        description: 'Security monitoring and protection systems'
      },
      {
        id: '9',
        name: 'Workflow Builder',
        type: 'Function',
        status: 'inactive',
        lastModified: new Date(Date.now() - 90 * 60 * 1000),
        description: 'Process automation and workflow management'
      },
      {
        id: '10',
        name: '@logger',
        type: 'Agent',
        status: 'active',
        lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000),
        agent: '@logger',
        description: 'Event tracking and system logging'
      }
    ];

    setTableData(mockData);
  };

  const filterData = () => {
    let filtered = tableData;

    if (searchTerm) {
      filtered = filtered.filter(row => 
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(row => row.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(row => row.type === typeFilter);
    }

    setFilteredData(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'inactive': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Agent': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
      case 'Function': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'Service': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const handleRowAction = (action: string, row: TableRow) => {
    console.log(`Action: ${action} on row:`, row);
    onRowAction?.(action, row);

    // Handle common actions
    switch (action) {
      case 'activate':
        setTableData(prev => prev.map(item => 
          item.id === row.id ? { ...item, status: 'active' as const } : item
        ));
        break;
      case 'deactivate':
        setTableData(prev => prev.map(item => 
          item.id === row.id ? { ...item, status: 'inactive' as const } : item
        ));
        break;
      case 'refresh':
        setTableData(prev => prev.map(item => 
          item.id === row.id ? { ...item, lastModified: new Date() } : item
        ));
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${row.name}?`)) {
          setTableData(prev => prev.filter(item => item.id !== row.id));
        }
        break;
    }
  };

  return (
    <div id="smart-table-anchor" className={className}>
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">System Components</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex items-center space-x-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white text-sm"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Status: {statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                  Active Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
                  Inactive Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                  Pending Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Type: {typeFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                <DropdownMenuItem onClick={() => setTypeFilter('all')}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('Agent')}>
                  Agents Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('Function')}>
                  Functions Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('Service')}>
                  Services Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Name</TableHead>
                <TableHead className="text-slate-300">Type</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Last Modified</TableHead>
                <TableHead className="text-slate-300">Description</TableHead>
                <TableHead className="text-slate-300 w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.id} className="border-slate-700 hover:bg-slate-700/30">
                  <TableCell className="text-white font-medium">{row.name}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(row.type)}>
                      {row.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(row.status)}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm">
                    {row.lastModified.toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm max-w-[200px] truncate">
                    {row.description}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                        <DropdownMenuLabel className="text-slate-300">Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem 
                          onClick={() => handleRowAction('view', row)}
                          className="text-slate-300 hover:bg-slate-700"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleRowAction('edit', row)}
                          className="text-slate-300 hover:bg-slate-700"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        {row.status === 'active' ? (
                          <DropdownMenuItem 
                            onClick={() => handleRowAction('deactivate', row)}
                            className="text-slate-300 hover:bg-slate-700"
                          >
                            <Pause className="mr-2 h-4 w-4" />
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => handleRowAction('activate', row)}
                            className="text-slate-300 hover:bg-slate-700"
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleRowAction('refresh', row)}
                          className="text-slate-300 hover:bg-slate-700"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Refresh
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem 
                          onClick={() => handleRowAction('delete', row)}
                          className="text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredData.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-400">No components found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartTable;
