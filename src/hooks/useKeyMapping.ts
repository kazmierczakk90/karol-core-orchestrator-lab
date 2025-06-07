
import { useState, useEffect } from 'react';

interface KeyMapping {
  id: string;
  key: string;
  target: string;
  action: string;
  context?: string;
  enabled: boolean;
}

interface KeyMappingGroup {
  id: string;
  name: string;
  mappings: KeyMapping[];
  context: string;
}

export const useKeyMapping = () => {
  const [mappings, setMappings] = useState<KeyMapping[]>([]);
  const [groups, setGroups] = useState<KeyMappingGroup[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [targetLocation, setTargetLocation] = useState<string | null>(null);

  // Load saved mappings from localStorage
  useEffect(() => {
    const savedMappings = localStorage.getItem('keyMappings');
    const savedGroups = localStorage.getItem('keyMappingGroups');
    
    if (savedMappings) {
      setMappings(JSON.parse(savedMappings));
    }
    
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    }
  }, []);

  // Save mappings to localStorage
  const saveMappings = (newMappings: KeyMapping[]) => {
    setMappings(newMappings);
    localStorage.setItem('keyMappings', JSON.stringify(newMappings));
  };

  const saveGroups = (newGroups: KeyMappingGroup[]) => {
    setGroups(newGroups);
    localStorage.setItem('keyMappingGroups', JSON.stringify(newGroups));
  };

  // Add new key mapping
  const addMapping = (key: string, target: string, action: string, context?: string) => {
    const newMapping: KeyMapping = {
      id: `mapping_${Date.now()}`,
      key,
      target,
      action,
      context,
      enabled: true
    };
    
    saveMappings([...mappings, newMapping]);
  };

  // Remove key mapping
  const removeMapping = (id: string) => {
    saveMappings(mappings.filter(m => m.id !== id));
  };

  // Toggle mapping enabled state
  const toggleMapping = (id: string) => {
    saveMappings(mappings.map(m => 
      m.id === id ? { ...m, enabled: !m.enabled } : m
    ));
  };

  // Create group from multiple mappings
  const createGroup = (name: string, mappingIds: string[], context: string) => {
    const groupMappings = mappings.filter(m => mappingIds.includes(m.id));
    const newGroup: KeyMappingGroup = {
      id: `group_${Date.now()}`,
      name,
      mappings: groupMappings,
      context
    };
    
    saveGroups([...groups, newGroup]);
  };

  // Apply group operation (enable/disable all in group)
  const toggleGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    const groupMappingIds = group.mappings.map(m => m.id);
    const allEnabled = group.mappings.every(m => m.enabled);
    
    saveMappings(mappings.map(m => 
      groupMappingIds.includes(m.id) 
        ? { ...m, enabled: !allEnabled }
        : m
    ));
    
    // Update group mappings
    saveGroups(groups.map(g => 
      g.id === groupId 
        ? { ...g, mappings: g.mappings.map(m => ({ ...m, enabled: !allEnabled })) }
        : g
    ));
  };

  // Start edit mode for visual key mapping
  const enterEditMode = () => {
    setIsEditMode(true);
    setSelectedElement(null);
    setTargetLocation(null);
  };

  // Exit edit mode
  const exitEditMode = () => {
    setIsEditMode(false);
    setSelectedElement(null);
    setTargetLocation(null);
  };

  // Select element for mapping
  const selectElement = (elementId: string) => {
    setSelectedElement(elementId);
  };

  // Select target location
  const selectTarget = (targetId: string) => {
    setTargetLocation(targetId);
  };

  // Complete mapping creation
  const completeMappingCreation = (key: string, action: string) => {
    if (selectedElement && targetLocation) {
      addMapping(key, targetLocation, action, selectedElement);
      setSelectedElement(null);
      setTargetLocation(null);
    }
  };

  // Get active mappings for current context
  const getActiveMappings = (context?: string) => {
    return mappings.filter(m => 
      m.enabled && (!context || m.context === context)
    );
  };

  // Export configuration
  const exportConfig = () => {
    const config = {
      mappings,
      groups,
      exportDate: new Date(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'key-mappings-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import configuration
  const importConfig = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        if (config.mappings) saveMappings(config.mappings);
        if (config.groups) saveGroups(config.groups);
      } catch (error) {
        console.error('Error importing config:', error);
      }
    };
    reader.readAsText(file);
  };

  return {
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
  };
};
