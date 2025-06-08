
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Search, ChevronLeft, ChevronRight, RefreshCw, 
  Menu, ZoomIn, ZoomOut, ExternalLink 
} from 'lucide-react';
import { BrowserState } from '@/types/browser';

interface BrowserNavigationProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  onExtractLinks: () => void;
  onMenuToggle: () => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onReload: () => void;
  onZoomChange: (delta: number) => void;
  onOpenInNewTab: () => void;
  browserState: BrowserState;
}

const BrowserNavigation = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  onExtractLinks,
  onMenuToggle,
  onGoBack,
  onGoForward,
  onReload,
  onZoomChange,
  onOpenInNewTab,
  browserState
}: BrowserNavigationProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-dark border-b border-slate-700 p-3 md:p-4">
      <div className="flex items-center space-x-2 md:space-x-4">
        <Button
          onClick={onMenuToggle}
          variant="ghost"
          size="sm"
          className="md:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div className="hidden md:flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onGoBack}
            disabled={!browserState.canGoBack}
            className="hover:bg-gradient-secondary/20"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onGoForward}
            disabled={!browserState.canGoForward}
            className="hover:bg-gradient-secondary/20"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReload}
            className="hover:bg-gradient-secondary/20"
          >
            <RefreshCw className={`h-4 w-4 ${browserState.isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="flex-1 flex items-center space-x-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            placeholder={t('browser.urlPlaceholder')}
            className="bg-slate-900 border-slate-600 text-white text-sm focus:border-cyan-400 transition-colors"
          />
          <Button 
            onClick={onSearch} 
            size="sm" 
            className="bg-gradient-primary hover:bg-gradient-secondary px-2 md:px-3 hover-gradient-scale"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button 
            onClick={onExtractLinks} 
            variant="outline" 
            size="sm" 
            className="border-green-500/50 text-green-400 hover:bg-gradient-success/20 px-2 md:px-3 hover-gradient-scale"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {browserState.currentUrl && (
          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onZoomChange(-10)}
              disabled={browserState.zoomLevel <= 50}
              className="hover:bg-gradient-secondary/20"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs text-slate-400 w-12 text-center">
              {browserState.zoomLevel}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onZoomChange(10)}
              disabled={browserState.zoomLevel >= 200}
              className="hover:bg-gradient-secondary/20"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenInNewTab}
              title={t('browser.openInNewTab')}
              className="hover:bg-gradient-secondary/20"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowserNavigation;
