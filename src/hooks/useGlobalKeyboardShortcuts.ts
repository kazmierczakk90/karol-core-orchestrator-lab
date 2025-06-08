
import { useEffect } from 'react';
import { useGlobalStore } from '@/stores/globalStore';
import { toast } from '@/components/ui/sonner';

interface KeyboardShortcutsConfig {
  onExtractLinks?: () => void;
  onOpenTrainingCall?: () => void;
}

export const useGlobalKeyboardShortcuts = (config: KeyboardShortcutsConfig = {}) => {
  const {
    menuLevel,
    activeOpenAITab,
    activeDataTab,
    visualInspectMode,
    selectedElements,
    extractedLinks,
    setMenuLevel,
    setActiveOpenAITab,
    setActiveDataTab,
    setVisualInspectMode,
    getContextualActions,
    clearSelectedElements,
    clearHistory
  } = useGlobalStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in input/textarea
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return;
      }

      // Menu switching (Ctrl+1/Ctrl+2)
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            setMenuLevel(1);
            toast.info('Switched to OpenAI/Browser Level');
            break;
          case '2':
            event.preventDefault();
            setMenuLevel(2);
            toast.info('Switched to Data/Tables Level');
            break;
          case 's':
          case 'S':
            event.preventDefault();
            if (selectedElements.length > 0) {
              const template = {
                id: `template_${Date.now()}`,
                name: `Template ${new Date().toLocaleDateString()}`,
                description: 'Auto-generated from visual selection',
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
              
              useGlobalStore.getState().addTemplate(template);
              clearSelectedElements();
              toast.success('Template saved successfully');
            }
            break;
          case 'e':
          case 'E':
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
              
              toast.success('Data exported successfully');
            }
            break;
        }
      }

      // Alt key shortcuts
      if (event.altKey) {
        switch (event.key) {
          case 'v':
          case 'V':
            event.preventDefault();
            if (activeOpenAITab === 'browser') {
              setVisualInspectMode(!visualInspectMode);
              toast.info(`Visual Inspector ${!visualInspectMode ? 'ON' : 'OFF'}`);
            }
            break;
          case 't':
          case 'T':
            event.preventDefault();
            setActiveDataTab('template-gallery');
            setMenuLevel(2);
            toast.info('Switched to Template Gallery');
            break;
          case 'f':
          case 'F':
            if (event.code === 'F4') {
              event.preventDefault();
              config.onExtractLinks?.();
            }
            break;
          case 'f':
          case 'F':
            if (event.code === 'F5') {
              event.preventDefault();
              config.onOpenTrainingCall?.();
            }
            break;
        }
      }

      // Function keys
      switch (event.key) {
        case 'F1':
          event.preventDefault();
          setActiveOpenAITab('commander');
          setMenuLevel(1);
          break;
        case 'F2':
          event.preventDefault();
          setActiveOpenAITab('browser');
          setMenuLevel(1);
          break;
        case 'F3':
          event.preventDefault();
          setActiveDataTab('mini-ai');
          setMenuLevel(2);
          break;
      }

      // Delete key
      if (event.key === 'Delete') {
        if (selectedElements.length > 0) {
          clearSelectedElements();
          toast.info('Selected elements cleared');
        }
      }

      // Escape key
      if (event.key === 'Escape') {
        if (visualInspectMode) {
          setVisualInspectMode(false);
          clearSelectedElements();
          toast.info('Visual Inspector deactivated');
        }
      }

      // Search focus (/)
      if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"], input[placeholder*="search"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    menuLevel,
    activeOpenAITab,
    activeDataTab,
    visualInspectMode,
    selectedElements,
    extractedLinks,
    config.onExtractLinks,
    config.onOpenTrainingCall
  ]);

  return {
    contextualActions: getContextualActions()
  };
};
