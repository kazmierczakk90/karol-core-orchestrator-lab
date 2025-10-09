/**
 * Load Balancer Module - Wydzielony z orchestrationEngine
 * Zaawansowane algorytmy balansowania obciążenia
 */

import { AgentRegistration } from './AgentRegistry';

export type LoadBalancingAlgorithm = 'round_robin' | 'least_connections' | 'weighted' | 'random' | 'performance' | 'adaptive';

interface LoadBalancerConfig {
  algorithm: LoadBalancingAlgorithm;
  weights: Record<string, number>;
  connections: Record<string, number>;
  performanceThreshold: number;
  adaptiveEnabled: boolean;
}

export class LoadBalancer {
  private config: LoadBalancerConfig = {
    algorithm: 'adaptive',
    weights: {},
    connections: {},
    performanceThreshold: 70,
    adaptiveEnabled: true
  };
  
  private lastSelectedIndex = 0;
  private performanceHistory: Map<string, number[]> = new Map();

  constructor(algorithm: LoadBalancingAlgorithm = 'adaptive') {
    this.config.algorithm = algorithm;
  }

  // Główna metoda wyboru agenta
  selectAgent(candidates: AgentRegistration[], algorithm?: LoadBalancingAlgorithm): AgentRegistration | null {
    if (candidates.length === 0) return null;
    if (candidates.length === 1) return candidates[0];

    const selectedAlgorithm = algorithm || this.config.algorithm;

    // Adaptive algorithm - wybiera najlepszy algorytm na podstawie kontekstu
    if (selectedAlgorithm === 'adaptive') {
      return this.adaptiveSelect(candidates);
    }

    switch (selectedAlgorithm) {
      case 'round_robin':
        return this.roundRobinSelect(candidates);
      case 'least_connections':
        return this.leastConnectionsSelect(candidates);
      case 'weighted':
        return this.weightedSelect(candidates);
      case 'performance':
        return this.performanceBasedSelect(candidates);
      case 'random':
        return candidates[Math.floor(Math.random() * candidates.length)];
      default:
        return candidates[0];
    }
  }

  // Adaptive selection - inteligentny wybór algorytmu
  private adaptiveSelect(candidates: AgentRegistration[]): AgentRegistration {
    const avgLoad = this.calculateAverageLoad(candidates);
    const avgPerformance = this.calculateAveragePerformance(candidates);
    
    // High load → least connections
    if (avgLoad > 80) {
      return this.leastConnectionsSelect(candidates);
    }
    
    // Performance issues → performance based
    if (avgPerformance < this.config.performanceThreshold) {
      return this.performanceBasedSelect(candidates);
    }
    
    // Normal conditions → weighted with performance factor
    return this.intelligentWeightedSelect(candidates);
  }

  // Round Robin z pamiętaniem ostatniego indeksu
  private roundRobinSelect(candidates: AgentRegistration[]): AgentRegistration {
    this.lastSelectedIndex = (this.lastSelectedIndex + 1) % candidates.length;
    const selected = candidates[this.lastSelectedIndex];
    this.recordConnection(selected.id);
    return selected;
  }

  // Least Connections
  private leastConnectionsSelect(candidates: AgentRegistration[]): AgentRegistration {
    const selected = candidates.reduce((min, agent) => {
      const minConnections = this.config.connections[min.id] || 0;
      const agentConnections = this.config.connections[agent.id] || 0;
      return agentConnections < minConnections ? agent : min;
    });
    this.recordConnection(selected.id);
    return selected;
  }

  // Weighted Selection
  private weightedSelect(candidates: AgentRegistration[]): AgentRegistration {
    const weights = candidates.map(agent => this.config.weights[agent.id] || 1);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
    if (totalWeight === 0) return candidates[0];
    
    const random = Math.random() * totalWeight;
    let currentWeight = 0;
    
    for (let i = 0; i < candidates.length; i++) {
      currentWeight += weights[i];
      if (random <= currentWeight) {
        this.recordConnection(candidates[i].id);
        return candidates[i];
      }
    }
    
    return candidates[0];
  }

  // Performance-based Selection z historią
  private performanceBasedSelect(candidates: AgentRegistration[]): AgentRegistration {
    const selected = candidates.reduce((best, agent) => {
      const bestScore = this.calculatePerformanceScore(best);
      const agentScore = this.calculatePerformanceScore(agent);
      return agentScore > bestScore ? agent : best;
    });
    this.recordConnection(selected.id);
    this.updatePerformanceHistory(selected.id, selected.performance);
    return selected;
  }

  // Intelligent Weighted Selection - łączy wagi z wydajnością
  private intelligentWeightedSelect(candidates: AgentRegistration[]): AgentRegistration {
    const scores = candidates.map(agent => {
      const weight = this.config.weights[agent.id] || 1;
      const perfScore = this.calculatePerformanceScore(agent);
      const loadPenalty = agent.loadLevel / 100;
      return weight * perfScore * (1 - loadPenalty * 0.3);
    });

    const totalScore = scores.reduce((sum, s) => sum + s, 0);
    if (totalScore === 0) return candidates[0];

    const random = Math.random() * totalScore;
    let currentScore = 0;

    for (let i = 0; i < candidates.length; i++) {
      currentScore += scores[i];
      if (random <= currentScore) {
        this.recordConnection(candidates[i].id);
        return candidates[i];
      }
    }

    return candidates[0];
  }

  // Performance score z historią
  private calculatePerformanceScore(agent: AgentRegistration): number {
    const history = this.performanceHistory.get(agent.id) || [];
    if (history.length === 0) {
      return agent.performance / 100;
    }

    // Średnia ważona: 70% current, 30% history
    const historyAvg = history.reduce((sum, p) => sum + p, 0) / history.length;
    return (agent.performance * 0.7 + historyAvg * 0.3) / 100;
  }

  // Helpers
  private calculateAverageLoad(candidates: AgentRegistration[]): number {
    if (candidates.length === 0) return 0;
    return candidates.reduce((sum, a) => sum + a.loadLevel, 0) / candidates.length;
  }

  private calculateAveragePerformance(candidates: AgentRegistration[]): number {
    if (candidates.length === 0) return 0;
    return candidates.reduce((sum, a) => sum + a.performance, 0) / candidates.length;
  }

  private recordConnection(agentId: string): void {
    this.config.connections[agentId] = (this.config.connections[agentId] || 0) + 1;
  }

  private updatePerformanceHistory(agentId: string, performance: number): void {
    if (!this.performanceHistory.has(agentId)) {
      this.performanceHistory.set(agentId, []);
    }
    const history = this.performanceHistory.get(agentId)!;
    history.push(performance);
    
    // Zachowaj tylko ostatnie 10 pomiarów
    if (history.length > 10) {
      history.shift();
    }
  }

  // Public API
  releaseConnection(agentId: string): void {
    if (this.config.connections[agentId] > 0) {
      this.config.connections[agentId]--;
    }
  }

  setWeight(agentId: string, weight: number): void {
    this.config.weights[agentId] = Math.max(0, Math.min(10, weight));
  }

  getConnections(agentId: string): number {
    return this.config.connections[agentId] || 0;
  }

  getMetrics(): {
    totalConnections: number;
    avgConnectionsPerAgent: number;
    mostLoadedAgent: string | null;
  } {
    const connections = Object.values(this.config.connections);
    const totalConnections = connections.reduce((sum, c) => sum + c, 0);
    
    let mostLoadedAgent: string | null = null;
    let maxConnections = 0;
    
    Object.entries(this.config.connections).forEach(([id, count]) => {
      if (count > maxConnections) {
        maxConnections = count;
        mostLoadedAgent = id;
      }
    });

    return {
      totalConnections,
      avgConnectionsPerAgent: connections.length > 0 ? totalConnections / connections.length : 0,
      mostLoadedAgent
    };
  }

  // Cleanup
  cleanup(): void {
    this.config.connections = {};
    this.performanceHistory.clear();
    this.lastSelectedIndex = 0;
  }
}
