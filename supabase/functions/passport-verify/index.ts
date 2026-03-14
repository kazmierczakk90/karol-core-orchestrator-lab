import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { passport_id } = await req.json();
    if (!passport_id) {
      return new Response(JSON.stringify({ error: 'passport_id required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: passport, error } = await supabase
      .from('agent_passports')
      .select('*')
      .eq('id', passport_id)
      .single();

    if (error || !passport) {
      return new Response(JSON.stringify({ error: 'Passport not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Verification checks
    const checks = [
      { name: 'identity_hash', passed: passport.identity_hash?.startsWith('sha256:'), weight: 30 },
      { name: 'signature', passed: passport.signature?.startsWith('sig:'), weight: 25 },
      { name: 'expiration', passed: !passport.expires_at || new Date(passport.expires_at) > new Date(), weight: 15 },
      { name: 'capabilities', passed: Array.isArray(passport.capabilities) && passport.capabilities.length > 0, weight: 15 },
      { name: 'status', passed: passport.status === 'active', weight: 15 },
    ];

    const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
    const passedWeight = checks.filter(c => c.passed).reduce((s, c) => s + c.weight, 0);
    const score = (passedWeight / totalWeight) * 100;
    const verified = score >= 60;

    // Update passport
    await supabase.from('agent_passports').update({
      trust_score: Math.min(100, score),
      last_verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', passport_id);

    // Record compliance
    await supabase.from('compliance_records').insert({
      agent_id: passport.agent_id,
      passport_id,
      check_type: 'api_verification',
      result: verified ? 'pass' : 'fail',
      details: { score, checks },
    });

    return new Response(JSON.stringify({ verified, score, checks, passport_number: passport.passport_number }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
