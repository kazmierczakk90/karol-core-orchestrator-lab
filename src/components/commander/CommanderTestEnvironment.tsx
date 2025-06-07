
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Save, Download, TestTube, Settings, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface CommanderTestEnvironmentProps {
  formData: any;
  setFormData: (data: any) => void;
  agents: Array<{id: string, name: string, opis: string, tags: string[]}>;
  industries: Array<{value: string, label: string, icon: string}>;
  onSimulate: () => void;
  onExport: () => void;
  isGenerating: boolean;
  testMode: boolean;
  botFunctions?: Array<{value: string, label: string, icon: string}>;
  typyZadan?: Array<{value: string, label: string, icon: any}>;
  timeZakresy?: Array<{value: string, label: string}>;
  trybyWykonania?: Array<{value: string, label: string}>;
}

const CommanderTestEnvironment = ({
  formData,
  setFormData,
  agents,
  industries,
  onSimulate,
  onExport,
  isGenerating,
  testMode,
  botFunctions = [],
  typyZadan = [],
  timeZakresy = [],
  trybyWykonania = []
}: CommanderTestEnvironmentProps) => {
  const [zoomLevel, setZoomLevel] = useState(100);

  const priorytety = [
    { value: 'krytyczny', label: 'Critical', color: 'bg-red-500' },
    { value: 'wysoki', label: 'High', color: 'bg-orange-500' },
    { value: 'normalny', label: 'Normal', color: 'bg-blue-500' },
    { value: 'niski', label: 'Low', color: 'bg-gray-500' }
  ];

  const tonyOdpowiedzi = [
    { value: 'profesjonalny', label: 'Professional' },
    { value: 'bezposredni', label: 'Direct' },
    { value: 'analityczny', label: 'Analytical' },
    { value: 'kreatywny', label: 'Creative' },
    { value: 'techniczny', label: 'Technical' },
    { value: 'przyjazny', label: 'Friendly' }
  ];

  const formatyWyjscia = [
    { value: 'raport', label: 'Text Report' },
    { value: 'lista-punktowa', label: 'Bullet Points' },
    { value: 'json', label: 'JSON Structure' },
    { value: 'tabela', label: 'Data Table' },
    { value: 'schemat', label: 'Diagram/Schema' }
  ];

  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value[0]);
  };

  const resetZoom = () => setZoomLevel(100);

  return (
    <div 
      className="space-y-6 transition-all duration-300"
      style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
    >
      {/* Zoom Controls */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>View Controls</span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ZoomOut className="h-4 w-4 text-slate-400" />
                <Slider
                  value={[zoomLevel]}
                  onValueChange={handleZoomChange}
                  min={50}
                  max={150}
                  step={10}
                  className="w-32"
                />
                <ZoomIn className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300 text-sm w-12">{zoomLevel}%</span>
              </div>
              <Button onClick={resetZoom} size="sm" variant="outline" className="border-slate-600">
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Context & Industry Selection */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-cyan-400">Business Context</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="industry" className="text-slate-300 font-semibold">
                Industry
              </Label>
              <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white mt-1">
                  <SelectValue placeholder="Select industry..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
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

            <div>
              <Label htmlFor="botFunction" className="text-slate-300 font-semibold">
                Bot Function
              </Label>
              <Select value={formData.botFunction} onValueChange={(value) => setFormData({ ...formData, botFunction: value })}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white mt-1">
                  <SelectValue placeholder="Select function..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
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

          <div>
            <Label htmlFor="typZadania" className="text-slate-300 font-semibold">
              Task Type
            </Label>
            <Select value={formData.typZadania} onValueChange={(value) => setFormData({ ...formData, typZadania: value })}>
              <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white mt-1">
                <SelectValue placeholder="Select task type..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {typyZadan.map((typ) => (
                  <SelectItem key={typ.value} value={typ.value}>
                    <div className="flex items-center space-x-2">
                      <typ.icon className="h-4 w-4" />
                      <span>{typ.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Agent Configuration */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Agent Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agent" className="text-slate-300 font-semibold">
                Select Agent
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
                        <div className="flex flex-wrap gap-1 mt-1">
                          {agent.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} className="bg-slate-600/50 text-slate-300 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priorytet" className="text-slate-300 font-semibold">
                Priority Level
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
          </div>
        </CardContent>
      </Card>

      {/* Task Definition */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-cyan-400">Task Definition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="opisZadania" className="text-slate-300 font-semibold">
              Task Description
            </Label>
            <Textarea
              id="opisZadania"
              value={formData.opisZadania}
              onChange={(e) => setFormData({ ...formData, opisZadania: e.target.value })}
              placeholder="Describe the task for the AI agent..."
              className="bg-slate-900/50 border-slate-700/50 text-white mt-1 min-h-[120px]"
              rows={5}
            />
          </div>

          <div>
            <Label htmlFor="cel" className="text-slate-300 font-semibold">
              Expected Goal
            </Label>
            <Input
              id="cel"
              value={formData.cel}
              onChange={(e) => setFormData({ ...formData, cel: e.target.value })}
              placeholder="What is the expected result?"
              className="bg-slate-900/50 border-slate-700/50 text-white mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="ton" className="text-slate-300 font-semibold">
                Response Tone
              </Label>
              <Select value={formData.ton} onValueChange={(value) => setFormData({ ...formData, ton: value })}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {tonyOdpowiedzi.map((ton) => (
                    <SelectItem key={ton.value} value={ton.value}>
                      {ton.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="format" className="text-slate-300 font-semibold">
                Output Format
              </Label>
              <Select value={formData.format} onValueChange={(value) => setFormData({ ...formData, format: value })}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {formatyWyjscia.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timeZakres" className="text-slate-300 font-semibold">
                Time Scope
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
          </div>

          <div>
            <Label htmlFor="trybWykonania" className="text-slate-300 font-semibold">
              Execution Mode
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
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <Button
            onClick={onSimulate}
            disabled={!formData.opisZadania.trim() || isGenerating}
            className="bg-gradient-success hover:bg-gradient-secondary flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>{testMode ? 'Run Simulation' : 'Execute Live'}</span>
              </>
            )}
          </Button>
          
          <Button
            onClick={onExport}
            variant="outline"
            className="border-slate-600 text-slate-300 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save to Database</span>
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="border-slate-600 text-slate-300 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Config</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommanderTestEnvironment;
