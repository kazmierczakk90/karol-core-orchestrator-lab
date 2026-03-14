import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { errorHandlingService } from '@/services/errorHandlingService';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      errorCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState(prev => ({
      error, 
      errorInfo,
      errorCount: prev.errorCount + 1
    }));
    
    // Log do ErrorHandlingService
    errorHandlingService.handleError(error, `ErrorBoundary: ${errorInfo.componentStack?.slice(0, 200)}`);
    
    // Log do analytics
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: true,
        component_stack: errorInfo.componentStack?.slice(0, 500)
      });
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined 
    });
    
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportBug = () => {
    const bugReport = {
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      component: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.log('Bug Report:', bugReport);
    
    // W przyszłości można wysłać do systemu raportowania błędów
    alert('Bug report created. Check console for details.');
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isCritical = this.state.errorCount > 2;

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
          <Card className={`${isCritical ? 'border-red-600' : 'border-red-800/30'} bg-slate-800/50 max-w-md w-full`}>
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6" />
                <span>{isCritical ? 'Critical System Error' : 'System Error'}</span>
              </CardTitle>
              <CardDescription className="text-slate-300">
                {isCritical 
                  ? 'Multiple errors detected. System may be unstable.'
                  : 'Something went wrong with this component'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-900/50 p-3 rounded border border-slate-700">
                <p className="text-red-300 text-sm font-mono break-words">
                  {this.state.error?.message || 'Unknown error occurred'}
                </p>
              </div>
              
              {isCritical && (
                <div className="bg-red-900/20 p-3 rounded border border-red-800/30">
                  <p className="text-red-200 text-xs">
                    ⚠️ Error count: {this.state.errorCount} - Consider reloading the page
                  </p>
                </div>
              )}
              
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={this.handleRetry}
                  className="bg-gradient-primary hover:bg-gradient-secondary"
                  disabled={isCritical}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {isCritical ? 'Too many errors' : 'Try Again'}
                </Button>
                
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="border-slate-600 hover:border-cyan-400"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>

                {import.meta.env.DEV && (
                  <Button
                    onClick={this.handleReportBug}
                    variant="outline"
                    className="border-orange-600 hover:border-orange-400"
                  >
                    <Bug className="h-4 w-4 mr-2" />
                    Report Bug
                  </Button>
                )}
              </div>
              
              {import.meta.env.DEV && this.state.errorInfo && (
                <details className="mt-4">
                  <summary className="text-slate-400 cursor-pointer hover:text-cyan-400 transition-colors">
                    Developer Details
                  </summary>
                  <div className="mt-2 space-y-2">
                    <div className="text-xs text-slate-300 bg-slate-900/50 p-2 rounded overflow-auto max-h-40">
                      <strong>Error Stack:</strong>
                      <pre className="mt-1 text-[10px]">{this.state.error?.stack}</pre>
                    </div>
                    <div className="text-xs text-slate-300 bg-slate-900/50 p-2 rounded overflow-auto max-h-40">
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 text-[10px]">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;