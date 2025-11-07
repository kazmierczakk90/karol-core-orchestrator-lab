-- Create XdGPT Models table if not exists
CREATE TABLE IF NOT EXISTS public.xdgpt_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  api_endpoint TEXT,
  is_active BOOLEAN DEFAULT true,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create XdGPT Files table if not exists
CREATE TABLE IF NOT EXISTS public.xdgpt_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  version INTEGER DEFAULT 1,
  is_encrypted BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create XdS Research table if not exists
CREATE TABLE IF NOT EXISTS public.xds_research (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  query TEXT NOT NULL,
  intention_analysis JSONB,
  generated_queries JSONB,
  research_results JSONB,
  synthesis_result TEXT,
  pipeline_stage INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.xdgpt_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xdgpt_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xds_research ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view active models" ON public.xdgpt_models;
DROP POLICY IF EXISTS "Admin can manage models" ON public.xdgpt_models;
DROP POLICY IF EXISTS "Users can manage their own files" ON public.xdgpt_files;
DROP POLICY IF EXISTS "Users can manage their own research" ON public.xds_research;

-- RLS Policies for xdgpt_models
CREATE POLICY "Users can view active models"
  ON public.xdgpt_models
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage models"
  ON public.xdgpt_models
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for xdgpt_files
CREATE POLICY "Users can manage their own files"
  ON public.xdgpt_files
  FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for xds_research
CREATE POLICY "Users can manage their own research"
  ON public.xds_research
  FOR ALL
  USING (auth.uid() = user_id);

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_xdgpt_files_updated_at ON public.xdgpt_files;
CREATE TRIGGER update_xdgpt_files_updated_at
  BEFORE UPDATE ON public.xdgpt_files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default AI models
INSERT INTO public.xdgpt_models (name, provider, api_endpoint, configuration) VALUES
  ('Gemini 2.5 Flash', 'google', 'https://ai.gateway.lovable.dev/v1/chat/completions', '{"model": "google/gemini-2.5-flash", "max_tokens": 4096}'),
  ('GPT-5', 'openai', 'https://ai.gateway.lovable.dev/v1/chat/completions', '{"model": "openai/gpt-5", "max_completion_tokens": 4096}'),
  ('GPT-5 Mini', 'openai', 'https://ai.gateway.lovable.dev/v1/chat/completions', '{"model": "openai/gpt-5-mini", "max_completion_tokens": 4096}'),
  ('Gemini 2.5 Pro', 'google', 'https://ai.gateway.lovable.dev/v1/chat/completions', '{"model": "google/gemini-2.5-pro", "max_tokens": 8192}')
ON CONFLICT DO NOTHING;