import { useState, useEffect } from 'react';
import { useGlobalStore } from '@/stores/globalStore';
import { useProcessStore } from '@/stores/processStore';
import { useGlobalKeyboardShortcuts } from '@/hooks/useGlobalKeyboardShortcuts';
import { useGlobalSaveKeys } from '@/hooks/useGlobalSaveKeys';
import MenuLevelManager from '@/components/MenuLevelManager';
import FloatingActionKey from '@/components/FloatingActionKey';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';
import TrainingCallModal from '@/components/TrainingCallModal';
import { useDraftManager } from '@/hooks/useDraftManager';
import { toast } from '@/components/ui/sonner';
import { 
  MessageSquare, 
  Users, 
  Workflow, 
  Network, 
  Globe, 
  Database, 
  Bot, 
  Brain, 
  Link2, 
  Table, 
  Wrench, 
  Palette, 
  TrendingUp, 
  Calendar, 
  Store, 
  Download 
} from 'lucide-react';

const Index = () => {
  const {
    menuLevel,
    activeOpenAITab,
    activeDataTab,
    extractedLinks,
    setMenuLevel,
    setActiveOpenAITab,
    setActiveDataTab
  } = useGlobalStore();

  const { addProcess } = useProcessStore();

  const [collapsedMenus, setCollapsedMenus] = useState({
    openai: false,
    data: false,
  });
  const [showTrainingCallModal, setShowTrainingCallModal] = useState(false);

  // Initialize Flash Memory for main app state
  const {
    data: appState,
    updateData: updateAppState,
    hasUnsavedChanges,
    saveDraft,
    saveStatus
  } = useDraftManager(
    { 
      lastActiveTab: activeOpenAITab,
      lastMenuLevel: menuLevel,
      lastDataTab: activeDataTab
    },
    {
      tabKey: 'main_app',
      componentName: 'Index',
      autoSaveInterval: 15000, // 15 seconds
      showRecoveryToast: true
    }
  );

  // Update app state when user changes tabs
  useEffect(() => {
    updateAppState({
      lastActiveTab: activeOpenAITab,
      lastMenuLevel: menuLevel,
      lastDataTab: activeDataTab
    });
  }, [activeOpenAITab, menuLevel, activeDataTab, updateAppState]);

  const openAITabs = [
    { value: 'chat', label: 'Chat', icon: MessageSquare },
    { value: 'commander', label: 'Komandor', icon: Users },
    { value: 'workflow', label: 'Workflow', icon: Workflow },
    { value: 'orchestrator', label: 'Orkiestra', icon: Network },
    { value: 'browser', label: 'Browser', icon: Globe }
  ];

  const dataTabs = [
    { value: 'system-agents', label: 'Agenci', icon: Database },
    { value: 'mini-ai', label: 'Mini AI', icon: Bot },
    { value: 'memory', label: 'Pamięć', icon: Brain },
    { value: 'connections', label: 'Połączenia', icon: Link2 },
    { value: 'url-scrap', label: 'URL Table', icon: Table },
    { value: 'smart-scraper', label: 'Scraper', icon: Wrench },
    { value: 'template-gallery', label: 'Szablony', icon: Palette },
    { value: 'analytics', label: 'Analityka', icon: TrendingUp },
    { value: 'scheduler', label: 'Harmonogram', icon: Calendar },
    { value: 'marketplace', label: 'Rynek', icon: Store },
    { value: 'export', label: 'Eksport', icon: Download }
  ];

  const toggleCollapse = (menuKey: string) => {
    setCollapsedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const handleExtractLinks = () => {
    const processId = addProcess({
      type: 'extraction',
      status: 'running',
      title: 'Ekstrakcja linków z aktywnej strony',
      description: 'Wydobywanie wszystkich linków',
      progress: 0
    });

    // Trigger link extraction via keyboard shortcut system
    setTimeout(() => {
      addProcess({
        type: 'extraction',
        status: 'completed',
        title: 'Ekstrakcja linków ukończona',
        description: `Znaleziono ${extractedLinks.length} linków`,
        progress: 100
      });
    }, 2000);
  };

  const handleOpenTrainingCall = () => {
    setShowTrainingCallModal(true);
    addProcess({
      type: 'navigation',
      status: 'completed',
      title: 'Otwarto Training Call',
      description: 'Uruchomiono modal szkoleniowy',
      progress: 100
    });
  };

  // Global keyboard shortcuts
  useGlobalKeyboardShortcuts({
    onExtractLinks: handleExtractLinks,
    onOpenTrainingCall: handleOpenTrainingCall
  });

  // Global save keys
  useGlobalSaveKeys({
    hasUnsavedChanges,
    onSave: saveDraft,
    canSave: true
  });

  const handleLinksExtracted = (links: any[]) => {
    addProcess({
      type: 'extraction',
      status: 'completed',
      title: 'Nowe linki wyekstraktowane',
      description: `Dodano ${links.length} nowych linków`,
      progress: 100,
      metadata: { linksCount: links.length }
    });
  };

  // Show save status
  useEffect(() => {
    if (saveStatus === 'saved') {
      console.log('App state auto-saved');
    }
  }, [saveStatus]);

  return (
    <div className="min-h-screen bg-gradient-dark text-white flex flex-col">
      {/* Save Status Indicator */}
      {hasUnsavedChanges && (
        <div className="fixed top-4 right-4 z-40 bg-yellow-500/20 border border-yellow-500/50 rounded px-3 py-1 text-xs text-yellow-400">
          Niezapisane zmiany • Ctrl+S aby zapisać
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <MenuLevelManager
          menuLevel={menuLevel}
          collapsedMenus={collapsedMenus}
          toggleCollapse={toggleCollapse}
          activeOpenAITab={activeOpenAITab}
          setActiveOpenAITab={setActiveOpenAITab}
          activeDataTab={activeDataTab}
          setActiveDataTab={setActiveDataTab}
          openAITabs={openAITabs}
          dataTabs={dataTabs}
          extractedLinks={extractedLinks}
          showTrainingCallModal={showTrainingCallModal}
          setShowTrainingCallModal={setShowTrainingCallModal}
          onLinksExtracted={handleLinksExtracted}
          onMenuLevelChange={setMenuLevel}
        />
      </div>

      <FloatingActionKey
        onExtractLinks={handleExtractLinks}
        onOpenBrowser={() => {
          setActiveOpenAITab('browser');
          setMenuLevel(1);
        }}
        onOpenMiniAI={() => {
          setActiveDataTab('mini-ai');
          setMenuLevel(2);
        }}
        onOpenCommander={() => {
          setActiveOpenAITab('commander');
          setMenuLevel(1);
        }}
        onOpenTrainingCall={handleOpenTrainingCall}
      />

      <KeyboardShortcuts />

      <TrainingCallModal 
        isOpen={showTrainingCallModal}
        onClose={() => setShowTrainingCallModal(false)}
      />
    </div>
  );
};

export default Index;
