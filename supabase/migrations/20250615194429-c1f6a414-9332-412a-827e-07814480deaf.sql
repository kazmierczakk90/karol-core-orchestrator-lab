
-- Faza 1: Rozszerzenie struktury bazy danych

-- 1. Tworzenie tabeli 'system_connections' do przechowywania połączeń systemowych.
-- Dane te są obecnie statyczne w kodzie i zostaną przeniesione do bazy.
CREATE TABLE IF NOT EXISTS public.system_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- np. 'api', 'database', 'service'
    status TEXT NOT NULL, -- np. 'connected', 'disconnected', 'error'
    endpoint TEXT NOT NULL,
    last_ping TIMESTAMPTZ DEFAULT now(),
    response_time INT DEFAULT 0,
    uptime NUMERIC(5, 2) DEFAULT 100.00,
    requests INT DEFAULT 0,
    errors INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tworzenie tabeli 'mini_ai' dla instancji Mini AI.
CREATE TABLE IF NOT EXISTS public.mini_ai (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'standard-tool', 'mini-app'
    description TEXT,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    is_pinned BOOLEAN DEFAULT false,
    config JSONB,
    author TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tworzenie tabeli 'memory_entries' dla wpisów pamięci.
CREATE TABLE IF NOT EXISTS public.memory_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    context TEXT,
    importance INT CHECK (importance BETWEEN 1 AND 5),
    memory_type TEXT, -- 'permanent', 'session', 'temporary'
    trigger_rules TEXT[],
    "timestamp" TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ
);

-- 4. Ustawienie Row Level Security (RLS) dla nowych tabel.
-- Na razie polityki są otwarte, ale przygotowują system pod przyszłe zabezpieczenia.
ALTER TABLE public.system_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to system_connections" ON public.system_connections FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.mini_ai ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to mini_ai" ON public.mini_ai FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.memory_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to memory_entries" ON public.memory_entries FOR ALL USING (true) WITH CHECK (true);

-- 5. Włączenie nasłuchiwania zmian w czasie rzeczywistym (Real-Time) dla nowych tabel.
-- To kluczowe dla niezawodności i natychmiastowej synchronizacji interfejsu.
ALTER TABLE public.system_connections REPLICA IDENTITY FULL;
ALTER TABLE public.mini_ai REPLICA IDENTITY FULL;
ALTER TABLE public.memory_entries REPLICA IDENTITY FULL;

-- Dodanie tabel do istniejącej publikacji 'supabase_realtime'.
ALTER PUBLICATION supabase_realtime ADD TABLE public.system_connections, public.mini_ai, public.memory_entries;

