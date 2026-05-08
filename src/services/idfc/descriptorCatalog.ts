import { db } from '@/integrations/supabase/db';

export type DescriptorCategory = 'style'|'intent'|'context'|'risk'|'env'|'owner';
export interface IDFCDescriptor {
  id: string;
  key: string;
  value: string;
  category: DescriptorCategory;
  description: string | null;
}

export const descriptorCatalog = {
  async list(): Promise<IDFCDescriptor[]> {
    const { data, error } = await db.from('idfc_descriptors').select('*').order('category');
    if (error) throw error;
    return data || [];
  },
  async upsert(d: { key: string; value: string; category: DescriptorCategory; description?: string }) {
    const { data, error } = await db.from('idfc_descriptors')
      .upsert({ key: d.key, value: d.value, category: d.category, description: d.description ?? null }, { onConflict: 'key,value' })
      .select().single();
    if (error) throw error;
    return data as IDFCDescriptor;
  },
  async remove(id: string) {
    const { error } = await db.from('idfc_descriptors').delete().eq('id', id);
    if (error) throw error;
  },
};
