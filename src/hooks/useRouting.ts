import { useState } from 'react';
import { supabase } from '@/integrations/supabase/db';
import { toast } from 'sonner';

interface RoutingCondition {
  id?: string;
  category: string;
  segment: string;
  agents: string[];
  reasoning: string;
  is_active?: boolean;
  priority?: number;
  metadata?: Record<string, any>;
}

interface Agent {
  id: string;
  name: string;
  category: string;
  mode: string;
  capabilities: string[];
  status: string;
}

interface RoutingResult {
  success: boolean;
  condition?: RoutingCondition;
  agents?: Agent[];
  reasoning?: string;
  message?: string;
}

export const useRouting = () => {
  const [isLoading, setIsLoading] = useState(false);

  const findAgents = async (category: string, segment: string): Promise<RoutingResult> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('routing-engine', {
        body: {
          action: 'find_agents',
          category,
          segment
        }
      });

      if (error) throw error;

      return data as RoutingResult;
    } catch (error) {
      console.error('Error finding agents:', error);
      toast.error('Błąd podczas wyszukiwania agentów');
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const generateCombinations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('routing-engine', {
        body: {
          action: 'generate_combinations'
        }
      });

      if (error) throw error;

      toast.success(`Wygenerowano ${data.count} kombinacji routingu`);
      return data;
    } catch (error) {
      console.error('Error generating combinations:', error);
      toast.error('Błąd podczas generowania kombinacji');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addCondition = async (condition: RoutingCondition) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('routing-engine', {
        body: {
          action: 'add_condition',
          condition
        }
      });

      if (error) throw error;

      toast.success('Dodano nową regułę routingu');
      return data;
    } catch (error) {
      console.error('Error adding condition:', error);
      toast.error('Błąd podczas dodawania reguły');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getConditions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('routing-engine', {
        body: {
          action: 'get_conditions'
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error getting conditions:', error);
      toast.error('Błąd podczas pobierania reguł');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    findAgents,
    generateCombinations,
    addCondition,
    getConditions,
    isLoading
  };
};
