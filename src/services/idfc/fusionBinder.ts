import { db } from '@/integrations/supabase/db';

export interface IDFCBinding {
  id: string;
  instance_id: string;
  descriptor_id: string;
  weight: number;
  bound_at: string;
}

export const fusionBinder = {
  async listForInstance(instance_id: string): Promise<IDFCBinding[]> {
    const { data, error } = await db.from('idfc_bindings').select('*').eq('instance_id', instance_id);
    if (error) throw error;
    return data || [];
  },
  async bind(instance_id: string, descriptor_id: string, weight = 1.0) {
    const { data, error } = await db.from('idfc_bindings')
      .insert({ instance_id, descriptor_id, weight })
      .select().single();
    if (error) throw error;
    await db.from('idfc_provenance').insert({ instance_id, action: 'bind', payload: { descriptor_id, weight } });
    return data as IDFCBinding;
  },
  async unbind(instance_id: string, descriptor_id: string) {
    const { error } = await db.from('idfc_bindings').delete().eq('instance_id', instance_id).eq('descriptor_id', descriptor_id);
    if (error) throw error;
    await db.from('idfc_provenance').insert({ instance_id, action: 'unbind', payload: { descriptor_id } });
  },
  async listAll(): Promise<IDFCBinding[]> {
    const { data, error } = await db.from('idfc_bindings').select('*');
    if (error) throw error;
    return data || [];
  },
};
