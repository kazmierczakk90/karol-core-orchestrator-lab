
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, SortAsc } from 'lucide-react';

interface FunctionSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: 'name' | 'usage' | 'performance' | 'lastUsed') => void;
}

const FunctionSearch = ({
  searchTerm,
  setSearchTerm,
  selectedLevel,
  setSelectedLevel,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy
}: FunctionSearchProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search functions, descriptions, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700/50 border-slate-600"
          />
        </div>
        <Button variant="outline" size="sm" className="bg-slate-700/50">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="bg-slate-700/50">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="decyzyjny">Decyzyjny</SelectItem>
            <SelectItem value="pamięć">Pamięć</SelectItem>
            <SelectItem value="agenci">Agenci</SelectItem>
            <SelectItem value="meta">Meta</SelectItem>
            <SelectItem value="monitoring">Monitoring</SelectItem>
            <SelectItem value="bezpieczeństwo">Bezpieczeństwo</SelectItem>
            <SelectItem value="ui">UI</SelectItem>
            <SelectItem value="integracje">Integracje</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="bg-slate-700/50">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="aktywna">Aktywna</SelectItem>
            <SelectItem value="częściowa">Częściowa</SelectItem>
            <SelectItem value="wyłączona">Wyłączona</SelectItem>
            <SelectItem value="testowa">Testowa</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
          <SelectTrigger className="bg-slate-700/50">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="usage">Usage Count</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
            <SelectItem value="lastUsed">Last Used</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FunctionSearch;
