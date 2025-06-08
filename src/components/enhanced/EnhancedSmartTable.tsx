
import React, { memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { TableLoadingSkeleton } from '@/components/ui/loading-skeleton';
import { MobileMenu } from '@/components/ui/mobile-menu';
import { usePagination } from '@/hooks/usePagination';
import { useTableSearch } from '@/hooks/useTableSearch';
import { useIsMobile } from '@/hooks/use-mobile';
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
  Download,
  Menu
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

interface EnhancedSmartTableProps {
  className?: string;
  onRowAction?: (action: string, row: TableRow) => void;
  isLoading?: boolean;
  itemsPerPage?: number;
}

const EnhancedSmartTable = memo(({ 
  className, 
  onRowAction, 
  isLoading = false,
  itemsPerPage = 10 
}: EnhancedSmartTableProps) => {
  const isMobile = useIsMobile();

  // Mock data
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
    // ... more mock data
  ];

  const { searchTerm, setSearchTerm, filteredData } = useTableSearch({
    data: mockData,
    searchFields: ['name', 'description', 'type', 'status']
  });

  const {
    currentPage,
    totalPages,
    currentData,
    goToPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
    startIndex,
    endIndex
  } = usePagination({
    data: filteredData,
    itemsPerPage
  });

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'inactive': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  }, []);

  const getTypeColor = useCallback((type: string) => {
    switch (type) {
      case 'Agent': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
      case 'Function': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'Service': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  }, []);

  const handleRowAction = useCallback((action: string, row: TableRow) => {
    console.log(`Action: ${action} on row:`, row);
    onRowAction?.(action, row);
  }, [onRowAction]);

  const MobileTableCard = memo(({ row }: { row: TableRow }) => (
    <Card className="bg-slate-800/50 border-slate-700 mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-medium">{row.name}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
              <DropdownMenuItem onClick={() => handleRowAction('view', row)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRowAction('edit', row)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Badge className={getTypeColor(row.type)}>{row.type}</Badge>
            <Badge className={getStatusColor(row.status)}>{row.status}</Badge>
          </div>
          
          <p className="text-slate-400 text-sm">{row.description}</p>
          <p className="text-slate-500 text-xs">
            Modified: {row.lastModified.toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
    </Card>
  ));

  if (isLoading) {
    return (
      <div className={className}>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Loading Components...</CardTitle>
          </CardHeader>
          <CardContent>
            <TableLoadingSkeleton rows={itemsPerPage} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">System Components</CardTitle>
            <div className="flex items-center space-x-2">
              {isMobile ? (
                <MobileMenu>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Filter className="h-4 w-4 mr-2" />
                      Advanced Filter
                    </Button>
                  </div>
                </MobileMenu>
              ) : (
                <>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white"
            />
          </div>
        </CardHeader>

        <CardContent>
          {isMobile ? (
            // Mobile Cards View
            <div className="space-y-3">
              {currentData.map((row) => (
                <MobileTableCard key={row.id} row={row} />
              ))}
            </div>
          ) : (
            // Desktop Table View
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
                {currentData.map((row) => (
                  <TableRow key={row.id} className="border-slate-700 hover:bg-slate-700/30">
                    <TableCell className="text-white font-medium">{row.name}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(row.type)}>{row.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(row.status)}>{row.status}</Badge>
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Results Info and Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <div className="text-sm text-slate-400">
              Showing {startIndex}-{endIndex} of {filteredData.length} results
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              showFirstLast={!isMobile}
              maxVisiblePages={isMobile ? 3 : 5}
            />
          </div>

          {currentData.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-400">No components found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

EnhancedSmartTable.displayName = 'EnhancedSmartTable';

export default EnhancedSmartTable;
