import { useState } from 'react';
import { InstanceMap } from './idfc/InstanceMap';
import { DescriptorCatalogView } from './idfc/DescriptorCatalog';
import { RouterConsole } from './idfc/RouterConsole';
import { DriftMonitor } from './idfc/DriftMonitor';

type Tab = 'instances' | 'descriptors' | 'router' | 'drift';

export function IDFCPanel() {
  const [tab, setTab] = useState<Tab>('instances');
  const tabs: { id: Tab; label: string }[] = [
    { id: 'instances', label: 'Live Instance Map' },
    { id: 'descriptors', label: 'Descriptor Catalog' },
    { id: 'router', label: 'Semantic Router' },
    { id: 'drift', label: 'Drift Monitor' },
  ];
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lab-foreground text-lg tracking-widest uppercase">IDFC — Instance · Descriptor Fusion Core</h2>
        <p className="text-lab-muted text-xs mt-2 max-w-3xl">
          Hybrydowy moduł L3⊕L5: każda żywa instancja FUKO jest natychmiast wzbogacona o pełny kontekst semantyczny —
          bez przechodzenia przez warstwę komórek decyzyjnych (L4).
        </p>
      </div>
      <div className="flex gap-6 border-b border-lab-border">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`pb-3 text-xs tracking-widest uppercase transition-colors ${tab === t.id ? 'text-lab-accent border-b-2 border-lab-accent' : 'text-lab-muted hover:text-lab-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div>
        {tab === 'instances' && <InstanceMap />}
        {tab === 'descriptors' && <DescriptorCatalogView />}
        {tab === 'router' && <RouterConsole />}
        {tab === 'drift' && <DriftMonitor />}
      </div>
    </div>
  );
}
