
import { FukoMessage, FukoAgent } from './types.ts';

export const checkDependencies = (dependencies: string, agent: FukoAgent): boolean => {
  if (!dependencies) return true;
  const requiredDeps = dependencies.split(',').map(dep => dep.trim());
  return requiredDeps.every(dep => 
    agent.capabilities.some(cap => cap.includes(dep))
  );
};

export const findBestAgent = (agents: FukoAgent[], message: FukoMessage): FukoAgent | null => {
  const availableAgents = agents
    .filter(agent => agent.status === 'active')
    .filter(agent => checkDependencies(message.Z, agent));
  
  if (availableAgents.length === 0) return null;
  
  // Score agents based on competency and capabilities match
  return availableAgents.reduce((best, current) => 
    current.competency_score > best.competency_score ? current : best
  );
};
