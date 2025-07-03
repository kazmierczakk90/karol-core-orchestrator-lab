
export interface EDICTPrompt {
  id: string;
  user_id?: string;
  original_prompt: string;
  analyzed_intention?: any;
  enriched_rules?: any;
  generated_prompt?: string;
  orchestration_mode: 'lite' | 'advanced';
  created_at: string;
  updated_at: string;
}

export interface EDICTConfig {
  enabled: boolean;
  mode: 'hybrid' | 'lite' | 'advanced';
  max_iterations: number;
}

export interface IntentionAnalysis {
  user_goal: string;
  context_required: string[];
  complexity_level: 'simple' | 'medium' | 'complex';
  domain: string;
  suggested_approach: string;
}
