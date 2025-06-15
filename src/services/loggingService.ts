import { supabase } from '@/integrations/supabase/client';
import { CreateLogSchema, validateDataSafe } from '@/lib/validation';
import { errorHandlingService } from './errorHandlingService';

export interface LogEntry {
  id: string;
  log_type: string;
  message?: string;
  details?: Record<string, any>;
  agent_id?: string;
  user_id?: string;
  created_at: string;
}

export interface CreateLogData {
  log_type: string;
  message?: string;
  details?: Record<string, any>;
  agent_id?: string;
}

class LoggingService {
  private static instance: LoggingService;
  private logQueue: CreateLogData[] = [];
  private isProcessing = false;
  private batchSize = 10;
  private flushInterval = 5000; // 5 seconds

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  constructor() {
    // Start periodic flush
    setInterval(() => {
      this.flushLogs();
    }, this.flushInterval);

    // Flush logs before page unload
    window.addEventListener('beforeunload', () => {
      this.flushLogs();
    });
  }

  public async log(data: CreateLogData): Promise<void> {
    // Validate data
    const validation = validateDataSafe(CreateLogSchema, data);
    if (!validation.success) {
      console.error('Invalid log data:', validation.error);
      return;
    }

    // Add to queue
    this.logQueue.push(data);

    // Flush if queue is full
    if (this.logQueue.length >= this.batchSize) {
      await this.flushLogs();
    }
  }

  public async logAgentAction(agentId: string, action: string, details?: Record<string, any>): Promise<void> {
    await this.log({
      log_type: 'agent_action',
      message: `Agent ${agentId} performed: ${action}`,
      details: {
        action,
        timestamp: new Date().toISOString(),
        ...details
      },
      agent_id: agentId
    });
  }

  public async logSystemEvent(event: string, details?: Record<string, any>): Promise<void> {
    await this.log({
      log_type: 'system_event',
      message: event,
      details: {
        timestamp: new Date().toISOString(),
        ...details
      }
    });
  }

  public async logUserAction(action: string, details?: Record<string, any>): Promise<void> {
    await this.log({
      log_type: 'user_action',
      message: action,
      details: {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...details
      }
    });
  }

  public async logError(error: Error, context?: string, agentId?: string): Promise<void> {
    await this.log({
      log_type: 'error',
      message: error.message,
      details: {
        name: error.name,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        url: window.location.href
      },
      agent_id: agentId
    });
  }

  public async getRecentLogs(limit: number = 100): Promise<LogEntry[]> {
    try {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        errorHandlingService.handleSupabaseError(error, 'Fetching logs');
        return [];
      }

      return (data || []).map(log => ({
        ...log,
        details: log.details as Record<string, any> || {}
      }));
    } catch (error) {
      errorHandlingService.handleError(error, 'Getting recent logs');
      return [];
    }
  }

  public async getLogsByAgent(agentId: string, limit: number = 50): Promise<LogEntry[]> {
    try {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        errorHandlingService.handleSupabaseError(error, 'Fetching agent logs');
        return [];
      }

      return (data || []).map(log => ({
        ...log,
        details: log.details as Record<string, any> || {}
      }));
    } catch (error) {
      errorHandlingService.handleError(error, 'Getting logs by agent');
      return [];
    }
  }

  public async getLogsByType(logType: string, limit: number = 50): Promise<LogEntry[]> {
    try {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .eq('log_type', logType)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        errorHandlingService.handleSupabaseError(error, 'Fetching logs by type');
        return [];
      }

      return (data || []).map(log => ({
        ...log,
        details: log.details as Record<string, any> || {}
      }));
    } catch (error) {
      errorHandlingService.handleError(error, 'Getting logs by type');
      return [];
    }
  }

  private async flushLogs(): Promise<void> {
    if (this.isProcessing || this.logQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const logsToProcess = [...this.logQueue];
    this.logQueue = [];

    try {
      const { error } = await supabase
        .from('logs')
        .insert(logsToProcess);

      if (error) {
        // If insert fails, put logs back in queue
        this.logQueue.unshift(...logsToProcess);
        throw error;
      }

      console.log(`✅ Flushed ${logsToProcess.length} logs to database`);
    } catch (error) {
      console.error('Failed to flush logs:', error);
      // Store failed logs in localStorage as backup
      this.storeLogsLocally(logsToProcess);
    } finally {
      this.isProcessing = false;
    }
  }

  private storeLogsLocally(logs: CreateLogData[]): void {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('karol-core-failed-logs') || '[]');
      const updatedLogs = [...existingLogs, ...logs];
      
      // Keep only last 1000 logs
      if (updatedLogs.length > 1000) {
        updatedLogs.splice(0, updatedLogs.length - 1000);
      }

      localStorage.setItem('karol-core-failed-logs', JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Failed to store logs locally:', error);
    }
  }

  public async retryFailedLogs(): Promise<void> {
    try {
      const failedLogs = JSON.parse(localStorage.getItem('karol-core-failed-logs') || '[]');
      if (failedLogs.length === 0) return;

      const { error } = await supabase
        .from('logs')
        .insert(failedLogs);

      if (!error) {
        localStorage.removeItem('karol-core-failed-logs');
        console.log(`✅ Retried ${failedLogs.length} failed logs successfully`);
      }
    } catch (error) {
      console.error('Failed to retry logs:', error);
    }
  }
}

export const loggingService = LoggingService.getInstance();
