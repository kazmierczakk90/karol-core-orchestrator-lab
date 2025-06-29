
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GitBranch, Play, Plus, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TriggerChain {
  id: string;
  name: string;
  trigger: string;
  agent: string;
  action: string;
  nextChain?: string;
  isActive: boolean;
}

const TriggerChainDesignerModule = () => {
  const { toast } = useToast();
  const [chains, setChains] = useState<TriggerChain[]>([
    {
      id: '1',
      name: 'Memory → Analysis',
      trigger: 'memory_write',
      agent: '@state-keeper',
      action: 'analyze_pattern',
      nextChain: '2',
      isActive: true
    },
    {
      id: '2',
      name: 'Analysis → Decision',
      trigger: 'pattern_found',
      agent: '@evolution-tracker',
      action: 'make_decision',
      nextChain: '3',
      isActive: true
    },
    {
      id: '3',
      name: 'Decision → Narrative',
      trigger: 'decision_made',
      agent: '@voice-core',
      action: 'create_narrative',
      isActive: false
    }
  ]);

  const toggleChain = (id: string) => {
    setChains(prev => prev.map(chain => 
      chain.id === id ? { ...chain, isActive: !chain.isActive } : chain
    ));
    toast({
      title: "Łańcuch zaktualizowany",
      description: "@router dostosował konfigurację triggerów",
    });
  };

  const executeChain = (chainId: string) => {
    const chain = chains.find(c => c.id === chainId);
    if (chain) {
      toast({
        title: "Łańcuch wykonany",
        description: `${chain.agent} wykonał akcję: ${chain.action}`,
      });
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center space-x-2">
          <GitBranch className="h-5 w-5" />
          <span>Trigger Chain Designer</span>
        </CardTitle>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-400">@router</Badge>
            <Badge variant="secondary" className="text-xs">
              Live Chains
            </Badge>
          </div>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            New Chain
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {chains.map((chain, index) => (
            <div key={chain.id} className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{chain.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {chain.agent}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={chain.isActive}
                    onCheckedChange={() => toggleChain(chain.id)}
                  />
                  <Button
                    onClick={() => executeChain(chain.id)}
                    size="sm"
                    variant="ghost"
                    disabled={!chain.isActive}
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Label className="text-slate-400 w-16">Trigger:</Label>
                  <Badge variant="secondary" className="text-xs">
                    {chain.trigger}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="text-slate-400 w-16">Action:</Label>
                  <span className="text-slate-300">{chain.action}</span>
                </div>
                {chain.nextChain && (
                  <div className="flex items-center space-x-2">
                    <Label className="text-slate-400 w-16">Next:</Label>
                    <span className="text-cyan-400">Chain {chain.nextChain}</span>
                  </div>
                )}
              </div>
              
              {index < chains.length - 1 && (
                <div className="flex justify-center mt-3">
                  <div className="w-px h-4 bg-slate-600" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-slate-700 pt-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-xs text-slate-400">
              <div>Visual Tree: Active</div>
              <div>Drag & Drop: Enabled</div>
              <div>Live Toggle: Real-time</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TriggerChainDesignerModule;
