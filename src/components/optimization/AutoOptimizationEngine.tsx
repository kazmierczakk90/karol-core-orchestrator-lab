
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AutoOptimization } from '@/types/optimization';
import EngineControls from './auto-optimization/EngineControls';
import OptimizationList from './auto-optimization/OptimizationList';
import { useAutoOptimization } from '@/hooks/useAutoOptimization';

const AutoOptimizationEngine = () => {
  const { toast } = useToast();
  const {
    optimizations,
    isEngineActive,
    aggressiveness,
    currentlyRunning,
    overallProgress,
    setIsEngineActive,
    setAggressiveness,
    toggleOptimization,
    runOptimization
  } = useAutoOptimization();

  const activeOptimizations = optimizations.filter(opt => opt.enabled).length;
  const completedToday = optimizations.filter(opt => 
    opt.lastRun && opt.lastRun > new Date(Date.now() - 86400000)
  ).length;

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span>Auto-Optimization Engine</span>
            <Badge variant="outline" className={isEngineActive ? "text-green-400" : "text-red-400"}>
              {isEngineActive ? 'Active' : 'Paused'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <EngineControls
            isEngineActive={isEngineActive}
            setIsEngineActive={setIsEngineActive}
            aggressiveness={aggressiveness}
            setAggressiveness={setAggressiveness}
            activeOptimizations={activeOptimizations}
            completedToday={completedToday}
          />

          {currentlyRunning && (
            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <Activity className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Running optimization: {optimizations.find(o => o.id === currentlyRunning)?.name}
              </AlertDescription>
            </Alert>
          )}

          <OptimizationList
            optimizations={optimizations}
            toggleOptimization={toggleOptimization}
            runOptimization={runOptimization}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoOptimizationEngine;
