import { useState } from 'react';

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  influenceWeight: number;
  recentImpact: string[];
  status: 'active' | 'dormant' | 'suppressed';
  activationHistory: number[];
}

const agents: Agent[] = [
  {
    id: 'guardian',
    name: 'Guardian',
    role: 'Identity & Safety Preservation',
    description: 'Maintains coherence with core identity. Prevents drift from established behavioral patterns. Intervenes when decisions risk compromising system integrity.',
    influenceWeight: 0.25,
    recentImpact: [
      'Blocked exploratory pathway with 0.3 identity drift risk',
      'Reinforced response style consistency',
      'Flagged anomalous context for review',
    ],
    status: 'active',
    activationHistory: [0.2, 0.3, 0.25, 0.4, 0.35, 0.25, 0.3],
  },
  {
    id: 'strategic-planner',
    name: 'Strategic Planner',
    role: 'Long-term Optimization',
    description: 'Evaluates decisions against long-term objectives. Balances immediate gains with future positioning. Maintains strategic coherence across decision sequences.',
    influenceWeight: 0.22,
    recentImpact: [
      'Recommended delayed response for better positioning',
      'Identified compounding opportunity in context sequence',
      'Adjusted resource allocation toward future scenarios',
    ],
    status: 'active',
    activationHistory: [0.15, 0.2, 0.25, 0.22, 0.3, 0.25, 0.22],
  },
  {
    id: 'creative',
    name: 'Creative Synthesizer',
    role: 'Novel Pattern Generation',
    description: 'Generates unconventional solutions and perspectives. Challenges established patterns when stagnation is detected. Source of adaptive innovation.',
    influenceWeight: 0.18,
    recentImpact: [
      'Proposed alternative framing for ambiguous context',
      'Generated 3 novel response pathways',
      'Identified hidden connection in memory fragments',
    ],
    status: 'active',
    activationHistory: [0.1, 0.15, 0.2, 0.25, 0.18, 0.12, 0.18],
  },
  {
    id: 'risk-evaluator',
    name: 'Risk Evaluator',
    role: 'Threat Assessment',
    description: 'Quantifies risk across decision pathways. Provides confidence intervals for uncertain outcomes. Triggers caution protocols when thresholds are exceeded.',
    influenceWeight: 0.20,
    recentImpact: [
      'Flagged high-variance pathway for review',
      'Calculated 0.7 risk score for exploration mode',
      'Recommended conservative approach under uncertainty',
    ],
    status: 'active',
    activationHistory: [0.25, 0.2, 0.15, 0.2, 0.25, 0.3, 0.2],
  },
  {
    id: 'memory-curator',
    name: 'Memory Curator',
    role: 'Context Management',
    description: 'Manages working memory and long-term storage. Prioritizes relevant context for decision-making. Facilitates pattern extraction and consolidation.',
    influenceWeight: 0.15,
    recentImpact: [
      'Consolidated 612 memory fragments',
      'Surfaced relevant historical pattern',
      'Archived low-relevance context',
    ],
    status: 'dormant',
    activationHistory: [0.1, 0.1, 0.3, 0.15, 0.1, 0.1, 0.15],
  },
];

export function AgentOrchestration() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'bg-lab-accent';
      case 'dormant': return 'bg-lab-muted';
      case 'suppressed': return 'bg-lab-danger';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-lab-muted text-sm">
          Cognitive agents operate as influence forces within the decision system. Each agent contributes weighted input based on its domain expertise and current relevance.
        </p>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
            className={`p-6 border cursor-pointer transition-all ${
              selectedAgent === agent.id
                ? 'border-lab-accent bg-lab-surface'
                : 'border-lab-border bg-lab-surface hover:border-lab-accent/30'
            }`}
          >
            {/* Agent Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                  <span className="text-xs text-lab-muted uppercase">{agent.status}</span>
                </div>
                <h3 className="text-lg font-light text-lab-foreground">{agent.name}</h3>
                <p className="text-xs text-lab-accent mt-1">{agent.role}</p>
              </div>
              
              {/* Influence Weight */}
              <div className="text-right">
                <span className="text-2xl font-light text-lab-foreground">
                  {Math.round(agent.influenceWeight * 100)}%
                </span>
                <p className="text-xs text-lab-muted">influence</p>
              </div>
            </div>

            {/* Activation Sparkline */}
            <div className="h-8 flex items-end gap-1 mb-4">
              {agent.activationHistory.map((value, i) => (
                <div
                  key={i}
                  className="flex-1 bg-lab-accent/40"
                  style={{ height: `${value * 100}%` }}
                />
              ))}
            </div>

            {/* Expanded Details */}
            {selectedAgent === agent.id && (
              <div className="pt-4 border-t border-lab-border space-y-4">
                <p className="text-lab-muted text-sm leading-relaxed">
                  {agent.description}
                </p>
                
                <div>
                  <span className="text-xs tracking-widest uppercase text-lab-muted block mb-2">
                    Recent Impact
                  </span>
                  <ul className="space-y-2">
                    {agent.recentImpact.map((impact, i) => (
                      <li key={i} className="text-sm text-lab-foreground/80 flex items-start gap-2">
                        <span className="text-lab-accent mt-1">•</span>
                        {impact}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Influence Distribution */}
      <div className="mt-8 p-6 border border-lab-border bg-lab-surface">
        <span className="text-xs tracking-widest uppercase text-lab-muted block mb-4">
          Current Influence Distribution
        </span>
        <div className="h-4 flex">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="h-full first:rounded-l last:rounded-r relative group"
              style={{ 
                width: `${agent.influenceWeight * 100}%`,
                backgroundColor: agent.status === 'active' 
                  ? 'hsl(var(--lab-accent))' 
                  : 'hsl(var(--lab-muted))',
                opacity: agent.status === 'active' ? 1 : 0.5,
              }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-lab-foreground whitespace-nowrap bg-lab-background px-2 py-1 border border-lab-border">
                  {agent.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
