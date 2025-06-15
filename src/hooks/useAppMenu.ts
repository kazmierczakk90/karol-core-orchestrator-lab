
import { useState } from 'react';

export const useAppMenu = () => {
  const [activeOpenAITab, setActiveOpenAITab] = useState('chat');
  const [activeDataTab, setActiveDataTab] = useState('system-agents');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<'openai' | 'data'>('openai');

  return {
    activeOpenAITab,
    setActiveOpenAITab,
    activeDataTab,
    setActiveDataTab,
    mobileMenuOpen,
    setMobileMenuOpen,
    activeGroup,
    setActiveGroup,
  };
};
