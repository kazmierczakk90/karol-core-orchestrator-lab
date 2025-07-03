
-- Tabele dla EDICT Logic
CREATE TABLE public.edict_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  original_prompt TEXT NOT NULL,
  analyzed_intention JSONB,
  enriched_rules JSONB,
  generated_prompt TEXT,
  orchestration_mode TEXT CHECK (orchestration_mode IN ('lite', 'advanced')) DEFAULT 'lite',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabele dla xdGPT Functionality
CREATE TABLE public.xdgpt_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  api_endpoint TEXT,
  is_active BOOLEAN DEFAULT true,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.xdgpt_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  version INTEGER DEFAULT 1,
  is_encrypted BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.xdgpt_macros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  command_template TEXT NOT NULL,
  description TEXT,
  parameters JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabele dla xdS Intelligence Suite
CREATE TABLE public.xds_research (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  query TEXT NOT NULL,
  intention_analysis JSONB,
  generated_queries JSONB,
  research_results JSONB,
  synthesis_result TEXT,
  pipeline_stage INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.xds_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  research_id UUID REFERENCES public.xds_research,
  source_url TEXT,
  content_type TEXT CHECK (content_type IN ('web', 'pdf', 'document')),
  raw_content TEXT,
  processed_content TEXT,
  segments JSONB DEFAULT '[]',
  extraction_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Centralna konfiguracja
CREATE TABLE public.karol_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS Policies dla wszystkich tabel
ALTER TABLE public.edict_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own EDICT prompts" ON public.edict_prompts
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.xdgpt_models ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access to xdGPT models" ON public.xdgpt_models
  FOR SELECT USING (true);

ALTER TABLE public.xdgpt_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own files" ON public.xdgpt_files
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.xdgpt_macros ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own macros" ON public.xdgpt_macros
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.xds_research ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own research" ON public.xds_research
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.xds_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access content for their research" ON public.xds_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.xds_research 
      WHERE id = xds_content.research_id AND user_id = auth.uid()
    )
  );

ALTER TABLE public.karol_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access to Karol config" ON public.karol_config
  FOR SELECT USING (true);

-- Wstaw domyślną konfigurację
INSERT INTO public.karol_config (config_key, config_value, description) VALUES
('platform_version', '"3.0-extended"', 'Wersja platformy Karol-Core AGI'),
('edict_config', '{"enabled": true, "mode": "hybrid", "max_iterations": 5}', 'Konfiguracja modułu EDICT'),
('xdgpt_config', '{"enabled": true, "models": ["gpt-4o-mini"], "max_file_size": 104857600}', 'Konfiguracja modułu xdGPT'),
('xds_config', '{"enabled": true, "research_depth": 12, "max_queries": 128}', 'Konfiguracja modułu xdS'),
('agents_config', '{"count": 47, "active": true, "auto_select": true}', 'Konfiguracja agentów systemu');

-- Wstaw domyślne modele xdGPT
INSERT INTO public.xdgpt_models (name, provider, api_endpoint, configuration) VALUES
('GPT-4o Mini', 'OpenAI', 'https://api.openai.com/v1/chat/completions', '{"model": "gpt-4o-mini", "max_tokens": 4096}'),
('GPT-4o', 'OpenAI', 'https://api.openai.com/v1/chat/completions', '{"model": "gpt-4o", "max_tokens": 4096}');
