
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useVirtualization } from '@/hooks/useVirtualization';

interface VirtualizedTableProps {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  headers: React.ReactNode;
  itemHeight?: number;
  containerHeight?: number;
  className?: string;
}

const VirtualizedTable = ({
  items,
  renderItem,
  headers,
  itemHeight = 80,
  containerHeight = 400,
  className = ''
}: VirtualizedTableProps) => {
  const {
    scrollElementRef,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  } = useVirtualization({
    items,
    itemHeight,
    containerHeight
  });

  return (
    <div className={`border border-slate-700/50 rounded-lg overflow-hidden ${className}`}>
      <Table>
        <TableHeader>
          {headers}
        </TableHeader>
      </Table>
      
      <div
        ref={scrollElementRef}
        style={{ height: containerHeight, overflow: 'auto' }}
        onScroll={handleScroll}
        className="relative"
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            <Table>
              <TableBody>
                {visibleItems.map(({ item, index }) => renderItem(item, index))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualizedTable;
