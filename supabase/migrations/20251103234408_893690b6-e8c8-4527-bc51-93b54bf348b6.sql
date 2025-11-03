-- Funkcja do aktualizacji demo sesji
CREATE OR REPLACE FUNCTION public.update_demo_session(
  p_session_id uuid,
  p_updates jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Sprawdź czy sesja należy do demo użytkownika
  IF NOT EXISTS (
    SELECT 1 FROM chat_sessions 
    WHERE id = p_session_id 
    AND user_id = '00000000-0000-0000-0000-000000000001'::uuid
  ) THEN
    RAISE EXCEPTION 'Session not found or not accessible';
  END IF;

  -- Aktualizuj sesję
  UPDATE chat_sessions 
  SET 
    title = COALESCE(p_updates->>'title', title),
    status = COALESCE(p_updates->>'status', status),
    metadata = COALESCE((p_updates->>'metadata')::jsonb, metadata),
    last_message_at = COALESCE((p_updates->>'last_message_at')::timestamptz, last_message_at),
    updated_at = now()
  WHERE id = p_session_id;

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;