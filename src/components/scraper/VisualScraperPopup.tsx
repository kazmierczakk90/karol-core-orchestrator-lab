
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, Save, X, Target, Play, Code, Plus, Trash2 
} from 'lucide-react';
import { ExtractionTemplate } from '@/types/smartExtractor';

interface SelectedElement {
  selector: string;
  tag: string;
  text: string;
  attributes: Record<string, string>;
}

interface VisualScraperPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: ExtractionTemplate) => void;
  onExecute: (template: ExtractionTemplate) => void;
  currentUrl: string;
  selectedElements: SelectedElement[];
  onRequestVisualSelect: () => void;
}

const VisualScraperPopup = ({
  isOpen,
  onClose,
  onSave,
  onExecute,
  currentUrl,
  selectedElements,
  onRequestVisualSelect
}: VisualScraperPopupProps) => {
  const [template, setTemplate] = useState<Partial<ExtractionTemplate>>({
    name: '',
    description: '',
    category: 'data-extraction',
    domains: [],
    selectors: {
      container: '',
      item: '',
      fields: {}
    },
    isActive: true
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (selectedElements.length > 0) {
      // Auto-detect container and item selectors
      const containerSelector = selectedElements[0]?.selector;
      setTemplate(prev => ({
        ...prev,
        selectors: {
          ...prev.selectors!,
          container: containerSelector,
          item: containerSelector
        }
      }));
      setHasUnsavedChanges(true);
    }
  }, [selectedElements]);

  const handleFieldAdd = () => {
    if (selectedElements.length > 0) {
      const element = selectedElements[selectedElements.length - 1];
      const fieldName = element.tag || 'field';
      
      setTemplate(prev => ({
        ...prev,
        selectors: {
          ...prev.selectors!,
          fields: {
            ...prev.selectors?.fields,
            [fieldName]: element.selector
          }
        }
      }));
      setHasUnsavedChanges(true);
    }
  };

  const handleSave = () => {
    if (!template.name) {
      alert('Please enter a template name');
      return;
    }

    const fullTemplate: ExtractionTemplate = {
      id: `template_${Date.now()}`,
      name: template.name,
      description: template.description || '',
      category: template.category || 'data-extraction',
      domains: [new URL(currentUrl).hostname],
      selectors: template.selectors || { container: '', item: '', fields: {} },
      preprocessing: [],
      postprocessing: [],
      isActive: true
    };

    onSave(fullTemplate);
    setHasUnsavedChanges(false);
    onClose();
  };

  const handleExecute = () => {
    const fullTemplate: ExtractionTemplate = {
      id: `template_temp_${Date.now()}`,
      name: template.name || 'Test Template',
      description: template.description || '',
      category: template.category || 'data-extraction',
      domains: [new URL(currentUrl).hostname],
      selectors: template.selectors || { container: '', item: '', fields: {} },
      preprocessing: [],
      postprocessing: [],
      isActive: true
    };

    onExecute(fullTemplate);
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="bg-slate-800 border-cyan-500/50 max-w-2xl w-full max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>Visual Scraper Builder</span>
            </CardTitle>
            <Button onClick={handleClose} variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Template Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="template-name">Template Name *</Label>
              <Input
                id="template-name"
                value={template.name || ''}
                onChange={(e) => {
                  setTemplate(prev => ({ ...prev, name: e.target.value }));
                  setHasUnsavedChanges(true);
                }}
                placeholder="E.g., Product Listings"
                className="bg-slate-700 border-slate-600"
              />
            </div>
            
            <div>
              <Label>Target URL</Label>
              <Input
                value={currentUrl}
                disabled
                className="bg-slate-700/50 border-slate-600 text-slate-400"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={template.description || ''}
              onChange={(e) => {
                setTemplate(prev => ({ ...prev, description: e.target.value }));
                setHasUnsavedChanges(true);
              }}
              placeholder="Describe what this template extracts..."
              className="bg-slate-700 border-slate-600"
            />
          </div>

          {/* Selected Elements */}
          {selectedElements.length > 0 && (
            <div>
              <Label>Selected Elements ({selectedElements.length})</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedElements.map((element, index) => (
                  <div key={index} className="bg-slate-700/50 p-2 rounded flex items-center justify-between">
                    <div>
                      <code className="text-cyan-400 text-sm">{element.selector}</code>
                      <div className="text-xs text-slate-400">{element.tag} • {element.text}</div>
                    </div>
                    <Button 
                      onClick={handleFieldAdd}
                      size="sm" 
                      variant="outline"
                      className="border-green-500/50 text-green-400"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selectors */}
          <div className="space-y-3">
            <div>
              <Label>Container Selector</Label>
              <div className="flex space-x-2">
                <Input
                  value={template.selectors?.container || ''}
                  onChange={(e) => {
                    setTemplate(prev => ({
                      ...prev,
                      selectors: { ...prev.selectors!, container: e.target.value }
                    }));
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="e.g., .product-list"
                  className="bg-slate-700 border-slate-600"
                />
                <Button 
                  onClick={onRequestVisualSelect}
                  variant="outline" 
                  size="sm"
                  className="border-cyan-500/50 text-cyan-400"
                >
                  <Target className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Item Selector</Label>
              <div className="flex space-x-2">
                <Input
                  value={template.selectors?.item || ''}
                  onChange={(e) => {
                    setTemplate(prev => ({
                      ...prev,
                      selectors: { ...prev.selectors!, item: e.target.value }
                    }));
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="e.g., .product-item"
                  className="bg-slate-700 border-slate-600"
                />
                <Button 
                  onClick={onRequestVisualSelect}
                  variant="outline" 
                  size="sm"
                  className="border-cyan-500/50 text-cyan-400"
                >
                  <Target className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Field Selectors */}
          <div>
            <Label>Field Selectors</Label>
            <div className="space-y-2">
              {Object.entries(template.selectors?.fields || {}).map(([field, selector]) => (
                <div key={field} className="flex items-center space-x-2">
                  <Input
                    value={field}
                    className="bg-slate-700 border-slate-600 w-32"
                    disabled
                  />
                  <Input
                    value={selector}
                    className="bg-slate-700 border-slate-600 flex-1"
                    disabled
                  />
                  <Button 
                    onClick={() => {
                      const { [field]: removed, ...remainingFields } = template.selectors?.fields || {};
                      setTemplate(prev => ({
                        ...prev,
                        selectors: { ...prev.selectors!, fields: remainingFields }
                      }));
                      setHasUnsavedChanges(true);
                    }}
                    variant="ghost" 
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-4">
            <Button 
              onClick={handleExecute}
              className="bg-gradient-primary flex-1"
              disabled={!template.selectors?.container}
            >
              <Play className="h-4 w-4 mr-2" />
              Test Execute
            </Button>
            
            <Button 
              onClick={handleSave}
              variant="outline"
              className="border-green-500/50 text-green-400"
              disabled={!template.name}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </div>

          {hasUnsavedChanges && (
            <div className="text-xs text-yellow-400 text-center">
              * You have unsaved changes
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualScraperPopup;
