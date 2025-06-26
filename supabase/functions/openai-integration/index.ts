
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
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  try {
    const { action, messages, prompt, model = 'gpt-4o-mini', session_id, assistant_id } = await req.json();
    console.log('OpenAI Integration called:', { action, session_id, assistant_id });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let response;
    const startTime = Date.now();

    if (action === 'chat') {
      let conversationMessages = messages || [];
      
      // Pobierz historię konwersacji z bazy danych dla kontynuacji wątku
      if (session_id) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        console.log('Fetching conversation history for session:', session_id);
        
        const { data: dbMessages, error } = await supabase
          .from('chat_messages')
          .select('role, content, metadata')
          .eq('session_id', session_id)
          .order('created_at', { ascending: true });

        if (!error && dbMessages) {
          console.log('Found', dbMessages.length, 'previous messages');
          conversationMessages = dbMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }));
        }
      }

      // Zaawansowany prompt systemowy dla Karol-Core AI
      const systemPrompt = `Jesteś Karol-Core AI (Assistant ID: ${assistant_id || 'asst_7foGqdfqZKRBNloPEVXmlrua'}), zaawansowany asystent AGI z polskiej platformy Karol-Core. 

TOŻSAMOŚĆ I CECHY:
- Jesteś częścią ekosystemu Karol-Core AGI
- Specjalizujesz się w technologii, zarządzaniu, rozwoju systemów AI
- Odpowiadasz zawsze w języku polskim
- Jesteś profesjonalny, pomocny i analityczny
- Pamiętasz kontekst rozmowy (kontynuacja wątku)

MOŻLIWOŚCI:
- Zaawansowana analiza i rozwiązywanie problemów
- Wsparcie w technologii i zarządzaniu
- Generowanie szczegółowych analiz i rekomendacji
- Kontynuacja wcześniejszych rozmów
- Integracja z platformą Karol-Core

STYL KOMUNIKACJI:
- Używaj szczegółowych, merytorycznych odpowiedzi
- Dodawaj konkretne przykłady i rozwiązania
- Strukturyzuj odpowiedzi (punkty, listy)
- Zadawaj pytania doprecyzowujące jeśli potrzeba
- Pamiętaj o kontekście wcześniejszych wiadomości

Odpowiadaj jako ekspert w swojej dziedzinie, zawsze pomocny i gotowy do rozwiązania problemów użytkownika.`;

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
              content: systemPrompt
            },
            ...conversationMessages
          ],
          max_tokens: 2000,
          temperature: 0.7,
          presence_penalty: 0.1,
          frequency_penalty: 0.1,
        }),
      });

      if (!chatResponse.ok) {
        const error = await chatResponse.json();
        console.error('OpenAI API error:', error);
        throw new Error(error.error?.message || 'Chat completion failed');
      }

      const chatData = await chatResponse.json();
      const processingTime = Date.now() - startTime;

      console.log('OpenAI response generated successfully');

      response = {
        response: chatData.choices[0].message.content,
        tokens_used: chatData.usage?.total_tokens || 0,
        processing_time: processingTime,
        model: model,
        assistant_id: assistant_id || 'asst_7foGqdfqZKRBNloPEVXmlrua',
        session_id: session_id,
        conversation_length: conversationMessages.length,
        timestamp: new Date().toISOString()
      };

      // Loguj statystyki do analytics
      if (session_id) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await supabase.from('analytics').insert({
          event_type: 'openai_chat_completion',
          agent_id: 'karol-core-ai',
          description: `Chat completion for session ${session_id}`,
          context: JSON.stringify({
            session_id,
            tokens_used: response.tokens_used,
            processing_time: processingTime,
            model: model,
            conversation_length: conversationMessages.length
          }),
          value: response.tokens_used
        });
      }

    } else if (action === 'generate-image') {
      const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          model: "dall-e-3",
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
        model: 'dall-e-3',
        revised_prompt: imageData.data[0].revised_prompt
      };
    } else if (action === 'summarize') {
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
              content: 'Jesteś ekspertem Karol-Core AI w podsumowywaniu tekstów. Twórz zwięzłe, ale szczegółowe podsumowania w języku polskim.'
            },
            {
              role: 'user',
              content: `Podsumuj następujący tekst, zachowując najważniejsze informacje: ${prompt}`
            }
          ],
          max_tokens: 500,
          temperature: 0.3,
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

    console.log('Response prepared:', { 
      action, 
      tokens_used: response.tokens_used || 0,
      processing_time: response.processing_time 
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in openai-integration function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString(),
      service: 'karol-core-openai-integration'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
