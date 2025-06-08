
import { useState, useEffect, useCallback } from 'react';
import { DraftEntry } from '@/types/common';
import { toast } from '@/components/ui/sonner';

interface DraftManagerOptions {
  tabKey: string;
  componentName: string;
  autoSaveInterval?: number;
  showRecoveryToast?: boolean;
}

export const useDraftManager = <T extends Record<string, any>>(
  initialData: T,
  options: DraftManagerOptions
) => {
  const [data, setData] = useState<T>(initialData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const storageKey = `draft_${options.tabKey}_${options.componentName}`;
  const autoSaveInterval = options.autoSaveInterval || 10000; // 10 seconds

  // Load draft on mount
  useEffect(() => {
    try {
      const savedDraft = sessionStorage.getItem(storageKey);
      if (savedDraft) {
        const parsed: DraftEntry = JSON.parse(savedDraft);
        setData(parsed.data);
        setLastSaved(new Date(parsed.lastSaved));
        setHasUnsavedChanges(!parsed.autoSaved);
        
        if (options.showRecoveryToast) {
          toast.success('Przywrócono niezapisane zmiany', {
            description: `Ostatni zapis: ${new Date(parsed.lastSaved).toLocaleTimeString('pl')}`,
            action: {
              label: 'Odrzuć',
              onClick: () => clearDraft()
            }
          });
        }
      }
    } catch (error) {
      console.error('Błąd ładowania draftu:', error);
    }
  }, [storageKey]);

  // Auto-save mechanism
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const autoSaveTimer = setTimeout(() => {
      saveDraft(true);
    }, autoSaveInterval);

    return () => clearTimeout(autoSaveTimer);
  }, [data, hasUnsavedChanges, autoSaveInterval]);

  const saveDraft = useCallback((isAutoSave = false) => {
    try {
      if (isAutoSave) setIsAutoSaving(true);

      const draftEntry: DraftEntry = {
        id: `${Date.now()}`,
        tabKey: options.tabKey,
        componentName: options.componentName,
        data,
        lastSaved: new Date(),
        autoSaved: isAutoSave
      };

      sessionStorage.setItem(storageKey, JSON.stringify(draftEntry));
      setLastSaved(new Date());
      setHasUnsavedChanges(false);

      if (isAutoSave) {
        setTimeout(() => setIsAutoSaving(false), 1000);
        toast.info('Auto-zapis wykonany', {
          description: `Zapisano o ${new Date().toLocaleTimeString('pl')}`
        });
      } else {
        toast.success('Zmiany zapisane pomyślnie');
      }
    } catch (error) {
      console.error('Błąd zapisywania draftu:', error);
      toast.error('Błąd zapisu zmian');
    }
  }, [data, options, storageKey]);

  const clearDraft = useCallback(() => {
    try {
      sessionStorage.removeItem(storageKey);
      setData(initialData);
      setHasUnsavedChanges(false);
      setLastSaved(null);
      toast.info('Draft usunięty');
    } catch (error) {
      console.error('Błąd usuwania draftu:', error);
    }
  }, [storageKey, initialData]);

  const updateData = useCallback((newData: Partial<T> | ((prev: T) => T)) => {
    setData(prev => {
      const updated = typeof newData === 'function' ? newData(prev) : { ...prev, ...newData };
      setHasUnsavedChanges(true);
      return updated;
    });
  }, []);

  const forceSave = useCallback(() => {
    saveDraft(false);
  }, [saveDraft]);

  return {
    data,
    updateData,
    hasUnsavedChanges,
    lastSaved,
    isAutoSaving,
    saveDraft: forceSave,
    clearDraft,
    saveStatus: hasUnsavedChanges ? 'unsaved' : lastSaved ? 'saved' : 'clean'
  };
};
