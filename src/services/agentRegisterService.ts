/**
 * Agent Register Service — System 3: AI Register
 * Owner Registry, Version Registry, Compliance Registry, Model Provider Registry
 */

import { supabase } from '@/integrations/supabase/db';

export interface AgentOwner {
  id: string;
  user_id: string | null;
  name: string;
  organization: string | null;
  contact_email: string | null;
  tier: 'free' | 'pro' | 'enterprise';
  max_agents: number;
  created_at: string;
  updated_at: string;
}

export interface AgentVersion {
  id: string;
  agent_id: string;
  version: string;
  changelog: string | null;
  capabilities: string[];
  status: 'active' | 'deprecated' | 'beta' | 'archived';
  released_at: string;
  created_at: string;
}

export const agentRegisterService = {
  // --- Owner Registry ---
  async createOwner(data: { name: string; organization?: string; contact_email?: string; user_id?: string; tier?: string }): Promise<AgentOwner | null> {
    const { data: owner, error } = await supabase
      .from('agent_owners')
      .insert({
        name: data.name,
        organization: data.organization || null,
        contact_email: data.contact_email || null,
        user_id: data.user_id || null,
        tier: data.tier || 'free',
      })
      .select()
      .single();
    if (error) { console.error('[Register] Owner create failed:', error); return null; }
    return owner;
  },

  async getAllOwners(): Promise<AgentOwner[]> {
    const { data } = await supabase.from('agent_owners').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  // --- Version Registry ---
  async registerVersion(agentId: string, version: string, changelog?: string, capabilities?: string[]): Promise<AgentVersion | null> {
    const { data, error } = await supabase
      .from('agent_versions')
      .insert({ agent_id: agentId, version, changelog: changelog || null, capabilities: capabilities || [], status: 'active' })
      .select()
      .single();
    if (error) { console.error('[Register] Version create failed:', error); return null; }
    return data;
  },

  async getVersions(agentId: string): Promise<AgentVersion[]> {
    const { data } = await supabase
      .from('agent_versions')
      .select('*')
      .eq('agent_id', agentId)
      .order('released_at', { ascending: false });
    return data || [];
  },

  async getAllVersions(): Promise<AgentVersion[]> {
    const { data } = await supabase.from('agent_versions').select('*').order('released_at', { ascending: false });
    return data || [];
  },

  // --- Stats ---
  async getRegisterStats() {
    const owners = await this.getAllOwners();
    const versions = await this.getAllVersions();
    return {
      totalOwners: owners.length,
      totalVersions: versions.length,
      activeVersions: versions.filter(v => v.status === 'active').length,
      tiers: {
        free: owners.filter(o => o.tier === 'free').length,
        pro: owners.filter(o => o.tier === 'pro').length,
        enterprise: owners.filter(o => o.tier === 'enterprise').length,
      },
    };
  },
};
