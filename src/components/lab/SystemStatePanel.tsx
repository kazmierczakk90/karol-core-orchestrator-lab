import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, Shield, Brain } from 'lucide-react';

interface SystemStatePanelProps {
  onNarrativeUpdate: (narrative: string) => void;
}

interface SystemState {
  dominantPriority: string;
  priorityRationale: string;
  activeTension: string | null;
  tensionSeverity: 'low' | 'medium' | 'high' | null;
  focusSummary: string;
  confidenceLevel: number;
  decisionVelocity: number;
  coherenceScore: number;
}

export function SystemStatePanel({ onNarrativeUpdate }: SystemStatePanelProps) {
  const [state, setState] = useState<SystemState>({
    dominantPriority: 'Long-term Coherence',
    priorityRationale: 'Accumulated context from 47 recent decisions favors stability over rapid adaptation.',
    activeTension: 'Resource allocation conflict between exploration and exploitation pathways',
    tensionSeverity: 'medium',
    focusSummary: 'The system is currently prioritizing identity preservation while processing incoming contextual signals. Decision pathways are being evaluated against established behavioral patterns.',
    confidenceLevel: 0.82,
    decisionVelocity: 3.2,
    coherenceScore: 0.91,
  });

  useEffect(() => {
    // Update narrative based on state
    const narratives = [
      `The system is prioritizing ${state.dominantPriority.toLowerCase()} with ${Math.round(state.confidenceLevel * 100)}% confidence. ${state.activeTension ? 'An active tension requires attention.' : 'No significant tensions detected.'}`,
      `Current focus: ${state.focusSummary}`,
      `Decision-making velocity at ${state.decisionVelocity} decisions/hour. Coherence remains ${state.coherenceScore > 0.85 ? 'strong' : 'moderate'}.`,
    ];
    
    const interval = setInterval(() => {
      const randomNarrative = narratives[Math.floor(Math.random() * narratives.length)];
      onNarrativeUpdate(randomNarrative);
    }, 15000);

    return () => clearInterval(interval);
  }, [state, onNarrativeUpdate]);

  return (
    <div className="mt-16">
      {/* Dominant Priority - Hero element */}
      <div className="mb-12">
        <span className="text-xs tracking-[0.3em] text-lab-muted uppercase block mb-3">
          Dominant Priority
        </span>
        <h2 className="text-3xl font-light text-lab-foreground mb-3">
          {state.dominantPriority}
        </h2>
        <p className="text-lab-muted text-sm max-w-2xl leading-relaxed">
          {state.priorityRationale}
        </p>
      </div>

      {/* Active Tension Alert */}
      {state.activeTension && (
        <div className={`p-6 border mb-12 ${
          state.tensionSeverity === 'high' 
            ? 'border-lab-danger bg-lab-danger/5' 
            : state.tensionSeverity === 'medium'
            ? 'border-lab-warning bg-lab-warning/5'
            : 'border-lab-border bg-lab-surface'
        }`}>
          <div className="flex items-start gap-4">
            <AlertTriangle className={`h-5 w-5 shrink-0 mt-0.5 ${
              state.tensionSeverity === 'high' 
                ? 'text-lab-danger' 
                : state.tensionSeverity === 'medium'
                ? 'text-lab-warning'
                : 'text-lab-muted'
            }`} />
            <div>
              <span className="text-xs tracking-widest uppercase text-lab-muted block mb-2">
                Active Tension • {state.tensionSeverity} severity
              </span>
              <p className="text-lab-foreground text-sm">
                {state.activeTension}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* System Metrics - Minimal, analytical */}
      <div className="grid grid-cols-3 gap-8">
        <MetricBlock
          icon={<Brain className="h-4 w-4" />}
          label="Confidence Level"
          value={`${Math.round(state.confidenceLevel * 100)}%`}
          subtext="Current decision certainty"
        />
        <MetricBlock
          icon={<TrendingUp className="h-4 w-4" />}
          label="Decision Velocity"
          value={`${state.decisionVelocity}/hr`}
          subtext="Decisions per hour"
        />
        <MetricBlock
          icon={<Shield className="h-4 w-4" />}
          label="Coherence Score"
          value={`${Math.round(state.coherenceScore * 100)}%`}
          subtext="Identity alignment"
        />
      </div>

      {/* Focus Summary */}
      <div className="mt-12 p-6 bg-lab-surface border border-lab-border">
        <span className="text-xs tracking-[0.3em] text-lab-muted uppercase block mb-4">
          Current System Focus
        </span>
        <p className="text-lab-foreground/90 leading-relaxed">
          {state.focusSummary}
        </p>
      </div>
    </div>
  );
}

interface MetricBlockProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
}

function MetricBlock({ icon, label, value, subtext }: MetricBlockProps) {
  return (
    <div className="p-6 bg-lab-surface border border-lab-border">
      <div className="flex items-center gap-2 text-lab-muted mb-4">
        {icon}
        <span className="text-xs tracking-widest uppercase">{label}</span>
      </div>
      <p className="text-3xl font-light text-lab-foreground mb-1">{value}</p>
      <p className="text-xs text-lab-muted">{subtext}</p>
    </div>
  );
}
