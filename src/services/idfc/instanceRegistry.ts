import { db } from '@/integrations/supabase/db';

export const FUKO_MODULES = [
  'PROB','RAM','ID','AUDITOR','MULTI','SYNC','OSINT','LICENSE','FAILSAFE','META_DECISION','META'
] as const;
export type FukoModule = typeof FUKO_MODULES[number];

export interface IDFCInstance {
  id: string;
  fuko_module: string;
  owner_id: string | null;
  status: string;
  ttl_seconds: number | null;
  started_at: string;
  stopped_at: string | null;
  metadata: Record<string, unknown>;
}

export const instanceRegistry = {
  async list(): Promise<IDFCInstance[]> {
    const { data, error } = await db.from('idfc_instances').select('*').order('started_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async create(fuko_module: FukoModule, opts?: { owner_id?: string; ttl_seconds?: number; metadata?: Record<string, unknown> }) {
    const { data, error } = await db.from('idfc_instances').insert({
      fuko_module,
      owner_id: opts?.owner_id ?? null,
      ttl_seconds: opts?.ttl_seconds ?? null,
      metadata: opts?.metadata ?? {},
    }).select().single();
    if (error) throw error;
    await db.from('idfc_provenance').insert({ instance_id: data.id, action: 'created', payload: { fuko_module } });
    return data as IDFCInstance;
  },
  async setStatus(id: string, status: 'active'|'paused'|'stopped') {
    const patch: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (status === 'stopped') patch.stopped_at = new Date().toISOString();
    const { error } = await db.from('idfc_instances').update(patch).eq('id', id);
    if (error) throw error;
    await db.from('idfc_provenance').insert({ instance_id: id, action: `status:${status}` });
  },
  async clone(id: string, mutate?: Record<string, unknown>) {
    const { data: src, error } = await db.from('idfc_instances').select('*').eq('id', id).single();
    if (error) throw error;
    const created = await this.create(src.fuko_module, {
      owner_id: src.owner_id,
      ttl_seconds: src.ttl_seconds,
      metadata: { ...src.metadata, cloned_from: id, ...(mutate || {}) },
    });
    return created;
  },
};
