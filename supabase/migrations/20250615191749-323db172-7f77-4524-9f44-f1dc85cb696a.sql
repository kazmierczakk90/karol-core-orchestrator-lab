
-- Enable RLS and add insert policies for improvement_events, logs, and analytics tables

-- improvement_events table
ALTER TABLE public.improvement_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert access to improvement_events" ON public.improvement_events;
CREATE POLICY "Allow public insert access to improvement_events"
ON public.improvement_events
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

ALTER TABLE public.improvement_events
ALTER COLUMN agent_id TYPE TEXT;


-- logs table
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert access to logs" ON public.logs;
CREATE POLICY "Allow public insert access to logs"
ON public.logs
FOR INSERT
TO anon, authenticated
WITH CHECK (true);


-- analytics table
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert access to analytics" ON public.analytics;
CREATE POLICY "Allow public insert access to analytics"
ON public.analytics
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
