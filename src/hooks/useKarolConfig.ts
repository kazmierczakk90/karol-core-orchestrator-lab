
import { useState, useCallback, useEffect } from 'react';
import { karolConfigService } from '@/services/karolConfigService';
import type { PlatformConfig } from '@/types/karolConfig';
import { toast } from 'sonner';

export const useKarolConfig = () => {
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const loadConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await karolConfigService.getConfig();
      setConfig(data || karolConfigService.getDefaultConfig());
    } catch (error) {
      console.error('Error loading config:', error);
      setConfig(karolConfigService.getDefaultConfig());
      toast.error('Error loading config, using defaults');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateConfig = useCallback(async (key: string, value: any) => {
    try {
      const success = await karolConfigService.updateConfig(key, value);
      if (success) {
        setConfig(prev => prev ? { ...prev, [key]: value } : null);
        setHasChanges(true);
        toast.success('Configuration updated');
        return true;
      } else {
        toast.error('Failed to update configuration');
        return false;
      }
    } catch (error) {
      console.error('Error updating config:', error);
      toast.error('Error updating configuration');
      return false;
    }
  }, []);

  const createBackup = useCallback(async () => {
    try {
      const backup = await karolConfigService.createBackup();
      if (backup) {
        // Trigger download
        const blob = new Blob([backup], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `karolconfig_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success('Configuration backup created');
        return backup;
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Error creating backup');
      return null;
    }
  }, []);

  const exportConfig = useCallback(async () => {
    try {
      const exported = await karolConfigService.exportConfig();
      if (exported) {
        // Trigger download
        const blob = new Blob([exported], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'karolconfig.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success('Configuration exported');
        return exported;
      }
    } catch (error) {
      console.error('Error exporting config:', error);
      toast.error('Error exporting configuration');
      return null;
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return {
    config,
    isLoading,
    hasChanges,
    loadConfig,
    updateConfig,
    createBackup,
    exportConfig
  };
};
