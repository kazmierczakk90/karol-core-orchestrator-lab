
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/db';
import { toast } from 'sonner';

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

export const useOpenAI = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamResponse, setStreamResponse] = useState('');

  const callOpenAI = useMutation({
    mutationFn: async (request: OpenAIRequest) => {
      const { data, error } = await supabase.functions.invoke('openai-integration', {
        body: request
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success('OpenAI request completed successfully');
    },
    onError: (error: any) => {
      toast.error(`OpenAI request failed: ${error.message}`);
    }
  });

  const chatCompletion = async (
    messages: any[], 
    model = 'gpt-4', 
    options: Partial<OpenAIRequest> = {}
  ) => {
    return callOpenAI.mutate({
      action: 'chat',
      messages,
      model,
      ...options
    });
  };

  const textCompletion = async (
    prompt: string,
    model = 'gpt-3.5-turbo-instruct',
    options: Partial<OpenAIRequest> = {}
  ) => {
    return callOpenAI.mutate({
      action: 'completion',
      prompt,
      model,
      ...options
    });
  };

  const generateEmbedding = async (text: string) => {
    return callOpenAI.mutate({
      action: 'embedding',
      prompt: text
    });
  };

  const generateImage = async (prompt: string) => {
    return callOpenAI.mutate({
      action: 'image_generation',
      prompt
    });
  };

  const streamChat = async (
    messages: any[],
    onChunk: (chunk: string) => void,
    model = 'gpt-4'
  ) => {
    setIsStreaming(true);
    setStreamResponse('');

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/openai-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({
          action: 'chat',
          messages,
          model,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error('Stream request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response stream available');
      }

      let accumulatedResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                accumulatedResponse += content;
                setStreamResponse(accumulatedResponse);
                onChunk(content);
              }
            } catch (e) {
              console.error('Error parsing stream data:', e);
            }
          }
        }
      }

      toast.success('Streaming completed');
    } catch (error: any) {
      toast.error(`Streaming failed: ${error.message}`);
    } finally {
      setIsStreaming(false);
    }
  };

  return {
    chatCompletion,
    textCompletion,
    generateEmbedding,
    generateImage,
    streamChat,
    isLoading: callOpenAI.isPending,
    isStreaming,
    streamResponse,
    error: callOpenAI.error
  };
};
