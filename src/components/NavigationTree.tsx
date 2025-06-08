
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronRight, 
  Folder, 
  File, 
  Bot, 
  Code, 
  Image, 
  Settings,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';

interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file' | 'agent' | 'function';
  children?: TreeNode[];
  path?: string;
  agentId?: string;
  functionId?: string;
  isChecked?: boolean;
  isExpanded?: boolean;
  metadata?: {
    fileType?: string;
    lastModified?: Date;
    status?: 'active' | 'inactive' | 'pending';
    description?: string;
  };
}

interface NavigationTreeProps {
  onNodeSelect?: (node: TreeNode) => void;
  onGroupOperation?: (operation: string, nodes: TreeNode[]) => void;
  className?: string;
}

const NavigationTree = ({ onNodeSelect, onGroupOperation, className }: NavigationTreeProps) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    buildTreeData();
    const interval = setInterval(buildTreeData, 5000); // Auto-refresh co 5 sekund
    return () => clearInterval(interval);
  }, []);

  const buildTreeData = () => {
    // Auto-building tree structure based on system components
    const newTreeData: TreeNode[] = [
      {
        id: 'agents',
        name: 'System Agents',
        type: 'folder',
        isExpanded: true,
        children: [
          {
            id: 'core-agents',
            name: 'Core Agents',
            type: 'folder',
            children: [
              {
                id: 'ceo-agent',
                name: '@ceo',
                type: 'agent',
                agentId: '@ceo',
                metadata: { status: 'active', description: 'Strategic decision maker' }
              },
              {
                id: 'router-agent',
                name: '@router',
                type: 'agent',
                agentId: '@router',
                metadata: { status: 'active', description: 'Request routing and management' }
              },
              {
                id: 'optimizer-agent',
                name: '@optymalizator',
                type: 'agent',
                agentId: '@optymalizator',
                metadata: { status: 'active', description: 'Auto-improvement analysis' }
              },
              {
                id: 'guardian-agent',
                name: '@guardian-core',
                type: 'agent',
                agentId: '@guardian-core',
                metadata: { status: 'active', description: 'Security and monitoring' }
              }
            ]
          },
          {
            id: 'specialist-agents',
            name: 'Specialist Agents',
            type: 'folder',
            children: [
              {
                id: 'system-admin',
                name: '@system-admin',
                type: 'agent',
                agentId: '@system-admin',
                metadata: { status: 'active', description: 'Implementation and deployment' }
              },
              {
                id: 'logger-agent',
                name: '@logger',
                type: 'agent',
                agentId: '@logger',
                metadata: { status: 'active', description: 'Event tracking and logging' }
              },
              {
                id: 'memory-agent',
                name: '@memory-core',
                type: 'agent',
                agentId: '@memory-core',
                metadata: { status: 'pending', description: 'Knowledge management' }
              }
            ]
          }
        ]
      },
      {
        id: 'functions',
        name: 'System Functions',
        type: 'folder',
        isExpanded: true,
        children: [
          {
            id: 'ai-functions',
            name: 'AI Functions',
            type: 'folder',
            children: [
              {
                id: 'chat-function',
                name: 'OpenAI Chat',
                type: 'function',
                path: '/components/OpenAIChat.tsx',
                functionId: 'openai-chat',
                metadata: { status: 'active', description: 'Main chat interface' }
              },
              {
                id: 'mini-ai-function',
                name: 'Mini AI Dashboard',
                type: 'function',
                path: '/components/MiniAIDashboard.tsx',
                functionId: 'mini-ai-dashboard',
                metadata: { status: 'active', description: 'Mini AI management' }
              },
              {
                id: 'agent-commander',
                name: 'Agent Commander',
                type: 'function',
                path: '/components/AgentCommander.tsx',
                functionId: 'agent-commander',
                metadata: { status: 'active', description: 'Agent orchestration' }
              }
            ]
          },
          {
            id: 'core-functions',
            name: 'Core Functions',
            type: 'folder',
            children: [
              {
                id: 'auto-improvement',
                name: 'Auto-Improvement',
                type: 'function',
                path: '/services/autoImprovementService.ts',
                functionId: 'auto-improvement',
                metadata: { status: 'active', description: 'System self-improvement' }
              },
              {
                id: 'browser-core',
                name: 'Browser Core',
                type: 'function',
                path: '/components/BrowserCore.tsx',
                functionId: 'browser-core',
                metadata: { status: 'active', description: 'Web browsing functionality' }
              },
              {
                id: 'workflow-builder',
                name: 'Workflow Builder',
                type: 'function',
                path: '/components/WorkflowBuilder.tsx',
                functionId: 'workflow-builder',
                metadata: { status: 'active', description: 'Process automation' }
              }
            ]
          }
        ]
      },
      {
        id: 'files',
        name: 'Project Files',
        type: 'folder',
        children: [
          {
            id: 'components',
            name: 'Components',
            type: 'folder',
            children: [
              {
                id: 'ui-components',
                name: 'UI Components',
                type: 'folder',
                children: [
                  {
                    id: 'button-component',
                    name: 'button.tsx',
                    type: 'file',
                    path: '/components/ui/button.tsx',
                    metadata: { fileType: 'tsx', status: 'active' }
                  },
                  {
                    id: 'card-component',
                    name: 'card.tsx',
                    type: 'file',
                    path: '/components/ui/card.tsx',
                    metadata: { fileType: 'tsx', status: 'active' }
                  }
                ]
              }
            ]
          },
          {
            id: 'services',
            name: 'Services',
            type: 'folder',
            children: [
              {
                id: 'fuko-core',
                name: 'fukoCore.ts',
                type: 'file',
                path: '/services/fukoCore.ts',
                metadata: { fileType: 'ts', status: 'active' }
              },
              {
                id: 'mini-ai-service',
                name: 'miniAIService.ts',
                type: 'file',
                path: '/services/miniAIService.ts',
                metadata: { fileType: 'ts', status: 'active' }
              }
            ]
          }
        ]
      }
    ];

    setTreeData(newTreeData);
    // Auto-expand root folders
    setExpandedNodes(new Set(['agents', 'functions', 'files', 'core-agents', 'ai-functions']));
  };

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const toggleChecked = (nodeId: string) => {
    const newSelected = new Set(selectedNodes);
    if (newSelected.has(nodeId)) {
      newSelected.delete(nodeId);
    } else {
      newSelected.add(nodeId);
    }
    setSelectedNodes(newSelected);
  };

  const handleNodeClick = (node: TreeNode) => {
    if (node.type === 'folder') {
      toggleExpanded(node.id);
    } else {
      onNodeSelect?.(node);
    }
  };

  const getNodeIcon = (node: TreeNode) => {
    switch (node.type) {
      case 'folder':
        return expandedNodes.has(node.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />;
      case 'agent':
        return <Bot className="h-4 w-4 text-cyan-400" />;
      case 'function':
        return <Code className="h-4 w-4 text-purple-400" />;
      case 'file':
        return node.metadata?.fileType === 'tsx' ? 
          <Code className="h-4 w-4 text-blue-400" /> : 
          <File className="h-4 w-4 text-slate-400" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'inactive': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNodes.has(node.id);
    
    const filteredChildren = node.children?.filter(child => {
      if (filterType === 'all') return true;
      return child.type === filterType;
    }).filter(child => {
      if (!searchTerm) return true;
      return child.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
      <div key={node.id} className="select-none">
        <div 
          className={`flex items-center space-x-2 py-2 px-3 rounded-md cursor-pointer transition-colors hover:bg-slate-700/50 ${
            isSelected ? 'bg-cyan-500/20' : ''
          }`}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => handleNodeClick(node)}
        >
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleChecked(node.id)}
            onClick={(e) => e.stopPropagation()}
            className="h-4 w-4"
          />
          {getNodeIcon(node)}
          <span className="text-white text-sm flex-1">{node.name}</span>
          {node.metadata?.status && (
            <Badge className={`text-xs ${getStatusColor(node.metadata.status)}`}>
              {node.metadata.status}
            </Badge>
          )}
        </div>

        {node.children && isExpanded && (
          <div>
            {filteredChildren?.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const handleGroupOperation = (operation: string) => {
    const selectedNodesArray = treeData
      .flatMap(node => getAllNodes(node))
      .filter(node => selectedNodes.has(node.id));
    
    onGroupOperation?.(operation, selectedNodesArray);
  };

  const getAllNodes = (node: TreeNode): TreeNode[] => {
    const nodes = [node];
    if (node.children) {
      node.children.forEach(child => {
        nodes.push(...getAllNodes(child));
      });
    }
    return nodes;
  };

  return (
    <Card className={`bg-slate-800/50 border-slate-700/50 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg">Navigation Tree</CardTitle>
          <Button onClick={buildTreeData} variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search and Filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-700/50 border border-slate-600 rounded-md px-3 py-1 text-white text-sm"
            >
              <option value="all">All Types</option>
              <option value="agent">Agents</option>
              <option value="function">Functions</option>
              <option value="file">Files</option>
              <option value="folder">Folders</option>
            </select>
          </div>
        </div>

        {/* Group Operations */}
        {selectedNodes.size > 0 && (
          <div className="flex items-center space-x-2 pt-2 border-t border-slate-600">
            <span className="text-sm text-slate-400">{selectedNodes.size} selected</span>
            <Button onClick={() => handleGroupOperation('activate')} variant="outline" size="sm">
              Activate
            </Button>
            <Button onClick={() => handleGroupOperation('deactivate')} variant="outline" size="sm">
              Deactivate
            </Button>
            <Button onClick={() => handleGroupOperation('refresh')} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="p-3">
            {treeData.map(node => renderTreeNode(node))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NavigationTree;
