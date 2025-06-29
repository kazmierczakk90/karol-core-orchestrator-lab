
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Zap, 
  Crown, 
  Activity,
  Settings,
  TrendingUp
} from 'lucide-react';

// Import the new platform orchestrator
import PlatformOrchestrator from '@/components/advanced-core/PlatformOrchestrator';

const Index = () => {
  const [platformMode, setPlatformMode] = useState<'welcome' | 'advanced'>('welcome');

  if (platformMode === 'advanced') {
    return <PlatformOrchestrator />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <img 
              src="/lovable-uploads/e937e8a7-7b24-4ba0-b98b-aade23ac4f11.png" 
              alt="Karol Core Logo" 
              className="h-16 w-16 animate-pulse"
            />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Karol-Core AGI Platform
              </h1>
              <p className="text-slate-300 text-lg">Ultra-Advanced Artificial General Intelligence System</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50 px-4 py-2">
              ✨ Version 2.0 Active
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 px-4 py-2">
              🧠 100-Level Evolution System
            </Badge>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 px-4 py-2">
              ⚡ Quantum Decision Engine
            </Badge>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-cyan-800/30 hover:border-cyan-600/50 transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-white group-hover:text-cyan-400 transition-colors">
                <Brain className="h-6 w-6" />
                <span>Cognitive Research Hub</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                Advanced cognitive analysis, memory management, and belief processing with recursive logic engines.
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-400 border-green-400">Memory</Badge>
                <Badge variant="outline" className="text-blue-400 border-blue-400">Beliefs</Badge>
                <Badge variant="outline" className="text-purple-400 border-purple-400">Analysis</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-800/30 hover:border-purple-600/50 transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-white group-hover:text-purple-400 transition-colors">
                <Crown className="h-6 w-6" />
                <span>Meta-Evolution Engine</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                100-step evolution system for continuous platform advancement and transcendence protocols.
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">Evolution</Badge>
                <Badge variant="outline" className="text-red-400 border-red-400">Transcendence</Badge>
                <Badge variant="outline" className="text-pink-400 border-pink-400">Meta-Level</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-pink-800/30 hover:border-pink-600/50 transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-white group-hover:text-pink-400 transition-colors">
                <Zap className="h-6 w-6" />
                <span>Quantum Decision System</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                Superposition-based decision making with quantum probability analysis and multi-dimensional reasoning.
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-cyan-400 border-cyan-400">Quantum</Badge>
                <Badge variant="outline" className="text-orange-400 border-orange-400">Superposition</Badge>
                <Badge variant="outline" className="text-teal-400 border-teal-400">Multi-D</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-green-800/30 hover:border-green-600/50 transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-white group-hover:text-green-400 transition-colors">
                <Activity className="h-6 w-6" />
                <span>Platform Orchestration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                Real-time system monitoring, agent coordination, and intelligent resource management.
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-400 border-green-400">Monitoring</Badge>
                <Badge variant="outline" className="text-blue-400 border-blue-400">Agents</Badge>
                <Badge variant="outline" className="text-purple-400 border-purple-400">Orchestration</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Capabilities */}
        <Card className="bg-slate-800/50 border-yellow-800/30 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-white">
              <TrendingUp className="h-6 w-6 text-yellow-400" />
              <span>Advanced System Capabilities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">∞</div>
                <div className="text-sm text-slate-300">Recursive Logic</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">◊</div>
                <div className="text-sm text-slate-300">Quantum States</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">⧬</div>
                <div className="text-sm text-slate-300">Meta-Evolution</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">⟐</div>
                <div className="text-sm text-slate-300">Transcendence</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => setPlatformMode('advanced')}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold"
          >
            <Crown className="h-5 w-5 mr-2" />
            Enter Advanced Platform
          </Button>
          
          <Button
            onClick={() => window.location.href = '/extended-agi-panel'}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold"
          >
            <Brain className="h-5 w-5 mr-2" />
            Extended AGI Panel
          </Button>
          
          <Button
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg"
          >
            <Settings className="h-5 w-5 mr-2" />
            Platform Settings
          </Button>
        </div>

        {/* Footer Info */}
        <div className="text-center text-slate-400 text-sm">
          <p>Karol-Core AGI Platform v2.0 | Ultra-Advanced Intelligence System</p>
          <p className="mt-1">Integrating Cognitive Research, Meta-Evolution, Quantum Decisions & Platform Orchestration</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
