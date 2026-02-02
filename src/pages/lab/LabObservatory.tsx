import { useState, useEffect } from 'react';
import { SystemStatePanel } from '@/components/lab/SystemStatePanel';
import { DecisionTimeline } from '@/components/lab/DecisionTimeline';
import { AgentOrchestration } from '@/components/lab/AgentOrchestration';
import { NarrativeLayer } from '@/components/lab/NarrativeLayer';
import { ScenarioSandbox } from '@/components/lab/ScenarioSandbox';
import { LabHeader } from '@/components/lab/LabHeader';

export default function LabObservatory() {
  const [activeView, setActiveView] = useState<'timeline' | 'agents' | 'sandbox'>('timeline');
  const [systemNarrative, setSystemNarrative] = useState<string>(
    "The system is currently stabilizing after recent context integration. Decision pathways are converging toward long-term coherence."
  );

  return (
    <div className="min-h-screen bg-lab-background text-lab-foreground font-mono">
      {/* Persistent Narrative Layer - Always visible */}
      <NarrativeLayer narrative={systemNarrative} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <LabHeader />
        
        {/* System State Overview - Primary View */}
        <SystemStatePanel onNarrativeUpdate={setSystemNarrative} />
        
        {/* View Selector - Minimal, typographic */}
        <nav className="flex gap-12 border-b border-lab-border mt-12 mb-8">
          {[
            { id: 'timeline', label: 'Decision Timeline' },
            { id: 'agents', label: 'Agent Orchestration' },
            { id: 'sandbox', label: 'Scenario Simulation' },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as typeof activeView)}
              className={`pb-4 text-sm tracking-widest uppercase transition-colors ${
                activeView === view.id
                  ? 'text-lab-accent border-b-2 border-lab-accent'
                  : 'text-lab-muted hover:text-lab-foreground'
              }`}
            >
              {view.label}
            </button>
          ))}
        </nav>
        
        {/* Main Content Area */}
        <div className="min-h-[60vh]">
          {activeView === 'timeline' && <DecisionTimeline />}
          {activeView === 'agents' && <AgentOrchestration />}
          {activeView === 'sandbox' && <ScenarioSandbox />}
        </div>
        
        {/* Lab Footer */}
        <footer className="mt-16 pt-8 border-t border-lab-border">
          <p className="text-lab-muted text-xs tracking-wide">
            KAROL-CORE LABORATORY • SYNTHETIC DECISION OBSERVATORY • v10.0
          </p>
        </footer>
      </div>
    </div>
  );
}
