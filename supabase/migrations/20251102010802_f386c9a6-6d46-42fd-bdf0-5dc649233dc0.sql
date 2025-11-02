-- Poprawki dla demo użytkownika i sesji czatu

-- 1. Dodaj policy dla demo użytkownika (UUID: 00000000-0000-0000-0000-000000000001)
CREATE POLICY "Demo user can manage their sessions"
  ON public.chat_sessions
  FOR ALL
  USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid)
  WITH CHECK (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

CREATE POLICY "Demo user can manage messages in their sessions"
  ON public.chat_messages
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = '00000000-0000-0000-0000-000000000001'::uuid
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = '00000000-0000-0000-0000-000000000001'::uuid
    )
  );

-- 2. Funkcja do pobierania sesji demo użytkownika (używa service_role)
CREATE OR REPLACE FUNCTION get_demo_sessions()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  agent_id text,
  title text,
  status text,
  metadata jsonb,
  created_at timestamptz,
  updated_at timestamptz,
  last_message_at timestamptz
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cs.id,
    cs.user_id,
    cs.agent_id,
    cs.title,
    cs.status,
    cs.metadata,
    cs.created_at,
    cs.updated_at,
    cs.last_message_at
  FROM public.chat_sessions cs
  WHERE cs.user_id = '00000000-0000-0000-0000-000000000001'::uuid
  ORDER BY cs.updated_at DESC;
END;
$$;

-- 3. Funkcja do pobierania wiadomości demo użytkownika
CREATE OR REPLACE FUNCTION get_demo_messages(p_session_id uuid)
RETURNS TABLE (
  id uuid,
  session_id uuid,
  role text,
  content text,
  metadata jsonb,
  tokens_used integer,
  processing_time integer,
  created_at timestamptz,
  updated_at timestamptz
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Sprawdź czy sesja należy do demo użytkownika
  IF NOT EXISTS (
    SELECT 1 FROM public.chat_sessions
    WHERE id = p_session_id
    AND user_id = '00000000-0000-0000-0000-000000000001'::uuid
  ) THEN
    RAISE EXCEPTION 'Session not found or access denied';
  END IF;

  RETURN QUERY
  SELECT 
    cm.id,
    cm.session_id,
    cm.role,
    cm.content,
    cm.metadata,
    cm.tokens_used,
    cm.processing_time,
    cm.created_at,
    cm.updated_at
  FROM public.chat_messages cm
  WHERE cm.session_id = p_session_id
  ORDER BY cm.created_at ASC;
END;
$$;

-- Udziel uprawnień dla funkcji demo
GRANT EXECUTE ON FUNCTION get_demo_sessions() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_demo_messages(uuid) TO anon, authenticated;