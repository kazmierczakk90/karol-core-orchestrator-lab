
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, X, Code, Eye } from 'lucide-react';

interface SelectedElement {
  selector: string;
  tag: string;
  text: string;
  attributes: Record<string, string>;
}

interface VisualElementInspectorProps {
  isActive: boolean;
  onToggle: () => void;
  onElementSelected: (element: SelectedElement) => void;
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

const VisualElementInspector = ({
  isActive,
  onToggle,
  onElementSelected,
  iframeRef
}: VisualElementInspectorProps) => {
  const [hoveredElement, setHoveredElement] = useState<SelectedElement | null>(null);
  const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  const generateOptimalSelector = (element: Element): string => {
    // Priority: id > class > data attributes > tag hierarchy
    if (element.id) {
      return `#${element.id}`;
    }

    if (element.className) {
      const classes = element.className.split(' ').filter(Boolean);
      if (classes.length > 0) {
        return `.${classes[0]}`;
      }
    }

    // Data attributes
    const dataAttrs = Array.from(element.attributes).find(attr => 
      attr.name.startsWith('data-')
    );
    if (dataAttrs) {
      return `[${dataAttrs.name}="${dataAttrs.value}"]`;
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

  const getElementFromPoint = (x: number, y: number): Element | null => {
    if (!iframeRef.current?.contentDocument) return null;

    const iframeRect = iframeRef.current.getBoundingClientRect();
    const relativeX = x - iframeRect.left;
    const relativeY = y - iframeRect.top;

    return iframeRef.current.contentDocument.elementFromPoint(relativeX, relativeY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isActive) return;

    const element = getElementFromPoint(e.clientX, e.clientY);
    if (!element || element === document.body || element === document.documentElement) {
      setHoveredElement(null);
      return;
    }

    const selector = generateOptimalSelector(element);
    const attributes: Record<string, string> = {};
    Array.from(element.attributes).forEach(attr => {
      attributes[attr.name] = attr.value;
    });

    setHoveredElement({
      selector,
      tag: element.tagName.toLowerCase(),
      text: element.textContent?.trim().substring(0, 100) || '',
      attributes
    });
  };

  const handleClick = (e: MouseEvent) => {
    if (!isActive || !hoveredElement) return;
    
    e.preventDefault();
    e.stopPropagation();

    setSelectedElements(prev => [...prev, hoveredElement]);
    onElementSelected(hoveredElement);
  };

  useEffect(() => {
    if (!isActive) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
    };
  }, [isActive, hoveredElement]);

  if (!isActive) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-transparent z-40 pointer-events-none"
      />

      {/* Control Panel */}
      <div className="fixed top-20 right-4 z-50 bg-slate-800/95 backdrop-blur-sm border border-cyan-500/50 rounded-lg p-4 min-w-80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-cyan-400" />
            <span className="text-white font-medium">Visual Inspector</span>
          </div>
          <Button onClick={onToggle} variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {hoveredElement && (
          <div className="space-y-2 mb-4">
            <div className="text-sm text-slate-300">
              <strong>Hovered:</strong>
            </div>
            <div className="bg-slate-700/50 p-2 rounded text-xs">
              <div className="flex items-center space-x-2 mb-1">
                <Code className="h-3 w-3" />
                <code className="text-cyan-400">{hoveredElement.selector}</code>
              </div>
              <div className="text-slate-400">
                {hoveredElement.tag} • {hoveredElement.text}
              </div>
            </div>
          </div>
        )}

        {selectedElements.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-slate-300">
              <strong>Selected Elements ({selectedElements.length}):</strong>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {selectedElements.map((element, index) => (
                <div key={index} className="bg-green-500/20 p-2 rounded text-xs">
                  <code className="text-green-400">{element.selector}</code>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => setSelectedElements([])} 
              variant="outline" 
              size="sm" 
              className="w-full"
            >
              Clear Selection
            </Button>
          </div>
        )}

        <div className="text-xs text-slate-400 mt-3">
          Hover over elements to inspect, click to select
        </div>
      </div>
    </>
  );
};

export default VisualElementInspector;
