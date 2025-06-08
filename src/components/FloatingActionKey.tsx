
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useGlobalStore } from '@/stores/globalStore';
import { 
  Zap, 
  Globe, 
  Bot, 
  Users,
  Link, 
  X,
  ChevronUp,
  Keyboard,
  Phone,
  Eye,
  FileText,
  Download
} from 'lucide-react';

interface FloatingActionKeyProps {
  onExtractLinks: () => void;
  onOpenBrowser: () => void;
  onOpenMiniAI: () => void;
  onOpenCommander: () => void;
  onOpenTrainingCall?: () => void;
}

const FloatingActionKey = ({ 
  onExtractLinks, 
  onOpenBrowser, 
  onOpenMiniAI, 
  onOpenCommander,
  onOpenTrainingCall 
}: FloatingActionKeyProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showKeyboardHints, setShowKeyboardHints] = useState(false);

  const {
    menuLevel,
    activeOpenAITab,
    activeDataTab,
    visualInspectMode,
    selectedElements,
    extractedLinks,
    setVisualInspectMode,
    setActiveDataTab,
    setMenuLevel,
    getContextualActions
  } = useGlobalStore();

  // Get context-aware actions
  const contextualActions = getContextualActions();

  // Base actions that are always available
  const baseActions = [
    { 
      key: 'E', 
      action: onExtractLinks, 
      label: 'Extract Links', 
      icon: Link,
      shortcut: 'Alt+F4',
      color: 'bg-blue-500 hover:bg-blue-600',
      condition: true
    },
    { 
      key: 'B', 
      action: onOpenBrowser, 
      label: 'Open Browser', 
      icon: Globe,
      shortcut: 'F2',
      color: 'bg-green-500 hover:bg-green-600',
      condition: true
    },
    { 
      key: 'M', 
      action: onOpenMiniAI, 
      label: 'Mini AI', 
      icon: Bot,
      shortcut: 'F3',
      color: 'bg-purple-500 hover:bg-purple-600',
      condition: true
    },
    { 
      key: 'C', 
      action: onOpenCommander, 
      label: 'Commander', 
      icon: Users,
      shortcut: 'F1',
      color: 'bg-cyan-500 hover:bg-cyan-600',
      condition: true
    },
    { 
      key: 'T', 
      action: onOpenTrainingCall, 
      label: 'Training Call', 
      icon: Phone,
      shortcut: 'Alt+F5',
      color: 'bg-orange-500 hover:bg-orange-600',
      condition: !!onOpenTrainingCall
    }
  ];

  // Context-aware actions based on current state
  const dynamicActions = [
    {
      key: 'V',
      action: () => setVisualInspectMode(!visualInspectMode),
      label: visualInspectMode ? 'Exit Visual Inspector' : 'Visual Inspector',
      icon: Eye,
      shortcut: 'Alt+V',
      color: visualInspectMode ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-500 hover:bg-indigo-600',
      condition: menuLevel === 1 && activeOpenAITab === 'browser'
    },
    {
      key: 'S',
      action: () => {
        if (selectedElements.length > 0) {
          // Create quick template
          const template = {
            id: `template_${Date.now()}`,
            name: `Quick Template ${new Date().toLocaleTimeString()}`,
            description: 'Created from visual selection',
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
          useGlobalStore.getState().clearSelectedElements();
          setActiveDataTab('template-gallery');
          setMenuLevel(2);
        }
      },
      label: 'Save Template',
      icon: FileText,
      shortcut: 'Ctrl+S',
      color: 'bg-green-500 hover:bg-green-600',
      condition: selectedElements.length > 0
    },
    {
      key: 'D',
      action: () => {
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
        }
      },
      label: 'Export Data',
      icon: Download,
      shortcut: 'Ctrl+E',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      condition: extractedLinks.length > 0
    }
  ];

  // Combine and filter actions
  const availableActions = [...baseActions, ...dynamicActions].filter(action => action.condition);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.code === 'Space') {
        event.preventDefault();
        setIsExpanded(!isExpanded);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
        {/* Context Status */}
        {isExpanded && (
          <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg p-3 text-xs text-slate-300 max-w-xs">
            <div className="font-semibold text-cyan-400 mb-2">Current Context:</div>
            <div className="space-y-1">
              <div>Level: {menuLevel === 1 ? 'OpenAI/Browser' : 'Data/Tables'}</div>
              <div>Tab: {menuLevel === 1 ? activeOpenAITab : activeDataTab}</div>
              {visualInspectMode && <div className="text-cyan-400">Visual Inspector: Active</div>}
              {selectedElements.length > 0 && (
                <div className="text-green-400">{selectedElements.length} elements selected</div>
              )}
              {extractedLinks.length > 0 && (
                <div className="text-blue-400">{extractedLinks.length} links available</div>
              )}
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Hint */}
        {showKeyboardHints && (
          <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg p-3 text-xs text-slate-300 max-w-xs">
            <div className="font-semibold text-cyan-400 mb-2">Available Shortcuts:</div>
            {availableActions.slice(0, 6).map((action, index) => (
              <div key={index} className="flex justify-between items-center mb-1">
                <span>{action.label}</span>
                <code className="bg-slate-700 px-1 rounded text-cyan-400">{action.shortcut}</code>
              </div>
            ))}
            <div className="border-t border-slate-700 mt-2 pt-2">
              <div className="flex justify-between">
                <span>Show/Hide Menu</span>
                <code className="bg-slate-700 px-1 rounded text-cyan-400">Alt+Space</code>
              </div>
            </div>
          </div>
        )}

        {/* Expanded Action Buttons */}
        {isExpanded && (
          <div className="flex flex-col space-y-2">
            {availableActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={action.action}
                      className={`${action.color} text-white shadow-lg h-12 w-12 rounded-full p-0 transition-all duration-200 hover:scale-110`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="bg-slate-800 text-slate-200 border-slate-700">
                    <div className="flex items-center space-x-2">
                      <span>{action.label}</span>
                      <code className="bg-slate-700 px-1 rounded text-xs text-cyan-400">
                        {action.shortcut}
                      </code>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}

            {/* Settings/Keyboard Hints Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setShowKeyboardHints(!showKeyboardHints)}
                  className="bg-slate-600 hover:bg-slate-700 text-white shadow-lg h-10 w-10 rounded-full p-0"
                >
                  <Keyboard className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-slate-800 text-slate-200 border-slate-700">
                Toggle Keyboard Shortcuts
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Main Toggle Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-xl h-14 w-14 rounded-full p-0 transition-all duration-300 hover:scale-110"
            >
              {isExpanded ? (
                <X className="h-6 w-6" />
              ) : (
                <div className="relative">
                  <Zap className="h-6 w-6" />
                  <ChevronUp className="h-3 w-3 absolute -top-1 -right-1 opacity-70" />
                  {/* Context indicator */}
                  {(selectedElements.length > 0 || visualInspectMode) && (
                    <div className="absolute -top-1 -left-1 h-3 w-3 bg-cyan-400 rounded-full animate-pulse" />
                  )}
                </div>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-slate-800 text-slate-200 border-slate-700">
            <div className="flex items-center space-x-2">
              <span>{isExpanded ? 'Close Menu' : 'Quick Actions'}</span>
              <code className="bg-slate-700 px-1 rounded text-xs text-cyan-400">Alt+Space</code>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default FloatingActionKey;
