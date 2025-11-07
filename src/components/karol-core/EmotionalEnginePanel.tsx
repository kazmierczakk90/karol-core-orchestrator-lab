import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, Brain, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EmotionalState {
  id: string;
  agent_id: string;
  confidence: number;
  creativity: number;
  focus: number;
  empathy: number;
  curiosity: number;
  energy_level: number;
  stress_level: number;
  updated_at: string;
}

export function EmotionalEnginePanel() {
  const [states, setStates] = useState<EmotionalState[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadStates = async () => {
    try {
      const { data, error } = await supabase
        .from('emotional_states')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      setStates(data || []);
    } catch (error) {
      console.error('Failed to load emotional states:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStates();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadStates();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (states.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Brak danych o stanach emocjonalnych
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto">
      {states.map((state) => {
        const emotionalMetrics = [
          { name: 'Confidence', value: state.confidence, icon: Brain },
          { name: 'Creativity', value: state.creativity, icon: Heart },
          { name: 'Focus', value: state.focus, icon: Brain },
          { name: 'Empathy', value: state.empathy, icon: Heart },
          { name: 'Curiosity', value: state.curiosity, icon: Brain },
          { name: 'Energy', value: state.energy_level, icon: Heart },
        ];

        return (
          <Card key={state.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{state.agent_id}</h3>
                <span className="text-xs text-muted-foreground">
                  {new Date(state.updated_at).toLocaleTimeString('pl-PL')}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {emotionalMetrics.map((metric) => (
                  <div key={metric.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1">
                        <metric.icon className="h-3 w-3" />
                        {metric.name}
                      </span>
                      <span className="font-medium">{metric.value.toFixed(0)}%</span>
                    </div>
                    <Progress value={metric.value} className="h-1" />
                  </div>
                ))}
              </div>

              <div className="text-xs text-muted-foreground">
                Stress: {state.stress_level.toFixed(1)}%
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
