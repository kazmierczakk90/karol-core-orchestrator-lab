import { db } from '@/integrations/supabase/db';

export interface RouteQuery {
  fuko_module?: string;
  required_descriptors: string[]; // descriptor_id list
  weights?: Record<string, number>;
}

export interface RouteResult {
  instance_id: string;
  fuko_module: string;
  score: number;
  matched: string[];
}

export const semanticRouter = {
  async route(q: RouteQuery): Promise<RouteResult[]> {
    let instQ = db.from('idfc_instances').select('id, fuko_module, status').eq('status', 'active');
    if (q.fuko_module) instQ = instQ.eq('fuko_module', q.fuko_module);
    const { data: instances, error: e1 } = await instQ;
    if (e1) throw e1;
    const ids = (instances || []).map((i: any) => i.id);
    if (!ids.length) return [];
    const { data: bindings, error: e2 } = await db.from('idfc_bindings').select('*').in('instance_id', ids);
    if (e2) throw e2;

    const byInstance = new Map<string, any[]>();
    (bindings || []).forEach((b: any) => {
      if (!byInstance.has(b.instance_id)) byInstance.set(b.instance_id, []);
      byInstance.get(b.instance_id)!.push(b);
    });

    const results: RouteResult[] = [];
    for (const inst of instances as any[]) {
      const bs = byInstance.get(inst.id) || [];
      const ownDesc = new Set(bs.map(b => b.descriptor_id));
      const matched = q.required_descriptors.filter(d => ownDesc.has(d));
      if (!matched.length) continue;
      const score = matched.reduce((s, d) => {
        const b = bs.find(x => x.descriptor_id === d);
        const w = q.weights?.[d] ?? 1;
        return s + (b ? Number(b.weight) * w : 0);
      }, 0);
      results.push({ instance_id: inst.id, fuko_module: inst.fuko_module, score, matched });
    }
    return results.sort((a, b) => b.score - a.score);
  },
};
