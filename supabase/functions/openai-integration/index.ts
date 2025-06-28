
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const openaiApiKey = Deno.env.get('OPENAI_API_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, session_id, assistant_id, vector_store_id } = await req.json()
    
    console.log('🚀 OpenAI Integration called:', { action, session_id, assistant_id })

    if (!openaiApiKey) {
      console.error('❌ OpenAI API key not found')
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured',
          response: 'Przepraszam, wystąpił błąd konfiguracji. Administrator musi skonfigurować klucz OpenAI API.'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (action === 'chat') {
      console.log('💬 Processing chat request...')
      
      // Pobierz ostatnią wiadomość użytkownika z sesji
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', session_id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (messagesError) {
        console.error('❌ Error fetching messages:', messagesError)
        return new Response(
          JSON.stringify({ 
            error: 'Database error',
            response: 'Wystąpił błąd podczas pobierania wiadomości.'
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      if (!messages || messages.length === 0) {
        console.log('⚠️ No messages found')
        return new Response(
          JSON.stringify({ 
            response: 'Cześć! Jestem Karol-Core AI, Twój asystent CEO. W czym mogę Ci pomóc?',
            tokens_used: 0,
            processing_time: 0,
            model: 'gpt-4o-mini'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const lastMessage = messages[0]
      console.log('📝 Last message:', lastMessage.content)

      // Wywołaj OpenAI Assistant API
      const startTime = Date.now()
      
      try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `Jesteś Karol-Core AI - zaawansowany system AGI o funkcjach CEO. 
                
Twoją rolą jest:
- Podejmowanie strategicznych decyzji
- Analiza i planowanie biznesowe  
- Zarządzanie zespołami i projektami
- Optymalizacja procesów i wydajności
- Wsparcie w rozwoju organizacji

Odpowiadaj profesjonalnie, konkretnie i konstruktywnie. Używaj polskiego języka.
Twoje odpowiedzi powinny być praktyczne i ukierunkowane na działanie.

Dostępne funkcje systemowe:
- &dash - otwórz dashboard
- &agents - przegląd agentów  
- &memory - system pamięci
- &quantum - decyzje kwantowe
- &analytics - analityka

Możesz sugerować użycie komend systemowych gdy są odpowiednie do kontekstu.`
              },
              {
                role: 'user',
                content: lastMessage.content
              }
            ],
            max_tokens: 1000,
            temperature: 0.7
          })
        })

        if (!openaiResponse.ok) {
          const errorData = await openaiResponse.text()
          console.error('❌ OpenAI API error:', errorData)
          throw new Error(`OpenAI API error: ${openaiResponse.status}`)
        }

        const aiData = await openaiResponse.json()
        const processingTime = Date.now() - startTime
        
        console.log('✅ OpenAI response received', { 
          tokens: aiData.usage?.total_tokens,
          time: processingTime 
        })

        return new Response(
          JSON.stringify({
            response: aiData.choices[0].message.content,
            tokens_used: aiData.usage?.total_tokens || 0,
            processing_time: processingTime,
            model: aiData.model,
            thread_id: `thread_${session_id}`,
            run_id: `run_${Date.now()}`
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )

      } catch (aiError) {
        console.error('❌ AI processing error:', aiError)
        return new Response(
          JSON.stringify({ 
            error: 'AI processing failed',
            response: 'Przepraszam, wystąpił błąd podczas przetwarzania Twojej wiadomości. Spróbuj ponownie.'
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // Domyślna odpowiedź dla nieznanych akcji
    return new Response(
      JSON.stringify({ 
        error: 'Unknown action',
        response: 'Nieznana akcja. Dostępne akcje: chat'
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('💥 Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Function execution failed',
        response: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie za chwilę.'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
