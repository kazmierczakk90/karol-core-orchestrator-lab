
import { supabase } from '@/integrations/supabase/db';
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

interface LoggingMetrics {
  totalLogs: number;
  errorLogs: number;
  successfulFlushes: number;
  failedFlushes: number;
}

class LoggingService {
  private static instance: LoggingService;
  private logQueue: CreateLogData[] = [];
  private isProcessing = false;
  private batchSize = 10;
  private flushInterval = 5000;
  private maxQueueSize = 1000;
  private metrics: LoggingMetrics = {
    totalLogs: 0,
    errorLogs: 0,
    successfulFlushes: 0,
    failedFlushes: 0
  };

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  constructor() {
    this.startPeriodicFlush();
    this.setupPageUnloadHandler();
  }

  public async log(data: CreateLogData): Promise<void> {
    const validation = validateDataSafe(CreateLogSchema, data);
    if (!validation.success) {
      console.error('Invalid log data:', validation.error);
      return;
    }

    // Prevent queue overflow
    if (this.logQueue.length >= this.maxQueueSize) {
      this.logQueue.shift(); // Remove oldest log
    }

    this.logQueue.push(data);
    this.metrics.totalLogs++;

    if (data.log_type === 'error') {
      this.metrics.errorLogs++;
    }

    if (this.logQueue.length >= this.batchSize) {
      await this.flushLogs();
    }
  }

  public async logAgentAction(agentId: string, action: string,

details?: Record<string, any>): Promise<void> {
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

  public getMetrics(): LoggingMetrics {
    return { ...this.metrics };
  }

  public getQueueStatus(): { queueSize: number; isProcessing: boolean; maxQueueSize: number } {
    return {
      queueSize: this.logQueue.length,
      isProcessing: this.isProcessing,
      maxQueueSize: this.maxQueueSize
    };
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
        this.logQueue.unshift(...logsToProcess);
        this.metrics.failedFlushes++;
        throw error;
      }

      this.metrics.successfulFlushes++;
      console.log(`✅ Flushed ${logsToProcess.length} logs to database`);
    } catch (error) {
      console.error('Failed to flush logs:', error);
      this.storeLogsLocally(logsToProcess);
    } finally {
      this.isProcessing = false;
    }
  }

  private startPeriodicFlush(): void {
    setInterval(() => {
      this.flushLogs();
    }, this.flushInterval);
  }

  private setupPageUnloadHandler(): void {
    window.addEventListener('beforeunload', () => {
      if (this.logQueue.length > 0) {
        // Try to send logs immediately (limited by browser constraints)
        navigator.sendBeacon && this.sendBeaconLogs();
      }
    });
  }

  private sendBeaconLogs(): void {
    if (this.logQueue.length === 0) return;
    
    try {
      const logsData = JSON.stringify(this.logQueue);
      const blob = new Blob([logsData], { type: 'application/json' });
      
      // This is a simplified approach - in production you'd need a dedicated endpoint
      navigator.sendBeacon('/api/logs', blob);
    } catch (error) {
      console.error('Failed to send beacon logs:', error);
    }
  }

  private storeLogsLocally(logs: CreateLogData[]): void {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('karol-core-failed-logs') || '[]');
      const updatedLogs = [...existingLogs, ...logs];
      
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
