import { useEffect, useState } from 'react';
import { descriptorCatalog, type IDFCDescriptor, type DescriptorCategory } from '@/services/idfc/descriptorCatalog';

const CATEGORIES: DescriptorCategory[] = ['style','intent','context','risk','env','owner'];

export function DescriptorCatalogView() {
  const [items, setItems] = useState<IDFCDescriptor[]>([]);
  const [form, setForm] = useState({ key: '', value: '', category: 'style' as DescriptorCategory, description: '' });

  const load = async () => setItems(await descriptorCatalog.list());
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.key || !form.value) return;
    await descriptorCatalog.upsert(form);
    setForm({ key: '', value: '', category: 'style', description: '' });
    await load();
  };
  const remove = async (id: string) => { await descriptorCatalog.remove(id); await load(); };

  return (
    <div className="space-y-6">
      <div className="border border-lab-border p-4 bg-lab-background/40 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input placeholder="key (e.g. role)" value={form.key} onChange={e => setForm({ ...form, key: e.target.value })}
          className="bg-lab-background border border-lab-border px-3 py-2 text-xs text-lab-foreground" />
        <input placeholder="value (e.g. mentor)" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}
          className="bg-lab-background border border-lab-border px-3 py-2 text-xs text-lab-foreground" />
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as DescriptorCategory })}
          className="bg-lab-background border border-lab-border px-3 py-2 text-xs text-lab-foreground uppercase">
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder="description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
          className="bg-lab-background border border-lab-border px-3 py-2 text-xs text-lab-foreground" />
        <button onClick={add} className="px-3 py-2 border border-lab-accent text-lab-accent text-xs tracking-widest uppercase hover:bg-lab-accent hover:text-lab-background">Add</button>
      </div>

      <div className="grid gap-2">
        {CATEGORIES.map(cat => {
          const list = items.filter(i => i.category === cat);
          if (!list.length) return null;
          return (
            <div key={cat}>
              <div className="text-lab-muted text-xs uppercase tracking-widest mb-2">{cat}</div>
              <div className="flex flex-wrap gap-2">
                {list.map(d => (
                  <span key={d.id} className="px-2 py-1 text-[11px] border border-lab-border text-lab-foreground">
                    {d.key}={d.value}
                    <button onClick={() => remove(d.id)} className="ml-2 text-destructive">×</button>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
        {items.length === 0 && <p className="text-lab-muted text-sm">Catalog empty. Add a descriptor above.</p>}
      </div>
    </div>
  );
}
