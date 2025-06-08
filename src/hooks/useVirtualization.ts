
import { useState, useEffect, useMemo, useRef } from 'react';

interface UseVirtualizationProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export const useVirtualization = ({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}: UseVirtualizationProps) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1).map((item, index) => ({
      item,
      index: visibleRange.startIndex + index
    }));
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  return {
    scrollElementRef,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  };
};
