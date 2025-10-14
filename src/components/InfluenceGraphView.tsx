import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface InfluenceNode {
  id: string;
  type: 'agent' | 'decision' | 'prompt' | 'action';
  label: string;
  weight: number;
}

interface InfluenceEdge {
  source: string;
  target: string;
  strength: number;
  type: 'triggers' | 'influences' | 'depends_on' | 'produces';
}

export default function InfluenceGraphView() {
  const [nodes, setNodes] = useState<InfluenceNode[]>([]);
  const [edges, setEdges] = useState<InfluenceEdge[]>([]);
  const [loading, setLoading] = useState(false);

  const loadGraph = async () => {
    setLoading(true);
    // Simulated data - replace with actual service call
    setTimeout(() => {
      setNodes([
        { id: '@router', type: 'agent', label: 'Router Agent', weight: 1.0 },
        { id: '@guardian-core', type: 'agent', label: 'Guardian Core', weight: 0.95 },
        { id: '@voice-core', type: 'agent', label: 'Voice Core', weight: 0.85 },
        { id: 'decision-1', type: 'decision', label: 'Route Selection', weight: 0.7 }
      ]);
      
      setEdges([
        { source: '@router', target: 'decision-1', strength: 0.9, type: 'triggers' },
        { source: '@guardian-core', target: '@router', strength: 0.8, type: 'influences' },
        { source: 'decision-1', target: '@voice-core', strength: 0.75, type: 'produces' }
      ]);
      
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadGraph();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'agent': return 'bg-primary/10 text-primary border-primary';
      case 'decision': return 'bg-blue-500/10 text-blue-600 border-blue-500';
      case 'prompt': return 'bg-green-500/10 text-green-600 border-green-500';
      case 'action': return 'bg-orange-500/10 text-orange-600 border-orange-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getEdgeTypeLabel = (type: string) => {
    return type.replace('_', ' ');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Influence Graph</CardTitle>
            <CardDescription>
              Agent interaction network and decision flow
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadGraph}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nodes Section */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Active Nodes ({nodes.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nodes.map(node => (
              <div
                key={node.id}
                className="p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className={getTypeColor(node.type)}>
                    {node.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Weight: {node.weight.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm font-medium">{node.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{node.id}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Edges Section */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Connections ({edges.length})</h4>
          <div className="space-y-2">
            {edges.map((edge, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm"
              >
                <span className="font-mono text-xs">{edge.source}</span>
                <span className="text-muted-foreground">→</span>
                <Badge variant="secondary" className="text-xs">
                  {getEdgeTypeLabel(edge.type)}
                </Badge>
                <span className="text-muted-foreground">→</span>
                <span className="font-mono text-xs">{edge.target}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {(edge.strength * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
