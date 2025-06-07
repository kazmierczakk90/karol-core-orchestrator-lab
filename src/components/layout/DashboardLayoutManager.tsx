
import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Grid, Columns, Smartphone, Tablet, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DraggableWrapper from './DraggableWrapper';
import DropZone from './DropZone';

interface LayoutItem {
  id: string;
  type: 'component' | 'section' | 'header' | 'content';
  content: React.ReactNode;
  columnSpan?: number;
  isLocked?: boolean;
  isResizable?: boolean;
}

interface DashboardLayoutManagerProps {
  children?: React.ReactNode;
  initialLayout?: LayoutItem[];
  onLayoutChange?: (layout: LayoutItem[]) => void;
  className?: string;
}

const DashboardLayoutManager = ({
  children,
  initialLayout = [],
  onLayoutChange,
  className = ""
}: DashboardLayoutManagerProps) => {
  const [items, setItems] = useState<LayoutItem[]>(initialLayout);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [columns, setColumns] = useState<number>(12);
  const [breakpoint, setBreakpoint] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isEditMode, setIsEditMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        onLayoutChange?.(newItems);
        return newItems;
      });
    }
    
    setActiveId(null);
  };

  const handleLockItem = (id: string) => {
    setItems(items => items.map(item => 
      item.id === id ? { ...item, isLocked: true } : item
    ));
  };

  const handleUnlockItem = (id: string) => {
    setItems(items => items.map(item => 
      item.id === id ? { ...item, isLocked: false } : item
    ));
  };

  const handleCloneItem = (id: string) => {
    const itemToClone = items.find(item => item.id === id);
    if (itemToClone) {
      const newItem = {
        ...itemToClone,
        id: `${id}-clone-${Date.now()}`,
      };
      setItems(items => [...items, newItem]);
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems(items => items.filter(item => item.id !== id));
  };

  const getGridClasses = () => {
    const baseClasses = "grid gap-4 p-4";
    const columnClasses = {
      1: "grid-cols-1",
      2: "grid-cols-2", 
      3: "grid-cols-3",
      4: "grid-cols-4",
      6: "grid-cols-6",
      12: "grid-cols-12"
    };
    
    return `${baseClasses} ${columnClasses[columns as keyof typeof columnClasses] || 'grid-cols-12'}`;
  };

  const getBreakpointIcon = () => {
    switch (breakpoint) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Layout Controls */}
      <div className="flex items-center justify-between p-4 bg-slate-800/50 border-b border-slate-700">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`${isEditMode ? 'bg-cyan-500' : 'bg-slate-600'}`}
          >
            <Grid className="h-4 w-4 mr-2" />
            Edit Layout
          </Button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400">Columns:</span>
            {[1, 2, 3, 4, 6, 12].map(col => (
              <Button
                key={col}
                onClick={() => setColumns(col)}
                variant={columns === col ? "default" : "outline"}
                size="sm"
              >
                {col}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge className="flex items-center space-x-1">
            {getBreakpointIcon()}
            <span>{breakpoint}</span>
          </Badge>
          
          <div className="flex space-x-1">
            {(['desktop', 'tablet', 'mobile'] as const).map(bp => (
              <Button
                key={bp}
                onClick={() => setBreakpoint(bp)}
                variant={breakpoint === bp ? "default" : "outline"}
                size="sm"
              >
                {bp === 'desktop' && <Monitor className="h-4 w-4" />}
                {bp === 'tablet' && <Tablet className="h-4 w-4" />}
                {bp === 'mobile' && <Smartphone className="h-4 w-4" />}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Layout Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={getGridClasses()}>
          {isEditMode ? (
            <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
              {items.map((item) => (
                <DropZone
                  key={item.id}
                  id={item.id}
                  columnSpan={item.columnSpan || 1}
                >
                  <DraggableWrapper
                    id={item.id}
                    isLocked={item.isLocked}
                    isResizable={item.isResizable}
                    onLock={() => handleLockItem(item.id)}
                    onUnlock={() => handleUnlockItem(item.id)}
                    onClone={() => handleCloneItem(item.id)}
                    onDelete={() => handleDeleteItem(item.id)}
                  >
                    {item.content}
                  </DraggableWrapper>
                </DropZone>
              ))}
              
              {/* Empty Drop Zone */}
              <DropZone
                id="empty-zone"
                isEmpty={true}
                placeholder="Drop new components here"
                className="min-h-[150px]"
              />
            </SortableContext>
          ) : (
            // Normal view mode
            children
          )}
        </div>
      </DndContext>
    </div>
  );
};

export default DashboardLayoutManager;
