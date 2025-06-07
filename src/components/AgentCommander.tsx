
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Target, FileText, Search, Edit, Palette, BarChart3, FolderTree, CheckCircle, Languages, TestTube, Play, Filter, Download } from 'lucide-react';
import { openaiService } from '@/services/openaiService';
import { autoImprovementService } from '@/services/autoImprovementService';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from '@/components/ui/sonner';
import AgentSimulator from './commander/AgentSimulator';
import AgentCatalog from './commander/AgentCatalog';
import CommanderTestEnvironment from './commander/CommanderTestEnvironment';

const AgentCommander = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('test');
  
  const [formData, setFormData] = useState({
    industry: '',
    botFunction: '',
    typZadania: '',
    opisZadania: '',
    cel: '',
    agent: '@ceo',
    priorytet: 'normalny',
    ton: 'profesjonalny',
    timeZakres: 'standardowa-praca',
    format: 'raport',
    trybWykonania: 'natychmiastowy'
  });

  const [generatedCommand, setGeneratedCommand] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [testMode, setTestMode] = useState(true);
  const [simulationResults, setSimulationResults] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  const industries = [
    { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
    { value: 'finance', label: 'Finance', icon: '💰' },
    { value: 'retail', label: 'Retail', icon: '🛍️' },
    { value: 'technology', label: 'Technology', icon: '💻' },
    { value: 'education', label: 'Education', icon: '📚' },
    { value: 'hospitality', label: 'Hospitality', icon: '🏨' },
    { value: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
    { value: 'insurance', label: 'Insurance', icon: '🛡️' },
    { value: 'telecommunications', label: 'Telecommunications', icon: '📡' },
    { value: 'real-estate', label: 'Real Estate', icon: '🏘️' },
    { value: 'other', label: 'Other', icon: '📋' }
  ];

  const botFunctions = [
    { value: 'customer-service', label: 'Customer Service', icon: '🎧' },
    { value: 'sales-marketing', label: 'Sales & Marketing', icon: '📈' },
    { value: 'technical-support', label: 'Technical Support', icon: '🔧' },
    { value: 'it-helpdesk', label: 'IT Helpdesk', icon: '💻' },
    { value: 'lead-generation', label: 'Lead Generation', icon: '🎯' },
    { value: 'appointment-booking', label: 'Appointment Booking', icon: '📅' },
    { value: 'faq', label: 'FAQ', icon: '❓' },
    { value: 'customer-onboarding', label: 'Customer Onboarding', icon: '👋' },
    { value: 'billing-payments', label: 'Billing & Payments', icon: '💳' },
    { value: 'feedback-collection', label: 'Feedback Collection', icon: '📝' },
    { value: 'other', label: 'Other', icon: '⚙️' }
  ];

  const typyZadan = [
    { value: 'napisz', label: 'Napisz (content creation)', icon: FileText },
    { value: 'poszukaj', label: 'Poszukaj w sieci (web research)', icon: Search },
    { value: 'zredaguj', label: 'Zredaguj (editing)', icon: Edit },
    { value: 'wykreuj', label: 'Wykreuj (creative design)', icon: Palette },
    { value: 'przeanalizuj', label: 'Przeanalizuj (analysis)', icon: BarChart3 },
    { value: 'zorganizuj', label: 'Zorganizuj (organization)', icon: FolderTree },
    { value: 'sprawdz', label: 'Sprawdź (verification)', icon: CheckCircle },
    { value: 'przetlumacz', label: 'Przetłumacz (translation)', icon: Languages }
  ];

  const agents = [
    { id: '@ceo', name: 'CEO Agent (Karol-Core)', opis: 'Strategiczne decyzje i planowanie', tags: ['strategy', 'leadership', 'planning'], status: 'active', performance: 95 },
    { id: '@guardian-core', name: 'Guardian Core', opis: 'Monitoring i bezpieczeństwo', tags: ['security', 'monitoring', 'protection'], status: 'active', performance: 92 },
    { id: '@system-admin', name: 'System Admin', opis: 'Administracja systemowa', tags: ['admin', 'system', 'maintenance'], status: 'active', performance: 88 },
    { id: '@voice-core', name: 'Voice Core', opis: 'Przetwarzanie głosu', tags: ['voice', 'speech', 'audio'], status: 'standby', performance: 85 },
    { id: '@router', name: 'Agent Router', opis: 'Kierowanie zadań', tags: ['routing', 'task-management', 'coordination'], status: 'active', performance: 90 },
    { id: '@strategic-driver', name: 'Strategic Driver', opis: 'Strategia i rozwój', tags: ['strategy', 'development', 'growth'], status: 'active', performance: 87 }
  ];

  const timeZakresy = [
    { value: 'szybka-akcja', label: t('agentCommander.timeScopes.quickAction') },
    { value: 'standardowa-praca', label: t('agentCommander.timeScopes.standardWork') },
    { value: 'gleboka-analiza', label: t('agentCommander.timeScopes.deepAnalysis') },
    { value: 'projekt-dlugoterminowy', label: t('agentCommander.timeScopes.longTermProject') }
  ];

  const trybyWykonania = [
    { value: 'natychmiastowy', label: t('agentCommander.executionModes.immediate') },
    { value: 'zaplanowany', label: t('agentCommander.executionModes.scheduled') },
    { value: 'analityczny', label: t('agentCommander.executionModes.analytical') },
    { value: 'eksploracyjny', label: t('agentCommander.executionModes.exploratory') }
  ];

  // Connect to auto-improvement service
  useEffect(() => {
    autoImprovementService.trackEvent({
      eventType: 'action',
      context: 'Agent Commander accessed',
      details: {
        success: true,
        timestamp: new Date(),
        component: 'AgentCommander'
      }
    });
  }, []);

  const handleSimulate = async () => {
    setIsGenerating(true);
    
    // Track simulation start
    autoImprovementService.trackEvent({
      eventType: 'command',
      context: `Agent simulation: ${formData.agent}`,
      details: {
        success: true,
        agent: formData.agent,
        task: formData.opisZadania,
        priority: formData.priorytet
      },
      agentId: formData.agent
    });
    
    // Enhanced simulation with realistic metrics
    const executionTime = Math.random() * 5000 + 1000;
    const selectedAgentData = agents.find(a => a.id === formData.agent);
    
    const mockResponse = {
      agentId: formData.agent,
      task: formData.opisZadania,
      response: `Enhanced simulation response from ${formData.agent}:\n\nTask Analysis:\n- Priority: ${formData.priorytet}\n- Context: ${formData.industry || 'General'}\n- Function: ${formData.botFunction || 'Multi-purpose'}\n\nExecution Details:\n- Tone: ${formData.ton}\n- Format: ${formData.format}\n- Time Scope: ${formData.timeZakres}\n\nResult: Task completed successfully with ${selectedAgentData?.performance}% efficiency in simulation mode.\n\nRecommendations:\n- Consider scheduling follow-up review\n- Monitor performance metrics\n- Document learnings for future optimization`,
      timestamp: new Date(),
      status: 'completed',
      executionTime,
      performance: selectedAgentData?.performance || 85,
      metrics: {
        efficiency: selectedAgentData?.performance || 85,
        accuracy: Math.random() * 20 + 80,
        speed: Math.random() * 30 + 70
      }
    };

    setTimeout(() => {
      setSimulationResults(prev => [mockResponse, ...prev]);
      setIsGenerating(false);
      toast.success('Enhanced simulation completed!', {
        description: `Agent ${formData.agent} responded with ${mockResponse.performance}% efficiency`,
      });
    }, 2000);
  };

  const handleExportToDatabase = () => {
    const exportData = {
      command: generatedCommand,
      formData,
      simulationResults,
      exportDate: new Date(),
      id: `cmd_${Date.now()}`,
      metrics: {
        totalSimulations: simulationResults.length,
        averagePerformance: simulationResults.reduce((acc, r) => acc + (r.performance || 0), 0) / (simulationResults.length || 1),
        mostUsedAgent: formData.agent
      }
    };
    
    // Enhanced export with metrics tracking
    console.log('Enhanced export to database:', exportData);
    localStorage.setItem(`agent_command_${exportData.id}`, JSON.stringify(exportData));
    
    // Track export event
    autoImprovementService.trackEvent({
      eventType: 'action',
      context: 'Command configuration exported',
      details: {
        success: true,
        exportId: exportData.id,
        simulationCount: simulationResults.length
      }
    });
    
    toast.success('Configuration exported successfully!', {
      description: `Command saved with ID: ${exportData.id}`,
    });
  };

  const handleUseAgent = (agent: any) => {
    setFormData(prev => ({ ...prev, agent: agent.id }));
    setSelectedAgent(agent);
    setActiveTab('test');
    
    toast.success('Agent selected!', {
      description: `${agent.name} is now configured for your task`,
    });
  };

  const handleAgentDetails = (agent: any) => {
    setSelectedAgent(agent);
    // Could open a modal or navigate to details view
    console.log('Agent details:', agent);
  };

  const handleDeleteAgent = (agent: any) => {
    // Implementation for agent deletion
    console.log('Delete agent:', agent);
    toast.error('Agent deletion not implemented in demo mode');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-dark border-cyan-800/30 hover-gradient-scale">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gradient-primary flex items-center space-x-2">
                <Users className="h-6 w-6" />
                <span>Agent Commander - Enhanced Control Center</span>
              </CardTitle>
              <CardDescription className="text-slate-300">
                Advanced testing, simulation, and management environment for AI agents
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={testMode ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                {testMode ? 'TEST MODE' : 'LIVE MODE'}
              </Badge>
              <Button
                onClick={() => setTestMode(!testMode)}
                className="bg-gradient-secondary hover:bg-gradient-primary"
              >
                <TestTube className="h-4 w-4 mr-2" />
                {testMode ? 'Switch to Live' : 'Switch to Test'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-gradient-dark border border-cyan-800/30">
              <TabsTrigger value="test" className="flex items-center space-x-2">
                <TestTube className="h-4 w-4" />
                <span>Test Environment</span>
              </TabsTrigger>
              <TabsTrigger value="catalog" className="flex items-center space-x-2">
                <FolderTree className="h-4 w-4" />
                <span>Agent Catalog</span>
              </TabsTrigger>
              <TabsTrigger value="simulator" className="flex items-center space-x-2">
                <Play className="h-4 w-4" />
                <span>Simulator</span>
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Results</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="test" className="mt-6">
              <CommanderTestEnvironment
                formData={formData}
                setFormData={setFormData}
                agents={agents}
                industries={industries}
                botFunctions={botFunctions}
                typyZadan={typyZadan}
                timeZakresy={timeZakresy}
                trybyWykonania={trybyWykonania}
                onSimulate={handleSimulate}
                onExport={handleExportToDatabase}
                isGenerating={isGenerating}
                testMode={testMode}
              />
            </TabsContent>

            <TabsContent value="catalog" className="mt-6">
              <AgentCatalog 
                agents={agents}
                onUseAgent={handleUseAgent}
                onAgentDetails={handleAgentDetails}
                onDeleteAgent={handleDeleteAgent}
              />
            </TabsContent>

            <TabsContent value="simulator" className="mt-6">
              <AgentSimulator 
                simulationResults={simulationResults}
                onClearResults={() => setSimulationResults([])}
              />
            </TabsContent>

            <TabsContent value="results" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Enhanced Simulation Results</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="border-slate-600">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" className="border-slate-600">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                
                {simulationResults.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <TestTube className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No simulation results yet</p>
                    <p className="text-sm">Run some tests to see enhanced results here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {simulationResults.map((result, index) => (
                      <Card key={index} className="bg-slate-800/50 border-slate-700/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-500/20 text-green-400">
                                {result.agentId}
                              </Badge>
                              <Badge className="bg-blue-500/20 text-blue-400">
                                {result.performance}% Performance
                              </Badge>
                            </div>
                            <span className="text-slate-400 text-sm">
                              {result.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-white text-sm mb-2">{result.task}</p>
                          <div className="bg-slate-900/50 p-3 rounded border-l-4 border-cyan-400">
                            <p className="text-slate-300 text-xs whitespace-pre-wrap">{result.response}</p>
                          </div>
                          {result.metrics && (
                            <div className="mt-3 grid grid-cols-3 gap-4 text-xs">
                              <div className="text-center">
                                <div className="text-cyan-400 font-semibold">{result.metrics.efficiency.toFixed(1)}%</div>
                                <div className="text-slate-400">Efficiency</div>
                              </div>
                              <div className="text-center">
                                <div className="text-green-400 font-semibold">{result.metrics.accuracy.toFixed(1)}%</div>
                                <div className="text-slate-400">Accuracy</div>
                              </div>
                              <div className="text-center">
                                <div className="text-yellow-400 font-semibold">{result.metrics.speed.toFixed(1)}%</div>
                                <div className="text-slate-400">Speed</div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentCommander;
