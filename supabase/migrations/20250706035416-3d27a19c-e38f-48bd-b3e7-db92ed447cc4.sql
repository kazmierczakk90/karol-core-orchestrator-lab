-- Fix Live Chat issue by removing foreign key constraint and improving demo handling
-- This allows demo sessions to work without requiring auth.users entries

-- Drop the foreign key constraint that's blocking demo sessions
ALTER TABLE public.chat_sessions DROP CONSTRAINT IF EXISTS chat_sessions_user_id_fkey;

-- Update the create_demo_session function to handle demo users better
CREATE OR REPLACE FUNCTION public.create_demo_session(
  p_agent_id TEXT DEFAULT 'karol-core-ai',
  p_title TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_session_id UUID;
  demo_user_uuid UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- Insert demo session without foreign key constraint issues
  INSERT INTO public.chat_sessions (
    user_id,
    agent_id,
    title,
    metadata,
    status
  ) VALUES (
    demo_user_uuid,
    p_agent_id,
    COALESCE(p_title, 'Demo Sesja z Karol-Core AI - ' || to_char(now(), 'DD.MM.YYYY HH24:MI:SS')),
    COALESCE(p_metadata, '{}'::jsonb) || jsonb_build_object(
      'demo_mode', true,
      'assistant_id', 'asst_7foGqdfqZKRBNloPEVXmlrua',
      'vector_store_id', 'vs_6850534726fc8191b5ef7a56e8fc4a3c',
      'created_by', 'demo@karol-core.dev',
      'platform', 'karol-core',
      'version', '2.0'
    ),
    'active'
  )
  RETURNING id INTO new_session_id;
  
  RETURN new_session_id;
END;
$$;

-- Enhance demo message creation function
CREATE OR REPLACE FUNCTION public.create_demo_message(
  p_session_id UUID,
  p_role TEXT,
  p_content TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_message_id UUID;
BEGIN
  -- Insert demo message
  INSERT INTO public.chat_messages (
    session_id,
    role,
    content,
    metadata
  ) VALUES (
    p_session_id,
    p_role,
    p_content,
    COALESCE(p_metadata, '{}'::jsonb) || jsonb_build_object('demo_mode', true)
  )
  RETURNING id INTO new_message_id;
  
  RETURN new_message_id;
END;
$$;

-- Add index for better performance on demo sessions
CREATE INDEX IF NOT EXISTS idx_chat_sessions_demo_user 
ON public.chat_sessions(user_id) 
WHERE user_id = '00000000-0000-0000-0000-000000000001';

-- Add index for better performance on demo messages
CREATE INDEX IF NOT EXISTS idx_chat_messages_demo_sessions 
ON public.chat_messages(session_id)
WHERE session_id IN (
  SELECT id FROM chat_sessions 
  WHERE user_id = '00000000-0000-0000-0000-000000000001'
);