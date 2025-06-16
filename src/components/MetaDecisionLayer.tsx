
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layers, BrainCircuit, ShieldCheck, Activity } from 'lucide-react';
import MetaOrchestrator from './meta-decision/MetaOrchestrator';
import DecisionRouter from './meta-decision/DecisionRouter';
import PriorityManager from './meta-decision/PriorityManager';
import FukoRAM from './meta-decision/FukoRAM';
import FukoIDManager from './meta-decision/FukoIDManager';
import FukoAuditor from './meta-decision/FukoAuditor';

const MetaDecisionLayer = () => {
  const [activeTab, setActiveTab] = useState('orchestrator');

  const modules = [
    { id: 'orchestrator', name: 'Meta-Orchestrator', level: 3, icon: BrainCircuit, color: 'purple' },
    { id: 'router', name: 'Decision Router', level: 4, icon: Activity, color: 'blue' },
    { id: 'priority', name: 'Priority Manager', level: 5, icon: ShieldCheck, color: 'orange' },
    { id: 'fuko-ram', name: 'FUKO-RAM', level: 6, icon: BrainCircuit, color: 'pink' },
    { id: 'fuko-id', name: 'FUKO-ID', level: 7, icon: ShieldCheck, color: 'indigo' },
    { id: 'fuko-auditor', name: 'FUKO-Auditor', level: 8, icon: ShieldCheck, color: 'green' }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      purple: 'border-purple-500/50 text-purple-400 hover:bg-purple-500/20',
      blue: 'border-blue-500/50 text-blue-400 hover:bg-blue-500/20',
      orange: 'border-orange-500/50 text-orange-400 hover:bg-orange-500/20',
      pink: 'border-pink-500/50 text-pink-400 hover:bg-pink-500/20',
      indigo: 'border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/20',
      green: 'border-green-500/50 text-green-400 hover:bg-green-500/20'
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-slate-800/50 border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center space-x-2">
            <Layers className="h-6 w-6" />
            <span>Meta-Decision Layer - Full Armor</span>
            <div className="ml-4 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full">
              Levels 3-8 Active
            </div>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Kompletny system Meta-Decision Layer z wszystkimi modułami Full Armor. 
            Aktywne poziomy: META_ORCHESTRATOR, DECISION_ROUTER, PRIORITY_MANAGER, FUKO_RAM, FUKO_ID, FUKO_AUDITOR.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <div 
                  key={module.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    activeTab === module.id 
                      ? 'bg-slate-700/70 ' + getColorClasses(module.color)
                      : 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50'
                  }`}
                  onClick={() => setActiveTab(module.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-6 w-6 ${activeTab === module.id ? '' : 'text-slate-400'}`} />
                    <div>
                      <div className={`font-semibold ${activeTab === module.id ? '' : 'text-white'}`}>
                        {module.name}
                      </div>
                      <div className="text-slate-400 text-sm">Level {module.level}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-slate-800/50">
          {modules.map((module) => (
            <TabsTrigger 
              key={module.id} 
              value={module.id}
              className="data-[state=active]:bg-slate-700"
            >
              L{module.level}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="orchestrator" className="mt-6">
          <MetaOrchestrator />
        </TabsContent>
        
        <TabsContent value="router" className="mt-6">
          <DecisionRouter />
        </TabsContent>
        
        <TabsContent value="priority" className="mt-6">
          <PriorityManager />
        </TabsContent>
        
        <TabsContent value="fuko-ram" className="mt-6">
          <FukoRAM />
        </TabsContent>
        
        <TabsContent value="fuko-id" className="mt-6">
          <FukoIDManager />
        </TabsContent>
        
        <TabsContent value="fuko-auditor" className="mt-6">
          <FukoAuditor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MetaDecisionLayer;
