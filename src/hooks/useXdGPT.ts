
import { useState, useCallback } from 'react';
import { xdgptService } from '@/services/xdgptService';
import type { XdGPTModel, XdGPTFile, XdGPTMacro, ModelComparison } from '@/types/xdgpt';
import { toast } from 'sonner';

export const useXdGPT = () => {
  const [models, setModels] = useState<XdGPTModel[]>([]);
  const [files, setFiles] = useState<XdGPTFile[]>([]);
  const [macros, setMacros] = useState<XdGPTMacro[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [lastComparison, setLastComparison] = useState<ModelComparison | null>(null);

  const loadModels = useCallback(async () => {
    try {
      const data = await xdgptService.getModels();
      setModels(data);
    } catch (error) {
      console.error('Error loading models:', error);
      toast.error('Error loading models');
    }
  }, []);

  const compareModels = useCallback(async (selectedModels: string[], prompt: string) => {
    setIsComparing(true);
    try {
      const comparison = await xdgptService.compareModels(selectedModels, prompt);
      setLastComparison(comparison);
      toast.success(`Compared ${selectedModels.length} models successfully`);
      return comparison;
    } catch (error) {
      console.error('Error comparing models:', error);
      toast.error('Error comparing models');
      return null;
    } finally {
      setIsComparing(false);
    }
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    try {
      const result = await xdgptService.uploadFile(file);
      if (result) {
        setFiles(prev => [result, ...prev]);
        toast.success('File uploaded successfully');
        return result;
      } else {
        toast.error('Failed to upload file');
        return null;
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file');
      return null;
    }
  }, []);

  const loadFiles = useCallback(async () => {
    try {
      const data = await xdgptService.getFiles();
      setFiles(data);
    } catch (error) {
      console.error('Error loading files:', error);
      toast.error('Error loading files');
    }
  }, []);

  const createMacro = useCallback(async (macro: Partial<XdGPTMacro>) => {
    try {
      const result = await xdgptService.createMacro(macro);
      if (result) {
        setMacros(prev => [result, ...prev]);
        toast.success('Macro created successfully');
        return result;
      } else {
        toast.error('Failed to create macro');
        return null;
      }
    } catch (error) {
      console.error('Error creating macro:', error);
      toast.error('Error creating macro');
      return null;
    }
  }, []);

  const loadMacros = useCallback(async () => {
    try {
      const data = await xdgptService.getMacros();
      setMacros(data);
    } catch (error) {
      console.error('Error loading macros:', error);
      toast.error('Error loading macros');
    }
  }, []);

  const executeMacro = useCallback(async (macroId: string, parameters: any = {}) => {
    try {
      const result = await xdgptService.executeMacro(macroId, parameters);
      toast.success('Macro executed successfully');
      return result;
    } catch (error) {
      console.error('Error executing macro:', error);
      toast.error('Error executing macro');
      return null;
    }
  }, []);

  return {
    models,
    files,
    macros,
    isComparing,
    lastComparison,
    loadModels,
    compareModels,
    uploadFile,
    loadFiles,
    createMacro,
    loadMacros,
    executeMacro
  };
};
