
-- Create FUKO Core Tables
CREATE TABLE IF NOT EXISTS public.fuko_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  mode TEXT NOT NULL,
  capabilities TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  performance NUMERIC NOT NULL DEFAULT 85,
  last_update TIMESTAMPTZ NOT NULL DEFAULT now(),
  dependencies TEXT[],
  competency_score NUMERIC NOT NULL DEFAULT 70
);

CREATE TABLE IF NOT EXISTS public.fuko_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "timestamp" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "F" TEXT NOT NULL,
  "U" TEXT NOT NULL,
  "K" TEXT NOT NULL,
  "O" TEXT NOT NULL,
  "P" TEXT NOT NULL,
  "Z" TEXT NOT NULL,
  "K2" TEXT NOT NULL,
  source_agent TEXT NOT NULL,
  target_agent TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'pending',
  execution_result TEXT
);

CREATE TABLE IF NOT EXISTS public.kpi_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value NUMERIC NOT NULL,
  threshold NUMERIC NOT NULL,
  trend TEXT NOT NULL,
  last_update TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create OpenAI Service Tables
CREATE TABLE IF NOT EXISTS public.openai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  assistant_id TEXT,
  instructions TEXT,
  is_active BOOLEAN DEFAULT true,
  last_used TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  agent_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  size BIGINT NOT NULL,
  type TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  openai_file_id TEXT
);

-- Enable RLS for the new tables
ALTER TABLE public.fuko_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuko_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.openai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

-- Create policies for the new tables
CREATE POLICY "Allow all access to fuko_agents" ON public.fuko_agents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to fuko_messages" ON public.fuko_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to kpi_data" ON public.kpi_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to openai_agents" ON public.openai_agents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to project_files" ON public.project_files FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime for the new tables
ALTER TABLE public.fuko_agents REPLICA IDENTITY FULL;
ALTER TABLE public.fuko_messages REPLICA IDENTITY FULL;
ALTER TABLE public.kpi_data REPLICA IDENTITY FULL;
ALTER TABLE public.openai_agents REPLICA IDENTITY FULL;
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.project_files REPLICA IDENTITY FULL;

-- Add new tables to publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.fuko_agents, public.fuko_messages, public.kpi_data, public.openai_agents, public.projects, public.project_files;
