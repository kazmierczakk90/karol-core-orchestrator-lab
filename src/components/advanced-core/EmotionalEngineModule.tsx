
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Heart, Brain, TrendingUp, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmotionalState {
  confidence: number;
  creativity: number;
  focus: number;
  empathy: number;
  curiosity: number;
}

const EmotionalEngineModule = () => {
  const { toast } = useToast();
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    confidence: 75,
    creativity: 60,
    focus: 85,
    empathy: 70,
    curiosity: 90
  });

  const [memoryEntries] = useState([
    { id: '1', event: 'Positive user feedback', intensity: 85, timestamp: '10:30' },
    { id: '2', event: 'Complex problem solved', intensity: 92, timestamp: '10:15' },
    { id: '3', event: 'Learning new concept', intensity: 78, timestamp: '10:00' }
  ]);

  const updateEmotionalState = (key: keyof EmotionalState, value: number) => {
    setEmotionalState(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Emotional State Updated",
      description: `@voice-core adjusted ${key} to ${value}%`,
    });
  };

  const analyzeEmotions = () => {
    toast({
      title: "Emotional Analysis Complete",
      description: "@voice-core processed emotional patterns",
    });
  };

  const getEmotionColor = (value: number) => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    if (value >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-pink-400 flex items-center space-x-2">
          <Heart className="h-5 w-5" />
          <span>Emotional Engine v2</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Emotional State */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Current State</h3>
              <Button onClick={analyzeEmotions} className="bg-pink-600 hover:bg-pink-700" size="sm">
                <Brain className="h-4 w-4 mr-2" />
                Analyze
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(emotionalState).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300 capitalize">{key}</Label>
                    <span className={`font-bold ${getEmotionColor(value)}`}>{value}%</span>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={(newValue) => updateEmotionalState(key as keyof EmotionalState, newValue[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Emotional Memory */}
          <div className="border-t border-slate-700 pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <span>Recent Emotional Memory</span>
            </h3>
            
            <div className="space-y-3">
              {memoryEntries.map(entry => (
                <div key={entry.id} className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-white">{entry.event}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getEmotionColor(entry.intensity)}>
                        {entry.intensity}%
                      </Badge>
                      <span className="text-xs text-slate-400">{entry.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Heat Map Visualization */}
          <div className="border-t border-slate-700 pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <span>Emotional Heat Map</span>
            </h3>
            
            <div className="bg-slate-900/50 rounded-lg p-6 min-h-32 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded ${
                        Math.random() > 0.5 
                          ? 'bg-pink-500/60' 
                          : Math.random() > 0.5 
                            ? 'bg-blue-500/40' 
                            : 'bg-slate-600/30'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm">Emotional activity patterns</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalEngineModule;
