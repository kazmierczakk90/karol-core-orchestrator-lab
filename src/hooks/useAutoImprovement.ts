
import { useEffect } from 'react';
import { autoImprovementService } from '@/services/autoImprovementService';

export const useAutoImprovement = () => {
  useEffect(() => {
    // Inicjalizacja systemu Auto-Improvement
    console.log('🚀 Auto-Improvement System initialized');
    
    // Przykładowe śledzenie akcji użytkownika
    const trackUserActions = () => {
      // Tab changes
      const tabButtons = document.querySelectorAll('[role="tab"]');
      tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          autoImprovementService.trackEvent({
            eventType: 'action',
            context: `Tab switch: ${target.textContent}`,
            details: {
              success: true,
              tabName: target.textContent,
              timestamp: new Date()
            }
          });
        });
      });

      // Button clicks
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        button.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          if (target.textContent && !target.closest('[role="tab"]')) {
            autoImprovementService.trackEvent({
              eventType: 'action',
              context: `Button click: ${target.textContent}`,
              details: {
                success: true,
                buttonText: target.textContent,
                timestamp: new Date()
              }
            });
          }
        });
      });
    };

    // Opóźnienie dla zapewnienia że DOM jest gotowy
    setTimeout(trackUserActions, 1000);
    
    // Symulacja działania systemu - dodanie przykładowych zdarzeń
    const simulateSystemActivity = () => {
      // Agent activities
      autoImprovementService.trackEvent({
        eventType: 'decision',
        context: 'Agent @ceo: Strategic decision analysis',
        details: {
          success: true,
          decision: 'Approve new workflow optimization',
          impact: 'high'
        },
        agentId: '@ceo'
      });

      autoImprovementService.trackEvent({
        eventType: 'command',
        context: '/agent0_analyze execution',
        details: {
          success: true,
          duration: 1200,
          results: ['Performance metrics updated', 'Optimization suggestions generated']
        },
        agentId: '@agent0'
      });

      autoImprovementService.trackEvent({
        eventType: 'chat',
        context: 'User interaction with Commander',
        details: {
          success: true,
          message: 'Test agent simulation completed',
          duration: 800
        }
      });
    };

    // Uruchomienie symulacji po 3 sekundach
    setTimeout(simulateSystemActivity, 3000);

    // Cleanup funkcja
    return () => {
      console.log('🔄 Auto-Improvement System cleanup');
    };
  }, []);

  return {
    trackEvent: autoImprovementService.trackEvent.bind(autoImprovementService),
    getMetrics: autoImprovementService.getMetrics.bind(autoImprovementService),
    getSuggestions: autoImprovementService.getSuggestions.bind(autoImprovementService)
  };
};
