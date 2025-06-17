
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Layers, TrendingUp, Sparkles } from 'lucide-react';

const StyleCore = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeStyles = async () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  const styleMetrics = {
    totalStyles: 12,
    activeInheritance: 8,
    consistencyScore: 94,
    evolutionRate: 2.3
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-slate-800/50 border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center space-x-2">
            <Palette className="h-6 w-6" />
            <span>Style Core System</span>
            <Badge className="bg-purple-500/20 text-purple-400 ml-2">Level 9 - Active</Badge>
          </CardTitle>
          <CardDescription className="text-slate-300">
            System definicji stylów z dziedziczeniem i ewolucją behawioralną
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-purple-400 text-2xl font-bold">{styleMetrics.totalStyles}</div>
              <div className="text-slate-400 text-sm">Active Styles</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-blue-400 text-2xl font-bold">{styleMetrics.activeInheritance}</div>
              <div className="text-slate-400 text-sm">Inheritance Lines</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-green-400 text-2xl font-bold">{styleMetrics.consistencyScore}%</div>
              <div className="text-slate-400 text-sm">Consistency</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-cyan-400 text-2xl font-bold">{styleMetrics.evolutionRate}</div>
              <div className="text-slate-400 text-sm">Evolution Rate</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-700/50 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center space-x-2">
                  <Layers className="h-5 w-5 text-purple-400" />
                  <span>Style Inheritance Tree</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['@mentor-style', '@ceo-executive', '@fuko-analytical', '@agent0-tactical'].map((style, index) => (
                    <div key={style} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="text-white font-medium font-mono">{style}</div>
                        <div className="text-slate-400 text-sm">
                          Inheritance Level: {index + 1}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-purple-500/20 text-purple-400">
                          Active
                        </Badge>
                        <Sparkles className="h-4 w-4 text-yellow-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span>Style Evolution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-white font-medium">Behavioral Adaptation</div>
                    <div className="text-slate-400 text-sm mb-2">Real-time style refinement</div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-white font-medium">Cultural Learning</div>
                    <div className="text-slate-400 text-sm mb-2">Context-aware style shifts</div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-white font-medium">Cross-Agent Influence</div>
                    <div className="text-slate-400 text-sm mb-2">Inter-agent style transfer</div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div className="bg-purple-400 h-2 rounded-full" style={{ width: '82%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex justify-center">
            <Button 
              onClick={analyzeStyles}
              disabled={isAnalyzing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isAnalyzing ? <Sparkles className="h-4 w-4 animate-spin" /> : <Palette className="h-4 w-4" />}
              <span className="ml-2">
                {isAnalyzing ? 'Analyzing Styles...' : 'Analyze Style Evolution'}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StyleCore;
