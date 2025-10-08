export interface RoutingCondition {
  id: string;
  category: string;
  segment: string;
  agents: string[];
  reasoning: string;
  is_active: boolean;
  priority: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface WorkflowMacro {
  id: string;
  macro_name: string;
  description?: string;
  steps: Record<string, any>;
  category: string;
  is_active: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface RoutingRequest {
  action: 'find_agents' | 'generate_combinations' | 'add_condition' | 'get_conditions';
  category?: string;
  segment?: string;
  user_context?: Record<string, any>;
  condition?: Partial<RoutingCondition>;
}

export interface RoutingResult {
  success: boolean;
  condition?: RoutingCondition;
  agents?: any[];
  reasoning?: string;
  message?: string;
  data?: any;
  count?: number;
}

export const ROUTING_CATEGORIES = [
  'A_prowadzenie_klubu_DJ',
  'B_promocja_wydarzenia',
  'C_analiza_klienta',
  'D_onboarding_nowy_user',
  'E_upselling_subskrypcja',
  'F_wsparcie_techniczne',
  'G_rozwoj_kariery_DJ',
  'H_networking_community',
  'I_organizacja_eventu',
  'J_sprzedaz_bilety',
  'K_feedback_po_evencie',
  'L_strategia_marketingowa',
  'M_content_creator',
  'N_partnership_sponsoring',
  'O_szkolenia_warsztaty',
  'P_moderacja_platformy',
  'Q_analityka_biznesowa',
  'R_crisis_management',
  'S_legal_compliance',
  'T_finance_rozliczenia',
  'U_innowacje_produktowe',
  'V_customer_success',
  'W_user_research',
  'X_security_bezpieczenstwo',
  'Y_scalability_infra',
  'Z_ai_automation',
  'AA_ecosystem_integration'
] as const;

export const USER_SEGMENTS = [
  'Nowy_0-7dni',
  'Eksplorujący_7-30dni',
  'Aktywny_30-90dni',
  'VIP_90+_high_activity',
  'Churn_Risk_brak_aktywności',
  'DJ_Artysta_Twórca',
  'Promotor_Event_Manager'
] as const;

export type RoutingCategory = typeof ROUTING_CATEGORIES[number];
export type UserSegment = typeof USER_SEGMENTS[number];
