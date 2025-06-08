
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Global Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <Card className="bg-slate-800 border-red-500/30 max-w-lg w-full">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6" />
                <span>System Error</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                An unexpected error occurred in the application. This has been logged for review.
              </p>
              
              {this.state.error && (
                <div className="bg-slate-700/50 p-3 rounded text-xs text-slate-400 font-mono">
                  {this.state.error.message}
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button onClick={this.handleRetry} className="bg-gradient-primary">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="border-slate-600"
                >
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
