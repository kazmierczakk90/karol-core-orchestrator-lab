
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Settings, Sparkles, TrendingUp, AlertTriangle, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface EmergentPattern {
  id: string;
  pattern: string;
  complexity: number;
  novelty: number;
  stability: number;
  emergenceScore: number;
  detectedAt: Date;
  components: string[];
}

interface SystemMetrics {
  entropy: number;
  connectivity: number;
  coherence: number;
  adaptability: number;
}

const EmergenceDetector = () => {
  const [patterns, setPatterns] = useState<EmergentPattern[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    entropy: 0,
    connectivity: 0,
    coherence: 0,
    adaptability: 0
  });
  const [isDetecting, setIsDetecting] = useState(false);
  const [settings, setSettings] = useState({
    emergenceThreshold: 0.6,
    complexityWeight: 0.4,
    noveltyWeight: 0.3,
    stabilityWeight: 0.3,
    detectionSensitivity: 0.5,
    autoDetection: true,
    patternHistory: 10
  });

  useEffect(() => {
    if (settings.autoDetection) {
      const interval = setInterval(() => {
        detectEmergence();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [settings]);

  const detectEmergence = async () => {
    setIsDetecting(true);

    // Generate system metrics
    const newMetrics: SystemMetrics = {
      entropy: Math.random(),
      connectivity: Math.random(),
      coherence: Math.random(),
      adaptability: Math.random()
    };
    setSystemMetrics(newMetrics);

    // Detect emergent patterns
    const emergentPatterns = [
      "Self-organizing decision networks",
      "Spontaneous agent collaboration",
      "Adaptive learning clusters",
      "Emergent optimization strategies",
      "Collective intelligence patterns",
      "Autonomous system evolution"
    ];

    const components = [
      "Neural pathways", "Decision nodes", "Memory clusters", 
      "Agent networks", "Data streams", "Process chains"
    ];

    const patternCount = Math.floor(Math.random() * 3) + 1;
    const newPatterns: EmergentPattern[] = [];

    for (let i = 0; i < patternCount; i++) {
      const complexity = Math.random();
      const novelty = Math.random();
      const stability = Math.random();
      
      const emergenceScore = 
        complexity * settings.complexityWeight +
        novelty * settings.noveltyWeight +
        stability * settings.stabilityWeight;

      if (emergenceScore >= settings.emergenceThreshold) {
        const selectedComponents = components
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 4) + 2);

        newPatterns.push({
          id: `pattern_${Date.now()}_${i}`,
          pattern: emergentPatterns[Math.floor(Math.random() * emergentPatterns.length)],
          complexity,
          novelty,
          stability,
          emergenceScore,
          detectedAt: new Date(),
          components: selectedComponents
        });
      }
    }

    if (newPatterns.length > 0) {
      setPatterns(prev => [...newPatterns, ...prev.slice(0, settings.patternHistory - 1)]);
    }

    setIsDetecting(false);
  };

  const getEmergenceLevel = (score: number) => {
    if (score >= 0.8) return { label: 'CRITICAL', color: 'text-red-400 border-red-500/50' };
    if (score >= 0.6) return { label: 'HIGH', color: 'text-orange-400 border-orange-500/50' };
    if (score >= 0.4) return { label: 'MEDIUM', color: 'text-yellow-400 border-yellow-500/50' };
    return { label: 'LOW', color: 'text-green-400 border-green-500/50' };
  };

  const SettingsDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">Emergence Detection Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium">Emergence Threshold: {settings.emergenceThreshold}</label>
            <Slider
              value={[settings.emergenceThreshold]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, emergenceThreshold: value }))}
              min={0.1}
              max={0.9}
              step={0.1}
              className="mt-2"
            />
          </div>
          
          <div>
            <label className="text-white text-sm font-medium">Complexity Weight: {settings.complexityWeight}</label>
            <Slider
              value={[settings.complexityWeight]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, complexityWeight: value }))}
              min={0.1}
              max={0.8}
              step={0.1}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium">Novelty Weight: {settings.noveltyWeight}</label>
            <Slider
              value={[settings.noveltyWeight]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, noveltyWeight: value }))}
              min={0.1}
              max={0.8}
              step={0.1}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium">Stability Weight: {settings.stabilityWeight}</label>
            <Slider
              value={[settings.stabilityWeight]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, stabilityWeight: value }))}
              min={0.1}
              max={0.8}
              step={0.1}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium">Pattern History: {settings.patternHistory}</label>
            <Slider
              value={[settings.patternHistory]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, patternHistory: value }))}
              min={5}
              max={50}
              step={5}
              className="mt-2"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">Auto Detection</span>
            <Switch
              checked={settings.autoDetection}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoDetection: checked }))}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Card className="bg-slate-800/50 border-cyan-800/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <Sparkles className="h-6 w-6" />
            <span>Emergence Detector - Level 17</span>
            {isDetecting && (
              <div className="animate-pulse">
                <Eye className="h-4 w-4 text-cyan-400" />
              </div>
            )}
          </CardTitle>
          <SettingsDialog />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={detectEmergence}
            disabled={isDetecting}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Detect Emergence
          </Button>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
              Patterns: {patterns.length}
            </Badge>
            <Badge variant="outline" className="border-purple-500/50 text-purple-400">
              Active Detection: {settings.autoDetection ? 'ON' : 'OFF'}
            </Badge>
          </div>
        </div>

        {/* System Metrics */}
        <Card className="bg-slate-700/50 border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-white text-lg">System Complexity Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 text-sm">Entropy</span>
                  <span className="text-white text-sm">{Math.round(systemMetrics.entropy * 100)}%</span>
                </div>
                <Progress value={systemMetrics.entropy * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 text-sm">Connectivity</span>
                  <span className="text-white text-sm">{Math.round(systemMetrics.connectivity * 100)}%</span>
                </div>
                <Progress value={systemMetrics.connectivity * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 text-sm">Coherence</span>
                  <span className="text-white text-sm">{Math.round(systemMetrics.coherence * 100)}%</span>
                </div>
                <Progress value={systemMetrics.coherence * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 text-sm">Adaptability</span>
                  <span className="text-white text-sm">{Math.round(systemMetrics.adaptability * 100)}%</span>
                </div>
                <Progress value={systemMetrics.adaptability * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergent Patterns */}
        <div className="space-y-3">
          {patterns.map((pattern) => {
            const level = getEmergenceLevel(pattern.emergenceScore);
            return (
              <Card key={pattern.id} className="bg-slate-700/50 border-slate-600/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-semibold text-sm">{pattern.pattern}</h4>
                      <p className="text-slate-400 text-xs">
                        Detected: {pattern.detectedAt.toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge variant="outline" className={level.color}>
                      {level.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <span className="text-slate-400 text-xs">Complexity</span>
                      <Progress value={pattern.complexity * 100} className="h-1 mt-1" />
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs">Novelty</span>
                      <Progress value={pattern.novelty * 100} className="h-1 mt-1" />
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs">Stability</span>
                      <Progress value={pattern.stability * 100} className="h-1 mt-1" />
                    </div>
                  </div>

                  <div>
                    <span className="text-cyan-400 text-xs font-medium">Components:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {pattern.components.map((component, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {component}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Emergence Score</span>
                      <span className="text-white text-xs font-bold">
                        {Math.round(pattern.emergenceScore * 100)}%
                      </span>
                    </div>
                    <Progress value={pattern.emergenceScore * 100} className="h-2 mt-1" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {patterns.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>No emergent patterns detected</p>
            <p className="text-sm">Run detection to discover emerging system behaviors</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergenceDetector;
