
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Play, Save, Download, TestTube, Settings } from 'lucide-react';

interface CommanderTestEnvironmentProps {
  formData: any;
  setFormData: (data: any) => void;
  agents: Array<{id: string, name: string, opis: string, tags: string[]}>;
  industries: Array<{value: string, label: string, icon: string}>;
  onSimulate: () => void;
  onExport: () => void;
  isGenerating: boolean;
  testMode: boolean;
}

const CommanderTestEnvironment = ({
  formData,
  setFormData,
  agents,
  industries,
  onSimulate,
  onExport,
  isGenerating,
  testMode
}: CommanderTestEnvironmentProps) => {

  const priorytety = [
    { value: 'krytyczny', label: 'Critical', color: 'bg-red-500' },
    { value: 'wysoki', label: 'High', color: 'bg-orange-500' },
    { value: 'normalny', label: 'Normal', color: 'bg-blue-500' },
    { value: 'niski', label: 'Low', color: 'bg-gray-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Agent Selection */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ton" className="text-slate-300 font-semibold">
                Response Tone
              </Label>
              <Select value={formData.ton} onValueChange={(value) => setFormData({ ...formData, ton: value })}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="profesjonalny">Professional</SelectItem>
                  <SelectItem value="bezposredni">Direct</SelectItem>
                  <SelectItem value="analityczny">Analytical</SelectItem>
                  <SelectItem value="kreatywny">Creative</SelectItem>
                  <SelectItem value="techniczny">Technical</SelectItem>
                  <SelectItem value="przyjazny">Friendly</SelectItem>
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
                  <SelectItem value="raport">Text Report</SelectItem>
                  <SelectItem value="lista-punktowa">Bullet Points</SelectItem>
                  <SelectItem value="json">JSON Structure</SelectItem>
                  <SelectItem value="tabela">Data Table</SelectItem>
                  <SelectItem value="schemat">Diagram/Schema</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
