import { Activity } from 'lucide-react';

export function LabHeader() {
  return (
    <header className="mb-12">
      <div className="flex items-center gap-3 mb-2">
        <Activity className="h-4 w-4 text-lab-accent animate-pulse" />
        <span className="text-xs tracking-[0.3em] text-lab-muted uppercase">
          Live Observatory
        </span>
      </div>
      <h1 className="text-4xl font-light tracking-tight text-lab-foreground">
        Karol-Core
      </h1>
      <p className="text-lab-muted text-lg mt-2 font-light">
        Synthetic Decision Intelligence Laboratory
      </p>
    </header>
  );
}
