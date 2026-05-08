import { useEffect, useState } from 'react';
import { instanceRegistry, FUKO_MODULES, type IDFCInstance, type FukoModule } from '@/services/idfc/instanceRegistry';
import { fusionBinder } from '@/services/idfc/fusionBinder';
import { descriptorCatalog, type IDFCDescriptor } from '@/services/idfc/descriptorCatalog';

export function InstanceMap() {
  const [instances, setInstances] = useState<IDFCInstance[]>([]);
  const [descriptors, setDescriptors] = useState<IDFCDescriptor[]>([]);
  const [bindings, setBindings] = useState<any[]>([]);
  const [selectedModule, setSelectedModule] = useState<FukoModule>('PROB');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [i, d, b] = await Promise.all([
      instanceRegistry.list(),
      descriptorCatalog.list(),
      fusionBinder.listAll(),
    ]);
    setInstances(i); setDescriptors(d); setBindings(b);
  };
  useEffect(() => { load(); }, []);

  const spawn = async () => {
    setLoading(true);
    try { await instanceRegistry.create(selectedModule, { ttl_seconds: 3600 }); await load(); } finally { setLoading(false); }
  };

  const stop = async (id: string) => { await instanceRegistry.setStatus(id, 'stopped'); await load(); };
  const clone = async (id: string) => { await instanceRegistry.clone(id); await load(); };
  const bind = async (instId: string, descId: string) => { await fusionBinder.bind(instId, descId); await load(); };
  const unbind = async (instId: string, descId: string) => { await fusionBinder.unbind(instId, descId); await load(); };

  const descById = new Map(descriptors.map(d => [d.id, d]));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <select value={selectedModule} onChange={(e) => setSelectedModule(e.target.value as FukoModule)}
          className="bg-lab-background border border-lab-border text-lab-foreground px-3 py-2 text-xs uppercase tracking-widest">
          {FUKO_MODULES.map(m => <option key={m} value={m}>FUKO_{m}</option>)}
        </select>
        <button onClick={spawn} disabled={loading}
          className="px-4 py-2 border border-lab-accent text-lab-accent text-xs tracking-widest uppercase hover:bg-lab-accent hover:text-lab-background transition">
          Spawn instance
        </button>
        <button onClick={load} className="px-4 py-2 text-lab-muted text-xs tracking-widest uppercase hover:text-lab-foreground">↻ Refresh</button>
      </div>

      <div className="grid gap-4">
        {instances.length === 0 && <p className="text-lab-muted text-sm">No instances yet. Spawn one above.</p>}
        {instances.map(inst => {
          const myBindings = bindings.filter(b => b.instance_id === inst.id);
          return (
            <div key={inst.id} className="border border-lab-border p-4 bg-lab-background/40">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-lab-accent text-sm tracking-widest">FUKO_{inst.fuko_module}</div>
                  <div className="text-lab-muted text-xs font-mono mt-1">{inst.id.slice(0, 8)} · {inst.status} · {new Date(inst.started_at).toLocaleTimeString()}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => clone(inst.id)} className="text-xs text-lab-muted hover:text-lab-foreground tracking-widest uppercase">Clone</button>
                  {inst.status === 'active' && (
                    <button onClick={() => stop(inst.id)} className="text-xs text-destructive hover:opacity-80 tracking-widest uppercase">Stop</button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {myBindings.map(b => {
                  const d = descById.get(b.descriptor_id);
                  if (!d) return null;
                  return (
                    <span key={b.id} className="px-2 py-1 text-[10px] uppercase tracking-wider border border-lab-border text-lab-foreground">
                      {d.category}:{d.key}={d.value}
                      <button onClick={() => unbind(inst.id, b.descriptor_id)} className="ml-2 text-destructive">×</button>
                    </span>
                  );
                })}
                {myBindings.length === 0 && <span className="text-lab-muted text-xs italic">no descriptors bound</span>}
              </div>
              <select onChange={(e) => { if (e.target.value) { bind(inst.id, e.target.value); e.target.value = ''; } }}
                className="bg-lab-background border border-lab-border text-lab-muted px-2 py-1 text-xs">
                <option value="">+ bind descriptor…</option>
                {descriptors.filter(d => !myBindings.some(b => b.descriptor_id === d.id)).map(d => (
                  <option key={d.id} value={d.id}>{d.category}:{d.key}={d.value}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
