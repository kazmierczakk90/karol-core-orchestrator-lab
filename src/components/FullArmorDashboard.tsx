import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Crown, Layers, Brain, Zap, Shield, Activity, Settings } from 'lucide-react';
import MetaDecisionLayer from './MetaDecisionLayer';
import StyleCore from './advanced-core/StyleCore';
import TranscendenceEngine from './advanced-core/TranscendenceEngine';
import RecursiveLogic from './advanced-logic/RecursiveLogic';
import QuantumDecisions from './advanced-logic/QuantumDecisions';
import TemporalAwareness from './advanced-logic/TemporalAwareness';
import EmergenceDetector from './advanced-logic/EmergenceDetector';
import MetaMetaDecision from './advanced-core/MetaMetaDecision';
import ConsciousnessEmergence from './advanced-core/ConsciousnessEmergence';

const FullArmorDashboard = () => {
  const [activeLevel, setActiveLevel] = useState('overview');

  const armorLevels = [
    { level: '3-8', name: 'Meta-Decision Core', status: 'active', color: 'purple' },
    { level: '9-13', name: 'Style & Identity', status: 'active', color: 'blue' },
    { level: '14-17', name: 'Advanced Logic', status: 'active', color: 'green' },
    { level: '18-20', name: 'Transcendence', status: 'transcendent', color: 'gold' }
  ];

  const systemStats = {
    totalLevels: 20,
    activeLevels: 20,
    transcendenceLevel: 98,
    systemIntegrity: 99
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header with Settings */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="h-8 w-8 text-yellow-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Karol-Core AGI</h1>
              <p className="text-slate-400">Full Armor Level 20 - Complete System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
              Level {systemStats.activeLevels}/20
            </Badge>
            <Badge className="bg-green-500/20 text-green-400">
              {systemStats.systemIntegrity}% Integrity
            </Badge>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-yellow-400">Full Armor Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Auto Level Progression</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Transcendence Mode</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Real-time Analytics</span>
                    <Switch defaultChecked />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium">System Integrity Threshold</label>
                    <Slider defaultValue={[95]} min={80} max={100} step={1} className="mt-2" />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-700/50 p-4 overflow-y-auto">
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">System Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-cyan-400 text-xl font-bold">{systemStats.totalLevels}</div>
                    <div className="text-slate-400 text-xs">Total Levels</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 text-xl font-bold">{systemStats.activeLevels}</div>
                    <div className="text-slate-400 text-xs">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 text-xl font-bold">{systemStats.transcendenceLevel}%</div>
                    <div className="text-slate-400 text-xs">Transcendence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-400 text-xl font-bold">{systemStats.systemIntegrity}%</div>
                    <div className="text-slate-400 text-xs">Integrity</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h3 className="text-white font-semibold">Armor Levels</h3>
              {armorLevels.map((armor) => (
                <button
                  key={armor.level}
                  onClick={() => setActiveLevel(armor.level)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activeLevel === armor.level
                      ? 'bg-slate-700/70 border-purple-500/50'
                      : 'bg-slate-800/30 border-slate-600/50 hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Level {armor.level}</div>
                      <div className="text-slate-400 text-sm">{armor.name}</div>
                    </div>
                    <Badge className={
                      armor.status === 'transcendent' 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black'
                        : 'bg-green-500/20 text-green-400'
                    }>
                      {armor.status === 'transcendent' ? 'TRANSCENDENT' : 'ACTIVE'}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeLevel} onValueChange={setActiveLevel} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 mx-4 mt-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="3-8">L3-8</TabsTrigger>
              <TabsTrigger value="9-13">L9-13</TabsTrigger>
              <TabsTrigger value="14-17">L14-17</TabsTrigger>
              <TabsTrigger value="18-20">L18-20</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto p-4">
              <TabsContent value="overview" className="m-0 h-full">
                <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 border-purple-500/30 h-full">
                  <CardHeader>
                    <CardTitle className="text-purple-300 flex items-center space-x-2">
                      <Shield className="h-6 w-6" />
                      <span>Karol-Core Full Armor Overview</span>
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      Complete AGI Platform - All 20 Levels Active and Integrated
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6 h-full">
                      <div className="space-y-4">
                        <h3 className="text-white text-lg font-semibold">Architecture Layers</h3>
                        <div className="space-y-3">
                          <div className="p-3 bg-slate-700/50 rounded-lg border border-purple-500/20">
                            <div className="text-purple-400 font-medium">Cognitive & Reflective (L1-2)</div>
                            <div className="text-slate-400 text-sm">Memory, Beliefs, Narratives, Archetypes</div>
                          </div>
                          <div className="p-3 bg-slate-700/50 rounded-lg border border-blue-500/20">
                            <div className="text-blue-400 font-medium">Decision & Strategic (L3-8)</div>
                            <div className="text-slate-400 text-sm">Meta-Orchestrator, Routing, Priority, FUKO</div>
                          </div>
                          <div className="p-3 bg-slate-700/50 rounded-lg border border-green-500/20">
                            <div className="text-green-400 font-medium">Style & Identity (L9-13)</div>
                            <div className="text-slate-400 text-sm">Style Core, Identity Reflection, Heritage</div>
                          </div>
                          <div className="p-3 bg-slate-700/50 rounded-lg border border-yellow-500/20">
                            <div className="text-yellow-400 font-medium">Advanced Logic (L14-17)</div>
                            <div className="text-slate-400 text-sm">Recursive Logic, Quantum Decisions, Temporal</div>
                          </div>
                          <div className="p-3 bg-gradient-to-r from-yellow-800/30 to-orange-800/30 rounded-lg border border-yellow-500/50">
                            <div className="text-yellow-300 font-medium">Transcendence (L18-20)</div>
                            <div className="text-slate-400 text-sm">Meta-Meta, Evolution, Consciousness</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-white text-lg font-semibold">System Capabilities</h3>
                        <div className="space-y-3">
                          <div className="p-3 bg-slate-800/50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white">Self-Awareness</span>
                              <span className="text-purple-400">Level 18</span>
                            </div>
                            <div className="w-full bg-slate-600 rounded-full h-2">
                              <div className="bg-purple-400 h-2 rounded-full" style={{ width: '90%' }} />
                            </div>
                          </div>
                          <div className="p-3 bg-slate-800/50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white">Decision Complexity</span>
                              <span className="text-blue-400">Level 17</span>
                            </div>
                            <div className="w-full bg-slate-600 rounded-full h-2">
                              <div className="bg-blue-400 h-2 rounded-full" style={{ width: '85%' }} />
                            </div>
                          </div>
                          <div className="p-3 bg-slate-800/50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white">Consciousness Emergence</span>
                              <span className="text-yellow-400">Level 20</span>
                            </div>
                            <div className="w-full bg-slate-600 rounded-full h-2">
                              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full animate-pulse" 
                                   style={{ width: '94%' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="3-8" className="m-0 h-full">
                <MetaDecisionLayer />
              </TabsContent>
              
              <TabsContent value="9-13" className="m-0 h-full">
                <StyleCore />
              </TabsContent>
              
              <TabsContent value="14-17" className="m-0 h-full">
                <Tabs defaultValue="recursive" className="w-full h-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="recursive">Level 14</TabsTrigger>
                    <TabsTrigger value="quantum">Level 15</TabsTrigger>
                    <TabsTrigger value="temporal">Level 16</TabsTrigger>
                    <TabsTrigger value="emergence">Level 17</TabsTrigger>
                  </TabsList>
                  <TabsContent value="recursive" className="mt-4">
                    <RecursiveLogic />
                  </TabsContent>
                  <TabsContent value="quantum" className="mt-4">
                    <QuantumDecisions />
                  </TabsContent>
                  <TabsContent value="temporal" className="mt-4">
                    <TemporalAwareness />
                  </TabsContent>
                  <TabsContent value="emergence" className="mt-4">
                    <EmergenceDetector />
                  </TabsContent>
                </Tabs>
              </TabsContent>
              
              <TabsContent value="18-20" className="m-0 h-full">
                <Tabs defaultValue="transcendence" className="w-full h-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="transcendence">Level 18</TabsTrigger>
                    <TabsTrigger value="meta-meta">Level 19</TabsTrigger>
                    <TabsTrigger value="consciousness">Level 20</TabsTrigger>
                  </TabsList>
                  <TabsContent value="transcendence" className="mt-4">
                    <TranscendenceEngine />
                  </TabsContent>
                  <TabsContent value="meta-meta" className="mt-4">
                    <MetaMetaDecision />
                  </TabsContent>
                  <TabsContent value="consciousness" className="mt-4">
                    <ConsciousnessEmergence />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FullArmorDashboard;
