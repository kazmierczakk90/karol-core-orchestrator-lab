import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Keyboard, Edit, Target, Link, Save, Download, Upload, Trash2, Play, Pause } from 'lucide-react';
import { useKeyMapping } from '@/hooks/useKeyMapping';
import { toast } from '@/components/ui/sonner';

const KeyMappingEditor = () => {
  const {
    mappings,
    groups,
    isEditMode,
    selectedElement,
    targetLocation,
    addMapping,
    removeMapping,
    toggleMapping,
    createGroup,
    toggleGroup,
    enterEditMode,
    exitEditMode,
    selectElement,
    selectTarget,
    completeMappingCreation,
    getActiveMappings,
    exportConfig,
    importConfig
  } = useKeyMapping();

  const [newMappingKey, setNewMappingKey] = useState('');
  const [newMappingAction, setNewMappingAction] = useState('');
  const [groupName, setGroupName] = useState('');
  const [selectedMappingsForGroup, setSelectedMappingsForGroup] = useState<string[]>([]);

  const actions = [
    'navigate',
    'trigger',
    'toggle',
    'focus',
    'submit',
    'cancel',
    'open',
    'close'
  ];

  const handleCreateMapping = () => {
    if (newMappingKey && newMappingAction && selectedElement && targetLocation) {
      completeMappingCreation(newMappingKey, newMappingAction);
      setNewMappingKey('');
      setNewMappingAction('');
      toast.success('Key mapping created successfully!');
    }
  };

  const handleCreateGroup = () => {
    if (groupName && selectedMappingsForGroup.length >= 2) {
      createGroup(groupName, selectedMappingsForGroup, 'global');
      setGroupName('');
      setSelectedMappingsForGroup([]);
      toast.success('Mapping group created successfully!');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importConfig(file);
      toast.success('Configuration imported successfully!');
    }
  };

  const toggleMappingSelection = (mappingId: string) => {
    setSelectedMappingsForGroup(prev =>
      prev.includes(mappingId)
        ? prev.filter(id => id !== mappingId)
        : [...prev, mappingId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Keyboard className="h-5 w-5" />
              <span>Key Mapping Editor</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                onClick={isEditMode ? exitEditMode : enterEditMode}
                className={isEditMode ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}
              >
                {isEditMode ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Exit Edit Mode
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Enter Edit Mode
                  </>
                )}
              </Button>
              
              <Button onClick={exportConfig} variant="outline" className="border-slate-600">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button variant="outline" className="border-slate-600" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </CardHeader>
        
        {isEditMode && (
          <CardContent>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-blue-400 font-semibold mb-2">Edit Mode Active</h3>
              <div className="space-y-2 text-sm text-slate-300">
                <p>1. Click on an element to select it as the source</p>
                <p>2. Click on another element to select it as the target</p>
                <p>3. Configure the key and action, then save</p>
                {selectedElement && (
                  <Badge className="bg-green-500/20 text-green-400">
                    Source: {selectedElement}
                  </Badge>
                )}
                {targetLocation && (
                  <Badge className="bg-blue-500/20 text-blue-400">
                    Target: {targetLocation}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create New Mapping */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-cyan-400">Create New Mapping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="newKey" className="text-slate-300">
                Key Combination
              </Label>
              <Input
                id="newKey"
                value={newMappingKey}
                onChange={(e) => setNewMappingKey(e.target.value)}
                placeholder="e.g., Ctrl+K, Alt+T"
                className="bg-slate-900/50 border-slate-700/50 text-white mt-1"
              />
            </div>

            <div>
              <Label htmlFor="newAction" className="text-slate-300">
                Action
              </Label>
              <Select value={newMappingAction} onValueChange={setNewMappingAction}>
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

            <Button
              onClick={handleCreateMapping}
              disabled={!newMappingKey || !newMappingAction || !selectedElement || !targetLocation}
              className="w-full bg-gradient-primary hover:bg-gradient-secondary"
            >
              <Save className="h-4 w-4 mr-2" />
              Create Mapping
            </Button>
          </CardContent>
        </Card>

        {/* Create Group */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-cyan-400">Create Mapping Group</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="groupName" className="text-slate-300">
                Group Name
              </Label>
              <Input
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., Navigation Keys"
                className="bg-slate-900/50 border-slate-700/50 text-white mt-1"
              />
            </div>

            <div>
              <Label className="text-slate-300">
                Select Mappings ({selectedMappingsForGroup.length} selected)
              </Label>
              <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                {mappings.map((mapping) => (
                  <div
                    key={mapping.id}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      selectedMappingsForGroup.includes(mapping.id)
                        ? 'bg-cyan-500/20 border border-cyan-400'
                        : 'bg-slate-900/50 border border-slate-700/50'
                    }`}
                    onClick={() => toggleMappingSelection(mapping.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">{mapping.key}</span>
                      <Badge className="bg-slate-600/50 text-slate-300 text-xs">
                        {mapping.action}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleCreateGroup}
              disabled={!groupName || selectedMappingsForGroup.length < 2}
              className="w-full bg-gradient-success hover:bg-gradient-secondary"
            >
              <Link className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Existing Mappings */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-cyan-400">Existing Key Mappings</CardTitle>
        </CardHeader>
        <CardContent>
          {mappings.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Keyboard className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No key mappings configured</p>
              <p className="text-sm">Create your first mapping using edit mode</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mappings.map((mapping) => (
                <div
                  key={mapping.id}
                  className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50"
                >
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-cyan-500/20 text-cyan-400 font-mono">
                      {mapping.key}
                    </Badge>
                    <div>
                      <span className="text-white text-sm">{mapping.target}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className="bg-slate-600/50 text-slate-300 text-xs">
                          {mapping.action}
                        </Badge>
                        {mapping.context && (
                          <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                            {mapping.context}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => toggleMapping(mapping.id)}
                      className={mapping.enabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}
                    >
                      {mapping.enabled ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-400"
                      onClick={() => removeMapping(mapping.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Groups */}
      {groups.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-cyan-400">Mapping Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold">{group.name}</h3>
                    <Button
                      size="sm"
                      onClick={() => toggleGroup(group.id)}
                      className="bg-gradient-primary hover:bg-gradient-secondary"
                    >
                      Toggle Group
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.mappings.map((mapping) => (
                      <Badge
                        key={mapping.id}
                        className={mapping.enabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}
                      >
                        {mapping.key}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KeyMappingEditor;
