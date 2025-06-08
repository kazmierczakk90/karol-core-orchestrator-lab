
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { Globe, History, Star, Link, X } from 'lucide-react';
import { NavigationHistory } from '@/types/browser';

interface ExtractedLink {
  url: string;
  title: string;
  domain: string;
}

interface BrowserSidebarProps {
  collapsed: boolean;
  mobileMenuOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onNavigate: (url: string) => void;
  history: NavigationHistory[];
  bookmarks: Array<{ title: string; url: string }>;
  extractedLinks: ExtractedLink[];
}

const BrowserSidebar = ({
  collapsed,
  mobileMenuOpen,
  onToggleCollapse,
  onCloseMobile,
  onNavigate,
  history,
  bookmarks,
  extractedLinks
}: BrowserSidebarProps) => {
  const { t } = useTranslation();

  return (
    <div className={`${
      collapsed ? 'w-16' : 'w-64'
    } ${
      mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
    } md:translate-x-0 transition-all duration-300 bg-gradient-dark border-r border-slate-700 flex flex-col fixed md:relative z-50 h-full`}>
      
      <div className="p-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            size="sm"
            className="flex items-center hover:bg-gradient-secondary/20"
          >
            <Globe className="h-4 w-4" />
            {!collapsed && <span className="ml-2">{t('browser.title')}</span>}
          </Button>
          <Button
            onClick={onCloseMobile}
            variant="ghost"
            size="sm"
            className="md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!collapsed && (
        <>
          <div className="px-4 pb-4">
            <h3 className="text-sm font-medium text-slate-300 mb-2">{t('browser.history')}</h3>
            <div className="space-y-1">
              {history.slice(-5).map((item, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate(item.url)}
                  className="w-full text-left p-2 text-xs text-slate-400 hover:text-white hover:bg-gradient-secondary/20 rounded truncate transition-all duration-200"
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 pb-4">
            <h3 className="text-sm font-medium text-slate-300 mb-2">{t('browser.bookmarks')}</h3>
            <div className="space-y-1">
              {bookmarks.map((bookmark, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate(bookmark.url)}
                  className="w-full text-left p-2 text-xs text-slate-400 hover:text-white hover:bg-gradient-secondary/20 rounded transition-all duration-200"
                >
                  <Star className="h-3 w-3 inline mr-1" />
                  {bookmark.title}
                </button>
              ))}
            </div>
          </div>

          {extractedLinks.length > 0 && (
            <div className="px-4 pb-4">
              <h3 className="text-sm font-medium text-slate-300 mb-2">{t('browser.extractedLinks')}</h3>
              <div className="space-y-1">
                {extractedLinks.slice(0, 5).map((link, index) => (
                  <button
                    key={index}
                    onClick={() => onNavigate(link.url)}
                    className="w-full text-left p-2 text-xs text-slate-400 hover:text-white hover:bg-gradient-secondary/20 rounded transition-all duration-200"
                  >
                    <Link className="h-3 w-3 inline mr-1" />
                    {link.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrowserSidebar;
