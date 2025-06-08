
import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { Globe, RefreshCw, AlertTriangle } from 'lucide-react';
import { BrowserState } from '@/types/browser';
import VisualElementInspector from './VisualElementInspector';

interface ExtractedLink {
  url: string;
  title: string;
  domain: string;
}

interface SelectedElement {
  selector: string;
  tag: string;
  text: string;
  attributes: Record<string, string>;
}

interface BrowserContentProps {
  browserState: BrowserState;
  extractedLinks: ExtractedLink[];
  onIframeError: () => void;
  onClearError: () => void;
  onOpenInNewTab: () => void;
  visualInspectMode?: boolean;
  onToggleVisualInspect?: () => void;
  onElementSelected?: (element: SelectedElement) => void;
}

const BrowserContent = ({
  browserState,
  extractedLinks,
  onIframeError,
  onClearError,
  onOpenInNewTab,
  visualInspectMode = false,
  onToggleVisualInspect,
  onElementSelected
}: BrowserContentProps) => {
  const { t, tArray } = useTranslation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const browserFeatures = tArray('browser.features');

  return (
    <div className="flex-1 bg-gradient-dark p-3 md:p-6 relative">
      <Card className="h-full bg-gradient-dark border-slate-700 hover-gradient-scale">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gradient-primary flex items-center space-x-2 text-sm md:text-base">
              <Globe className="h-4 w-4 md:h-5 md:w-5" />
              <span className="truncate">{browserState.currentUrl || t('browser.title')}</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={`border-green-500/50 text-green-400 text-xs ${browserState.isLoading ? 'animate-pulse' : ''}`}>
                {browserState.isLoading ? t('common.loading') : t('status.ready')}
              </Badge>
              {extractedLinks.length > 0 && (
                <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-xs">
                  {extractedLinks.length} linków
                </Badge>
              )}
              {visualInspectMode && (
                <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 text-xs animate-pulse">
                  Visual Inspector Active
                </Badge>
              )}
            </div>
          </div>
          {browserState.isLoading && (
            <div className="mt-2">
              <Progress value={browserState.loadingProgress} className="h-1" />
            </div>
          )}
        </CardHeader>
        <CardContent className="h-full pb-6">
          {browserState.error && (
            <Alert className="mb-4 border-red-500/50 bg-gradient-error/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-400">
                {t('browser.errorLoading')}
                <Button
                  onClick={onOpenInNewTab}
                  variant="link"
                  size="sm"
                  className="ml-2 text-red-300 hover:text-red-100"
                >
                  {t('browser.openInNewTab')}
                </Button>
                <Button
                  onClick={onClearError}
                  variant="link"
                  size="sm"
                  className="ml-2 text-red-300 hover:text-red-100"
                >
                  {t('common.close')}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {browserState.isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <RefreshCw className="h-6 w-6 md:h-8 md:w-8 animate-spin mx-auto mb-4 text-cyan-400" />
                <p className="text-slate-400 text-sm">{t('browser.loadingContent')}</p>
                <p className="text-slate-500 text-xs mt-2">{browserState.loadingProgress}%</p>
              </div>
            </div>
          ) : browserState.currentUrl ? (
            <div className="h-full bg-white rounded border border-slate-600 overflow-hidden relative">
              <iframe
                ref={iframeRef}
                src={browserState.currentUrl}
                className="w-full h-full"
                title="Browser Content"
                style={{ 
                  transform: `scale(${browserState.zoomLevel / 100})`,
                  transformOrigin: 'top left',
                  width: `${10000 / browserState.zoomLevel}%`,
                  height: `${10000 / browserState.zoomLevel}%`
                }}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation-by-user-activation"
                onError={onIframeError}
                onLoad={() => {
                  console.log('Iframe loaded successfully');
                }}
              />
              
              {/* Visual Element Inspector */}
              {visualInspectMode && onToggleVisualInspect && onElementSelected && (
                <VisualElementInspector
                  isActive={visualInspectMode}
                  onToggle={onToggleVisualInspect}
                  onElementSelected={onElementSelected}
                  iframeRef={iframeRef}
                />
              )}
            </div>
          ) : (
            <div className="h-full bg-gradient-dark rounded border border-slate-600 p-4 md:p-6">
              <div className="text-center text-slate-400 space-y-4">
                <Globe className="h-12 w-12 md:h-16 md:w-16 mx-auto opacity-50 animate-pulse-glow" />
                <h3 className="text-base md:text-lg font-medium text-gradient-primary">Browser Core Ready</h3>
                <p className="text-sm">Wpisz URL lub hasło wyszukiwania, aby rozpocząć przeglądanie</p>
                <div className="text-xs md:text-sm text-slate-500 space-y-2">
                  {browserFeatures.map((feature, index) => (
                    <p key={index}>• {feature}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BrowserContent;
