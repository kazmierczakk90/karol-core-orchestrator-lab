
import { useEffect } from 'react';

interface KeyboardShortcutsConfig {
  onMenuSwitch?: (level: 1 | 2) => void;
  onSearch?: () => void;
  onEscape?: () => void;
  onQuickAction?: (action: string) => void;
}

export const useKeyboardShortcuts = (config: KeyboardShortcutsConfig) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in input/textarea
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return;
      }

      // Menu switching
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            config.onMenuSwitch?.(1);
            break;
          case '2':
            event.preventDefault();
            config.onMenuSwitch?.(2);
            break;
        }
      }

      // Search focus
      if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        config.onSearch?.();
      }

      // Escape key
      if (event.key === 'Escape') {
        config.onEscape?.();
      }

      // Quick actions
      if (event.altKey) {
        switch (event.key) {
          case 's':
            event.preventDefault();
            config.onQuickAction?.('scraper');
            break;
          case 't':
            event.preventDefault();
            config.onQuickAction?.('templates');
            break;
          case 'a':
            event.preventDefault();
            config.onQuickAction?.('analytics');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [config]);
};
