import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.10";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuantumDecisionRequest {
  decisionContext: any;
  rootDecisionId?: string;
  maxPaths?: number;
  simulationIterations?: number;
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

    const { 
      decisionContext, 
      rootDecisionId, 
      maxPaths = 5,
      simulationIterations = 1000 
    }: QuantumDecisionRequest = await req.json();

    console.log('[Quantum Decision] Evaluating decision with', maxPaths, 'paths');

    // Step 1: Generate alternative decision paths using AI
    const pathGenerationPrompt = `Analyze this decision context and generate ${maxPaths} distinct decision paths:

Context: ${JSON.stringify(decisionContext, null, 2)}

For each path, provide:
1. Path description
2. Key steps/actions
3. Resource requirements
4. Dependencies
5. Estimated duration (in hours)
6. Execution complexity (low/medium/high/very_high)
7. Expected outcome (0-100 score)
8. Risk factors

Respond in JSON format with: paths (array of objects with above fields)`;

    const pathResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert in decision analysis and strategic planning. Always respond with valid JSON.' },
          { role: 'user', content: pathGenerationPrompt }
        ],
      }),
    });

    if (!pathResponse.ok) {
      if (pathResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI API error: ${pathResponse.status}`);
    }

    const pathData = await pathResponse.json();
    const pathText = pathData.choices[0].message.content;
    
    let pathsResult;
    try {
      const jsonMatch = pathText.match(/\{[\s\S]*\}/);
      pathsResult = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(pathText);
    } catch (e) {
      console.error('[Quantum Decision] Failed to parse paths:', pathText);
      throw new Error('Failed to parse decision paths');
    }

    const paths = pathsResult.paths || [];

    // Step 2: Create decision tree
    const { data: tree, error: treeError } = await supabase
      .from('decision_trees')
      .insert({
        root_decision_id: rootDecisionId,
        decision_context: decisionContext,
        available_paths: paths.length,
        explored_paths: 0,
      })
      .select()
      .single();

    if (treeError) {
      console.error('[Quantum Decision] Failed to create tree:', treeError);
      throw treeError;
    }

    // Step 3: Run Monte Carlo simulations for each path
    const simulationResults = [];

    for (const path of paths) {
      console.log('[Quantum Decision] Running Monte Carlo for path:', path.description);
      
      // Simulate outcomes
      const outcomes = [];
      for (let i = 0; i < simulationIterations; i++) {
        // Random variation around expected outcome
        const variance = (Math.random() - 0.5) * 20;
        const outcome = Math.max(0, Math.min(100, path.expectedOutcome + variance));
        outcomes.push(outcome);
      }

      const successRate = outcomes.filter(o => o >= 70).length / outcomes.length * 100;
      const avgOutcome = outcomes.reduce((a, b) => a + b, 0) / outcomes.length;
      const variance = outcomes.reduce((sum, val) => sum + Math.pow(val - avgOutcome, 2), 0) / outcomes.length;
      const riskScore = Math.min(100, (variance / 10) + ((100 - successRate) / 2));

      const { data: simulation, error: simError } = await supabase
        .from('monte_carlo_simulations')
        .insert({
          decision_tree_id: tree.id,
          path_id: crypto.randomUUID(),
          iterations: simulationIterations,
          success_rate: successRate,
          average_outcome: avgOutcome,
          variance,
          risk_score: riskScore,
          simulation_data: {
            outcomes: outcomes.slice(0, 100), // Store sample
            distribution: {
              min: Math.min(...outcomes),
              max: Math.max(...outcomes),
              median: outcomes.sort()[Math.floor(outcomes.length / 2)],
            },
          },
        })
        .select()
        .single();

      if (simError) {
        console.error('[Quantum Decision] Simulation error:', simError);
        continue;
      }

      // Calculate risk-adjusted value
      const riskAdjustment = (100 - riskScore) / 100;
      const riskAdjustedValue = avgOutcome * riskAdjustment;

      // Create path evaluation
      const complexityScores = { low: 90, medium: 70, high: 50, very_high: 30 };
      const complexityScore = complexityScores[path.executionComplexity as keyof typeof complexityScores] || 50;
      
      const evaluationScore = (
        riskAdjustedValue * 0.4 +
        successRate * 0.3 +
        complexityScore * 0.2 +
        (100 - riskScore) * 0.1
      );

      const { data: evaluation, error: evalError } = await supabase
        .from('path_evaluations')
        .insert({
          decision_tree_id: tree.id,
          path_sequence: path.steps,
          expected_value: avgOutcome,
          risk_adjusted_value: riskAdjustedValue,
          execution_complexity: path.executionComplexity,
          resource_requirements: path.resourceRequirements,
          estimated_duration: path.estimatedDuration,
          dependencies: path.dependencies || [],
          evaluation_score: evaluationScore,
          recommendation: evaluationScore >= 80 ? 'highly_recommended' : 
                         evaluationScore >= 60 ? 'recommended' :
                         evaluationScore >= 40 ? 'consider_with_caution' : 'not_recommended',
        })
        .select()
        .single();

      if (evalError) {
        console.error('[Quantum Decision] Evaluation error:', evalError);
        continue;
      }

      simulationResults.push({
        path: path.description,
        pathId: simulation.path_id,
        evaluationId: evaluation.id,
        successRate,
        avgOutcome,
        riskScore,
        riskAdjustedValue,
        evaluationScore,
        recommendation: evaluation.recommendation,
      });
    }

    // Step 4: Determine optimal path
    const optimalPath = simulationResults.reduce((best, current) => 
      current.evaluationScore > (best?.evaluationScore || 0) ? current : best
    , null as any);

    const { error: updateError } = await supabase
      .from('decision_trees')
      .update({
        explored_paths: paths.length,
        optimal_path_id: optimalPath?.pathId,
        confidence_score: optimalPath?.evaluationScore || 0,
        completed_at: new Date().toISOString(),
      })
      .eq('id', tree.id);

    if (updateError) {
      console.error('[Quantum Decision] Failed to update tree:', updateError);
    }

    console.log('[Quantum Decision] Evaluation complete. Optimal path:', optimalPath?.path);

    return new Response(
      JSON.stringify({
        success: true,
        treeId: tree.id,
        totalPaths: paths.length,
        optimalPath,
        allPaths: simulationResults,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Quantum Decision] Error:', error);
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
