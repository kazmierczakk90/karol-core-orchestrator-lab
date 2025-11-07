import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { researchId } = await req.json();
    
    if (!researchId) {
      throw new Error('Research ID is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get research record
    const { data: research, error: researchError } = await supabase
      .from('xds_research')
      .select('*')
      .eq('id', researchId)
      .single();

    if (researchError) throw researchError;
    if (!research) throw new Error('Research not found');

    console.log(`Processing research: ${research.query}`);

    // Stage 1: Analyze intention
    await supabase
      .from('xds_research')
      .update({ pipeline_stage: 1, status: 'processing' })
      .eq('id', researchId);

    const intentionResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{
          role: 'system',
          content: 'You are a research assistant. Analyze the user query and extract the core intention, required information types, and research scope. Respond in JSON format with: intention, information_types (array), scope, complexity_level.'
        }, {
          role: 'user',
          content: research.query
        }],
        max_tokens: 1000,
      }),
    });

    if (!intentionResponse.ok) throw new Error('Intention analysis failed');
    const intentionData = await intentionResponse.json();
    const intentionText = intentionData.choices?.[0]?.message?.content || '{}';
    const intention = JSON.parse(intentionText);

    await supabase
      .from('xds_research')
      .update({ intention_analysis: intention, pipeline_stage: 2 })
      .eq('id', researchId);

    // Stage 2: Generate search queries
    const queriesResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{
          role: 'system',
          content: 'Generate 3-5 diverse search queries to gather information. Return as JSON array of strings.'
        }, {
          role: 'user',
          content: `Original query: ${research.query}\nIntention: ${JSON.stringify(intention)}`
        }],
        max_tokens: 500,
      }),
    });

    if (!queriesResponse.ok) throw new Error('Query generation failed');
    const queriesData = await queriesResponse.json();
    const queriesText = queriesData.choices?.[0]?.message?.content || '[]';
    const queries = JSON.parse(queriesText);

    await supabase
      .from('xds_research')
      .update({ generated_queries: queries, pipeline_stage: 3 })
      .eq('id', researchId);

    // Stage 3: Simulate research results (in real implementation, this would fetch actual data)
    const simulatedResults = queries.map((query: string) => ({
      query,
      sources: [
        { url: 'https://example.com/1', title: `Result for ${query}`, snippet: 'Sample research data...' }
      ]
    }));

    await supabase
      .from('xds_research')
      .update({ research_results: simulatedResults, pipeline_stage: 4 })
      .eq('id', researchId);

    // Stage 4: Synthesize findings
    const synthesisResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{
          role: 'system',
          content: 'Synthesize research findings into a comprehensive summary. Be clear, structured, and cite key points.'
        }, {
          role: 'user',
          content: `Original query: ${research.query}\n\nFindings: ${JSON.stringify(simulatedResults)}`
        }],
        max_tokens: 2000,
      }),
    });

    if (!synthesisResponse.ok) throw new Error('Synthesis failed');
    const synthesisData = await synthesisResponse.json();
    const synthesis = synthesisData.choices?.[0]?.message?.content || '';

    await supabase
      .from('xds_research')
      .update({
        synthesis_result: synthesis,
        pipeline_stage: 5,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', researchId);

    console.log(`Research ${researchId} completed successfully`);

    return new Response(
      JSON.stringify({ success: true, researchId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in xds-process-research:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});