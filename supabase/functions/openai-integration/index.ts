
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  try {
    const { action, messages, prompt, model = 'gpt-4o-mini', session_id } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let response;
    const startTime = Date.now();

    if (action === 'chat') {
      // Pobierz kontekst konwersacji z bazy danych jeśli podano session_id
      let conversationMessages = messages || [];
      
      if (session_id) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        const { data: dbMessages, error } = await supabase
          .from('chat_messages')
          .select('role, content')
          .eq('session_id', session_id)
          .order('created_at', { ascending: true });

        if (!error && dbMessages) {
          conversationMessages = dbMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }));
        }
      }

      // Chat completion z pełnym kontekstem
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
              content: 'Jesteś Karol-Core AI (asst_7foGqdfqZKRBNloPEVXmlrua), zaawansowany asystent AGI z polskiej platformy Karol-Core. Odpowiadaj w języku polskim, bądź pomocny i profesjonalny. Twoja wiedza obejmuje szeroki zakres tematów związanych z technologią, nauką, zarządzaniem i rozwojem systemów AI. Pamiętaj o swojej tożsamości jako część ekosystemu Karol-Core AGI.'
            },
            ...conversationMessages
          ],
          max_tokens: 1500,
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
        model: model,
        assistant_id: 'asst_7foGqdfqZKRBNloPEVXmlrua'
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
              content: 'Jesteś asystentem Karol-Core AI specjalizującym się w podsumowywaniu tekstów w języku polskim.'
            },
            {
              role: 'user',
              content: `Podsumuj następujący tekst: ${prompt}`
            }
          ],
          max_tokens: 300,
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
