import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DriftCheckRequest {
  agent_id: string;
  auto_correct?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agent_id, auto_correct = true } = await req.json() as DriftCheckRequest;
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🎯 Drift check for agent:', agent_id);

    // 1. Get agent's baseline characteristics
    const { data: agent } = await supabase
      .from('agents')
      .select('*')
      .eq('identifier', agent_id)
      .maybeSingle();

    if (!agent) {
      throw new Error(`Agent ${agent_id} not found`);
    }

    const { data: agentState } = await supabase
      .from('agent_states')
      .select('*')
      .eq('agent_id', agent_id)
      .maybeSingle();

    // 2. Get recent messages/interactions for style analysis
    const { data: recentMessages } = await supabase
      .from('chat_messages')
      .select('content, metadata')
      .eq('metadata->>agent_id', agent_id)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(20);

    // 3. Get baseline style metrics
    const expectedStyle = {
      type: agent.type,
      capabilities: agent.capabilities,
      performance: agent.performance,
      style_consistency: agentState?.style_consistency || 1.0
    };

    // 4. AI Analysis - Detect drift
    const driftAnalysis = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are analyzing agent behavioral drift. Compare current behavior to baseline.

Return JSON:
{
  "drift_detected": boolean,
  "drift_type": "style_drift" | "performance_degradation" | "behavior_anomaly",
  "drift_severity": 0-1,
  "specific_deviations": [{
    "aspect": "what changed",
    "expected": "what it should be",
    "actual": "what it is now",
    "severity": 0-1
  }],
  "root_cause": "why drift occurred",
  "correction_needed": boolean,
  "correction_approach": "how to fix",
  "correction_details": {
    "type": "prompt_adjustment" | "parameter_reset" | "style_recalibration",
    "changes": ["specific change 1", "specific change 2"]
  }
}`
          },
          {
            role: 'user',
            content: `Agent: ${agent_id}
Type: ${agent.type}
Expected Capabilities: ${agent.capabilities?.join(', ')}
Expected Performance: ${agent.performance}/100
Style Consistency: ${(agentState?.style_consistency || 1.0) * 100}%

Recent Messages (${recentMessages?.length || 0}):
${recentMessages?.slice(0, 5).map(m => m.content.substring(0, 200)).join('\n\n') || 'No recent messages'}

Analyze for drift from expected behavior.`
          }
        ],
        max_completion_tokens: 1000
      })
    });

    const analysisResult = await driftAnalysis.json();
    
    if (!analysisResult.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response');
    }

    const drift = JSON.parse(analysisResult.choices[0].message.content);

    console.log('📊 Drift analysis:', {
      detected: drift.drift_detected,
      type: drift.drift_type,
      severity: drift.drift_severity
    });

    if (!drift.drift_detected) {
      return new Response(JSON.stringify({
        agent_id,
        drift_detected: false,
        message: 'Agent behavior is within normal parameters'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 5. Save drift detection
    const { data: driftRecord } = await supabase
      .from('drift_corrections')
      .insert({
        agent_id,
        drift_type: drift.drift_type,
        drift_severity: drift.drift_severity,
        baseline_metrics: expectedStyle,
        current_metrics: {
          recent_performance: agentState?.performance_score || 85,
          style_consistency: agentState?.style_consistency || 1.0,
          message_count: recentMessages?.length || 0
        },
        deviation_details: drift.specific_deviations,
        correction_type: drift.correction_details.type,
        correction_applied: drift.correction_details,
        auto_corrected: auto_correct,
        manual_review_required: drift.drift_severity > 0.7
      })
      .select()
      .single();

    // 6. Apply auto-correction if enabled and safe
    let correctionApplied = false;
    if (auto_correct && drift.correction_needed && drift.drift_severity < 0.8) {
      console.log('🔧 Applying auto-correction:', drift.correction_details.type);

      if (drift.correction_details.type === 'style_recalibration') {
        // Update agent state to trigger style reset
        await supabase
          .from('agent_states')
          .update({
            style_consistency: 1.0,
            updated_at: new Date().toISOString()
          })
          .eq('agent_id', agent_id);

        correctionApplied = true;
      } else if (drift.correction_details.type === 'parameter_reset') {
        // Reset agent parameters
        await supabase
          .from('agent_states')
          .update({
            performance_score: 85,
            load_level: 0,
            updated_at: new Date().toISOString()
          })
          .eq('agent_id', agent_id);

        correctionApplied = true;
      }

      // Update drift record
      await supabase
        .from('drift_corrections')
        .update({
          corrected: true,
          correction_successful: true,
          verified_at: new Date().toISOString()
        })
        .eq('id', driftRecord.id);
    }

    return new Response(JSON.stringify({
      agent_id,
      drift_detected: true,
      drift_type: drift.drift_type,
      severity: drift.drift_severity,
      deviations: drift.specific_deviations,
      root_cause: drift.root_cause,
      correction_applied: correctionApplied,
      manual_review_required: drift.drift_severity > 0.7,
      drift_record_id: driftRecord.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error in drift correction:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to check/correct drift'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
