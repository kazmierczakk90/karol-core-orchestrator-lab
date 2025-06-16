
-- Etap 1: Database Foundation dla Meta-Decision Layer (Poziomy 3-8)

-- Tabela dla meta-decyzji i orchestracji
CREATE TABLE public.meta_decisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  decision_type TEXT NOT NULL,
  source_agent TEXT NOT NULL,
  target_agent TEXT,
  priority INTEGER NOT NULL DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'pending',
  context JSONB,
  routing_score NUMERIC DEFAULT 0,
  execution_result JSONB,
  emotional_state JSONB,
  style_fingerprint TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Tabela dla reguł routingu
CREATE TABLE public.routing_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_name TEXT NOT NULL,
  agent_pattern TEXT NOT NULL,
  decision_pattern TEXT NOT NULL,
  priority_modifier INTEGER DEFAULT 0,
  conditions JSONB,
  actions JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela dla stanów agentów
CREATE TABLE public.agent_states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id TEXT NOT NULL UNIQUE,
  current_status TEXT NOT NULL DEFAULT 'idle',
  emotional_state JSONB DEFAULT '{}',
  performance_score NUMERIC DEFAULT 85,
  load_level INTEGER DEFAULT 0,
  last_decision_at TIMESTAMP WITH TIME ZONE,
  style_consistency NUMERIC DEFAULT 100,
  identity_score NUMERIC DEFAULT 70,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela dla kolejki priorytetów
CREATE TABLE public.priority_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  decision_id UUID REFERENCES public.meta_decisions(id),
  calculated_priority NUMERIC NOT NULL,
  queue_position INTEGER,
  resource_requirements JSONB,
  estimated_duration INTEGER,
  dependencies TEXT[],
  scheduled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela dla audytu spójności (FUKO_AUDITOR)
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_type TEXT NOT NULL,
  target_entity TEXT NOT NULL,
  target_id TEXT NOT NULL,
  consistency_score NUMERIC,
  issues_found JSONB,
  recommendations JSONB,
  severity_level TEXT DEFAULT 'info',
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela dla FUKO_RAM (pamięć emocjonalna)
CREATE TABLE public.fuko_ram (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id TEXT NOT NULL,
  memory_type TEXT NOT NULL,
  emotional_context JSONB NOT NULL,
  memory_content TEXT NOT NULL,
  intensity_level NUMERIC DEFAULT 5,
  decay_rate NUMERIC DEFAULT 0.1,
  trigger_conditions JSONB,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela dla FUKO_ID (zarządzanie tożsamością)
CREATE TABLE public.fuko_identity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id TEXT NOT NULL UNIQUE,
  core_identity JSONB NOT NULL,
  style_signature TEXT NOT NULL,
  behavioral_patterns JSONB,
  identity_evolution JSONB[],
  consistency_metrics JSONB,
  last_verification TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indeksy dla wydajności
CREATE INDEX idx_meta_decisions_status ON public.meta_decisions(status);
CREATE INDEX idx_meta_decisions_priority ON public.meta_decisions(priority DESC);
CREATE INDEX idx_meta_decisions_source_agent ON public.meta_decisions(source_agent);
CREATE INDEX idx_agent_states_agent_id ON public.agent_states(agent_id);
CREATE INDEX idx_priority_queue_priority ON public.priority_queue(calculated_priority DESC);
CREATE INDEX idx_audit_logs_target ON public.audit_logs(target_entity, target_id);
CREATE INDEX idx_fuko_ram_agent_id ON public.fuko_ram(agent_id);

-- Funkcje pomocnicze dla decision routing
CREATE OR REPLACE FUNCTION public.calculate_routing_score(
  decision_data JSONB,
  agent_capabilities TEXT[]
) RETURNS NUMERIC AS $$
DECLARE
  base_score NUMERIC := 50;
  capability_match NUMERIC := 0;
  load_penalty NUMERIC := 0;
BEGIN
  -- Oblicz dopasowanie capabilities
  IF array_length(agent_capabilities, 1) > 0 THEN
    capability_match := 30;
  END IF;
  
  -- Podstawowy scoring
  RETURN base_score + capability_match - load_penalty;
END;
$$ LANGUAGE plpgsql;

-- Funkcja dla priority calculation
CREATE OR REPLACE FUNCTION public.calculate_decision_priority(
  decision_id UUID
) RETURNS NUMERIC AS $$
DECLARE
  base_priority NUMERIC;
  emotional_modifier NUMERIC := 0;
  urgency_modifier NUMERIC := 0;
  final_priority NUMERIC;
BEGIN
  SELECT priority INTO base_priority 
  FROM public.meta_decisions 
  WHERE id = decision_id;
  
  -- Modyfikacje na podstawie kontekstu emocjonalnego
  -- (logika zostanie rozwinięta w kolejnych etapach)
  
  final_priority := base_priority + emotional_modifier + urgency_modifier;
  
  RETURN GREATEST(1, LEAST(10, final_priority));
END;
$$ LANGUAGE plpgsql;

-- Trigger dla automatycznego update'u agent states
CREATE OR REPLACE FUNCTION public.update_agent_state_trigger()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.agent_states 
  SET updated_at = now(),
      last_decision_at = CASE 
        WHEN NEW.status = 'completed' THEN now() 
        ELSE last_decision_at 
      END
  WHERE agent_id = NEW.source_agent;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER meta_decisions_agent_state_update
  AFTER UPDATE ON public.meta_decisions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_agent_state_trigger();

-- RLS Policies
ALTER TABLE public.meta_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.priority_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuko_ram ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuko_identity ENABLE ROW LEVEL SECURITY;

-- Podstawowe policies (publiczne dla development, można later ograniczyć)
CREATE POLICY "Allow all operations on meta_decisions" ON public.meta_decisions FOR ALL USING (true);
CREATE POLICY "Allow all operations on routing_rules" ON public.routing_rules FOR ALL USING (true);
CREATE POLICY "Allow all operations on agent_states" ON public.agent_states FOR ALL USING (true);
CREATE POLICY "Allow all operations on priority_queue" ON public.priority_queue FOR ALL USING (true);
CREATE POLICY "Allow all operations on audit_logs" ON public.audit_logs FOR ALL USING (true);
CREATE POLICY "Allow all operations on fuko_ram" ON public.fuko_ram FOR ALL USING (true);
CREATE POLICY "Allow all operations on fuko_identity" ON public.fuko_identity FOR ALL USING (true);
