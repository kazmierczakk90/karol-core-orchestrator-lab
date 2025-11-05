import { useState, useCallback } from 'react';
import { quantumDecisionService, type QuantumDecisionResult } from '@/services/quantumDecisionService';
import { toast } from 'sonner';

export const useQuantumDecision = () => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentResult, setCurrentResult] = useState<QuantumDecisionResult | null>(null);
  const [recentTrees, setRecentTrees] = useState<any[]>([]);

  const evaluateDecision = useCallback(async (
    decisionContext: any,
    rootDecisionId?: string,
    options?: {
      maxPaths?: number;
      simulationIterations?: number;
    }
  ) => {
    setIsEvaluating(true);
    try {
      const result = await quantumDecisionService.evaluateDecision(
        decisionContext,
        rootDecisionId,
        options
      );

      if (result) {
        setCurrentResult(result);
        toast.success(`Evaluated ${result.totalPaths} decision paths. Optimal path found with ${result.optimalPath?.evaluationScore.toFixed(1)}% score.`);
        return result;
      } else {
        toast.error('Quantum decision evaluation failed');
        return null;
      }
    } catch (error) {
      console.error('Failed to evaluate decision:', error);
      toast.error('Failed to evaluate decision');
      return null;
    } finally {
      setIsEvaluating(false);
    }
  }, []);

  const loadRecentTrees = useCallback(async (limit: number = 10) => {
    try {
      const trees = await quantumDecisionService.getRecentTrees(limit);
      setRecentTrees(trees);
    } catch (error) {
      console.error('Failed to load recent trees:', error);
      toast.error('Failed to load decision history');
    }
  }, []);

  const getTreeDetails = useCallback(async (treeId: string) => {
    try {
      const [tree, evaluations, simulations] = await Promise.all([
        quantumDecisionService.getDecisionTree(treeId),
        quantumDecisionService.getPathEvaluations(treeId),
        quantumDecisionService.getSimulations(treeId),
      ]);

      return { tree, evaluations, simulations };
    } catch (error) {
      console.error('Failed to get tree details:', error);
      toast.error('Failed to load decision tree details');
      return null;
    }
  }, []);

  return {
    isEvaluating,
    currentResult,
    recentTrees,
    evaluateDecision,
    loadRecentTrees,
    getTreeDetails,
  };
};
