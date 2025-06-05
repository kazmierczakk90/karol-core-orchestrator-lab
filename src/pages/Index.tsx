import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Brain, Rocket, Command, Terminal, MessageSquare, Activity, Zap, Keyboard } from 'lucide-react';
import AGIDashboard from '@/components/AGIDashboard';
import StartupLab from '@/components/StartupLab';
import CommandRoom from '@/components/CommandRoom';
import DeveloperConsole from '@/components/DeveloperConsole';
import FUKOConsole from '@/components/FUKOConsole';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';
import MicrophoneControl from '@/components/MicrophoneControl';
import { keyboardService } from '@/services/keyboardService';
import { voiceService } from '@/services/voiceService';

const Index = () => {
  const [activeModule, setActiveModule] = useState('agi-core');
  const [systemStatus, setSystemStatus] = useState('INITIALIZING');
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  useEffect(() => {
    // Initialize services
    initializeSystem();
    
    // Set up system status monitoring
    const statusInterval = setInterval(() => {
      updateSystemStatus();
    }, 5000);

    return () => clearInterval(statusInterval);
  }, []);

  const initializeSystem = () => {
    console.log('🚀 Initializing Karol Core System...');
    
    // Initialize keyboard service (already done in constructor)
    console.log('⌨️  Keyboard shortcuts activated');
    
    // Show system ready notification
    setTimeout(() => {
      setSystemStatus('ONLINE');
      showSystemNotification('SYSTEM READY', 'Karol Core AGI Suite is online. Press F12 for status.');
      voiceService.speak('System Karol Core gotowy do pracy');
    }, 2000);
  };

  const updateSystemStatus = () => {
    // This would typically check various system components
    // For now, we'll keep it simple
    setSystemStatus('ONLINE');
  };

  const showSystemNotification = (title: string, message: string) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-md';
    notification.innerHTML = `
      <div class="font-bold">${title}</div>
      <div class="text-sm">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 4000);
  };

  const handleEmergencyStop = () => {
    console.log('🚨 Emergency stop triggered from UI');
    keyboardService['emergencyShutdown']?.();
  };

  const toggleVoiceMode = () => {
    if (voiceEnabled) {
      voiceService.stopListening();
      setVoiceEnabled(false);
    } else {
      // This will be handled by MicrophoneControl component
      setVoiceEnabled(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'text-green-400 border-green-500/50';
      case 'INITIALIZING': return 'text-yellow-400 border-yellow-500/50';
      case 'MAINTENANCE': return 'text-orange-400 border-orange-500/50';
      case 'OFFLINE': return 'text-red-400 border-red-500/50';
      default: return 'text-gray-400 border-gray-500/50';
    }
  };

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
                AGI Core v3.0 + FUKO-PZK
              </Badge>
              <Badge variant="outline" className={getStatusColor(systemStatus)}>
                Status: {systemStatus}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="text-green-400">FUKO System Online</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Keyboard className="h-4 w-4 text-cyan-400" />
                <span className="text-cyan-400">Shortcuts Active</span>
              </div>
              <Button
                onClick={handleEmergencyStop}
                variant="outline"
                size="sm"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <Zap className="h-4 w-4 mr-1" />
                Emergency Stop
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeModule} onValueChange={setActiveModule} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-blue-800/30">
            <TabsTrigger value="agi-core" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AGI Core</span>
            </TabsTrigger>
            <TabsTrigger value="fuko-console" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>FUKO-PZK</span>
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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <AGIDashboard />
              </div>
              <div className="space-y-4">
                <MicrophoneControl />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fuko-console" className="mt-6">
            <FUKOConsole />
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

      {/* Keyboard Shortcuts Component */}
      <KeyboardShortcuts />

      {/* System Status Overlay (only visible during initialization) */}
      {systemStatus === 'INITIALIZING' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-slate-800 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center space-x-2">
                <Brain className="h-6 w-6 animate-pulse" />
                <span>Karol Core Initialization</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-slate-300">
                <div>• Loading AGI modules...</div>
                <div>• Initializing FUKO-PZK system...</div>
                <div>• Activating agents...</div>
                <div>• Setting up voice recognition...</div>
                <div>• Configuring keyboard shortcuts...</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;
