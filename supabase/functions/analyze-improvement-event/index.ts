import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  event_type: string;
  context: string;
  details: any;
  agent_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { event_type, context, details, agent_id } = await req.json() as AnalysisRequest;
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔍 Analyzing improvement event:', event_type);

    // 1. Get recent similar events for pattern detection
    const { data: recentEvents } = await supabase
      .from('improvement_events')
      .select('*')
      .eq('event_type', event_type)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    // 2. AI Analysis - Pattern Recognition
    const patternAnalysis = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
            content: `You are an expert system analyzer. Detect patterns in system events and recommend improvements.

Return JSON:
{
  "is_pattern": boolean,
  "pattern_type": "performance_bottleneck" | "error_pattern" | "user_friction" | "inefficiency" | "resource_waste",
  "pattern_signature": "unique_identifier",
  "severity": "low" | "medium" | "high" | "critical",
  "root_cause": "detailed analysis of why this happens",
  "impact": {
    "affected_components": ["comp1", "comp2"],
    "estimated_impact_score": 0-1,
    "user_facing": boolean
  },
  "recommended_actions": [{
    "action": "specific action to take",
    "effort": "trivial" | "minor" | "moderate" | "major",
    "expected_improvement": "what will improve",
    "implementation_hints": ["hint1", "hint2"]
  }]
}`
          },
          {
            role: 'user',
            content: `Current Event:
Type: ${event_type}
Context: ${context}
Details: ${JSON.stringify(details)}
Agent: ${agent_id || 'system'}

Recent Similar Events (${recentEvents?.length || 0}):
${recentEvents?.map(e => `- ${e.context} (${new Date(e.created_at).toLocaleDateString()})`).join('\n') || 'None'}

Analyze for patterns and recommend improvements.`
          }
        ],
        max_completion_tokens: 1500
      })
    });

    const analysisResult = await patternAnalysis.json();
    
    if (!analysisResult.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response');
    }

    const analysis = JSON.parse(analysisResult.choices[0].message.content);

    console.log('📊 Analysis result:', {
      is_pattern: analysis.is_pattern,
      pattern_type: analysis.pattern_type,
      severity: analysis.severity
    });

    // 3. If pattern detected, create or update pattern record
    if (analysis.is_pattern) {
      const { data: existingPattern } = await supabase
        .from('improvement_patterns')
        .select('*')
        .eq('pattern_signature', analysis.pattern_signature)
        .maybeSingle();

      if (existingPattern) {
        // Update existing pattern
        await supabase
          .from('improvement_patterns')
          .update({
            occurrence_count: existingPattern.occurrence_count + 1,
            last_detected: new Date().toISOString(),
            impact_assessment: analysis.impact,
            suggested_actions: analysis.recommended_actions,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPattern.id);

        console.log('✅ Updated existing pattern:', existingPattern.id);
        
        return new Response(JSON.stringify({
          pattern_detected: true,
          pattern_id: existingPattern.id,
          action: 'updated',
          analysis
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        // Create new pattern
        const { data: newPattern } = await supabase
          .from('improvement_patterns')
          .insert({
            pattern_type: analysis.pattern_type,
            pattern_signature: analysis.pattern_signature,
            severity: analysis.severity,
            impact_assessment: analysis.impact,
            root_cause_analysis: { root_cause: analysis.root_cause },
            suggested_actions: analysis.recommended_actions,
            estimated_effort: analysis.recommended_actions[0]?.effort || 'moderate'
          })
          .select()
          .single();

        console.log('✅ Created new pattern:', newPattern.id);

        // 4. If high severity, auto-create improvement decision
        if (analysis.severity === 'high' || analysis.severity === 'critical') {
          console.log('🚨 High severity - creating improvement decision');
          
          const { data: decision } = await supabase
            .from('improvement_decisions')
            .insert({
              pattern_id: newPattern.id,
              action_type: analysis.recommended_actions[0]?.action || 'investigation',
              action_description: analysis.root_cause,
              implementation_plan: {
                steps: analysis.recommended_actions[0]?.implementation_hints || [],
                estimated_effort: analysis.recommended_actions[0]?.effort
              },
              risk_level: analysis.severity === 'critical' ? 'high' : 'medium',
              agent_votes: []
            })
            .select()
            .single();

          return new Response(JSON.stringify({
            pattern_detected: true,
            pattern_id: newPattern.id,
            decision_created: true,
            decision_id: decision.id,
            action: 'created',
            analysis,
            recommendation: 'High severity issue detected - improvement decision created for agent review'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({
          pattern_detected: true,
          pattern_id: newPattern.id,
          action: 'created',
          analysis
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // No pattern detected
    return new Response(JSON.stringify({
      pattern_detected: false,
      analysis: {
        event_type,
        assessed: true,
        recommendation: 'No actionable pattern detected yet. Monitoring for recurrence.'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error analyzing improvement event:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to analyze improvement event'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
