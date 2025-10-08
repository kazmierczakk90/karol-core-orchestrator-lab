
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { findBestAgent } from './routing.ts';
import { processCommand } from './commands.ts';
import { FukoMessage, FukoAgent } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { record: message } = await req.json() as { record: FukoMessage };
    console.log(`Processing FUKO message: ${message.id} - ${message.F}`);

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: agents, error: agentsError } = await supabaseAdmin
      .from('fuko_agents')
      .select('*')
      .eq('status', 'active');

    if (agentsError) throw agentsError;

    const bestAgent = await findBestAgent(agents as FukoAgent[], message, supabaseAdmin);

    if (bestAgent) {
      console.log(`Agent "${bestAgent.name}" selected for message ${message.id}`);
      const executionResult = processCommand(message.K2, bestAgent);

      const { error: updateError } = await supabaseAdmin
        .from('fuko_messages')
        .update({
          target_agent: bestAgent.id,
          status: 'completed',
          execution_result: executionResult,
        })
        .eq('id', message.id);
      
      if (updateError) throw updateError;
      console.log(`Message ${message.id} completed successfully.`);

    } else {
      console.warn(`No suitable agent found for message ${message.id}`);
      const { error: updateError } = await supabaseAdmin
        .from('fuko_messages')
        .update({
          status: 'failed',
          execution_result: 'No suitable agent found.',
        })
        .eq('id', message.id);

      if (updateError) throw updateError;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing FUKO message:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
