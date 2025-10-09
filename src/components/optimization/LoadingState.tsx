import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  message?: string;
  variant?: 'card' | 'inline' | 'skeleton';
  skeletonCount?: number;
}

export const LoadingState = React.memo(({ 
  message = 'Loading...', 
  variant = 'inline',
  skeletonCount = 3
}: LoadingStateProps) => {
  
  if (variant === 'skeleton') {
    return (
      <div className="space-y-3">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mb-4" />
          <p className="text-slate-300">{message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-cyan-400 mr-3" />
      <span className="text-slate-300">{message}</span>
    </div>
  );
});

LoadingState.displayName = 'LoadingState';
