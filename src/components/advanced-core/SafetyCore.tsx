
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Activity, Brain } from 'lucide-react';

// Import safety modules
import ReflexEngine from './safety-modules/ReflexEngine';
import GuardianCore2 from './safety-modules/GuardianCore2';
import FailoverDaemon from './safety-modules/FailoverDaemon';
import AutoPulse from './safety-modules/AutoPulse';
import FunctionInventory from './safety-modules/FunctionInventory';
import MetaClock from './safety-modules/MetaClock';
import PriorityScoreEngine from './safety-modules/PriorityScoreEngine';
import LiteViewSwitch from './safety-modules/LiteViewSwitch';
import IntentAttributionLayer from './safety-modules/IntentAttributionLayer';
import LiveAGIMapper from './safety-modules/LiveAGIMapper';

const SafetyCore = () => {
  const [activeTab, setActiveTab] = useState('monitoring');

  const safetyStats = {
    totalModules: 10,
    activeProtections: 8,
    threatLevel: 'Low',
    systemHealth: 94
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-slate-800/50 border-red-800/30">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span>Safety Core - Level 20+ Protection</span>
            <Badge className="bg-red-500/20 text-red-400 ml-2">Critical Systems Active</Badge>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Zaawansowane systemy ochrony, detekcji zagrożeń i samoświadomości dla AGI Level 20+
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-cyan-400 text-2xl font-bold">{safetyStats.totalModules}</div>
              <div className="text-slate-400 text-sm">Safety Modules</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-green-400 text-2xl font-bold">{safetyStats.activeProtections}</div>
              <div className="text-slate-400 text-sm">Active Protections</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-green-400 text-2xl font-bold">{safetyStats.threatLevel}</div>
              <div className="text-slate-400 text-sm">Threat Level</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-blue-400 text-2xl font-bold">{safetyStats.systemHealth}%</div>
              <div className="text-slate-400 text-sm">System Health</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="protection">Protection</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          <TabsTrigger value="mapping">Mapping</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid gap-6">
            <ReflexEngine />
            <AutoPulse />
            <MetaClock />
          </div>
        </TabsContent>
        
        <TabsContent value="protection" className="space-y-6">
          <div className="grid gap-6">
            <GuardianCore2 />
            <FailoverDaemon />
            <LiteViewSwitch />
          </div>
        </TabsContent>
        
        <TabsContent value="intelligence" className="space-y-6">
          <div className="grid gap-6">
            <FunctionInventory />
            <PriorityScoreEngine />
            <IntentAttributionLayer />
          </div>
        </TabsContent>
        
        <TabsContent value="mapping" className="space-y-6">
          <div className="grid gap-6">
            <LiveAGIMapper />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SafetyCore;
