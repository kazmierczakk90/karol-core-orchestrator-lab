
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, X, Code, Eye, Copy, Save } from 'lucide-react';
import { useGlobalStore } from '@/stores/globalStore';
import { toast } from '@/components/ui/sonner';

interface EnhancedVisualElementInspectorProps {
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

const EnhancedVisualElementInspector = ({
  iframeRef
}: EnhancedVisualElementInspectorProps) => {
  const {
    visualInspectMode,
    selectedElements,
    setVisualInspectMode,
    addSelectedElement,
    clearSelectedElements
  } = useGlobalStore();

  const [hoveredElement, setHoveredElement] = useState<any>(null);
  const [iframeReady, setIframeReady] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const generateOptimalSelector = (element: Element): string => {
    // Priority: id > class > data attributes > tag hierarchy
    if (element.id) {
      return `#${element.id}`;
    }

    if (element.className && typeof element.className === 'string') {
      const classes = element.className.split(' ').filter(Boolean);
      if (classes.length > 0) {
        // Use the first meaningful class (not utility classes)
        const meaningfulClass = classes.find(cls => 
          !cls.startsWith('text-') && 
          !cls.startsWith('bg-') && 
          !cls.startsWith('p-') && 
          !cls.startsWith('m-') &&
          !cls.startsWith('flex') &&
          !cls.startsWith('grid')
        ) || classes[0];
        return `.${meaningfulClass}`;
      }
    }

    // Data attributes
    const dataAttrs = Array.from(element.attributes).find(attr => 
      attr.name.startsWith('data-')
    );
    if (dataAttrs) {
      return `[${dataAttrs.name}="${dataAttrs.value}"]`;
    }

    // Role or other semantic attributes
    if (element.getAttribute('role')) {
      return `[role="${element.getAttribute('role')}"]`;
    }

    // Tag with nth-child if needed
    const parent = element.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(child => 
        child.tagName === element.tagName
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(element) + 1;
        return `${element.tagName.toLowerCase()}:nth-child(${index})`;
      }
    }

    return element.tagName.toLowerCase();
  };

  const setupIframeInspection = () => {
    if (!iframeRef.current?.contentDocument || !iframeRef.current?.contentWindow) {
      return;
    }

    const iframeDoc = iframeRef.current.contentDocument;
    const iframeWindow = iframeRef.current.contentWindow;

    // Inject inspection script into iframe
    const script = iframeDoc.createElement('script');
    script.textContent = `
      window.karolCoreInspector = {
        hoveredElement: null,
        highlightOverlay: null,
        
        init: function() {
          this.createHighlightOverlay();
          this.bindEvents();
        },
        
        createHighlightOverlay: function() {
          if (this.highlightOverlay) return;
          
          this.highlightOverlay = document.createElement('div');
          this.highlightOverlay.style.cssText = \`
            position: absolute;
            background: rgba(0, 255, 255, 0.2);
            border: 2px solid #00ffff;
            pointer-events: none;
            z-index: 999999;
            transition: all 0.1s ease;
            display: none;
          \`;
          document.body.appendChild(this.highlightOverlay);
        },
        
        highlightElement: function(element) {
          if (!element || !this.highlightOverlay) return;
          
          const rect = element.getBoundingClientRect();
          this.highlightOverlay.style.cssText += \`
            display: block;
            left: \${rect.left + window.scrollX}px;
            top: \${rect.top + window.scrollY}px;
            width: \${rect.width}px;
            height: \${rect.height}px;
          \`;
        },
        
        hideHighlight: function() {
          if (this.highlightOverlay) {
            this.highlightOverlay.style.display = 'none';
          }
        },
        
        bindEvents: function() {
          document.addEventListener('mousemove', (e) => {
            if (!window.karolCoreInspectorActive) return;
            
            const element = document.elementFromPoint(e.clientX, e.clientY);
            if (element && element !== document.body && element !== document.documentElement) {
              this.hoveredElement = element;
              this.highlightElement(element);
              
              // Send data to parent window
              window.parent.postMessage({
                type: 'karol-core-element-hover',
                data: {
                  selector: this.generateSelector(element),
                  tag: element.tagName.toLowerCase(),
                  text: element.textContent?.trim().substring(0, 100) || '',
                  attributes: Array.from(element.attributes).reduce((acc, attr) => {
                    acc[attr.name] = attr.value;
                    return acc;
                  }, {})
                }
              }, '*');
            }
          });
          
          document.addEventListener('click', (e) => {
            if (!window.karolCoreInspectorActive) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            const element = document.elementFromPoint(e.clientX, e.clientY);
            if (element && element !== document.body && element !== document.documentElement) {
              window.parent.postMessage({
                type: 'karol-core-element-select',
                data: {
                  selector: this.generateSelector(element),
                  tag: element.tagName.toLowerCase(),
                  text: element.textContent?.trim().substring(0, 100) || '',
                  attributes: Array.from(element.attributes).reduce((acc, attr) => {
                    acc[attr.name] = attr.value;
                    return acc;
                  }, {})
                }
              }, '*');
            }
          });
        },
        
        generateSelector: function(element) {
          if (element.id) return '#' + element.id;
          
          if (element.className && typeof element.className === 'string') {
            const classes = element.className.split(' ').filter(Boolean);
            if (classes.length > 0) {
              const meaningfulClass = classes.find(cls => 
                !cls.startsWith('text-') && 
                !cls.startsWith('bg-') && 
                !cls.startsWith('p-') && 
                !cls.startsWith('m-')
              ) || classes[0];
              return '.' + meaningfulClass;
            }
          }
          
          const dataAttrs = Array.from(element.attributes).find(attr => 
            attr.name.startsWith('data-')
          );
          if (dataAttrs) {
            return \`[\${dataAttrs.name}="\${dataAttrs.value}"]\`;
          }
          
          return element.tagName.toLowerCase();
        }
      };
      
      window.karolCoreInspector.init();
    `;
    
    iframeDoc.head.appendChild(script);
    setIframeReady(true);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'karol-core-element-hover') {
        setHoveredElement(event.data.data);
      } else if (event.data.type === 'karol-core-element-select') {
        addSelectedElement(event.data.data);
        toast.success('Element selected');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [addSelectedElement]);

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const handleLoad = () => {
      setTimeout(setupIframeInspection, 100);
    };

    iframe.addEventListener('load', handleLoad);
    
    // Setup on initial load if already loaded
    if (iframe.contentDocument?.readyState === 'complete') {
      handleLoad();
    }

    return () => iframe.removeEventListener('load', handleLoad);
  }, []);

  useEffect(() => {
    if (iframeRef.current?.contentWindow && iframeReady) {
      iframeRef.current.contentWindow.karolCoreInspectorActive = visualInspectMode;
      
      if (!visualInspectMode && iframeRef.current.contentWindow.karolCoreInspector) {
        iframeRef.current.contentWindow.karolCoreInspector.hideHighlight();
      }
    }
  }, [visualInspectMode, iframeReady]);

  const copySelector = (selector: string) => {
    navigator.clipboard.writeText(selector);
    toast.success('Selector copied to clipboard');
  };

  const createQuickTemplate = () => {
    if (selectedElements.length === 0) return;

    const template = {
      id: `template_${Date.now()}`,
      name: `Quick Template ${new Date().toLocaleTimeString()}`,
      description: 'Created from visual inspector',
      category: 'data-extraction',
      domains: [],
      selectors: {
        container: selectedElements[0].selector,
        item: selectedElements[0].selector,
        fields: selectedElements.reduce((acc, el, idx) => {
          acc[el.tag || `field_${idx}`] = el.selector;
          return acc;
        }, {} as Record<string, string>)
      },
      preprocessing: [],
      postprocessing: [],
      isActive: true
    };

    useGlobalStore.getState().addTemplate(template);
    clearSelectedElements();
    setVisualInspectMode(false);
    
    // Switch to template gallery
    useGlobalStore.getState().setActiveDataTab('template-gallery');
    useGlobalStore.getState().setMenuLevel(2);
    
    toast.success('Template created and saved');
  };

  if (!visualInspectMode) return null;

  return (
    <>
      {/* Control Panel */}
      <div className="fixed top-20 right-4 z-50 bg-slate-800/95 backdrop-blur-sm border border-cyan-500/50 rounded-lg p-4 min-w-80 max-w-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-cyan-400 animate-pulse" />
            <span className="text-white font-medium">Enhanced Visual Inspector</span>
          </div>
          <Button 
            onClick={() => setVisualInspectMode(false)} 
            variant="ghost" 
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {hoveredElement && (
          <div className="space-y-2 mb-4">
            <div className="text-sm text-slate-300">
              <strong>Hovered Element:</strong>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="flex items-center justify-between mb-2">
                <code className="text-cyan-400 text-sm">{hoveredElement.selector}</code>
                <Button
                  onClick={() => copySelector(hoveredElement.selector)}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-slate-400 text-xs">
                <div><strong>Tag:</strong> {hoveredElement.tag}</div>
                <div><strong>Text:</strong> {hoveredElement.text}</div>
                {Object.keys(hoveredElement.attributes).length > 0 && (
                  <div className="mt-1">
                    <strong>Attributes:</strong>
                    <div className="ml-2">
                      {Object.entries(hoveredElement.attributes).slice(0, 3).map(([key, value]) => (
                        <div key={key}>{key}: {String(value).substring(0, 30)}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedElements.length > 0 && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-300">
                <strong>Selected Elements ({selectedElements.length}):</strong>
              </div>
              <Button
                onClick={createQuickTemplate}
                variant="outline"
                size="sm"
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                <Save className="h-3 w-3 mr-1" />
                Save Template
              </Button>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {selectedElements.map((element, index) => (
                <div key={index} className="bg-green-500/20 p-2 rounded text-xs">
                  <div className="flex items-center justify-between">
                    <code className="text-green-400">{element.selector}</code>
                    <Button
                      onClick={() => copySelector(element.selector)}
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                    >
                      <Copy className="h-2 w-2" />
                    </Button>
                  </div>
                  <div className="text-slate-400">{element.tag} • {element.text}</div>
                </div>
              ))}
            </div>
            <Button 
              onClick={clearSelectedElements} 
              variant="outline" 
              size="sm" 
              className="w-full border-slate-600"
            >
              Clear All
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <div className="text-xs text-slate-400">
            <div>• Hover over elements to inspect</div>
            <div>• Click to select elements</div>
            <div>• Use <code className="bg-slate-700 px-1 rounded">Alt+V</code> to toggle</div>
            <div>• Use <code className="bg-slate-700 px-1 rounded">Escape</code> to exit</div>
          </div>
          
          <div className="flex items-center space-x-1 pt-2 border-t border-slate-700">
            <Badge variant="outline" className="text-xs">
              Ready for inspection
            </Badge>
            {iframeReady && (
              <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400">
                Iframe Connected
              </Badge>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EnhancedVisualElementInspector;
