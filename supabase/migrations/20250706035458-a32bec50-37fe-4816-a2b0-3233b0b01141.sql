-- Fix the index issue from previous migration
-- Add simplified index for better performance on demo messages

-- Add index for better performance on demo messages (simplified version)
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id 
ON public.chat_messages(session_id);

-- Test the demo session creation to verify it works now
SELECT create_demo_session('karol-core-ai', 'Test Live Chat Session', '{"test": true}'::jsonb) as session_id;