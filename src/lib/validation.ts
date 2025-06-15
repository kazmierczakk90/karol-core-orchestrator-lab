import { z } from 'zod';

// Agent validation schemas
export const AgentSchema = z.object({
  id: z.string().uuid(),
  identifier: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(['core', 'karol', 'integration', 'utility']),
  description: z.string().min(1),
  is_active: z.boolean(),
  status: z.enum(['active', 'inactive', 'maintenance', 'error']),
  tasks_completed: z.number().int().min(0),
  last_used: z.string().datetime(),
  capabilities: z.array(z.string()),
  version: z.string(),
  performance: z.number().int().min(0).max(100),
  created_at: z.string().datetime(),
  owner_id: z.string().uuid().optional()
});

export const CreateAgentSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
  name: z.string().min(1, "Name is required"),
  type: z.enum(['core', 'karol', 'integration', 'utility']),
  description: z.string().min(1, "Description is required"),
  capabilities: z.array(z.string()).optional(),
  version: z.string().optional()
});

// Improvement Event validation schemas
export const ImprovementEventSchema = z.object({
  id: z.string().uuid(),
  event_type: z.enum(['decision', 'action', 'chat', 'command', 'result']),
  context: z.string().min(1),
  details: z.record(z.any()).optional(),
  agent_id: z.string().optional(),
  user_id: z.string().uuid().optional(),
  impact: z.enum(['low', 'medium', 'high']).optional(),
  created_at: z.string().datetime()
});

export const CreateImprovementEventSchema = z.object({
  event_type: z.enum(['decision', 'action', 'chat', 'command', 'result']),
  context: z.string().min(1, "Context is required"),
  details: z.record(z.any()).optional(),
  agent_id: z.string().optional(),
  impact: z.enum(['low', 'medium', 'high']).optional()
});

// Log validation schemas
export const LogSchema = z.object({
  id: z.string().uuid(),
  log_type: z.string().min(1),
  message: z.string().optional(),
  details: z.record(z.any()).optional(),
  agent_id: z.string().optional(),
  user_id: z.string().uuid().optional(),
  created_at: z.string().datetime()
});

export const CreateLogSchema = z.object({
  log_type: z.string().min(1, "Log type is required"),
  message: z.string().optional(),
  details: z.record(z.any()).optional(),
  agent_id: z.string().optional()
});

// Analytics validation schemas
export const AnalyticsEventSchema = z.object({
  id: z.string().uuid(),
  event_type: z.string().min(1),
  context: z.string().optional(),
  description: z.string().optional(),
  value: z.number().optional(),
  agent_id: z.string().optional(),
  user_id: z.string().uuid().optional(),
  created_at: z.string().datetime()
});

export const CreateAnalyticsEventSchema = z.object({
  event_type: z.string().min(1, "Event type is required"),
  context: z.string().optional(),
  description: z.string().optional(),
  value: z.number().optional(),
  agent_id: z.string().optional()
});

// Validation utility functions
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Validation failed: ${message}`);
    }
    throw error;
  }
};

export const validateDataSafe = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  try {
    const validData = schema.parse(data);
    return { success: true as const, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return { success: false as const, error: `Validation failed: ${message}` };
    }
    return { success: false as const, error: 'Unknown validation error' };
  }
};