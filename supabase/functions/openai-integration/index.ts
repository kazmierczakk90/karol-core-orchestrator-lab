
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface AssistantRequest {
  action: string;
  session_id: string;
  model?: string;
  assistant_id?: string;
  message?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 OpenAI Integration Function Called');
    
    const requestData: AssistantRequest = await req.json();
    console.log('📝 Request data:', JSON.stringify(requestData, null, 2));

    const { action, session_id, assistant_id = 'asst_7foGqdfqZKRBNloPEVXmlrua' } = requestData;

    if (action === 'chat') {
      // Pobierz sesję i wiadomości
      const { data: session, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', session_id)
        .single();

      if (sessionError) {
        console.error('❌ Session fetch error:', sessionError);
        throw new Error(`Session not found: ${sessionError.message}`);
      }

      console.log('✅ Session found:', session.id);

      // Pobierz wszystkie wiadomości z sesji
      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', session_id)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('❌ Messages fetch error:', messagesError);
        throw new Error(`Messages fetch error: ${messagesError.message}`);
      }

      console.log(`📨 Found ${messages?.length || 0} messages in session`);

      // Znajdź lub stwórz OpenAI Thread
      let threadId = session.metadata?.openai_thread_id;

      if (!threadId) {
        console.log('🆕 Creating new OpenAI Thread...');
        
        const threadResponse = await fetch('https://api.openai.com/v1/threads', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2',
          },
          body: JSON.stringify({
            metadata: {
              session_id: session_id,
              agent_id: session.agent_id,
              created_by: 'karol-core-live-chat'
            }
          }),
        });

        if (!threadResponse.ok) {
          const error = await threadResponse.text();
          console.error('❌ Thread creation failed:', error);
          throw new Error(`Thread creation failed: ${error}`);
        }

        const thread = await threadResponse.json();
        threadId = thread.id;

        console.log('✅ Thread created:', threadId);

        // Aktualizuj sesję z thread_id
        await supabase
          .from('chat_sessions')
          .update({
            metadata: {
              ...session.metadata,
              openai_thread_id: threadId,
              vector_store_id: 'vs_6850534726fc8191b5ef7a56e8fc4a3c'
            }
          })
          .eq('id', session_id);
      }

      console.log('🔗 Using Thread ID:', threadId);

      // Pobierz ostatnią wiadomość użytkownika
      const lastUserMessage = messages?.filter(m => m.role === 'user').pop();
      if (!lastUserMessage) {
        throw new Error('No user message found');
      }

      console.log('💬 Processing message:', lastUserMessage.content);

      // Dodaj wiadomość do Thread
      const messageResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2',
        },
        body: JSON.stringify({
          role: 'user',
          content: lastUserMessage.content,
          metadata: {
            session_id: session_id,
            message_id: lastUserMessage.id
          }
        }),
      });

      if (!messageResponse.ok) {
        const error = await messageResponse.text();
        console.error('❌ Message add failed:', error);
        throw new Error(`Message add failed: ${error}`);
      }

      console.log('✅ Message added to thread');

      // Uruchom Assistant
      const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2',
        },
        body: JSON.stringify({
          assistant_id: assistant_id,
          instructions: `Jesteś Karol-Core AI - zaawansowanym asystentem AGI z głęboką wiedzą o technologii, biznesie i zarządzaniu. 
          
Twoje główne funkcje:
- przekaz_dane_do_CEO: Przekazywanie ważnych informacji do systemu CEO
- przeslij_do_asystenta: Delegowanie zadań do innych asystentów
- pobierz_plik_z_magazynu: Dostęp do plików w Vector Store (vs_6850534726fc8191b5ef7a56e8fc4a3c)
- zapisz_dane_do_magazynu: Zapisywanie danych do Vector Store
- lista_plikow_w_magazynie: Wyświetlanie zawartości magazynu
- zarzadzanie_dostepem: Kontrola dostępu do zasobów

Odpowiadaj po polsku, profesjonalnie ale w przyjazny sposób. Używaj swojej wiedzy z Vector Store gdy to potrzebne.`,
          metadata: {
            session_id: session_id,
            agent_id: session.agent_id,
            vector_store_id: 'vs_6850534726fc8191b5ef7a56e8fc4a3c'
          }
        }),
      });

      if (!runResponse.ok) {
        const error = await runResponse.text();
        console.error('❌ Run creation failed:', error);
        throw new Error(`Run creation failed: ${error}`);
      }

      const run = await runResponse.json();
      console.log('🏃 Run started:', run.id);

      // Czekaj na zakończenie Run
      let runStatus = run;
      let attempts = 0;
      const maxAttempts = 30;

      while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
        if (attempts >= maxAttempts) {
          throw new Error('Run timeout - taking too long to complete');
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;

        const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${run.id}`, {
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'OpenAI-Beta': 'assistants=v2',
          },
        });

        if (statusResponse.ok) {
          runStatus = await statusResponse.json();
          console.log(`⏳ Run status: ${runStatus.status} (attempt ${attempts})`);
        }
      }

      if (runStatus.status !== 'completed') {
        console.error('❌ Run failed:', runStatus);
        throw new Error(`Run failed with status: ${runStatus.status}`);
      }

      console.log('✅ Run completed successfully');

      // Pobierz odpowiedź
      const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      });

      if (!messagesResponse.ok) {
        const error = await messagesResponse.text();
        console.error('❌ Messages fetch failed:', error);
        throw new Error(`Messages fetch failed: ${error}`);
      }

      const threadMessages = await messagesResponse.json();
      const assistantMessage = threadMessages.data.find((msg: any) => 
        msg.role === 'assistant' && msg.run_id === run.id
      );

      if (!assistantMessage) {
        throw new Error('No assistant response found');
      }

      const responseContent = assistantMessage.content[0]?.text?.value || 'Przepraszam, nie mogę wygenerować odpowiedzi.';
      
      console.log('✅ Assistant response received');

      // Zapisz analytics
      await supabase.from('analytics').insert({
        event_type: 'openai_assistant_call',
        agent_id: 'karol-core-ai',
        description: `OpenAI Assistant response generated for session ${session_id}`,
        context: JSON.stringify({
          session_id: session_id,
          thread_id: threadId,
          run_id: run.id,
          assistant_id: assistant_id,
          message_length: responseContent.length,
          processing_time: Date.now() - new Date(run.created_at * 1000).getTime(),
          status: 'success'
        }),
        value: 1
      });

      return new Response(JSON.stringify({
        response: responseContent,
        thread_id: threadId,
        run_id: run.id,
        assistant_id: assistant_id,
        processing_time: Date.now() - new Date(run.created_at * 1000).getTime(),
        model: 'gpt-4o-mini',
        tokens_used: runStatus.usage?.total_tokens || 0,
        status: 'success'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      throw new Error(`Unsupported action: ${action}`);
    }

  } catch (error) {
    console.error('💥 OpenAI Integration Error:', error);

    // Zapisz błąd do analytics
    await supabase.from('analytics').insert({
      event_type: 'openai_integration_error',
      agent_id: 'karol-core-ai',
      description: `OpenAI Integration error: ${error.message}`,
      context: JSON.stringify({
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      value: 0
    }).catch(console.error);

    return new Response(JSON.stringify({ 
      error: error.message,
      status: 'error',
      response: 'Przepraszam, wystąpił błąd podczas komunikacji z AI. Spróbuj ponownie.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
