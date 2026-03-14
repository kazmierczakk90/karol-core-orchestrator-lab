
-- SYSTEM 3: AI REGISTER tables
CREATE TABLE public.agent_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  organization TEXT,
  contact_email TEXT,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  max_agents INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.agent_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  version TEXT NOT NULL,
  changelog TEXT,
  capabilities JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deprecated', 'beta', 'archived')),
  released_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SYSTEM 4: AI PASSPORT tables
CREATE TABLE public.agent_passports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL UNIQUE,
  owner_id UUID REFERENCES public.agent_owners(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  passport_number TEXT NOT NULL UNIQUE,
  identity_hash TEXT NOT NULL,
  signature TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'revoked', 'expired')),
  trust_score NUMERIC(5,2) DEFAULT 50.00,
  capabilities JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.compliance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  passport_id UUID REFERENCES public.agent_passports(id) ON DELETE CASCADE,
  check_type TEXT NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('pass', 'fail', 'warning', 'pending')),
  details JSONB DEFAULT '{}'::jsonb,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.agent_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_passports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_records ENABLE ROW LEVEL SECURITY;

-- Public read for all (system data)
CREATE POLICY "Anyone can read agent_owners" ON public.agent_owners FOR SELECT USING (true);
CREATE POLICY "Anyone can read agent_versions" ON public.agent_versions FOR SELECT USING (true);
CREATE POLICY "Anyone can read agent_passports" ON public.agent_passports FOR SELECT USING (true);
CREATE POLICY "Anyone can read compliance_records" ON public.compliance_records FOR SELECT USING (true);

-- Authenticated users can insert/update
CREATE POLICY "Auth users can insert agent_owners" ON public.agent_owners FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update agent_owners" ON public.agent_owners FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can insert agent_versions" ON public.agent_versions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can insert agent_passports" ON public.agent_passports FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update agent_passports" ON public.agent_passports FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can insert compliance_records" ON public.compliance_records FOR INSERT TO authenticated WITH CHECK (true);

-- Enable realtime for passports
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_passports;
