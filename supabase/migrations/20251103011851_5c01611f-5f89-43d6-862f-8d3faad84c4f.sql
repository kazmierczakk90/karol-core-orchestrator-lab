-- Function to safely delete demo session messages
CREATE OR REPLACE FUNCTION delete_demo_session_messages(p_session_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM chat_messages 
  WHERE session_id = p_session_id
  AND session_id IN (
    SELECT id FROM chat_sessions 
    WHERE user_id = '00000000-0000-0000-0000-000000000001'::uuid
  );
END;
$$;

-- Function to safely delete demo session
CREATE OR REPLACE FUNCTION delete_demo_session(p_session_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- First delete messages
  PERFORM delete_demo_session_messages(p_session_id);
  
  -- Then delete session
  DELETE FROM chat_sessions 
  WHERE id = p_session_id 
  AND user_id = '00000000-0000-0000-0000-000000000001'::uuid;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION delete_demo_session_messages(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION delete_demo_session(uuid) TO anon, authenticated;