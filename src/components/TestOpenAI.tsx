import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const TestOpenAI = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const testOpenAI = async () => {
    if (!message) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('openai-integration', {
        body: {
          action: 'chat',
          session_id: 'test-session',
          assistant_id: 'karol-core-ai',
          content: message
        }
      });

      if (error) throw error;
      
      setResponse(data?.response || 'No response received');
    } catch (error: any) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Test OpenAI Integration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter test message..."
        />
        <Button onClick={testOpenAI} disabled={loading || !message}>
          {loading ? 'Testing...' : 'Test AI'}
        </Button>
        
        {response && (
          <div className="p-4 bg-slate-100 rounded-lg">
            <strong>Response:</strong>
            <p className="mt-2 text-sm">{response}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestOpenAI;