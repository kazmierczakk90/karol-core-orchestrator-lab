-- Tabela dla inteligentnych warunków routingu
CREATE TABLE IF NOT EXISTS public.routing_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  segment TEXT NOT NULL,
  agents TEXT[] NOT NULL,
  reasoning TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 5,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indeksy dla szybkiego wyszukiwania
CREATE INDEX idx_routing_conditions_category ON public.routing_conditions(category);
CREATE INDEX idx_routing_conditions_segment ON public.routing_conditions(segment);
CREATE INDEX idx_routing_conditions_active ON public.routing_conditions(is_active);

-- RLS policies
ALTER TABLE public.routing_conditions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage routing conditions"
ON public.routing_conditions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Users can view active routing conditions"
ON public.routing_conditions
FOR SELECT
TO authenticated
USING (is_active = true);

-- Tabela dla workflow macros
CREATE TABLE IF NOT EXISTS public.workflow_macros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  macro_name TEXT UNIQUE NOT NULL,
  description TEXT,
  steps JSONB NOT NULL,
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS dla workflow_macros
ALTER TABLE public.workflow_macros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage workflow macros"
ON public.workflow_macros
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Users can view active macros"
ON public.workflow_macros
FOR SELECT
TO authenticated
USING (is_active = true);

-- Funkcja do update timestamp
CREATE OR REPLACE FUNCTION update_routing_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_routing_conditions_timestamp
BEFORE UPDATE ON public.routing_conditions
FOR EACH ROW
EXECUTE FUNCTION update_routing_timestamp();

CREATE TRIGGER update_workflow_macros_timestamp
BEFORE UPDATE ON public.workflow_macros
FOR EACH ROW
EXECUTE FUNCTION update_routing_timestamp();