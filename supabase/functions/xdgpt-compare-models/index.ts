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
    const { modelIds, prompt } = await req.json();
    
    if (!modelIds || !Array.isArray(modelIds) || modelIds.length === 0) {
      throw new Error('Model IDs array is required');
    }
    
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Prompt is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch model configurations
    const { data: models, error: modelsError } = await supabase
      .from('xdgpt_models')
      .select('*')
      .in('id', modelIds)
      .eq('is_active', true);

    if (modelsError) throw modelsError;
    if (!models || models.length === 0) {
      throw new Error('No active models found');
    }

    console.log(`Comparing ${models.length} models with prompt: ${prompt.substring(0, 100)}...`);

    // Run all model requests in parallel
    const comparisons = await Promise.all(
      models.map(async (model) => {
        const startTime = Date.now();
        
        try {
          const config = model.configuration as { model: string; max_tokens?: number; max_completion_tokens?: number };
          
          const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${lovableApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: config.model,
              messages: [{ role: 'user', content: prompt }],
              max_tokens: config.max_tokens,
              max_completion_tokens: config.max_completion_tokens,
            }),
          });

          const responseTime = Date.now() - startTime;

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Model ${model.name} error:`, errorText);
            return {
              model: model.name,
              response: '',
              response_time: responseTime,
              error: `API Error: ${response.status} - ${errorText}`,
            };
          }

          const data = await response.json();
          const content = data.choices?.[0]?.message?.content || '';
          const tokensUsed = data.usage?.total_tokens || 0;

          return {
            model: model.name,
            response: content,
            tokens_used: tokensUsed,
            response_time: responseTime,
          };
        } catch (error) {
          console.error(`Error with model ${model.name}:`, error);
          return {
            model: model.name,
            response: '',
            response_time: Date.now() - startTime,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    return new Response(
      JSON.stringify({
        models: modelIds,
        prompt,
        results: comparisons,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in xdgpt-compare-models:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});