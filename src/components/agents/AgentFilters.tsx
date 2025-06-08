
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface AgentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const AgentFilters = ({ 
  searchQuery, 
  onSearchChange, 
  selectedType, 
  onTypeChange 
}: AgentFiltersProps) => {
  return (
    <div className="flex space-x-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search agents..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-slate-900/50 border-slate-700/50 text-white pl-10"
        />
      </div>
      
      <div className="flex space-x-2">
        {['all', 'core', 'karol', 'integration', 'utility'].map((type) => (
          <Button
            key={type}
            size="sm"
            variant={selectedType === type ? "default" : "outline"}
            className={selectedType === type ? "bg-gradient-primary" : "border-slate-600"}
            onClick={() => onTypeChange(type)}
          >
            {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AgentFilters;
