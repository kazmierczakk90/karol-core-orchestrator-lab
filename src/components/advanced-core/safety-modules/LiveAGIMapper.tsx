
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Map, RefreshCw, Download, Maximize } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LiveAGIMapper = () => {
  const { toast } = useToast();
  const [isMapping, setIsMapping] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());

  const agentNodes = [
    { id: '@meta-orchestrator', type: 'core', connections: 5, status: 'active' },
    { id: '@decision-router', type: 'logic', connections: 3, status: 'active' },
    { id: '@state-keeper', type: 'memory', connections: 7, status: 'active' },
    { id: '@ceo-core', type: 'decision', connections: 4, status: 'active' },
    { id: '@voice-core', type: 'interface', connections: 2, status: 'idle' }
  ];

  const syncMap = async () => {
    setIsMapping(true);
    toast({
      title: "Mapping System",
      description: "@map-core is analyzing agent dependencies...",
    });

    setTimeout(() => {
      setLastSync(new Date());
      setIsMapping(false);
      toast({
        title: "Map Updated",
        description: "Live AGI system map has been refreshed",
      });
    }, 2000);
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'core': return 'bg-purple-500/20 text-purple-400';
      case 'logic': return 'bg-blue-500/20 text-blue-400';
      case 'memory': return 'bg-green-500/20 text-green-400';
      case 'decision': return 'bg-yellow-500/20 text-yellow-400';
      case 'interface': return 'bg-pink-500/20 text-pink-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-500/20 text-green-400'
      : 'bg-yellow-500/20 text-yellow-400';
  };

  return (
    <Card className="bg-slate-800/50 border-emerald-800/30">
      <CardHeader>
        <CardTitle className="text-emerald-400 flex items-center space-x-2">
          <Map className="h-5 w-5" />
          <span>Live AGI Mapper</span>
          <Badge variant="outline" className="text-emerald-400">@map-core</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">System Map</div>
              <div className="text-slate-400 text-sm">
                Last sync: {lastSync.toLocaleTimeString()}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={syncMap}
                disabled={isMapping}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isMapping ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Simplified visual representation */}
          <div className="bg-slate-700/50 p-6 rounded-lg min-h-[300px] relative">
            <div className="text-center text-slate-400 mb-4">
              <Map className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">Interactive AGI System Map</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {agentNodes.map((node, index) => (
                <div 
                  key={node.id}
                  className="bg-slate-800/50 p-3 rounded-lg border border-slate-600/50 hover:border-emerald-500/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getNodeColor(node.type)}>
                      {node.type}
                    </Badge>
                    <Badge className={getStatusColor(node.status)}>
                      {node.status}
                    </Badge>
                  </div>
                  <div className="text-white text-sm font-mono">{node.id}</div>
                  <div className="text-slate-400 text-xs">
                    {node.connections} connections
                  </div>
                </div>
              ))}
            </div>

            {/* Connection lines visualization placeholder */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full opacity-30">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                  </marker>
                </defs>
                <line x1="25%" y1="40%" x2="75%" y2="40%" 
                  stroke="#10b981" strokeWidth="1" markerEnd="url(#arrowhead)" />
                <line x1="25%" y1="60%" x2="75%" y2="60%" 
                  stroke="#10b981" strokeWidth="1" markerEnd="url(#arrowhead)" />
              </svg>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveAGIMapper;
