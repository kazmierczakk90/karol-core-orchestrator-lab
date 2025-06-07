
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Plus, Grid } from 'lucide-react';

interface DropZoneProps {
  id: string;
  children?: React.ReactNode;
  isEmpty?: boolean;
  columnSpan?: number;
  className?: string;
  placeholder?: string;
}

const DropZone = ({
  id,
  children,
  isEmpty = false,
  columnSpan = 1,
  className = "",
  placeholder = "Drop components here"
}: DropZoneProps) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[100px] transition-all duration-200
        ${columnSpan === 1 ? 'col-span-1' : `col-span-${columnSpan}`}
        ${isOver ? 'bg-cyan-500/20 border-2 border-cyan-400 border-dashed' : 'border-2 border-slate-600/30 border-dashed'}
        ${isEmpty ? 'flex items-center justify-center' : ''}
        ${className}
      `}
    >
      {isEmpty ? (
        <div className="text-center p-6">
          <Grid className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">{placeholder}</p>
          <div className="flex items-center justify-center mt-3">
            <Plus className="h-4 w-4 text-slate-500" />
          </div>
        </div>
      ) : (
        <div className="p-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default DropZone;
