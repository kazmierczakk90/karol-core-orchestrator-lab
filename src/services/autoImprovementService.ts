
import { supabase } from '@/integrations/supabase/db';
import { loggingService } from './loggingService';
import { CreateImprovementEventSchema, validateDataSafe } from '@/lib/validation';
import { errorHandlingService } from './errorHandlingService';

export interface ImprovementEvent {
  id: string;
  timestamp: Date;
  eventType: 'decision' | 'action' | 'chat' | 'command' | 'result';
  context: string;
  details: any;
  userId?: string;
  agentId?: string;
}

export interface ImprovementSuggestion {
  id: string;
  eventId: string;
  timestamp: Date;
  category: 'efficiency' | 'quality' | 'style' | 'performance';
  description: string;
  impact: 'low' | 'medium' | 'high';
  implementation: string;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  approvedBy?: string;
}

export interface SystemMetrics {
  totalEvents: number;
  totalSuggestions: number;
  implementedSuggestions: number;
  averageEfficiency: number;
  qualityScore: number;
  agentPerformance: Record<string, number>;
  weeklyImprovement: number;
}

class AutoImprovementService {
  private events: ImprovementEvent[] = [];
  private suggestions: ImprovementSuggestion[] = [];

  // Agent simulators
  private optimizerAgent = {
    name: '@optymalizator',
    analyze: (event: ImprovementEvent) => {
      const suggestions: Partial<ImprovementSuggestion>[] = [];
      
      // Analiza skuteczności
      if (event.eventType === 'action' && event.details?.success === false) {
        suggestions.push({
          category: 'efficiency',
          description: `Optymalizacja akcji ${event.context} - zwiększenie skuteczności o 25%`,
          impact: 'medium',
          implementation: 'Dodanie walidacji przed wykonaniem akcji'
        });
      }

      // Analiza stylu FUKO
      if (event.eventType === 'chat' && !this.checkFUKOCompliance(event.details?.message)) {
        suggestions.push({
          category: 'style',
          description: 'Dostosowanie komunikacji do standardu FUKO',
          impact: 'low',
          implementation: 'Dodanie FUKO formatowania do odpowiedzi'
        });
      }

      // Analiza wydajności
      if (event.details?.duration > 5000) {
        suggestions.push({
          category: 'performance',
          description: `Optymalizacja wydajności operacji ${event.context}`,
          impact: 'high',
          implementation: 'Implementacja cache\'owania i lazy loading'
        });
      }

      return suggestions;
    }
  };

  private systemAdminAgent = {
    name: '@system-admin',
    implement: async (suggestion: ImprovementSuggestion) => {
      console.log(`🔧 @system-admin implementuje: ${suggestion.description}`);
      
      // Symulacja implementacji
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        changes: [
          'Zaktualizowano kanwy systemowe',
          'Zsynchronizowano CMD i MASTER',
          'Wprowadzono poprawki do relacji agentów'
        ]
      };
    }
  };

  private loggerAgent = {
    name: '@logger',
    log: async (event: ImprovementEvent) => {
      console.log(`📝 @logger rejestruje: ${event.eventType} - ${event.context}`);
      
      // Zapis do lokalnego storage (w produkcji byłaby to baza danych)
      const logs = JSON.parse(localStorage.getItem('karol-core-logs') || '[]');
      logs.push({
        timestamp: event.timestamp,
        type: event.eventType,
        context: event.context,
        details: event.details
      });
      localStorage.setItem('karol-core-logs', JSON.stringify(logs.slice(-1000))); // Ostatnie 1000 logów
    }
  };

  private ceoAgent = {
    name: '@ceo',
    approve: (suggestion: ImprovementSuggestion) => {
      // Logika zatwierdzania przez CEO
      const approvalScore = this.calculateApprovalScore(suggestion);
      
      if (approvalScore > 0.7) {
        return { approved: true, note: 'Zatwierdzone automatycznie - wysoki impact' };
      } else if (approvalScore > 0.4) {
        return { approved: true, note: 'Zatwierdzone warunkowo - wymaga monitoringu' };
      } else {
        return { approved: false, note: 'Odrzucone - niski priorytet' };
      }
    }
  };

  public async trackEvent(event: Omit<ImprovementEvent, 'id' | 'timestamp'>) {
    // Validate event data
    const eventData = {
      event_type: event.eventType,
      context: event.context,
      details: event.details,
      agent_id: event.agentId
    };

    const validation = validateDataSafe(CreateImprovementEventSchema, eventData);
    if (!validation.success) {
      console.error('Invalid improvement event data:', validation.error);
      return;
    }

    const fullEvent: ImprovementEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };

    this.events.push(fullEvent);

    // Store in database
    try {
      const { error } = await supabase
        .from('improvement_events')
        .insert([{
          event_type: event.eventType,
          context: event.context,
          details: event.details,
          agent_id: event.agentId,
          impact: this.calculateEventImpact(event)
        }]);

      if (error) {
        errorHandlingService.handleSupabaseError(error, 'Storing improvement event');
      }
    } catch (error) {
      errorHandlingService.handleError(error, 'Tracking improvement event');
    }

    // Log the event
    await loggingService.logSystemEvent(`Auto-Improvement: ${event.eventType}`, {
      context: event.context,
      agentId: event.agentId
    });

    // Automatyczna analiza i generowanie sugestii
    await this.analyzeAndSuggest(fullEvent);

    console.log(`🎯 Auto-Improvement: Zarejestrowano zdarzenie ${event.eventType}`);
  }

  private async analyzeAndSuggest(event: ImprovementEvent) {
    const suggestions = this.optimizerAgent.analyze(event);
    
    for (const suggestionData of suggestions) {
      const suggestion: ImprovementSuggestion = {
        id: crypto.randomUUID(),
        eventId: event.id,
        timestamp: new Date(),
        status: 'pending',
        ...suggestionData as ImprovementSuggestion
      };

      // Sprawdzenie zatwierdzenia przez CEO
      const approval = this.ceoAgent.approve(suggestion);
      
      if (approval.approved) {
        suggestion.status = 'approved';
        suggestion.approvedBy = '@ceo';
        
        // Automatyczna implementacja
        const implementation = await this.systemAdminAgent.implement(suggestion);
        if (implementation.success) {
          suggestion.status = 'implemented';
        }
      } else {
        suggestion.status = 'rejected';
      }

      this.suggestions.push(suggestion);
    }
  }

  public getMetrics(): SystemMetrics {
    const totalEvents = this.events.length;
    const totalSuggestions = this.suggestions.length;
    const implementedSuggestions = this.suggestions.filter(s => s.status === 'implemented').length;
    
    const recentEvents = this.events.filter(e => 
      e.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    return {
      totalEvents,
      totalSuggestions,
      implementedSuggestions,
      averageEfficiency: implementedSuggestions / Math.max(totalSuggestions, 1) * 100,
      qualityScore: this.calculateQualityScore(),
      agentPerformance: this.calculateAgentPerformance(),
      weeklyImprovement: recentEvents.length
    };
  }

  public getSuggestions(): ImprovementSuggestion[] {
    return this.suggestions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public getRecentEvents(limit: number = 50): ImprovementEvent[] {
    return this.events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  private checkFUKOCompliance(message?: string): boolean {
    if (!message) return false;
    
    const fukoPatterns = [
      /F\.U\.K\.O/,
      /@[a-zA-Z-]+/,
      /&[a-zA-Z_]+/,
      /\[[A-Z_]+\]/
    ];
    
    return fukoPatterns.some(pattern => pattern.test(message));
  }

  private calculateApprovalScore(suggestion: ImprovementSuggestion): number {
    let score = 0;
    
    switch (suggestion.impact) {
      case 'high': score += 0.6; break;
      case 'medium': score += 0.3; break;
      case 'low': score += 0.1; break;
    }
    
    switch (suggestion.category) {
      case 'performance': score += 0.3; break;
      case 'efficiency': score += 0.2; break;
      case 'quality': score += 0.15; break;
      case 'style': score += 0.05; break;
    }
    
    return score;
  }

  private calculateQualityScore(): number {
    const recentEvents = this.events.filter(e => 
      e.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    
    const successfulEvents = recentEvents.filter(e => 
      e.details?.success !== false
    );
    
    return (successfulEvents.length / Math.max(recentEvents.length, 1)) * 100;
  }

  private calculateAgentPerformance(): Record<string, number> {
    const agentEvents = this.events.filter(e => e.agentId);
    const performance: Record<string, number> = {};
    
    agentEvents.forEach(event => {
      if (event.agentId) {
        if (!performance[event.agentId]) {
          performance[event.agentId] = 0;
        }
        performance[event.agentId] += event.details?.success !== false ? 1 : 0;
      }
    });
    
    // Normalizacja do procentów
    Object.keys(performance).forEach(agent => {
      const totalEvents = agentEvents.filter(e => e.agentId === agent).length;
      performance[agent] = (performance[agent] / Math.max(totalEvents, 1)) * 100;
    });
    
    return performance;
  }

  private calculateEventImpact(event: Omit<ImprovementEvent, 'id' | 'timestamp'>): 'low' | 'medium' | 'high' {
    // Calculate impact based on event type and context
    if (event.eventType === 'decision' && event.agentId === '@ceo') return 'high';
    if (event.eventType === 'command' && event.details?.success === false) return 'medium';
    if (event.eventType === 'action' && event.details?.duration > 5000) return 'medium';
    return 'low';
  }

  public async getEventsFromDatabase(limit: number = 100): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('improvement_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        errorHandlingService.handleSupabaseError(error, 'Fetching improvement events');
        return [];
      }

      return data || [];
    } catch (error) {
      errorHandlingService.handleError(error, 'Getting improvement events');
      return [];
    }
  }
}

export const autoImprovementService = new AutoImprovementService();
