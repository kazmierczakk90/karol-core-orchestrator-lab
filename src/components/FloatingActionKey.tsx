import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Zap, 
  Globe, 
  Bot, 
  Users,
  Link, 
  Settings, 
  X,
  ChevronUp,
  Keyboard
} from 'lucide-react';

interface FloatingActionKeyProps {
  onExtractLinks: () => void;
  onOpenBrowser: () => void;
  onOpenMiniAI: () => void;
  onOpenCommander: () => void;
}

const FloatingActionKey = ({ 
  onExtractLinks, 
  onOpenBrowser, 
  onOpenMiniAI,
  onOpenCommander 
}: FloatingActionKeyProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showKeyboardHints, setShowKeyboardHints] = useState(false);

  const quickActions = [
    {
      icon: Users,
      label: 'Agent Commander',
      shortcut: 'Alt+F1',
      color: 'bg-cyan-600 hover:bg-cyan-700',
      action: onOpenCommander
    },
    {
      icon: Globe,
      label: 'Open Browser',
      shortcut: 'Alt+F2',
      color: 'bg-blue-600 hover:bg-blue-700',
      action: onOpenBrowser
    },
    {
      icon: Bot,
      label: 'Mini AI Hub',
      shortcut: 'Alt+F3',
      color: 'bg-purple-600 hover:bg-purple-700',
      action: onOpenMiniAI
    },
    {
      icon: Link,
      label: 'Extract Links',
      shortcut: 'Alt+F4',
      color: 'bg-green-600 hover:bg-green-700',
      action: onExtractLinks
    }
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) {
        if (event.code === 'Space') {
          setIsExpanded(!isExpanded);
        } else if (event.code === 'F1') {
          onOpenCommander();
        } else if (event.code === 'F2') {
          onOpenBrowser();
        } else if (event.code === 'F3') {
          onOpenMiniAI();
        } else if (event.code === 'F4') {
          onExtractLinks();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded, onOpenCommander, onOpenBrowser, onOpenMiniAI, onExtractLinks]);

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
        {/* Keyboard Shortcuts Hint */}
        {showKeyboardHints && (
          <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg p-3 text-xs text-slate-300 max-w-xs">
            <div className="font-semibold text-cyan-400 mb-2">Quick Actions:</div>
            {quickActions.map((action, index) => (
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
            {quickActions.map((action, index) => {
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
