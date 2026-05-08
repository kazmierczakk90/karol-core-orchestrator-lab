import { useEffect, useState } from 'react';
import { semanticRouter, type RouteResult } from '@/services/idfc/semanticRouter';
import { descriptorCatalog, type IDFCDescriptor } from '@/services/idfc/descriptorCatalog';
import { FUKO_MODULES, type FukoModule } from '@/services/idfc/instanceRegistry';

export function RouterConsole() {
  const [descriptors, setDescriptors] = useState<IDFCDescriptor[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [moduleFilter, setModuleFilter] = useState<string>('');
  const [results, setResults] = useState<RouteResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { descriptorCatalog.list().then(setDescriptors); }, []);

  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const run = async () => {
    setLoading(true);
    try {
      const r = await semanticRouter.route({
        fuko_module: moduleFilter || undefined,
        required_descriptors: [...selected],
      });
      setResults(r);
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="border border-lab-border p-4 bg-lab-background/40 space-y-4">
        <div>
          <div className="text-lab-muted text-xs uppercase tracking-widest mb-2">Module filter (optional)</div>
          <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)}
            className="bg-lab-background border border-lab-border px-3 py-2 text-xs text-lab-foreground">
            <option value="">— any —</option>
            {FUKO_MODULES.map(m => <option key={m} value={m}>FUKO_{m}</option>)}
          </select>
        </div>
        <div>
          <div className="text-lab-muted text-xs uppercase tracking-widest mb-2">Required descriptors</div>
          <div className="flex flex-wrap gap-2">
            {descriptors.map(d => (
              <button key={d.id} onClick={() => toggle(d.id)}
                className={`px-2 py-1 text-[11px] border ${selected.has(d.id) ? 'border-lab-accent text-lab-accent' : 'border-lab-border text-lab-muted'}`}>
                {d.category}:{d.key}={d.value}
              </button>
            ))}
          </div>
        </div>
        <button onClick={run} disabled={loading || selected.size === 0}
          className="px-4 py-2 border border-lab-accent text-lab-accent text-xs tracking-widest uppercase hover:bg-lab-accent hover:text-lab-background disabled:opacity-50">
          Route query
        </button>
      </div>

      <div className="space-y-2">
        {results.length === 0 && <p className="text-lab-muted text-sm">No results yet. Pick descriptors and route.</p>}
        {results.map((r, i) => (
          <div key={r.instance_id} className="border border-lab-border p-3 bg-lab-background/40 flex items-center justify-between">
            <div>
              <div className="text-lab-accent text-sm">#{i+1} FUKO_{r.fuko_module}</div>
              <div className="text-lab-muted text-xs font-mono">{r.instance_id.slice(0,8)} · matched {r.matched.length}</div>
            </div>
            <div className="text-lab-foreground text-lg font-mono">{r.score.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
