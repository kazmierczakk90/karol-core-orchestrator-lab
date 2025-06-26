
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // First, handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  try {
    const { action, messages, prompt, model = 'gpt-4o-mini' } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let response;
    const startTime = Date.now();

    if (action === 'chat') {
      // Chat completion dla Live Chat
      const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'Jesteś Karol-Core AI, zaawansowany asystent AGI. Odpowiadaj w języku polskim, bądź pomocny i profesjonalny. Twoja wiedza obejmuje szeroki zakres tematów związanych z technologią, nauką i zarządzaniem.'
            },
            ...messages
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!chatResponse.ok) {
        const error = await chatResponse.json();
        throw new Error(error.error?.message || 'Chat completion failed');
      }

      const chatData = await chatResponse.json();
      const processingTime = Date.now() - startTime;

      response = {
        response: chatData.choices[0].message.content,
        tokens_used: chatData.usage?.total_tokens || 0,
        processing_time: processingTime,
        model: model
      };
    } else if (action === 'generate-image') {
      // Image generation
      const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          n: 1,
          size: "512x512",
        }),
      });

      if (!imageResponse.ok) {
        const error = await imageResponse.json();
        throw new Error(error.error?.message || 'Image generation failed');
      }

      const imageData = await imageResponse.json();
      const processingTime = Date.now() - startTime;

      response = {
        image_url: imageData.data[0].url,
        processing_time: processingTime,
        model: 'dall-e-3'
      };
    } else if (action === 'summarize') {
      // Text summarization
      const completionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that summarizes text.'
            },
            {
              role: 'user',
              content: `Summarize the following text: ${prompt}`
            }
          ],
          max_tokens: 150,
        }),
      });

      if (!completionResponse.ok) {
        const error = await completionResponse.json();
        throw new Error(error.error?.message || 'Text summarization failed');
      }

      const completionData = await completionResponse.json();
      const processingTime = Date.now() - startTime;

      response = {
        summary: completionData.choices[0].message.content,
        tokens_used: completionData.usage?.total_tokens || 0,
        processing_time: processingTime,
        model: model
      };
    } else {
      // Fallback dla nieznanych akcji
      throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in openai-integration function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
