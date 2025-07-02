
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronRight, ChevronLeft, Bot, 
  Settings, Check, AlertTriangle 
} from 'lucide-react';

interface AgentConfig {
  name: string;
  identifier: string;
  type: 'core' | 'karol' | 'integration' | 'utility';
  description: string;
  capabilities: string[];
  mode: 'CEO' | 'ECHO' | 'CREATIVE' | 'LIVE' | 'MENTOR';
  version: string;
}

const AgentSetupStepper = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    name: '',
    identifier: '',
    type: 'utility',
    description: '',
    capabilities: [],
    mode: 'ECHO',
    version: '1.0.0'
  });

  const steps = [
    { id: 1, title: 'Basic Info', icon: Bot },
    { id: 2, title: 'Configuration', icon: Settings },
    { id: 3, title: 'Review', icon: Check }
  ];

  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCapabilityAdd = (capability: string) => {
    if (capability && !agentConfig.capabilities.includes(capability)) {
      setAgentConfig(prev => ({
        ...prev,
        capabilities: [...prev.capabilities, capability]
      }));
    }
  };

  const handleCapabilityRemove = (capability: string) => {
    setAgentConfig(prev => ({
      ...prev,
      capabilities: prev.capabilities.filter(c => c !== capability)
    }));
  };

  return (
    <Card className="bg-slate-800/50 border-green-800/30">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center space-x-2">
          <Bot className="h-6 w-6" />
          <span>Agent Setup Wizard</span>
        </CardTitle>
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-slate-400">
            {steps.map(step => (
              <div key={step.id} className={`flex items-center space-x-1 ${
                currentStep >= step.id ? 'text-green-400' : 'text-slate-500'
              }`}>
                <step.icon className="h-4 w-4" />
                <span>{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-white font-medium">Basic Agent Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Agent Name</Label>
                <Input
                  value={agentConfig.name}
                  onChange={(e) => setAgentConfig(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Content Creator"
                  className="bg-slate-700/50 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Identifier</Label>
                <Input
                  value={agentConfig.identifier}
                  onChange={(e) => setAgentConfig(prev => ({ ...prev, identifier: e.target.value }))}
                  placeholder="e.g., @content-creator"
                  className="bg-slate-700/50 border-slate-600"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Agent Type</Label>
              <Select
                value={agentConfig.type}
                onValueChange={(value: any) => setAgentConfig(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="core">Core Agent</SelectItem>
                  <SelectItem value="karol">Karol Agent</SelectItem>
                  <SelectItem value="integration">Integration Agent</SelectItem>
                  <SelectItem value="utility">Utility Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Description</Label>
              <Textarea
                value={agentConfig.description}
                onChange={(e) => setAgentConfig(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the agent's purpose and functionality..."
                className="bg-slate-700/50 border-slate-600"
                rows={3}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-white font-medium">Agent Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Operating Mode</Label>
                <Select
                  value={agentConfig.mode}
                  onValueChange={(value: any) => setAgentConfig(prev => ({ ...prev, mode: value }))}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="CEO">CEO Mode</SelectItem>
                    <SelectItem value="ECHO">Echo Mode</SelectItem>
                    <SelectItem value="CREATIVE">Creative Mode</SelectItem>
                    <SelectItem value="LIVE">Live Mode</SelectItem>
                    <SelectItem value="MENTOR">Mentor Mode</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Version</Label>
                <Input
                  value={agentConfig.version}
                  onChange={(e) => setAgentConfig(prev => ({ ...prev, version: e.target.value }))}
                  placeholder="1.0.0"
                  className="bg-slate-700/50 border-slate-600"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Capabilities</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {agentConfig.capabilities.map(capability => (
                  <Badge
                    key={capability}
                    className="bg-blue-500/20 text-blue-400 cursor-pointer hover:bg-red-500/20 hover:text-red-400"
                    onClick={() => handleCapabilityRemove(capability)}
                  >
                    {capability} ×
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add capability..."
                  className="bg-slate-700/50 border-slate-600"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCapabilityAdd(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Add capability..."]') as HTMLInputElement;
                    if (input) {
                      handleCapabilityAdd(input.value);
                      input.value = '';
                    }
                  }}
                  variant="outline"
                  className="border-slate-600"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-white font-medium">Review Configuration</h3>
            <div className="bg-slate-700/30 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-400 text-sm">Name</div>
                  <div className="text-white">{agentConfig.name || 'Not set'}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Identifier</div>
                  <div className="text-cyan-400 font-mono">{agentConfig.identifier || 'Not set'}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Type</div>
                  <div className="text-white capitalize">{agentConfig.type}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Mode</div>
                  <div className="text-purple-400">{agentConfig.mode}</div>
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-sm">Description</div>
                <div className="text-white">{agentConfig.description || 'No description'}</div>
              </div>
              <div>
                <div className="text-slate-400 text-sm">Capabilities</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {agentConfig.capabilities.map(capability => (
                    <Badge key={capability} className="bg-green-500/20 text-green-400">
                      {capability}
                    </Badge>
                  ))}
                  {agentConfig.capabilities.length === 0 && (
                    <span className="text-slate-500">No capabilities added</span>
                  )}
                </div>
              </div>
            </div>
            
            {(!agentConfig.name || !agentConfig.identifier) && (
              <div className="flex items-center space-x-2 text-yellow-400">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Please complete all required fields</span>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-slate-700/50">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            variant="outline"
            className="border-slate-600"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              className="bg-green-600 hover:bg-green-700"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              disabled={!agentConfig.name || !agentConfig.identifier}
              className="bg-green-600 hover:bg-green-700"
            >
              Create Agent
              <Check className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentSetupStepper;
