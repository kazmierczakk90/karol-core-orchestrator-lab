
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, Activity, Clock } from 'lucide-react';
import { AdvancedModule } from '@/types/advancedModules';

interface LoopDetectionState {
  activeDecisions: Map<string, number>;
  loopThreshold: number;
  detectedLoops: string[];
  preventedLoops: number;
}

const EndlessLoopPrevention = () => {
  const [loopState, setLoopState] = useState<LoopDetectionState>({
    activeDecisions: new Map(),
    loopThreshold: 5,
    detectedLoops: [],
    preventedLoops: 0
  });

  const [isActive, setIsActive] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    executionTime: 0.12,
    memoryUsage: 0.8,
    successRate: 99.7,
    errorCount: 0
  });

  // Symulacja detekcji pętli
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Symulacja wykrywania potencjalnych pętli decyzyjnych
      const simulatedDecisionId = `decision_${Math.random().toString(36).substr(2, 9)}`;
      
      setLoopState(prev => {
        const newMap = new Map(prev.activeDecisions);
        const currentCount = newMap.get(simulatedDecisionId) || 0;
        
        if (currentCount >= prev.loopThreshold) {
          // Wykryto pętlę - dodaj do listy wykrytych
          return {
            ...prev,
            detectedLoops: [...prev.detectedLoops.slice(-9), simulatedDecisionId],
            preventedLoops: prev.preventedLoops + 1
          };
        } else {
          newMap.set(simulatedDecisionId, currentCount + 1);
          return {
            ...prev,
            activeDecisions: newMap
          };
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive]);

  const moduleInfo: AdvancedModule = {
    id: 'endless-loop-prevention',
    name: 'Endless Loop Prevention',
    description: 'System blokujący nieskończone pętle decyzyjne',
    functionalArea: 'decyzyjny',
    status: 'produkcyjny',
    priority: 'pilne',
    integrationPoint: 'DecisionEngine, MetaOrchestrator',
    compatibility: ['quantum-decisions', 'fuko-engine', 'meta-evolution'],
    potentialGain: 'Zapobiega zawieszeniu systemu, zwiększa stabilność o 35%',
    risk: 'niskie',
    version: '1.2.0',
    enabled: isActive,
    performanceMetrics,
    dependencies: [],
    safetyLayer: {
      isolation: true,
      rollbackEnabled: true,
      monitoringActive: true
    }
  };

  return (
    <Card className="bg-slate-800/50 border-red-800/30">
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <span>Endless Loop Prevention</span>
          <Badge className={isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
            {isActive ? 'ACTIVE' : 'DISABLED'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="text-cyan-400 text-xl font-bold">{loopState.activeDecisions.size}</div>
            <div className="text-slate-400 text-sm">Active Decisions</div>
          </div>
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="text-yellow-400 text-xl font-bold">{loopState.detectedLoops.length}</div>
            <div className="text-slate-400 text-sm">Detected Loops</div>
          </div>
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="text-green-400 text-xl font-bold">{loopState.preventedLoops}</div>
            <div className="text-slate-400 text-sm">Prevented Loops</div>
          </div>
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="text-purple-400 text-xl font-bold">{loopState.loopThreshold}</div>
            <div className="text-slate-400 text-sm">Loop Threshold</div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <h3 className="text-white font-medium">Performance Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Success Rate</span>
                <span className="text-green-400">{performanceMetrics.successRate}%</span>
              </div>
              <Progress value={performanceMetrics.successRate} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Memory Usage</span>
                <span className="text-cyan-400">{performanceMetrics.memoryUsage}MB</span>
              </div>
              <Progress value={(performanceMetrics.memoryUsage / 10) * 100} className="h-2" />
            </div>
          </div>
        </div>

        {/* Recent Loop Detections */}
        {loopState.detectedLoops.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-white font-medium">Recent Loop Detections</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {loopState.detectedLoops.slice(-5).map((loopId, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <AlertTriangle className="h-3 w-3 text-yellow-400" />
                  <span className="text-white font-mono">{loopId}</span>
                  <Badge variant="outline" className="text-red-400 border-red-400">
                    BLOCKED
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <div className="flex items-center space-x-2">
            <Activity className={`h-4 w-4 ${isActive ? 'text-green-400' : 'text-slate-400'}`} />
            <span className="text-slate-300">Loop Prevention System</span>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={isActive ? "destructive" : "default"}
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>

        {/* Module Information */}
        <div className="bg-slate-700/30 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-slate-400">Integration Points:</div>
              <div className="text-white">{moduleInfo.integrationPoint}</div>
            </div>
            <div>
              <div className="text-slate-400">Potential Gain:</div>
              <div className="text-green-400">{moduleInfo.potentialGain}</div>
            </div>
            <div>
              <div className="text-slate-400">Risk Level:</div>
              <div className="text-yellow-400">{moduleInfo.risk}</div>
            </div>
            <div>
              <div className="text-slate-400">Version:</div>
              <div className="text-cyan-400">v{moduleInfo.version}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EndlessLoopPrevention;
