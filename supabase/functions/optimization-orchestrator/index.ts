import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.10";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OptimizationRequest {
  taskType: string;
  targetComponent: string;
  currentMetrics: any;
  targetMetrics: any;
  priority?: number;
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

    const { taskType, targetComponent, currentMetrics, targetMetrics, priority = 5 }: OptimizationRequest = await req.json();

    console.log('[Optimization] Analyzing optimization task:', taskType, targetComponent);

    // Step 1: AI analysis of optimization strategy
    const analysisPrompt = `Analyze this optimization task and provide a detailed strategy:

Task Type: ${taskType}
Target Component: ${targetComponent}
Current Metrics: ${JSON.stringify(currentMetrics, null, 2)}
Target Metrics: ${JSON.stringify(targetMetrics, null, 2)}

Provide:
1. Recommended optimization strategy (caching, code_refactoring, algorithm_improvement, resource_allocation, parallelization)
2. Expected improvement percentage (0-100)
3. Estimated impact (low/medium/high/critical)
4. Key steps to implement
5. Potential risks
6. Testing requirements

Respond in JSON format with: strategy, improvementPercentage, estimatedImpact, steps (array), risks (array), testingRequirements (array)`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert in software optimization and performance engineering. Always respond with valid JSON.' },
          { role: 'user', content: analysisPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const analysisText = aiData.choices[0].message.content;
    
    let analysis;
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(analysisText);
    } catch (e) {
      console.error('[Optimization] Failed to parse analysis:', analysisText);
      throw new Error('Failed to parse optimization analysis');
    }

    // Step 2: Create optimization task
    const { data: task, error: taskError } = await supabase
      .from('optimization_tasks')
      .insert({
        task_type: taskType,
        target_component: targetComponent,
        current_metrics: currentMetrics,
        target_metrics: targetMetrics,
        optimization_strategy: analysis.strategy,
        priority,
        status: 'analyzing',
        analysis_result: analysis,
        improvement_percentage: analysis.improvementPercentage,
        estimated_impact: analysis.estimatedImpact,
        created_by: 'optimization-orchestrator',
      })
      .select()
      .single();

    if (taskError) {
      console.error('[Optimization] Failed to create task:', taskError);
      throw taskError;
    }

    console.log('[Optimization] Task created:', task.id);

    // Step 3: Auto-implement if low risk and high priority
    if (priority >= 8 && analysis.estimatedImpact === 'critical' && analysis.risks.length === 0) {
      console.log('[Optimization] Auto-implementing high-priority, low-risk optimization');
      
      const { error: updateError } = await supabase
        .from('optimization_tasks')
        .update({
          status: 'implementing',
          started_at: new Date().toISOString(),
        })
        .eq('id', task.id);

      if (updateError) {
        console.error('[Optimization] Failed to update status:', updateError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        task: {
          id: task.id,
          strategy: analysis.strategy,
          improvementPercentage: analysis.improvementPercentage,
          estimatedImpact: analysis.estimatedImpact,
          steps: analysis.steps,
          risks: analysis.risks,
          testingRequirements: analysis.testingRequirements,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Optimization] Error:', error);
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
