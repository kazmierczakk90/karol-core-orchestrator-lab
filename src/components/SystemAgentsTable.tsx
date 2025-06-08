import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bot } from 'lucide-react';
import AgentStatsHeader from './agents/AgentStatsHeader';
import AgentFilters from './agents/AgentFilters';
import AgentTableRow from './agents/AgentTableRow';

interface SystemAgent {
  id: string;
  name: string;
  type: 'core' | 'karol' | 'integration' | 'utility';
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  description: string;
  tasksCompleted: number;
  lastUsed: Date;
  capabilities: string[];
  version: string;
}

const SystemAgentsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const [agents, setAgents] = useState<SystemAgent[]>([
    { id: '@ceo', name: 'CEO Agent', type: 'core', status: 'active', description: 'Strategic decision making and high-level planning', tasksCompleted: 47, lastUsed: new Date(), capabilities: ['strategy', 'planning', 'leadership'], version: '2.1.0' },
    { id: '@logger', name: 'Logger Agent', type: 'utility', status: 'active', description: 'System logging and monitoring', tasksCompleted: 156, lastUsed: new Date(), capabilities: ['logging', 'monitoring', 'alerts'], version: '1.8.2' },
    { id: '@voice-core', name: 'Voice Core', type: 'core', status: 'active', description: 'Voice processing and communication', tasksCompleted: 23, lastUsed: new Date(), capabilities: ['voice', 'speech', 'audio'], version: '3.0.1' },
    { id: '@analiza', name: 'Analiza Agent', type: 'utility', status: 'active', description: 'Data analysis and insights', tasksCompleted: 89, lastUsed: new Date(), capabilities: ['analysis', 'data', 'insights'], version: '2.3.5' },
    { id: '@router', name: 'Router Agent', type: 'core', status: 'active', description: 'Task routing and distribution', tasksCompleted: 234, lastUsed: new Date(), capabilities: ['routing', 'distribution', 'load-balancing'], version: '1.9.0' },
    { id: '@kontroling', name: 'Kontroling Agent', type: 'utility', status: 'active', description: 'Quality control and oversight', tasksCompleted: 67, lastUsed: new Date(), capabilities: ['quality', 'control', 'validation'], version: '1.5.3' },
    { id: '@system-admin', name: 'System Admin', type: 'core', status: 'active', description: 'System administration and maintenance', tasksCompleted: 178, lastUsed: new Date(), capabilities: ['admin', 'maintenance', 'system'], version: '2.0.8' },
    { id: '@guardian-core', name: 'Guardian Core', type: 'core', status: 'active', description: 'Security and protection', tasksCompleted: 45, lastUsed: new Date(), capabilities: ['security', 'protection', 'monitoring'], version: '2.2.1' },
    { id: '@karol-core', name: 'Karol Core', type: 'karol', status: 'active', description: 'Core Karol system functionality', tasksCompleted: 312, lastUsed: new Date(), capabilities: ['core', 'orchestration', 'identity'], version: '4.1.2' },
    { id: '@karol-voice', name: 'Karol Voice', type: 'karol', status: 'active', description: 'Karol voice processing', tasksCompleted: 56, lastUsed: new Date(), capabilities: ['voice', 'karol-identity', 'communication'], version: '3.1.0' },
    { id: '@google-search', name: 'Google Search', type: 'integration', status: 'active', description: 'Google Search integration', tasksCompleted: 134, lastUsed: new Date(), capabilities: ['search', 'google', 'web'], version: '1.4.7' },
    { id: '@google-maps', name: 'Google Maps', type: 'integration', status: 'active', description: 'Google Maps integration', tasksCompleted: 28, lastUsed: new Date(), capabilities: ['maps', 'location', 'navigation'], version: '1.2.3' },
    { id: '@party-app', name: 'Party App', type: 'integration', status: 'maintenance', description: 'Event and party management', tasksCompleted: 15, lastUsed: new Date(), capabilities: ['events', 'parties', 'management'], version: '0.9.1' },
    { id: '@fuko-lang', name: 'FUKO Lang', type: 'karol', status: 'active', description: 'FUKO language processing', tasksCompleted: 98, lastUsed: new Date(), capabilities: ['language', 'fuko', 'processing'], version: '2.5.0' },
    { id: '@skyai.ai', name: 'SkyAI', type: 'integration', status: 'active', description: 'Advanced AI solutions', tasksCompleted: 76, lastUsed: new Date(), capabilities: ['ai', 'automation', 'solutions'], version: '1.7.4' }
  ]);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || agent.type === selectedType;
    return matchesSearch && matchesType;
  });

  const toggleAgentStatus = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' }
        : agent
    ));
  };

  const getStatusCounts = () => {
    return {
      total: agents.length,
      active: agents.filter(a => a.status === 'active').length,
      inactive: agents.filter(a => a.status === 'inactive').length,
      maintenance: agents.filter(a => a.status === 'maintenance').length,
      error: agents.filter(a => a.status === 'error').length
    };
  };

  const stats = getStatusCounts();

  return (
    <Card className="bg-slate-800/50 border-cyan-800/30 h-full">
      <CardHeader>
        <AgentStatsHeader stats={stats} />
        <AgentFilters 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border border-slate-700/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700/50">
                <TableHead className="text-slate-300">Agent</TableHead>
                <TableHead className="text-slate-300">Type</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Tasks</TableHead>
                <TableHead className="text-slate-300">Capabilities</TableHead>
                <TableHead className="text-slate-300">Version</TableHead>
                <TableHead className="text-slate-300">Last Used</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => (
                <AgentTableRow 
                  key={agent.id} 
                  agent={agent} 
                  onToggleStatus={toggleAgentStatus}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <Bot className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No agents found</p>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemAgentsTable;
