
import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, Plus, Download, Save, Trash2, Move, Link2 } from 'lucide-react';

interface Node {
  id: string;
  x: number;
  y: number;
  title: string;
  content: string;
  color: string;
  connections: string[];
}

interface Connection {
  from: string;
  to: string;
  id: string;
}

const MindMapsCreator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: 'central',
      x: 400,
      y: 300,
      title: 'PROJEKT',
      content: 'Centralny węzeł systemu',
      color: '#22d3ee',
      connections: []
    }
  ]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [isCreatingConnection, setIsCreatingConnection] = useState(false);
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [showAddNode, setShowAddNode] = useState(false);

  const colors = ['#22d3ee', '#a855f7', '#22c55e', '#f59e0b', '#ef4444', '#6366f1'];

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    connections.forEach(conn => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      
      if (fromNode && toNode) {
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      ctx.fillStyle = node.color;
      ctx.strokeStyle = selectedNode === node.id ? '#ffffff' : node.color;
      ctx.lineWidth = selectedNode === node.id ? 3 : 1;
      
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, 30, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Node text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.title, node.x, node.y + 4);
    });
  }, [nodes, connections, selectedNode]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on a node
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= 30;
    });

    if (clickedNode) {
      if (isCreatingConnection && selectedNode && selectedNode !== clickedNode.id) {
        // Create connection
        const newConnection: Connection = {
          id: `${selectedNode}-${clickedNode.id}`,
          from: selectedNode,
          to: clickedNode.id
        };
        setConnections(prev => [...prev, newConnection]);
        setIsCreatingConnection(false);
      }
      setSelectedNode(clickedNode.id);
    } else {
      setSelectedNode(null);
      setIsCreatingConnection(false);
    }
  };

  const addNode = () => {
    if (!newNodeTitle.trim()) return;

    const newNode: Node = {
      id: `node-${Date.now()}`,
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      title: newNodeTitle,
      content: `Węzeł: ${newNodeTitle}`,
      color: colors[Math.floor(Math.random() * colors.length)],
      connections: []
    };

    setNodes(prev => [...prev, newNode]);
    setNewNodeTitle('');
    setShowAddNode(false);
  };

  const deleteNode = () => {
    if (!selectedNode) return;
    
    setNodes(prev => prev.filter(n => n.id !== selectedNode));
    setConnections(prev => prev.filter(c => c.from !== selectedNode && c.to !== selectedNode));
    setSelectedNode(null);
  };

  const exportMindMap = () => {
    const data = {
      nodes,
      connections,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindmap.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full space-y-6">
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Brain className="h-6 w-6" />
              <span>Mind Maps Creator</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                {nodes.length} węzłów
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                {connections.length} połączeń
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Canvas Area */}
        <div className="lg:col-span-3">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onClick={handleCanvasClick}
                className="w-full h-full bg-slate-900 rounded border border-slate-600 cursor-pointer"
              />
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <div className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Narzędzia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => setShowAddNode(true)}
                className="w-full bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Dodaj węzeł
              </Button>

              <Button
                onClick={() => setIsCreatingConnection(!isCreatingConnection)}
                variant={isCreatingConnection ? "destructive" : "outline"}
                className="w-full"
                size="sm"
                disabled={!selectedNode}
              >
                <Link2 className="h-4 w-4 mr-2" />
                {isCreatingConnection ? 'Anuluj' : 'Połącz'}
              </Button>

              <Button
                onClick={deleteNode}
                variant="outline"
                className="w-full border-red-600 text-red-400"
                size="sm"
                disabled={!selectedNode}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Usuń węzeł
              </Button>

              <Button
                onClick={exportMindMap}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Eksport
              </Button>
            </CardContent>
          </Card>

          {showAddNode && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Nowy węzeł</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  value={newNodeTitle}
                  onChange={(e) => setNewNodeTitle(e.target.value)}
                  placeholder="Nazwa węzła"
                  className="bg-slate-900 border-slate-600"
                  onKeyPress={(e) => e.key === 'Enter' && addNode()}
                />
                <div className="flex space-x-2">
                  <Button onClick={addNode} size="sm" className="flex-1">
                    <Save className="h-3 w-3 mr-1" />
                    Dodaj
                  </Button>
                  <Button
                    onClick={() => setShowAddNode(false)}
                    variant="ghost"
                    size="sm"
                  >
                    Anuluj
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedNode && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Wybrany węzeł</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-300">
                    <strong>ID:</strong> {selectedNode}
                  </p>
                  <p className="text-slate-300">
                    <strong>Tytuł:</strong> {nodes.find(n => n.id === selectedNode)?.title}
                  </p>
                  <p className="text-slate-300">
                    <strong>Połączenia:</strong> {connections.filter(c => c.from === selectedNode || c.to === selectedNode).length}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MindMapsCreator;
