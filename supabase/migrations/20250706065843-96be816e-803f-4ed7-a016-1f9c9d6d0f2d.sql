-- SECURITY HARDENING: Tighten RLS policies for sensitive tables

-- 1. Remove overly permissive policies on system tables
DROP POLICY IF EXISTS "Allow all operations on agent_states" ON public.agent_states;
DROP POLICY IF EXISTS "Allow all operations on audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Allow all operations on meta_decisions" ON public.meta_decisions;
DROP POLICY IF EXISTS "Allow all operations on priority_queue" ON public.priority_queue;
DROP POLICY IF EXISTS "Allow all operations on routing_rules" ON public.routing_rules;

-- 2. Create secure RLS policies for agent_states
CREATE POLICY "Admin can manage agent states" ON public.agent_states
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- 3. Create secure RLS policies for audit_logs  
CREATE POLICY "Admin can view audit logs" ON public.audit_logs
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "System can insert audit logs" ON public.audit_logs
FOR INSERT 
WITH CHECK (true); -- Allow system to log events

-- 4. Create secure RLS policies for meta_decisions
CREATE POLICY "Admin can manage meta decisions" ON public.meta_decisions
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- 5. Create secure RLS policies for priority_queue
CREATE POLICY "Admin can manage priority queue" ON public.priority_queue
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- 6. Create secure RLS policies for routing_rules
CREATE POLICY "Admin can manage routing rules" ON public.routing_rules
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- 7. Tighten system_connections access
DROP POLICY IF EXISTS "Allow all access to system_connections" ON public.system_connections;

CREATE POLICY "Admin can manage system connections" ON public.system_connections
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- 8. Secure demo session access - remove overly broad demo access
DROP POLICY IF EXISTS "demo_sessions_policy" ON public.chat_sessions;
DROP POLICY IF EXISTS "demo_messages_policy" ON public.chat_messages;

-- Create more secure demo session policy
CREATE POLICY "Secure demo sessions access" ON public.chat_sessions
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  (user_id = '00000000-0000-0000-0000-000000000001'::uuid AND 
   EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()))
);

CREATE POLICY "Secure demo messages access" ON public.chat_messages  
FOR SELECT
USING (
  session_id IN (
    SELECT id FROM public.chat_sessions 
    WHERE auth.uid() = user_id OR 
    (user_id = '00000000-0000-0000-0000-000000000001'::uuid AND 
     EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()))
  )
);

-- 9. Add input validation trigger for URLs and sensitive data
CREATE OR REPLACE FUNCTION validate_url_input()
RETURNS TRIGGER AS $$
BEGIN
  -- Basic URL validation to prevent malicious URLs
  IF NEW.url IS NOT NULL AND LENGTH(NEW.url) > 2048 THEN
    RAISE EXCEPTION 'URL too long';
  END IF;
  
  IF NEW.url IS NOT NULL AND NEW.url NOT SIMILAR TO 'https?://[a-zA-Z0-9._-]+.*' THEN
    RAISE EXCEPTION 'Invalid URL format';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply URL validation to browser_history table
CREATE TRIGGER validate_browser_history_url
  BEFORE INSERT OR UPDATE ON public.browser_history
  FOR EACH ROW EXECUTE FUNCTION validate_url_input();

-- 10. Add content length limits to prevent abuse
CREATE OR REPLACE FUNCTION validate_content_length()
RETURNS TRIGGER AS $$
BEGIN
  -- Limit message content to prevent abuse
  IF NEW.content IS NOT NULL AND LENGTH(NEW.content) > 10000 THEN
    RAISE EXCEPTION 'Content too long';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply content validation to chat_messages
CREATE TRIGGER validate_chat_message_content
  BEFORE INSERT OR UPDATE ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION validate_content_length();