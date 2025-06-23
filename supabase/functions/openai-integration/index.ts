
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OpenAIRequest {
  action: 'chat' | 'completion' | 'embedding' | 'image_generation';
  messages?: any[];
  prompt?: string;
  model?: string;
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  agent_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use the provided OpenAI API key
    const openaiKey = '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';
    
    if (!openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { 
      action, 
      messages, 
      prompt, 
      model = 'gpt-4', 
      stream = false,
      max_tokens = 1000,
      temperature = 0.7,
      agent_id = 'system'
    }: OpenAIRequest = await req.json();

    console.log(`OpenAI Integration: Processing ${action} request for agent ${agent_id}`);

    let result;

    switch (action) {
      case 'chat':
        result = await handleChat(openaiKey, messages, model, max_tokens, temperature, stream);
        break;
      
      case 'completion':
        result = await handleCompletion(openaiKey, prompt, model, max_tokens, temperature);
        break;
      
      case 'embedding':
        result = await handleEmbedding(openaiKey, prompt);
        break;
      
      case 'image_generation':
        result = await handleImageGeneration(openaiKey, prompt);
        break;
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Log the API usage
    await supabase.from('analytics').insert({
      event_type: 'openai_api_call',
      agent_id,
      description: `${action} request processed successfully`,
      value: 1,
      context: JSON.stringify({ 
        model, 
        action, 
        tokens_used: result.usage?.total_tokens || 0,
        timestamp: new Date().toISOString()
      })
    });

    if (stream && action === 'chat') {
      // Handle streaming response
      return new Response(result.stream, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      });
    }

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('OpenAI Integration Error:', error);
    
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

async function handleChat(apiKey: string, messages: any[], model: string, maxTokens: number, temperature: number, stream: boolean) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
      stream
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }

  if (stream) {
    return {
      stream: response.body,
      headers: response.headers
    };
  }

  return await response.json();
}

async function handleCompletion(apiKey: string, prompt: string, model: string, maxTokens: number, temperature: number) {
  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model.includes('gpt') ? 'gpt-3.5-turbo-instruct' : model,
      prompt,
      max_tokens: maxTokens,
      temperature
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }

  return await response.json();
}

async function handleEmbedding(apiKey: string, text: string) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: text
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }

  return await response.json();
}

async function handleImageGeneration(apiKey: string, prompt: string) {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard'
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }

  return await response.json();
}
