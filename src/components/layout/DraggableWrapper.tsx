
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Lock, Unlock, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DraggableWrapperProps {
  id: string;
  children: React.ReactNode;
  isLocked?: boolean;
  isResizable?: boolean;
  onLock?: () => void;
  onUnlock?: () => void;
  onClone?: () => void;
  onDelete?: () => void;
  className?: string;
}

const DraggableWrapper = ({
  id,
  children,
  isLocked = false,
  isResizable = true,
  onLock,
  onUnlock,
  onClone,
  onDelete,
  className = ""
}: DraggableWrapperProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: isLocked });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative border-2 border-transparent hover:border-cyan-400/50 
        ${isDragging ? 'opacity-50 z-50' : ''} 
        ${isLocked ? 'border-red-400/50' : ''}
        ${className}
      `}
    >
      {/* Drag Handle and Controls */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <div className="flex items-center space-x-1 bg-slate-800/90 rounded-md p-1">
          {!isLocked && (
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-700 rounded"
            >
              <GripVertical className="h-4 w-4 text-slate-400" />
            </div>
          )}
          
          <Button
            onClick={isLocked ? onUnlock : onLock}
            variant="ghost"
            size="sm"
            className="p-1 h-6 w-6"
          >
            {isLocked ? (
              <Lock className="h-3 w-3 text-red-400" />
            ) : (
              <Unlock className="h-3 w-3 text-slate-400" />
            )}
          </Button>
          
          <Button
            onClick={onClone}
            variant="ghost"
            size="sm"
            className="p-1 h-6 w-6"
          >
            <Copy className="h-3 w-3 text-slate-400" />
          </Button>
          
          <Button
            onClick={onDelete}
            variant="ghost"
            size="sm"
            className="p-1 h-6 w-6"
          >
            <Trash2 className="h-3 w-3 text-red-400" />
          </Button>
        </div>
      </div>

      {/* Resize Handles */}
      {isResizable && !isLocked && (
        <>
          {/* Corner resize handles */}
          <div className="absolute top-0 left-0 w-3 h-3 bg-cyan-400 opacity-0 group-hover:opacity-100 cursor-nw-resize" />
          <div className="absolute top-0 right-0 w-3 h-3 bg-cyan-400 opacity-0 group-hover:opacity-100 cursor-ne-resize" />
          <div className="absolute bottom-0 left-0 w-3 h-3 bg-cyan-400 opacity-0 group-hover:opacity-100 cursor-sw-resize" />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-cyan-400 opacity-0 group-hover:opacity-100 cursor-se-resize" />
          
          {/* Edge resize handles */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-cyan-400 opacity-0 group-hover:opacity-100 cursor-n-resize" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-cyan-400 opacity-0 group-hover:opacity-100 cursor-s-resize" />
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-6 bg-cyan-400 opacity-0 group-hover:opacity-100 cursor-w-resize" />
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-6 bg-cyan-400 opacity-0 group-hover:opacity-100 cursor-e-resize" />
        </>
      )}

      {/* Content */}
      <div className={isDragging ? 'pointer-events-none' : ''}>
        {children}
      </div>
    </div>
  );
};

export default DraggableWrapper;
