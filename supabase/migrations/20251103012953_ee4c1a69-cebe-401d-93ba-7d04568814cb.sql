-- Fix get_demo_messages function - add proper aliases for ambiguous columns
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
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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
  FROM chat_messages cm
  INNER JOIN chat_sessions cs ON cm.session_id = cs.id
  WHERE cm.session_id = p_session_id
  AND cs.user_id = '00000000-0000-0000-0000-000000000001'::uuid
  ORDER BY cm.created_at ASC;
END;
$$;

-- Create function to create demo messages
CREATE OR REPLACE FUNCTION create_demo_message(
  p_session_id uuid,
  p_role text,
  p_content text,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_message_id uuid;
BEGIN
  -- Verify session belongs to demo user
  IF NOT EXISTS (
    SELECT 1 FROM chat_sessions 
    WHERE id = p_session_id 
    AND user_id = '00000000-0000-0000-0000-000000000001'::uuid
  ) THEN
    RAISE EXCEPTION 'Session not found or not accessible';
  END IF;

  -- Insert message
  INSERT INTO chat_messages (session_id, role, content, metadata)
  VALUES (p_session_id, p_role, p_content, p_metadata)
  RETURNING id INTO v_message_id;

  RETURN v_message_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_demo_messages(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_demo_message(uuid, text, text, jsonb) TO anon, authenticated;