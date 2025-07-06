-- Find and drop the correct foreign key constraint
-- Get constraint details first
SELECT conname, conrelid::regclass, confrelid::regclass, contype 
FROM pg_constraint 
WHERE conrelid = 'chat_sessions'::regclass AND contype = 'f';

-- Drop the foreign key constraint properly  
ALTER TABLE public.chat_sessions DROP CONSTRAINT chat_sessions_user_id_fkey CASCADE;

-- Test demo session creation
SELECT create_demo_session('karol-core-ai', 'Live Chat Test', '{"fixed": true}'::jsonb) as new_session_id;