
import { FukoMessage, FukoAgent } from './types.ts';

export const checkDependencies = (dependencies: string, agent: FukoAgent): boolean => {
  if (!dependencies) return true;
  const requiredDeps = dependencies.split(',').map(dep => dep.trim());
  return requiredDeps.every(dep => 
    agent.capabilities.some(cap => cap.includes(dep))
  );
};

export const findBestAgent = async (
  agents: FukoAgent[], 
  message: FukoMessage,
  supabase: any
): Promise<FukoAgent | null> => {
  const availableAgents = agents
    .filter(agent => agent.status === 'active')
    .filter(agent => checkDependencies(message.Z, agent));
  
  if (availableAgents.length === 0) return null;
  
  // Try to use intelligent routing if category and segment are available
  if (message.metadata?.category && message.metadata?.segment) {
    try {
      const { data: routingConditions } = await supabase
        .from('routing_conditions')
        .select('*')
        .eq('is_active', true)
        .eq('category', message.metadata.category)
        .eq('segment', message.metadata.segment)
        .order('priority', { ascending: false })
        .limit(1);
      
      if (routingConditions && routingConditions.length > 0) {
        const preferredAgentNames = routingConditions[0].agents;
        const preferredAgent = availableAgents.find(agent => 
          preferredAgentNames.includes(agent.name)
        );
        
        if (preferredAgent) {
          console.log(`Using intelligent routing: ${preferredAgent.name} for ${message.metadata.category}/${message.metadata.segment}`);
          return preferredAgent;
        }
      }
    } catch (error) {
      console.error('Error in intelligent routing, falling back to default:', error);
    }
  }
  
  // Fallback: Score agents based on competency and capabilities match
  return availableAgents.reduce((best, current) => 
    current.competency_score > best.competency_score ? current : best
  );
};
