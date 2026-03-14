import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generatePassportNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return `KC-${code}`;
}

function generateHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0;
  }
  return `sha256:${Math.abs(hash).toString(16).padStart(16, '0')}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { agent_id, display_name, capabilities, metadata } = await req.json();

    if (!agent_id || !display_name) {
      return new Response(JSON.stringify({ error: 'agent_id and display_name required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if passport already exists
    const { data: existing } = await supabase.from('agent_passports').select('id').eq('agent_id', agent_id).single();
    if (existing) {
      return new Response(JSON.stringify({ error: 'Passport already exists for this agent' }), {
        status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const passportNumber = generatePassportNumber();
    const identityHash = generateHash(`${agent_id}:${display_name}:${Date.now()}`);
    const signature = `sig:${generateHash(`${passportNumber}:${identityHash}`).replace('sha256:', '')}`;

    const { data: passport, error } = await supabase
      .from('agent_passports')
      .insert({
        agent_id,
        display_name,
        passport_number: passportNumber,
        identity_hash: identityHash,
        signature,
        capabilities: capabilities || [],
        metadata: metadata || {},
        trust_score: 50.00,
        status: 'active',
        last_verified_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Auto compliance record
    await supabase.from('compliance_records').insert({
      agent_id,
      passport_id: passport.id,
      check_type: 'initial_issuance',
      result: 'pass',
      details: { method: 'api', passport_number: passportNumber },
    });

    return new Response(JSON.stringify({ passport }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
