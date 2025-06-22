
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BrainCircuit, GitBranch, Zap, Target, RefreshCw } from 'lucide-react';

interface RecursionNode {
  id: string;
  depth: number;
  reasoning: string;
  outcome: string;
  confidence: number;
  children: RecursionNode[];
  parentId?: string;
}

const RecursiveLogic = () => {
  const [recursionTree, setRecursionTree] = useState<RecursionNode[]>([]);
  const [maxDepth, setMaxDepth] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentDepth, setCurrentDepth] = useState(0);

  const generateRecursiveReasoning = async (problem: string, depth: number = 0): Promise<RecursionNode> => {
    if (depth >= maxDepth) {
      return {
        id: `node_${Date.now()}_${depth}`,
        depth,
        reasoning: "Maximum recursion depth reached",
        outcome: "Base case: Return simplified solution",
        confidence: 1.0,
        children: []
      };
    }

    setCurrentDepth(depth);
    
    // Symulacja rekursywnego rozumowania
    const subProblems = [
      `Analyze component: ${problem} (Level ${depth + 1})`,
      `Decompose: ${problem} (Level ${depth + 1})`,
      `Pattern recognition: ${problem} (Level ${depth + 1})`
    ];

    const node: RecursionNode = {
      id: `node_${Date.now()}_${depth}`,
      depth,
      reasoning: `Processing "${problem}" at depth ${depth}`,
      outcome: `Identified ${subProblems.length} sub-problems`,
      confidence: Math.max(0.3, 1 - (depth * 0.15)),
      children: []
    };

    // Rekursywnie rozwiąż podproblemy
    if (depth < maxDepth - 1) {
      for (const subProblem of subProblems.slice(0, Math.max(1, 3 - depth))) {
        const childNode = await generateRecursiveReasoning(subProblem, depth + 1);
        childNode.parentId = node.id;
        node.children.push(childNode);
        
        // Krótka pauza dla wizualizacji
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return node;
  };

  const startRecursiveAnalysis = async () => {
    setIsProcessing(true);
    setRecursionTree([]);
    setCurrentDepth(0);

    try {
      const problems = [
        "Complex decision optimization",
        "Pattern synthesis analysis",
        "Causal relationship mapping"
      ];

      const trees: RecursionNode[] = [];
      
      for (const problem of problems) {
        const tree = await generateRecursiveReasoning(problem);
        trees.push(tree);
      }

      setRecursionTree(trees);
    } catch (error) {
      console.error('Recursive analysis error:', error);
    } finally {
      setIsProcessing(false);
      setCurrentDepth(0);
    }
  };

  const renderRecursionNode = (node: RecursionNode, level: number = 0) => {
    const indentClass = `ml-${level * 4}`;
    const depthColor = `text-${['purple', 'blue', 'green', 'yellow', 'red'][Math.min(4, node.depth)]}-400`;

    return (
      <div key={node.id} className="space-y-2">
        <Card className={`bg-slate-700/30 border-slate-600/50 ${indentClass}`}>
          <CardContent className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <BrainCircuit className={`h-4 w-4 ${depthColor}`} />
                  <Badge variant="outline" className={`border-${['purple', 'blue', 'green', 'yellow', 'red'][Math.min(4, node.depth)]}-500/50 ${depthColor}`}>
                    Depth {node.depth}
                  </Badge>
                  <Progress value={node.confidence * 100} className="w-16" />
                  <span className="text-xs text-slate-400">{Math.round(node.confidence * 100)}%</span>
                </div>
                <p className="text-white text-sm mb-1">{node.reasoning}</p>
                <p className="text-slate-300 text-xs">{node.outcome}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {node.children.map(child => renderRecursionNode(child, level + 1))}
      </div>
    );
  };

  return (
    <Card className="bg-slate-800/50 border-purple-800/30">
      <CardHeader>
        <CardTitle className="text-purple-400 flex items-center space-x-2">
          <GitBranch className="h-6 w-6" />
          <span>Recursive Logic Engine - Level 14</span>
          {isProcessing && (
            <div className="flex items-center space-x-2 ml-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
              <span className="text-sm">Depth {currentDepth}</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={startRecursiveAnalysis}
              disabled={isProcessing}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Start Recursive Analysis
            </Button>
            
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 text-sm">Max Depth:</span>
              <select 
                value={maxDepth} 
                onChange={(e) => setMaxDepth(Number(e.target.value))}
                className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                disabled={isProcessing}
              >
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={7}>7</option>
                <option value={10}>10</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-purple-500/50 text-purple-400">
              Trees: {recursionTree.length}
            </Badge>
            <Badge variant="outline" className="border-blue-500/50 text-blue-400">
              Total Nodes: {recursionTree.reduce((sum, tree) => sum + countNodes(tree), 0)}
            </Badge>
          </div>
        </div>

        {isProcessing && (
          <div className="bg-slate-700/50 p-4 rounded-lg border border-purple-500/30">
            <div className="flex items-center space-x-3">
              <div className="animate-pulse">
                <BrainCircuit className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-purple-400 font-medium">Recursive Analysis in Progress</p>
                <p className="text-slate-400 text-sm">Current depth: {currentDepth} / {maxDepth}</p>
              </div>
            </div>
            <Progress value={(currentDepth / maxDepth) * 100} className="mt-3" />
          </div>
        )}

        <div className="space-y-4">
          {recursionTree.map(tree => (
            <div key={tree.id} className="border border-slate-600/50 rounded-lg p-4 bg-slate-700/20">
              <h4 className="text-cyan-400 font-semibold mb-3 flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Recursion Tree: {tree.reasoning}</span>
              </h4>
              {renderRecursionNode(tree)}
            </div>
          ))}
        </div>

        {recursionTree.length === 0 && !isProcessing && (
          <div className="text-center py-12 text-slate-400">
            <GitBranch className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>No recursive analysis running</p>
            <p className="text-sm">Start analysis to see recursive reasoning trees</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const countNodes = (node: RecursionNode): number => {
  return 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0);
};

export default RecursiveLogic;
