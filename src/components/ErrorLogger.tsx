import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Bug, CheckCircle, X, Download, Trash2 } from 'lucide-react';

interface ErrorEntry {
  id: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  context?: any;
  attempts: number;
  resolved: boolean;
}

class ErrorLoggingService {
  private static instance: ErrorLoggingService;
  private errors: ErrorEntry[] = [];
  private maxErrors = 1000;

  public static getInstance(): ErrorLoggingService {
    if (!ErrorLoggingService.instance) {
      ErrorLoggingService.instance = new ErrorLoggingService();
    }
    return ErrorLoggingService.instance;
  }

  logError(error: Error, context?: any, level: 'error' | 'warning' | 'info' = 'error'): string {
    const errorEntry: ErrorEntry = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date(),
      level,
      message: error.message,
      stack: error.stack,
      context,
      attempts: 1,
      resolved: false
    };

    // Check for duplicate errors
    const existing = this.errors.find(e => 
      e.message === error.message && 
      !e.resolved && 
      (Date.now() - e.timestamp.getTime()) < 60000 // Within last minute
    );

    if (existing) {
      existing.attempts++;
      return existing.id;
    }

    this.errors.unshift(errorEntry);
    
    // Keep only maxErrors entries
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    console.error(`🔴 Error logged [${errorEntry.id}]:`, error);
    return errorEntry.id;
  }

  resolveError(errorId: string): boolean {
    const error = this.errors.find(e => e.id === errorId);
    if (error) {
      error.resolved = true;
      console.log(`✅ Error resolved [${errorId}]`);
      return true;
    }
    return false;
  }

  getErrors(includeResolved: boolean = false): ErrorEntry[] {
    return includeResolved ? 
      this.errors : 
      this.errors.filter(e => !e.resolved);
  }

  clearErrors(): void {
    this.errors = [];
  }

  exportErrors(): string {
    return JSON.stringify(this.errors, null, 2);
  }

  getErrorStats(): { total: number; unresolved: number; critical: number } {
    return {
      total: this.errors.length,
      unresolved: this.errors.filter(e => !e.resolved).length,
      critical: this.errors.filter(e => e.level === 'error' && !e.resolved).length
    };
  }
}

export const errorLogger = ErrorLoggingService.getInstance();

const ErrorLogger = () => {
  const [errors, setErrors] = useState<ErrorEntry[]>([]);
  const [showResolved, setShowResolved] = useState(false);
  const [stats, setStats] = useState({ total: 0, unresolved: 0, critical: 0 });

  useEffect(() => {
    const updateErrors = () => {
      setErrors(errorLogger.getErrors(showResolved));
      setStats(errorLogger.getErrorStats());
    };

    updateErrors();
    const interval = setInterval(updateErrors, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [showResolved]);

  const handleResolveError = (errorId: string) => {
    errorLogger.resolveError(errorId);
    setErrors(errorLogger.getErrors(showResolved));
    setStats(errorLogger.getErrorStats());
  };

  const handleClearErrors = () => {
    errorLogger.clearErrors();
    setErrors([]);
    setStats({ total: 0, unresolved: 0, critical: 0 });
  };

  const handleExportErrors = () => {
    const data = errorLogger.exportErrors();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `karol-core-errors-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-400 border-red-400';
      case 'warning': return 'text-yellow-400 border-yellow-400';
      case 'info': return 'text-blue-400 border-blue-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <Bug className="h-4 w-4" />;
      default: return <Bug className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-red-800/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-red-400 flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6" />
            <span>Error Logger</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResolved(!showResolved)}
              className="text-white border-slate-600"
            >
              {showResolved ? 'Hide Resolved' : 'Show Resolved'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportErrors}
              className="text-blue-400 border-blue-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearErrors}
              className="text-red-400 border-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600/50">
            <div className="text-white text-lg font-bold">{stats.total}</div>
            <div className="text-slate-400 text-sm">Total Errors</div>
          </div>
          <div className="bg-red-900/30 p-3 rounded-lg border border-red-600/50">
            <div className="text-red-400 text-lg font-bold">{stats.critical}</div>
            <div className="text-slate-400 text-sm">Critical</div>
          </div>
          <div className="bg-yellow-900/30 p-3 rounded-lg border border-yellow-600/50">
            <div className="text-yellow-400 text-lg font-bold">{stats.unresolved}</div>
            <div className="text-slate-400 text-sm">Unresolved</div>
          </div>
        </div>

        {/* Error List */}
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {errors.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No errors to display</p>
                <p className="text-sm">System running smoothly</p>
              </div>
            ) : (
              errors.map((error) => (
                <Card key={error.id} className={`bg-slate-700/30 border-slate-600/50 ${
                  error.resolved ? 'opacity-60' : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <div className={`mt-1 ${getLevelColor(error.level)}`}>
                          {getLevelIcon(error.level)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge className={`${getLevelColor(error.level)} text-xs`} variant="outline">
                              {error.level}
                            </Badge>
                            <span className="text-slate-400 text-xs">
                              {error.timestamp.toLocaleString()}
                            </span>
                            {error.attempts > 1 && (
                              <Badge variant="outline" className="text-orange-400 border-orange-400 text-xs">
                                {error.attempts}x
                              </Badge>
                            )}
                            {error.resolved && (
                              <Badge className="bg-green-500/20 text-green-400 text-xs">
                                Resolved
                              </Badge>
                            )}
                          </div>
                          <p className="text-white font-medium mb-2">{error.message}</p>
                          {error.context && (
                            <div className="bg-slate-600/30 p-2 rounded text-xs text-slate-300 mb-2">
                              <strong>Context:</strong> {JSON.stringify(error.context, null, 2)}
                            </div>
                          )}
                          {error.stack && (
                            <details className="text-xs text-slate-400">
                              <summary className="cursor-pointer hover:text-white">Stack Trace</summary>
                              <pre className="mt-2 bg-slate-600/30 p-2 rounded overflow-x-auto">
                                {error.stack}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                      {!error.resolved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolveError(error.id)}
                          className="text-green-400 border-green-600 hover:bg-green-500/20"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ErrorLogger;
