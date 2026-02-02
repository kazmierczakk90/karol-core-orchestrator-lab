import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface ScenarioResult {
  pathwayShifts: {
    from: string;
    to: string;
    probability: number;
  }[];
  agentReweighting: {
    agent: string;
    currentWeight: number;
    projectedWeight: number;
  }[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
  narrativePrediction: string;
}

export function ScenarioSandbox() {
  const [contextInput, setContextInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<ScenarioResult | null>(null);

  const presetScenarios = [
    {
      label: 'High-pressure deadline',
      context: 'External signal: Critical deadline in 2 hours. Multiple stakeholders awaiting response. Historical success rate under pressure: 67%.',
    },
    {
      label: 'Conflicting priorities',
      context: 'Two high-priority pathways detected with mutual exclusivity. Path A optimizes for short-term gains. Path B preserves long-term positioning.',
    },
    {
      label: 'Novel context injection',
      context: 'Unfamiliar context pattern detected. No historical precedent in memory. Similarity to known patterns: 34%.',
    },
    {
      label: 'Identity challenge',
      context: 'External request conflicts with established behavioral patterns. Compliance would require 0.4 deviation from identity baseline.',
    },
  ];

  const runSimulation = () => {
    if (!contextInput.trim()) return;
    
    setIsSimulating(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setResult({
        pathwayShifts: [
          { from: 'Exploration', to: 'Consolidation', probability: 0.72 },
          { from: 'Long-term focus', to: 'Immediate response', probability: 0.45 },
        ],
        agentReweighting: [
          { agent: 'Guardian', currentWeight: 0.25, projectedWeight: 0.35 },
          { agent: 'Risk Evaluator', currentWeight: 0.20, projectedWeight: 0.28 },
          { agent: 'Creative Synthesizer', currentWeight: 0.18, projectedWeight: 0.12 },
          { agent: 'Strategic Planner', currentWeight: 0.22, projectedWeight: 0.15 },
        ],
        riskAssessment: {
          level: 'medium',
          factors: [
            'Increased cognitive load from novel context',
            'Potential identity drift if response deviates from patterns',
            'Time pressure may reduce decision quality',
          ],
        },
        narrativePrediction: 'Under this context, the system would likely pivot toward defensive positioning. Guardian and Risk Evaluator would gain influence while Creative and Strategic agents are temporarily suppressed. Expect slower, more conservative decision-making with emphasis on identity preservation.',
      });
      setIsSimulating(false);
    }, 2000);
  };

  const resetSimulation = () => {
    setContextInput('');
    setResult(null);
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-lab-muted text-sm">
          Input hypothetical context changes to observe how decision pathways would shift. This is an analytical simulation — no actual decisions are made.
        </p>
      </div>

      {/* Context Input */}
      <div className="space-y-4 mb-8">
        <div>
          <label className="text-xs tracking-widest uppercase text-lab-muted block mb-2">
            Hypothetical Context
          </label>
          <textarea
            value={contextInput}
            onChange={(e) => setContextInput(e.target.value)}
            placeholder="Describe a hypothetical context change or scenario..."
            className="w-full h-32 bg-lab-background border border-lab-border text-lab-foreground p-4 text-sm resize-none focus:outline-none focus:border-lab-accent placeholder:text-lab-muted/50"
          />
        </div>

        {/* Preset Scenarios */}
        <div>
          <span className="text-xs tracking-widest uppercase text-lab-muted block mb-2">
            Preset Scenarios
          </span>
          <div className="flex flex-wrap gap-2">
            {presetScenarios.map((scenario) => (
              <button
                key={scenario.label}
                onClick={() => setContextInput(scenario.context)}
                className="text-xs px-3 py-1.5 border border-lab-border text-lab-muted hover:text-lab-foreground hover:border-lab-accent/30 transition-colors"
              >
                {scenario.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={runSimulation}
            disabled={!contextInput.trim() || isSimulating}
            className="flex items-center gap-2 px-6 py-3 bg-lab-accent text-lab-background text-sm tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lab-accent/90 transition-colors"
          >
            <Play className="h-4 w-4" />
            {isSimulating ? 'Simulating...' : 'Run Simulation'}
          </button>
          <button
            onClick={resetSimulation}
            className="flex items-center gap-2 px-6 py-3 border border-lab-border text-lab-muted text-sm tracking-widest uppercase hover:text-lab-foreground hover:border-lab-accent/30 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Simulation Results */}
      {result && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Pathway Shifts */}
          <div className="p-6 border border-lab-border bg-lab-surface">
            <span className="text-xs tracking-widest uppercase text-lab-muted block mb-4">
              Projected Pathway Shifts
            </span>
            <div className="space-y-4">
              {result.pathwayShifts.map((shift, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-lab-foreground/70">{shift.from}</span>
                  <span className="text-lab-accent">→</span>
                  <span className="text-lab-foreground">{shift.to}</span>
                  <span className="text-lab-muted text-sm ml-auto">
                    {Math.round(shift.probability * 100)}% probability
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Reweighting */}
          <div className="p-6 border border-lab-border bg-lab-surface">
            <span className="text-xs tracking-widest uppercase text-lab-muted block mb-4">
              Agent Reweighting
            </span>
            <div className="space-y-3">
              {result.agentReweighting.map((item) => {
                const delta = item.projectedWeight - item.currentWeight;
                return (
                  <div key={item.agent} className="flex items-center gap-4">
                    <span className="text-lab-foreground w-40">{item.agent}</span>
                    <div className="flex-1 flex items-center gap-4">
                      <span className="text-lab-muted text-sm w-12">
                        {Math.round(item.currentWeight * 100)}%
                      </span>
                      <span className="text-lab-accent">→</span>
                      <span className="text-lab-foreground text-sm w-12">
                        {Math.round(item.projectedWeight * 100)}%
                      </span>
                      <span className={`text-sm ${delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ({delta > 0 ? '+' : ''}{Math.round(delta * 100)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Risk Assessment */}
          <div className={`p-6 border bg-lab-surface ${
            result.riskAssessment.level === 'high' 
              ? 'border-lab-danger' 
              : result.riskAssessment.level === 'medium'
              ? 'border-lab-warning'
              : 'border-lab-border'
          }`}>
            <span className="text-xs tracking-widest uppercase text-lab-muted block mb-4">
              Risk Assessment • {result.riskAssessment.level} risk
            </span>
            <ul className="space-y-2">
              {result.riskAssessment.factors.map((factor, i) => (
                <li key={i} className="text-sm text-lab-foreground/80 flex items-start gap-2">
                  <span className="text-lab-warning mt-1">•</span>
                  {factor}
                </li>
              ))}
            </ul>
          </div>

          {/* Narrative Prediction */}
          <div className="p-6 bg-lab-background border-l-2 border-lab-accent">
            <span className="text-xs tracking-widest uppercase text-lab-muted block mb-3">
              Narrative Prediction
            </span>
            <p className="text-lab-foreground/90 leading-relaxed italic">
              "{result.narrativePrediction}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
