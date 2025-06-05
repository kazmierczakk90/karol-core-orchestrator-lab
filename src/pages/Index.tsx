
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Brain, Rocket, Command, Terminal, Database, Settings, Activity, Zap, Eye, Pause, Play } from 'lucide-react';
import AGIDashboard from '@/components/AGIDashboard';
import StartupLab from '@/components/StartupLab';
import CommandRoom from '@/components/CommandRoom';
import DeveloperConsole from '@/components/DeveloperConsole';

const Index = () => {
  const [activeModule, setActiveModule] = useState('agi-core');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-blue-800/30 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-cyan-400" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  KAROL LAB
                </h1>
              </div>
              <Badge variant="outline" className="border-green-500/50 text-green-400">
                AGI Core v1.0
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="text-green-400">System Online</span>
              </div>
              <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                Status: 87%
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeModule} onValueChange={setActiveModule} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-blue-800/30">
            <TabsTrigger value="agi-core" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AGI Core</span>
            </TabsTrigger>
            <TabsTrigger value="startup-lab" className="flex items-center space-x-2">
              <Rocket className="h-4 w-4" />
              <span>Startup Lab</span>
            </TabsTrigger>
            <TabsTrigger value="command-room" className="flex items-center space-x-2">
              <Command className="h-4 w-4" />
              <span>Command Room</span>
            </TabsTrigger>
            <TabsTrigger value="dev-console" className="flex items-center space-x-2">
              <Terminal className="h-4 w-4" />
              <span>Dev Console</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agi-core" className="mt-6">
            <AGIDashboard />
          </TabsContent>

          <TabsContent value="startup-lab" className="mt-6">
            <StartupLab />
          </TabsContent>

          <TabsContent value="command-room" className="mt-6">
            <CommandRoom />
          </TabsContent>

          <TabsContent value="dev-console" className="mt-6">
            <DeveloperConsole />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
