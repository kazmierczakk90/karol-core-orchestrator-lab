
-- Faza 1: Naprawa funkcji create_demo_session i polityk RLS
-- Usuń istniejącą funkcję i stwórz poprawną wersję
DROP FUNCTION IF EXISTS public.create_demo_session(text, text, jsonb);

-- Popraw funkcję create_demo_session aby używała prawidłowego UUID dla demo
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
  INSERT INTO public.chat_sessions (
    user_id,
    agent_id,
    title,
    metadata,
    status
  ) VALUES (
    demo_user_uuid,
    p_agent_id,
    COALESCE(p_title, 'Demo Sesja - ' || to_char(now(), 'DD.MM.YYYY HH24:MI:SS')),
    p_metadata,
    'active'
  )
  RETURNING id INTO new_session_id;
  
  RETURN new_session_id;
END;
$$;

-- Aktualizuj polityki RLS aby obsługiwały demo UUID
DROP POLICY IF EXISTS "demo_sessions_policy" ON public.chat_sessions;
DROP POLICY IF EXISTS "demo_messages_policy" ON public.chat_messages;

CREATE POLICY "demo_sessions_policy" ON public.chat_sessions
FOR ALL 
USING (
  user_id = '00000000-0000-0000-0000-000000000001'::UUID
  OR 
  auth.uid() = user_id
);

CREATE POLICY "demo_messages_policy" ON public.chat_messages
FOR ALL
USING (
  session_id IN (
    SELECT id FROM public.chat_sessions 
    WHERE user_id = '00000000-0000-0000-0000-000000000001'::UUID
    OR auth.uid() = user_id
  )
);

-- Dodaj trigger do automatycznego aktualizowania session last_message_at
CREATE OR REPLACE FUNCTION update_session_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.chat_sessions 
    SET last_message_at = NEW.created_at,
        updated_at = NEW.created_at
    WHERE id = NEW.session_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_session_last_message ON public.chat_messages;
CREATE TRIGGER trigger_update_session_last_message
    AFTER INSERT ON public.chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_session_last_message();
