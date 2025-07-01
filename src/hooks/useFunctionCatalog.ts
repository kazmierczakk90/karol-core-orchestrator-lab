
import { useState, useEffect, useMemo } from 'react';
import { SystemFunction, FunctionMetrics } from '@/types/functionCatalog';

export const useFunctionCatalog = () => {
  const [functions, setFunctions] = useState<SystemFunction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'usage' | 'performance' | 'lastUsed'>('name');

  // Sample data - in real implementation this would come from system introspection
  useEffect(() => {
    const systemFunctions: SystemFunction[] = [
      // Decyzyjne
      {
        id: 'quantum-decisions',
        name: 'Quantum Decision Engine',
        description: 'Przetwarza złożone decyzje w stanie superpozycji kwantowej',
        level: 'decyzyjny',
        status: 'aktywna',
        category: 'Core Decision',
        tags: ['quantum', 'ai', 'decision'],
        component: 'QuantumDecisions',
        usageCount: 1247,
        lastUsed: new Date(Date.now() - 300000),
        performance: 94,
        dependencies: ['recursive-logic', 'meta-evolution'],
        version: '2.1.0',
        priority: 'critical'
      },
      {
        id: 'fuko-engine',
        name: 'FUKO Decision Engine',
        description: 'Główny silnik decyzyjny oparty na algorytmach FUKO-PZK',
        level: 'decyzyjny',
        status: 'aktywna',
        category: 'Core Decision',
        tags: ['fuko', 'core', 'decision'],
        usageCount: 2156,
        lastUsed: new Date(Date.now() - 120000),
        performance: 96,
        dependencies: [],
        version: '3.0.0',
        priority: 'critical'
      },
      // Pamięć
      {
        id: 'cognitive-memory',
        name: 'Cognitive Memory Core',
        description: 'Zarządza pamięcią poznawczą i kontekstem systemowym',
        level: 'pamięć',
        status: 'aktywna',
        category: 'Memory Management',
        tags: ['memory', 'cognitive', 'context'],
        component: 'CognitiveMemory',
        usageCount: 3421,
        lastUsed: new Date(Date.now() - 60000),
        performance: 89,
        dependencies: ['memory-trace'],
        version: '1.8.0',
        priority: 'high'
      },
      // Agenci
      {
        id: 'agent-orchestrator',
        name: 'Agent Orchestrator',
        description: 'Koordynuje pracę wielu agentów AI w systemie',
        level: 'agenci',
        status: 'aktywna',
        category: 'Agent Management',
        tags: ['agents', 'orchestration', 'coordination'],
        component: 'AgentOrchestrator',
        usageCount: 1876,
        lastUsed: new Date(Date.now() - 180000),
        performance: 92,
        dependencies: ['agent-registry'],
        version: '2.3.0',
        priority: 'critical'
      },
      // Meta
      {
        id: 'meta-evolution',
        name: 'Meta-Evolution Engine',
        description: 'System 100-stopniowej ewolucji meta-logiki',
        level: 'meta',
        status: 'aktywna',
        category: 'Meta Processing',
        tags: ['meta', 'evolution', '100-levels'],
        component: 'MetaEvolutionEngine',
        usageCount: 567,
        lastUsed: new Date(Date.now() - 600000),
        performance: 87,
        dependencies: ['recursive-logic'],
        version: '1.5.0',
        priority: 'high'
      },
      // Monitoring
      {
        id: 'real-time-monitor',
        name: 'Real-Time System Monitor',
        description: 'Monitoruje wydajność systemu w czasie rzeczywistym',
        level: 'monitoring',
        status: 'aktywna',
        category: 'System Monitoring',
        tags: ['monitoring', 'realtime', 'performance'],
        component: 'RealTimeMonitor',
        usageCount: 4532,
        lastUsed: new Date(Date.now() - 5000),
        performance: 98,
        dependencies: [],
        version: '1.2.0',
        priority: 'medium'
      },
      // Bezpieczeństwo
      {
        id: 'safety-core',
        name: 'Safety Core Level 20+',
        description: 'Zaawansowany system bezpieczeństwa AGI z 20+ poziomami ochrony',
        level: 'bezpieczeństwo',
        status: 'aktywna',
        category: 'Security & Safety',
        tags: ['safety', 'security', 'level20+'],
        component: 'SafetyCore',
        usageCount: 892,
        lastUsed: new Date(Date.now() - 240000),
        performance: 99,
        dependencies: ['guardian-core'],
        version: '3.1.0',
        priority: 'critical'
      },
      // UI Components
      {
        id: 'adaptive-interface',
        name: 'Adaptive UI Interface',
        description: 'Interfejs dostosowujący się do kontekstu użytkownika',
        level: 'ui',
        status: 'aktywna',
        category: 'User Interface',
        tags: ['ui', 'adaptive', 'responsive'],
        component: 'AdaptiveInterface',
        usageCount: 2341,
        lastUsed: new Date(Date.now() - 30000),
        performance: 91,
        dependencies: ['style-core'],
        version: '2.0.0',
        priority: 'medium'
      }
    ];

    setFunctions(systemFunctions);
  }, []);

  const filteredFunctions = useMemo(() => {
    return functions
      .filter(func => {
        const matchesSearch = func.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            func.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            func.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesLevel = selectedLevel === 'all' || func.level === selectedLevel;
        const matchesStatus = selectedStatus === 'all' || func.status === selectedStatus;
        
        return matchesSearch && matchesLevel && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'usage':
            return b.usageCount - a.usageCount;
          case 'performance':
            return b.performance - a.performance;
          case 'lastUsed':
            return (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0);
          default:
            return a.name.localeCompare(b.name);
        }
      });
  }, [functions, searchTerm, selectedLevel, selectedStatus, sortBy]);

  const metrics: FunctionMetrics = useMemo(() => {
    return {
      totalFunctions: functions.length,
      activeFunctions: functions.filter(f => f.status === 'aktywna').length,
      criticalFunctions: functions.filter(f => f.priority === 'critical').length,
      averagePerformance: functions.reduce((sum, f) => sum + f.performance, 0) / functions.length,
      recentUsage: functions.filter(f => f.lastUsed && f.lastUsed > new Date(Date.now() - 3600000)).length,
      errorRate: Math.random() * 2 + 1 // Simulated
    };
  }, [functions]);

  return {
    functions: filteredFunctions,
    allFunctions: functions,
    searchTerm,
    setSearchTerm,
    selectedLevel,
    setSelectedLevel,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    metrics
  };
};
