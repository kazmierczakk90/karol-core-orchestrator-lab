
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Type, 
  Layout, 
  Spacing, 
  Monitor,
  Settings,
  Save,
  X,
  RotateCcw
} from 'lucide-react';

interface ElementStyle {
  width?: string;
  height?: string;
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
}

interface ElementProperties {
  id: string;
  type: 'header' | 'content' | 'card' | 'timeline' | 'table' | 'navigation';
  title?: string;
  content?: string;
  style?: ElementStyle;
  columnSpan?: number;
  isVisible?: boolean;
}

interface ElementEditorProps {
  element?: ElementProperties;
  isOpen: boolean;
  onClose: () => void;
  onSave: (element: ElementProperties) => void;
}

const ElementEditor = ({ element, isOpen, onClose, onSave }: ElementEditorProps) => {
  const [editedElement, setEditedElement] = useState<ElementProperties>(
    element || {
      id: '',
      type: 'content',
      title: '',
      content: '',
      style: {},
      columnSpan: 1,
      isVisible: true
    }
  );

  const [activeTab, setActiveTab] = useState('content');

  if (!isOpen) return null;

  const handleStyleChange = (property: keyof ElementStyle, value: string | number) => {
    setEditedElement(prev => ({
      ...prev,
      style: {
        ...prev.style,
        [property]: value
      }
    }));
  };

  const handleSave = () => {
    onSave(editedElement);
    onClose();
  };

  const handleReset = () => {
    setEditedElement(element || {
      id: '',
      type: 'content',
      title: '',
      content: '',
      style: {},
      columnSpan: 1,
      isVisible: true
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-96 bg-slate-800 border-l border-slate-700 shadow-2xl">
        <Card className="h-full bg-slate-800 border-0 rounded-none">
          <CardHeader className="border-b border-slate-700">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Element Editor</span>
              </CardTitle>
              <Button onClick={onClose} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Badge className="w-fit">
              {editedElement.type}
            </Badge>
          </CardHeader>

          <CardContent className="h-full overflow-auto p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-slate-700 m-4">
                <TabsTrigger value="content" className="flex items-center space-x-1">
                  <Type className="h-3 w-3" />
                  <span className="hidden sm:inline">Content</span>
                </TabsTrigger>
                <TabsTrigger value="style" className="flex items-center space-x-1">
                  <Palette className="h-3 w-3" />
                  <span className="hidden sm:inline">Style</span>
                </TabsTrigger>
                <TabsTrigger value="layout" className="flex items-center space-x-1">
                  <Layout className="h-3 w-3" />
                  <span className="hidden sm:inline">Layout</span>
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex items-center space-x-1">
                  <Monitor className="h-3 w-3" />
                  <span className="hidden sm:inline">Advanced</span>
                </TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="p-4 space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editedElement.title || ''}
                    onChange={(e) => setEditedElement(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter title..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Content</Label>
                  <textarea
                    id="content"
                    value={editedElement.content || ''}
                    onChange={(e) => setEditedElement(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md text-white resize-none"
                    rows={6}
                    placeholder="Enter content..."
                  />
                </div>

                <div>
                  <Label htmlFor="type">Element Type</Label>
                  <select
                    id="type"
                    value={editedElement.type}
                    onChange={(e) => setEditedElement(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  >
                    <option value="header">Header</option>
                    <option value="content">Content Block</option>
                    <option value="card">Card</option>
                    <option value="timeline">Timeline</option>
                    <option value="table">Table</option>
                    <option value="navigation">Navigation</option>
                  </select>
                </div>
              </TabsContent>

              {/* Style Tab */}
              <TabsContent value="style" className="p-4 space-y-4">
                <div>
                  <Label>Background Color</Label>
                  <div className="flex space-x-2 mt-2">
                    {['transparent', '#1e293b', '#0f172a', '#374151', '#059669', '#dc2626', '#7c3aed'].map(color => (
                      <button
                        key={color}
                        onClick={() => handleStyleChange('backgroundColor', color)}
                        className="w-8 h-8 rounded-md border-2 border-slate-600"
                        style={{ backgroundColor: color === 'transparent' ? 'transparent' : color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Text Color</Label>
                  <div className="flex space-x-2 mt-2">
                    {['#ffffff', '#e2e8f0', '#94a3b8', '#64748b', '#ef4444', '#22c55e', '#3b82f6'].map(color => (
                      <button
                        key={color}
                        onClick={() => handleStyleChange('color', color)}
                        className="w-8 h-8 rounded-md border-2 border-slate-600"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Font Size</Label>
                  <div className="flex space-x-2 mt-2">
                    {['12px', '14px', '16px', '18px', '20px', '24px', '32px'].map(size => (
                      <Button
                        key={size}
                        onClick={() => handleStyleChange('fontSize', size)}
                        variant="outline"
                        size="sm"
                        className={editedElement.style?.fontSize === size ? 'bg-cyan-500' : ''}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Border Radius</Label>
                  <Slider
                    value={[parseInt(editedElement.style?.borderRadius || '0')]}
                    onValueChange={([value]) => handleStyleChange('borderRadius', `${value}px`)}
                    max={20}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </TabsContent>

              {/* Layout Tab */}
              <TabsContent value="layout" className="p-4 space-y-4">
                <div>
                  <Label>Column Span (Grid width)</Label>
                  <div className="flex space-x-2 mt-2">
                    {[1, 2, 3, 4, 6, 12].map(span => (
                      <Button
                        key={span}
                        onClick={() => setEditedElement(prev => ({ ...prev, columnSpan: span }))}
                        variant="outline"
                        size="sm"
                        className={editedElement.columnSpan === span ? 'bg-cyan-500' : ''}
                      >
                        {span}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Padding</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['0', '4px', '8px', '16px', '24px', '32px'].map(padding => (
                      <Button
                        key={padding}
                        onClick={() => handleStyleChange('padding', padding)}
                        variant="outline"
                        size="sm"
                        className={editedElement.style?.padding === padding ? 'bg-cyan-500' : ''}
                      >
                        {padding}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Margin</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['0', '4px', '8px', '16px', '24px', '32px'].map(margin => (
                      <Button
                        key={margin}
                        onClick={() => handleStyleChange('margin', margin)}
                        variant="outline"
                        size="sm"
                        className={editedElement.style?.margin === margin ? 'bg-cyan-500' : ''}
                      >
                        {margin}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Visibility</Label>
                  <Button
                    onClick={() => setEditedElement(prev => ({ ...prev, isVisible: !prev.isVisible }))}
                    variant={editedElement.isVisible ? "default" : "outline"}
                    size="sm"
                  >
                    {editedElement.isVisible ? 'Visible' : 'Hidden'}
                  </Button>
                </div>

                <div>
                  <Label htmlFor="custom-css">Custom CSS Classes</Label>
                  <Input
                    id="custom-css"
                    placeholder="bg-gradient-to-r from-blue-500..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Element ID</Label>
                  <Input
                    value={editedElement.id}
                    onChange={(e) => setEditedElement(prev => ({ ...prev, id: e.target.value }))}
                    placeholder="unique-element-id"
                    className="mt-2"
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-800 border-t border-slate-700">
              <div className="flex space-x-2">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={handleReset} variant="outline">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button onClick={onClose} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ElementEditor;
