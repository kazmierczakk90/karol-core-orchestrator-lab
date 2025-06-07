
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Target, Link2, Save, X, Eye, EyeOff } from 'lucide-react';
import { useKeyMapping } from '@/hooks/useKeyMapping';
import { toast } from '@/components/ui/sonner';

const VisualKeyMappingEditor = () => {
  const {
    isEditMode,
    selectedElement,
    targetLocation,
    enterEditMode,
    exitEditMode,
    selectElement,
    selectTarget,
    completeMappingCreation,
    mappings
  } = useKeyMapping();

  const [keyBinding, setKeyBinding] = useState('');
  const [actionType, setActionType] = useState('');
  const [showMappings, setShowMappings] = useState(false);

  const actions = [
    'navigate', 'trigger', 'toggle', 'focus', 'submit', 'cancel', 'open', 'close'
  ];

  const handleElementClick = (elementId: string, event: React.MouseEvent) => {
    if (!isEditMode) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    if (!selectedElement) {
      selectElement(elementId);
      toast.info(`Source element selected: ${elementId}`);
    } else if (!targetLocation) {
      selectTarget(elementId);
      toast.info(`Target element selected: ${elementId}`);
    }
  };

  const handleCreateMapping = () => {
    if (keyBinding && actionType && selectedElement && targetLocation) {
      completeMappingCreation(keyBinding, actionType);
      setKeyBinding('');
      setActionType('');
      toast.success('Key mapping created successfully!');
    } else {
      toast.error('Please fill in all fields and select source and target elements');
    }
  };

  const clearSelection = () => {
    selectElement('');
    selectTarget('');
    setKeyBinding('');
    setActionType('');
  };

  // Sample UI elements that can be mapped
  const uiElements = [
    { id: 'header-nav', label: 'Header Navigation', type: 'navigation' },
    { id: 'sidebar-menu', label: 'Sidebar Menu', type: 'menu' },
    { id: 'main-content', label: 'Main Content Area', type: 'content' },
    { id: 'search-bar', label: 'Search Bar', type: 'input' },
    { id: 'user-profile', label: 'User Profile', type: 'button' },
    { id: 'settings-panel', label: 'Settings Panel', type: 'panel' },
    { id: 'notification-bell', label: 'Notifications', type: 'button' },
    { id: 'create-button', label: 'Create New', type: 'button' }
  ];

  return (
    <div className="space-y-6">
      {/* Mode Control */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Visual Key Mapping Editor</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowMappings(!showMappings)}
                variant="outline"
                className="border-slate-600"
              >
                {showMappings ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showMappings ? 'Hide' : 'Show'} Mappings
              </Button>
              <Button
                onClick={isEditMode ? exitEditMode : enterEditMode}
                className={isEditMode ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}
              >
                {isEditMode ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Exit Edit Mode
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Enter Edit Mode
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {isEditMode && (
          <CardContent>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
              <h3 className="text-blue-400 font-semibold mb-2">Visual Mapping Mode Active</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-300 mb-2">1. Select source element:</p>
                  {selectedElement ? (
                    <Badge className="bg-green-500/20 text-green-400">
                      Source: {selectedElement}
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-600/50 text-slate-300">
                      Click any element below
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-300 mb-2">2. Select target element:</p>
                  {targetLocation ? (
                    <Badge className="bg-blue-500/20 text-blue-400">
                      Target: {targetLocation}
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-600/50 text-slate-300">
                      Click target element
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Mapping Configuration */}
            {selectedElement && targetLocation && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="keyBinding" className="text-slate-300">Key Combination</Label>
                  <Input
                    id="keyBinding"
                    value={keyBinding}
                    onChange={(e) => setKeyBinding(e.target.value)}
                    placeholder="e.g., Ctrl+K, Alt+S"
                    className="bg-slate-900/50 border-slate-700/50 text-white mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="actionType" className="text-slate-300">Action</Label>
                  <Select value={actionType} onValueChange={setActionType}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white mt-1">
                      <SelectValue placeholder="Select action..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {actions.map((action) => (
                        <SelectItem key={action} value={action}>
                          {action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end space-x-2">
                  <Button
                    onClick={handleCreateMapping}
                    className="bg-gradient-primary hover:bg-gradient-secondary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Create
                  </Button>
                  <Button
                    onClick={clearSelection}
                    variant="outline"
                    className="border-slate-600"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* UI Elements Grid for Mapping */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-cyan-400">UI Elements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uiElements.map((element) => {
              const isSource = selectedElement === element.id;
              const isTarget = targetLocation === element.id;
              const hasMapping = mappings.some(m => m.target === element.id);
              
              return (
                <div
                  key={element.id}
                  onClick={(e) => handleElementClick(element.id, e)}
                  className={`
                    p-4 rounded-lg border transition-all cursor-pointer
                    ${isSource ? 'bg-green-500/20 border-green-400' : 
                      isTarget ? 'bg-blue-500/20 border-blue-400' :
                      hasMapping && showMappings ? 'bg-purple-500/20 border-purple-400' :
                      'bg-slate-900/50 border-slate-700/50 hover:border-cyan-400/50'
                    }
                    ${isEditMode ? 'cursor-pointer' : 'cursor-default'}
                  `}
                >
                  <div className="text-center">
                    <div className="text-white font-medium mb-1">{element.label}</div>
                    <Badge className="bg-slate-600/50 text-slate-300 text-xs">
                      {element.type}
                    </Badge>
                    {hasMapping && showMappings && (
                      <div className="mt-2">
                        <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                          <Link2 className="h-3 w-3 mr-1" />
                          Mapped
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Mappings Overview */}
      {showMappings && mappings.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-cyan-400">Active Key Mappings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mappings.map((mapping) => (
                <div
                  key={mapping.id}
                  className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-cyan-500/20 text-cyan-400 font-mono">
                      {mapping.key}
                    </Badge>
                    <span className="text-slate-300">→</span>
                    <span className="text-white">{mapping.target}</span>
                    <Badge className="bg-slate-600/50 text-slate-300 text-xs">
                      {mapping.action}
                    </Badge>
                  </div>
                  <Badge className={mapping.enabled ? 
                    "bg-green-500/20 text-green-400" : 
                    "bg-red-500/20 text-red-400"
                  }>
                    {mapping.enabled ? 'Active' : 'Disabled'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VisualKeyMappingEditor;
