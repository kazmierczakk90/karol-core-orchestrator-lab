
-- Krok 1: Inicjalizacja Danych - Dodanie kolumny 'name' do tabeli kpi_data
ALTER TABLE public.kpi_data ADD COLUMN name TEXT;
UPDATE public.kpi_data SET name = id::text WHERE name IS NULL;
ALTER TABLE public.kpi_data ALTER COLUMN name SET NOT NULL;
ALTER TABLE public.kpi_data ADD CONSTRAINT kpi_data_name_unique UNIQUE (name);

-- Krok 1: Inicjalizacja Danych - Zasilenie tabeli fuko_agents
INSERT INTO public.fuko_agents (name, category, mode, capabilities, performance, competency_score, dependencies) VALUES
('@ceo', 'core', 'CEO', '{"decision_making", "strategic_planning"}', 95.5, 92.1, '{}'),
('@voice-core', 'core', 'ECHO', '{"voice_synthesis", "communication"}', 88.2, 75.4, '{}'),
('@guardian-core', 'core', 'LIVE', '{"monitoring", "security", "alerts"}', 98.1, 95.3, '{}'),
('@router', 'system', 'LIVE', '{"routing", "load_balancing"}', 91.7, 89.9, '{}'),
('@controlling', 'system', 'CEO', '{"kpi_monitoring", "financial_analysis"}', 85.3, 81.2, '{}'),
('@system-admin', 'system', 'LIVE', '{"system_management", "optimization"}', 93.4, 90.6, '{}'),
('@party-app', 'project', 'CREATIVE', '{"event_management", "social_features"}', 82.1, 78.5, '{}'),
('@sky-solution', 'project', 'CREATIVE', '{"ai_automation", "workflow"}', 87.6, 84.3, '{}'),
('@fuko-lang', 'fuko', 'CEO', '{"language_processing", "command_parsing"}', 89.9, 88.1, '{}'),
('@karol-core', 'core', 'CEO', '{"identity_management", "core_decisions"}', 99.2, 97.8, '{}');

-- Krok 1: Inicjalizacja Danych - Zasilenie tabeli kpi_data
INSERT INTO public.kpi_data (name, value, threshold, trend) VALUES
('sales_conversion', 67, 70, 'down'),
('system_performance', 89, 85, 'up'),
('user_engagement', 43, 60, 'down'),
('agent_efficiency', 92, 80, 'stable');

-- Krok 1: Inicjalizacja Danych - Zasilenie tabeli fuko_messages przykładowymi danymi
INSERT INTO public.fuko_messages ("F", "U", "K", "O", "P", "Z", "K2", source_agent, priority, status, target_agent, execution_result) VALUES
('Senior Health Check', 'Monitor senior activity and health metrics', 'User is senior_001', 'Vital signs checked', 'Daily at 8am', 'senior-agent active', '&senior-agent --check-vitals --user_id senior_001', '@ceo', 'high', 'completed', '@guardian-core', 'Vitals checked successfully for senior_001.'),
('Lead Nurturing', 'Convert high-scoring leads to customers', 'Lead score > 80', 'Lead converted', 'On score update', 'crm-agent active', '&crm-agent --nurture-lead --lead_id lead_12345', '@ceo', 'medium', 'processing', '@sky-solution', NULL),
('System Optimization', 'Optimize system performance and resources', 'CPU Load > 85%', 'CPU Load < 70%', 'On high load alert', 'guardian-core active', '&guardian-core --optimize-resources', '@ceo', 'high', 'pending', NULL, NULL),
('Emergency Response', 'Handle critical system alerts', 'Critical alert received', 'System stabilized', 'On critical alert', 'guardian-core active', '&guardian-core --emergency --alert_type system_critical', '@ceo', 'urgent', 'pending', NULL, NULL),
('Analyze User Feedback', 'Improve user satisfaction by analyzing feedback', 'New feedback entry', 'Sentiment analysis report generated', 'On new feedback', 'nlp_agent active', '&nlp-agent --analyze-feedback --entry_id feedback_987', '@controlling', 'low', 'pending', NULL, NULL);

