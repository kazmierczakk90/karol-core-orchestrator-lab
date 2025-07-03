
import { supabase } from '@/integrations/supabase/client';
import type { EDICTPrompt, IntentionAnalysis } from '@/types/edict';

class EDICTService {
  async analyzeIntention(prompt: string): Promise<IntentionAnalysis> {
    // Symulacja analizy intencji - w rzeczywistości byłoby to połączenie z AI
    const analysis: IntentionAnalysis = {
      user_goal: "Analiza celu użytkownika z podanego promptu",
      context_required: ["domain_knowledge", "user_preferences", "task_complexity"],
      complexity_level: prompt.length > 200 ? 'complex' : prompt.length > 50 ? 'medium' : 'simple',
      domain: "general",
      suggested_approach: "step_by_step_analysis"
    };
    
    return analysis;
  }

  async enrichWithRules(analysis: IntentionAnalysis, mode: 'lite' | 'advanced'): Promise<any> {
    const baseRules = {
      clarity_rules: ["Be specific", "Use clear language", "Provide context"],
      format_rules: ["Structure response", "Use bullet points", "Include examples"],
      quality_rules: ["Fact-check", "Be comprehensive", "Stay on topic"]
    };

    if (mode === 'advanced') {
      return {
        ...baseRules,
        advanced_rules: ["Multi-perspective analysis", "Edge case consideration", "Iterative refinement"],
        meta_rules: ["Self-reflection", "Quality validation", "Optimization suggestions"]
      };
    }

    return baseRules;
  }

  async generatePrompt(originalPrompt: string, analysis: IntentionAnalysis, rules: any): Promise<string> {
    const promptTemplate = `
SYSTEM CONTEXT: Advanced Karol-Core AGI Processing
USER GOAL: ${analysis.user_goal}
COMPLEXITY: ${analysis.complexity_level}
DOMAIN: ${analysis.domain}

ORIGINAL REQUEST: ${originalPrompt}

PROCESSING RULES:
${Object.entries(rules).map(([category, ruleList]: [string, any]) => 
  `${category.toUpperCase()}: ${Array.isArray(ruleList) ? ruleList.join(', ') : JSON.stringify(ruleList)}`
).join('\n')}

ENHANCED INSTRUCTION: Please process the original request following the analysis and rules above, ensuring ${analysis.suggested_approach} approach.
`;

    return promptTemplate.trim();
  }

  async createPrompt(originalPrompt: string, analysis?: IntentionAnalysis, rules?: any, generatedPrompt?: string, mode: 'lite' | 'advanced' = 'lite', userId?: string): Promise<EDICTPrompt | null> {
    const { data: result, error } = await supabase
      .from('edict_prompts')
      .insert({
        original_prompt: originalPrompt,
        analyzed_intention: analysis || null,
        enriched_rules: rules || null,
        generated_prompt: generatedPrompt || null,
        orchestration_mode: mode,
        user_id: userId || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating EDICT prompt:', error);
      return null;
    }

    return result as EDICTPrompt;
  }

  async getPrompts(): Promise<EDICTPrompt[]> {
    const { data, error } = await supabase
      .from('edict_prompts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching EDICT prompts:', error);
      return [];
    }

    return data as EDICTPrompt[];
  }

  async processPrompt(originalPrompt: string, mode: 'lite' | 'advanced' = 'lite'): Promise<EDICTPrompt | null> {
    try {
      // Krok 1: Analiza intencji
      const analysis = await this.analyzeIntention(originalPrompt);
      
      // Krok 2: Wzbogacenie o reguły
      const rules = await this.enrichWithRules(analysis, mode);
      
      // Krok 3: Generowanie final prompt
      const generatedPrompt = await this.generatePrompt(originalPrompt, analysis, rules);
      
      // Krok 4: Zapis do bazy
      return await this.createPrompt(originalPrompt, analysis, rules, generatedPrompt, mode);
    } catch (error) {
      console.error('Error processing EDICT prompt:', error);
      return null;
    }
  }
}

export const edictService = new EDICTService();
