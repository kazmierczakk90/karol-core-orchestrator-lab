
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Zap, Shield, Brain, Eye, 
  TrendingUp, Settings, AlertTriangle 
} from 'lucide-react';

// Import the new modules
import EndlessLoopPrevention from './EndlessLoopPrevention';
import CognitiveBehavioralPredictor from './CognitiveBehavioralPredictor';
import IntrospectionMirror from './IntrospectionMirror';

interface ModuleStatus {
  id: string;
  name: string;
  status: 'active' | 'beta' | 'experimental' | 'disabled';
  priority: 'pilne' | 'przydatne';
  risk: 'niskie' | 'średnie' | 'wysokie';
  uptime: number;
}

const AdvancedModulesManager = () => {
  const [activeTab, setActiveTab] = useState('pilne');
  const [moduleStatuses, setModuleStatuses] = useState<ModuleStatus[]>([
    {
      id: 'endless-loop-prevention',
      name: 'Endless Loop Prevention',
      status: 'active',
      priority: 'pilne',
      risk: 'niskie',
      uptime: 99.7
    },
    {
      id: 'cognitive-behavioral-predictor',
      name: 'Cognitive Behavioral Predictor',
      status: 'beta',
      priority: 'pilne',
      risk: 'średnie',
      uptime: 87.3
    },
    {
      id: 'introspection-mirror',
      name: 'Introspection Mirror',
      status: 'active',
      priority: 'pilne',
      risk: 'niskie',
      uptime: 94.1
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'beta': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'experimental': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'disabled': return 'bg-red-500/20 text-red-400 border-red-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'niskie': return 'text-green-400';
      case 'średnie': return 'text-yellow-400';
      case 'wysokie': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const pilneModules = moduleStatuses.filter(m => m.priority === 'pilne');
  const przydatneModules = moduleStatuses.filter(m => m.priority === 'przydatne');

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-cyan-800/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <Zap className="h-6 w-6" />
            <span>Advanced Modules Manager</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500">
              {moduleStatuses.filter(m => m.status === 'active').length} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 p-3 rounded-lg text-center">
              <div className="text-cyan-400 text-xl font-bold">{moduleStatuses.length}</div>
              <div className="text-slate-400 text-sm">Total Modules</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg text-center">
              <div className="text-green-400 text-xl font-bold">
                {moduleStatuses.filter(m => m.status === 'active').length}
              </div>
              <div className="text-slate-400 text-sm">Active</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg text-center">
              <div className="text-yellow-400 text-xl font-bold">
                {moduleStatuses.filter(m => m.status === 'beta').length}
              </div>
              <div className="text-slate-400 text-sm">Beta</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg text-center">
              <div className="text-purple-400 text-xl font-bold">
                {Math.round(moduleStatuses.reduce((sum, m) => sum + m.uptime, 0) / moduleStatuses.length)}%
              </div>
              <div className="text-slate-400 text-sm">Avg Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="pilne" className="text-white data-[state=active]:bg-red-600">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Pilne ({pilneModules.length})
          </TabsTrigger>
          <TabsTrigger value="przydatne" className="text-white data-[state=active]:bg-blue-600">
            <TrendingUp className="h-4 w-4 mr-2" />
            Przydatne ({przydatneModules.length})
          </TabsTrigger>
          <TabsTrigger value="overview" className="text-white data-[state=active]:bg-green-600">
            <Settings className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pilne" className="space-y-6">
          <ScrollArea className="h-96">
            <div className="space-y-6">
              <EndlessLoopPrevention />
              <CognitiveBehavioralPredictor />
              <IntrospectionMirror />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="przydatne" className="space-y-6">
          <Card className="bg-slate-800/50 border-blue-800/30">
            <CardHeader>
              <CardTitle className="text-blue-400">Przydatne Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <div className="text-slate-300 mb-2">Przydatne modules coming soon...</div>
                <div className="text-sm text-slate-500">
                  These modules will be implemented in the next phase
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-slate-800/50 border-green-800/30">
            <CardHeader>
              <CardTitle className="text-green-400">System Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-white font-medium">Module Status Overview</h3>
                <div className="space-y-3">
                  {moduleStatuses.map(module => (
                    <div key={module.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {module.id === 'endless-loop-prevention' && <Shield className="h-4 w-4 text-red-400" />}
                          {module.id === 'cognitive-behavioral-predictor' && <Brain className="h-4 w-4 text-purple-400" />}
                          {module.id === 'introspection-mirror' && <Eye className="h-4 w-4 text-cyan-400" />}
                          <span className="text-white font-medium">{module.name}</span>
                        </div>
                        <Badge className={getStatusColor(module.status)} variant="outline">
                          {module.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          <span className="text-slate-400">Uptime: </span>
                          <span className="text-green-400">{module.uptime}%</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-slate-400">Risk: </span>
                          <span className={getRiskColor(module.risk)}>{module.risk}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedModulesManager;
