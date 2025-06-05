
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FolderPlus, Plus } from 'lucide-react';
import { openaiService } from '@/services/openaiService';
import { Project, Agent } from '@/types/openai';

interface ProjectCreatorProps {
  onProjectCreated: (project: Project) => void;
}

const ProjectCreator = ({ onProjectCreated }: ProjectCreatorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    agentId: '@ceo'
  });
  const [agents] = useState<Agent[]>(openaiService.getAgents());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    const project = openaiService.createProject(
      formData.name,
      formData.description,
      formData.agentId
    );

    onProjectCreated(project);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      agentId: '@ceo'
    });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-green-600 hover:bg-green-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nowy Projekt
      </Button>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-blue-800/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <FolderPlus className="h-5 w-5" />
          <span>Tworzenie Nowego Projektu</span>
        </CardTitle>
        <CardDescription className="text-slate-300">
          Utwórz projekt i przypisz agenta do zarządzania
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="projectName" className="text-slate-300">
              Nazwa Projektu
            </Label>
            <Input
              id="projectName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Wprowadź nazwę projektu"
              className="bg-slate-900/50 border-slate-700/50 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="projectDescription" className="text-slate-300">
              Opis Projektu
            </Label>
            <Textarea
              id="projectDescription"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Opisz cel i zakres projektu"
              className="bg-slate-900/50 border-slate-700/50 text-white"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="assignedAgent" className="text-slate-300">
              Przypisany Agent
            </Label>
            <Select 
              value={formData.agentId} 
              onValueChange={(value) => setFormData({ ...formData, agentId: value })}
            >
              <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    <div className="flex items-center space-x-2">
                      <span>{agent.name}</span>
                      <span className="text-xs text-slate-400">
                        ({agent.description})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Utwórz Projekt
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-slate-600 text-slate-300"
            >
              Anuluj
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectCreator;
