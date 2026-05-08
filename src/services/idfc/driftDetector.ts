import { db } from '@/integrations/supabase/db';

export interface DriftAlert {
  instance_id: string;
  fuko_module: string;
  reason: string;
  severity: 'low'|'medium'|'high';
}

export const driftDetector = {
  async scan(): Promise<DriftAlert[]> {
    const alerts: DriftAlert[] = [];
    const { data: instances } = await db.from('idfc_instances').select('*');
    const { data: bindings } = await db.from('idfc_bindings').select('*');
    const { data: descriptors } = await db.from('idfc_descriptors').select('*');

    const descById = new Map((descriptors || []).map((d: any) => [d.id, d]));

    for (const inst of (instances || []) as any[]) {
      const bs = (bindings || []).filter((b: any) => b.instance_id === inst.id);
      // Drift 1: active instance with no descriptors
      if (inst.status === 'active' && bs.length === 0) {
        alerts.push({ instance_id: inst.id, fuko_module: inst.fuko_module, reason: 'Active instance has no descriptors', severity: 'medium' });
      }
      // Drift 2: TTL exceeded
      if (inst.ttl_seconds && inst.status === 'active') {
        const elapsed = (Date.now() - new Date(inst.started_at).getTime()) / 1000;
        if (elapsed > inst.ttl_seconds) {
          alerts.push({ instance_id: inst.id, fuko_module: inst.fuko_module, reason: `TTL exceeded (${Math.floor(elapsed)}s > ${inst.ttl_seconds}s)`, severity: 'high' });
        }
      }
      // Drift 3: conflicting style descriptors
      const styles = bs.map((b: any) => descById.get(b.descriptor_id)).filter((d: any) => d?.category === 'style');
      const styleValues = new Set(styles.map((d: any) => d.value));
      if (styleValues.size > 1) {
        alerts.push({ instance_id: inst.id, fuko_module: inst.fuko_module, reason: `Conflicting styles: ${[...styleValues].join(', ')}`, severity: 'high' });
      }
    }
    return alerts;
  },
};
