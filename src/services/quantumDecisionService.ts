import { supabase } from '@/integrations/supabase/db';

export interface DecisionPath {
  pathId: string;
  description: string;
  successRate: number;
  avgOutcome: number;
  riskScore: number;
  evaluationScore: number;
  recommendation: string;
}

export interface QuantumDecisionResult {
  treeId: string;
  totalPaths: number;
  optimalPath: DecisionPath | null;
  allPaths: DecisionPath[];
}

class QuantumDecisionService {
  /**
   * Evaluate a decision with quantum multi-path analysis
   */
  async evaluateDecision(
    decisionContext: any,
    rootDecisionId?: string,
    options?: {
      maxPaths?: number;
      simulationIterations?: number;
    }
  ): Promise<QuantumDecisionResult | null> {
    try {
      console.log('[QuantumDecision] Evaluating decision...');

      const { data, error } = await supabase.functions.invoke('quantum-decision-evaluate', {
        body: {
          decisionContext,
          rootDecisionId,
          maxPaths: options?.maxPaths || 5,
          simulationIterations: options?.simulationIterations || 1000,
        },
      });

      if (error) throw error;

      if (data.success) {
        return {
          treeId: data.treeId,
          totalPaths: data.totalPaths,
          optimalPath: data.optimalPath,
          allPaths: data.allPaths,
        };
      }

      return null;
    } catch (error) {
      console.error('[QuantumDecision] Evaluation error:', error);
      throw error;
    }
  }

  /**
   * Get decision tree details
   */
  async getDecisionTree(treeId: string) {
    try {
      const { data, error } = await supabase
        .from('decision_trees')
        .select('*')
        .eq('id', treeId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[QuantumDecision] Get tree error:', error);
      return null;
    }
  }

  /**
   * Get path evaluations for a decision tree
   */
  async getPathEvaluations(treeId: string) {
    try {
      const { data, error } = await supabase
        .from('path_evaluations')
        .select('*')
        .eq('decision_tree_id', treeId)
        .order('evaluation_score', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[QuantumDecision] Get evaluations error:', error);
      return [];
    }
  }

  /**
   * Get Monte Carlo simulations for a decision tree
   */
  async getSimulations(treeId: string) {
    try {
      const { data, error } = await supabase
        .from('monte_carlo_simulations')
        .select('*')
        .eq('decision_tree_id', treeId)
        .order('success_rate', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[QuantumDecision] Get simulations error:', error);
      return [];
    }
  }

  /**
   * Get recent decision trees
   */
  async getRecentTrees(limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('decision_trees')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[QuantumDecision] Get recent trees error:', error);
      return [];
    }
  }
}

export const quantumDecisionService = new QuantumDecisionService();
