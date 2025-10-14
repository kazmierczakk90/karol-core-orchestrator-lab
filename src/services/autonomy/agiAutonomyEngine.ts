/**
 * AGI Autonomy Engine (agi_autonomy.lov)
 * Test modułów samoorganizacji i autonomicznych decyzji
 */

import { orchestrationEngineV2 } from '../orchestrationEngineV2';
import { coreSyncOrchestrator } from '../core/coreSyncOrchestrator';

export interface AutonomousDecision {
  id: string;
  timestamp: Date;
  trigger: string;
  decision: string;
  confidence: number;
  executedActions: string[];
  outcome: 'success' | 'failure' | 'pending';
  reasoning: string;
}

export interface AutonomyMetrics {
  totalDecisions: number;
  successfulDecisions: number;
  averageConfidence: number;
  autonomyLevel: number; // 0-100
  selfOrganizationScore: number;
  lastDecisionAt?: Date;
}

export interface AutonomyTest {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  result?: any;
}

class AGIAutonomyEngine {
  private decisions: AutonomousDecision[] = [];
  private tests: Map<string, AutonomyTest> = new Map();
  private isRunning: boolean = false;
  private autonomyInterval: NodeJS.Timeout | null = null;
  private listeners: Set<(metrics: AutonomyMetrics) => void> = new Set();

  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🧠 AGI Autonomy Engine started');
    
    // Run autonomy cycle every 10 seconds
    this.autonomyInterval = setInterval(() => this.autonomyCycle(), 10000);
    this.autonomyCycle(); // Immediate first cycle
    
    // Initialize standard tests
    this.initializeTests();
  }

  stop(): void {
    this.isRunning = false;
    if (this.autonomyInterval) {
      clearInterval(this.autonomyInterval);
      this.autonomyInterval = null;
    }
  }

  private initializeTests(): void {
    const standardTests: Omit<AutonomyTest, 'id'>[] = [
      {
        name: 'Self-Healing',
        description: 'Test zdolności do samonaprawy po awarii agenta',
        status: 'pending'
      },
      {
        name: 'Load Balancing',
        description: 'Test automatycznej dystrybucji obciążenia',
        status: 'pending'
      },
      {
        name: 'Priority Adaptation',
        description: 'Test adaptacji priorytetów w czasie rzeczywistym',
        status: 'pending'
      },
      {
        name: 'Resource Optimization',
        description: 'Test optymalizacji wykorzystania zasobów',
        status: 'pending'
      },
      {
        name: 'Conflict Resolution',
        description: 'Test rozwiązywania konfliktów między agentami',
        status: 'pending'
      }
    ];

    standardTests.forEach(test => {
      const id = `test_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      this.tests.set(id, { ...test, id });
    });
  }

  private async autonomyCycle(): Promise<void> {
    try {
      // 1. Analyze system state
      const systemState = this.analyzeSystemState();
      
      // 2. Make autonomous decisions
      if (systemState.needsAttention) {
        await this.makeAutonomousDecision(systemState);
      }

      // 3. Run pending tests
      await this.runPendingTests();

      // 4. Notify listeners
      this.notifyListeners();
    } catch (error) {
      console.error('❌ Autonomy cycle error:', error);
    }
  }

  private analyzeSystemState(): any {
    const orchestrationMetrics = orchestrationEngineV2.collectMetrics();
    const syncMetrics = coreSyncOrchestrator.getMetrics();

    return {
      needsAttention: 
        orchestrationMetrics.averageLoad > 80 ||
        orchestrationMetrics.averagePerformance < 50 ||
        syncMetrics.syncHealth !== 'healthy',
      orchestrationMetrics,
      syncMetrics
    };
  }

  private async makeAutonomousDecision(systemState: any): Promise<void> {
    const { orchestrationMetrics, syncMetrics } = systemState;
    let decision: string = '';
    let actions: string[] = [];
    let reasoning: string = '';
    let confidence: number = 0;

    // Decision logic
    if (orchestrationMetrics.averageLoad > 80) {
      decision = 'scale_up';
      actions = ['request_additional_agents', 'redistribute_load'];
      reasoning = 'High system load detected, scaling up to maintain performance';
      confidence = 0.85;

      // Execute: suggest scaling
      const scalingDecision = orchestrationEngineV2.evaluateScaling();
      if (scalingDecision.action === 'scale_up') {
        actions.push(`recommended_${scalingDecision.recommendedAgents}_agents`);
      }
    } else if (orchestrationMetrics.averagePerformance < 50) {
      decision = 'optimize_performance';
      actions = ['agent_health_check', 'failover_unhealthy_agents'];
      reasoning = 'Low average performance detected, initiating optimization';
      confidence = 0.75;

      // Execute: health check
      await orchestrationEngineV2.performHealthCheck();
    } else if (syncMetrics.syncHealth === 'degraded') {
      decision = 'rebalance_missions';
      actions = ['redistribute_missions', 'check_agent_capacity'];
      reasoning = 'Mission synchronization degraded, rebalancing workload';
      confidence = 0.80;
    }

    if (decision) {
      const autonomousDecision: AutonomousDecision = {
        id: `decision_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        timestamp: new Date(),
        trigger: 'system_analysis',
        decision,
        confidence,
        executedActions: actions,
        outcome: 'pending',
        reasoning
      };

      this.decisions.push(autonomousDecision);

      // Mark as success (simplified)
      setTimeout(() => {
        autonomousDecision.outcome = 'success';
        this.notifyListeners();
      }, 2000);

      orchestrationEngineV2.publishEvent('autonomous_decision', 'agi_autonomy', {
        decision: autonomousDecision.decision,
        confidence: autonomousDecision.confidence
      });
    }
  }

  private async runPendingTests(): Promise<void> {
    const pending = Array.from(this.tests.values()).filter(t => t.status === 'pending');
    
    if (pending.length > 0) {
      const test = pending[0];
      test.status = 'running';
      test.startedAt = new Date();

      // Simulate test execution
      setTimeout(() => {
        test.status = Math.random() > 0.2 ? 'passed' : 'failed';
        test.completedAt = new Date();
        test.result = {
          score: Math.random() * 100,
          details: `Test completed with ${test.status} status`
        };
        this.notifyListeners();
      }, 5000);
    }
  }

  // Public API
  getDecisions(limit: number = 50): AutonomousDecision[] {
    return this.decisions.slice(-limit);
  }

  getTests(): AutonomyTest[] {
    return Array.from(this.tests.values());
  }

  getMetrics(): AutonomyMetrics {
    const successful = this.decisions.filter(d => d.outcome === 'success').length;
    const total = this.decisions.length;
    const avgConfidence = total > 0
      ? this.decisions.reduce((sum, d) => sum + d.confidence, 0) / total
      : 0;

    const passedTests = Array.from(this.tests.values()).filter(t => t.status === 'passed').length;
    const totalTests = this.tests.size;
    const selfOrgScore = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

    // Autonomy level based on decisions and test results
    const autonomyLevel = Math.round((avgConfidence * 0.6 + selfOrgScore * 0.4));

    return {
      totalDecisions: total,
      successfulDecisions: successful,
      averageConfidence: Math.round(avgConfidence * 100) / 100,
      autonomyLevel,
      selfOrganizationScore: Math.round(selfOrgScore),
      lastDecisionAt: this.decisions[this.decisions.length - 1]?.timestamp
    };
  }

  onMetricsUpdate(callback: (metrics: AutonomyMetrics) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    const metrics = this.getMetrics();
    this.listeners.forEach(cb => cb(metrics));
  }

  cleanup(): void {
    this.stop();
    this.decisions = [];
    this.tests.clear();
    this.listeners.clear();
  }
}

export const agiAutonomyEngine = new AGIAutonomyEngine();
