-- P2: Advanced Reasoning Tables

-- Optimization Manager
CREATE TABLE IF NOT EXISTS public.optimization_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_type TEXT NOT NULL,
  target_component TEXT NOT NULL,
  current_metrics JSONB NOT NULL,
  target_metrics JSONB NOT NULL,
  optimization_strategy TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'testing', 'implementing', 'completed', 'failed')),
  analysis_result JSONB,
  test_results JSONB,
  improvement_percentage NUMERIC,
  estimated_impact TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by TEXT
);

CREATE INDEX idx_optimization_tasks_status ON public.optimization_tasks(status);
CREATE INDEX idx_optimization_tasks_priority ON public.optimization_tasks(priority DESC);
CREATE INDEX idx_optimization_tasks_created ON public.optimization_tasks(created_at DESC);

-- Quantum Decision Trees
CREATE TABLE IF NOT EXISTS public.decision_trees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  root_decision_id UUID,
  decision_context JSONB NOT NULL,
  available_paths INTEGER NOT NULL DEFAULT 0,
  explored_paths INTEGER NOT NULL DEFAULT 0,
  optimal_path_id UUID,
  confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_decision_trees_root ON public.decision_trees(root_decision_id);
CREATE INDEX idx_decision_trees_created ON public.decision_trees(created_at DESC);

-- Monte Carlo Simulations
CREATE TABLE IF NOT EXISTS public.monte_carlo_simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_tree_id UUID NOT NULL,
  path_id UUID NOT NULL,
  iterations INTEGER NOT NULL DEFAULT 1000,
  success_rate NUMERIC NOT NULL CHECK (success_rate >= 0 AND success_rate <= 100),
  average_outcome NUMERIC NOT NULL,
  variance NUMERIC NOT NULL,
  risk_score NUMERIC CHECK (risk_score >= 0 AND risk_score <= 100),
  simulation_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_monte_carlo_tree ON public.monte_carlo_simulations(decision_tree_id);
CREATE INDEX idx_monte_carlo_path ON public.monte_carlo_simulations(path_id);

-- Path Evaluations
CREATE TABLE IF NOT EXISTS public.path_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_tree_id UUID NOT NULL,
  path_sequence JSONB NOT NULL,
  expected_value NUMERIC NOT NULL,
  risk_adjusted_value NUMERIC NOT NULL,
  execution_complexity TEXT NOT NULL CHECK (execution_complexity IN ('low', 'medium', 'high', 'very_high')),
  resource_requirements JSONB NOT NULL,
  estimated_duration INTEGER,
  dependencies TEXT[],
  constraints JSONB,
  evaluation_score NUMERIC NOT NULL CHECK (evaluation_score >= 0 AND evaluation_score <= 100),
  recommendation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_path_evaluations_tree ON public.path_evaluations(decision_tree_id);
CREATE INDEX idx_path_evaluations_score ON public.path_evaluations(evaluation_score DESC);

-- RLS Policies
ALTER TABLE public.optimization_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monte_carlo_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.path_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage optimization tasks"
  ON public.optimization_tasks FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "System can insert optimization tasks"
  ON public.optimization_tasks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can view decision trees"
  ON public.decision_trees FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "System can manage decision trees"
  ON public.decision_trees FOR ALL
  USING (true);

CREATE POLICY "Admin can view monte carlo simulations"
  ON public.monte_carlo_simulations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "System can manage simulations"
  ON public.monte_carlo_simulations FOR ALL
  USING (true);

CREATE POLICY "Admin can view path evaluations"
  ON public.path_evaluations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "System can manage path evaluations"
  ON public.path_evaluations FOR ALL
  USING (true);