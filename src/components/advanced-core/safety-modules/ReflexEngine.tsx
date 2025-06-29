
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReflexEngine = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);
  const [systemHealth, setSystemHealth] = useState(94);

  const runReflexAnalysis = async () => {
    setIsAnalyzing(true);
    toast({
      title: "Reflex Analysis Started",
      description: "@meta-reflex is performing system diagnostic...",
    });

    // Simulate analysis
    setTimeout(() => {
      setLastAnalysis(new Date());
      setSystemHealth(Math.floor(Math.random() * 10) + 90);
      setIsAnalyzing(false);
      
      toast({
        title: "System Diagnostic Complete",
        description: `Health Score: ${systemHealth}% - All systems operational`,
      });
    }, 3000);
  };

  useEffect(() => {
    // Auto-analysis every 6 hours
    const interval = setInterval(() => {
      runReflexAnalysis();
    }, 6 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-slate-800/50 border-purple-800/30">
      <CardHeader>
        <CardTitle className="text-purple-400 flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>Reflex Engine</span>
          <Badge variant="outline" className="text-purple-400">@meta-reflex</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">System Health Score</div>
              <div className="text-slate-400 text-sm">
                Last analysis: {lastAnalysis ? lastAnalysis.toLocaleString() : 'Never'}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-green-400">{systemHealth}%</div>
              {systemHealth >= 90 ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              )}
            </div>
          </div>

          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="text-white text-sm font-medium mb-2">Status Log</div>
            <div className="space-y-1 text-sm text-slate-400">
              <div>✓ Memory integrity: OK</div>
              <div>✓ Agent coordination: Optimal</div>
              <div>✓ Decision pathways: Clear</div>
              <div>⚠ Meta-evolution load: 78%</div>
            </div>
          </div>

          <Button 
            onClick={runReflexAnalysis}
            disabled={isAnalyzing}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isAnalyzing ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Analyzing System...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Run Manual Analysis
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReflexEngine;
