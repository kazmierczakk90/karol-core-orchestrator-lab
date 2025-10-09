import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorDisplayProps {
  error: Error | string;
  onRetry?: () => void;
  variant?: 'card' | 'alert' | 'inline';
  title?: string;
}

export const ErrorDisplay = React.memo(({ 
  error, 
  onRetry, 
  variant = 'alert',
  title = 'Error'
}: ErrorDisplayProps) => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  if (variant === 'card') {
    return (
      <Card className="bg-slate-800/50 border-red-800/30">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-300">{errorMessage}</p>
          {onRetry && (
            <Button
              onClick={onRetry}
              size="sm"
              className="bg-gradient-primary hover:bg-gradient-secondary"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'alert') {
    return (
      <Alert variant="destructive" className="bg-red-900/20 border-red-800/30">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="ml-2">
          {errorMessage}
          {onRetry && (
            <Button
              onClick={onRetry}
              size="sm"
              variant="outline"
              className="ml-4 border-red-700 hover:bg-red-900/30"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex items-center space-x-3 text-red-400 py-4">
      <AlertTriangle className="h-5 w-5 flex-shrink-0" />
      <span className="text-sm">{errorMessage}</span>
      {onRetry && (
        <Button
          onClick={onRetry}
          size="sm"
          variant="ghost"
          className="ml-auto"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
});

ErrorDisplay.displayName = 'ErrorDisplay';
