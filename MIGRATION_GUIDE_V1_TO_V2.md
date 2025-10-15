# 🔄 Migration Guide: Orchestration Engine V1 → V2

## Overview

This guide helps migrate from the legacy `orchestrationEngine.ts` (V1) to the modular `orchestrationEngineV2.ts` (V2).

**Why migrate?**
- ✅ Modular architecture (AgentRegistry, LoadBalancer, FailoverManager)
- ✅ Better separation of concerns
- ✅ Enhanced testing capabilities
- ✅ Performance improvements (caching, adaptive algorithms)
- ✅ Comprehensive event system
- ✅ Better TypeScript types

---

## Breaking Changes

### 1. Import Path Change

**Before (V1):**
```typescript
import { orchestrationEngine } from '@/services/orchestrationEngine';
```

**After (V2):**
```typescript
import { orchestrationEngineV2 } from '@/services/orchestrationEngineV2';
```

### 2. Method Signature Changes

#### Agent Registration

**V1:**
```typescript
orchestrationEngine.registerAgent({
  id: 'agent-1',
  name: 'Agent 1',
  capabilities: [...],
  status: 'online',
  performance: 95,
  loadLevel: 30,
  version: '1.0.0'
});
```

**V2:** *(Same signature, no changes needed)*
```typescript
orchestrationEngineV2.registerAgent({
  id: 'agent-1',
  name: 'Agent 1',
  capabilities: [...],
  status: 'online',
  performance: 95,
  loadLevel: 30,
  version: '1.0.0'
});
```

#### Agent Selection

**V1:**
```typescript
const agent = orchestrationEngine.selectAgent(
  'data_processing',
  'weighted' // algorithm parameter
);
```

**V2:**
```typescript
const agent = orchestrationEngineV2.selectAgent(
  'data_processing', // capability
  1,                 // minLevel (new parameter)
  'weighted'         // algorithm (optional)
);
```

#### Health Check

**V1:**
```typescript
const health = orchestrationEngine.healthCheck();
// Returns: Record<string, 'healthy' | 'unhealthy' | 'degraded'>
```

**V2:** *(Async in V2, includes auto-failover)*
```typescript
const health = await orchestrationEngineV2.performHealthCheck();
// Returns: Promise<Record<string, 'healthy' | 'unhealthy' | 'degraded'>>
```

---

## Step-by-Step Migration

### Step 1: Update Imports

Find all files importing V1:
```bash
grep -r "from '@/services/orchestrationEngine'" src/
```

Replace with V2:
```typescript
// Old
import { orchestrationEngine } from '@/services/orchestrationEngine';

// New
import { orchestrationEngineV2 } from '@/services/orchestrationEngineV2';
```

### Step 2: Update Method Calls

#### Health Check Migration
```typescript
// Old (synchronous)
const health = orchestrationEngine.healthCheck();

// New (asynchronous)
const health = await orchestrationEngineV2.performHealthCheck();
```

#### Select Agent Migration
```typescript
// Old
const agent = orchestrationEngine.selectAgent('capability_name');

// New (add minLevel parameter)
const agent = orchestrationEngineV2.selectAgent('capability_name', 1);
```

### Step 3: Update Failover Handling

**V1:** Manual failover
```typescript
const success = orchestrationEngine.handleAgentFailure('agent-1');
```

**V2:** Automatic failover via health check
```typescript
// Failover happens automatically in performHealthCheck()
await orchestrationEngineV2.performHealthCheck();

// Or access failover history:
const failoverHistory = orchestrationEngineV2.getFailoverHistory(10);
```

### Step 4: Leverage New Features

#### Use Advanced Load Balancing
```typescript
// V2 supports: 'round_robin', 'least_connections', 'weighted', 
//              'random', 'performance', 'adaptive'
const agent = orchestrationEngineV2.selectAgent(
  'task_execution',
  2,         // minLevel
  'adaptive' // intelligent algorithm selection
);
```

#### Access Load Balancer Metrics
```typescript
const lbMetrics = orchestrationEngineV2.getLoadBalancerMetrics();
console.log('Total connections:', lbMetrics.totalConnections);
console.log('Most loaded agent:', lbMetrics.mostLoadedAgent);
```

#### Query Individual Modules
```typescript
// Access underlying registry
const allAgents = orchestrationEngineV2.getAgents();
const specificAgent = orchestrationEngineV2.getAgent('agent-1');

// Access failover history
const failovers = orchestrationEngineV2.getFailoverHistory(20);
```

---

## Compatibility Layer (Temporary)

For gradual migration, you can create a compatibility wrapper:

```typescript
// src/services/orchestrationEngineCompat.ts
import { orchestrationEngineV2 } from './orchestrationEngineV2';

export const orchestrationEngine = {
  // Wrap V2 methods to match V1 signatures
  registerAgent: orchestrationEngineV2.registerAgent.bind(orchestrationEngineV2),
  
  selectAgent: (capability: string, algorithm?: string) => {
    return orchestrationEngineV2.selectAgent(capability, 1, algorithm as any);
  },
  
  healthCheck: () => {
    // Synchronous wrapper (not recommended for production)
    let result: any = {};
    orchestrationEngineV2.performHealthCheck().then(r => result = r);
    return result;
  },
  
  // ... other methods
};
```

---

## Testing Your Migration

### 1. Unit Tests

```typescript
import { orchestrationEngineV2 } from '@/services/orchestrationEngineV2';

describe('Orchestration Engine V2', () => {
  it('should register agent successfully', () => {
    const success = orchestrationEngineV2.registerAgent({
      id: 'test-agent',
      name: 'Test Agent',
      capabilities: [],
      status: 'online',
      performance: 100,
      loadLevel: 0,
      version: '1.0.0'
    });
    
    expect(success).toBe(true);
    expect(orchestrationEngineV2.getAgent('test-agent')).toBeDefined();
  });
  
  it('should select agent with adaptive algorithm', () => {
    // Register multiple agents
    // ...
    
    const agent = orchestrationEngineV2.selectAgent('test_capability', 1, 'adaptive');
    expect(agent).toBeDefined();
  });
});
```

### 2. Integration Tests

```typescript
describe('V1 to V2 Migration', () => {
  it('should have same behavior as V1', async () => {
    // Register agents
    const agent1 = { id: 'agent-1', /* ... */ };
    orchestrationEngineV2.registerAgent(agent1);
    
    // Health check
    const health = await orchestrationEngineV2.performHealthCheck();
    expect(health['agent-1']).toBe('healthy');
    
    // Agent selection
    const selected = orchestrationEngineV2.selectAgent('capability', 1);
    expect(selected).toBeDefined();
  });
});
```

---

## Rollback Plan

If issues occur during migration:

1. **Immediate rollback:**
   ```bash
   git revert <migration-commit-hash>
   ```

2. **Partial rollback:**
   - Use compatibility layer temporarily
   - Migrate one module at a time
   - Test thoroughly before next migration

3. **Feature flag approach:**
   ```typescript
   const useV2 = import.meta.env.VITE_USE_ORCHESTRATION_V2 === 'true';
   
   const engine = useV2 ? orchestrationEngineV2 : orchestrationEngine;
   ```

---

## Timeline

### Week 1: Preparation
- [ ] Audit all V1 usages
- [ ] Write migration scripts
- [ ] Set up feature flags

### Week 2: Migration
- [ ] Migrate services (P0, P1, P2)
- [ ] Migrate UI components
- [ ] Update tests

### Week 3: Testing
- [ ] Run integration tests
- [ ] Performance benchmarks
- [ ] User acceptance testing

### Week 4: Cleanup
- [ ] Remove V1 code
- [ ] Remove compatibility layer
- [ ] Update documentation

---

## Support

For issues or questions:
- Check [SYSTEM_ANALYSIS_REPORT.md](./SYSTEM_ANALYSIS_REPORT.md)
- Review code comments in `orchestrationEngineV2.ts`
- Contact: development team

---

**Status:** READY FOR MIGRATION ✅  
**Risk Level:** LOW (with compatibility layer)  
**Estimated Time:** 2-3 weeks
