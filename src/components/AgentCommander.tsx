import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Users, Target, Copy, Play, Building2, Bot, FileText, Search, Edit, Palette, BarChart3, FolderTree, CheckCircle, Languages, Save, Download, Settings, Filter, Trash2, Plus, TestTube } from 'lucide-react';
import { openaiService } from '@/services/openaiService';
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
    { id: '@ceo', name: 'CEO Agent (Karol-Core)', opis: 'Strategiczne decyzje i planowanie', tags: ['strategy', 'leadership', 'planning'] },
    { id: '@guardian-core', name: 'Guardian Core', opis: 'Monitoring i bezpieczeństwo', tags: ['security', 'monitoring', 'protection'] },
    { id: '@system-admin', name: 'System Admin', opis: 'Administracja systemowa', tags: ['admin', 'system', 'maintenance'] },
    { id: '@voice-core', name: 'Voice Core', opis: 'Przetwarzanie głosu', tags: ['voice', 'speech', 'audio'] },
    { id: '@router', name: 'Agent Router', opis: 'Kierowanie zadań', tags: ['routing', 'task-management', 'coordination'] },
    { id: '@strategic-driver', name: 'Strategic Driver', opis: 'Strategia i rozwój', tags: ['strategy', 'development', 'growth'] }
  ];

  const priorytety = [
    { value: 'krytyczny', label: t('agentCommander.priorities.critical'), color: 'bg-gradient-error' },
    { value: 'wysoki', label: t('agentCommander.priorities.high'), color: 'bg-gradient-warning' },
    { value: 'normalny', label: t('agentCommander.priorities.normal'), color: 'bg-gradient-info' },
    { value: 'niski', label: t('agentCommander.priorities.low'), color: 'bg-gray-500' }
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

  const handleSimulate = async () => {
    setIsGenerating(true);
    
    // Simulate agent response
    const mockResponse = {
      agentId: formData.agent,
      task: formData.opisZadania,
      response: `Symulowana odpowiedź agenta ${formData.agent}:\n\nZadanie zostało przetworzone zgodnie z parametrami:\n- Priorytet: ${formData.priorytet}\n- Ton: ${formData.ton}\n- Format: ${formData.format}\n\nWynik: Zadanie wykonane pomyślnie w trybie symulacji.`,
      timestamp: new Date(),
      status: 'completed',
      executionTime: Math.random() * 5000 + 1000
    };

    setTimeout(() => {
      setSimulationResults(prev => [mockResponse, ...prev]);
      setIsGenerating(false);
      toast.success('Symulacja zakończona!', {
        description: `Agent ${formData.agent} odpowiedział w trybie testowym`,
      });
    }, 2000);
  };

  const handleExportToDatabase = () => {
    const exportData = {
      command: generatedCommand,
      formData,
      simulationResults,
      exportDate: new Date(),
      id: `cmd_${Date.now()}`
    };
    
    // Mock export to database
    console.log('Eksportowanie do bazy danych:', exportData);
    localStorage.setItem(`agent_command_${exportData.id}`, JSON.stringify(exportData));
    
    toast.success('Wyeksportowano do bazy danych!', {
      description: `Komenda zapisana z ID: ${exportData.id}`,
    });
  };

  const handleGenerate = async () => {
    if (!formData.opisZadania.trim()) return;

    setIsGenerating(true);
    
    const selectedAgent = agents.find(a => a.id === formData.agent);
    const selectedPriorytet = priorytety.find(p => p.value === formData.priorytet);
    const selectedIndustry = industries.find(i => i.value === formData.industry);
    const selectedBotFunction = botFunctions.find(b => b.value === formData.botFunction);
    const selectedTypZadania = typyZadan.find(t => t.value === formData.typZadania);
    const selectedTimeZakres = timeZakresy.find(t => t.value === formData.timeZakres);
    
    const command = `
🎯 KOMENDA AGENTA: ${selectedAgent?.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 KONTEKST BIZNESOWY:
${formData.industry ? `🏢 Branża: ${selectedIndustry?.icon} ${selectedIndustry?.label}` : ''}
${formData.botFunction ? `🤖 Funkcja Bota: ${selectedBotFunction?.icon} ${selectedBotFunction?.label}` : ''}

📋 ZADANIE: ${formData.typZadania ? `${selectedTypZadania?.label}` : 'Wykonanie zadania'}

📝 OPIS: ${formData.opisZadania}

🎯 CEL: ${formData.cel || 'Wykonanie zadania zgodnie z instrukcjami'}

⚡ PRIORYTET: ${selectedPriorytet?.label}
⏱️ TIME/ZAKRES: ${selectedTimeZakres?.label}
🗣️ TON: ${formData.ton}
🔄 TRYB WYKONANIA: ${trybyWykonania.find(t => t.value === formData.trybWykonania)?.label}
📝 FORMAT: ${formData.format}

🚀 AKTYWACJA: NATYCHMIAST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agent ${formData.agent} - GOTOWY DO AKCJI!
    `.trim();

    setGeneratedCommand(command);

    try {
      await openaiService.sendMessage(
        `${formData.opisZadania}\n\nCel: ${formData.cel}\nTryb: ${formData.trybWykonania}\nPriorytet: ${formData.priorytet}`,
        formData.agent
      );
    } catch (error) {
      console.error('Error sending command to agent:', error);
    }

    setIsGenerating(false);
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(generatedCommand);
  };

  const getSelectedAgent = () => agents.find(a => a.id === formData.agent);
  const getSelectedPriorytet = () => priorytety.find(p => p.value === formData.priorytet);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-dark border-cyan-800/30 hover-gradient-scale">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gradient-primary flex items-center space-x-2">
                <Users className="h-6 w-6" />
                <span>Agent Commander - Test Environment</span>
              </CardTitle>
              <CardDescription className="text-slate-300">
                Środowisko testów, symulacji i zarządzania agentami
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
                onSimulate={handleSimulate}
                onExport={handleExportToDatabase}
                isGenerating={isGenerating}
                testMode={testMode}
              />
            </TabsContent>

            <TabsContent value="catalog" className="mt-6">
              <AgentCatalog agents={agents} />
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
                  <h3 className="text-xl font-semibold text-white">Simulation Results</h3>
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
                    <p className="text-sm">Run some tests to see results here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {simulationResults.map((result, index) => (
                      <Card key={index} className="bg-slate-800/50 border-slate-700/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-green-500/20 text-green-400">
                              {result.agentId}
                            </Badge>
                            <span className="text-slate-400 text-sm">
                              {result.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-white text-sm mb-2">{result.task}</p>
                          <p className="text-slate-300 text-xs">{result.response}</p>
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
