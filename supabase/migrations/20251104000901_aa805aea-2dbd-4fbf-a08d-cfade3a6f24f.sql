-- ============================================
-- P0 LEVEL 1: AUTO-IMPROVEMENT SYSTEM TABLES
-- ============================================

-- Improvement patterns detected by AI
CREATE TABLE IF NOT EXISTS improvement_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Pattern identification
  pattern_type TEXT NOT NULL, -- 'performance_bottleneck', 'error_pattern', 'user_friction', etc.
  pattern_signature TEXT NOT NULL, -- unique identifier for this pattern
  
  -- Detection
  detected_in_events UUID[], -- references to improvement_events
  occurrence_count INTEGER DEFAULT 1,
  first_detected TIMESTAMPTZ DEFAULT now(),
  last_detected TIMESTAMPTZ DEFAULT now(),
  
  -- AI Analysis
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  impact_assessment JSONB NOT NULL, -- {affected_components: [...], estimated_impact: 0-1, ...}
  root_cause_analysis JSONB, -- AI-generated analysis
  
  -- Recommendations
  suggested_actions JSONB[], -- array of possible fixes
  estimated_effort TEXT CHECK (estimated_effort IN ('trivial', 'minor', 'moderate', 'major', 'critical')),
  
  -- Status
  status TEXT DEFAULT 'detected' CHECK (status IN ('detected', 'analyzed', 'approved', 'implemented', 'dismissed')),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_improvement_patterns_status ON improvement_patterns(status);
CREATE INDEX idx_improvement_patterns_severity ON improvement_patterns(severity);
CREATE INDEX idx_improvement_patterns_type ON improvement_patterns(pattern_type);

-- Multi-agent improvement decisions
CREATE TABLE IF NOT EXISTS improvement_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_id UUID REFERENCES improvement_patterns(id) ON DELETE CASCADE,
  
  -- Proposed action
  action_type TEXT NOT NULL, -- 'code_optimization', 'architecture_change', 'bug_fix', etc.
  action_description TEXT NOT NULL,
  implementation_plan JSONB NOT NULL,
  
  -- Multi-agent voting
  agent_votes JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{agent: '@ceo', vote: 'approve', weight: 3, reasoning: '...'}, ...]
  total_vote_score NUMERIC DEFAULT 0,
  required_approval_score NUMERIC DEFAULT 5, -- threshold for approval
  
  -- Risk assessment
  risk_level TEXT CHECK (risk_level IN ('minimal', 'low', 'medium', 'high', 'critical')),
  risk_factors JSONB[],
  rollback_plan JSONB,
  
  -- Testing requirements
  requires_testing BOOLEAN DEFAULT true,
  test_scenarios JSONB[],
  
  -- Decision status
  status TEXT DEFAULT 'voting' CHECK (status IN ('voting', 'approved', 'rejected', 'implemented', 'rolled_back')),
  decided_at TIMESTAMPTZ,
  decided_by TEXT, -- final approver
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_improvement_decisions_status ON improvement_decisions(status);
CREATE INDEX idx_improvement_decisions_pattern ON improvement_decisions(pattern_id);

-- Implementation tracking
CREATE TABLE IF NOT EXISTS improvement_implementations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES improvement_decisions(id) ON DELETE CASCADE,
  
  -- Implementation details
  implementation_type TEXT NOT NULL, -- 'code_change', 'config_update', 'database_migration', etc.
  target_files TEXT[], -- which files were modified
  changes_summary TEXT NOT NULL,
  
  -- Code changes (AI-generated)
  original_code TEXT,
  modified_code TEXT,
  diff_summary TEXT,
  
  -- Testing
  sandbox_tested BOOLEAN DEFAULT false,
  test_results JSONB,
  test_passed BOOLEAN,
  
  -- Deployment
  deployed BOOLEAN DEFAULT false,
  deployment_timestamp TIMESTAMPTZ,
  deployment_method TEXT, -- 'automatic', 'manual_review'
  
  -- Performance monitoring
  performance_before JSONB, -- metrics before change
  performance_after JSONB, -- metrics after change
  improvement_percentage NUMERIC,
  
  -- Rollback capability
  can_rollback BOOLEAN DEFAULT true,
  rollback_executed BOOLEAN DEFAULT false,
  rollback_timestamp TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_improvement_implementations_decision ON improvement_implementations(decision_id);
CREATE INDEX idx_improvement_implementations_deployed ON improvement_implementations(deployed);

-- ============================================
-- P0 LEVEL 2: SAFETY MODULES - ACTIVE RESPONSE
-- ============================================

-- Agent drift detection and correction
CREATE TABLE IF NOT EXISTS drift_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  
  -- Drift detection
  detected_at TIMESTAMPTZ DEFAULT now(),
  drift_type TEXT NOT NULL, -- 'style_drift', 'performance_degradation', 'behavior_anomaly'
  drift_severity NUMERIC NOT NULL CHECK (drift_severity BETWEEN 0 AND 1),
  
  -- Measurement
  baseline_metrics JSONB NOT NULL, -- what the agent should be
  current_metrics JSONB NOT NULL, -- what the agent is now
  deviation_details JSONB NOT NULL, -- specific deviations
  
  -- Correction action
  correction_type TEXT NOT NULL, -- 'prompt_adjustment', 'parameter_reset', 'style_recalibration'
  correction_applied JSONB NOT NULL, -- what was changed
  
  -- Verification
  corrected BOOLEAN DEFAULT false,
  verification_metrics JSONB,
  correction_successful BOOLEAN,
  
  -- Auto-correction
  auto_corrected BOOLEAN DEFAULT false,
  manual_review_required BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  verified_at TIMESTAMPTZ
);

CREATE INDEX idx_drift_corrections_agent ON drift_corrections(agent_id);
CREATE INDEX idx_drift_corrections_type ON drift_corrections(drift_type);
CREATE INDEX idx_drift_corrections_corrected ON drift_corrections(corrected);

-- Agent health monitoring
CREATE TABLE IF NOT EXISTS agent_health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  
  -- Health metrics
  checked_at TIMESTAMPTZ DEFAULT now(),
  response_time NUMERIC, -- milliseconds
  error_rate NUMERIC, -- 0-1
  success_rate NUMERIC, -- 0-1
  load_level NUMERIC, -- 0-1
  
  -- Status assessment
  health_status TEXT NOT NULL CHECK (health_status IN ('healthy', 'degraded', 'unhealthy', 'critical', 'offline')),
  health_score NUMERIC CHECK (health_score BETWEEN 0 AND 100),
  
  -- Issues detected
  detected_issues JSONB[], -- [{issue: '...', severity: '...', ...}]
  performance_anomalies JSONB[],
  
  -- Recommendations
  recommended_actions TEXT[],
  auto_action_taken TEXT, -- 'none', 'restart', 'failover', 'load_balance'
  
  -- Alerts
  alert_triggered BOOLEAN DEFAULT false,
  alert_level TEXT CHECK (alert_level IN ('info', 'warning', 'error', 'critical')),
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_agent_health_checks_agent ON agent_health_checks(agent_id);
CREATE INDEX idx_agent_health_checks_status ON agent_health_checks(health_status);
CREATE INDEX idx_agent_health_checks_time ON agent_health_checks(checked_at DESC);

-- Safety actions log
CREATE TABLE IF NOT EXISTS safety_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Trigger
  triggered_by_check UUID REFERENCES agent_health_checks(id),
  triggered_by_drift UUID REFERENCES drift_corrections(id),
  trigger_type TEXT NOT NULL, -- 'health_issue', 'drift_detection', 'manual', 'scheduled'
  
  -- Action details
  action_type TEXT NOT NULL, -- 'agent_restart', 'failover', 'load_balance', 'circuit_breaker', 'rate_limit'
  target_agent TEXT NOT NULL,
  action_parameters JSONB,
  
  -- Execution
  executed BOOLEAN DEFAULT false,
  executed_at TIMESTAMPTZ,
  execution_duration INTEGER, -- milliseconds
  
  -- Results
  success BOOLEAN,
  result_details JSONB,
  error_message TEXT,
  
  -- Impact
  system_impact TEXT CHECK (system_impact IN ('none', 'minimal', 'moderate', 'significant')),
  affected_operations INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_safety_actions_agent ON safety_actions(target_agent);
CREATE INDEX idx_safety_actions_type ON safety_actions(action_type);
CREATE INDEX idx_safety_actions_executed ON safety_actions(executed);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE improvement_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE improvement_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE improvement_implementations ENABLE ROW LEVEL SECURITY;
ALTER TABLE drift_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_actions ENABLE ROW LEVEL SECURITY;

-- Admin access to all improvement tables
CREATE POLICY "Admin can manage improvement patterns"
ON improvement_patterns FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Admin can manage improvement decisions"
ON improvement_decisions FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Admin can manage improvement implementations"
ON improvement_implementations FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Admin access to all safety tables
CREATE POLICY "Admin can view drift corrections"
ON drift_corrections FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "System can insert drift corrections"
ON drift_corrections FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admin can view agent health checks"
ON agent_health_checks FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "System can insert agent health checks"
ON agent_health_checks FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admin can view safety actions"
ON safety_actions FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "System can manage safety actions"
ON safety_actions FOR ALL
USING (true);