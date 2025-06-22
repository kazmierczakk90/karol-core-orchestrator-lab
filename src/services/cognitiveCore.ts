
import { MemoryEntry, BeliefSystem, EvidenceEntry, NarrativeArc, QuantumState } from '@/types/platformCore';

class CognitiveCore {
  private memories: Map<string, MemoryEntry> = new Map();
  private beliefs: Map<string, BeliefSystem> = new Map();
  private narratives: Map<string, NarrativeArc> = new Map();
  private associationGraph: Map<string, string[]> = new Map();

  // POZIOM 1.1: Pamięć Poznawcza - 10 kroków
  
  // Krok 1: Wielowarstwowa architektura pamięci
  createMemoryEntry(content: string, context: string, agentId: string, importance: 1 | 2 | 3 | 4 | 5): MemoryEntry {
    const memory: MemoryEntry = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      agentId,
      content,
      context,
      importance,
      memoryType: this.classifyMemoryType(content, context),
      triggerRules: this.generateTriggerRules(content, context),
      timestamp: new Date(),
      associatedMemories: this.findAssociatedMemories(content),
      emotionalWeight: this.calculateEmotionalWeight(content),
      compressionLevel: 0
    };

    this.memories.set(memory.id, memory);
    this.updateAssociationGraph(memory);
    return memory;
  }

  // Krok 2: System tagowania i kategoryzacji
  private classifyMemoryType(content: string, context: string): MemoryEntry['memoryType'] {
    if (context.includes('action') || context.includes('procedure')) return 'procedural';
    if (context.includes('emotion') || content.match(/feel|emotion|mood/i)) return 'emotional';
    if (context.includes('fact') || content.match(/definition|concept/i)) return 'semantic';
    if (context.includes('event') || content.match(/when|where|what happened/i)) return 'episodic';
    if (context.includes('session')) return 'session';
    return 'permanent';
  }

  // Krok 3: Algorytm zapominania z krzywą Ebbinghausa
  applyForgettingCurve(): void {
    const now = new Date();
    this.memories.forEach((memory, id) => {
      const ageInDays = (now.getTime() - memory.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      const retentionRate = Math.exp(-ageInDays / (memory.importance * 7)); // Importance affects retention
      
      if (retentionRate < 0.1 && memory.memoryType === 'session') {
        this.memories.delete(id);
      } else if (retentionRate < 0.3) {
        memory.compressionLevel = (memory.compressionLevel || 0) + 1;
        if (memory.compressionLevel && memory.compressionLevel > 5) {
          memory.content = this.compressMemory(memory.content);
        }
      }
    });
  }

  // Krok 4: Pamięć asocjacyjna z grafem połączeń
  private updateAssociationGraph(memory: MemoryEntry): void {
    const keywords = this.extractKeywords(memory.content);
    keywords.forEach(keyword => {
      if (!this.associationGraph.has(keyword)) {
        this.associationGraph.set(keyword, []);
      }
      this.associationGraph.get(keyword)?.push(memory.id);
    });
  }

  private findAssociatedMemories(content: string): string[] {
    const keywords = this.extractKeywords(content);
    const associated = new Set<string>();
    
    keywords.forEach(keyword => {
      const relatedIds = this.associationGraph.get(keyword) || [];
      relatedIds.forEach(id => associated.add(id));
    });
    
    return Array.from(associated).slice(0, 10); // Limit associations
  }

  // Krok 5: Kompresja i archiwizacja
  private compressMemory(content: string): string {
    // Simplified compression - extract key concepts
    const sentences = content.split('.');
    const important = sentences.filter(s => s.match(/important|key|critical|essential/i));
    return important.length > 0 ? important.join('. ') : sentences.slice(0, 2).join('. ');
  }

  // Krok 6: Pamięć episodyczna vs semantyczna
  retrieveEpisodicMemories(agentId: string, timeframe?: { start: Date; end: Date }): MemoryEntry[] {
    return Array.from(this.memories.values()).filter(memory => 
      memory.agentId === agentId && 
      memory.memoryType === 'episodic' &&
      (!timeframe || (memory.timestamp >= timeframe.start && memory.timestamp <= timeframe.end))
    );
  }

  retrieveSemanticMemories(agentId: string, concept: string): MemoryEntry[] {
    return Array.from(this.memories.values()).filter(memory =>
      memory.agentId === agentId &&
      memory.memoryType === 'semantic' &&
      memory.content.toLowerCase().includes(concept.toLowerCase())
    );
  }

  // Krok 7: Retrieval Augmented Generation (RAG)
  ragQuery(query: string, agentId: string, topK: number = 5): MemoryEntry[] {
    const queryKeywords = this.extractKeywords(query);
    const scored = Array.from(this.memories.values())
      .filter(memory => memory.agentId === agentId)
      .map(memory => ({
        memory,
        score: this.calculateRelevanceScore(memory, queryKeywords)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return scored.map(item => item.memory);
  }

  // Krok 8: Pamięć emocjonalna z wagami afektywnymi
  private calculateEmotionalWeight(content: string): number {
    const emotionalWords = ['love', 'hate', 'fear', 'joy', 'anger', 'sadness', 'surprise', 'disgust'];
    let weight = 0;
    emotionalWords.forEach(word => {
      if (content.toLowerCase().includes(word)) weight += 1;
    });
    return Math.min(weight / emotionalWords.length, 1);
  }

  // Krok 9: Cross-agent memory sharing
  shareMemory(memoryId: string, fromAgentId: string, toAgentId: string): MemoryEntry | null {
    const memory = this.memories.get(memoryId);
    if (!memory || memory.agentId !== fromAgentId) return null;

    const sharedMemory: MemoryEntry = {
      ...memory,
      id: `shared_${memory.id}_${toAgentId}`,
      agentId: toAgentId,
      context: `shared_from_${fromAgentId}: ${memory.context}`,
      importance: Math.max(1, memory.importance - 1) as 1 | 2 | 3 | 4 | 5
    };

    this.memories.set(sharedMemory.id, sharedMemory);
    return sharedMemory;
  }

  // Krok 10: Quantum memory states dla superpozycji
  createQuantumMemory<T>(states: Array<{ state: T; probability: number }>): QuantumState<T> {
    // Normalize probabilities
    const total = states.reduce((sum, s) => sum + s.probability, 0);
    const normalized = states.map(s => ({
      state: s.state,
      probability: s.probability / total,
      coherence: Math.random() * 0.3 + 0.7 // High coherence initially
    }));

    return {
      superposition: normalized,
      collapsed: false,
      entangled: []
    };
  }

  // POZIOM 1.2: System Przekonań - 10 kroków

  // Krok 1: Bayesian belief networks
  createBelief(belief: string, initialConfidence: number, evidence: EvidenceEntry[]): BeliefSystem {
    const beliefSystem: BeliefSystem = {
      id: `belief_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      belief,
      confidence: this.calculateBayesianConfidence(initialConfidence, evidence),
      evidence,
      lastUpdated: new Date(),
      source: 'experience',
      temporalDecay: 0.01
    };

    this.beliefs.set(beliefSystem.id, beliefSystem);
    return beliefSystem;
  }

  // Krok 2: Confidence scoring
  private calculateBayesianConfidence(prior: number, evidence: EvidenceEntry[]): number {
    let posterior = prior;
    evidence.forEach(e => {
      // Simplified Bayesian update
      const likelihood = e.strength;
      posterior = (likelihood * posterior) / ((likelihood * posterior) + ((1 - likelihood) * (1 - posterior)));
    });
    return Math.max(0.01, Math.min(0.99, posterior));
  }

  // Krok 3: Conflict resolution
  detectBeliefConflicts(): Array<{ belief1: string; belief2: string; conflictStrength: number }> {
    const conflicts: Array<{ belief1: string; belief2: string; conflictStrength: number }> = [];
    const beliefArray = Array.from(this.beliefs.values());
    
    for (let i = 0; i < beliefArray.length; i++) {
      for (let j = i + 1; j < beliefArray.length; j++) {
        const conflict = this.calculateConflictStrength(beliefArray[i], beliefArray[j]);
        if (conflict > 0.5) {
          conflicts.push({
            belief1: beliefArray[i].id,
            belief2: beliefArray[j].id,
            conflictStrength: conflict
          });
        }
      }
    }
    
    return conflicts;
  }

  // Helper methods
  private extractKeywords(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 10);
  }

  private generateTriggerRules(content: string, context: string): string[] {
    const rules = [];
    if (context.includes('action')) rules.push('on_action_needed');
    if (content.includes('important')) rules.push('high_priority');
    if (context.includes('emotion')) rules.push('emotional_trigger');
    return rules;
  }

  private calculateRelevanceScore(memory: MemoryEntry, queryKeywords: string[]): number {
    const memoryKeywords = this.extractKeywords(memory.content);
    const intersection = queryKeywords.filter(k => memoryKeywords.includes(k));
    const union = [...new Set([...queryKeywords, ...memoryKeywords])];
    
    const jaccardSimilarity = intersection.length / union.length;
    const importanceBoost = memory.importance / 5;
    const recencyBoost = Math.exp(-(Date.now() - memory.timestamp.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    return jaccardSimilarity * 0.6 + importanceBoost * 0.3 + recencyBoost * 0.1;
  }

  private calculateConflictStrength(belief1: BeliefSystem, belief2: BeliefSystem): number {
    // Simplified conflict detection based on semantic similarity and opposing confidence
    const similarity = this.semanticSimilarity(belief1.belief, belief2.belief);
    const confidenceDiff = Math.abs(belief1.confidence - belief2.confidence);
    
    return similarity > 0.7 && confidenceDiff > 0.3 ? similarity * confidenceDiff : 0;
  }

  private semanticSimilarity(text1: string, text2: string): number {
    const words1 = this.extractKeywords(text1);
    const words2 = this.extractKeywords(text2);
    const intersection = words1.filter(w => words2.includes(w));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }

  // Public API methods
  getMemories(agentId: string): MemoryEntry[] {
    return Array.from(this.memories.values()).filter(m => m.agentId === agentId);
  }

  getBeliefs(agentId?: string): BeliefSystem[] {
    return Array.from(this.beliefs.values());
  }

  updateBelief(beliefId: string, newEvidence: EvidenceEntry): boolean {
    const belief = this.beliefs.get(beliefId);
    if (!belief) return false;

    belief.evidence.push(newEvidence);
    belief.confidence = this.calculateBayesianConfidence(belief.confidence, [newEvidence]);
    belief.lastUpdated = new Date();
    
    return true;
  }
}

export const cognitiveCore = new CognitiveCore();
