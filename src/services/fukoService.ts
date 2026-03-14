import { supabase } from '@/integrations/supabase/db';
import type { FukoMessage } from '@/types/fuko';
import type { FukoAgent } from '@/types/agent';
import { v4 as uuidv4 } from 'uuid';

type FukoMessageInput = Omit<FukoMessage, 'id' | 'timestamp' | 'status' | 'execution_result'>;

class FukoService {
  async createFukoMessage(messageData: FukoMessageInput): Promise<FukoMessage | null> {
    const { data, error } = await supabase
      .from('fuko_messages')
      .insert({
        id: uuidv4(),
        ...messageData,
        status: 'pending',
        timestamp: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating FUKO message:', error);
      return null;
    }
    return data as FukoMessage;
  }
  
  async getAgents(): Promise<FukoAgent[]> {
    const { data, error } = await supabase.from('fuko_agents').select('*');
    if (error) {
      console.error('Error fetching agents:', error);
      return [];
    }
    return data as FukoAgent[];
  }

  async getMessages(): Promise<FukoMessage[]> {
    const { data, error } = await supabase.from('fuko_messages').select('*').order('timestamp', { ascending: false });
    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    return data as FukoMessage[];
  }

  async updateAgentStatusByName(agentName: string, status: FukoAgent['status']): Promise<boolean> {
    const { error } = await supabase
      .from('fuko_agents')
      .update({ status: status, last_update: new Date().toISOString() })
      .eq('name', agentName);
    
    if (error) {
      console.error(`Error updating agent ${agentName} status:`, error);
      return false;
    }
    return true;
  }
}

export const fukoService = new FukoService();
