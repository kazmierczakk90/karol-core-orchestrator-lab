
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

export const TableLoadingSkeleton = ({ 
  rows = 5, 
  columns = 4, 
  showHeader = true 
}: LoadingSkeletonProps) => {
  return (
    <div className="space-y-3">
      {showHeader && (
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1 bg-slate-700" />
          ))}
        </div>
      )}
      
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              className="h-8 flex-1 bg-slate-800" 
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardLoadingSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 border border-slate-700 rounded-lg bg-slate-800/50">
          <Skeleton className="h-4 w-3/4 mb-2 bg-slate-700" />
          <Skeleton className="h-3 w-full mb-1 bg-slate-700" />
          <Skeleton className="h-3 w-2/3 bg-slate-700" />
        </div>
      ))}
    </div>
  );
};
