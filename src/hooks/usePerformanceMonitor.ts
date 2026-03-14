
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/db';

interface PerformanceMetrics {
  memoryUsage: number;
  renderTime: number;
  apiLatency: number;
  errorRate: number;
  cacheHitRate: number;
}

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

interface QueryFilters {
  limit?: number;
  order?: string;
  [key: string]: any;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memoryUsage: 0,
    renderTime: 0,
    apiLatency: 0,
    errorRate: 0,
    cacheHitRate: 0
  });

  const [cache] = useState<Map<string, CacheEntry>>(() => new Map());
  const cacheCleanupIntervalRef = useRef<NodeJS.Timeout>();

  // Memory usage monitoring z alertami
  const measureMemoryUsage = useCallback(() => {
    if ('performance' in window && 'memory' in (performance as any)) {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / (1024 * 1024);
      const limitMB = memory.jsHeapSizeLimit / (1024 * 1024);
      const usagePercent = (usedMB / limitMB) * 100;
      
      // Alert przy wysokim zużyciu pamięci
      if (usagePercent > 90) {
        console.warn(`⚠️ High memory usage: ${usagePercent.toFixed(1)}% (${usedMB.toFixed(0)}MB / ${limitMB.toFixed(0)}MB)`);
      }
      
      return Math.round(usedMB);
    }
    return 0;
  }, []);

  // API latency measurement
  const measureApiLatency = useCallback(async (operation: () => Promise<any>) => {
    const startTime = performance.now();
    try {
      const result = await operation();
      const endTime = performance.now();
      const latency = endTime - startTime;
      
      setMetrics(prev => ({
        ...prev,
        apiLatency: Math.round((prev.apiLatency + latency) / 2)
      }));
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const latency = endTime - startTime;
      
      setMetrics(prev => ({
        ...prev,
        apiLatency: Math.round((prev.apiLatency + latency) / 2),
        errorRate: prev.errorRate + 1
      }));
      
      throw error;
    }
  }, []);

  // Cache management z auto-cleanup
  const getCached = useCallback((key: string): any | null => {
    const entry = cache.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      cache.delete(key);
      return null;
    }
    
    setMetrics(prev => ({
      ...prev,
      cacheHitRate: prev.cacheHitRate + 1
    }));
    
    return entry.data;
  }, [cache]);

  const setCached = useCallback((key: string, data: any, ttl: number = 300000) => {
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }, [cache]);

  // Simplified optimized query function with explicit any types to avoid deep instantiation
  const optimizedQuery = useCallback(async (
    table: string,
    select: string = '*',
    filters: QueryFilters = {},
    cacheKey?: string,
    cacheTtl?: number
  ) => {
    // Check cache first
    if (cacheKey) {
      const cached = getCached(cacheKey);
      if (cached) {
        console.log(`Cache hit for ${cacheKey}`);
        return cached;
      }
    }

    return measureApiLatency(async () => {
      // Use explicit any type to avoid deep type instantiation issues
      const client: any = supabase;
      let query = client.from(table).select(select);
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (key === 'limit') {
          query = query.limit(value as number);
        } else if (key === 'order') {
          const [column, ascending] = (value as string).split(':');
          query = query.order(column, { ascending: ascending === 'asc' });
        } else {
          query = query.eq(key, value);
        }
      });

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Cache the result
      if (cacheKey && data) {
        setCached(cacheKey, data, cacheTtl);
        console.log(`Cached data for ${cacheKey}`);
      }
      
      return data;
    });
  }, [measureApiLatency, getCached, setCached]);

  // Performance monitoring loop z auto-cleanup cache
  useEffect(() => {
    const interval = setInterval(() => {
      const memUsage = measureMemoryUsage();
      
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memUsage
      }));
    }, 5000);

    // Auto-cleanup expired cache entries co 30 sekund
    cacheCleanupIntervalRef.current = setInterval(() => {
      const now = Date.now();
      let cleaned = 0;
      
      cache.forEach((entry, key) => {
        if (now - entry.timestamp > entry.ttl) {
          cache.delete(key);
          cleaned++;
        }
      });
      
      if (cleaned > 0) {
        console.log(`🧹 Cache cleanup: removed ${cleaned} expired entries`);
      }
    }, 30000);

    return () => {
      clearInterval(interval);
      if (cacheCleanupIntervalRef.current) {
        clearInterval(cacheCleanupIntervalRef.current);
      }
    };
  }, [measureMemoryUsage, cache]);

  // Render time measurement
  const measureRenderTime = useCallback((componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      
      setMetrics(prev => ({
        ...prev,
        renderTime: Math.round((prev.renderTime + renderTime) / 2)
      }));
    };
  }, []);

  return {
    metrics,
    optimizedQuery,
    measureRenderTime,
    getCached,
    setCached,
    cache
  };
};
