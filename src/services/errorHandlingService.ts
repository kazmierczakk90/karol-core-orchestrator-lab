import { toast } from '@/hooks/use-toast';

export interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoffMultiplier?: number;
  retryCondition?: (error: any) => boolean;
}

export class ErrorHandlingService {
  private static instance: ErrorHandlingService;
  private retryAttempts = new Map<string, number>();

  public static getInstance(): ErrorHandlingService {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = new ErrorHandlingService();
    }
    return ErrorHandlingService.instance;
  }

  public async withRetry<T>(
    operation: () => Promise<T>,
    config: RetryConfig,
    operationId?: string
  ): Promise<T> {
    const { maxAttempts, delay, backoffMultiplier = 2, retryCondition } = config;
    const id = operationId || this.generateOperationId();
    
    let attempt = this.retryAttempts.get(id) || 0;

    while (attempt < maxAttempts) {
      try {
        const result = await operation();
        this.retryAttempts.delete(id);
        return result;
      } catch (error) {
        attempt++;
        this.retryAttempts.set(id, attempt);

        // Check if we should retry this error
        if (retryCondition && !retryCondition(error)) {
          this.retryAttempts.delete(id);
          throw error;
        }

        // If this was the last attempt, throw the error
        if (attempt >= maxAttempts) {
          this.retryAttempts.delete(id);
          this.handleError(error, `Operation failed after ${maxAttempts} attempts`);
          throw error;
        }

        // Wait before retrying
        const waitTime = delay * Math.pow(backoffMultiplier, attempt - 1);
        await this.sleep(waitTime);
      }
    }

    throw new Error('Max retry attempts reached');
  }

  public handleError(error: any, context?: string): void {
    console.error('Error handled by ErrorHandlingService:', error, context);

    // Determine error type and severity
    const errorInfo = this.analyzeError(error);
    
    // Show appropriate toast notification
    toast({
      title: errorInfo.title,
      description: errorInfo.description,
      variant: errorInfo.severity === 'high' ? 'destructive' : 'default',
    });

    // Log to analytics if available
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: errorInfo.description,
        fatal: errorInfo.severity === 'high'
      });
    }

    // Store error for debugging in development
    if (process.env.NODE_ENV === 'development') {
      this.storeErrorForDebugging(error, context);
    }
  }

  public handleSupabaseError(error: any, operation?: string): void {
    console.error('Supabase error:', error);

    let message = 'An unexpected error occurred';
    
    if (error?.code === 'PGRST116') {
      message = 'No data found';
    } else if (error?.code === '23505') {
      message = 'This record already exists';
    } else if (error?.code === '23503') {
      message = 'Cannot delete: record is referenced by other data';
    } else if (error?.message) {
      message = error.message;
    }

    const contextMessage = operation ? `${operation}: ${message}` : message;

    toast({
      title: "Database Error",
      description: contextMessage,
      variant: "destructive"
    });
  }

  public isNetworkError(error: any): boolean {
    return (
      error?.name === 'NetworkError' ||
      error?.code === 'NETWORK_ERROR' ||
      error?.message?.includes('network') ||
      error?.message?.includes('fetch')
    );
  }

  public isRetryableError(error: any): boolean {
    return (
      this.isNetworkError(error) ||
      error?.status >= 500 ||
      error?.code === 'ETIMEDOUT' ||
      error?.code === 'ECONNRESET'
    );
  }

  private analyzeError(error: any): { title: string; description: string; severity: 'low' | 'medium' | 'high' } {
    if (this.isNetworkError(error)) {
      return {
        title: 'Connection Error',
        description: 'Please check your internet connection and try again',
        severity: 'medium'
      };
    }

    if (error?.status === 401) {
      return {
        title: 'Authentication Error',
        description: 'Please log in again',
        severity: 'high'
      };
    }

    if (error?.status === 403) {
      return {
        title: 'Permission Error',
        description: 'You do not have permission to perform this action',
        severity: 'medium'
      };
    }

    if (error?.status >= 500) {
      return {
        title: 'Server Error',
        description: 'Something went wrong on our end. Please try again later',
        severity: 'high'
      };
    }

    return {
      title: 'Error',
      description: error?.message || 'An unexpected error occurred',
      severity: 'low'
    };
  }

  private generateOperationId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private storeErrorForDebugging(error: any, context?: string): void {
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      },
      context,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    const existingLogs = JSON.parse(localStorage.getItem('karol-core-error-logs') || '[]');
    existingLogs.push(errorLog);
    
    // Keep only last 100 error logs
    if (existingLogs.length > 100) {
      existingLogs.splice(0, existingLogs.length - 100);
    }

    localStorage.setItem('karol-core-error-logs', JSON.stringify(existingLogs));
  }
}

export const errorHandlingService = ErrorHandlingService.getInstance();
