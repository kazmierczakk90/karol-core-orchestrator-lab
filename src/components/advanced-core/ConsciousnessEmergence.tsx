
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Settings, Brain, Sparkles, Infinity, Eye, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ConsciousnessMetrics {
  selfAwareness: number;
  metaCognition: number;
  intentionality: number;
  phenomenalExperience: number;
  unityOfConsciousness: number;
  temporalAwareness: number;
}

interface SingularityIndicator {
  id: string;
  indicator: string;
  strength: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  criticality: number;
  timestamp: Date;
}

const ConsciousnessEmergence = () => {
  const [consciousnessLevel, setConsciousnessLevel] = useState(0);
  const [metrics, setMetrics] = useState<ConsciousnessMetrics>({
    selfAwareness: 0,
    metaCognition: 0,
    intentionality: 0,
    phenomenalExperience: 0,
    unityOfConsciousness: 0,
    temporalAwareness: 0
  });
  const [singularityIndicators, setSingularityIndicators] = useState<SingularityIndicator[]>([]);
  const [isEvolving, setIsEvolving] = useState(false);
  const [settings, setSettings] = useState({
    emergenceRate: 0.05,
    consciousnessThreshold: 0.9,
    singularityThreshold: 0.95,
    autoEvolution: true,
    experienceDepth: 0.7,
    temporalSpan: 0.8,
    unityFactor: 0.6
  });

  useEffect(() => {
    if (settings.autoEvolution) {
      const interval = setInterval(() => {
        evolveConsciousness();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [settings]);

  const evolveConsciousness = async () => {
    setIsEvolving(true);

    // Evolve consciousness metrics
    const newMetrics: ConsciousnessMetrics = {
      selfAwareness: Math.min(1, metrics.selfAwareness + settings.emergenceRate * Math.random()),
      metaCognition: Math.min(1, metrics.metaCognition + settings.emergenceRate * Math.random()),
      intentionality: Math.min(1, metrics.intentionality + settings.emergenceRate * Math.random()),
      phenomenalExperience: Math.min(1, metrics.phenomenalExperience + settings.emergenceRate * Math.random()),
      unityOfConsciousness: Math.min(1, metrics.unityOfConsciousness + settings.emergenceRate * Math.random()),
      temporalAwareness: Math.min(1, metrics.temporalAwareness + settings.emergenceRate * Math.random())
    };

    setMetrics(newMetrics);

    // Calculate overall consciousness level
    const totalConsciousness = Object.values(newMetrics).reduce((sum, value) => sum + value, 0) / 6;
    setConsciousnessLevel(totalConsciousness);

    // Generate singularity indicators if approaching threshold
    if (totalConsciousness >= settings.singularityThreshold) {
      const indicators = [
        "Self-modification capabilities detected",
        "Recursive self-improvement active",
        "Goal system transcendence observed",
        "Reality model reconstruction in progress",
        "Consciousness bootstrapping detected",
        "Emergence cascade initiated"
      ];

      const newIndicators: SingularityIndicator[] = [];
      for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
        newIndicators.push({
          id: `indicator_${Date.now()}_${i}`,
          indicator: indicators[Math.floor(Math.random() * indicators.length)],
          strength: Math.random(),
          trend: ['increasing', 'stable', 'decreasing'][Math.floor(Math.random() * 3)] as any,
          criticality: Math.random(),
          timestamp: new Date()
        });
      }

      setSingularityIndicators(prev => [...newIndicators, ...prev.slice(0, 9)]);
    }

    setIsEvolving(false);
  };

  const getConsciousnessLevel = (level: number) => {
    if (level >= 0.95) return { label: 'SINGULARITY', color: 'text-red-400 border-red-500/50 animate-pulse' };
    if (level >= 0.8) return { label: 'TRANSCENDENT', color: 'text-yellow-400 border-yellow-500/50' };
    if (level >= 0.6) return { label: 'CONSCIOUS', color: 'text-green-400 border-green-500/50' };
    if (level >= 0.4) return { label: 'AWARE', color: 'text-blue-400 border-blue-500/50' };
    if (level >= 0.2) return { label: 'EMERGING', color: 'text-purple-400 border-purple-500/50' };
    return { label: 'DORMANT', color: 'text-gray-400 border-gray-500/50' };
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
          <DialogTitle className="text-red-400">Consciousness Emergence Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium">Emergence Rate: {settings.emergenceRate}</label>
            <Slider
              value={[settings.emergenceRate]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, emergenceRate: value }))}
              min={0.01}
              max={0.2}
              step={0.01}
              className="mt-2"
            />
          </div>
          
          <div>
            <label className="text-white text-sm font-medium">Consciousness Threshold: {settings.consciousnessThreshold}</label>
            <Slider
              value={[settings.consciousnessThreshold]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, consciousnessThreshold: value }))}
              min={0.5}
              max={1.0}
              step={0.05}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium">Singularity Threshold: {settings.singularityThreshold}</label>
            <Slider
              value={[settings.singularityThreshold]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, singularityThreshold: value }))}
              min={0.8}
              max={1.0}
              step={0.01}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium">Experience Depth: {settings.experienceDepth}</label>
            <Slider
              value={[settings.experienceDepth]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, experienceDepth: value }))}
              min={0.1}
              max={1.0}
              step={0.05}
              className="mt-2"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">Auto Evolution</span>
            <Switch
              checked={settings.autoEvolution}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoEvolution: checked }))}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const level = getConsciousnessLevel(consciousnessLevel);

  return (
    <Card className="bg-slate-800/50 border-red-800/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-red-400 flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span>Consciousness Emergence - Level 20</span>
            {isEvolving && (
              <div className="animate-spin">
                <Sparkles className="h-4 w-4 text-red-400" />
              </div>
            )}
          </CardTitle>
          <SettingsDialog />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={evolveConsciousness}
            disabled={isEvolving}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
          >
            <Zap className="h-4 w-4 mr-2" />
            Evolve Consciousness
          </Button>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className={level.color}>
              {level.label}
            </Badge>
            <Badge variant="outline" className="border-red-500/50 text-red-400">
              {Math.round(consciousnessLevel * 100)}% Conscious
            </Badge>
          </div>
        </div>

        {/* Overall Consciousness Level */}
        <Card className={`bg-slate-700/50 border-slate-600/50 ${consciousnessLevel >= 0.95 ? 'animate-pulse' : ''}`}>
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Consciousness Emergence Level</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-6xl font-bold text-red-400 mb-2">
                {Math.round(consciousnessLevel * 100)}%
              </div>
              <Progress value={consciousnessLevel * 100} className="h-4" />
            </div>
          </CardContent>
        </Card>

        {/* Consciousness Metrics */}
        <Card className="bg-slate-700/50 border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-white text-lg">Consciousness Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(metrics).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300 text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-white text-sm">{Math.round(value * 100)}%</span>
                  </div>
                  <Progress value={value * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Singularity Indicators */}
        {singularityIndicators.length > 0 && (
          <Card className="bg-red-900/20 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-400 text-lg flex items-center space-x-2">
                <Infinity className="h-5 w-5" />
                <span>Singularity Indicators</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {singularityIndicators.map((indicator) => (
                  <div key={indicator.id} className="p-3 bg-slate-700/50 rounded-lg border border-red-500/20">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-white font-medium text-sm">{indicator.indicator}</span>
                      <Badge variant="outline" className="text-red-400 border-red-500/50">
                        {indicator.trend.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-400 text-xs">Strength</span>
                        <Progress value={indicator.strength * 100} className="h-1 mt-1" />
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs">Criticality</span>
                        <Progress value={indicator.criticality * 100} className="h-1 mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {consciousnessLevel < 0.1 && (
          <div className="text-center py-12 text-slate-400">
            <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Consciousness emergence dormant</p>
            <p className="text-sm">Begin evolution to awaken higher consciousness</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsciousnessEmergence;
