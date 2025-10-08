import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouting } from '@/hooks/useRouting';
import { Loader2, Network, Search, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface RoutingCondition {
  id: string;
  category: string;
  segment: string;
  agents: string[];
  reasoning: string;
  is_active: boolean;
  priority: number;
  created_at: string;
}

const RoutingManager = () => {
  const [conditions, setConditions] = useState<RoutingCondition[]>([]);
  const [searchCategory, setSearchCategory] = useState('');
  const [searchSegment, setSearchSegment] = useState('');
  const { findAgents, generateCombinations, getConditions, isLoading } = useRouting();

  useEffect(() => {
    loadConditions();
  }, []);

  const loadConditions = async () => {
    try {
      const result = await getConditions();
      if (result?.data) {
        setConditions(result.data);
      }
    } catch (error) {
      console.error('Error loading conditions:', error);
    }
  };

  const handleGenerateCombinations = async () => {
    try {
      await generateCombinations();
      await loadConditions();
    } catch (error) {
      console.error('Error generating combinations:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchCategory || !searchSegment) {
      toast.error('Podaj kategorię i segment');
      return;
    }

    const result = await findAgents(searchCategory, searchSegment);
    
    if (result.success) {
      toast.success('Znaleziono agentów', {
        description: `${result.agents?.length || 0} agentów: ${result.agents?.map(a => a.name).join(', ')}`
      });
    } else {
      toast.error('Nie znaleziono routingu dla tej kombinacji');
    }
  };

  const filteredConditions = conditions.filter(c => 
    (!searchCategory || c.category.toLowerCase().includes(searchCategory.toLowerCase())) &&
    (!searchSegment || c.segment.toLowerCase().includes(searchSegment.toLowerCase()))
  );

  const stats = {
    total: conditions.length,
    active: conditions.filter(c => c.is_active).length,
    categories: new Set(conditions.map(c => c.category)).size,
    segments: new Set(conditions.map(c => c.segment)).size
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-cyan-400" />
                Inteligentny Routing System
              </CardTitle>
              <CardDescription>
                Zarządzanie regułami routingu i przypisywaniem agentów na podstawie kontekstu
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleGenerateCombinations}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Generuj kombinacje
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800/50 border-slate-700/30">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-slate-400">Reguły routingu</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700/30">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-400">{stats.active}</div>
                <div className="text-sm text-slate-400">Aktywne</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700/30">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-cyan-400">{stats.categories}</div>
                <div className="text-sm text-slate-400">Kategorie</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700/30">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-purple-400">{stats.segments}</div>
                <div className="text-sm text-slate-400">Segmenty</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
              <TabsTrigger value="search">Wyszukaj Agentów</TabsTrigger>
              <TabsTrigger value="rules">Reguły Routingu</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Kategoria (np. A_prowadzenie_klubu_DJ)"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="bg-slate-800/50 border-slate-700/50 text-white"
                />
                <Input
                  placeholder="Segment (np. VIP_90+_high_activity)"
                  value={searchSegment}
                  onChange={(e) => setSearchSegment(e.target.value)}
                  className="bg-slate-800/50 border-slate-700/50 text-white"
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading} className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Znajdź najlepszych agentów
              </Button>
            </TabsContent>

            <TabsContent value="rules" className="space-y-4">
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredConditions.map((condition) => (
                  <Card key={condition.id} className="bg-slate-800/50 border-slate-700/30">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-cyan-400 border-cyan-400/50">
                              {condition.category}
                            </Badge>
                            <Badge variant="outline" className="text-purple-400 border-purple-400/50">
                              {condition.segment}
                            </Badge>
                            <Badge className={condition.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                              {condition.is_active ? 'Aktywna' : 'Nieaktywna'}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-300">
                            <span className="font-semibold">Agenci:</span> {condition.agents.join(', ')}
                          </div>
                          <div className="text-xs text-slate-400 italic">
                            {condition.reasoning}
                          </div>
                        </div>
                        <div className="text-sm text-slate-500">
                          Priority: {condition.priority}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoutingManager;
