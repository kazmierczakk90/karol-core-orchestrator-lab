
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Zap, Users, Target, Copy, Play } from 'lucide-react';
import { openaiService } from '@/services/openaiService';

const AgentCommander = () => {
  const [formData, setFormData] = useState({
    zadanie: '',
    cel: '',
    agent: '@ceo',
    priorytet: 'normalny',
    tryb: 'natychmiastowy',
    ton: 'profesjonalny',
    zakres: 'pojedyncza-akcja',
    format: 'raport'
  });

  const [generatedCommand, setGeneratedCommand] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const agents = [
    { id: '@ceo', name: 'CEO Agent (Karol-Core)', opis: 'Strategiczne decyzje i planowanie' },
    { id: '@guardian-core', name: 'Guardian Core', opis: 'Monitoring i bezpieczeństwo' },
    { id: '@system-admin', name: 'System Admin', opis: 'Administracja systemowa' },
    { id: '@voice-core', name: 'Voice Core', opis: 'Przetwarzanie głosu' },
    { id: '@router', name: 'Agent Router', opis: 'Kierowanie zadań' },
    { id: '@strategic-driver', name: 'Strategic Driver', opis: 'Strategia i rozwój' }
  ];

  const priorytety = [
    { value: 'krytyczny', label: 'Krytyczny (RED ALERT)', color: 'bg-red-500' },
    { value: 'wysoki', label: 'Wysoki (HIGH)', color: 'bg-orange-500' },
    { value: 'normalny', label: 'Normalny (STANDARD)', color: 'bg-blue-500' },
    { value: 'niski', label: 'Niski (LOW)', color: 'bg-gray-500' }
  ];

  const tryby = [
    { value: 'natychmiastowy', label: 'Natychmiastowy (LIVE)' },
    { value: 'zaplanowany', label: 'Zaplanowany (SCHEDULED)' },
    { value: 'analityczny', label: 'Analityczny (DEEP)' },
    { value: 'eksploracyjny', label: 'Eksploracyjny (SCOUT)' }
  ];

  const handleGenerate = async () => {
    if (!formData.zadanie.trim()) return;

    setIsGenerating(true);
    
    const selectedAgent = agents.find(a => a.id === formData.agent);
    const selectedPriorytet = priorytety.find(p => p.value === formData.priorytet);
    
    const command = `
🎯 KOMENDA AGENTA: ${selectedAgent?.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 ZADANIE: ${formData.zadanie}

🎯 CEL: ${formData.cel || 'Wykonanie zadania zgodnie z instrukcjami'}

⚡ PRIORYTET: ${selectedPriorytet?.label}
🔄 TRYB: ${tryby.find(t => t.value === formData.tryb)?.label}
🗣️ TON: ${formData.ton}
📊 ZAKRES: ${formData.zakres}
📝 FORMAT: ${formData.format}

🚀 AKTYWACJA: NATYCHMIAST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agent ${formData.agent} - GOTOWY DO AKCJI!
    `.trim();

    setGeneratedCommand(command);

    try {
      // Wysłanie rzeczywistej komendy do agenta
      await openaiService.sendMessage(
        `${formData.zadanie}\n\nCel: ${formData.cel}\nTryb: ${formData.tryb}\nPriorytet: ${formData.priorytet}`,
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
      <Card className="bg-slate-800/50 border-cyan-800/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <span>Generator Komend Agentów AI</span>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Centrum dowodzenia - wywoływanie agentów do konkretnych akcji jak żołnierzy w misji
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status agenta */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">Wybrany Agent</h3>
              <Badge className={`${getSelectedPriorytet()?.color} text-white`}>
                {getSelectedPriorytet()?.label}
              </Badge>
            </div>
            <div className="text-slate-300">
              <strong>{getSelectedAgent()?.name}</strong>
              <p className="text-sm text-slate-400">{getSelectedAgent()?.opis}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Zadanie */}
            <div className="md:col-span-2">
              <Label htmlFor="zadanie" className="text-slate-300 font-semibold">
                Zadanie do wykonania
              </Label>
              <Input
                id="zadanie"
                value={formData.zadanie}
                onChange={(e) => setFormData({ ...formData, zadanie: e.target.value })}
                placeholder="Opisz konkretne zadanie dla agenta..."
                className="bg-slate-900/50 border-slate-700/50 text-white mt-1"
              />
            </div>

            {/* Cel */}
            <div className="md:col-span-2">
              <Label htmlFor="cel" className="text-slate-300 font-semibold">
                Cel końcowy
              </Label>
              <Input
                id="cel"
                value={formData.cel}
                onChange={(e) => setFormData({ ...formData, cel: e.target.value })}
                placeholder="Jaki jest oczekiwany rezultat?"
                className="bg-slate-900/50 border-slate-700/50 text-white mt-1"
              />
            </div>

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

            {/* Priorytet */}
            <div>
              <Label htmlFor="priorytet" className="text-slate-300 font-semibold">
                Priorytet misji
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

            {/* Tryb */}
            <div>
              <Label htmlFor="tryb" className="text-slate-300 font-semibold">
                Tryb operacyjny
              </Label>
              <Select value={formData.tryb} onValueChange={(value) => setFormData({ ...formData, tryb: value })}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {tryby.map((tryb) => (
                    <SelectItem key={tryb.value} value={tryb.value}>
                      {tryb.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ton */}
            <div>
              <Label htmlFor="ton" className="text-slate-300 font-semibold">
                Ton komunikacji
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
                </SelectContent>
              </Select>
            </div>

            {/* Zakres */}
            <div>
              <Label htmlFor="zakres" className="text-slate-300 font-semibold">
                Zakres akcji
              </Label>
              <Select value={formData.zakres} onValueChange={(value) => setFormData({ ...formData, zakres: value })}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="pojedyncza-akcja">Pojedyncza akcja</SelectItem>
                  <SelectItem value="sekwencja-zadan">Sekwencja zadań</SelectItem>
                  <SelectItem value="projekt-dlugookresowy">Projekt długookresowy</SelectItem>
                  <SelectItem value="wspolpraca-agentow">Współpraca agentów</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Format */}
            <div>
              <Label htmlFor="format" className="text-slate-300 font-semibold">
                Format wyniku
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
          </div>

          {/* Przyciski akcji */}
          <div className="flex space-x-3">
            <Button
              onClick={handleGenerate}
              disabled={!formData.zadanie.trim() || isGenerating}
              className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Wywołuję agenta...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Wywołaj agenta do akcji</span>
                </>
              )}
            </Button>
            
            {generatedCommand && (
              <Button
                onClick={handleCopyCommand}
                variant="outline"
                className="border-slate-600 text-slate-300 flex items-center space-x-2"
              >
                <Copy className="h-4 w-4" />
                <span>Skopiuj komendę</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Wygenerowana komenda */}
      {generatedCommand && (
        <Card className="bg-slate-900/50 border-green-800/30">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Wygenerowana komenda agenta</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-800/50 p-4 rounded-lg">
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
