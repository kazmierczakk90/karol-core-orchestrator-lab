
-- Dodaj polityki RLS które umożliwią działanie w trybie demo
-- Najpierw sprawdź czy tabele mają włączone RLS
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Usuń istniejące polityki jeśli istnieją
DROP POLICY IF EXISTS "demo_sessions_policy" ON public.chat_sessions;
DROP POLICY IF EXISTS "demo_messages_policy" ON public.chat_messages;

-- Dodaj polityki które pozwolą na użycie tekstowego user_id dla trybu demo
CREATE POLICY "demo_sessions_policy" ON public.chat_sessions
FOR ALL 
USING (
  -- Pozwól na dostęp gdy user_id to demo-user-id (tryb demo)
  user_id::text = 'demo-user-id'
  OR 
  -- Lub gdy to prawdziwy użytkownik
  auth.uid()::text = user_id::text
);

CREATE POLICY "demo_messages_policy" ON public.chat_messages
FOR ALL
USING (
  -- Pozwól na dostęp do wiadomości z sesji demo
  session_id IN (
    SELECT id FROM public.chat_sessions 
    WHERE user_id::text = 'demo-user-id' 
    OR auth.uid()::text = user_id::text
  )
);

-- Dodaj funkcję do tworzenia sesji demo
CREATE OR REPLACE FUNCTION create_demo_session(
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
BEGIN
  INSERT INTO public.chat_sessions (
    user_id,
    agent_id,
    title,
    metadata,
    status
  ) VALUES (
    'demo-user-id'::UUID,
    p_agent_id,
    COALESCE(p_title, 'Demo Sesja - ' || to_char(now(), 'DD.MM.YYYY HH24:MI:SS')),
    p_metadata,
    'active'
  )
  RETURNING id INTO new_session_id;
  
  RETURN new_session_id;
END;
$$;
