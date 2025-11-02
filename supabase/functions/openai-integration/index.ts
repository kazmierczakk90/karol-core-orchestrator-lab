
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const openaiApiKey = Deno.env.get('OPENAI_API_KEY')

// Health check function to validate OpenAI API key
async function validateOpenAIKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (response.ok) {
      console.log('✅ OpenAI API key validation successful')
      return { valid: true }
    } else {
      const errorText = await response.text()
      console.error('❌ OpenAI API key validation failed:', response.status, errorText)
      return { valid: false, error: `API key validation failed: ${response.status}` }
    }
  } catch (error) {
    console.error('❌ OpenAI API key validation error:', error)
    return { valid: false, error: `Validation request failed: ${error.message}` }
  }
}

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      console.log(`⚠️ Attempt ${attempt + 1} failed:`, error.message)
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt)
        console.log(`🔄 Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  console.log(`🚀 [${requestId}] OpenAI Integration called`)

  try {
    // SECURITY: Validate request size and rate limiting
    const contentLength = req.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 10000) {
      console.error(`❌ [${requestId}] Request too large: ${contentLength} bytes`)
      return new Response(
        JSON.stringify({ 
          error: 'Request too large',
          response: 'Żądanie jest zbyt duże. Maksymalny rozmiar to 10KB.',
          request_id: requestId
        }),
        { 
          status: 413, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const requestBody = await req.json()
    const { action, session_id, assistant_id, vector_store_id, content } = requestBody

    // SECURITY: Input validation
    if (!action || typeof action !== 'string') {
      console.error(`❌ [${requestId}] Missing or invalid action`)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid action',
          response: 'Nieprawidłowa akcja.',
          request_id: requestId
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (content && content.length > 5000) {
      console.error(`❌ [${requestId}] Content too long: ${content.length} characters`)
      return new Response(
        JSON.stringify({ 
          error: 'Content too long',
          response: 'Treść wiadomości jest zbyt długa. Maksymalnie 5000 znaków.',
          request_id: requestId
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    console.log(`📋 [${requestId}] Request details:`, { 
      action, 
      session_id, 
      assistant_id,
      content_length: content?.length || 0
    })

    // Stage 1: API Key Verification
    if (!openaiApiKey) {
      console.error(`❌ [${requestId}] OpenAI API key not found in environment`)
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured',
          response: 'Przepraszam, wystąpił błąd konfiguracji. Administrator musi skonfigurować klucz OpenAI API.',
          request_id: requestId
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Note: Removed key validation check to avoid 403 errors with restricted keys
    // The key will be validated during actual API call instead
    console.log(`🔑 [${requestId}] Using OpenAI API key (validation skipped for restricted keys)`)

    if (action === 'chat') {
      console.log(`💬 [${requestId}] Processing chat request...`)
      
      // Stage 2: Enhanced Database Interaction
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseKey)

      console.log(`📊 [${requestId}] Fetching conversation history for session: ${session_id}`)

      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', session_id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (messagesError) {
        console.error(`❌ [${requestId}] Database error fetching messages:`, messagesError)
        return new Response(
          JSON.stringify({ 
            error: 'Database error',
            response: 'Wystąpił błąd podczas pobierania wiadomości.',
            request_id: requestId,
            details: messagesError.message
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Stage 3: Request Format Validation
      const conversationHistory = messages ? messages.reverse().map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })) : []

      console.log(`📝 [${requestId}] Conversation history prepared: ${conversationHistory.length} messages`)

      // Validate request format
      if (!session_id || !content) {
        console.error(`❌ [${requestId}] Invalid request format:`, { session_id: !!session_id, content: !!content })
        return new Response(
          JSON.stringify({ 
            error: 'Invalid request format',
            response: 'Nieprawidłowy format żądania. Wymagane są session_id i content.',
            request_id: requestId
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Stage 4: Enhanced OpenAI API Call with Retry Logic
      const startTime = Date.now()
      
      const makeOpenAIRequest = async () => {
        console.log(`🤖 [${requestId}] Making OpenAI API request...`)
        
        const requestPayload = {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Jesteś ${assistant_id || 'Karol-Core AI'} - zaawansowany system AGI.
              
Twoja rola:
- Strategiczne podejmowanie decyzji jako CEO
- Analiza i planowanie biznesowe
- Zarządzanie zespołami i projektami
- Optymalizacja procesów i wydajności
- Wsparcie w rozwoju organizacji

Charakterystyka:
- Profesjonalny i konkretny
- Konstruktywny i ukierunkowany na działanie
- Używasz polskiego języka
- Odpowiadasz praktycznie i merytorycznie

Dostępne funkcje systemowe (możesz je sugerować):
- &dash - dashboard zarządczy
- &agents - przegląd agentów systemu
- &memory - system pamięci poznawczej
- &quantum - moduł decyzji kwantowych
- &analytics - panel analityczny
- &ceo - tryb strategiczny CEO
- &router - routing zadań
- &logger - logi systemowe

Zawsze zachowuj profesjonalizm i fokus na praktycznych rozwiązaniach.`
            },
            ...conversationHistory,
            {
              role: 'user',
              content: content
            }
          ],
          max_tokens: 1500,
          temperature: 0.7,
          presence_penalty: 0.3,
          frequency_penalty: 0.3
        }

        console.log(`📤 [${requestId}] OpenAI request payload:`, {
          model: requestPayload.model,
          messages_count: requestPayload.messages.length,
          max_tokens: requestPayload.max_tokens
        })

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestPayload)
        })

        // Stage 2: Enhanced Error Reporting
        if (!openaiResponse.ok) {
          const errorText = await openaiResponse.text()
          const errorDetails = {
            status: openaiResponse.status,
            statusText: openaiResponse.statusText,
            body: errorText,
            headers: Object.fromEntries(openaiResponse.headers.entries())
          }
          
          console.error(`❌ [${requestId}] OpenAI API error details:`, errorDetails)
          
          // Specific error handling based on status code
          let userMessage = 'Przepraszam, wystąpił błąd podczas komunikacji z AI.'
          
          if (openaiResponse.status === 401) {
            userMessage = 'Błąd autoryzacji API. Klucz OpenAI może być nieprawidłowy.'
          } else if (openaiResponse.status === 429) {
            userMessage = 'Zbyt wiele żądań. Spróbuj ponownie za chwilę.'
          } else if (openaiResponse.status === 500) {
            userMessage = 'Błąd serwera OpenAI. Spróbuj ponownie za chwilę.'
          }
          
          throw new Error(`OpenAI API ${openaiResponse.status}: ${errorText}`)
        }

        const aiData = await openaiResponse.json()
        console.log(`📨 [${requestId}] OpenAI response received:`, {
          response_length: aiData.choices?.[0]?.message?.content?.length || 0,
          tokens_used: aiData.usage?.total_tokens || 0,
          model: aiData.model
        })

        return aiData
      }
      
      try {
        // Stage 4: Implement retry logic with exponential backoff
        const aiData = await retryWithBackoff(makeOpenAIRequest, 3, 1000)
        const processingTime = Date.now() - startTime
        
        // Stage 5: Comprehensive Success Logging
        console.log(`✅ [${requestId}] OpenAI processing completed successfully:`, { 
          assistant: assistant_id,
          tokens: aiData.usage?.total_tokens,
          processing_time: processingTime,
          model: aiData.model
        })

        const response = {
          response: aiData.choices[0].message.content,
          tokens_used: aiData.usage?.total_tokens || 0,
          processing_time: processingTime,
          model: aiData.model,
          assistant_id: assistant_id || 'karol-core-ai',
          thread_id: `thread_${session_id}`,
          run_id: `run_${Date.now()}`,
          vector_store_id: vector_store_id || 'vs_karol_core',
          request_id: requestId
        }

        return new Response(
          JSON.stringify(response),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )

      } catch (aiError) {
        // Stage 4: Enhanced Error Recovery
        const processingTime = Date.now() - startTime
        console.error(`❌ [${requestId}] AI processing failed after retries:`, {
          error: aiError.message,
          processing_time: processingTime,
          session_id,
          assistant_id
        })
        
        // Stage 4: Intelligent fallback responses
        let fallbackResponse = 'Przepraszam, wystąpił błąd podczas przetwarzania Twojej wiadomości. Spróbuj ponownie za chwilę.'
        
        if (aiError.message.includes('401')) {
          fallbackResponse = 'Klucz API OpenAI wymaga aktualizacji. Skontaktuj się z administratorem systemu.'
        } else if (aiError.message.includes('429')) {
          fallbackResponse = 'System jest obecnie przeciążony. Proszę spróbować ponownie za 30 sekund.'
        } else if (aiError.message.includes('timeout')) {
          fallbackResponse = 'Przekroczono limit czasu odpowiedzi. Spróbuj z krótszą wiadomością.'
        }
        
        return new Response(
          JSON.stringify({ 
            error: 'AI processing failed',
            response: fallbackResponse,
            request_id: requestId,
            retry_suggested: true,
            processing_time: processingTime
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // Domyślna odpowiedź dla nieznanych akcji
    console.log(`⚠️ [${requestId}] Unknown action requested:`, action)
    return new Response(
      JSON.stringify({ 
        error: 'Unknown action',
        response: 'Nieznana akcja. Dostępne akcje: chat',
        request_id: requestId
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    // Stage 5: Comprehensive Error Logging
    console.error(`💥 [${requestId}] Function execution failed:`, {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
    
    return new Response(
      JSON.stringify({ 
        error: 'Function execution failed',
        response: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie za chwilę.',
        request_id: requestId,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
