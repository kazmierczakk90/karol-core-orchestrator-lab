
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tree, Map, Tag, Plus, Play, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScenarioNode {
  id: string;
  name: string;
  type: 'decision' | 'action' | 'outcome';
  status: 'active' | 'pending' | 'completed';
  agent: string;
  children?: ScenarioNode[];
}

const ScenarioMapModule = () => {
  const { toast } = useToast();
  const [scenarios, setScenarios] = useState<ScenarioNode[]>([
    {
      id: '1',
      name: 'Cognitive Analysis',
      type: 'decision',
      status: 'active',
      agent: '@evolution-tracker',
      children: [
        { id: '1.1', name: 'Memory Scan', type: 'action', status: 'completed', agent: '@memory-core' },
        { id: '1.2', name: 'Pattern Recognition', type: 'action', status: 'active', agent: '@adaptive-core' }
      ]
    }
  ]);

  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const handleExecuteScenario = (scenarioId: string) => {
    toast({
      title: "Scenario Executed",
      description: `@evolution-tracker processing scenario ${scenarioId}`,
    });
  };

  const renderScenarioTree = (nodes: ScenarioNode[], level = 0) => {
    return nodes.map(node => (
      <div key={node.id} className={`ml-${level * 4} mb-2`}>
        <div 
          className={`p-3 rounded-lg border cursor-pointer transition-all ${
            selectedScenario === node.id 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-slate-600 hover:border-slate-500'
          }`}
          onClick={() => setSelectedScenario(node.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Tree className="h-4 w-4 text-cyan-400" />
              <span className="text-white font-medium">{node.name}</span>
              <Badge variant={node.status === 'active' ? 'default' : 'secondary'}>
                {node.status}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {node.agent}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleExecuteScenario(node.id);
                }}
              >
                <Play className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        {node.children && renderScenarioTree(node.children, level + 1)}
      </div>
    ));
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <Map className="h-5 w-5" />
          <span>Scenario Map</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tree" className="space-y-4">
          <TabsList className="bg-slate-700/50">
            <TabsTrigger value="tree">Tree View</TabsTrigger>
            <TabsTrigger value="map">Visual Map</TabsTrigger>
            <TabsTrigger value="tags">Tag Explorer</TabsTrigger>
          </TabsList>

          <TabsContent value="tree" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Decision Tree</h3>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Scenario
              </Button>
            </div>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {renderScenarioTree(scenarios)}
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-4">
            <div className="bg-slate-900/50 rounded-lg p-6 min-h-64 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <Map className="h-12 w-12 mx-auto mb-4" />
                <p>Visual Scenario Map</p>
                <p className="text-sm mt-1">Interactive decision flow visualization</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tags" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {['cognitive', 'memory', 'decision', 'evolution', 'adaptive'].map(tag => (
                <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-slate-600">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ScenarioMapModule;
