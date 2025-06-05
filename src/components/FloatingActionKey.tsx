
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Bot, Search, Link, Map, Command, X, Zap, MessageSquare } from 'lucide-react';

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  shortcut: string;
  action: () => void;
  color: string;
}

interface FloatingActionKeyProps {
  onExtractLinks?: () => void;
  onOpenBrowser?: () => void;
  onOpenMiniAI?: () => void;
}

const FloatingActionKey = ({ onExtractLinks, onOpenBrowser, onOpenMiniAI }: FloatingActionKeyProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Check if mobile and set initial position
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setPosition({ x: window.innerWidth - 70, y: window.innerHeight - 150 });
      } else {
        setPosition({ x: window.innerWidth - 80, y: window.innerHeight / 2 });
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const quickActions: QuickAction[] = [
    {
      id: 'brain',
      icon: <Brain className="h-4 w-4" />,
      label: 'AGI Core',
      shortcut: 'Alt+F1',
      action: () => {
        console.log('AGI Core activated');
        const agiTab = document.querySelector('[value="agi-core"]') as HTMLButtonElement;
        if (agiTab) agiTab.click();
      },
      color: 'bg-cyan-500'
    },
    {
      id: 'mini-ai',
      icon: <Bot className="h-4 w-4" />,
      label: 'Mini AI',
      shortcut: 'Alt+F2',
      action: () => {
        console.log('Mini AI activated');
        onOpenMiniAI?.();
        const miniAITab = document.querySelector('[value="mini-ai"]') as HTMLButtonElement;
        if (miniAITab) miniAITab.click();
      },
      color: 'bg-purple-500'
    },
    {
      id: 'browser',
      icon: <Search className="h-4 w-4" />,
      label: 'Browser',
      shortcut: 'Alt+F3',
      action: () => {
        console.log('Browser activated');
        onOpenBrowser?.();
        const browserTab = document.querySelector('[value="browser-core"]') as HTMLButtonElement;
        if (browserTab) browserTab.click();
      },
      color: 'bg-blue-500'
    },
    {
      id: 'links',
      icon: <Link className="h-4 w-4" />,
      label: 'Extract Links',
      shortcut: 'Alt+F4',
      action: () => {
        console.log('Link extraction activated');
        onExtractLinks?.();
        const linkTab = document.querySelector('[value="link-collector"]') as HTMLButtonElement;
        if (linkTab) linkTab.click();
        
        // Show notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white p-3 rounded-lg shadow-lg z-50 max-w-sm';
        notification.innerHTML = `
          <div class="font-bold text-sm">Ekstrakcja Linków</div>
          <div class="text-xs">Rozpoczynam ekstrakcję linków z aktualnej strony...</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 4000);
      },
      color: 'bg-green-500'
    },
    {
      id: 'mindmap',
      icon: <Map className="h-4 w-4" />,
      label: 'Mind Maps',
      shortcut: 'Alt+F5',
      action: () => {
        console.log('Mind Maps activated');
        const mindMapTab = document.querySelector('[value="mind-maps"]') as HTMLButtonElement;
        if (mindMapTab) mindMapTab.click();
      },
      color: 'bg-orange-500'
    },
    {
      id: 'command',
      icon: <Command className="h-4 w-4" />,
      label: 'Command Room',
      shortcut: 'Alt+F6',
      action: () => {
        console.log('Command Room activated');
      },
      color: 'bg-red-500'
    }
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(window.innerWidth - 60, e.clientX - dragOffset.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragOffset({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches[0]) {
      e.preventDefault();
      const touch = e.touches[0];
      const newX = Math.max(0, Math.min(window.innerWidth - 60, touch.clientX - dragOffset.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 60, touch.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragOffset]);

  // Keyboard shortcuts (only for desktop)
  useEffect(() => {
    if (isMobile) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch (e.key) {
          case 'F1':
            e.preventDefault();
            quickActions.find(a => a.id === 'brain')?.action();
            break;
          case 'F2':
            e.preventDefault();
            quickActions.find(a => a.id === 'mini-ai')?.action();
            break;
          case 'F3':
            e.preventDefault();
            quickActions.find(a => a.id === 'browser')?.action();
            break;
          case 'F4':
            e.preventDefault();
            quickActions.find(a => a.id === 'links')?.action();
            break;
          case 'F5':
            e.preventDefault();
            quickActions.find(a => a.id === 'mindmap')?.action();
            break;
          case 'F6':
            e.preventDefault();
            quickActions.find(a => a.id === 'command')?.action();
            break;
          case '`':
            e.preventDefault();
            setIsExpanded(!isExpanded);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, isMobile]);

  return (
    <>
      {/* Main Floating Button */}
      <div
        className={`fixed z-50 transition-all duration-300 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${isMobile ? 'touch-manipulation' : ''}`}
        style={{ left: position.x, top: position.y }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`${isMobile ? 'w-12 h-12' : 'w-14 h-14'} rounded-full shadow-lg transition-all duration-300 ${
            isExpanded 
              ? 'bg-red-600 hover:bg-red-700 rotate-45' 
              : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600'
          }`}
        >
          {isExpanded ? <X className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} /> : <Zap className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />}
        </Button>

        {/* Tooltip for main button (desktop only) */}
        {!isExpanded && !isMobile && (
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
            Karol Core Quick Actions (Alt + `)
          </div>
        )}
      </div>

      {/* Expanded Action Panel */}
      {isExpanded && (
        <div 
          className="fixed z-40 transition-all duration-300"
          style={{ 
            left: isMobile ? Math.max(10, position.x - 280) : Math.max(10, position.x - 300), 
            top: isMobile ? Math.max(10, position.y - 150) : Math.max(10, position.y - 200),
            maxWidth: 'calc(100vw - 20px)',
            maxHeight: 'calc(100vh - 20px)'
          }}
        >
          <Card className="bg-slate-800/95 border-cyan-500/30 backdrop-blur-sm shadow-xl">
            <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-white font-medium text-sm">Karol Core</h3>
                </div>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 text-xs">
                  Quick Actions
                </Badge>
              </div>
              
              <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-2 gap-3'}`}>
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    onClick={() => {
                      action.action();
                      setIsExpanded(false);
                    }}
                    variant="outline"
                    className={`${isMobile ? 'h-14' : 'h-16'} flex flex-col items-center justify-center space-y-1 border-slate-600 hover:border-cyan-500/50 transition-all`}
                  >
                    <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full ${action.color} flex items-center justify-center`}>
                      {action.icon}
                    </div>
                    <span className="text-xs text-slate-300">{action.label}</span>
                    {!isMobile && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {action.shortcut.replace('Alt+', '')}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{isMobile ? 'Przeciągnij' : 'Przeciągnij, aby przenieść'}</span>
                  {!isMobile && <span>Alt + ` aby zamknąć</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Background overlay when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
};

export default FloatingActionKey;
