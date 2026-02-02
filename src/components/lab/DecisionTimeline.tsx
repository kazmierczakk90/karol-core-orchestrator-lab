import { useState } from 'react';
import { ChevronRight, Clock, Users, Zap } from 'lucide-react';

interface Decision {
  id: string;
  timestamp: string;
  type: string;
  context: string;
  triggeringSignal: string;
  agentsInvolved: string[];
  confidenceLevel: number;
  rationale: string;
  outcome: string;
  impact: 'low' | 'medium' | 'high';
}

const mockDecisions: Decision[] = [
  {
    id: 'd-001',
    timestamp: '2024-02-02T14:32:00Z',
    type: 'Priority Rebalancing',
    context: 'Accumulated stress signals from exploration pathway exceeded threshold after 12 consecutive high-risk evaluations.',
    triggeringSignal: 'Risk accumulation threshold breach (>0.7)',
    agentsInvolved: ['Guardian', 'Strategic Planner', 'Risk Evaluator'],
    confidenceLevel: 0.89,
    rationale: 'The system determined that continued aggressive exploration would compromise long-term stability. A temporary pivot to consolidation preserves accumulated gains while allowing risk metrics to normalize.',
    outcome: 'Exploration weight reduced from 0.6 to 0.35',
    impact: 'high',
  },
  {
    id: 'd-002',
    timestamp: '2024-02-02T14:28:00Z',
    type: 'Agent Weight Adjustment',
    context: 'Creative Agent demonstrated 23% higher effectiveness in recent context-synthesis tasks.',
    triggeringSignal: 'Performance differential detected',
    agentsInvolved: ['Meta-Orchestrator', 'Creative Agent'],
    confidenceLevel: 0.76,
    rationale: 'Historical performance data indicates Creative Agent excels in current context type. Temporary influence boost allows system to leverage this capability.',
    outcome: 'Creative Agent influence +15%',
    impact: 'medium',
  },
  {
    id: 'd-003',
    timestamp: '2024-02-02T14:21:00Z',
    type: 'Memory Consolidation',
    context: 'Working memory approaching capacity with 847 unprocessed contextual fragments.',
    triggeringSignal: 'Memory pressure warning',
    agentsInvolved: ['Memory Curator', 'Pattern Recognizer'],
    confidenceLevel: 0.92,
    rationale: 'Automatic consolidation triggered to prevent cognitive overload. Low-relevance fragments archived, high-value patterns extracted and integrated into long-term memory.',
    outcome: '612 fragments archived, 47 patterns extracted',
    impact: 'low',
  },
  {
    id: 'd-004',
    timestamp: '2024-02-02T14:15:00Z',
    type: 'Coherence Verification',
    context: 'Routine identity alignment check following external context injection.',
    triggeringSignal: 'Scheduled verification cycle',
    agentsInvolved: ['Identity Guardian', 'Style Enforcer'],
    confidenceLevel: 0.95,
    rationale: 'New context integrated successfully without identity drift. Behavioral patterns remain consistent with core personality matrix.',
    outcome: 'Identity alignment confirmed at 94%',
    impact: 'low',
  },
  {
    id: 'd-005',
    timestamp: '2024-02-02T14:08:00Z',
    type: 'Strategic Pivot',
    context: 'Market signal analysis indicated shift in optimal decision timing.',
    triggeringSignal: 'External signal pattern recognition',
    agentsInvolved: ['Strategic Planner', 'Temporal Analyst', 'Risk Evaluator'],
    confidenceLevel: 0.71,
    rationale: 'Lower confidence due to incomplete signal data, but the potential upside of early adaptation outweighs the risk of delayed response. System opts for cautious pivot with monitoring.',
    outcome: 'Response timing adjusted -2 cycles',
    impact: 'medium',
  },
];

export function DecisionTimeline() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="space-y-1">
      <div className="mb-8">
        <p className="text-lab-muted text-sm">
          Chronological record of system decisions. Each entry represents a discrete decision point with full context and rationale.
        </p>
      </div>

      <div className="space-y-4">
        {mockDecisions.map((decision) => (
          <div
            key={decision.id}
            className="border border-lab-border bg-lab-surface hover:border-lab-accent/30 transition-colors"
          >
            {/* Decision Header */}
            <button
              onClick={() => setExpandedId(expandedId === decision.id ? null : decision.id)}
              className="w-full p-6 text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-lab-muted text-xs font-mono">
                      {formatTime(decision.timestamp)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 ${
                      decision.impact === 'high' 
                        ? 'bg-lab-accent/20 text-lab-accent' 
                        : decision.impact === 'medium'
                        ? 'bg-lab-warning/20 text-lab-warning'
                        : 'bg-lab-muted/20 text-lab-muted'
                    }`}>
                      {decision.impact} impact
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-light text-lab-foreground mb-2">
                    {decision.type}
                  </h3>
                  
                  <p className="text-lab-muted text-sm line-clamp-2">
                    {decision.context}
                  </p>
                </div>
                
                <ChevronRight className={`h-5 w-5 text-lab-muted transition-transform ${
                  expandedId === decision.id ? 'rotate-90' : ''
                }`} />
              </div>
            </button>

            {/* Expanded Details */}
            {expandedId === decision.id && (
              <div className="px-6 pb-6 border-t border-lab-border pt-6 space-y-6">
                {/* Triggering Signal */}
                <div>
                  <div className="flex items-center gap-2 text-lab-muted mb-2">
                    <Zap className="h-3 w-3" />
                    <span className="text-xs tracking-widest uppercase">Triggering Signal</span>
                  </div>
                  <p className="text-lab-foreground/90 text-sm">{decision.triggeringSignal}</p>
                </div>

                {/* Agents Involved */}
                <div>
                  <div className="flex items-center gap-2 text-lab-muted mb-2">
                    <Users className="h-3 w-3" />
                    <span className="text-xs tracking-widest uppercase">Agents Involved</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {decision.agentsInvolved.map((agent) => (
                      <span key={agent} className="text-xs px-2 py-1 bg-lab-border text-lab-foreground/80">
                        {agent}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Confidence */}
                <div>
                  <div className="flex items-center gap-2 text-lab-muted mb-2">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs tracking-widest uppercase">Confidence Level</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-1 bg-lab-border">
                      <div 
                        className="h-full bg-lab-accent" 
                        style={{ width: `${decision.confidenceLevel * 100}%` }}
                      />
                    </div>
                    <span className="text-lab-foreground text-sm font-mono">
                      {Math.round(decision.confidenceLevel * 100)}%
                    </span>
                  </div>
                </div>

                {/* Rationale */}
                <div className="p-4 bg-lab-background border-l-2 border-lab-accent">
                  <span className="text-xs tracking-widest uppercase text-lab-muted block mb-2">
                    Rationale
                  </span>
                  <p className="text-lab-foreground/90 text-sm leading-relaxed italic">
                    {decision.rationale}
                  </p>
                </div>

                {/* Outcome */}
                <div>
                  <span className="text-xs tracking-widest uppercase text-lab-muted block mb-2">
                    Outcome
                  </span>
                  <p className="text-lab-accent text-sm font-medium">{decision.outcome}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
