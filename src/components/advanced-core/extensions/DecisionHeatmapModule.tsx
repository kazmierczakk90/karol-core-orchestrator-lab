
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, RefreshCw, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DecisionHeatmapModule = () => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const heatmapData = [
    { area: 'Memory Management', intensity: 85, decisions: 32 },
    { area: 'Agent Routing', intensity: 92, decisions: 45 },
    { area: 'Style Processing', intensity: 67, decisions: 21 },
    { area: 'Cognitive Analysis', intensity: 78, decisions: 28 },
    { area: 'System Evolution', intensity: 54, decisions: 15 }
  ];

  const updateHeatmap = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: "Heatmapa zaktualizowana",
        description: "@insight-core przetworzył najnowsze snapshoty",
      });
    }, 1500);
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 80) return 'bg-red-500';
    if (intensity >= 60) return 'bg-orange-500';
    if (intensity >= 40) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const HeatmapVisualization = () => (
    <div className="grid grid-cols-4 gap-1 h-32">
      {Array.from({ length: 64 }, (_, i) => {
        const intensity = Math.random();
        return (
          <div
            key={i}
            className={`rounded-sm ${
              intensity > 0.7 ? 'bg-red-500/80' :
              intensity > 0.5 ? 'bg-orange-500/60' :
              intensity > 0.3 ? 'bg-yellow-500/40' :
              'bg-blue-500/20'
            }`}
          />
        );
      })}
    </div>
  );

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-orange-400 flex items-center space-x-2">
          <Map className="h-5 w-5" />
          <span>Decision Heatmap</span>
        </CardTitle>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-orange-400">@insight-core</Badge>
            <Badge variant="secondary" className="text-xs">
              Live Updates
            </Badge>
          </div>
          <Button 
            onClick={updateHeatmap} 
            disabled={isUpdating}
            size="sm" 
            variant="outline"
          >
            {isUpdating ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Update
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visual" className="space-y-4">
          <TabsList className="bg-slate-700/50">
            <TabsTrigger value="visual">Visual Map</TabsTrigger>
            <TabsTrigger value="data">Data View</TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="space-y-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <HeatmapVisualization />
              <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                <span>Low Activity</span>
                <span>High Activity</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-3">
            {heatmapData.map((item, index) => (
              <div key={index} className="bg-slate-900/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{item.area}</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getIntensityColor(item.intensity)}`} />
                    <span className="text-sm text-slate-300">{item.intensity}%</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  {item.decisions} decisions processed
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <div className="border-t border-slate-700 pt-4 mt-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-xs text-slate-400">
              <div>Trigger: snapshot update</div>
              <div>Visualization: SVG heatmap</div>
              <div>Colors: decision intensity</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DecisionHeatmapModule;
