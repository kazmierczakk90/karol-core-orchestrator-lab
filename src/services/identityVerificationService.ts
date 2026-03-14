/**
 * Identity Verification Service — System 4: AI Passport
 * Handles verification workflows, trust scoring, and identity integrity checks.
 */

import { passportService, AgentPassport } from './passportService';
import { supabase } from '@/integrations/supabase/db';

export interface VerificationResult {
  passed: boolean;
  score: number;
  checks: VerificationCheck[];
  timestamp: string;
}

export interface VerificationCheck {
  name: string;
  passed: boolean;
  details: string;
  weight: number;
}

export const identityVerificationService = {
  // Full identity verification pipeline
  async verifyIdentity(passportId: string): Promise<VerificationResult> {
    const { data: passport } = await supabase
      .from('agent_passports')
      .select('*')
      .eq('id', passportId)
      .single();

    if (!passport) {
      return { passed: false, score: 0, checks: [], timestamp: new Date().toISOString() };
    }

    const checks: VerificationCheck[] = [
      this.checkIdentityHash(passport),
      this.checkSignature(passport),
      this.checkExpiration(passport),
      this.checkCapabilities(passport),
      this.checkMetadataIntegrity(passport),
    ];

    const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
    const passedWeight = checks.filter(c => c.passed).reduce((sum, c) => sum + c.weight, 0);
    const score = totalWeight > 0 ? (passedWeight / totalWeight) * 100 : 0;
    const passed = score >= 60;

    // Record compliance
    await passportService.addComplianceRecord(
      passport.agent_id,
      passportId,
      'full_verification',
      passed ? 'pass' : 'fail',
      { score, checks: checks.map(c => ({ name: c.name, passed: c.passed })) }
    );

    // Update trust score
    if (passed) {
      await supabase
        .from('agent_passports')
        .update({
          trust_score: Math.min(100, score),
          last_verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', passportId);
    }

    return { passed, score, checks, timestamp: new Date().toISOString() };
  },

  checkIdentityHash(passport: any): VerificationCheck {
    const valid = passport.identity_hash && passport.identity_hash.startsWith('sha256:');
    return {
      name: 'Identity Hash',
      passed: valid,
      details: valid ? 'Hash format valid' : 'Invalid or missing hash',
      weight: 30,
    };
  },

  checkSignature(passport: any): VerificationCheck {
    const valid = passport.signature && passport.signature.startsWith('sig:');
    return {
      name: 'Digital Signature',
      passed: valid,
      details: valid ? 'Signature present and formatted' : 'Missing or invalid signature',
      weight: 25,
    };
  },

  checkExpiration(passport: any): VerificationCheck {
    if (!passport.expires_at) {
      return { name: 'Expiration', passed: true, details: 'No expiration set', weight: 15 };
    }
    const valid = new Date(passport.expires_at) > new Date();
    return {
      name: 'Expiration',
      passed: valid,
      details: valid ? 'Passport not expired' : 'Passport has expired',
      weight: 15,
    };
  },

  checkCapabilities(passport: any): VerificationCheck {
    const caps = passport.capabilities || [];
    const valid = Array.isArray(caps) && caps.length > 0;
    return {
      name: 'Capabilities',
      passed: valid,
      details: valid ? `${caps.length} capabilities registered` : 'No capabilities defined',
      weight: 15,
    };
  },

  checkMetadataIntegrity(passport: any): VerificationCheck {
    const meta = passport.metadata || {};
    const valid = typeof meta === 'object' && meta !== null;
    return {
      name: 'Metadata Integrity',
      passed: valid,
      details: valid ? 'Metadata structure valid' : 'Corrupted metadata',
      weight: 15,
    };
  },

  // Batch verify all active passports
  async batchVerify(): Promise<{ verified: number; failed: number }> {
    const passports = await passportService.getAllPassports();
    const active = passports.filter(p => p.status === 'active');
    let verified = 0, failed = 0;

    for (const p of active) {
      const result = await this.verifyIdentity(p.id);
      if (result.passed) verified++;
      else failed++;
    }

    return { verified, failed };
  },
};
