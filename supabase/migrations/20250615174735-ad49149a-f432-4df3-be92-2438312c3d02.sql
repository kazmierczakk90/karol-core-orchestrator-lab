-- Enable real-time for agents table
ALTER TABLE public.agents REPLICA IDENTITY FULL;

-- Add agents table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.agents;

-- Add additional columns to agents table for mock data compatibility
ALTER TABLE public.agents 
ADD COLUMN IF NOT EXISTS identifier TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS tasks_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_used TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS capabilities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0.0',
ADD COLUMN IF NOT EXISTS performance INTEGER DEFAULT 85;

-- Insert mock agents data with proper UUIDs
INSERT INTO public.agents (identifier, name, type, description, is_active, status, tasks_completed, capabilities, version, performance) VALUES
('@ceo', 'CEO Agent', 'core', 'Strategic decision making and high-level planning', true, 'active', 47, ARRAY['strategy', 'planning', 'leadership'], '2.1.0', 95),
('@logger', 'Logger Agent', 'utility', 'System logging and monitoring', true, 'active', 156, ARRAY['logging', 'monitoring', 'alerts'], '1.8.2', 88),
('@voice-core', 'Voice Core', 'core', 'Voice processing and communication', true, 'active', 23, ARRAY['voice', 'speech', 'audio'], '3.0.1', 92),
('@analiza', 'Analiza Agent', 'utility', 'Data analysis and insights', true, 'active', 89, ARRAY['analysis', 'data', 'insights'], '2.3.5', 78),
('@router', 'Router Agent', 'core', 'Task routing and distribution', true, 'active', 234, ARRAY['routing', 'distribution', 'load-balancing'], '1.9.0', 88),
('@kontroling', 'Kontroling Agent', 'utility', 'Quality control and oversight', true, 'active', 67, ARRAY['quality', 'control', 'validation'], '1.5.3', 92),
('@system-admin', 'System Admin', 'core', 'System administration and maintenance', true, 'active', 178, ARRAY['admin', 'maintenance', 'system'], '2.0.8', 95),
('@guardian-core', 'Guardian Core', 'core', 'Security and protection', true, 'active', 45, ARRAY['security', 'protection', 'monitoring'], '2.2.1', 92),
('@karol-core', 'Karol Core', 'karol', 'Core Karol system functionality', true, 'active', 312, ARRAY['core', 'orchestration', 'identity'], '4.1.2', 95),
('@karol-voice', 'Karol Voice', 'karol', 'Karol voice processing', true, 'active', 56, ARRAY['voice', 'karol-identity', 'communication'], '3.1.0', 92),
('@google-search', 'Google Search', 'integration', 'Google Search integration', true, 'active', 134, ARRAY['search', 'google', 'web'], '1.4.7', 88),
('@google-maps', 'Google Maps', 'integration', 'Google Maps integration', true, 'active', 28, ARRAY['maps', 'location', 'navigation'], '1.2.3', 78),
('@party-app', 'Party App', 'integration', 'Event and party management', false, 'maintenance', 15, ARRAY['events', 'parties', 'management'], '0.9.1', 67),
('@fuko-lang', 'FUKO Lang', 'karol', 'FUKO language processing', true, 'active', 98, ARRAY['language', 'fuko', 'processing'], '2.5.0', 89),
('@skyai.ai', 'SkyAI', 'integration', 'Advanced AI solutions', true, 'active', 76, ARRAY['ai', 'automation', 'solutions'], '1.7.4', 85)
ON CONFLICT (identifier) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  status = EXCLUDED.status,
  tasks_completed = EXCLUDED.tasks_completed,
  capabilities = EXCLUDED.capabilities,
  version = EXCLUDED.version,
  performance = EXCLUDED.performance;