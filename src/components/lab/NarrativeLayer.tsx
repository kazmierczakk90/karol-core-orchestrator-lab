interface NarrativeLayerProps {
  narrative: string;
}

export function NarrativeLayer({ narrative }: NarrativeLayerProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-lab-narrative border-b border-lab-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-start gap-4">
          <span className="text-lab-accent text-xs tracking-widest uppercase shrink-0 mt-0.5">
            System Narrative
          </span>
          <p className="text-lab-foreground/90 text-sm font-light leading-relaxed italic">
            "{narrative}"
          </p>
        </div>
      </div>
    </div>
  );
}
