import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RoutingCondition {
  id?: string;
  category: string;
  segment: string;
  agents: string[];
  reasoning: string;
  is_active?: boolean;
  priority?: number;
  metadata?: Record<string, any>;
}

interface RoutingRequest {
  action: 'find_agents' | 'generate_combinations' | 'add_condition' | 'get_conditions';
  category?: string;
  segment?: string;
  user_context?: Record<string, any>;
  condition?: RoutingCondition;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, category, segment, user_context, condition }: RoutingRequest = await req.json();

    // Find best agents for given category and segment
    if (action === 'find_agents') {
      const { data: conditions, error } = await supabaseAdmin
        .from('routing_conditions')
        .select('*')
        .eq('is_active', true)
        .eq('category', category)
        .eq('segment', segment)
        .order('priority', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (conditions && conditions.length > 0) {
        const bestCondition = conditions[0];
        
        // Get agent details
        const { data: agents } = await supabaseAdmin
          .from('fuko_agents')
          .select('*')
          .in('name', bestCondition.agents)
          .eq('status', 'active');

        return new Response(JSON.stringify({
          success: true,
          condition: bestCondition,
          agents: agents || [],
          reasoning: bestCondition.reasoning
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      return new Response(JSON.stringify({
        success: false,
        message: 'No routing condition found for this combination'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Generate all routing combinations (based on Python file)
    if (action === 'generate_combinations') {
      const categories = [
        'A_prowadzenie_klubu_DJ', 'B_promocja_wydarzenia', 'C_analiza_klienta',
        'D_onboarding_nowy_user', 'E_upselling_subskrypcja', 'F_wsparcie_techniczne',
        'G_rozwoj_kariery_DJ', 'H_networking_community', 'I_organizacja_eventu',
        'J_sprzedaz_bilety', 'K_feedback_po_evencie', 'L_strategia_marketingowa',
        'M_content_creator', 'N_partnership_sponsoring', 'O_szkolenia_warsztaty',
        'P_moderacja_platformy', 'Q_analityka_biznesowa', 'R_crisis_management',
        'S_legal_compliance', 'T_finance_rozliczenia', 'U_innowacje_produktowe',
        'V_customer_success', 'W_user_research', 'X_security_bezpieczenstwo',
        'Y_scalability_infra', 'Z_ai_automation', 'AA_ecosystem_integration'
      ];

      const segments = [
        'Nowy_0-7dni', 'Eksplorujący_7-30dni', 'Aktywny_30-90dni',
        'VIP_90+_high_activity', 'Churn_Risk_brak_aktywności',
        'DJ_Artysta_Twórca', 'Promotor_Event_Manager'
      ];

      const agentPool = [
        'AGENT_FUKO', 'AGENT_0', 'AGENT_CEO', 'AGENT_FORGE',
        'MINI_AI_Coach', 'MINI_AI_Analyzer'
      ];

      const combinations: RoutingCondition[] = [];

      for (const cat of categories) {
        for (const seg of segments) {
          // Smart agent selection logic
          let selectedAgents: string[] = [];
          let reasoning = '';

          // Example logic - customize based on actual needs
          if (seg.includes('Nowy')) {
            selectedAgents = ['AGENT_FUKO', 'MINI_AI_Coach'];
            reasoning = 'Nowy użytkownik wymaga onboardingu i wsparcia podstawowego';
          } else if (seg.includes('VIP')) {
            selectedAgents = ['AGENT_CEO', 'AGENT_0', 'AGENT_FUKO'];
            reasoning = 'VIP użytkownik wymaga premium support i decyzji strategicznych';
          } else if (seg.includes('DJ_Artysta')) {
            selectedAgents = ['AGENT_FORGE', 'MINI_AI_Analyzer'];
            reasoning = 'Artysta potrzebuje narzędzi kreatywnych i analityki';
          } else {
            selectedAgents = ['AGENT_FUKO', 'AGENT_0'];
            reasoning = 'Standardowa obsługa użytkownika aktywnego';
          }

          combinations.push({
            category: cat,
            segment: seg,
            agents: selectedAgents,
            reasoning,
            is_active: true,
            priority: 5,
            metadata: {
              generated: true,
              timestamp: new Date().toISOString()
            }
          });
        }
      }

      // Insert combinations into database
      const { data, error } = await supabaseAdmin
        .from('routing_conditions')
        .insert(combinations)
        .select();

      if (error) throw error;

      return new Response(JSON.stringify({
        success: true,
        message: `Generated ${combinations.length} routing combinations`,
        count: combinations.length,
        data
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Add single routing condition
    if (action === 'add_condition' && condition) {
      const { data, error } = await supabaseAdmin
        .from('routing_conditions')
        .insert(condition)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({
        success: true,
        data
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Get all routing conditions
    if (action === 'get_conditions') {
      const { data, error } = await supabaseAdmin
        .from('routing_conditions')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;

      return new Response(JSON.stringify({
        success: true,
        data,
        count: data?.length || 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });

  } catch (error) {
    console.error('Error in routing-engine:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
