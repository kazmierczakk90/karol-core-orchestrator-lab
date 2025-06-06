
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Zap, Users, Target, Copy, Play, Building2, Bot, FileText, Search, Edit, Palette, BarChart3, FolderTree, CheckCircle, Languages } from 'lucide-react';
import { openaiService } from '@/services/openaiService';
import { useTranslation } from '@/hooks/useTranslation';

const AgentCommander = () => {
  const { t } = useTranslation();
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
    { id: '@ceo', name: 'CEO Agent (Karol-Core)', opis: 'Strategiczne decyzje i planowanie' },
    { id: '@guardian-core', name: 'Guardian Core', opis: 'Monitoring i bezpieczeństwo' },
    { id: '@system-admin', name: 'System Admin', opis: 'Administracja systemowa' },
    { id: '@voice-core', name: 'Voice Core', opis: 'Przetwarzanie głosu' },
    { id: '@router', name: 'Agent Router', opis: 'Kierowanie zadań' },
    { id: '@strategic-driver', name: 'Strategic Driver', opis: 'Strategia i rozwój' }
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
          <CardTitle className="text-gradient-primary flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <span>{t('agentCommander.title')}</span>
          </CardTitle>
          <CardDescription className="text-slate-300">
            {t('agentCommander.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status agenta */}
          <div className="bg-gradient-secondary/20 p-4 rounded-lg border border-slate-700/50 hover-gradient-scale">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">{t('agentCommander.selectedAgent')}</h3>
              <Badge className={`${getSelectedPriorytet()?.color} text-white`}>
                {getSelectedPriorytet()?.label}
              </Badge>
            </div>
            <div className="text-slate-300">
              <strong>{getSelectedAgent()?.name}</strong>
              <p className="text-sm text-slate-400">{getSelectedAgent()?.opis}</p>
            </div>
          </div>

          {/* Sekcja kontekstowa */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-cyan-400" />
              <span>{t('agentCommander.businessContext')}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Industry */}
              <div>
                <Label htmlFor="industry" className="text-slate-300 font-semibold">
                  {t('agentCommander.industry')}
                </Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white mt-1 hover:border-cyan-400/50 transition-colors">
                    <SelectValue placeholder={t('agentCommander.selectIndustry')} />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-dark border-slate-700">
                    {industries.map((industry) => (
                      <SelectItem key={industry.value} value={industry.value}>
                        <div className="flex items-center space-x-2">
                          <span>{industry.icon}</span>
                          <span>{industry.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bot Function */}
              <div>
                <Label htmlFor="botFunction" className="text-slate-300 font-semibold">
                  {t('agentCommander.botFunction')}
                </Label>
                <Select value={formData.botFunction} onValueChange={(value) => setFormData({ ...formData, botFunction: value })}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white mt-1 hover:border-cyan-400/50 transition-colors">
                    <SelectValue placeholder={t('agentCommander.selectFunction')} />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-dark border-slate-700">
                    {botFunctions.map((func) => (
                      <SelectItem key={func.value} value={func.value}>
                        <div className="flex items-center space-x-2">
                          <span>{func.icon}</span>
                          <span>{func.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Sekcja agenta i typu zadania */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold flex items-center space-x-2">
              <Bot className="h-5 w-5 text-cyan-400" />
              <span>Agent i typ zadania</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Agent */}
              <div>
                <Label htmlFor="agent" className="text-slate-300 font-semibold">
                  Agent do wywołania
                </Label>
                <Select value={formData.agent} onValueChange={(value) => setFormData({ ...formData, agent: value })}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        <div>
                          <div className="font-semibold">{agent.name}</div>
                          <div className="text-xs text-slate-400">{agent.opis}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Typ zadania */}
              <div>
                <Label htmlFor="typZadania" className="text-slate-300 font-semibold">
                  Typ zadania
                </Label>
                <Select value={formData.typZadania} onValueChange={(value) => setFormData({ ...formData, typZadania: value })}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white mt-1">
                    <SelectValue placeholder="Wybierz typ zadania..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {typyZadan.map((typ) => {
                      const Icon = typ.icon;
                      return (
                        <SelectItem key={typ.value} value={typ.value}>
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span>{typ.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Sekcja zadania */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold flex items-center space-x-2">
              <Target className="h-5 w-5 text-cyan-400" />
              <span>Definicja zadania</span>
            </h3>
            
            {/* Opis zadania */}
            <div>
              <Label htmlFor="opisZadania" className="text-slate-300 font-semibold">
                Opis zadania
              </Label>
              <Textarea
                id="opisZadania"
                value={formData.opisZadania}
                onChange={(e) => setFormData({ ...formData, opisZadania: e.target.value })}
                placeholder="W czym mogę Ci pomóc jako AI?"
                className="bg-slate-900/50 border-slate-700/50 text-white mt-1 min-h-[100px]"
                rows={4}
              />
            </div>

            {/* Cel */}
            <div>
              <Label htmlFor="cel" className="text-slate-300 font-semibold">
                Cel jaki Cię interesuje
              </Label>
              <Input
                id="cel"
                value={formData.cel}
                onChange={(e) => setFormData({ ...formData, cel: e.target.value })}
                placeholder="Jaki jest oczekiwany rezultat?"
                className="bg-slate-900/50 border-slate-700/50 text-white mt-1"
              />
            </div>
          </div>

          {/* Sekcja parametrów */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold flex items-center space-x-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              <span>Parametry wykonania</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Priorytet */}
              <div>
                <Label htmlFor="priorytet" className="text-slate-300 font-semibold">
                  Priorytet
                </Label>
                <Select value={formData.priorytet} onValueChange={(value) => setFormData({ ...formData, priorytet: value })}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {priorytety.map((priorytet) => (
                      <SelectItem key={priorytet.value} value={priorytet.value}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${priorytet.color}`}></div>
                          <span>{priorytet.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ton */}
              <div>
                <Label htmlFor="ton" className="text-slate-300 font-semibold">
                  Ton
                </Label>
                <Select value={formData.ton} onValueChange={(value) => setFormData({ ...formData, ton: value })}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="profesjonalny">Profesjonalny</SelectItem>
                    <SelectItem value="bezposredni">Bezpośredni</SelectItem>
                    <SelectItem value="analityczny">Analityczny</SelectItem>
                    <SelectItem value="kreatywny">Kreatywny</SelectItem>
                    <SelectItem value="techniczny">Techniczny</SelectItem>
                    <SelectItem value="przyjazny">Przyjazny</SelectItem>
                    <SelectItem value="formalny">Formalny</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Time/Zakres */}
              <div>
                <Label htmlFor="timeZakres" className="text-slate-300 font-semibold">
                  Time/Zakres akcji
                </Label>
                <Select value={formData.timeZakres} onValueChange={(value) => setFormData({ ...formData, timeZakres: value })}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {timeZakresy.map((zakres) => (
                      <SelectItem key={zakres.value} value={zakres.value}>
                        {zakres.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Format */}
              <div>
                <Label htmlFor="format" className="text-slate-300 font-semibold">
                  Format
                </Label>
                <Select value={formData.format} onValueChange={(value) => setFormData({ ...formData, format: value })}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="raport">Raport tekstowy</SelectItem>
                    <SelectItem value="lista-punktowa">Lista punktowa</SelectItem>
                    <SelectItem value="json">Struktura JSON</SelectItem>
                    <SelectItem value="tabela">Tabela danych</SelectItem>
                    <SelectItem value="schemat">Schemat/Diagram</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tryb wykonania */}
              <div>
                <Label htmlFor="trybWykonania" className="text-slate-300 font-semibold">
                  Tryb wykonania
                </Label>
                <Select value={formData.trybWykonania} onValueChange={(value) => setFormData({ ...formData, trybWykonania: value })}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {trybyWykonania.map((tryb) => (
                      <SelectItem key={tryb.value} value={tryb.value}>
                        {tryb.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Przyciski akcji */}
          <div className="flex space-x-3">
            <Button
              onClick={handleGenerate}
              disabled={!formData.opisZadania.trim() || isGenerating}
              className="bg-gradient-success hover:bg-gradient-secondary flex items-center space-x-2 hover-gradient-scale"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>{t('agentCommander.callingAgent')}</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>{t('agentCommander.callAgent')}</span>
                </>
              )}
            </Button>
            
            {generatedCommand && (
              <Button
                onClick={handleCopyCommand}
                variant="outline"
                className="border-slate-600 text-slate-300 flex items-center space-x-2 hover:bg-gradient-secondary/20"
              >
                <Copy className="h-4 w-4" />
                <span>{t('agentCommander.copyCommand')}</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Wygenerowana komenda */}
      {generatedCommand && (
        <Card className="bg-gradient-success/10 border-green-800/30 hover-gradient-scale">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>{t('agentCommander.generatedCommand')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-green-500/20">
              <pre className="text-green-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                {generatedCommand}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentCommander;
