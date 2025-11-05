-- P1: Emotional Engine Tables (Fixed)
CREATE TABLE IF NOT EXISTS public.emotional_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  confidence NUMERIC NOT NULL DEFAULT 50 CHECK (confidence >= 0 AND confidence <= 100),
  creativity NUMERIC NOT NULL DEFAULT 50 CHECK (creativity >= 0 AND creativity <= 100),
  focus NUMERIC NOT NULL DEFAULT 50 CHECK (focus >= 0 AND focus <= 100),
  empathy NUMERIC NOT NULL DEFAULT 50 CHECK (empathy >= 0 AND empathy <= 100),
  curiosity NUMERIC NOT NULL DEFAULT 50 CHECK (curiosity >= 0 AND curiosity <= 100),
  energy_level NUMERIC NOT NULL DEFAULT 50 CHECK (energy_level >= 0 AND energy_level <= 100),
  stress_level NUMERIC NOT NULL DEFAULT 0 CHECK (stress_level >= 0 AND stress_level <= 100),
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_emotional_states_agent ON public.emotional_states(agent_id);
CREATE INDEX idx_emotional_states_created ON public.emotional_states(created_at DESC);

CREATE TABLE IF NOT EXISTS public.emotional_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  event_description TEXT NOT NULL,
  intensity NUMERIC NOT NULL CHECK (intensity >= 0 AND intensity <= 100),
  emotional_context JSONB NOT NULL,
  impact_score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_emotional_memories_agent ON public.emotional_memories(agent_id);
CREATE INDEX idx_emotional_memories_created ON public.emotional_memories(created_at DESC);

CREATE TABLE IF NOT EXISTS public.message_emotional_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID,
  session_id UUID,
  detected_sentiment TEXT NOT NULL,
  sentiment_score NUMERIC NOT NULL CHECK (sentiment_score >= -1 AND sentiment_score <= 1),
  emotional_adjustments JSONB DEFAULT '{}',
  response_tone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_message_emotional_session ON public.message_emotional_context(session_id);
CREATE INDEX idx_message_emotional_created ON public.message_emotional_context(created_at DESC);

-- RLS Policies
ALTER TABLE public.emotional_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotional_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_emotional_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage emotional states"
  ON public.emotional_states FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "System can insert emotional states"
  ON public.emotional_states FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can manage emotional memories"
  ON public.emotional_memories FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "System can insert emotional memories"
  ON public.emotional_memories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view emotional context for their sessions"
  ON public.message_emotional_context FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM chat_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert emotional context"
  ON public.message_emotional_context FOR INSERT
  WITH CHECK (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_emotional_states_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_emotional_states_updated_at
  BEFORE UPDATE ON public.emotional_states
  FOR EACH ROW
  EXECUTE FUNCTION update_emotional_states_timestamp();