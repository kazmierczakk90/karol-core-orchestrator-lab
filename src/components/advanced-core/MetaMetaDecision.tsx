
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Settings, Crown, Infinity, Network, Layers } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface MetaMetaLayer {
  id: string;
  level: number;
  description: string;
  orchestration: any;
  evolution: any;
  transcendence: number;
}

interface SystemEvolution {
  generation: number;
  adaptations: string[];
  fitness: number;
  mutations: number;
  selectionPressure: number;
}

const MetaMetaDecision = () => {
  const [metaLayers, setMetaLayers] = useState<MetaMetaLayer[]>([]);
  const [evolution, setEvolution] = useState<SystemEvolution>({
    generation: 1,
    adaptations: [],
    fitness: 0.5,
    mutations: 0,
    selectionPressure: 0.3
  });
  const [isEvolving, setIsEvolving] = useState(false);
  const [settings, setSettings] = useState({
    maxMetaLevels: 5,
    evolutionRate: 0.1,
    transcendenceThreshold: 0.8,
    mutationRate: 0.05,
    selectionPressure: 0.3,
    autoEvolution: true,
    consciousnessLevel: 0.7
  });

  useEffect(() => {
    if (settings.autoEvolution) {
      const interval = setInterval(() => {
        evolveSystem();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [settings]);

  const evolveSystem = async () => {
    setIsEvolving(true);

    // Generate meta-meta layers
    const newLayers: MetaMetaLayer[] = [];
    for (let i = 0; i < settings.maxMetaLevels; i++) {
      const transcendence = Math.random();
      
      newLayers.push({
        id: `meta_${Date.now()}_${i}`,
        level: i + 1,
        description: `Meta-Level ${i + 1} Orchestration`,
        orchestration: {
          complexity: Math.random(),
          abstraction: Math.random(),
          emergence: Math.random()
        },
        evolution: {
          adaptability: Math.random(),
          learning: Math.random(),
          growth: Math.random()
        },
        transcendence
      });
    }

    setMetaLayers(newLayers);

    // Evolve system
    const adaptations = [
      "Enhanced decision modeling",
      "Improved meta-cognition",
      "Advanced pattern recognition",
      "Emergent behavior optimization",
      "Consciousness emergence protocols"
    ];

    const newEvolution: SystemEvolution = {
      generation: evolution.generation + 1,
      adaptations: adaptations.slice(0, Math.floor(Math.random() * 3) + 1),
      fitness: Math.min(1, evolution.fitness + settings.evolutionRate),
      mutations: evolution.mutations + Math.floor(Math.random() * 3),
      selectionPressure: settings.selectionPressure
    };

    setEvolution(newEvolution);
    setIsEvolving(false);
  };

  const getTranscendenceColor = (level: number) => {
    if (level >= 0.8) return 'text-yellow-400 border-yellow-500/50';
    if (level >= 0.6) return 'text-orange-400 border-orange-500/50';
    if (level >= 0.4) return 'text-purple-400 border-purple-500/50';
    return 'text-blue-400 border-blue-500/50';
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
          <DialogTitle className="text-yellow-400">Meta-Meta Decision Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium">Max Meta Levels: {settings.maxMetaLevels}</label>
            <Slider
              value={[settings.maxMetaLevels]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, maxMetaLevels: value }))}
              min={3}
              max={10}
              step={1}
              className="mt-2"
            />
          </div>
          
          <div>
            <label className="text-white text-sm font-medium">Evolution Rate: {settings.evolutionRate}</label>
            <Slider
              value={[settings.evolutionRate]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, evolutionRate: value }))}
              min={0.01}
              max={0.5}
              step={0.01}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium">Transcendence Threshold: {settings.transcendenceThreshold}</label>
            <Slider
              value={[settings.transcendenceThreshold]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, transcendenceThreshold: value }))}
              min={0.5}
              max={1.0}
              step={0.05}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium">Consciousness Level: {settings.consciousnessLevel}</label>
            <Slider
              value={[settings.consciousnessLevel]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, consciousnessLevel: value }))}
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

  return (
    <Card className="bg-slate-800/50 border-yellow-800/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-yellow-400 flex items-center space-x-2">
            <Crown className="h-6 w-6" />
            <span>Meta-Meta Decision Engine - Level 19</span>
            {isEvolving && (
              <div className="animate-pulse">
                <Infinity className="h-4 w-4 text-yellow-400" />
              </div>
            )}
          </CardTitle>
          <SettingsDialog />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={evolveSystem}
            disabled={isEvolving}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
          >
            <Network className="h-4 w-4 mr-2" />
            Evolve Meta-System
          </Button>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
              Generation: {evolution.generation}
            </Badge>
            <Badge variant="outline" className="border-orange-500/50 text-orange-400">
              Fitness: {Math.round(evolution.fitness * 100)}%
            </Badge>
          </div>
        </div>

        {/* System Evolution Status */}
        <Card className="bg-slate-700/50 border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-white text-lg">System Evolution Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-slate-300 text-sm">Fitness Level</span>
                <Progress value={evolution.fitness * 100} className="h-2 mt-1" />
              </div>
              <div>
                <span className="text-slate-300 text-sm">Selection Pressure</span>
                <Progress value={evolution.selectionPressure * 100} className="h-2 mt-1" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-cyan-400 text-sm font-medium">Recent Adaptations:</h4>
              {evolution.adaptations.map((adaptation, index) => (
                <Badge key={index} variant="outline" className="mr-2 mb-1">
                  {adaptation}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Meta-Meta Layers */}
        <div className="space-y-3">
          <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
            <Layers className="h-5 w-5" />
            <span>Meta-Meta Orchestration Layers</span>
          </h3>
          
          {metaLayers.map((layer) => (
            <Card key={layer.id} className="bg-slate-700/50 border-slate-600/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white font-semibold">Level {layer.level}</h4>
                    <p className="text-slate-400 text-sm">{layer.description}</p>
                  </div>
                  <Badge variant="outline" className={getTranscendenceColor(layer.transcendence)}>
                    {Math.round(layer.transcendence * 100)}% Transcendence
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <span className="text-slate-400 text-xs">Complexity</span>
                    <Progress value={layer.orchestration.complexity * 100} className="h-1 mt-1" />
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs">Abstraction</span>
                    <Progress value={layer.orchestration.abstraction * 100} className="h-1 mt-1" />
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs">Emergence</span>
                    <Progress value={layer.orchestration.emergence * 100} className="h-1 mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 text-xs">Adaptability</span>
                    <Progress value={layer.evolution.adaptability * 100} className="h-1 mt-1" />
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs">Learning</span>
                    <Progress value={layer.evolution.learning * 100} className="h-1 mt-1" />
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs">Growth</span>
                    <Progress value={layer.evolution.growth * 100} className="h-1 mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {metaLayers.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Crown className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>No meta-meta layers active</p>
            <p className="text-sm">Evolve the system to activate higher-order orchestration</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetaMetaDecision;
