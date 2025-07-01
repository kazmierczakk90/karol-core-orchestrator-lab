
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, Search, Activity, Network, 
  BarChart3, Settings, Database 
} from 'lucide-react';
import { useFunctionCatalog } from '@/hooks/useFunctionCatalog';
import FunctionCatalogDashboard from './FunctionCatalogDashboard';
import FunctionSearch from './FunctionSearch';
import FunctionCard from './FunctionCard';
import SystemOrchestrator from './SystemOrchestrator';

const ComprehensiveFunctionCatalog = () => {
  const {
    functions,
    searchTerm,
    setSearchTerm,
    selectedLevel,
    setSelectedLevel,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    metrics
  } = useFunctionCatalog();

  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);

  const handleFunctionToggle = (functionId: string) => {
    console.log(`Toggle function: ${functionId}`);
    // In real implementation, this would toggle the function status
  };

  const handleFunctionDetails = (functionId: string) => {
    setSelectedFunction(functionId);
    console.log(`Show details for function: ${functionId}`);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-cyan-800/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span>Comprehensive Function Catalog</span>
            <span className="text-sm text-slate-400">({functions.length} functions)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FunctionCatalogDashboard />
        </CardContent>
      </Card>

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="catalog" className="text-white data-[state=active]:bg-cyan-600">
            <Search className="h-4 w-4 mr-2" />
            Catalog
          </TabsTrigger>
          <TabsTrigger value="orchestrator" className="text-white data-[state=active]:bg-purple-600">
            <Network className="h-4 w-4 mr-2" />
            Orchestrator
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-green-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="config" className="text-white data-[state=active]:bg-orange-600">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-6">
          <FunctionSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          
          <ScrollArea className="h-96">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {functions.map(func => (
                <FunctionCard
                  key={func.id}
                  func={func}
                  onToggle={handleFunctionToggle}
                  onDetails={handleFunctionDetails}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="orchestrator" className="space-y-6">
          <SystemOrchestrator />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-slate-800/50 border-green-800/30">
            <CardHeader>
              <CardTitle className="text-green-400">Function Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-white font-medium">Usage Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Most Used:</span>
                      <span className="text-green-400">Real-Time Monitor</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Least Used:</span>
                      <span className="text-yellow-400">Meta-Evolution Engine</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Average Performance:</span>
                      <span className="text-cyan-400">{Math.round(metrics.averagePerformance)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-white font-medium">System Health</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Critical Functions:</span>
                      <span className="text-red-400">{metrics.criticalFunctions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Error Rate:</span>
                      <span className="text-orange-400">{metrics.errorRate.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Recent Usage:</span>
                      <span className="text-blue-400">{metrics.recentUsage}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card className="bg-slate-800/50 border-orange-800/30">
            <CardHeader>
              <CardTitle className="text-orange-400">System Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <div className="text-slate-300">Configuration panel coming soon...</div>
                <div className="text-sm text-slate-500 mt-2">
                  This will allow real-time configuration of system functions
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveFunctionCatalog;
