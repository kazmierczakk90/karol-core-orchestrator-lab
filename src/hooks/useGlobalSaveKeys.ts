
import { useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { useGlobalStore } from '@/stores/globalStore';

interface SaveKeysConfig {
  onSave?: () => void;
  onSaveAs?: () => void;
  onQuickSave?: () => void;
  canSave?: boolean;
  hasUnsavedChanges?: boolean;
}

export const useGlobalSaveKeys = (config: SaveKeysConfig = {}) => {
  const { 
    selectedElements, 
    extractedLinks, 
    addTemplate,
    clearSelectedElements 
  } = useGlobalStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in input/textarea
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return;
      }

      // Ctrl+S - Universal Save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        
        if (config.onSave) {
          config.onSave();
        } else if (selectedElements.length > 0) {
          // Auto-create template from selected elements
          const template = {
            id: `template_${Date.now()}`,
            name: `Quick Template ${new Date().toLocaleDateString('pl')}`,
            description: 'Utworzony przez Ctrl+S',
            category: 'data-extraction',
            domains: [],
            selectors: {
              container: selectedElements[0]?.selector || '',
              item: selectedElements[0]?.selector || '',
              fields: selectedElements.reduce((acc, el, idx) => {
                acc[`field_${idx}`] = el.selector;
                return acc;
              }, {} as Record<string, string>)
            },
            preprocessing: [],
            postprocessing: [],
            isActive: true
          };
          
          addTemplate(template);
          clearSelectedElements();
          toast.success('Szablon zapisany przez Ctrl+S');
        } else if (config.hasUnsavedChanges) {
          toast.info('Ctrl+S - Brak zmian do zapisania');
        } else {
          toast.info('Ctrl+S - Uniwersalny zapis (brak aktywnych elementów)');
        }
      }

      // Ctrl+Shift+S - Save As New
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'S') {
        event.preventDefault();
        
        if (config.onSaveAs) {
          config.onSaveAs();
        } else {
          toast.info('Ctrl+Shift+S - Zapisz jako nowy');
        }
      }

      // Alt+S - Quick Save
      if (event.altKey && event.key === 's') {
        event.preventDefault();
        
        if (config.onQuickSave) {
          config.onQuickSave();
        } else {
          toast.info('Alt+S - Szybki zapis (bez potwierdzenia)');
        }
      }

      // Ctrl+E - Export data
      if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault();
        
        if (extractedLinks.length > 0) {
          const csvContent = [
            'URL,Title,Domain',
            ...extractedLinks.map(link => 
              `"${link.url}","${link.title}","${link.domain}"`
            )
          ].join('\n');
          
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `extracted_links_${Date.now()}.csv`;
          a.click();
          URL.revokeObjectURL(url);
          
          toast.success('Dane wyeksportowane przez Ctrl+E');
        } else {
          toast.info('Ctrl+E - Brak danych do eksportu');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [config, selectedElements, extractedLinks, addTemplate, clearSelectedElements]);

  return {
    saveShortcuts: {
      'Ctrl+S': 'Uniwersalny zapis',
      'Ctrl+Shift+S': 'Zapisz jako nowy',
      'Alt+S': 'Szybki zapis',
      'Ctrl+E': 'Eksportuj dane'
    }
  };
};
