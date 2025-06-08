
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProcessEntry, ErrorEntry } from '@/types/common';

interface ProcessState {
  processes: ProcessEntry[];
  errors: ErrorEntry[];
  activeProcesses: ProcessEntry[];
  
  // Process actions
  addProcess: (process: Omit<ProcessEntry, 'id' | 'startTime'>) => string;
  updateProcess: (id: string, updates: Partial<ProcessEntry>) => void;
  completeProcess: (id: string, success?: boolean, error?: string) => void;
  
  // Error actions
  addError: (error: Omit<ErrorEntry, 'id' | 'timestamp'>) => void;
  resolveError: (id: string) => void;
  clearErrors: () => void;
  
  // Export functions
  exportProcesses: () => string;
  exportErrors: () => string;
  
  // Analytics functions
  getProcessStats: () => {
    total: number;
    completed: number;
    failed: number;
    running: number;
    avgDuration: number;
  };
  
  getErrorStats: () => {
    total: number;
    resolved: number;
    critical: number;
    byType: Record<string, number>;
  };
}

export const useProcessStore = create<ProcessState>()(
  persist(
    (set, get) => ({
      processes: [],
      errors: [],
      activeProcesses: [],

      addProcess: (processData) => {
        const id = `proc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const process: ProcessEntry = {
          ...processData,
          id,
          startTime: new Date(),
          progress: 0
        };

        set(state => ({
          processes: [process, ...state.processes],
          activeProcesses: [...state.activeProcesses, process]
        }));

        return id;
      },

      updateProcess: (id, updates) => {
        set(state => ({
          processes: state.processes.map(p => 
            p.id === id ? { ...p, ...updates } : p
          ),
          activeProcesses: state.activeProcesses.map(p => 
            p.id === id ? { ...p, ...updates } : p
          )
        }));
      },

      completeProcess: (id, success = true, error) => {
        const endTime = new Date();
        const updates: Partial<ProcessEntry> = {
          status: success ? 'completed' : 'failed',
          endTime,
          progress: 100,
          ...(error && { error })
        };

        set(state => ({
          processes: state.processes.map(p => 
            p.id === id ? { ...p, ...updates } : p
          ),
          activeProcesses: state.activeProcesses.filter(p => p.id !== id)
        }));

        if (!success && error) {
          get().addError({
            type: 'runtime',
            severity: 'high',
            message: `Proces ${id} zakończony błędem`,
            details: error,
            context: 'process_execution',
            resolved: false
          });
        }
      },

      addError: (errorData) => {
        const error: ErrorEntry = {
          ...errorData,
          id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date()
        };

        set(state => ({
          errors: [error, ...state.errors]
        }));
      },

      resolveError: (id) => {
        set(state => ({
          errors: state.errors.map(e => 
            e.id === id ? { ...e, resolved: true } : e
          )
        }));
      },

      clearErrors: () => {
        set({ errors: [] });
      },

      exportProcesses: () => {
        const processes = get().processes;
        const csvContent = [
          'ID,Type,Status,Title,Start Time,End Time,Duration (ms),Progress,Error',
          ...processes.map(p => {
            const duration = p.endTime ? p.endTime.getTime() - p.startTime.getTime() : 0;
            return `"${p.id}","${p.type}","${p.status}","${p.title}","${p.startTime.toISOString()}","${p.endTime?.toISOString() || ''}","${duration}","${p.progress}","${p.error || ''}"`;
          })
        ].join('\n');

        return csvContent;
      },

      exportErrors: () => {
        const errors = get().errors;
        const csvContent = [
          'ID,Type,Severity,Message,Details,Timestamp,Context,Resolved',
          ...errors.map(e => 
            `"${e.id}","${e.type}","${e.severity}","${e.message}","${e.details || ''}","${e.timestamp.toISOString()}","${e.context || ''}","${e.resolved}"`
          )
        ].join('\n');

        return csvContent;
      },

      getProcessStats: () => {
        const processes = get().processes;
        const completed = processes.filter(p => p.status === 'completed').length;
        const failed = processes.filter(p => p.status === 'failed').length;
        const running = processes.filter(p => p.status === 'running').length;
        
        const completedProcesses = processes.filter(p => p.endTime);
        const avgDuration = completedProcesses.length > 0 
          ? completedProcesses.reduce((acc, p) => 
              acc + (p.endTime!.getTime() - p.startTime.getTime()), 0
            ) / completedProcesses.length 
          : 0;

        return {
          total: processes.length,
          completed,
          failed,
          running,
          avgDuration
        };
      },

      getErrorStats: () => {
        const errors = get().errors;
        const resolved = errors.filter(e => e.resolved).length;
        const critical = errors.filter(e => e.severity === 'critical').length;
        
        const byType = errors.reduce((acc, e) => {
          acc[e.type] = (acc[e.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        return {
          total: errors.length,
          resolved,
          critical,
          byType
        };
      }
    }),
    {
      name: 'karol-core-process-store',
      partialize: (state) => ({
        processes: state.processes.slice(-100), // Keep last 100 processes
        errors: state.errors.slice(-50) // Keep last 50 errors
      })
    }
  )
);
