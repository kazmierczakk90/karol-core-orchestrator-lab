import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.10";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmotionalAnalysisRequest {
  messageContent: string;
  agentId: string;
  sessionId?: string;
  messageId?: string;
  currentState?: {
    confidence: number;
    creativity: number;
    focus: number;
    empathy: number;
    curiosity: number;
  };
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

    const { messageContent, agentId, sessionId, messageId, currentState }: EmotionalAnalysisRequest = await req.json();

    console.log('[Emotional Analysis] Processing message for agent:', agentId);

    // Analyze sentiment and emotional impact using AI
    const analysisPrompt = `Analyze the emotional content of this message and provide:
1. Overall sentiment (positive/negative/neutral)
2. Sentiment score (-1 to 1)
3. Detected emotions (joy, sadness, anger, fear, surprise, disgust)
4. Recommended response tone
5. Suggested emotional adjustments for the AI agent's state

Message: "${messageContent}"

${currentState ? `Current agent state: confidence=${currentState.confidence}, creativity=${currentState.creativity}, focus=${currentState.focus}, empathy=${currentState.empathy}, curiosity=${currentState.curiosity}` : ''}

Respond in JSON format with: sentiment, sentimentScore, emotions (array), responseTone, stateAdjustments (object with keys: confidence, creativity, focus, empathy, curiosity - values between -10 and +10)`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert in emotional intelligence and sentiment analysis. Always respond with valid JSON.' },
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
    
    // Parse AI response
    let analysis;
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(analysisText);
    } catch (e) {
      console.error('[Emotional Analysis] Failed to parse AI response:', analysisText);
      throw new Error('Failed to parse emotional analysis');
    }

    // Store emotional context for message
    if (sessionId) {
      const { error: contextError } = await supabase
        .from('message_emotional_context')
        .insert({
          message_id: messageId,
          session_id: sessionId,
          detected_sentiment: analysis.sentiment || 'neutral',
          sentiment_score: analysis.sentimentScore || 0,
          emotional_adjustments: analysis.stateAdjustments || {},
          response_tone: analysis.responseTone || 'neutral',
        });

      if (contextError) {
        console.error('[Emotional Analysis] Failed to store context:', contextError);
      }
    }

    // Update or create emotional state for agent
    if (currentState && analysis.stateAdjustments) {
      const newState = {
        confidence: Math.max(0, Math.min(100, currentState.confidence + (analysis.stateAdjustments.confidence || 0))),
        creativity: Math.max(0, Math.min(100, currentState.creativity + (analysis.stateAdjustments.creativity || 0))),
        focus: Math.max(0, Math.min(100, currentState.focus + (analysis.stateAdjustments.focus || 0))),
        empathy: Math.max(0, Math.min(100, currentState.empathy + (analysis.stateAdjustments.empathy || 0))),
        curiosity: Math.max(0, Math.min(100, currentState.curiosity + (analysis.stateAdjustments.curiosity || 0))),
      };

      const { error: stateError } = await supabase
        .from('emotional_states')
        .insert({
          agent_id: agentId,
          ...newState,
          energy_level: 50,
          stress_level: Math.abs(analysis.sentimentScore || 0) * 50,
          context: {
            message_id: messageId,
            emotions: analysis.emotions || [],
          },
        });

      if (stateError) {
        console.error('[Emotional Analysis] Failed to store state:', stateError);
      }
    }

    // Create emotional memory for significant events
    const intensity = Math.abs(analysis.sentimentScore || 0) * 100;
    if (intensity > 50) {
      const { error: memoryError } = await supabase
        .from('emotional_memories')
        .insert({
          agent_id: agentId,
          event_description: messageContent.substring(0, 200),
          intensity,
          emotional_context: {
            sentiment: analysis.sentiment,
            emotions: analysis.emotions || [],
            score: analysis.sentimentScore,
          },
          impact_score: intensity,
        });

      if (memoryError) {
        console.error('[Emotional Analysis] Failed to store memory:', memoryError);
      }
    }

    console.log('[Emotional Analysis] Completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        analysis: {
          sentiment: analysis.sentiment,
          sentimentScore: analysis.sentimentScore,
          emotions: analysis.emotions || [],
          responseTone: analysis.responseTone,
          stateAdjustments: analysis.stateAdjustments || {},
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Emotional Analysis] Error:', error);
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
