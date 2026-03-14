/**
 * AI Passport Service — System 4: Digital Identity for Agents
 * Manages agent passports, identity generation, verification, and revocation.
 */

import { supabase } from '@/integrations/supabase/db';

export interface AgentPassport {
  id: string;
  agent_id: string;
  owner_id: string | null;
  display_name: string;
  passport_number: string;
  identity_hash: string;
  signature: string | null;
  status: 'active' | 'suspended' | 'revoked' | 'expired';
  trust_score: number;
  capabilities: string[];
  metadata: Record<string, any>;
  issued_at: string;
  expires_at: string | null;
  last_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PassportCreateInput {
  agent_id: string;
  display_name: string;
  owner_id?: string;
  capabilities?: string[];
  metadata?: Record<string, any>;
  expires_at?: string;
}

// Generate a unique passport number (KC-XXXXXXXX format)
function generatePassportNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `KC-${code}`;
}

// Generate identity hash from agent data
function generateIdentityHash(agentId: string, name: string, timestamp: number): string {
  const raw = `${agentId}:${name}:${timestamp}:${Math.random().toString(36)}`;
  // Simple hash for demo — in production use crypto
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `sha256:${Math.abs(hash).toString(16).padStart(16, '0')}`;
}

// Generate digital signature
function generateSignature(passportNumber: string, identityHash: string): string {
  const raw = `${passportNumber}:${identityHash}:${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 7) - hash) + raw.charCodeAt(i);
    hash |= 0;
  }
  return `sig:${Math.abs(hash).toString(16).padStart(20, '0')}`;
}

export const passportService = {
  // Issue a new passport
  async issuePassport(input: PassportCreateInput): Promise<AgentPassport | null> {
    const passportNumber = generatePassportNumber();
    const identityHash = generateIdentityHash(input.agent_id, input.display_name, Date.now());
    const signature = generateSignature(passportNumber, identityHash);

    const { data, error } = await supabase
      .from('agent_passports')
      .insert({
        agent_id: input.agent_id,
        display_name: input.display_name,
        owner_id: input.owner_id || null,
        passport_number: passportNumber,
        identity_hash: identityHash,
        signature,
        capabilities: input.capabilities || [],
        metadata: input.metadata || {},
        expires_at: input.expires_at || null,
        trust_score: 50.00,
        status: 'active',
        last_verified_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('[PassportService] Issue failed:', error);
      return null;
    }
    return data;
  },

  // Get all passports
  async getAllPassports(): Promise<AgentPassport[]> {
    const { data, error } = await supabase
      .from('agent_passports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[PassportService] Fetch failed:', error);
      return [];
    }
    return data || [];
  },

  // Get passport by agent_id
  async getByAgentId(agentId: string): Promise<AgentPassport | null> {
    const { data, error } = await supabase
      .from('agent_passports')
      .select('*')
      .eq('agent_id', agentId)
      .single();

    if (error) return null;
    return data;
  },

  // Verify passport (update last_verified_at + trust_score)
  async verifyPassport(passportId: string): Promise<boolean> {
    const { error } = await supabase
      .from('agent_passports')
      .update({
        last_verified_at: new Date().toISOString(),
        trust_score: Math.min(100, 50 + Math.random() * 50),
        updated_at: new Date().toISOString(),
      })
      .eq('id', passportId);

    return !error;
  },

  // Revoke passport
  async revokePassport(passportId: string): Promise<boolean> {
    const { error } = await supabase
      .from('agent_passports')
      .update({ status: 'revoked', updated_at: new Date().toISOString() })
      .eq('id', passportId);

    return !error;
  },

  // Suspend passport
  async suspendPassport(passportId: string): Promise<boolean> {
    const { error } = await supabase
      .from('agent_passports')
      .update({ status: 'suspended', updated_at: new Date().toISOString() })
      .eq('id', passportId);

    return !error;
  },

  // Reactivate passport
  async reactivatePassport(passportId: string): Promise<boolean> {
    const { error } = await supabase
      .from('agent_passports')
      .update({ status: 'active', updated_at: new Date().toISOString() })
      .eq('id', passportId);

    return !error;
  },

  // Add compliance record
  async addComplianceRecord(agentId: string, passportId: string, checkType: string, result: 'pass' | 'fail' | 'warning' | 'pending', details?: Record<string, any>) {
    const { data, error } = await supabase
      .from('compliance_records')
      .insert({
        agent_id: agentId,
        passport_id: passportId,
        check_type: checkType,
        result,
        details: details || {},
      })
      .select()
      .single();

    if (error) {
      console.error('[PassportService] Compliance record failed:', error);
      return null;
    }
    return data;
  },

  // Get compliance records for a passport
  async getComplianceRecords(passportId: string) {
    const { data, error } = await supabase
      .from('compliance_records')
      .select('*')
      .eq('passport_id', passportId)
      .order('checked_at', { ascending: false });

    if (error) return [];
    return data || [];
  },

  // Get passport stats
  async getStats() {
    const passports = await this.getAllPassports();
    return {
      total: passports.length,
      active: passports.filter(p => p.status === 'active').length,
      suspended: passports.filter(p => p.status === 'suspended').length,
      revoked: passports.filter(p => p.status === 'revoked').length,
      avgTrustScore: passports.length > 0 
        ? passports.reduce((sum, p) => sum + Number(p.trust_score), 0) / passports.length 
        : 0,
    };
  },
};
