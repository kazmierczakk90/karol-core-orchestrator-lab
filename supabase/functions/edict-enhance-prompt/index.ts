import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.10";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EDICTRequest {
  originalPrompt: string;
  mode: 'lite' | 'advanced';
  userId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { originalPrompt, mode, userId }: EDICTRequest = await req.json();

    console.log('[EDICT] Processing prompt in mode:', mode);

    // Step 1: Analyze Intention
    const intentionPrompt = `Analyze the following user prompt and extract:
1. User's primary goal
2. Required context and domain knowledge
3. Complexity level (simple/medium/complex)
4. Domain (technology, creative, business, scientific, etc.)
5. Suggested approach for best results

User Prompt: "${originalPrompt}"

Respond in JSON format with: userGoal, contextRequired (array), complexityLevel, domain, suggestedApproach`;

    const intentionResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert at understanding user intentions and requirements. Always respond with valid JSON.' },
          { role: 'user', content: intentionPrompt }
        ],
      }),
    });

    if (!intentionResponse.ok) {
      if (intentionResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI API error: ${intentionResponse.status}`);
    }

    const intentionData = await intentionResponse.json();
    const intentionText = intentionData.choices[0].message.content;
    
    let intention;
    try {
      const jsonMatch = intentionText.match(/\{[\s\S]*\}/);
      intention = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(intentionText);
    } catch (e) {
      console.error('[EDICT] Failed to parse intention:', intentionText);
      throw new Error('Failed to parse intention analysis');
    }

    // Step 2: Enrich with Rules
    const baseRules = {
      clarity: [
        'Use specific, concrete language',
        'Define technical terms and acronyms',
        'Structure with clear sections',
      ],
      format: [
        'Use markdown for readability',
        'Include examples where helpful',
        'Break complex ideas into steps',
      ],
      quality: [
        'Verify all factual claims',
        'Consider edge cases',
        'Provide actionable insights',
      ],
    };

    const advancedRules = mode === 'advanced' ? {
      advanced: [
        'Include multiple perspectives',
        'Reference relevant frameworks or methodologies',
        'Anticipate follow-up questions',
      ],
      meta: [
        'Explain reasoning process',
        'Highlight assumptions',
        'Suggest alternative approaches',
      ],
    } : {};

    const enrichedRules = { ...baseRules, ...advancedRules };

    // Step 3: Generate Enhanced Prompt
    const enhancePrompt = `Based on this analysis, create an enhanced version of the original prompt that will yield better AI responses.

Original Prompt: "${originalPrompt}"

Intention Analysis:
- Goal: ${intention.userGoal}
- Domain: ${intention.domain}
- Complexity: ${intention.complexityLevel}
- Required Context: ${intention.contextRequired?.join(', ')}
- Suggested Approach: ${intention.suggestedApproach}

Applied Rules:
${Object.entries(enrichedRules).map(([category, rules]) => 
  `${category.toUpperCase()}:\n${(rules as string[]).map(r => `- ${r}`).join('\n')}`
).join('\n\n')}

Create an enhanced prompt that:
1. Maintains the original intent
2. Adds necessary context and constraints
3. Structures the request clearly
4. Specifies desired format and level of detail

Respond with just the enhanced prompt text, no JSON.`;

    const enhanceResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert at crafting effective prompts for AI systems.' },
          { role: 'user', content: enhancePrompt }
        ],
      }),
    });

    if (!enhanceResponse.ok) {
      throw new Error(`AI API error: ${enhanceResponse.status}`);
    }

    const enhanceData = await enhanceResponse.json();
    const generatedPrompt = enhanceData.choices[0].message.content;

    // Step 4: Store in Database
    const { data: savedPrompt, error: saveError } = await supabase
      .from('edict_prompts')
      .insert({
        user_id: userId,
        original_prompt: originalPrompt,
        analyzed_intention: intention,
        enriched_rules: enrichedRules,
        generated_prompt: generatedPrompt,
        orchestration_mode: mode,
      })
      .select()
      .single();

    if (saveError) {
      console.error('[EDICT] Failed to save prompt:', saveError);
    }

    console.log('[EDICT] Successfully enhanced prompt');

    return new Response(
      JSON.stringify({
        success: true,
        result: {
          id: savedPrompt?.id,
          originalPrompt,
          generatedPrompt,
          intention,
          rules: enrichedRules,
          mode,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[EDICT] Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
