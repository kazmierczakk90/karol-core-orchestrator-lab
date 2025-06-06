
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
  Keyboard,
  Phone
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

  const quickActions = [
    { 
      key: 'E', 
      action: onExtractLinks, 
      label: 'Extract Links', 
      icon: Link,
      shortcut: 'Alt+F4',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    { 
      key: 'B', 
      action: onOpenBrowser, 
      label: 'Open Browser', 
      icon: Globe,
      shortcut: 'Alt+F2',
      color: 'bg-green-500 hover:bg-green-600'
    },
    { 
      key: 'M', 
      action: onOpenMiniAI, 
      label: 'Mini AI', 
      icon: Bot,
      shortcut: 'Alt+F3',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    { 
      key: 'C', 
      action: onOpenCommander, 
      label: 'Commander', 
      icon: Users,
      shortcut: 'Alt+F1',
      color: 'bg-cyan-500 hover:bg-cyan-600'
    },
    { 
      key: 'T', 
      action: onOpenTrainingCall, 
      label: 'Training Call', 
      icon: Phone,
      shortcut: 'Alt+F5',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ].filter(action => action.action); // Filter out undefined actions

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
