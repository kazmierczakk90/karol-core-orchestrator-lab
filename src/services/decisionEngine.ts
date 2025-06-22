
import { DecisionCriteria, Alternative, RiskProfile, TimeProfile, QuantumState } from '@/types/platformCore';

class AdvancedDecisionEngine {
  private criteria: Map<string, DecisionCriteria> = new Map();
  private decisions: Map<string, any> = new Map();

  // POZIOM 2.1: Multi-Criteria Decision Making - 10 kroków

  // Krok 1: TOPSIS Implementation
  topsisDecision(alternatives: Alternative[], criteria: DecisionCriteria[]): Alternative {
    const normalizedMatrix = this.normalizeMatrix(alternatives, criteria);
    const weightedMatrix = this.applyWeights(normalizedMatrix, criteria);
    const idealSolution = this.findIdealSolution(weightedMatrix, criteria);
    const negativeIdealSolution = this.findNegativeIdealSolution(weightedMatrix, criteria);
    
    const scores = alternatives.map((alt, index) => ({
      alternative: alt,
      score: this.calculateTopsisScore(weightedMatrix[index], idealSolution, negativeIdealSolution)
    }));

    return scores.sort((a, b) => b.score - a.score)[0].alternative;
  }

  // Krok 2: AHP (Analytic Hierarchy Process)
  ahpDecision(alternatives: Alternative[], criteria: DecisionCriteria[], pairwiseComparisons: number[][]): Alternative {
    const weights = this.calculateAHPWeights(pairwiseComparisons);
    const scores = alternatives.map(alt => {
      let totalScore = 0;
      criteria.forEach((criterion, index) => {
        const score = alt.scores[criterion.id] || 0;
        totalScore += score * weights[index];
      });
      return { alternative: alt, score: totalScore };
    });

    return scores.sort((a, b) => b.score - a.score)[0].alternative;
  }

  // Krok 3: ELECTRE Method
  electreDecision(alternatives: Alternative[], criteria: DecisionCriteria[], 
                  concordanceThreshold: number = 0.7, discordanceThreshold: number = 0.3): Alternative[] {
    const concordanceMatrix = this.calculateConcordanceMatrix(alternatives, criteria);
    const discordanceMatrix = this.calculateDiscordanceMatrix(alternatives, criteria);
    
    const dominanceMatrix = this.calculateDominanceMatrix(
      concordanceMatrix, discordanceMatrix, concordanceThreshold, discordanceThreshold
    );
    
    return this.findNonDominatedAlternatives(alternatives, dominanceMatrix);
  }

  // Krok 4: Fuzzy Logic Decisions
  fuzzyDecision(alternatives: Alternative[], criteria: DecisionCriteria[]): Alternative {
    const fuzzyScores = alternatives.map(alt => {
      let totalScore = 0;
      criteria.forEach(criterion => {
        const score = alt.scores[criterion.id] || 0;
        const fuzzyScore = this.fuzzifyScore(score);
        totalScore += fuzzyScore * criterion.weight;
      });
      return { alternative: alt, score: this.defuzzify(totalScore) };
    });

    return fuzzyScores.sort((a, b) => b.score - a.score)[0].alternative;
  }

  // Krok 5: Multi-objective Optimization
  paretoOptimalSolutions(alternatives: Alternative[], criteria: DecisionCriteria[]): Alternative[] {
    const pareto: Alternative[] = [];
    
    alternatives.forEach(candidate => {
      let isDominated = false;
      
      alternatives.forEach(other => {
        if (candidate.id === other.id) return;
        
        let dominates = true;
        let strictlyBetter = false;
        
        criteria.forEach(criterion => {
          const candidateScore = candidate.scores[criterion.id] || 0;
          const otherScore = other.scores[criterion.id] || 0;
          
          if (criterion.type === 'benefit') {
            if (candidateScore < otherScore) dominates = false;
            if (candidateScore > otherScore) strictlyBetter = true;
          } else {
            if (candidateScore > otherScore) dominates = false;
            if (candidateScore < otherScore) strictlyBetter = true;
          }
        });
        
        if (dominates && strictlyBetter) {
          isDominated = true;
        }
      });
      
      if (!isDominated) {
        pareto.push(candidate);
      }
    });
    
    return pareto;
  }

  // Krok 6: Risk-adjusted Decision Matrices
  riskAdjustedDecision(alternatives: Alternative[], riskTolerance: number): Alternative {
    const adjustedScores = alternatives.map(alt => {
      const baseScore = Object.values(alt.scores).reduce((sum, score) => sum + score, 0);
      const riskAdjustment = this.calculateRiskAdjustment(alt.riskProfile, riskTolerance);
      
      return {
        alternative: alt,
        score: baseScore * (1 - riskAdjustment)
      };
    });

    return adjustedScores.sort((a, b) => b.score - a.score)[0].alternative;
  }

  // Krok 7: Temporal Decision Windows
  temporalDecision(alternatives: Alternative[], urgency: number, currentTime: Date): Alternative {
    const timeAdjustedScores = alternatives.map(alt => {
      const baseScore = Object.values(alt.scores).reduce((sum, score) => sum + score, 0);
      const timeAdjustment = this.calculateTimeAdjustment(alt.timeProfile, urgency, currentTime);
      
      return {
        alternative: alt,
        score: baseScore * timeAdjustment
      };
    });

    return timeAdjustedScores.sort((a, b) => b.score - a.score)[0].alternative;
  }

  // Krok 8: Stakeholder Impact Analysis
  stakeholderWeightedDecision(alternatives: Alternative[], stakeholderWeights: Record<string, number>): Alternative {
    const stakeholderScores = alternatives.map(alt => {
      let weightedScore = 0;
      Object.entries(stakeholderWeights).forEach(([stakeholder, weight]) => {
        const stakeholderScore = alt.scores[`stakeholder_${stakeholder}`] || 0;
        weightedScore += stakeholderScore * weight;
      });
      
      return {
        alternative: alt,
        score: weightedScore
      };
    });

    return stakeholderScores.sort((a, b) => b.score - a.score)[0].alternative;
  }

  // Krok 9: Decision Trees with Uncertainty
  decisionTreeAnalysis(alternatives: Alternative[], scenarios: Array<{ probability: number; outcomes: Record<string, number> }>): Alternative {
    const expectedValues = alternatives.map(alt => {
      let expectedValue = 0;
      scenarios.forEach(scenario => {
        const outcomeValue = scenario.outcomes[alt.id] || 0;
        expectedValue += scenario.probability * outcomeValue;
      });
      
      return {
        alternative: alt,
        expectedValue
      };
    });

    return expectedValues.sort((a, b) => b.expectedValue - a.expectedValue)[0].alternative;
  }

  // Krok 10: Quantum Decision Superposition
  quantumDecision(alternatives: Alternative[]): QuantumState<Alternative> {
    const superposition = alternatives.map(alt => {
      const score = Object.values(alt.scores).reduce((sum, s) => sum + s, 0);
      return {
        state: alt,
        probability: score / alternatives.length,
        coherence: Math.random() * 0.3 + 0.7
      };
    });

    // Normalize probabilities
    const total = superposition.reduce((sum, s) => sum + s.probability, 0);
    superposition.forEach(s => s.probability /= total);

    return {
      superposition,
      collapsed: false,
      entangled: []
    };
  }

  // POZIOM 2.2: Intent Recognition & Routing - 10 kroków

  // Krok 1: NLP Intent Classification
  classifyIntent(text: string, possibleIntents: string[]): { intent: string; confidence: number } {
    const features = this.extractNLPFeatures(text);
    const scores = possibleIntents.map(intent => ({
      intent,
      confidence: this.calculateIntentScore(features, intent)
    }));

    return scores.sort((a, b) => b.confidence - a.confidence)[0];
  }

  // Krok 2: Context-aware Intent Disambiguation
  disambiguateIntent(text: string, context: Record<string, any>, history: string[]): string {
    const baseIntent = this.classifyIntent(text, Object.keys(context)).intent;
    const contextualScore = this.calculateContextualRelevance(baseIntent, context);
    const historicalScore = this.calculateHistoricalRelevance(baseIntent, history);
    
    const finalScore = 0.5 * contextualScore + 0.3 * historicalScore + 0.2;
    
    return finalScore > 0.6 ? baseIntent : 'ambiguous';
  }

  // Helper methods for decision algorithms
  private normalizeMatrix(alternatives: Alternative[], criteria: DecisionCriteria[]): number[][] {
    const matrix: number[][] = [];
    
    alternatives.forEach((alt, i) => {
      matrix[i] = [];
      criteria.forEach((criterion, j) => {
        const score = alt.scores[criterion.id] || 0;
        matrix[i][j] = score;
      });
    });

    // Vector normalization
    for (let j = 0; j < criteria.length; j++) {
      const sum = Math.sqrt(matrix.reduce((acc, row) => acc + row[j] * row[j], 0));
      if (sum > 0) {
        matrix.forEach(row => row[j] /= sum);
      }
    }

    return matrix;
  }

  private applyWeights(matrix: number[][], criteria: DecisionCriteria[]): number[][] {
    return matrix.map(row => 
      row.map((value, j) => value * criteria[j].weight)
    );
  }

  private findIdealSolution(matrix: number[][], criteria: DecisionCriteria[]): number[] {
    return criteria.map((criterion, j) => {
      const column = matrix.map(row => row[j]);
      return criterion.type === 'benefit' ? Math.max(...column) : Math.min(...column);
    });
  }

  private findNegativeIdealSolution(matrix: number[][], criteria: DecisionCriteria[]): number[] {
    return criteria.map((criterion, j) => {
      const column = matrix.map(row => row[j]);
      return criterion.type === 'benefit' ? Math.min(...column) : Math.max(...column);
    });
  }

  private calculateTopsisScore(alternative: number[], ideal: number[], negativeIdeal: number[]): number {
    const distanceToIdeal = Math.sqrt(alternative.reduce((sum, val, i) => sum + Math.pow(val - ideal[i], 2), 0));
    const distanceToNegative = Math.sqrt(alternative.reduce((sum, val, i) => sum + Math.pow(val - negativeIdeal[i], 2), 0));
    
    return distanceToNegative / (distanceToIdeal + distanceToNegative);
  }

  private calculateAHPWeights(pairwiseMatrix: number[][]): number[] {
    const n = pairwiseMatrix.length;
    const weights = new Array(n).fill(0);
    
    // Simplified eigenvector calculation
    for (let i = 0; i < n; i++) {
      weights[i] = pairwiseMatrix[i].reduce((sum, val) => sum + val, 0) / n;
    }
    
    const sum = weights.reduce((acc, w) => acc + w, 0);
    return weights.map(w => w / sum);
  }

  private calculateConcordanceMatrix(alternatives: Alternative[], criteria: DecisionCriteria[]): number[][] {
    const n = alternatives.length;
    const matrix = Array(n).fill(null).map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          let concordanceValue = 0;
          criteria.forEach(criterion => {
            const scoreI = alternatives[i].scores[criterion.id] || 0;
            const scoreJ = alternatives[j].scores[criterion.id] || 0;
            
            if ((criterion.type === 'benefit' && scoreI >= scoreJ) ||
                (criterion.type === 'cost' && scoreI <= scoreJ)) {
              concordanceValue += criterion.weight;
            }
          });
          matrix[i][j] = concordanceValue;
        }
      }
    }
    
    return matrix;
  }

  private calculateDiscordanceMatrix(alternatives: Alternative[], criteria: DecisionCriteria[]): number[][] {
    const n = alternatives.length;
    const matrix = Array(n).fill(null).map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          let maxDiscordance = 0;
          criteria.forEach(criterion => {
            const scoreI = alternatives[i].scores[criterion.id] || 0;
            const scoreJ = alternatives[j].scores[criterion.id] || 0;
            
            let discordance = 0;
            if (criterion.type === 'benefit' && scoreI < scoreJ) {
              discordance = Math.abs(scoreI - scoreJ);
            } else if (criterion.type === 'cost' && scoreI > scoreJ) {
              discordance = Math.abs(scoreI - scoreJ);
            }
            
            maxDiscordance = Math.max(maxDiscordance, discordance);
          });
          matrix[i][j] = maxDiscordance;
        }
      }
    }
    
    return matrix;
  }

  private calculateDominanceMatrix(concordance: number[][], discordance: number[][], 
                                 concordanceThreshold: number, discordanceThreshold: number): boolean[][] {
    const n = concordance.length;
    const matrix = Array(n).fill(null).map(() => Array(n).fill(false));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          matrix[i][j] = concordance[i][j] >= concordanceThreshold && 
                        discordance[i][j] <= discordanceThreshold;
        }
      }
    }
    
    return matrix;
  }

  private findNonDominatedAlternatives(alternatives: Alternative[], dominanceMatrix: boolean[][]): Alternative[] {
    const nonDominated: Alternative[] = [];
    
    alternatives.forEach((alt, i) => {
      let isDominated = false;
      for (let j = 0; j < alternatives.length; j++) {
        if (i !== j && dominanceMatrix[j][i]) {
          isDominated = true;
          break;
        }
      }
      if (!isDominated) {
        nonDominated.push(alt);
      }
    });
    
    return nonDominated;
  }

  private fuzzifyScore(score: number): number {
    // Triangular fuzzy membership function
    if (score < 0.3) return score / 0.3;
    if (score > 0.7) return (1 - score) / 0.3;
    return 1;
  }

  private defuzzify(fuzzyScore: number): number {
    // Centroid defuzzification
    return fuzzyScore * 0.5 + 0.25;
  }

  private calculateRiskAdjustment(riskProfile: RiskProfile, tolerance: number): number {
    const riskScore = riskProfile.probability * riskProfile.impact;
    return Math.max(0, (riskScore - tolerance) / (1 - tolerance));
  }

  private calculateTimeAdjustment(timeProfile: TimeProfile, urgency: number, currentTime: Date): number {
    const timeToDeadline = timeProfile.deadline ? 
      (timeProfile.deadline.getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24) : Infinity;
    
    const urgencyFactor = urgency / 10;
    const timeFactor = timeToDeadline < 7 ? 1.5 : 1;
    
    return Math.min(2, urgencyFactor * timeFactor);
  }

  private extractNLPFeatures(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2);
  }

  private calculateIntentScore(features: string[], intent: string): number {
    const intentKeywords = intent.toLowerCase().split('_');
    const matches = features.filter(feature => intentKeywords.includes(feature));
    return matches.length / Math.max(features.length, intentKeywords.length);
  }

  private calculateContextualRelevance(intent: string, context: Record<string, any>): number {
    let relevance = 0.5;
    Object.entries(context).forEach(([key, value]) => {
      if (intent.includes(key)) relevance += 0.1;
      if (typeof value === 'string' && value.includes(intent)) relevance += 0.1;
    });
    return Math.min(1, relevance);
  }

  private calculateHistoricalRelevance(intent: string, history: string[]): number {
    const recentIntents = history.slice(-10);
    const frequency = recentIntents.filter(h => h === intent).length;
    return frequency / 10;
  }
}

export const decisionEngine = new AdvancedDecisionEngine();
