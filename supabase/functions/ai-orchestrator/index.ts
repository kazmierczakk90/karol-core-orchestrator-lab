
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AIRequest {
  action: 'process_decision' | 'route_agent' | 'execute_workflow' | 'cognitive_analysis';
  payload: any;
  agent_id?: string;
  priority?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, payload, agent_id, priority = 5 }: AIRequest = await req.json();

    console.log(`AI Orchestrator: Processing ${action} for agent ${agent_id}`);

    let result;

    switch (action) {
      case 'process_decision':
        result = await processDecision(supabase, payload, agent_id);
        break;
      
      case 'route_agent':
        result = await routeAgent(supabase, payload);
        break;
      
      case 'execute_workflow':
        result = await executeWorkflow(supabase, payload, agent_id);
        break;
      
      case 'cognitive_analysis':
        result = await cognitiveAnalysis(supabase, payload);
        break;
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Log the operation
    await supabase.from('logs').insert({
      log_type: 'ai_orchestrator',
      agent_id: agent_id || 'system',
      message: `Executed ${action}`,
      details: { action, payload, result }
    });

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI Orchestrator Error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function processDecision(supabase: any, payload: any, agentId: string) {
  // Create meta decision entry
  const { data: decision, error } = await supabase
    .from('meta_decisions')
    .insert({
      decision_type: payload.type || 'general',
      source_agent: agentId || 'system',
      target_agent: payload.target_agent,
      priority: payload.priority || 5,
      context: payload.context || {},
      status: 'processing'
    })
    .select()
    .single();

  if (error) throw error;

  // Calculate routing score
  const routingScore = await calculateRoutingScore(payload);
  
  // Update decision with routing score
  await supabase
    .from('meta_decisions')
    .update({ 
      routing_score: routingScore,
      status: 'routed'
    })
    .eq('id', decision.id);

  return {
    decision_id: decision.id,
    routing_score: routingScore,
    status: 'processed'
  };
}

async function routeAgent(supabase: any, payload: any) {
  // Get available agents
  const { data: agents } = await supabase
    .from('agents')
    .select('*')
    .eq('status', 'active')
    .eq('is_active', true);

  if (!agents || agents.length === 0) {
    throw new Error('No active agents available');
  }

  // Simple routing logic - can be enhanced with ML
  const bestAgent = agents.reduce((best: any, current: any) => {
    const currentScore = calculateAgentScore(current, payload);
    const bestScore = calculateAgentScore(best, payload);
    return currentScore > bestScore ? current : best;
  });

  // Update agent state
  await supabase
    .from('agent_states')
    .upsert({
      agent_id: bestAgent.id,
      current_status: 'assigned',
      load_level: (bestAgent.load_level || 0) + 1,
      updated_at: new Date().toISOString()
    });

  return {
    selected_agent: bestAgent.id,
    agent_name: bestAgent.name,
    routing_reason: 'best_capability_match'
  };
}

async function executeWorkflow(supabase: any, payload: any, agentId: string) {
  const { workflow_steps, context } = payload;
  
  const results = [];
  
  for (const step of workflow_steps) {
    try {
      const stepResult = await executeWorkflowStep(supabase, step, context, agentId);
      results.push(stepResult);
      
      // Update context with step result
      context.previous_results = results;
      
    } catch (error) {
      console.error(`Workflow step failed:`, error);
      results.push({
        step_id: step.id,
        status: 'failed',
        error: error.message
      });
      
      if (step.required) {
        throw new Error(`Required workflow step failed: ${step.id}`);
      }
    }
  }

  return {
    workflow_status: 'completed',
    steps_executed: results.length,
    results
  };
}

async function cognitiveAnalysis(supabase: any, payload: any) {
  const { content, analysis_type = 'general' } = payload;
  
  // Simple cognitive analysis - can be enhanced with ML models
  const analysis = {
    content_length: content.length,
    complexity_score: Math.min(content.length / 100, 10),
    sentiment: analyzeSentiment(content),
    key_concepts: extractKeyConcepts(content),
    analysis_type,
    timestamp: new Date().toISOString()
  };

  // Store analysis result
  await supabase.from('analytics').insert({
    event_type: 'cognitive_analysis',
    value: analysis.complexity_score,
    description: `Cognitive analysis: ${analysis_type}`,
    context: JSON.stringify(analysis)
  });

  return analysis;
}

async function executeWorkflowStep(supabase: any, step: any, context: any, agentId: string) {
  // Simulate workflow step execution
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    step_id: step.id,
    status: 'completed',
    result: `Step ${step.name} executed successfully`,
    execution_time: Math.random() * 1000 + 100,
    agent_id: agentId
  };
}

function calculateRoutingScore(payload: any): number {
  // Simple scoring algorithm
  let score = 50;
  
  if (payload.priority) {
    score += payload.priority * 5;
  }
  
  if (payload.complexity) {
    score += payload.complexity * 3;
  }
  
  if (payload.urgency) {
    score += payload.urgency * 4;
  }
  
  return Math.min(Math.max(score, 0), 100);
}

function calculateAgentScore(agent: any, payload: any): number {
  let score = agent.performance || 85;
  
  if (agent.capabilities && payload.required_capabilities) {
    const matches = agent.capabilities.filter((cap: string) => 
      payload.required_capabilities.includes(cap)
    ).length;
    score += matches * 10;
  }
  
  // Penalize for high load
  score -= (agent.load_level || 0) * 5;
  
  return Math.max(score, 0);
}

function analyzeSentiment(content: string): string {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disappointing', 'poor'];
  
  const words = content.toLowerCase().split(/\s+/);
  const positive = words.filter(word => positiveWords.includes(word)).length;
  const negative = words.filter(word => negativeWords.includes(word)).length;
  
  if (positive > negative) return 'positive';
  if (negative > positive) return 'negative';
  return 'neutral';
}

function extractKeyConcepts(content: string): string[] {
  // Simple keyword extraction
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  const frequency: { [key: string]: number } = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
}
