
import { useState } from 'react';

export const useAppMenu = () => {
  const [activeOpenAITab, setActiveOpenAITab] = useState('chat');
  const [activeDataTab, setActiveDataTab] = useState('system-agents');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<'openai' | 'data'>('openai');

  const setActiveOpenAITabWithClose = (tab: string) => {
    setActiveOpenAITab(tab);
    setMobileMenuOpen(false); // Auto-hide menu on selection
  };

  const setActiveDataTabWithClose = (tab: string) => {
    setActiveDataTab(tab);
    setMobileMenuOpen(false); // Auto-hide menu on selection
  };

  const setActiveGroupWithClose = (group: 'openai' | 'data') => {
    setActiveGroup(group);
    setMobileMenuOpen(false); // Auto-hide menu on selection
  };

  return {
    activeOpenAITab,
    setActiveOpenAITab: setActiveOpenAITabWithClose,
    activeDataTab,
    setActiveDataTab: setActiveDataTabWithClose,
    mobileMenuOpen,
    setMobileMenuOpen,
    activeGroup,
    setActiveGroup: setActiveGroupWithClose,
  };
};
