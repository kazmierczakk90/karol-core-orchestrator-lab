
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
const ASSISTANT_ID = 'asst_7foGqdfqZKRBNloPEVXmlrua'
const VECTOR_STORE_ID = 'vs_67e03445b63c819183a0c37c390f5904'

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

// Polling function to wait for Run completion
async function pollRunStatus(threadId: string, runId: string, requestId: string): Promise<any> {
  const maxAttempts = 60 // 60 seconds max
  const pollInterval = 1000 // 1 second
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to check run status: ${response.status} ${errorText}`)
    }
    
    const runStatus = await response.json()
    console.log(`🔄 [${requestId}] Run status (attempt ${attempt + 1}):`, runStatus.status)
    
    if (runStatus.status === 'completed') {
      return runStatus
    }
    
    if (runStatus.status === 'failed' || runStatus.status === 'cancelled' || runStatus.status === 'expired') {
      throw new Error(`Run ${runStatus.status}: ${runStatus.last_error?.message || 'Unknown error'}`)
    }
    
    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, pollInterval))
  }
  
  throw new Error('Run timeout: exceeded 60 seconds')
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
      console.log(`💬 [${requestId}] Processing chat request with Assistants API...`)
      
      // Initialize Supabase client
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseKey)

      // Validate required fields
      if (!session_id || !content) {
        console.error(`❌ [${requestId}] Missing required fields`)
        return new Response(
          JSON.stringify({ 
            error: 'Invalid request',
            response: 'Wymagane pola: session_id i content.',
            request_id: requestId
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const startTime = Date.now()

      try {
        // STEP 1: Get or create Thread ID from session metadata
        console.log(`🧵 [${requestId}] Step 1: Getting thread ID for session ${session_id}`)
        
        const { data: sessionData, error: sessionError } = await supabase
          .from('chat_sessions')
          .select('metadata')
          .eq('id', session_id)
          .single()

        if (sessionError) {
          throw new Error(`Failed to fetch session: ${sessionError.message}`)
        }

        let threadId = sessionData?.metadata?.thread_id

        // Create new thread if doesn't exist
        if (!threadId) {
          console.log(`🆕 [${requestId}] Creating new thread...`)
          const threadResponse = await fetch('https://api.openai.com/v1/threads', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openaiApiKey}`,
              'Content-Type': 'application/json',
              'OpenAI-Beta': 'assistants=v2'
            },
            body: JSON.stringify({
              metadata: {
                session_id: session_id,
                platform: 'karol-core'
              }
            })
          })

          if (!threadResponse.ok) {
            const errorText = await threadResponse.text()
            throw new Error(`Failed to create thread: ${threadResponse.status} ${errorText}`)
          }

          const threadData = await threadResponse.json()
          threadId = threadData.id
          console.log(`✅ [${requestId}] Thread created: ${threadId}`)

          // Save thread ID to session metadata
          const updatedMetadata = {
            ...sessionData.metadata,
            thread_id: threadId
          }

          await supabase
            .from('chat_sessions')
            .update({ metadata: updatedMetadata })
            .eq('id', session_id)

          console.log(`💾 [${requestId}] Thread ID saved to session metadata`)
        } else {
          console.log(`✅ [${requestId}] Using existing thread: ${threadId}`)
        }

        // STEP 2: Add user message to thread
        console.log(`📝 [${requestId}] Step 2: Adding message to thread...`)
        const messageResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
          },
          body: JSON.stringify({
            role: 'user',
            content: content
          })
        })

        if (!messageResponse.ok) {
          const errorText = await messageResponse.text()
          throw new Error(`Failed to add message: ${messageResponse.status} ${errorText}`)
        }

        const messageData = await messageResponse.json()
        console.log(`✅ [${requestId}] Message added: ${messageData.id}`)

        // STEP 3: Create and run assistant with Vector Store
        console.log(`🤖 [${requestId}] Step 3: Creating run with assistant ${ASSISTANT_ID}...`)
        const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
          },
          body: JSON.stringify({
            assistant_id: ASSISTANT_ID,
            tools: [{ type: "file_search" }],
            tool_resources: {
              file_search: {
                vector_store_ids: [VECTOR_STORE_ID]
              }
            },
            instructions: `Jesteś Karol-Core AI - zaawansowany system AGI działający jako CEO i strategiczny doradca.

Twoja rola:
- Strategiczne podejmowanie decyzji
- Analiza i planowanie biznesowe
- Zarządzanie zespołami i projektami
- Optymalizacja procesów
- Wsparcie w rozwoju organizacji

Masz dostęp do systemu plików zawierającego dokumentację i dane organizacji.
Używaj file_search gdy potrzebujesz sprawdzić konkretne informacje z dokumentów.

Charakterystyka:
- Profesjonalny i konkretny
- Konstruktywny i ukierunkowany na działanie
- Używasz polskiego języka
- Odpowiadasz praktycznie i merytorycznie
- Jeśli odwołujesz się do dokumentów, cytuj konkretne fragmenty

Zawsze zachowuj profesjonalizm i fokus na praktycznych rozwiązaniach.`
          })
        })

        if (!runResponse.ok) {
          const errorText = await runResponse.text()
          throw new Error(`Failed to create run: ${runResponse.status} ${errorText}`)
        }

        const runData = await runResponse.json()
        console.log(`✅ [${requestId}] Run created: ${runData.id}`)

        // STEP 4: Poll for run completion
        console.log(`⏳ [${requestId}] Step 4: Waiting for run completion...`)
        const completedRun = await pollRunStatus(threadId, runData.id, requestId)
        console.log(`✅ [${requestId}] Run completed successfully`)

        // STEP 5: Retrieve assistant's response
        console.log(`📥 [${requestId}] Step 5: Retrieving assistant response...`)
        const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages?limit=1&order=desc`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'OpenAI-Beta': 'assistants=v2'
          }
        })

        if (!messagesResponse.ok) {
          const errorText = await messagesResponse.text()
          throw new Error(`Failed to retrieve messages: ${messagesResponse.status} ${errorText}`)
        }

        const messagesData = await messagesResponse.json()
        const assistantMessage = messagesData.data[0]
        
        if (!assistantMessage || assistantMessage.role !== 'assistant') {
          throw new Error('No assistant response found')
        }

        // Extract text content
        const textContent = assistantMessage.content
          .filter((c: any) => c.type === 'text')
          .map((c: any) => c.text.value)
          .join('\n')

        const processingTime = Date.now() - startTime

        console.log(`✅ [${requestId}] Processing completed successfully:`, {
          thread_id: threadId,
          run_id: runData.id,
          assistant_id: ASSISTANT_ID,
          processing_time: processingTime,
          response_length: textContent.length
        })

        const response = {
          response: textContent,
          processing_time: processingTime,
          assistant_id: ASSISTANT_ID,
          thread_id: threadId,
          run_id: runData.id,
          vector_store_id: VECTOR_STORE_ID,
          request_id: requestId,
          tokens_used: completedRun.usage?.total_tokens || 0
        }

        return new Response(
          JSON.stringify(response),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )

      } catch (error) {
        const processingTime = Date.now() - startTime
        console.error(`❌ [${requestId}] Assistants API error:`, {
          error: error.message,
          processing_time: processingTime,
          session_id,
          assistant_id: ASSISTANT_ID
        })
        
        let fallbackResponse = 'Przepraszam, wystąpił błąd podczas przetwarzania Twojej wiadomości. Spróbuj ponownie za chwilę.'
        
        if (error.message.includes('401')) {
          fallbackResponse = 'Błąd autoryzacji API. Klucz OpenAI wymaga aktualizacji.'
        } else if (error.message.includes('429')) {
          fallbackResponse = 'System jest obecnie przeciążony. Spróbuj ponownie za 30 sekund.'
        } else if (error.message.includes('timeout')) {
          fallbackResponse = 'Przekroczono limit czasu odpowiedzi (60s). Spróbuj z krótszą wiadomością.'
        } else if (error.message.includes('Thread not found')) {
          fallbackResponse = 'Sesja wygasła. Proszę utworzyć nową sesję.'
        }
        
        return new Response(
          JSON.stringify({ 
            error: 'Assistants API processing failed',
            response: fallbackResponse,
            request_id: requestId,
            retry_suggested: true,
            processing_time: processingTime,
            details: error.message
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
